# Ganado

Aplicación web personal (PWA) para gestionar animales. Todos los datos se guardan
en el `localStorage` del dispositivo, por lo que funciona sin conexión y sin servidor.

## Requisitos

- Node.js 20 o superior

## Comandos

```bash
npm install          # instalar dependencias
npm run dev          # servidor de desarrollo
npm run build        # compilar para producción (dist/)
npm run preview      # previsualizar el build
npm run generate-assets   # regenerar íconos PWA desde public/icon.svg
```

## Clave de acceso

La clave se lee de la variable de entorno `VITE_ACCESS_CODE`.

En local, copia `.env.example` a `.env` (ese archivo **no** se versiona):

```
VITE_ACCESS_CODE=Chon
```

En el hosting (Vercel, Netlify, GitHub Pages, etc.) configúrala como variable
de entorno para que exista al momento de compilar, ya que Vite la incrusta en
el bundle.

Al escribir la clave correcta se guarda un valor en `localStorage`
(`ganado:auth`) para no volver a pedirla. El botón de salir en el encabezado
borra ese valor.

> La clave queda incluida en el bundle compilado, así que es una barrera simple,
> no seguridad real. Sirve para una app de uso personal.

## Razas

Las razas disponibles están en `src/data/breeds.ts`. Para agregar o quitar una
raza, edita ese arreglo y vuelve a compilar.

## Modelo de datos

Cada animal tiene:

| Campo              | Valores                          |
| ------------------ | -------------------------------- |
| `nombre`           | Texto libre, **opcional**        |
| `genero`           | Hembra, Macho                    |
| `raza`             | Lista de `src/data/breeds.ts`    |
| `fechaNacimiento`  | Fecha (no puede ser futura)      |
| `codigo`           | 9 números con formato 2-3-4 (ej. `12-345-6789`), único |
| `estado`           | Propio, Medias                   |
| `socio`            | Solo cuando el estado es Medias  |
| `finca`            | Jupa, San Francisco              |

**Regla:** el campo `socio` solo se muestra (y es obligatorio) cuando el estado
es `Medias`. Si el estado es `Propio`, se oculta y se guarda vacío.

## Código

El código se escribe solo con números y se formatea automáticamente al patrón
**2-3-4** (2 números, 3 números, 4 números). Por ejemplo, al escribir
`123456789` queda `12-345-6789`. Cualquier otro carácter se descarta.

En la tarjeta, los primeros 5 números se ven pequeños y los últimos 4 más
grandes, como en un arete real.

El nombre es opcional: si lo escribes, aparece como título de la tarjeta y la
raza queda debajo. Si lo dejas vacío, la tarjeta muestra la raza como título.

Cada tarjeta tiene un botón con lápiz para editar y otro con papelera para
eliminar. Tocar la tarjeta abre el **detalle** del animal, que muestra el arete
en grande y todos los campos, con un botón para pasar a la edición.

Los animales con códigos antiguos que no siguen el patrón se conservan tal cual,
se marcan con **"Código antiguo"** y al editarlos se pide el formato nuevo.

## Importar y exportar

- **Exportar:** descarga un archivo `ganado-AAAA-MM-DD.json` con todos los datos.
- **Importar:** lee un `.json`, valida cada registro y permite **fusionar** con los
  datos actuales (por código) o **reemplazar** todo. Los registros inválidos se omiten.

## Estructura

```
src/
  components/ui/     componentes reutilizables (Dropdown, BottomSheet, DatePicker, ...)
  data/breeds.ts     lista de razas
  domain/animal.ts   tipos y constantes del modelo
  features/
    animals/         tarjetas, formulario, filtros y estadísticas
    auth/            pantalla de acceso y almacenamiento del estado
  lib/               utilidades (cn, popover anclado)
  storage/           lectura/escritura en localStorage e import/export
public/              íconos PWA generados desde Logo.svg
```
