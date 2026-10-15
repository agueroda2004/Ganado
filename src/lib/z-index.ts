/**
 * Escala de apilamiento (z-index) de la app.
 *
 * Regla importante: los popovers (Dropdown y DatePicker) se renderizan en un
 * portal sobre <body>, así que su z-index debe ser MAYOR que el del bottom
 * sheet. Si fuera menor, la lista se dibujaría detrás del sheet y se vería
 * como si el dropdown no abriera.
 *
 * Los componentes usan las clases de Tailwind equivalentes donde aplica
 * (header z-30, botón flotante z-40, toast z-[80]); sheet y popover toman
 * estos valores para mantenerlos sincronizados.
 */
export const Z_INDEX = {
  header: 30,
  floatingAction: 40,
  sheet: 50,
  popover: 60,
  toast: 80,
} as const;
