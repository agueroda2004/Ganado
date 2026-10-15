export const GENEROS = ["Hembra", "Macho"] as const;
export type Genero = (typeof GENEROS)[number];

export const ESTADOS = ["Propio", "Medias"] as const;
export type Estado = (typeof ESTADOS)[number];

export const FINCAS = ["Jupa", "San Francisco"] as const;
export type Finca = (typeof FINCAS)[number];

export interface Animal {
  id: string;
  /** Nombre del animal. Opcional. */
  nombre: string;
  genero: Genero;
  raza: string;
  fechaNacimiento: string;
  codigo: string;
  estado: Estado;
  /** Nombre del socio. Solo aplica cuando el estado es "Medias". */
  socio: string;
  finca: Finca;
  /** Notas libres. Opcional. */
  notas: string;
  createdAt: string;
  updatedAt: string;
}

export type AnimalInput = Omit<Animal, "id" | "createdAt" | "updatedAt">;

export function createEmptyAnimalInput(): AnimalInput {
  return {
    nombre: "",
    genero: "Hembra",
    raza: "",
    fechaNacimiento: "",
    codigo: "",
    estado: "Propio",
    socio: "",
    finca: "Jupa",
    notas: "",
  };
}

export function isGenero(value: unknown): value is Genero {
  return typeof value === "string" && (GENEROS as readonly string[]).includes(value);
}

export function isEstado(value: unknown): value is Estado {
  return typeof value === "string" && (ESTADOS as readonly string[]).includes(value);
}

export function isFinca(value: unknown): value is Finca {
  return typeof value === "string" && (FINCAS as readonly string[]).includes(value);
}
