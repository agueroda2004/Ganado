export function formatDate(iso: string): string {
  if (!iso) return "—";
  const parts = iso.split("-");
  if (parts.length !== 3) return iso;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

function toISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Meses completos entre una fecha y hoy.
 * Devuelve null si la fecha no es válida.
 */
export function calculateMonths(
  fechaNacimiento: string,
  reference: Date = new Date(),
): number | null {
  if (!fechaNacimiento) return null;
  const birth = new Date(`${fechaNacimiento}T00:00:00`);
  if (isNaN(birth.getTime())) return null;

  const today = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate());
  let months =
    (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
  if (today.getDate() < birth.getDate()) months -= 1;
  return Math.max(0, months);
}

/**
 * Fecha ISO de hace N meses, en meses de calendario.
 * El día se ajusta al último día del mes destino, así que 1 mes antes del
 * 31 de marzo es el 28 o 29 de febrero (no el 2 o 3 de marzo).
 */
export function isoMonthsAgo(months: number, reference: Date = new Date()): string {
  const base = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate());
  const targetMonth = base.getMonth() - months;
  const lastDayOfTarget = new Date(base.getFullYear(), targetMonth + 1, 0).getDate();
  const day = Math.min(base.getDate(), lastDayOfTarget);
  return toISO(new Date(base.getFullYear(), targetMonth, day));
}

export function calculateAge(fechaNacimiento: string): string {
  if (!fechaNacimiento) return "—";
  const birth = new Date(`${fechaNacimiento}T00:00:00`);
  if (isNaN(birth.getTime())) return "—";

  const months = calculateMonths(fechaNacimiento) ?? 0;
  const years = Math.floor(months / 12);
  const restMonths = months % 12;

  if (years === 0 && restMonths === 0) return "Recién nacido";
  if (years === 0) return `${restMonths} ${restMonths === 1 ? "mes" : "meses"}`;
  if (restMonths === 0) return `${years} ${years === 1 ? "año" : "años"}`;
  return `${years} ${years === 1 ? "año" : "años"} ${restMonths} ${restMonths === 1 ? "mes" : "meses"}`;
}
