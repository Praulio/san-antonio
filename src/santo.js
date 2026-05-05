export function renderSanto(container, { flipped = false } = {}) {
  container.innerHTML = `<img class="santo-img" src="./santo.png" alt="San Antonio" />`;
  const el = container.querySelector('img');
  el.style.transition = 'transform 1.2s ease';
  el.style.transform = flipped ? 'rotate(180deg)' : 'rotate(0deg)';
}
