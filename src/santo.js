let cached = null;

export async function loadSantoSvg() {
  if (cached) return cached;
  const res = await fetch('./santo.svg');
  cached = await res.text();
  return cached;
}

export async function renderSanto(container, { flipped = false } = {}) {
  const svg = await loadSantoSvg();
  container.innerHTML = svg;
  const el = container.querySelector('svg');
  el.classList.add('santo-svg');
  el.style.transition = 'transform 1.2s ease';
  el.style.transform = flipped ? 'rotate(180deg)' : 'rotate(0deg)';
}
