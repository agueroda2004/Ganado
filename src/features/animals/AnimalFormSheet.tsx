import { useEffect, useState } from "react";
import { Button } from "../../components/ui/Button";
import { DatePicker } from "../../components/ui/DatePicker";
import { Dropdown, type DropdownOption } from "../../components/ui/Dropdown";
import { Field } from "../../components/ui/Field";
import { BottomSheet } from "../../components/ui/BottomSheet";
import { TextField } from "../../components/ui/TextField";
import { TextArea } from "../../components/ui/TextArea";
import { AnimalCodeField } from "./AnimalCodeField";
import { calculateMonths, isoMonthsAgo } from "./animal-utils";
import { BREEDS } from "../../data/breeds";
import { digitsOnly, formatAnimalCode, isCompleteAnimalCode } from "../../lib/animal-code";
import {
  createEmptyAnimalInput,
  ESTADOS,
  FINCAS,
  GENEROS,
  type Animal,
  type AnimalInput,
  type Estado,
  type Finca,
  type Genero,
} from "../../domain/animal";

interface AnimalFormSheetProps {
  open: boolean;
  animal: Animal | null;
  existingCodigos: string[];
  onClose: () => void;
  onSubmit: (input: AnimalInput) => void;
}

const GENERO_OPTIONS: DropdownOption[] = GENEROS.map((value) => ({ value, label: value }));
const ESTADO_OPTIONS: DropdownOption[] = ESTADOS.map((value) => ({ value, label: value }));
const FINCA_OPTIONS: DropdownOption[] = FINCAS.map((value) => ({ value, label: value }));
const RAZA_OPTIONS: DropdownOption[] = BREEDS.map((value) => ({ value, label: value }));

interface FormErrors {
  codigo?: string;
  raza?: string;
  fechaNacimiento?: string;
  socio?: string;
}

export function AnimalFormSheet({
  open,
  animal,
  existingCodigos,
  onClose,
  onSubmit,
}: AnimalFormSheetProps) {
  const [form, setForm] = useState<AnimalInput>(createEmptyAnimalInput);
  const [errors, setErrors] = useState<FormErrors>({});
  // Solo para el formulario: no se guarda. Sirve para calcular la fecha rápido.
  const [meses, setMeses] = useState("");

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setMeses("");
    if (animal) {
      setForm({
        nombre: animal.nombre ?? "",
        genero: animal.genero,
        raza: animal.raza,
        fechaNacimiento: animal.fechaNacimiento,
        codigo: animal.codigo,
        estado: animal.estado,
        socio: animal.socio,
        finca: animal.finca,
        notas: animal.notas ?? "",
      });
    } else {
      setForm(createEmptyAnimalInput());
    }
  }, [open, animal]);

  function update<K extends keyof AnimalInput>(key: K, value: AnimalInput[K]) {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "estado" && value !== "Medias") {
        next.socio = "";
      }
      return next;
    });
    if (key === "codigo" || key === "raza" || key === "fechaNacimiento" || key === "socio") {
      setErrors((current) => ({ ...current, [key]: undefined }));
    }
  }

  function handleMesesChange(raw: string) {
    const digits = raw.replace(/\D+/g, "").slice(0, 3);
    const clamped = digits === "" ? "" : String(Math.min(300, Number(digits)));
    setMeses(clamped);
    if (clamped === "") return;
    update("fechaNacimiento", isoMonthsAgo(Number(clamped)));
  }

  function handleFechaChange(value: string) {
    update("fechaNacimiento", value);
    const months = value ? calculateMonths(value) : null;
    setMeses(months === null ? "" : String(months));
  }

  function validate(): boolean {
    const nextErrors: FormErrors = {};
    const codigo = form.codigo.trim();
    const raza = form.raza.trim();

    if (!codigo) {
      nextErrors.codigo = "El código es obligatorio.";
    } else if (!isCompleteAnimalCode(codigo)) {
      nextErrors.codigo = "El código debe tener 9 números (2-3-4).";
    } else if (
      existingCodigos.some((existing) => digitsOnly(existing) === digitsOnly(codigo))
    ) {
      nextErrors.codigo = "Ya existe un animal con este código.";
    }

    if (!raza) {
      nextErrors.raza = "La raza es obligatoria.";
    }

    if (!form.fechaNacimiento) {
      nextErrors.fechaNacimiento = "La fecha de nacimiento es obligatoria.";
    } else if (new Date(form.fechaNacimiento) > new Date()) {
      nextErrors.fechaNacimiento = "La fecha no puede ser futura.";
    }

    if (form.estado === "Medias" && !form.socio.trim()) {
      nextErrors.socio = "El socio es obligatorio cuando el animal es a medias.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onSubmit({
      nombre: form.nombre.trim(),
      genero: form.genero,
      raza: form.raza.trim(),
      fechaNacimiento: form.fechaNacimiento,
      codigo: formatAnimalCode(form.codigo),
      estado: form.estado,
      socio: form.estado === "Medias" ? form.socio.trim() : "",
      finca: form.finca,
      notas: form.notas.trim(),
    });
    onClose();
  }

  const isEditing = Boolean(animal);

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={isEditing ? "Editar animal" : "Nuevo animal"}
      description={isEditing ? "Actualiza los datos del animal." : "Registra un nuevo animal."}
      footer={
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="flex-1">
            {isEditing ? "Guardar" : "Agregar"}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 pb-2">
        <Field label="Nombre" optional>
          <TextField
            value={form.nombre}
            onChange={(value) => update("nombre", value)}
            placeholder="Ej. Lucero"
            maxLength={40}
          />
        </Field>

        <Field label="Código" htmlFor="codigo" error={errors.codigo}>
          <AnimalCodeField
            id="codigo"
            value={form.codigo}
            onChange={(value) => update("codigo", value)}
            invalid={Boolean(errors.codigo)}
          />
          <p className="text-xs text-muted-foreground">
            Solo números, formato 2-3-4 (ej. 12-345-6789).
          </p>
        </Field>

        <Field label="Género">
          <Dropdown
            value={form.genero}
            onChange={(value) => update("genero", value as Genero)}
            options={GENERO_OPTIONS}
          />
        </Field>

        <Field label="Raza" error={errors.raza}>
          <Dropdown
            value={form.raza}
            onChange={(value) => update("raza", value)}
            options={RAZA_OPTIONS}
            placeholder="Seleccionar raza"
            invalid={Boolean(errors.raza)}
          />
        </Field>

        <Field label="Fecha de nacimiento" error={errors.fechaNacimiento}>
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <DatePicker
                value={form.fechaNacimiento}
                onChange={handleFechaChange}
                maxDate={new Date()}
                placeholder="Seleccionar fecha"
                invalid={Boolean(errors.fechaNacimiento)}
              />
            </div>
            <div className="w-24 shrink-0">
              <TextField
                value={meses}
                onChange={handleMesesChange}
                placeholder="Meses"
                ariaLabel="Meses"
                inputMode="numeric"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Opcional: escribe los meses y la fecha se calcula sola.
          </p>
        </Field>

        <Field label="Estado">
          <Dropdown
            value={form.estado}
            onChange={(value) => update("estado", value as Estado)}
            options={ESTADO_OPTIONS}
          />
        </Field>

        {form.estado === "Medias" && (
          <div className="animate-fade-in">
            <Field label="Socio" error={errors.socio}>
              <TextField
                value={form.socio}
                onChange={(value) => update("socio", value)}
                placeholder="Nombre del socio"
                invalid={Boolean(errors.socio)}
                maxLength={60}
              />
            </Field>
          </div>
        )}

        <Field label="Finca">
          <Dropdown
            value={form.finca}
            onChange={(value) => update("finca", value as Finca)}
            options={FINCA_OPTIONS}
          />
        </Field>

        <Field label="Notas" htmlFor="notas" optional>
          <TextArea
            id="notas"
            value={form.notas}
            onChange={(value) => update("notas", value)}
            placeholder="Observaciones, tratamiento, etc."
            maxLength={500}
          />
          <p className="text-right text-xs text-muted-foreground">
            {form.notas.length}/500
          </p>
        </Field>
      </div>
    </BottomSheet>
  );
}
