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
| `notas`            | Texto libre, **opcional** (máx. 500) |

**Regla:** el campo `socio` solo se muestra (y es obligatorio) cuando el estado
es `Medias`. Si el estado es `Propio`, se oculta y se guarda vacío.

## Código

El código se escribe solo con números y se formatea automáticamente al patrón
**2-3-4** (2 números, 3 números, 4 números). Por ejemplo, al escribir
`123456789` queda `12-345-6789`. Cualquier otro carácter se descarta.

En la tarjeta, los primeros 5 números se ven pequeños y los últimos 4 más
grandes, como en un arete real.

El filtro de código busca por los **últimos 4 dígitos**: escribe `6789` y
aparecen los animales cuyo código termina en esos dígitos. Solo acepta números
(máximo 4), así que lo que esté en medio del código ya no coincide.

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

## Sin conexión (offline)

La app funciona sin internet:

- Todos los datos viven en el `localStorage` del teléfono. No hay servidor.
- El service worker guarda el app shell y los archivos compilados, así que la app
  abre aunque no haya conexión.

Para que funcione en el teléfono:

1. Entra una vez con internet e **instala** la app (Agregar a pantalla de inicio).
   El guardado offline empieza después de esa primera visita.
2. Necesita **HTTPS**, así que debe estar desplegada. En `localhost` solo sirve
   para probar en la computadora.

Cosas a tener en cuenta:

- Los datos están en el navegador del teléfono. Si borras los datos del sitio,
  se pierden. **Exporta respaldos** de vez en cuando.
- El contenido de la app se cachea, pero las actualizaciones se aplican solas
  (`autoUpdate`) la próxima vez que abras con conexión.

## Notas

Cada animal puede tener notas libres (opcional, hasta 500 caracteres) en el
formulario. Si un animal tiene notas, la tarjeta muestra un pequeño icono y el
detalle las muestra completas.

## Fecha rápida con meses

En el formulario de crear/editar hay un campo **Meses** (opcional) junto a la
fecha de nacimiento. Escribe los meses y la fecha se calcula sola contando
meses de calendario: por ejemplo `18` pone la fecha de hace 18 meses.

- Sirve solo para llenar la fecha más rápido. **No se guarda** en el animal.
- También funciona al revés: al elegir una fecha, el campo muestra la edad en meses.
- Si el día no existe en el mes destino, se ajusta al último día (1 mes antes
  del 31 de marzo es el 28 o 29 de febrero).

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
