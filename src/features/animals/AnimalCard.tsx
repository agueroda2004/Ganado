import { AlertTriangle, Calendar, MapPin, MessageSquare, Pencil, Trash2, User } from "lucide-react";
import { cn } from "../../lib/utils";
import { isCompleteAnimalCode } from "../../lib/animal-code";
import type { Animal } from "../../domain/animal";
import { Aretel } from "./Aretel";
import { calculateAge, formatDate } from "./animal-utils";

interface AnimalCardProps {
  animal: Animal;
  /** Tocar la tarjeta abre el detalle. */
  onSelect: (animal: Animal) => void;
  /** El botón con lápiz abre el formulario de edición. */
  onEdit: (animal: Animal) => void;
  onDelete: (animal: Animal) => void;
}

export function AnimalCard({ animal, onSelect, onEdit, onDelete }: AnimalCardProps) {
  const isMedias = animal.estado === "Medias";
  const hasNombre = animal.nombre.trim().length > 0;

  return (
    <div
      onClick={() => onSelect(animal)}
      className="animate-fade-in flex cursor-pointer items-stretch gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm transition-colors active:bg-muted/60"
    >
      <div className="flex flex-col items-center justify-center">
        <Aretel codigo={animal.codigo} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {hasNombre ? (
              <>
                <p className="truncate text-base font-semibold text-foreground">{animal.nombre}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {animal.raza} · {animal.genero}
                </p>
              </>
            ) : (
              <>
                <p className="truncate text-base font-semibold text-foreground">{animal.raza}</p>
                <p className="text-sm text-muted-foreground">{animal.genero}</p>
              </>
            )}
          </div>

          <div className="flex items-center gap-1">
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-semibold",
                isMedias
                  ? "bg-info/10 text-info"
                  : "bg-success/10 text-success",
              )}
            >
              {animal.estado}
            </span>
            <button
              type="button"
              aria-label="Editar"
              onClick={(event) => {
                event.stopPropagation();
                onEdit(animal);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Eliminar"
              onClick={(event) => {
                event.stopPropagation();
                onDelete(animal);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(animal.fechaNacimiento)}
            <span className="text-foreground/50">·</span>
            {calculateAge(animal.fechaNacimiento)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {animal.finca}
          </span>
          {isMedias && animal.socio && (
            <span className="inline-flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              {animal.socio}
            </span>
          )}
          {animal.notas.trim() && (
            <span
              title="Este animal tiene notas"
              aria-label="Tiene notas"
              className="inline-flex items-center gap-1.5"
            >
              <MessageSquare className="h-3.5 w-3.5" />
            </span>
          )}
          {!isCompleteAnimalCode(animal.codigo) && (
            <span
              title="El código no tiene el formato 2-3-4. Edítalo para actualizarlo."
              className="inline-flex items-center gap-1.5 font-medium text-amber-600"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              Código antiguo
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
