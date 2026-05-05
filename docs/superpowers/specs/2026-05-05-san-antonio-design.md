# San Antonio — Design Spec

**Fecha:** 2026-05-05
**Estado:** Diseño aprobado, listo para plan de implementación
**Audiencia:** Familia / amigas cercanas (grupo privado e íntimo)

---

## 1. Contexto y propósito

Webapp mobile-first para coordinar el novenario de San Antonio dentro de un grupo cerrado. La tradición mexicana consiste en voltear de cabeza la imagen del santo y rezarle durante 9 días para conseguir pareja. La app traduce esa práctica a una **lista de espera ordenada (FIFO)** con turnos de 9 días, donde todas las participantes saben quién tiene el santo en cada momento, cuánto le falta y cuándo les toca.

**Quién usa la app:**
- **Participantes** — entran por link público, ven la cola, se apuntan, comparten testimonio.
- **Madrina del santo** — administra todo. Su "panel admin" es el propio Google Sheet en Drive.

---

## 2. Goals / Non-goals

### Goals

- Saber siempre quién tiene el santo y cuánto tiempo le queda.
- Tener una cola ordenada y predecible que cualquiera pueda consultar.
- Permitir que cualquiera se apunte sin fricción (sin cuentas, sin passwords).
- Dar a la madrina control total sin requerir que aprenda una UI nueva.
- Conservar privacidad: nombres en público, teléfonos solo para la madrina.
- Mantener historia y testimonios para que la app gane sentido con el tiempo.
- Costo $0 / mes y mantenimiento mínimo.

### Non-goals (v1)

- Auth real (login, sesiones, recuperación de contraseña).
- Notificaciones push o email automáticos. La madrina avisa por WhatsApp manualmente.
- Geolocalización o mapa físico. El "mapa" es solo la línea de la cola.
- Multi-grupo / multi-tenant. La app sirve a un solo grupo familiar.
- Foto de perfil de cada participante. Solo nombres.
- Rotación automática del turno. La madrina marca completado manualmente.
- Pagos, donaciones, o cualquier integración financiera.

---

## 3. Stack técnico

**Decisión: GitHub Pages + Google Sheet + Apps Script (doPost) — stack 100% Google + Git.**

```
Frontend estático (GitHub Pages)
   ├── HTML + Tailwind + JS vanilla (o Astro si conviene)
   ├── Lectura: fetch al Sheet publicado como CSV
   └── Escritura: POST al endpoint de Apps Script
            │
            ▼
   Apps Script doPost (script.google.com)
   ├── Valida input (nombre, whatsapp)
   ├── Appendea fila en pestaña correspondiente
   └── Devuelve confirmación
            │
            ▼
   Google Sheet (la base de datos + la admin UI)
   ├── La madrina edita aquí en Drive
   └── Historial de versiones nativo de Google
```

**Razones de la decisión:**

- **GitHub Pages** sobre Apps Script Web App: permite UI moderna (Tailwind, animaciones, fuentes premium), URL custom, deploys por `git push`, y desarrollo local fluido con Claude Code.
- **Google Sheet como DB + admin UI** elimina toda la complejidad de un panel de administración. La madrina ya sabe usar Sheets.
- **Sin Supabase / sin backend custom**: el usuario explícitamente pidió no Supabase. El stack queda en herramientas que la madrina ya tiene (Google Drive).
- **Sin Storage**: la imagen del santo es un SVG embebido en el repo. Nunca cambia.

**Costo de mantenimiento:** $0/mes. Cuotas de GitHub Pages y Apps Script son ampliamente suficientes para un grupo familiar.

---

## 4. Modelo de datos (Google Sheet, 4 pestañas)

### Pestaña `participantes`

| Columna | Tipo | Notas |
|---|---|---|
| `id` | string | `p001`, `p002`, … (la madrina lo asigna o se genera al apuntarse) |
| `nombre` | string | Nombre completo |
| `whatsapp` | string | Privado. Nunca lo lee el frontend. |
| `fecha_alta` | date | Cuándo se apuntó |
| `estado` | enum | `activa` / `pausada` / `retirada` |
| `notas` | string | Madrina escribe libre. Privado. |

### Pestaña `turnos`

Una sola tabla cubre cola, activo e historial. Filtros por `estado`.

| Columna | Tipo | Notas |
|---|---|---|
| `id` | string | `t001`, `t002`, … |
| `participante_id` | FK | Referencia a `participantes.id` |
| `estado` | enum | `en_cola` / `activo` / `completado` / `saltado` |
| `posicion` | int | Solo si `en_cola`. Define orden FIFO. |
| `fecha_inicio` | date | Solo si `activo` o `completado` |
| `fecha_fin_est` | date | `fecha_inicio + 9 días` |
| `fecha_fin_real` | date | Cuándo realmente terminó |

**Reglas:**
- Solo una fila puede tener `estado = activo` a la vez (regla social, no técnica; la madrina la cuida).
- `posicion` solo importa para filas `en_cola`. Se reordena con drag & drop en Sheets.
- La cuenta regresiva del home se calcula como `fecha_fin_est - hoy` de la fila `activo`.

### Pestaña `testimonios`

| Columna | Tipo | Notas |
|---|---|---|
| `id` | string | `ts01`, `ts02`, … |
| `participante_id` | FK | |
| `fecha` | date | Cuándo se envió |
| `encontro_pareja` | enum | `si` / `no` / `proceso` |
| `texto` | string | Testimonio |
| `publicar` | enum | `si` / `no`. La madrina aprueba antes de publicar. |

### Pestaña `config` (1 fila singleton)

| Columna | Valor por defecto |
|---|---|
| `duracion_dias` | `9` |
| `nombre_grupo` | `San Antonio Familiar` |
| `mensaje_madrina` | (texto editable que sale en home) |
| `oracion_principal` | (texto largo de la oración) |

---

## 5. Pantallas y flujos

### Navegación principal

Bottom tab bar de 4 tabs (siempre visible):

```
[ Inicio ]  [ Cola ]  [ Historial ]  [ Testimonios ]
```

Acciones contextuales como modales bottom-sheet:
- **Apuntarme** (CTA prominente en Inicio y Cola)
- **Oración a San Antonio** (card en Inicio)
- **Compartir testimonio** (CTA en Testimonios)

### Pantalla 1 · Inicio (dashboard)

Elementos verticales (mobile):

1. Imagen del santo grande, centrada, volteada de cabeza.
2. Texto: *"Esta novena lo tiene"* + nombre grande del activo.
3. Cuenta regresiva: `Faltan X días` + fecha exacta de fin.
4. Mensaje de la madrina (de `config.mensaje_madrina`).
5. CTA principal: `Apuntarme a la cola` (botón grande).
6. Card secundaria: `🕯 Oración a San Antonio` → modal.

### Pantalla 2 · Cola

Línea vertical con estados:

```
●  [ACTIVA] Nombre — X días restantes
│
○  1. Nombre — fechas estimadas
│
○  2. Nombre — fechas estimadas
│
…
```

- Solo nombres y fechas. Sin teléfonos, sin fotos.
- Fecha estimada calculada cliente-side: `fecha_inicio_activo + 9 × posicion`.
- Footer: CTA `+ Apuntarme`.

### Pantalla 3 · Apuntarme (modal bottom-sheet)

Form:
- Nombre completo (required)
- WhatsApp (required, con disclaimer "🔒 Solo la madrina lo verá")
- Mensaje opcional

Submit → POST a Apps Script → confirmación:
> *"Listo. Eres la #N de la cola. Te tocaría aproximadamente del [fecha] al [fecha]. La madrina te avisará por WhatsApp cuando se acerque tu turno."*

### Pantalla 4 · Historial

Cards en orden cronológico inverso:

```
🌹 Nombre        mes año · 9 días
   ✓ Encontró pareja

   Nombre        mes año · 9 días
   — Aún esperando
```

- Tap → si existe testimonio publicado, lo abre.

### Pantalla 5 · Testimonios

- Cards verticales con texto del testimonio.
- Encabezado: nombre + fecha + badge si encontró pareja.
- Filtro: `Todos · Encontraron pareja`.
- CTA: `Compartir mi testimonio` → modal corto. Madrina aprueba via columna `publicar`.

### Modal · Oración a San Antonio

- Texto editable desde Sheet (`config.oracion_principal`).
- Botón `Compartir` → share API nativo del navegador.

---

## 6. Flujo del ciclo de turno

```
1. Persona se apunta vía web
   → POST a Apps Script
   → appendea fila en `participantes` (nueva si no existe)
   → appendea fila en `turnos` con estado=en_cola, posicion=last+1

2. Le toca: madrina abre Sheet en Drive
   → cambia estado de su turno a "activo"
   → pone fecha_inicio = hoy
   → fecha_fin_est = hoy + 9 días

3. Frontend (al recargar) detecta nuevo activo
   → home cambia automáticamente

4. Día 9: cuenta regresiva llega a 0

5. Madrina marca "completado" en Sheet
   → pone fecha_fin_real
   → promueve a la siguiente: cambia su estado de "en_cola" a "activo"

6. (Opcional) Persona envía testimonio
   → POST a Apps Script → fila en `testimonios` con publicar=no
   → Madrina cambia publicar=si cuando aprueba
```

Toda la cadencia es manual por la madrina. Cero automatización compleja, máxima flexibilidad humana.

---

## 7. Estilos visuales — 4 direcciones para mockupear

Los 4 comparten estructura. Solo cambian variables CSS (paleta + fuentes + tratamiento del santo).

### A · Devocional Cálido *(reverente moderno)* — RECOMENDADO arranque

- **Mood:** vela prendida en una recámara. Íntimo, contemporáneo, espiritual sin ortodoxia.
- **Paleta:** crema `#F5EFE3`, terracota `#B85C38`, dorado suave `#D4A574`, tinta café `#3A2E26`.
- **Tipografía:** títulos `Cormorant Garamond`, cuerpo `Inter` o `DM Sans`.
- **Santo:** line-art dorado fino sobre crema. Animación lenta de rotación cuando está activo.

### B · Editorial Acuarela *(romántico contemplativo)*

- **Mood:** libro de poesía religiosa de los 50s.
- **Paleta:** papel envejecido `#FBF7F0`, rosa polvoso `#C99A9A`, verde salvia `#9BAA8E`, sepia `#8B6F47`.
- **Tipografía:** títulos `Playfair Display` o `Cormorant SC`, cuerpo `EB Garamond`.
- **Santo:** acuarela suave, manchas a mano alzada.

### C · Folklórico Vivo *(alegre mexicano)*

- **Mood:** fiesta familiar, papel picado, alegría comunitaria.
- **Paleta:** blanco hueso `#FFFCF7`, rojo `#D43F3F`, amarillo solar `#F4B942`, verde `#3A7D44`, rosa mexicano `#D63384`.
- **Tipografía:** títulos `Lobster` o `Caveat`, cuerpo `Work Sans`.
- **Santo:** vector estilo Otomí, patrones geométricos, guirnaldas SVG.

### D · Minimalista Sagrado *(zen)* — RECOMENDADO contraste

- **Mood:** capilla moderna vacía. Espacio, silencio, una sola vela.
- **Paleta:** blanco puro `#FFFFFF` o casi-negro `#0F0F0F` (dark default), un acento dorado `#C9A961`.
- **Tipografía:** `Inter` o `Söhne`, sin serif.
- **Santo:** silueta abstracta en una sola línea continua dorada.

### Plan visual

1. Implementar la app funcional con tema **A**.
2. Variables CSS (`tokens.css`) limpias para cambiar de tema con 1 archivo.
3. Mockup-ear A + D primero (los más opuestos). Si no convencen, probar B y C.
4. Decidir final con el usuario antes de pulir detalles.

---

## 8. Tono y copy

Cálido, íntimo, reverente sin ser solemne. Tutea. Mexicano sin caer en regionalismos cerrados.

**Ejemplos:**
- *"Esta novena lo tiene…"*
- *"Faltan 4 días para que pase a la siguiente."*
- *"Apúntate a la cola. La madrina te avisa cuando se acerque tu turno."*
- *"Listo. Eres la #5. Te tocaría del 20 al 29 de junio."*

Evitar:
- Lenguaje corporativo ("usuarios", "registrarse", "submit").
- Tono solemne excesivo ("hermana en la fe").
- Emojis en exceso. Permitidos los puntuales: 🕯 🌹 🙏 (uno por sección máximo).

---

## 9. Privacidad y seguridad (modelo de confianza)

**Premisa:** grupo cerrado de friends and family. Modelo de confianza social, no técnica.

- **Sin auth.** Cualquiera con la URL entra. La URL se comparte por WhatsApp privadamente.
- **Datos públicos** (visibles a cualquier visitante): nombres, fechas, testimonios marcados `publicar=si`, oración, mensaje de madrina.
- **Datos privados** (solo en Sheet, solo madrina): teléfonos, notas, testimonios `publicar=no`.
- **Apps Script doPost** valida formato pero no autentica al emisor. Confiamos en convención social.
- **Mitigación de spam:** el endpoint puede rate-limit por IP; la madrina puede borrar filas basura del Sheet en segundos.

**Si v2 necesita más rigor:** introducir un PIN de 4 dígitos compartido por WhatsApp para apuntarse, o magic links generados por madrina. Fuera de scope para v1.

---

## 10. Decisiones clave (resumen)

| Tema | Decisión | Por qué |
|---|---|---|
| Auth | Ninguno. Link público. | Friends and family. "No quiero rollo." |
| DB | Google Sheet. | La madrina ya sabe usar Sheets. Cero UI admin custom. |
| Backend | Apps Script doPost. | Una pieza chiquita y aislada para escrituras. |
| Frontend | GitHub Pages estático. | UI moderna, deploys por git push, dominio custom. |
| Imagen del santo | SVG embebido en repo. | Nunca cambia. Cero storage. |
| Privacidad teléfonos | Solo en Sheet. Madrina = único contacto. | Privacy-by-design sin auth. |
| Rotación de turno | Manual por madrina. | Flexibilidad humana > automatización rígida. |
| Tono | Cálido, íntimo, tuteo. | Coherente con audiencia familiar. |

---

## 11. Open items / decisiones diferidas

- **Hosting del Sheet:** ¿cuenta personal de la madrina o cuenta del proyecto compartida? Decidir antes de deploy.
- **Dominio custom:** ¿usar `usuario.github.io/san-antonio` o comprar dominio propio? Decidir antes de compartir con familia.
- **Short link:** ¿bit.ly o servicio propio? Cosmético, no bloqueante.
- **Idioma de la oración:** ¿texto canónico o versión adaptada? Pregunta a la madrina.
- **Cantidad inicial de participantes:** estimar antes de lanzar para validar que el modelo (cola FIFO) funciona en la práctica.

---

## 12. Orden de implementación sugerido

1. Setup repo + GitHub Pages + Tailwind base.
2. Crear Sheet con las 4 pestañas y datos seed (5 participantes ficticias).
3. Publicar Sheet como CSV. Frontend lee y renderiza Inicio + Cola.
4. Apps Script doPost para "apuntarme". Conectar form modal.
5. Pantallas Historial y Testimonios.
6. Modal Oración + share nativo.
7. Tema visual A completo (Cormorant + paleta cálida + santo SVG).
8. Variables CSS para temas. Mockup tema D.
9. Comparación visual con usuario, decisión final.
10. Pulido de animaciones (rotación del santo, transiciones).
11. Compartir con la madrina para sembrar datos reales.
12. Compartir URL con la familia.

---

**Próximo paso:** review humano de este spec → plan de implementación detallado vía `superpowers:writing-plans`.
