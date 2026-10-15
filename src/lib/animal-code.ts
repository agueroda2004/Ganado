/**
 * Formato de código de animal: 2 números - 3 números - 4 números.
 * Ejemplo: `12-345-6789`.
 */

export const CODE_GROUP_LENGTHS = [2, 3, 4] as const;

/** Total de dígitos requeridos (9). */
export const CODE_DIGITS = CODE_GROUP_LENGTHS.reduce((total, length) => total + length, 0);

/** Longitud visual incluyendo guiones (11). */
export const CODE_MAX_LENGTH = CODE_DIGITS + (CODE_GROUP_LENGTHS.length - 1);

function stripNonDigits(value: string): string {
  return value.replace(/\D+/g, "");
}

/** Devuelve solo los dígitos, limitado a 9. */
export function digitsOnly(value: string): string {
  return stripNonDigits(value).slice(0, CODE_DIGITS);
}

/** Cuenta los dígitos presentes sin recortar. */
export function countDigits(value: string): number {
  return stripNonDigits(value).length;
}

/**
 * Aplica el formato 2-3-4 sobre lo que el usuario escriba o pegue.
 * `123456789` -> `12-345-6789`
 */
export function formatAnimalCode(value: string): string {
  const digits = digitsOnly(value);
  const parts: string[] = [];
  let index = 0;
  for (const length of CODE_GROUP_LENGTHS) {
    if (index >= digits.length) break;
    parts.push(digits.slice(index, index + length));
    index += length;
  }
  return parts.join("-");
}

/** Cantidad de dígitos finales que usa el filtro de código. */
export const CODE_TAIL_LENGTH = 4;

/**
 * Normaliza lo que se escribe en el filtro: solo dígitos, máximo 4.
 * (El filtro trabaja sobre los últimos 4 dígitos, sin guiones.)
 */
export function filterDigits(value: string): string {
  return value.replace(/\D+/g, "").slice(0, CODE_TAIL_LENGTH);
}

/** Últimos 4 dígitos de un código. */
export function codeTail(codigo: string): string {
  return digitsOnly(codigo).slice(-CODE_TAIL_LENGTH);
}

/** ¿El código coincide con el filtro por sus últimos 4 dígitos? */
export function codeMatchesFilter(codigo: string, query: string): boolean {
  if (!query) return true;
  return codeTail(codigo).includes(query);
}

/** Solo es válido cuando tiene los 9 dígitos. */
export function isCompleteAnimalCode(value: string): boolean {
  return digitsOnly(value).length === CODE_DIGITS;
}

/**
 * Posición del cursor después de `digitCount` dígitos dentro de `value`.
 * Se usa para no perder el cursor al insertar los guiones.
 */
export function caretAfterDigits(value: string, digitCount: number): number {
  if (digitCount <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < value.length; i += 1) {
    if (value[i] >= "0" && value[i] <= "9") {
      seen += 1;
      if (seen === digitCount) return i + 1;
    }
  }
  return value.length;
}
