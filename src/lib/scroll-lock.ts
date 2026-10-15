/**
 * Bloqueo del scroll del body con contador.
 *
 * Varios bottom sheets pueden estar montados al mismo tiempo (por ejemplo al
 * pasar del detalle al formulario de edición). Sin un contador, el primer
 * sheet en desmontarse restauraría el scroll mientras el otro sigue abierto.
 */
let lockCount = 0;
let previousOverflow = "";

export function lockScroll(): void {
  if (lockCount === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  lockCount += 1;
}

export function unlockScroll(): void {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = previousOverflow;
  }
}
