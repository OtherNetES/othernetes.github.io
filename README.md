# OtherNetES — TypeScript + Vite

La web conserva HTML y CSS, pero la lógica JavaScript se mantiene en TypeScript dentro de `src/`.
Vite convierte el TypeScript a JavaScript para el navegador y genera la versión publicable en `dist/`.

## Requisitos
- Node.js 22 o una versión compatible reciente
- npm (se instala con Node.js)

## Trabajar en local
```bash
npm install
npm run dev
```
Abre la dirección local que muestra Vite en la terminal.

## Comprobar tipos
```bash
npm run typecheck
```

## Preparar la web para publicar
```bash
npm run build
npm run preview
```
Vite genera el sitio listo para publicar en `dist/`.

## GitHub Pages
El workflow `.github/workflows/pages.yml` compila y publica `dist/` al hacer push a `main`.
En GitHub, entra en **Settings → Pages** y configura **Build and deployment → Source: GitHub Actions**.
Si la rama principal del repositorio no se llama `main`, cambia el nombre de la rama en el workflow.

## Activar el mantenimiento
Edita `public/maintenance.json` y cambia:
```json
"enabled": true
```
a `false` para desactivarlo. El cambio se publica con el siguiente push. Los textos también se editan en ese JSON.

## Estructura
- `index.html`: página de contacto.
- `mantenimiento.html`: página de mantenimiento.
- `src/contact.ts`: validación y envío del formulario.
- `src/maintenance-check.ts`: comprueba el interruptor de mantenimiento.
- `src/maintenance-page.ts`: personaliza los textos de mantenimiento.
- `style.css`, `mantenimiento.css`: estilos visuales.
- `public/maintenance.json`: configuración publicada en la raíz del sitio.

## Nota sobre la clave de Web3Forms
La clave de acceso del formulario se incluye en el código del navegador y puede ser vista por visitantes. Esto es normal para muchas claves públicas de Web3Forms, pero no debe reutilizarse como contraseña ni como secreto de servidor.
