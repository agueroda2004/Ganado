import { useMemo, useRef, useState } from "react";
import { AlertTriangle, Plus } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { BottomSheet } from "../../components/ui/BottomSheet";
import { ConfirmSheet } from "../../components/ui/ConfirmSheet";
import { Toast, type ToastMessage } from "../../components/ui/Toast";
import type { Animal, AnimalInput } from "../../domain/animal";
import { codeMatchesFilter, filterDigits } from "../../lib/animal-code";
import { exportAnimals, parseImport } from "../../storage/animals-storage";
import { AnimalCard } from "./AnimalCard";
import { AnimalDetailSheet } from "./AnimalDetailSheet";
import { AnimalFormSheet } from "./AnimalFormSheet";
import { AppHeader } from "./AppHeader";
import { EMPTY_FILTERS, Filters, type AnimalFilters } from "./Filters";
import { StatsPanel } from "./StatsPanel";
import { useAnimals } from "./useAnimals";

interface AnimalsPageProps {
  onLogout: () => void;
}

interface PendingImport {
  animals: Animal[];
  imported: number;
  skipped: number;
}

function mergeAnimals(current: Animal[], incoming: Animal[]): Animal[] {
  const byCodigo = new Map(current.map((animal) => [animal.codigo.toLowerCase(), animal]));
  for (const animal of incoming) {
    const key = animal.codigo.toLowerCase();
    const existing = byCodigo.get(key);
    byCodigo.set(
      key,
      existing ? { ...animal, id: existing.id, createdAt: existing.createdAt } : animal,
    );
  }
  return [...byCodigo.values()];
}

export function AnimalsPage({ onLogout }: AnimalsPageProps) {
  const { animals, add, edit, remove, replaceAll } = useAnimals();

  const [filters, setFilters] = useState<AnimalFilters>(EMPTY_FILTERS);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Animal | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Animal | null>(null);
  const [pendingImport, setPendingImport] = useState<PendingImport | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toastId = useRef(0);

  function notify(text: string, tone: ToastMessage["tone"]) {
    toastId.current += 1;
    setToast({ id: toastId.current, text, tone });
  }

  const socioOptions = useMemo(() => {
    const socios = animals
      .map((animal) => animal.socio.trim())
      .filter((socio) => socio.length > 0);
    return [...new Set(socios)].sort((a, b) => a.localeCompare(b));
  }, [animals]);

  const filtered = useMemo(() => {
    const query = filterDigits(filters.codigo.trim());
    return animals.filter((animal) => {
      if (!codeMatchesFilter(animal.codigo, query)) return false;
      if (filters.socio && animal.socio !== filters.socio) return false;
      if (filters.finca && animal.finca !== filters.finca) return false;
      return true;
    });
  }, [animals, filters]);

  const otherCodigos = useMemo(
    () =>
      animals
        .filter((animal) => animal.id !== editing?.id)
        .map((animal) => animal.codigo),
    [animals, editing],
  );

  // Se busca por id para que el detalle refleje los cambios al editar.
  const detailAnimal = useMemo(
    () => animals.find((animal) => animal.id === detailId) ?? null,
    [animals, detailId],
  );

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(animal: Animal) {
    setDetailId(null);
    setEditing(animal);
    setFormOpen(true);
  }

  function handleSubmit(input: AnimalInput) {
    if (editing) {
      edit(editing.id, input);
      notify("Animal actualizado.", "success");
    } else {
      add(input);
      notify("Animal agregado.", "success");
    }
  }

  function handleExport() {
    if (animals.length === 0) {
      notify("No hay animales para exportar.", "info");
      return;
    }
    exportAnimals(animals);
    notify("Datos exportados.", "success");
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const result = parseImport(text);
      if (result.imported === 0) {
        notify("El archivo no contiene animales válidos.", "danger");
        return;
      }
      setPendingImport(result);
    } catch {
      notify("No se pudo leer el archivo.", "danger");
    }
  }

  function confirmImport(mode: "replace" | "merge") {
    if (!pendingImport) return;
    const next =
      mode === "replace"
        ? pendingImport.animals
        : mergeAnimals(animals, pendingImport.animals);
    replaceAll(next);
    notify(
      `${pendingImport.imported} ${pendingImport.imported === 1 ? "animal importado" : "animales importados"}.`,
      "success",
    );
    setPendingImport(null);
  }

  return (
    <div className="min-h-dvh bg-background pb-28">
      <AppHeader onExport={handleExport} onImport={() => fileInputRef.current?.click()} onLogout={onLogout} />

      <main className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-5">
        <StatsPanel animals={animals} />

        <Filters filters={filters} socioOptions={socioOptions} onChange={setFilters} />

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              Animales
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                {filtered.length} de {animals.length}
              </span>
            </h2>
          </div>

          {animals.length === 0 ? (
            <EmptyState onAdd={openCreate} />
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface/50 px-4 py-12 text-center">
              <p className="text-sm text-muted-foreground">
                Ningún animal coincide con los filtros.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {filtered.map((animal) => (
                <AnimalCard
                  key={animal.id}
                  animal={animal}
                  onSelect={(selected) => setDetailId(selected.id)}
                  onEdit={openEdit}
                  onDelete={setPendingDelete}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <button
        type="button"
        onClick={openCreate}
        aria-label="Agregar animal"
        style={{ bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))" }}
        className="fixed right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform active:scale-95"
      >
        <Plus className="h-6 w-6" />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={handleFileChange}
      />

      <AnimalDetailSheet
        animal={detailAnimal}
        open={detailId !== null}
        onClose={() => setDetailId(null)}
        onEdit={openEdit}
      />

      <AnimalFormSheet
        open={formOpen}
        animal={editing}
        existingCodigos={otherCodigos}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmSheet
        open={pendingDelete !== null}
        title="Eliminar animal"
        description={
          pendingDelete
            ? `Se eliminará el animal con código "${pendingDelete.codigo}". Esta acción no se puede deshacer.`
            : ""
        }
        confirmLabel="Eliminar"
        destructive
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete) return;
          remove(pendingDelete.id);
          notify("Animal eliminado.", "success");
        }}
      />

      <BottomSheet
        open={pendingImport !== null}
        onClose={() => setPendingImport(null)}
        title="Importar datos"
        description="¿Cómo quieres aplicar los datos del archivo?"
      >
        {pendingImport && (
          <div className="flex flex-col gap-4 pb-2">
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-muted/50 p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">
                <p>
                  Se encontraron{" "}
                  <span className="font-semibold text-foreground">
                    {pendingImport.imported}
                  </span>{" "}
                  {pendingImport.imported === 1 ? "animal" : "animales"} listos para importar.
                </p>
                {pendingImport.skipped > 0 && (
                  <p className="mt-1">
                    Se omitirán {pendingImport.skipped}{" "}
                    {pendingImport.skipped === 1 ? "registro inválido" : "registros inválidos"}.
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={() => confirmImport("merge")}>
                Fusionar con los actuales
              </Button>
              <Button variant="outline" onClick={() => confirmImport("replace")}>
                Reemplazar todo
              </Button>
              <Button variant="ghost" onClick={() => setPendingImport(null)}>
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </BottomSheet>

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-14 text-center">
      <p className="text-base font-semibold text-foreground">Aún no hay animales</p>
      <p className="max-w-xs text-sm text-muted-foreground">
        Agrega tu primer animal para empezar a llevar el control.
      </p>
      <Button onClick={onAdd} className="mt-2">
        <Plus className="h-4 w-4" />
        Agregar animal
      </Button>
    </div>
  );
}
