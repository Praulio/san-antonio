import { initRouter } from './router.js';
import { loadState } from './store.js';
import { renderHome } from './ui-home.js';
import { renderQueue } from './ui-queue.js';

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
  if (!state) return;
  const container = document.querySelector(`[data-route="${route}"]`);
  if (route === 'home') renderHome(container, state);
  if (route === 'cola') renderQueue(container, state);
}

boot();
