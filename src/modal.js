export function openModal(content) {
  const root = document.getElementById('modal-root');
  root.innerHTML = `
    <div class="modal-backdrop" data-close="true"></div>
    <div class="modal-sheet">
      <div class="modal-handle"></div>
      <div class="modal-content">${content}</div>
    </div>
  `;
  root.classList.add('modal-open');
  function close() {
    root.classList.remove('modal-open');
    setTimeout(() => { root.innerHTML = ''; }, 250);
  }
  root.querySelector('[data-close]').addEventListener('click', close);
  return { root, close };
}
