# Apps Script Deploy

## Setup (una vez)

1. En Google Drive, crea (o usa) el Sheet con las 4 pestañas (ver `docs/sheet-template.md`).
2. Copia el ID del Sheet desde la URL: `docs.google.com/spreadsheets/d/<ID>/edit`.
3. Abre el Sheet → Extensiones → Apps Script.
4. Borra el código por defecto. Pega `Code.gs` completo.
5. Reemplaza `PUT_THE_SHEET_ID_HERE` por el ID real.
6. Guarda (💾).

## Deploy como Web App

1. Click "Implementar" → "Nueva implementación".
2. Tipo: "Aplicación web".
3. Ejecutar como: **Yo (mi cuenta)**.
4. Quién tiene acceso: **Cualquier usuario** (necesario para que la web pueda escribir sin login).
5. Click "Implementar". Autoriza permisos.
6. Copia la URL `https://script.google.com/macros/s/AKfy.../exec`.
7. Pégala en `index.html` → `window.SAN_ANTONIO_CONFIG.appsScriptUrl`.

## Update

Cuando edites `Code.gs`, "Implementar" → "Administrar implementaciones" → editar la activa → "Versión nueva" → Implementar. La URL no cambia.
