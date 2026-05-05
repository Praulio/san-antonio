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
