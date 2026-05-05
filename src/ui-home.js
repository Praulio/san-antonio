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
      ${state.config?.mensaje_principal ? `
        <p class="mt-8 text-sm italic text-muted px-4 leading-relaxed">"${escape(state.config.mensaje_principal)}"</p>
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
