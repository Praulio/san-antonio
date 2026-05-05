import { openModal } from './modal.js';

export function openOracion(state) {
  const text = state.config?.oracion_principal ?? 'Aún no se ha cargado la oración.';
  const { root, close } = openModal(`
    <h2 class="font-display text-2xl mb-1">Oración a San Antonio</h2>
    <p class="text-xs uppercase tracking-widest text-muted mb-5">Para los 9 días</p>
    <div class="prose prose-sm whitespace-pre-line leading-relaxed text-ink">${escape(text)}</div>
    <button class="btn-primary w-full mt-6" data-action="close">Cerrar</button>
  `);

  root.querySelector('[data-action="close"]').addEventListener('click', close);
}

function escape(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
