import { openModal } from './modal.js';

const NOVENA_PDF_URL = `${import.meta.env.BASE_URL}novena-san-antonio-padua.pdf`;
const NOVENA_COVER_URL = `${import.meta.env.BASE_URL}novena-san-antonio-cover.jpg`;

export function openOracion(state) {
  const { root, close } = openModal(`
    <h2 class="font-display text-2xl mb-1">Novena a San Antonio</h2>
    <p class="text-xs uppercase tracking-widest text-muted mb-4">PDF para los 9 días</p>
    <img
      class="oracion-cover"
      src="${NOVENA_COVER_URL}"
      alt="Portada de la Novena a San Antonio de Padua"
      loading="eager"
    />
    <a class="btn-primary w-full mt-4" href="${NOVENA_PDF_URL}" target="_blank" rel="noopener">
      Abrir PDF completo
    </a>
    <button class="btn-secondary w-full mt-4" data-action="close">Cerrar</button>
  `);

  root.querySelector('[data-action="close"]').addEventListener('click', close);
}
