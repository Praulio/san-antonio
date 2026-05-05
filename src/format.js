const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

export function parseDate(str) {
  if (!str) return null;
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatDate(date) {
  return `${date.getDate()} de ${MESES[date.getMonth()]} de ${date.getFullYear()}`;
}

export function formatRange(start, end) {
  if (start.getMonth() === end.getMonth()) {
    return `${start.getDate()} al ${end.getDate()} de ${MESES[start.getMonth()]}`;
  }
  return `${start.getDate()} de ${MESES[start.getMonth()]} al ${end.getDate()} de ${MESES[end.getMonth()]}`;
}

export function countdownText(days) {
  if (days === 0) return 'Hoy termina';
  if (days < 0) return `Pasó hace ${Math.abs(days)} días`;
  if (days === 1) return 'Falta 1 día';
  return `Faltan ${days} días`;
}
