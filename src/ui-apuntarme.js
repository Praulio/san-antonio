import { openModal } from './modal.js';
import { submitApuntarme, validateApuntarmePayload } from './api.js';
import { APPS_SCRIPT_URL, TURNO_DAYS } from './config.js';
import { estimateStartDate } from './queue.js';
import { formatRange } from './format.js';

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
        <span class="text-xs text-muted mt-1 block">🔒 Es privado, solo se usa para avisarte</span>
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
        <p class="text-muted text-sm mt-2">Aquí mismo puedes seguir el avance — cuando se acerque tu turno lo vas a ver en la cola.</p>
        <button class="btn-primary w-full mt-6" data-close-confirm>Cerrar</button>
      `;
      root.querySelector('[data-close-confirm]').addEventListener('click', close);
    } catch (err) {
      errBox.textContent = 'Error: ' + err.message;
      form.querySelector('button').textContent = 'Apuntarme';
    }
  });
}
