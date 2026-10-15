import { isEstado, isFinca, isGenero, type Animal, type AnimalInput } from "../domain/animal";

const STORAGE_KEY = "ganado:animals";

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeImportItem(raw: unknown): Animal | null {
  if (typeof raw !== "object" || raw === null) return null;
  const item = raw as Record<string, unknown>;

  if (!isGenero(item.genero)) return null;
  if (!isEstado(item.estado)) return null;
  if (!isFinca(item.finca)) return null;

  const codigo = typeof item.codigo === "string" ? item.codigo.trim() : "";
  const raza = typeof item.raza === "string" ? item.raza.trim() : "";
  const nombre = typeof item.nombre === "string" ? item.nombre.trim().slice(0, 40) : "";
  const fechaNacimiento =
    typeof item.fechaNacimiento === "string" ? item.fechaNacimiento : "";

  if (!codigo || !raza || !fechaNacimiento) return null;

  const estado = item.estado;
  const socio = estado === "Medias" && typeof item.socio === "string" ? item.socio.trim() : "";
  if (estado === "Medias" && !socio) return null;

  const now = new Date().toISOString();

  return {
    id: typeof item.id === "string" && item.id ? item.id : makeId(),
    nombre,
    genero: item.genero,
    raza,
    fechaNacimiento,
    codigo,
    estado,
    socio,
    finca: item.finca,
    createdAt: typeof item.createdAt === "string" ? item.createdAt : now,
    updatedAt: typeof item.updatedAt === "string" ? item.updatedAt : now,
  };
}

export function loadAnimals(): Animal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => normalizeImportItem(item))
      .filter((item): item is Animal => item !== null);
  } catch {
    return [];
  }
}

export function saveAnimals(animals: Animal[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(animals));
}

export function createAnimal(animals: Animal[], input: AnimalInput): Animal[] {
  const now = new Date().toISOString();
  const animal: Animal = { ...input, id: makeId(), createdAt: now, updatedAt: now };
  const next = [animal, ...animals];
  saveAnimals(next);
  return next;
}

export function updateAnimal(animals: Animal[], id: string, input: AnimalInput): Animal[] {
  const next = animals.map((animal) =>
    animal.id === id ? { ...animal, ...input, updatedAt: new Date().toISOString() } : animal,
  );
  saveAnimals(next);
  return next;
}

export function deleteAnimal(animals: Animal[], id: string): Animal[] {
  const next = animals.filter((animal) => animal.id !== id);
  saveAnimals(next);
  return next;
}

export interface ImportResult {
  animals: Animal[];
  imported: number;
  skipped: number;
}

export function parseImport(json: string): ImportResult {
  const parsed = JSON.parse(json);
  const list = Array.isArray(parsed)
    ? parsed
    : Array.isArray((parsed as { animals?: unknown }).animals)
      ? (parsed as { animals: unknown[] }).animals
      : null;

  if (!list) {
    throw new Error("El archivo no tiene un formato válido.");
  }

  const animals: Animal[] = [];
  let skipped = 0;

  for (const item of list) {
    const normalized = normalizeImportItem(item);
    if (normalized) {
      animals.push(normalized);
    } else {
      skipped += 1;
    }
  }

  return { animals, imported: animals.length, skipped };
}

export function exportAnimals(animals: Animal[]): void {
  const payload = {
    app: "Ganado",
    version: 1,
    exportedAt: new Date().toISOString(),
    animals,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `ganado-${date}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
