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
