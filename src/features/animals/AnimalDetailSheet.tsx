import { useEffect, useState } from "react";
import { AlertTriangle, Pencil } from "lucide-react";
import { BottomSheet } from "../../components/ui/BottomSheet";
import { Button } from "../../components/ui/Button";
import type { Animal } from "../../domain/animal";
import { isCompleteAnimalCode } from "../../lib/animal-code";
import { Aretel } from "./Aretel";
import { calculateAge, formatDate } from "./animal-utils";

interface AnimalDetailSheetProps {
  animal: Animal | null;
  open: boolean;
  onClose: () => void;
  onEdit: (animal: Animal) => void;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-3 last:border-b-0">
      <span className="shrink-0 text-sm text-muted-foreground">{label}</span>
      <span className="min-w-0 truncate text-right text-sm font-medium text-foreground">
        {value}
      </span>
    </div>
  );
}

export function AnimalDetailSheet({ animal, open, onClose, onEdit }: AnimalDetailSheetProps) {
  // Se conserva el último animal para que el contenido siga visible
  // mientras corre la animación de cierre.
  const [shown, setShown] = useState<Animal | null>(animal);

  useEffect(() => {
    if (animal) setShown(animal);
  }, [animal]);

  const isMedias = shown?.estado === "Medias";
  const hasNombre = (shown?.nombre.trim().length ?? 0) > 0;
  const title = shown ? (hasNombre ? shown.nombre : shown.raza) : "Detalle";

  return (
    <BottomSheet
      open={open && animal !== null}
      onClose={onClose}
      title={title}
      footer={
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cerrar
          </Button>
          <Button
            onClick={() => shown && onEdit(shown)}
            disabled={!shown}
            className="flex-1"
          >
            <Pencil className="h-4 w-4" />
            Editar
          </Button>
        </div>
      }
    >
      {shown && (
        <div className="flex flex-col gap-4 pb-2">
          <div className="flex justify-center py-2">
            <Aretel codigo={shown.codigo} size="lg" />
          </div>

          {!isCompleteAnimalCode(shown.codigo) && (
            <div className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-3 text-amber-700">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <p className="text-xs">
                El código no tiene el formato 2-3-4. Edítalo para actualizarlo.
              </p>
            </div>
          )}

          <div className="rounded-2xl border border-border bg-surface px-4">
            <DetailRow label="Género" value={shown.genero} />
            <DetailRow label="Raza" value={shown.raza} />
            <DetailRow
              label="Fecha de nacimiento"
              value={`${formatDate(shown.fechaNacimiento)} · ${calculateAge(shown.fechaNacimiento)}`}
            />
            <DetailRow label="Estado" value={shown.estado} />
            {isMedias && <DetailRow label="Socio" value={shown.socio} />}
            <DetailRow label="Finca" value={shown.finca} />
          </div>
        </div>
      )}
    </BottomSheet>
  );
}
