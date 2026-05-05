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
