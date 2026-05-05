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
