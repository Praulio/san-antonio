const ROUTES = ['home', 'cola', 'historial', 'testimonios'];
const DEFAULT = 'home';

export function initRouter(onRouteChange) {
  function handle() {
    const hash = window.location.hash.replace('#', '') || DEFAULT;
    const route = ROUTES.includes(hash) ? hash : DEFAULT;
    document.querySelectorAll('.route').forEach(el => {
      el.classList.toggle('hidden', el.dataset.route !== route);
    });
    document.querySelectorAll('.tab-bar a').forEach(a => {
      if (a.dataset.tab === route) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    if (onRouteChange) onRouteChange(route);
  }
  window.addEventListener('hashchange', handle);
  handle();
}
