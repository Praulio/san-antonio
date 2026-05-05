import { readSheet } from './api.js';
import { csvUrl, SHEET_GIDS } from './config.js';
import { findActivo, getQueue, getCompleted, estimateStartDate, daysRemaining } from './queue.js';
import { parseDate } from './format.js';

export async function loadState() {
  const [participantes, turnos, testimonios, configRows] = await Promise.all([
    readSheet(csvUrl(SHEET_GIDS.participantes)),
    readSheet(csvUrl(SHEET_GIDS.turnos)),
    readSheet(csvUrl(SHEET_GIDS.testimonios)),
    readSheet(csvUrl(SHEET_GIDS.config))
  ]);

  const participanteById = Object.fromEntries(participantes.map(p => [p.id, p]));
  const config = Object.fromEntries((configRows[0] ? Object.entries(configRows[0]) : []));
  const turnoDays = Number(config.duracion_dias ?? 9);

  const activoTurno = findActivo(turnos);
  const activo = activoTurno ? {
    ...activoTurno,
    participante: participanteById[activoTurno.participante_id],
    fechaInicio: parseDate(activoTurno.fecha_inicio),
    fechaFinEst: parseDate(activoTurno.fecha_fin_est),
    diasRestantes: parseDate(activoTurno.fecha_fin_est)
      ? daysRemaining(new Date(), parseDate(activoTurno.fecha_fin_est))
      : null
  } : null;

  const queue = getQueue(turnos).map(t => {
    const startEst = activo?.fechaFinEst
      ? estimateStartDate(activo.fechaFinEst, Number(t.posicion), turnoDays)
      : null;
    const endEst = startEst ? new Date(startEst.getTime() + turnoDays * 86400000) : null;
    return {
      ...t,
      participante: participanteById[t.participante_id],
      fechaInicioEst: startEst,
      fechaFinEst: endEst
    };
  });

  const completed = getCompleted(turnos).map(t => ({
    ...t,
    participante: participanteById[t.participante_id],
    fechaFinReal: parseDate(t.fecha_fin_real)
  }));

  return { activo, queue, completed, testimonios, config, participanteById, turnoDays };
}
