import { describe, it, expect } from 'vitest';
import {
  findActivo,
  getQueue,
  getCompleted,
  estimateStartDate,
  daysRemaining
} from '../src/queue.js';

const SAMPLE = [
  { id: 't001', participante_id: 'p001', estado: 'completado', posicion: '', fecha_inicio: '2026-04-01', fecha_fin_est: '2026-04-10', fecha_fin_real: '2026-04-10' },
  { id: 't002', participante_id: 'p002', estado: 'activo', posicion: '', fecha_inicio: '2026-05-05', fecha_fin_est: '2026-05-14', fecha_fin_real: '' },
  { id: 't003', participante_id: 'p003', estado: 'en_cola', posicion: '1', fecha_inicio: '', fecha_fin_est: '', fecha_fin_real: '' },
  { id: 't004', participante_id: 'p004', estado: 'en_cola', posicion: '2', fecha_inicio: '', fecha_fin_est: '', fecha_fin_real: '' }
];

describe('findActivo', () => {
  it('returns the active turn', () => {
    expect(findActivo(SAMPLE)?.id).toBe('t002');
  });

  it('returns null when none active', () => {
    expect(findActivo([SAMPLE[0]])).toBeNull();
  });
});

describe('getQueue', () => {
  it('returns en_cola sorted by posicion ascending', () => {
    const q = getQueue(SAMPLE);
    expect(q.map(t => t.id)).toEqual(['t003', 't004']);
  });

  it('returns empty array when no queue', () => {
    expect(getQueue([SAMPLE[0]])).toEqual([]);
  });
});

describe('getCompleted', () => {
  it('returns completados sorted by fecha_fin_real desc', () => {
    const more = [
      ...SAMPLE,
      { id: 't000', participante_id: 'p000', estado: 'completado', posicion: '', fecha_inicio: '2026-03-01', fecha_fin_est: '2026-03-10', fecha_fin_real: '2026-03-10' }
    ];
    const c = getCompleted(more);
    expect(c.map(t => t.id)).toEqual(['t001', 't000']);
  });
});

describe('estimateStartDate', () => {
  it('computes start date from active end + position offset', () => {
    const activeEnd = new Date(2026, 4, 14);
    const start = estimateStartDate(activeEnd, 1, 9);
    expect(start.getDate()).toBe(14);
    expect(start.getMonth()).toBe(4);
  });

  it('position 2 starts 9 days after position 1', () => {
    const activeEnd = new Date(2026, 4, 14);
    const start = estimateStartDate(activeEnd, 2, 9);
    expect(start.getDate()).toBe(23);
  });
});

describe('daysRemaining', () => {
  it('returns positive when end is in the future', () => {
    const today = new Date(2026, 4, 10);
    const end = new Date(2026, 4, 14);
    expect(daysRemaining(today, end)).toBe(4);
  });

  it('returns 0 on the end day', () => {
    const today = new Date(2026, 4, 14);
    const end = new Date(2026, 4, 14);
    expect(daysRemaining(today, end)).toBe(0);
  });

  it('returns negative when overdue', () => {
    const today = new Date(2026, 4, 16);
    const end = new Date(2026, 4, 14);
    expect(daysRemaining(today, end)).toBe(-2);
  });
});
