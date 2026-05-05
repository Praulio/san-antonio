const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function findActivo(turnos) {
  return turnos.find(t => t.estado === 'activo') ?? null;
}

export function getQueue(turnos) {
  return turnos
    .filter(t => t.estado === 'en_cola')
    .sort((a, b) => Number(a.posicion) - Number(b.posicion));
}

export function getCompleted(turnos) {
  return turnos
    .filter(t => t.estado === 'completado')
    .sort((a, b) => (a.fecha_fin_real < b.fecha_fin_real ? 1 : -1));
}

export function estimateStartDate(activeEndDate, position, turnoDays) {
  const offsetDays = (position - 1) * turnoDays;
  const out = new Date(activeEndDate);
  out.setDate(out.getDate() + offsetDays);
  return out;
}

export function daysRemaining(today, end) {
  const a = stripTime(today);
  const b = stripTime(end);
  return Math.round((b - a) / MS_PER_DAY);
}

function stripTime(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}
