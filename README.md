# San Antonio

Webapp privada para coordinar el novenario de San Antonio en un grupo familiar.

## Stack
- Frontend: Vite + vanilla JS + Tailwind, hosted en GitHub Pages.
- Datos: Google Sheet (lectura como CSV publicado, escritura via Apps Script doPost).
- Admin: la madrina edita el Sheet directamente en Drive.

## Comandos
- `npm run dev` — dev server con hot reload.
- `npm run build` — build a `dist/` para GH Pages.
- `npm run test` — corre Vitest.
- `npm run preview` — sirve `dist/` localmente.

## Spec y plan
- `docs/superpowers/specs/2026-05-05-san-antonio-design.md`
- `docs/superpowers/plans/2026-05-05-san-antonio.md`

## Deploy

Push a `main` → GitHub Actions buildea y publica en GitHub Pages automáticamente.

Antes del primer deploy:

1. Crear repo en GitHub.
2. Push.
3. Settings → Pages → Source: GitHub Actions.
4. Editar `index.html` con la URL final del Sheet y de Apps Script.
5. Commit + push → live en `https://<usuario>.github.io/san-antonio/`.
