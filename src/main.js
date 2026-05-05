import { initRouter } from './router.js';
import { renderSanto } from './santo.js';

initRouter(async route => {
  if (route === 'home') {
    const home = document.querySelector('[data-route="home"]');
    home.innerHTML = '<div class="santo-mount"></div>';
    renderSanto(home.querySelector('.santo-mount'), { flipped: true });
  }
});
