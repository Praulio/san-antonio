# San Antonio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first webapp that tracks the 9-day rotation of a San Antonio statue across a private family group, backed by a Google Sheet and deployable to GitHub Pages.

**Architecture:** Static frontend (Vite + vanilla JS + Tailwind) hosted on GitHub Pages reads a published Google Sheet as CSV for display. Writes (apuntarme, testimonio) POST to a tiny Apps Script `doPost` endpoint that appends rows to the same Sheet. The "admin UI" is the Sheet itself in Drive — no custom admin code.

**Tech Stack:** Vite, vanilla JavaScript (ES modules), Tailwind CSS v3, Vitest (jsdom), Google Apps Script, Google Sheets, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-05-05-san-antonio-design.md`

**Working directory:** `/Users/rogelioguzman/Documents/Code House/Activos/san-antonio/`

---

## File structure (target)

```
san-antonio/
├── README.md
├── package.json
├── vite.config.js
├── vitest.config.js
├── tailwind.config.js
├── postcss.config.js
├── .gitignore
├── index.html
├── public/
│   └── santo.svg
├── src/
│   ├── main.js           # entry: init router, fetch data, render
│   ├── api.js            # readSheet(), submitApuntarme(), submitTestimonio()
│   ├── csv.js            # parseCsv() — CSV → array of objects
│   ├── queue.js          # findActivo, getQueue, getCompleted, estimateStartDate, daysRemaining
│   ├── format.js         # formatDate, formatRange, countdownText
│   ├── router.js         # hash-based tab switching
│   ├── ui-home.js
│   ├── ui-queue.js
│   ├── ui-apuntarme.js
│   ├── ui-history.js
│   ├── ui-testimonios.js
│   ├── ui-oracion.js
│   ├── santo.js          # SVG inline + flip animation control
│   ├── styles.css        # Tailwind directives + base layer
│   └── themes/
│       ├── devocional.css   # theme A (default)
│       └── minimalista.css  # theme D (alternative)
├── tests/
│   ├── csv.test.js
│   ├── queue.test.js
│   ├── format.test.js
│   └── api.test.js
├── apps-script/
│   ├── Code.gs
│   └── README.md         # deploy instructions
└── docs/
    ├── sheet-template.md # how to set up the Google Sheet
    ├── superpowers/
    │   ├── specs/2026-05-05-san-antonio-design.md  (existing)
    │   └── plans/2026-05-05-san-antonio.md          (this file)
```

---

## Task 1: Project setup

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `vitest.config.js`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `.gitignore`
- Create: `index.html`
- Create: `src/styles.css`
- Create: `src/main.js`
- Create: `README.md`

- [ ] **Step 1: Initialize git repo**

```bash
cd "/Users/rogelioguzman/Documents/Code House/Activos/san-antonio"
git init -b main
```

- [ ] **Step 2: Create `.gitignore`**

```
node_modules
dist
.DS_Store
.env
.env.local
*.log
.vite
coverage
```

- [ ] **Step 3: Create `package.json`**

```json
{
  "name": "san-antonio",
  "private": true,
  "type": "module",
  "version": "0.1.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "devDependencies": {
    "vite": "^5.4.0",
    "vitest": "^2.1.0",
    "jsdom": "^25.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

- [ ] **Step 4: Install dependencies**

```bash
npm install
```

Expected: deps installed, `node_modules/` and `package-lock.json` created.

- [ ] **Step 5: Create `vite.config.js`**

```js
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
```

- [ ] **Step 6: Create `vitest.config.js`**

```js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.test.js']
  }
});
```

- [ ] **Step 7: Create `tailwind.config.js`**

```js
export default {
  content: ['./index.html', './src/**/*.{js,html}'],
  theme: {
    extend: {}
  },
  plugins: []
};
```

- [ ] **Step 8: Create `postcss.config.js`**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
```

- [ ] **Step 9: Create `src/styles.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 10: Create `index.html` (shell)**

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#F5EFE3" />
    <title>San Antonio</title>
    <link rel="stylesheet" href="/src/styles.css" />
  </head>
  <body class="min-h-screen">
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

- [ ] **Step 11: Create `src/main.js` (smoke entry)**

```js
const app = document.getElementById('app');
app.textContent = 'San Antonio — booting…';
```

- [ ] **Step 12: Create `README.md`**

```markdown
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
```

- [ ] **Step 13: Smoke test the dev server**

```bash
npm run dev
```

Expected: prints local URL (e.g. `http://localhost:5173`). Open it; page shows "San Antonio — booting…".
Stop the server (Ctrl-C) before continuing.

- [ ] **Step 14: First commit**

```bash
git add -A
git commit -m "chore: project setup with Vite, Vitest, Tailwind"
```

---

## Task 2: CSV parser (TDD)

**Files:**
- Create: `tests/csv.test.js`
- Create: `src/csv.js`

**Why:** The Google Sheet exports as CSV. We need a small parser that handles header + quoted strings + commas inside quoted cells. We avoid a full library (YAGNI) — Sheet output is well-formed.

- [ ] **Step 1: Write failing test for basic parse**

Create `tests/csv.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { parseCsv } from '../src/csv.js';

describe('parseCsv', () => {
  it('parses header and rows into array of objects', () => {
    const input = 'id,nombre,estado\np001,María,activa\np002,Ana,en_cola';
    expect(parseCsv(input)).toEqual([
      { id: 'p001', nombre: 'María', estado: 'activa' },
      { id: 'p002', nombre: 'Ana', estado: 'en_cola' }
    ]);
  });
});
```

- [ ] **Step 2: Run test, expect fail**

```bash
npm run test -- csv
```

Expected: FAIL — `Cannot find module '../src/csv.js'`.

- [ ] **Step 3: Minimal implementation**

Create `src/csv.js`:

```js
export function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter(line => line.length > 0);
  if (lines.length === 0) return [];
  const headers = splitRow(lines[0]);
  return lines.slice(1).map(line => {
    const cells = splitRow(line);
    return Object.fromEntries(headers.map((h, i) => [h, cells[i] ?? '']));
  });
}

function splitRow(line) {
  const cells = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (ch === ',' && !inQuotes) {
      cells.push(cur); cur = '';
    } else {
      cur += ch;
    }
  }
  cells.push(cur);
  return cells;
}
```

- [ ] **Step 4: Run test, expect pass**

```bash
npm run test -- csv
```

Expected: PASS.

- [ ] **Step 5: Add quoted-string test**

Append to `tests/csv.test.js`:

```js
  it('handles quoted strings with commas inside', () => {
    const input = 'id,texto\nts01,"Hola, mundo"\nts02,"Otro, con coma"';
    expect(parseCsv(input)).toEqual([
      { id: 'ts01', texto: 'Hola, mundo' },
      { id: 'ts02', texto: 'Otro, con coma' }
    ]);
  });

  it('handles escaped double quotes', () => {
    const input = 'id,texto\nts01,"Dijo ""hola"" feliz"';
    expect(parseCsv(input)).toEqual([
      { id: 'ts01', texto: 'Dijo "hola" feliz' }
    ]);
  });

  it('returns empty array for empty input', () => {
    expect(parseCsv('')).toEqual([]);
  });

  it('skips trailing empty lines', () => {
    const input = 'id,nombre\np001,Ana\n\n\n';
    expect(parseCsv(input)).toEqual([{ id: 'p001', nombre: 'Ana' }]);
  });
```

- [ ] **Step 6: Run all csv tests**

```bash
npm run test -- csv
```

Expected: PASS (5 tests).

- [ ] **Step 7: Commit**

```bash
git add tests/csv.test.js src/csv.js
git commit -m "feat(csv): minimal CSV parser with quoted-string support"
```

---

## Task 3: Date/format helpers (TDD)

**Files:**
- Create: `tests/format.test.js`
- Create: `src/format.js`

**Why:** Centralized formatting for Spanish dates, countdown text, and date-range strings. Used across all UI screens.

- [ ] **Step 1: Write failing test**

Create `tests/format.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { formatDate, formatRange, countdownText, parseDate } from '../src/format.js';

describe('parseDate', () => {
  it('parses YYYY-MM-DD into a Date', () => {
    const d = parseDate('2026-05-14');
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(4); // May = 4
    expect(d.getDate()).toBe(14);
  });

  it('returns null for empty string', () => {
    expect(parseDate('')).toBeNull();
  });
});

describe('formatDate', () => {
  it('formats date in Spanish long form', () => {
    expect(formatDate(new Date(2026, 4, 14))).toBe('14 de mayo de 2026');
  });
});

describe('formatRange', () => {
  it('formats date range in same month', () => {
    expect(formatRange(new Date(2026, 4, 14), new Date(2026, 4, 23)))
      .toBe('14 al 23 de mayo');
  });

  it('formats date range across months', () => {
    expect(formatRange(new Date(2026, 4, 28), new Date(2026, 5, 6)))
      .toBe('28 de mayo al 6 de junio');
  });
});

describe('countdownText', () => {
  it('shows days remaining when positive', () => {
    expect(countdownText(4)).toBe('Faltan 4 días');
  });

  it('shows singular when 1 day', () => {
    expect(countdownText(1)).toBe('Falta 1 día');
  });

  it('shows "Hoy termina" when zero', () => {
    expect(countdownText(0)).toBe('Hoy termina');
  });

  it('shows overdue text when negative', () => {
    expect(countdownText(-2)).toBe('Pasó hace 2 días');
  });
});
```

- [ ] **Step 2: Run, expect fail**

```bash
npm run test -- format
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/format.js`**

```js
const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

export function parseDate(str) {
  if (!str) return null;
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatDate(date) {
  return `${date.getDate()} de ${MESES[date.getMonth()]} de ${date.getFullYear()}`;
}

export function formatRange(start, end) {
  if (start.getMonth() === end.getMonth()) {
    return `${start.getDate()} al ${end.getDate()} de ${MESES[start.getMonth()]}`;
  }
  return `${start.getDate()} de ${MESES[start.getMonth()]} al ${end.getDate()} de ${MESES[end.getMonth()]}`;
}

export function countdownText(days) {
  if (days === 0) return 'Hoy termina';
  if (days < 0) return `Pasó hace ${Math.abs(days)} días`;
  if (days === 1) return 'Falta 1 día';
  return `Faltan ${days} días`;
}
```

- [ ] **Step 4: Run, expect pass**

```bash
npm run test -- format
```

Expected: PASS (8 tests).

- [ ] **Step 5: Commit**

```bash
git add tests/format.test.js src/format.js
git commit -m "feat(format): Spanish date and countdown helpers"
```

---

## Task 4: Queue logic (TDD)

**Files:**
- Create: `tests/queue.test.js`
- Create: `src/queue.js`

**Why:** Pure functions for finding the active turn, sorting the queue, computing the historial, and estimating future start dates. This is the core domain logic.

- [ ] **Step 1: Write failing tests**

Create `tests/queue.test.js`:

```js
import { describe, it, expect } from 'vitest';
import {
  findActivo,
  getQueue,
  getCompleted,
  estimateStartDate,
  daysRemaining
} from '../src/queue.js';

const SAMPLE = [
  { id: 't001', participante_id: 'p001', estado: 'completado', posicion: '', fecha_inicio: '2026-04-01', fecha_fin_est: '2026-04-10', fecha_fin_real: '2026-04-10' },
  { id: 't002', participante_id: 'p002', estado: 'activo', posicion: '', fecha_inicio: '2026-05-05', fecha_fin_est: '2026-05-14', fecha_fin_real: '' },
  { id: 't003', participante_id: 'p003', estado: 'en_cola', posicion: '1', fecha_inicio: '', fecha_fin_est: '', fecha_fin_real: '' },
  { id: 't004', participante_id: 'p004', estado: 'en_cola', posicion: '2', fecha_inicio: '', fecha_fin_est: '', fecha_fin_real: '' }
];

describe('findActivo', () => {
  it('returns the active turn', () => {
    expect(findActivo(SAMPLE)?.id).toBe('t002');
  });

  it('returns null when none active', () => {
    expect(findActivo([SAMPLE[0]])).toBeNull();
  });
});

describe('getQueue', () => {
  it('returns en_cola sorted by posicion ascending', () => {
    const q = getQueue(SAMPLE);
    expect(q.map(t => t.id)).toEqual(['t003', 't004']);
  });

  it('returns empty array when no queue', () => {
    expect(getQueue([SAMPLE[0]])).toEqual([]);
  });
});

describe('getCompleted', () => {
  it('returns completados sorted by fecha_fin_real desc', () => {
    const more = [
      ...SAMPLE,
      { id: 't000', participante_id: 'p000', estado: 'completado', posicion: '', fecha_inicio: '2026-03-01', fecha_fin_est: '2026-03-10', fecha_fin_real: '2026-03-10' }
    ];
    const c = getCompleted(more);
    expect(c.map(t => t.id)).toEqual(['t001', 't000']);
  });
});

describe('estimateStartDate', () => {
  it('computes start date from active end + position offset', () => {
    const activeEnd = new Date(2026, 4, 14);
    const start = estimateStartDate(activeEnd, 1, 9);
    expect(start.getDate()).toBe(14);
    expect(start.getMonth()).toBe(4);
  });

  it('position 2 starts 9 days after position 1', () => {
    const activeEnd = new Date(2026, 4, 14);
    const start = estimateStartDate(activeEnd, 2, 9);
    expect(start.getDate()).toBe(23);
  });
});

describe('daysRemaining', () => {
  it('returns positive when end is in the future', () => {
    const today = new Date(2026, 4, 10);
    const end = new Date(2026, 4, 14);
    expect(daysRemaining(today, end)).toBe(4);
  });

  it('returns 0 on the end day', () => {
    const today = new Date(2026, 4, 14);
    const end = new Date(2026, 4, 14);
    expect(daysRemaining(today, end)).toBe(0);
  });

  it('returns negative when overdue', () => {
    const today = new Date(2026, 4, 16);
    const end = new Date(2026, 4, 14);
    expect(daysRemaining(today, end)).toBe(-2);
  });
});
```

- [ ] **Step 2: Run, expect fail**

```bash
npm run test -- queue
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/queue.js`**

```js
const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function findActivo(turnos) {
  return turnos.find(t => t.estado === 'activo') ?? null;
}

export function getQueue(turnos) {
  return turnos
    .filter(t => t.estado === 'en_cola')
    .sort((a, b) => Number(a.posicion) - Number(b.posicion));
}

export function getCompleted(turnos) {
  return turnos
    .filter(t => t.estado === 'completado')
    .sort((a, b) => (a.fecha_fin_real < b.fecha_fin_real ? 1 : -1));
}

export function estimateStartDate(activeEndDate, position, turnoDays) {
  const offsetDays = (position - 1) * turnoDays;
  const out = new Date(activeEndDate);
  out.setDate(out.getDate() + offsetDays);
  return out;
}

export function daysRemaining(today, end) {
  const a = stripTime(today);
  const b = stripTime(end);
  return Math.round((b - a) / MS_PER_DAY);
}

function stripTime(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}
```

- [ ] **Step 4: Run, expect pass**

```bash
npm run test -- queue
```

Expected: PASS (10 tests).

- [ ] **Step 5: Commit**

```bash
git add tests/queue.test.js src/queue.js
git commit -m "feat(queue): pure logic for active/queue/historial and date math"
```

---

## Task 5: API layer (TDD)

**Files:**
- Create: `tests/api.test.js`
- Create: `src/api.js`

**Why:** One module owns all I/O: reading the published Sheet CSV and posting writes to Apps Script. Centralizing makes mocking and config trivial.

- [ ] **Step 1: Write failing tests**

Create `tests/api.test.js`:

```js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readSheet, submitApuntarme, submitTestimonio, validateApuntarmePayload } from '../src/api.js';

describe('validateApuntarmePayload', () => {
  it('returns no errors for valid payload', () => {
    expect(validateApuntarmePayload({ nombre: 'Ana', whatsapp: '+5218112345678' })).toEqual([]);
  });

  it('requires nombre', () => {
    const errs = validateApuntarmePayload({ nombre: '', whatsapp: '+5218112345678' });
    expect(errs).toContain('Falta el nombre');
  });

  it('requires whatsapp', () => {
    const errs = validateApuntarmePayload({ nombre: 'Ana', whatsapp: '' });
    expect(errs).toContain('Falta el WhatsApp');
  });

  it('rejects whatsapp shorter than 10 digits', () => {
    const errs = validateApuntarmePayload({ nombre: 'Ana', whatsapp: '123' });
    expect(errs).toContain('WhatsApp debe tener al menos 10 dígitos');
  });
});

describe('readSheet', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('fetches CSV from given URL and parses', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      text: async () => 'id,nombre\np001,Ana'
    });
    const rows = await readSheet('https://example.com/sheet.csv');
    expect(rows).toEqual([{ id: 'p001', nombre: 'Ana' }]);
    expect(global.fetch).toHaveBeenCalledWith('https://example.com/sheet.csv', { cache: 'no-store' });
  });

  it('throws when fetch fails', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 500 });
    await expect(readSheet('https://x')).rejects.toThrow();
  });
});

describe('submitApuntarme', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('posts payload to endpoint', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, posicion: 5 })
    });
    const result = await submitApuntarme(
      'https://script.google.com/x',
      { nombre: 'Ana', whatsapp: '+5218112345678', mensaje: 'hola' }
    );
    expect(result).toEqual({ ok: true, posicion: 5 });
    expect(global.fetch).toHaveBeenCalledWith('https://script.google.com/x', expect.objectContaining({
      method: 'POST',
      body: expect.stringContaining('"action":"apuntarme"')
    }));
  });
});

describe('submitTestimonio', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('posts testimonio with action=testimonio', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    await submitTestimonio('https://script.google.com/x', {
      nombre: 'Ana',
      texto: 'Encontré pareja',
      encontro_pareja: 'si'
    });
    expect(global.fetch).toHaveBeenCalledWith(
      'https://script.google.com/x',
      expect.objectContaining({
        body: expect.stringContaining('"action":"testimonio"')
      })
    );
  });
});
```

- [ ] **Step 2: Run, expect fail**

```bash
npm run test -- api
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/api.js`**

```js
import { parseCsv } from './csv.js';

export async function readSheet(csvUrl) {
  const res = await fetch(csvUrl, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Error leyendo Sheet (${res.status})`);
  }
  const text = await res.text();
  return parseCsv(text);
}

export function validateApuntarmePayload({ nombre, whatsapp }) {
  const errors = [];
  if (!nombre || !nombre.trim()) errors.push('Falta el nombre');
  if (!whatsapp || !whatsapp.trim()) errors.push('Falta el WhatsApp');
  else {
    const digits = whatsapp.replace(/\D/g, '');
    if (digits.length < 10) errors.push('WhatsApp debe tener al menos 10 dígitos');
  }
  return errors;
}

export async function submitApuntarme(endpoint, payload) {
  return postAction(endpoint, 'apuntarme', payload);
}

export async function submitTestimonio(endpoint, payload) {
  return postAction(endpoint, 'testimonio', payload);
}

async function postAction(endpoint, action, payload) {
  const res = await fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify({ action, ...payload }),
    redirect: 'follow'
  });
  if (!res.ok) throw new Error(`Error al enviar (${res.status})`);
  return res.json();
}
```

Note: Apps Script `doPost` doesn't accept `Content-Type: application/json` cleanly — it forces a CORS preflight. Sending without explicit Content-Type makes it a "simple request" and avoids preflight; Apps Script reads `e.postData.contents`.

- [ ] **Step 4: Run, expect pass**

```bash
npm run test -- api
```

Expected: PASS (8 tests).

- [ ] **Step 5: Commit**

```bash
git add tests/api.test.js src/api.js
git commit -m "feat(api): readSheet + submitApuntarme/Testimonio with validation"
```

---

## Task 6: Theme tokens and base styles

**Files:**
- Create: `src/themes/devocional.css`
- Modify: `src/styles.css`
- Modify: `tailwind.config.js`

**Why:** All visual variation lives in CSS custom properties. Switching themes = swapping one `<link>` tag. Tailwind reads tokens via `theme.extend.colors`.

- [ ] **Step 1: Create theme A tokens**

Create `src/themes/devocional.css`:

```css
:root {
  --color-bg: #F5EFE3;
  --color-surface: #FAF6EC;
  --color-text: #3A2E26;
  --color-text-muted: #6E5A4A;
  --color-accent: #B85C38;
  --color-gold: #D4A574;
  --color-border: #E5D9C2;

  --font-display: 'Cormorant Garamond', 'Cormorant', serif;
  --font-body: 'Inter', system-ui, sans-serif;

  --radius-sm: 4px;
  --radius-md: 12px;
  --radius-lg: 24px;

  --shadow-soft: 0 2px 8px rgba(58, 46, 38, 0.08);
}
```

- [ ] **Step 2: Update `src/styles.css`**

Replace contents:

```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;500;600;700&display=swap');
@import './themes/devocional.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html, body {
    background: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-body);
  }
  h1, h2, h3, .display {
    font-family: var(--font-display);
    font-weight: 500;
    letter-spacing: -0.01em;
  }
}

@layer components {
  .btn-primary {
    @apply inline-flex items-center justify-center px-6 py-3 rounded-full font-medium transition;
    background: var(--color-accent);
    color: var(--color-surface);
    box-shadow: var(--shadow-soft);
  }
  .btn-primary:active { transform: scale(0.98); }

  .card {
    @apply rounded-2xl p-5;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
  }

  .tab-bar {
    @apply fixed bottom-0 left-0 right-0 grid grid-cols-4 z-40;
    background: var(--color-surface);
    border-top: 1px solid var(--color-border);
    padding-bottom: env(safe-area-inset-bottom);
  }
  .tab-bar a {
    @apply py-3 text-center text-sm transition;
    color: var(--color-text-muted);
  }
  .tab-bar a[aria-current="page"] {
    color: var(--color-accent);
  }
}
```

- [ ] **Step 3: Update `tailwind.config.js`**

```js
export default {
  content: ['./index.html', './src/**/*.{js,html}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        ink: 'var(--color-text)',
        muted: 'var(--color-text-muted)',
        accent: 'var(--color-accent)',
        gold: 'var(--color-gold)',
        border: 'var(--color-border)'
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)'
      }
    }
  },
  plugins: []
};
```

- [ ] **Step 4: Smoke check dev server**

```bash
npm run dev
```

Page still shows "San Antonio — booting…", now with the cream background and dark coffee text. Stop server.

- [ ] **Step 5: Commit**

```bash
git add src/themes src/styles.css tailwind.config.js
git commit -m "feat(theme): devocional tokens + Tailwind integration"
```

---

## Task 7: App shell and router

**Files:**
- Modify: `index.html`
- Create: `src/router.js`
- Modify: `src/main.js`

**Why:** Hash-based routing keeps it simple (no server config needed for GH Pages). Tabs swap visible section, no full reload.

- [ ] **Step 1: Update `index.html` with shell**

Replace `<body>` content:

```html
<body class="min-h-screen pb-20">
  <main id="app" class="max-w-md mx-auto px-5 pt-8">
    <section data-route="home" class="route">Cargando…</section>
    <section data-route="cola" class="route hidden">Cargando…</section>
    <section data-route="historial" class="route hidden">Cargando…</section>
    <section data-route="testimonios" class="route hidden">Cargando…</section>
  </main>

  <nav class="tab-bar max-w-md mx-auto">
    <a href="#home" data-tab="home">Inicio</a>
    <a href="#cola" data-tab="cola">Cola</a>
    <a href="#historial" data-tab="historial">Historial</a>
    <a href="#testimonios" data-tab="testimonios">Testimonios</a>
  </nav>

  <div id="modal-root"></div>
  <script type="module" src="/src/main.js"></script>
</body>
```

- [ ] **Step 2: Create `src/router.js`**

```js
const ROUTES = ['home', 'cola', 'historial', 'testimonios'];
const DEFAULT = 'home';

export function initRouter(onRouteChange) {
  function handle() {
    const hash = window.location.hash.replace('#', '') || DEFAULT;
    const route = ROUTES.includes(hash) ? hash : DEFAULT;
    document.querySelectorAll('.route').forEach(el => {
      el.classList.toggle('hidden', el.dataset.route !== route);
    });
    document.querySelectorAll('.tab-bar a').forEach(a => {
      if (a.dataset.tab === route) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    if (onRouteChange) onRouteChange(route);
  }
  window.addEventListener('hashchange', handle);
  handle();
}
```

- [ ] **Step 3: Update `src/main.js`**

```js
import { initRouter } from './router.js';

initRouter(route => {
  console.log('route:', route);
});
```

- [ ] **Step 4: Manual smoke check**

```bash
npm run dev
```

Open the URL. You should see 4 tabs at the bottom. Tapping each updates the URL hash and the visible section. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add index.html src/router.js src/main.js
git commit -m "feat(router): hash routing with 4 tabs and section toggling"
```

---

## Task 8: Santo SVG and flip animation

**Files:**
- Create: `public/santo.svg`
- Create: `src/santo.js`

**Why:** The icon is identity. Inline SVG (via fetch) lets us animate stroke and rotation cleanly. Flipped upside-down on home when the cycle is active.

- [ ] **Step 1: Create `public/santo.svg`**

Place an abstract silhouette. Stroke `currentColor` so it inherits theme colors.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 280" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <!-- Halo -->
  <circle cx="100" cy="60" r="32" />
  <circle cx="100" cy="60" r="38" stroke-dasharray="2 4" />
  <!-- Cabeza -->
  <ellipse cx="100" cy="62" rx="20" ry="24" />
  <!-- Cuerpo (hábito) -->
  <path d="M 70 90 Q 100 96 130 90 L 145 240 Q 100 252 55 240 Z" />
  <!-- Cinturón -->
  <line x1="68" y1="160" x2="132" y2="160" />
  <!-- Niño Dios en brazo izquierdo -->
  <circle cx="78" cy="135" r="8" />
  <path d="M 70 145 Q 78 152 86 145" />
  <!-- Lirio en brazo derecho -->
  <line x1="135" y1="145" x2="135" y2="115" />
  <path d="M 130 115 Q 135 105 140 115 Q 138 110 135 110 Q 132 110 130 115 Z" />
  <!-- Manga -->
  <path d="M 130 100 Q 145 130 140 145" />
  <path d="M 70 100 Q 55 130 60 145" />
</svg>
```

- [ ] **Step 2: Create `src/santo.js`**

```js
let cached = null;

export async function loadSantoSvg() {
  if (cached) return cached;
  const res = await fetch('./santo.svg');
  cached = await res.text();
  return cached;
}

export async function renderSanto(container, { flipped = false } = {}) {
  const svg = await loadSantoSvg();
  container.innerHTML = svg;
  const el = container.querySelector('svg');
  el.classList.add('santo-svg');
  el.style.transition = 'transform 1.2s ease';
  el.style.transform = flipped ? 'rotate(180deg)' : 'rotate(0deg)';
}
```

- [ ] **Step 3: Add santo styles to `src/styles.css`**

Append inside `@layer components`:

```css
  .santo-svg {
    width: 70%;
    max-width: 240px;
    margin: 0 auto;
    display: block;
    color: var(--color-gold);
  }
```

- [ ] **Step 4: Smoke render in main**

Temporarily update `src/main.js`:

```js
import { initRouter } from './router.js';
import { renderSanto } from './santo.js';

initRouter(async route => {
  if (route === 'home') {
    const home = document.querySelector('[data-route="home"]');
    home.innerHTML = '<div class="santo-mount"></div>';
    renderSanto(home.querySelector('.santo-mount'), { flipped: true });
  }
});
```

```bash
npm run dev
```

Expected: home tab shows the upside-down santo silhouette in dorado on cream. Stop server.

- [ ] **Step 5: Commit**

```bash
git add public/santo.svg src/santo.js src/styles.css src/main.js
git commit -m "feat(santo): inline SVG silhouette with flip animation"
```

---

## Task 9: Configuration loader

**Files:**
- Create: `src/config.js`

**Why:** Centralize the URLs (CSV endpoints per pestaña, Apps Script endpoint). Reads from a global injected by `index.html` so non-developers can edit the URL without rebuilding.

- [ ] **Step 1: Add config block to `index.html`**

Insert before `<script type="module" src="/src/main.js"></script>`:

```html
<script>
  window.SAN_ANTONIO_CONFIG = {
    sheetCsvBase: 'PUT_PUBLISHED_SHEET_BASE_URL_HERE',
    appsScriptUrl: 'PUT_APPS_SCRIPT_EXEC_URL_HERE',
    turnoDays: 9,
    groupName: 'San Antonio'
  };
</script>
```

- [ ] **Step 2: Create `src/config.js`**

```js
const cfg = window.SAN_ANTONIO_CONFIG || {};

export const TURNO_DAYS = cfg.turnoDays ?? 9;
export const GROUP_NAME = cfg.groupName ?? 'San Antonio';
export const APPS_SCRIPT_URL = cfg.appsScriptUrl;

export function csvUrl(sheetGid) {
  if (!cfg.sheetCsvBase || cfg.sheetCsvBase.startsWith('PUT_')) {
    throw new Error('Configura sheetCsvBase en index.html');
  }
  return `${cfg.sheetCsvBase}&gid=${sheetGid}`;
}

export const SHEET_GIDS = {
  participantes: '0',
  turnos: '1',
  testimonios: '2',
  config: '3'
};
```

(GIDs reales se sustituirán al crear el Sheet — Task 16.)

- [ ] **Step 3: Commit**

```bash
git add index.html src/config.js
git commit -m "feat(config): centralize URLs and constants in window.SAN_ANTONIO_CONFIG"
```

---

## Task 10: Data store — fetch and assemble

**Files:**
- Create: `src/store.js`

**Why:** A single function that fetches all 4 pestañas in parallel and returns a denormalized "view model" that all UI screens consume. Keeps UI pure.

- [ ] **Step 1: Create `src/store.js`**

```js
import { readSheet } from './api.js';
import { csvUrl, SHEET_GIDS } from './config.js';
import { findActivo, getQueue, getCompleted, estimateStartDate, daysRemaining } from './queue.js';
import { parseDate } from './format.js';

export async function loadState() {
  const [participantes, turnos, testimonios, configRows] = await Promise.all([
    readSheet(csvUrl(SHEET_GIDS.participantes)),
    readSheet(csvUrl(SHEET_GIDS.turnos)),
    readSheet(csvUrl(SHEET_GIDS.testimonios)),
    readSheet(csvUrl(SHEET_GIDS.config))
  ]);

  const participanteById = Object.fromEntries(participantes.map(p => [p.id, p]));
  const config = Object.fromEntries((configRows[0] ? Object.entries(configRows[0]) : []));
  const turnoDays = Number(config.duracion_dias ?? 9);

  const activoTurno = findActivo(turnos);
  const activo = activoTurno ? {
    ...activoTurno,
    participante: participanteById[activoTurno.participante_id],
    fechaInicio: parseDate(activoTurno.fecha_inicio),
    fechaFinEst: parseDate(activoTurno.fecha_fin_est),
    diasRestantes: parseDate(activoTurno.fecha_fin_est)
      ? daysRemaining(new Date(), parseDate(activoTurno.fecha_fin_est))
      : null
  } : null;

  const queue = getQueue(turnos).map(t => {
    const startEst = activo?.fechaFinEst
      ? estimateStartDate(activo.fechaFinEst, Number(t.posicion), turnoDays)
      : null;
    const endEst = startEst ? new Date(startEst.getTime() + turnoDays * 86400000) : null;
    return {
      ...t,
      participante: participanteById[t.participante_id],
      fechaInicioEst: startEst,
      fechaFinEst: endEst
    };
  });

  const completed = getCompleted(turnos).map(t => ({
    ...t,
    participante: participanteById[t.participante_id],
    fechaFinReal: parseDate(t.fecha_fin_real)
  }));

  return { activo, queue, completed, testimonios, config, participanteById, turnoDays };
}
```

- [ ] **Step 2: Add a smoke test for the assembly**

Create `tests/store.test.js`:

```js
import { describe, it, expect, vi } from 'vitest';

vi.mock('../src/config.js', () => ({
  csvUrl: gid => `https://x?gid=${gid}`,
  SHEET_GIDS: { participantes: '0', turnos: '1', testimonios: '2', config: '3' },
  TURNO_DAYS: 9,
  APPS_SCRIPT_URL: 'https://script.x'
}));

import { loadState } from '../src/store.js';

describe('loadState', () => {
  it('assembles activo + queue + completed with participante refs', async () => {
    global.fetch = vi.fn(url => {
      const gid = new URL(url).searchParams.get('gid');
      const fixtures = {
        '0': 'id,nombre,whatsapp\np001,María,+521\np002,Ana,+521\np003,Lupe,+521',
        '1': 'id,participante_id,estado,posicion,fecha_inicio,fecha_fin_est,fecha_fin_real\nt001,p001,activo,,2026-05-05,2026-05-14,\nt002,p002,en_cola,1,,,\nt003,p003,en_cola,2,,,',
        '2': 'id,participante_id,texto,publicar\n',
        '3': 'duracion_dias,nombre_grupo\n9,Familiar'
      };
      return Promise.resolve({ ok: true, text: async () => fixtures[gid] });
    });

    const state = await loadState();
    expect(state.activo.participante.nombre).toBe('María');
    expect(state.queue).toHaveLength(2);
    expect(state.queue[0].participante.nombre).toBe('Ana');
    expect(state.queue[1].fechaInicioEst).toBeInstanceOf(Date);
  });
});
```

- [ ] **Step 3: Run tests**

```bash
npm run test
```

Expected: all tests pass (csv + format + queue + api + store).

- [ ] **Step 4: Commit**

```bash
git add src/store.js tests/store.test.js
git commit -m "feat(store): loadState assembles parallel fetches into view model"
```

---

## Task 11: UI — Home screen

**Files:**
- Create: `src/ui-home.js`
- Modify: `src/main.js`

**Why:** First screen users see. Shows santo, current holder, countdown, madrina message, and CTAs.

- [ ] **Step 1: Create `src/ui-home.js`**

```js
import { renderSanto } from './santo.js';
import { formatDate, countdownText } from './format.js';
import { openApuntarme } from './ui-apuntarme.js';
import { openOracion } from './ui-oracion.js';

export async function renderHome(container, state) {
  container.innerHTML = `
    <div class="text-center">
      <div class="santo-mount mb-6"></div>
      ${state.activo ? renderActivo(state.activo) : renderEmpty()}
      <div class="mt-6 space-y-3">
        <button class="btn-primary w-full" data-action="apuntarme">Apuntarme a la cola</button>
        <button class="card w-full text-left flex items-center gap-3" data-action="oracion">
          <span class="text-2xl">🕯</span>
          <span>
            <span class="block font-display text-lg leading-tight">Oración a San Antonio</span>
            <span class="block text-sm text-muted">Léela cuando lo necesites</span>
          </span>
        </button>
      </div>
      ${state.config?.mensaje_madrina ? `
        <p class="mt-8 text-sm italic text-muted px-4 leading-relaxed">"${escape(state.config.mensaje_madrina)}"</p>
      ` : ''}
    </div>
  `;

  await renderSanto(container.querySelector('.santo-mount'), { flipped: !!state.activo });

  container.querySelector('[data-action="apuntarme"]').addEventListener('click', () => openApuntarme(state));
  container.querySelector('[data-action="oracion"]').addEventListener('click', () => openOracion(state));
}

function renderActivo(a) {
  const days = a.diasRestantes;
  const countdown = days != null ? countdownText(days) : '—';
  const fin = a.fechaFinEst ? formatDate(a.fechaFinEst) : '';
  return `
    <p class="text-sm uppercase tracking-widest text-muted">Esta novena lo tiene</p>
    <h1 class="font-display text-4xl mt-2 mb-4">${escape(a.participante?.nombre ?? '—')}</h1>
    <p class="text-2xl font-display text-accent">${countdown}</p>
    ${fin ? `<p class="text-sm text-muted mt-1">hasta el ${fin}</p>` : ''}
  `;
}

function renderEmpty() {
  return `
    <p class="text-sm uppercase tracking-widest text-muted">Esta novena</p>
    <h1 class="font-display text-3xl mt-2">Aún no inicia</h1>
    <p class="text-sm text-muted mt-2">La madrina apuntará a la primera persona pronto.</p>
  `;
}

function escape(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
```

- [ ] **Step 2: Create stubs for the modals (so imports resolve)**

Create `src/ui-apuntarme.js`:

```js
export function openApuntarme(state) {
  alert('TODO: apuntarme modal');
}
```

Create `src/ui-oracion.js`:

```js
export function openOracion(state) {
  alert('TODO: oración modal');
}
```

- [ ] **Step 3: Update `src/main.js`**

```js
import { initRouter } from './router.js';
import { loadState } from './store.js';
import { renderHome } from './ui-home.js';

let state = null;

async function boot() {
  try {
    state = await loadState();
  } catch (err) {
    document.querySelector('[data-route="home"]').textContent = 'Error cargando datos: ' + err.message;
    return;
  }
  initRouter(route => render(route));
}

function render(route) {
  const container = document.querySelector(`[data-route="${route}"]`);
  if (!state) return;
  if (route === 'home') renderHome(container, state);
}

boot();
```

- [ ] **Step 4: Manual visual check**

Without a real Sheet yet, this will fail to load. We'll wire real data after Task 16. For now, swap to a fixture-based smoke test:

Temporarily replace the `boot()` call with:

```js
state = {
  activo: {
    participante: { nombre: 'María González' },
    fechaFinEst: new Date(2026, 4, 14),
    diasRestantes: 9
  },
  config: { mensaje_madrina: 'María está rezando por todas. Si quieres entrar a la fila, apúntate.' }
};
initRouter(route => render(route));
```

```bash
npm run dev
```

Expected: home shows santo flipped + name + "Faltan 9 días" + button + oración card + italic message. Restore `boot()` afterward.

- [ ] **Step 5: Commit**

```bash
git add src/ui-home.js src/ui-apuntarme.js src/ui-oracion.js src/main.js
git commit -m "feat(home): activo card with countdown and CTAs"
```

---

## Task 12: UI — Cola screen

**Files:**
- Create: `src/ui-queue.js`
- Modify: `src/main.js`

- [ ] **Step 1: Create `src/ui-queue.js`**

```js
import { formatRange, countdownText } from './format.js';
import { openApuntarme } from './ui-apuntarme.js';

export function renderQueue(container, state) {
  const a = state.activo;
  const items = state.queue;

  container.innerHTML = `
    <h2 class="font-display text-3xl mb-1">La cola</h2>
    <p class="text-sm text-muted mb-6">${items.length} ${items.length === 1 ? 'persona esperando' : 'personas esperando'}</p>

    <ol class="space-y-4 relative pl-6">
      <li class="relative">
        <span class="absolute -left-6 top-2 w-3 h-3 rounded-full bg-accent"></span>
        <div class="card">
          <p class="text-xs uppercase tracking-wider text-accent">Activa</p>
          <p class="font-display text-xl">${escape(a?.participante?.nombre ?? '—')}</p>
          ${a?.diasRestantes != null ? `<p class="text-sm text-muted">${countdownText(a.diasRestantes)}</p>` : ''}
        </div>
      </li>
      ${items.map((t, i) => `
        <li class="relative">
          <span class="absolute -left-6 top-2 w-3 h-3 rounded-full border-2 border-gold bg-bg"></span>
          <div class="card">
            <p class="text-xs uppercase tracking-wider text-muted">${i + 1}</p>
            <p class="font-display text-xl">${escape(t.participante?.nombre ?? '—')}</p>
            ${t.fechaInicioEst && t.fechaFinEst ? `<p class="text-sm text-muted">~ ${formatRange(t.fechaInicioEst, t.fechaFinEst)}</p>` : ''}
          </div>
        </li>
      `).join('')}
    </ol>

    <button class="btn-primary w-full mt-8" data-action="apuntarme">+ Apuntarme</button>
  `;

  container.querySelector('[data-action="apuntarme"]').addEventListener('click', () => openApuntarme(state));
}

function escape(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
```

- [ ] **Step 2: Wire into `src/main.js`**

Update the `render` function:

```js
function render(route) {
  if (!state) return;
  const container = document.querySelector(`[data-route="${route}"]`);
  if (route === 'home') renderHome(container, state);
  if (route === 'cola') renderQueue(container, state);
}
```

Add at top:
```js
import { renderQueue } from './ui-queue.js';
```

- [ ] **Step 3: Manual visual check**

Use the fixture-based state from Task 11 step 4, extending with sample queue entries:

```js
state = {
  activo: { participante: { nombre: 'María González' }, fechaFinEst: new Date(2026, 4, 14), diasRestantes: 4 },
  queue: [
    { participante: { nombre: 'Ana Cárdenas' }, fechaInicioEst: new Date(2026, 4, 14), fechaFinEst: new Date(2026, 4, 23) },
    { participante: { nombre: 'Lupe Hernández' }, fechaInicioEst: new Date(2026, 4, 23), fechaFinEst: new Date(2026, 5, 1) }
  ],
  config: {}
};
```

```bash
npm run dev
```

Tap "Cola" tab. Expected: timeline-style list with active card on top + 2 queue cards + apuntarme button.

- [ ] **Step 4: Commit**

```bash
git add src/ui-queue.js src/main.js
git commit -m "feat(queue): timeline view with activa + estimated dates"
```

---

## Task 13: UI — Apuntarme modal

**Files:**
- Modify: `src/ui-apuntarme.js`
- Create: `src/modal.js`

- [ ] **Step 1: Create generic modal helper `src/modal.js`**

```js
export function openModal(content) {
  const root = document.getElementById('modal-root');
  root.innerHTML = `
    <div class="modal-backdrop" data-close="true"></div>
    <div class="modal-sheet">
      <div class="modal-handle"></div>
      <div class="modal-content">${content}</div>
    </div>
  `;
  root.classList.add('modal-open');
  function close() {
    root.classList.remove('modal-open');
    setTimeout(() => { root.innerHTML = ''; }, 250);
  }
  root.querySelector('[data-close]').addEventListener('click', close);
  return { root, close };
}
```

- [ ] **Step 2: Add modal styles to `src/styles.css`**

Append inside `@layer components`:

```css
  #modal-root.modal-open {
    @apply fixed inset-0 z-50;
  }
  .modal-backdrop {
    @apply absolute inset-0;
    background: rgba(0,0,0,0.4);
    animation: fade-in 200ms ease;
  }
  .modal-sheet {
    @apply absolute bottom-0 left-0 right-0 max-w-md mx-auto rounded-t-3xl p-5;
    background: var(--color-surface);
    animation: slide-up 280ms cubic-bezier(0.2, 0.9, 0.3, 1);
    padding-bottom: calc(1.25rem + env(safe-area-inset-bottom));
  }
  .modal-handle {
    @apply w-10 h-1 rounded-full mx-auto mb-4;
    background: var(--color-border);
  }
  @keyframes fade-in { from { opacity: 0 } to { opacity: 1 } }
  @keyframes slide-up { from { transform: translateY(100%) } to { transform: translateY(0) } }
```

- [ ] **Step 3: Implement `src/ui-apuntarme.js`**

```js
import { openModal } from './modal.js';
import { submitApuntarme, validateApuntarmePayload } from './api.js';
import { APPS_SCRIPT_URL, TURNO_DAYS } from './config.js';
import { estimateStartDate, formatRange } from './format.js';

export function openApuntarme(state) {
  const { close, root } = openModal(`
    <h2 class="font-display text-2xl mb-1">Apuntarme a la cola</h2>
    <p class="text-sm text-muted mb-5">Vas a quedar la #${(state.queue?.length ?? 0) + 1} de la fila.</p>

    <form class="space-y-4">
      <label class="block">
        <span class="text-sm text-muted">Nombre completo</span>
        <input name="nombre" required class="form-input mt-1" autocomplete="name" />
      </label>
      <label class="block">
        <span class="text-sm text-muted">WhatsApp</span>
        <input name="whatsapp" required type="tel" placeholder="+52" class="form-input mt-1" autocomplete="tel" />
        <span class="text-xs text-muted mt-1 block">🔒 Solo la madrina lo verá</span>
      </label>
      <label class="block">
        <span class="text-sm text-muted">Mensaje opcional</span>
        <textarea name="mensaje" rows="2" class="form-input mt-1"></textarea>
      </label>

      <div class="errors text-sm text-accent"></div>

      <button type="submit" class="btn-primary w-full">Apuntarme</button>
    </form>
  `);

  const form = root.querySelector('form');
  const errBox = root.querySelector('.errors');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const errors = validateApuntarmePayload(data);
    if (errors.length) {
      errBox.innerHTML = errors.map(x => `<p>${x}</p>`).join('');
      return;
    }
    errBox.innerHTML = '';
    form.querySelector('button').textContent = 'Enviando…';
    try {
      const result = await submitApuntarme(APPS_SCRIPT_URL, data);
      const pos = result.posicion ?? '?';
      const ahora = state.activo?.fechaFinEst ?? new Date();
      const inicio = estimateStartDate(ahora, pos, TURNO_DAYS);
      const fin = new Date(inicio.getTime() + TURNO_DAYS * 86400000);
      root.querySelector('.modal-content').innerHTML = `
        <h2 class="font-display text-2xl mb-2">Listo</h2>
        <p>Eres la <strong>#${pos}</strong> de la cola.</p>
        <p class="text-muted text-sm mt-2">Te tocaría aproximadamente del ${formatRange(inicio, fin)}.</p>
        <p class="text-muted text-sm mt-2">La madrina te avisará por WhatsApp cuando se acerque tu turno.</p>
        <button class="btn-primary w-full mt-6" data-close-confirm>Cerrar</button>
      `;
      root.querySelector('[data-close-confirm]').addEventListener('click', close);
    } catch (err) {
      errBox.textContent = 'Error: ' + err.message;
      form.querySelector('button').textContent = 'Apuntarme';
    }
  });
}
```

- [ ] **Step 4: Add form-input style to `src/styles.css`**

Inside `@layer components`:

```css
  .form-input {
    @apply w-full rounded-xl px-4 py-3 text-base outline-none transition;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    color: var(--color-text);
  }
  .form-input:focus {
    border-color: var(--color-accent);
  }
```

- [ ] **Step 5: Manual smoke check**

```bash
npm run dev
```

From home, tap "Apuntarme a la cola" → modal slides up. Try empty submit → see errors. (Submit will fail until Apps Script is deployed; that's expected.)

- [ ] **Step 6: Commit**

```bash
git add src/modal.js src/ui-apuntarme.js src/styles.css
git commit -m "feat(apuntarme): bottom-sheet modal with form, validation, and confirmation"
```

---

## Task 14: UI — Historial screen

**Files:**
- Create: `src/ui-history.js`
- Modify: `src/main.js`

- [ ] **Step 1: Create `src/ui-history.js`**

```js
import { formatDate } from './format.js';

export function renderHistory(container, state) {
  const { completed, testimonios } = state;
  const testByPart = {};
  testimonios.forEach(t => {
    if (t.publicar === 'si') testByPart[t.participante_id] = t;
  });

  container.innerHTML = `
    <h2 class="font-display text-3xl mb-1">Historial</h2>
    <p class="text-sm text-muted mb-6">Las que ya pasaron por el santo.</p>

    ${completed.length === 0 ? `
      <p class="text-muted text-sm">Aún no hay historial.</p>
    ` : `
      <ol class="space-y-3">
        ${completed.map(c => {
          const test = testByPart[c.participante_id];
          const found = test?.encontro_pareja === 'si';
          return `
            <li class="card flex items-start gap-3">
              <span class="text-2xl">${found ? '🌹' : '·'}</span>
              <div class="flex-1">
                <p class="font-display text-lg">${escape(c.participante?.nombre ?? '—')}</p>
                <p class="text-sm text-muted">${c.fechaFinReal ? formatDate(c.fechaFinReal) : ''}</p>
                ${found ? '<p class="text-xs text-accent mt-1">Encontró pareja</p>' : ''}
              </div>
            </li>
          `;
        }).join('')}
      </ol>
    `}
  `;
}

function escape(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
```

- [ ] **Step 2: Wire into `src/main.js`**

```js
import { renderHistory } from './ui-history.js';
// inside render():
if (route === 'historial') renderHistory(container, state);
```

- [ ] **Step 3: Smoke check**

Tap "Historial" tab in browser. With fixture data showing some `completed` entries, list appears with rose 🌹 next to those whose testimony says they found a partner.

- [ ] **Step 4: Commit**

```bash
git add src/ui-history.js src/main.js
git commit -m "feat(history): chronological list of completed turns with rose marker"
```

---

## Task 15: UI — Testimonios screen + share testimonio

**Files:**
- Create: `src/ui-testimonios.js`
- Modify: `src/main.js`

- [ ] **Step 1: Create `src/ui-testimonios.js`**

```js
import { openModal } from './modal.js';
import { submitTestimonio } from './api.js';
import { APPS_SCRIPT_URL } from './config.js';
import { formatDate, parseDate } from './format.js';

export function renderTestimonios(container, state) {
  const all = state.testimonios.filter(t => t.publicar === 'si');
  const partById = state.participanteById ?? {};
  let filter = 'todos';

  function paint() {
    const list = filter === 'pareja' ? all.filter(t => t.encontro_pareja === 'si') : all;
    container.innerHTML = `
      <h2 class="font-display text-3xl mb-1">Testimonios</h2>
      <p class="text-sm text-muted mb-4">Lo que cuentan las que ya pasaron.</p>

      <div class="flex gap-2 mb-5 text-sm">
        <button data-f="todos" class="px-3 py-1 rounded-full ${filter === 'todos' ? 'bg-accent text-surface' : 'border border-border'}">Todos</button>
        <button data-f="pareja" class="px-3 py-1 rounded-full ${filter === 'pareja' ? 'bg-accent text-surface' : 'border border-border'}">Encontraron pareja</button>
      </div>

      ${list.length === 0 ? '<p class="text-muted text-sm">Sin testimonios aún.</p>' : `
        <div class="space-y-4">
          ${list.map(t => {
            const p = partById[t.participante_id];
            const d = parseDate(t.fecha);
            return `
              <article class="card">
                <header class="flex items-baseline justify-between mb-2">
                  <span class="font-display text-lg">${escape(p?.nombre ?? '—')}</span>
                  <span class="text-xs text-muted">${d ? formatDate(d) : ''}</span>
                </header>
                <p class="leading-relaxed">${escape(t.texto)}</p>
                ${t.encontro_pareja === 'si' ? '<p class="text-xs text-accent mt-3">🌹 Encontró pareja</p>' : ''}
              </article>
            `;
          }).join('')}
        </div>
      `}

      <button class="btn-primary w-full mt-8" data-action="share">Compartir mi testimonio</button>
    `;

    container.querySelectorAll('[data-f]').forEach(b => b.addEventListener('click', () => {
      filter = b.dataset.f;
      paint();
    }));

    container.querySelector('[data-action="share"]').addEventListener('click', openShareTestimonio);
  }

  paint();
}

function openShareTestimonio() {
  const { close, root } = openModal(`
    <h2 class="font-display text-2xl mb-2">Comparte tu testimonio</h2>
    <p class="text-sm text-muted mb-5">La madrina lo aprobará antes de publicar.</p>
    <form class="space-y-4">
      <label class="block">
        <span class="text-sm text-muted">Tu nombre</span>
        <input name="nombre" required class="form-input mt-1" />
      </label>
      <label class="block">
        <span class="text-sm text-muted">¿Encontraste pareja?</span>
        <select name="encontro_pareja" class="form-input mt-1">
          <option value="si">Sí</option>
          <option value="proceso">En proceso</option>
          <option value="no">Aún no</option>
        </select>
      </label>
      <label class="block">
        <span class="text-sm text-muted">Tu testimonio</span>
        <textarea name="texto" required rows="5" class="form-input mt-1"></textarea>
      </label>
      <div class="errors text-sm text-accent"></div>
      <button type="submit" class="btn-primary w-full">Enviar</button>
    </form>
  `);

  const form = root.querySelector('form');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    if (!data.nombre.trim() || !data.texto.trim()) {
      root.querySelector('.errors').textContent = 'Falta nombre o testimonio';
      return;
    }
    form.querySelector('button').textContent = 'Enviando…';
    try {
      await submitTestimonio(APPS_SCRIPT_URL, data);
      root.querySelector('.modal-content').innerHTML = `
        <h2 class="font-display text-2xl mb-2">Gracias</h2>
        <p class="text-muted text-sm mb-6">La madrina lo revisará y publicará pronto.</p>
        <button class="btn-primary w-full" data-close-confirm>Cerrar</button>
      `;
      root.querySelector('[data-close-confirm]').addEventListener('click', close);
    } catch (err) {
      root.querySelector('.errors').textContent = 'Error: ' + err.message;
      form.querySelector('button').textContent = 'Enviar';
    }
  });
}

function escape(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
```

- [ ] **Step 2: Wire into `src/main.js`**

```js
import { renderTestimonios } from './ui-testimonios.js';
// inside render():
if (route === 'testimonios') renderTestimonios(container, state);
```

- [ ] **Step 3: Smoke check**

Tap "Testimonios" tab. Filter buttons toggle. "Compartir" opens modal.

- [ ] **Step 4: Commit**

```bash
git add src/ui-testimonios.js src/main.js
git commit -m "feat(testimonios): list with filter and share form"
```

---

## Task 16: UI — Oración modal

**Files:**
- Modify: `src/ui-oracion.js`

- [ ] **Step 1: Implement `src/ui-oracion.js`**

```js
import { openModal } from './modal.js';

export function openOracion(state) {
  const text = state.config?.oracion_principal ?? 'La madrina aún no ha cargado la oración.';
  const { root, close } = openModal(`
    <h2 class="font-display text-2xl mb-1">Oración a San Antonio</h2>
    <p class="text-xs uppercase tracking-widest text-muted mb-5">Para los 9 días</p>
    <div class="prose prose-sm whitespace-pre-line leading-relaxed text-ink">${escape(text)}</div>
    <div class="flex gap-3 mt-6">
      <button class="btn-primary flex-1" data-action="share">Compartir</button>
      <button class="card flex-1 text-center" data-action="close">Cerrar</button>
    </div>
  `);

  root.querySelector('[data-action="share"]').addEventListener('click', async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Oración a San Antonio', text });
      } catch (_) { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(text);
      alert('Oración copiada al portapapeles');
    }
  });

  root.querySelector('[data-action="close"]').addEventListener('click', close);
}

function escape(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
```

- [ ] **Step 2: Smoke check**

From home, tap "Oración a San Antonio" card → modal opens with text. "Compartir" triggers native share or copies to clipboard.

- [ ] **Step 3: Commit**

```bash
git add src/ui-oracion.js
git commit -m "feat(oracion): modal with text and native share"
```

---

## Task 17: Apps Script doPost endpoint

**Files:**
- Create: `apps-script/Code.gs`
- Create: `apps-script/README.md`

**Why:** This is the only write path. ~50 lines. Validates payload, appends row to the right pestaña, returns position.

- [ ] **Step 1: Create `apps-script/Code.gs`**

```javascript
const SHEET_ID = 'PUT_THE_SHEET_ID_HERE';
const TAB_PARTICIPANTES = 'participantes';
const TAB_TURNOS = 'turnos';
const TAB_TESTIMONIOS = 'testimonios';

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;
    if (action === 'apuntarme') return ok(handleApuntarme(payload));
    if (action === 'testimonio') return ok(handleTestimonio(payload));
    return fail('Unknown action: ' + action);
  } catch (err) {
    return fail(err.message);
  }
}

function handleApuntarme(p) {
  if (!p.nombre || !p.whatsapp) throw new Error('Faltan datos');
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const partTab = ss.getSheetByName(TAB_PARTICIPANTES);
  const turnosTab = ss.getSheetByName(TAB_TURNOS);

  const participanteId = 'p' + Date.now();
  const turnoId = 't' + Date.now();
  const today = formatToday_();

  partTab.appendRow([
    participanteId, p.nombre.trim(), p.whatsapp.trim(),
    today, 'activa', p.mensaje || ''
  ]);

  const turnos = turnosTab.getDataRange().getValues();
  const enColaCount = turnos.filter(r => r[2] === 'en_cola').length;
  const posicion = enColaCount + 1;

  turnosTab.appendRow([turnoId, participanteId, 'en_cola', posicion, '', '', '']);

  return { ok: true, posicion: posicion, participante_id: participanteId };
}

function handleTestimonio(p) {
  if (!p.nombre || !p.texto) throw new Error('Faltan datos');
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const partTab = ss.getSheetByName(TAB_PARTICIPANTES);
  const testTab = ss.getSheetByName(TAB_TESTIMONIOS);

  const rows = partTab.getDataRange().getValues();
  const match = rows.find(r => String(r[1]).trim().toLowerCase() === p.nombre.trim().toLowerCase());
  const participanteId = match ? match[0] : ('p' + Date.now());

  testTab.appendRow([
    'ts' + Date.now(),
    participanteId,
    formatToday_(),
    p.encontro_pareja || 'proceso',
    p.texto,
    'no'
  ]);
  return { ok: true };
}

function formatToday_() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function ok(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function fail(msg) {
  return ContentService.createTextOutput(JSON.stringify({ ok: false, error: msg }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

- [ ] **Step 2: Create `apps-script/README.md` with deploy steps**

```markdown
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
```

- [ ] **Step 3: Commit**

```bash
git add apps-script/
git commit -m "feat(apps-script): doPost handler for apuntarme + testimonio"
```

---

## Task 18: Sheet template documentation

**Files:**
- Create: `docs/sheet-template.md`

- [ ] **Step 1: Create `docs/sheet-template.md`**

```markdown
# Setup del Google Sheet

## 1. Crear el Sheet

Crea un Sheet nuevo en Drive llamado "San Antonio — Datos". Crea estas 4 pestañas (en este orden):

### Pestaña `participantes`
| id | nombre | whatsapp | fecha_alta | estado | notas |

### Pestaña `turnos`
| id | participante_id | estado | posicion | fecha_inicio | fecha_fin_est | fecha_fin_real |

### Pestaña `testimonios`
| id | participante_id | fecha | encontro_pareja | texto | publicar |

### Pestaña `config`
| duracion_dias | nombre_grupo | mensaje_madrina | oracion_principal |
| 9 | San Antonio Familiar | (texto que sale en home) | (texto largo de la oración) |

Llena la pestaña `config` con UNA fila debajo del header.

## 2. Publicar como CSV

- Archivo → Compartir → Publicar en la web.
- "Documento entero" o pestaña por pestaña; el frontend usa la URL base con `&gid=<gid>`.
- En "Vínculo": elige "Valores separados por comas (.csv)".
- Click "Publicar".

Copia la URL base: `https://docs.google.com/spreadsheets/d/e/<KEY>/pub?output=csv`.

## 3. Encontrar los GIDs de cada pestaña

Click en cada pestaña; la URL del navegador termina en `#gid=NNNNN`. Copia los 4 números.

## 4. Pegar en `index.html`

```js
window.SAN_ANTONIO_CONFIG = {
  sheetCsvBase: 'https://docs.google.com/spreadsheets/d/e/<KEY>/pub?output=csv',
  appsScriptUrl: '...',
  turnoDays: 9,
  groupName: 'San Antonio'
};
```

Y en `src/config.js`:

```js
export const SHEET_GIDS = {
  participantes: 'GID_DE_PARTICIPANTES',
  turnos: 'GID_DE_TURNOS',
  testimonios: 'GID_DE_TESTIMONIOS',
  config: 'GID_DE_CONFIG'
};
```

## 5. Compartir con la madrina

- Click "Compartir" en el Sheet.
- Agrega el email de la madrina como Editora.
- Ella podrá editar todo desde Drive: reordenar la cola, marcar completados, aprobar testimonios.

## Operaciones diarias de la madrina

- **Promover el siguiente turno:** abrir `turnos`, en la fila `activo` cambiar a `completado`, llenar `fecha_fin_real`. Tomar la siguiente fila `en_cola` (posición 1) y cambiarla a `activo`, poner `fecha_inicio = hoy`, `fecha_fin_est = +9 días`.
- **Aprobar un testimonio:** abrir `testimonios`, cambiar `publicar` de `no` a `si`.
- **Reordenar la cola:** editar la columna `posicion` de las filas `en_cola`.
- **Editar mensaje de home:** abrir `config`, editar `mensaje_madrina`.
```

- [ ] **Step 2: Commit**

```bash
git add docs/sheet-template.md
git commit -m "docs: Google Sheet template and madrina daily ops"
```

---

## Task 19: Theme variant — Minimalista Sagrado (D)

**Files:**
- Create: `src/themes/minimalista.css`
- Modify: `src/styles.css` (comment showing how to swap)

- [ ] **Step 1: Create `src/themes/minimalista.css`**

```css
:root {
  --color-bg: #0F0F0F;
  --color-surface: #1A1A1A;
  --color-text: #F5F5F5;
  --color-text-muted: #888;
  --color-accent: #C9A961;
  --color-gold: #C9A961;
  --color-border: #2A2A2A;

  --font-display: 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;

  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;

  --shadow-soft: none;
}
```

- [ ] **Step 2: Document the swap in `src/styles.css`**

Top of file, replace the theme import line:

```css
/* Tema activo. Para cambiar, comenta uno y descomenta otro. */
@import './themes/devocional.css';
/* @import './themes/minimalista.css'; */
```

- [ ] **Step 3: Manual visual check**

Comment devocional and uncomment minimalista. Run `npm run dev`. App debe mostrarse en dark con acento dorado. Restaura tema A.

- [ ] **Step 4: Commit**

```bash
git add src/themes/minimalista.css src/styles.css
git commit -m "feat(theme): minimalista variant + swap-via-import pattern"
```

---

## Task 20: GitHub Pages deploy

**Files:**
- Create: `.github/workflows/deploy.yml`
- Modify: `vite.config.js`
- Modify: `README.md`

- [ ] **Step 1: Update `vite.config.js` with base path**

```js
import { defineConfig } from 'vite';

const REPO = 'san-antonio';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? `/${REPO}/` : './',
  build: { outDir: 'dist', sourcemap: true }
});
```

- [ ] **Step 2: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run test
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

- [ ] **Step 3: Append deploy section to `README.md`**

```markdown
## Deploy

Push a `main` → GitHub Actions buildea y publica en GitHub Pages automáticamente.

Antes del primer deploy:

1. Crear repo en GitHub.
2. Push.
3. Settings → Pages → Source: GitHub Actions.
4. Editar `index.html` con la URL final del Sheet y de Apps Script.
5. Commit + push → live en `https://<usuario>.github.io/san-antonio/`.
```

- [ ] **Step 4: Final smoke check**

```bash
npm run test
npm run build
npm run preview
```

Open the preview URL. App carga (sin datos reales aún, mostrará error o vacío). Cierra preview.

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/deploy.yml vite.config.js README.md
git commit -m "ci: GitHub Pages deploy via Actions on push to main"
```

---

## Task 21: End-to-end manual verification

**No files. Just ritual.**

- [ ] **Step 1: Set up the real Sheet**

Sigue `docs/sheet-template.md` paso a paso. Crea pestañas, llena `config` con datos reales, agrega 1 participante de prueba en `participantes` y un turno `activo` para esa persona en `turnos`.

- [ ] **Step 2: Deploy Apps Script**

Sigue `apps-script/README.md`. Pega `Code.gs`, reemplaza `SHEET_ID`, despliega como Web App, copia URL.

- [ ] **Step 3: Configurar URLs en `index.html`**

Reemplaza `PUT_PUBLISHED_SHEET_BASE_URL_HERE` y `PUT_APPS_SCRIPT_EXEC_URL_HERE`. Reemplaza GIDs en `src/config.js`.

- [ ] **Step 4: Run dev server con datos reales**

```bash
npm run dev
```

- Home → muestra el activo real.
- Cola → vacía aún.
- Apuntarme con datos de prueba → confirma "Eres la #1".
- Verifica en Drive: el Sheet tiene 1 fila nueva en `participantes` y 1 en `turnos`.
- Recarga la web → la cola muestra la persona apuntada.
- Probar testimonio → llega a `testimonios` con `publicar=no`.

- [ ] **Step 5: Commit final config**

```bash
git add index.html src/config.js
git commit -m "config: wire real Sheet and Apps Script URLs"
git push -u origin main
```

- [ ] **Step 6: Validar deploy en GH Pages**

GitHub → Actions → confirma que el workflow corrió. Visita la URL de Pages. App carga con datos reales.

- [ ] **Step 7: Compartir con la madrina**

Mándale a la madrina:
- URL de la web pública.
- Acceso de editora al Sheet.
- Link a `docs/sheet-template.md` para que sepa cómo operar el día a día.

---

## Self-review notes

- Spec coverage: cada sección del spec tiene tarea correspondiente (stack=Task 1, modelo=Task 18, pantallas=Tasks 11-16, tema=Tasks 6 + 19, Apps Script=Task 17, deploy=Task 20).
- TDD aplicado a lógica pura (csv, format, queue, api, store). UI verificada manualmente con fixtures + smoke checks.
- Sin placeholders abiertos en código (los `PUT_X_HERE` son configuración explícita que el usuario reemplaza en Task 21).
- Type/name consistencia: `findActivo`, `getQueue`, `getCompleted`, `validateApuntarmePayload`, `submitApuntarme`, `submitTestimonio`, `loadState` — usados consistentemente entre tasks.
- Tema A es default; tema D es opcional swap via comentario. B y C quedan fuera de v1 explícitamente (spec sección 7 los menciona como follow-up).
