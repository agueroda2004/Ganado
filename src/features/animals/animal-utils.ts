export function formatDate(iso: string): string {
  if (!iso) return "—";
  const parts = iso.split("-");
  if (parts.length !== 3) return iso;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

export function calculateAge(fechaNacimiento: string): string {
  if (!fechaNacimiento) return "—";
  const birth = new Date(`${fechaNacimiento}T00:00:00`);
  if (isNaN(birth.getTime())) return "—";

  const today = new Date();
  let months =
    (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
  if (today.getDate() < birth.getDate()) months -= 1;
  if (months < 0) months = 0;

  const years = Math.floor(months / 12);
  const restMonths = months % 12;

  if (years === 0 && restMonths === 0) return "Recién nacido";
  if (years === 0) return `${restMonths} ${restMonths === 1 ? "mes" : "meses"}`;
  if (restMonths === 0) return `${years} ${years === 1 ? "año" : "años"}`;
  return `${years} ${years === 1 ? "año" : "años"} ${restMonths} ${restMonths === 1 ? "mes" : "meses"}`;
}
