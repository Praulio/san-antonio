import { describe, it, expect, vi } from 'vitest';

vi.mock('../src/config.js', () => ({
  TURNO_DAYS: 9,
  APPS_SCRIPT_URL: 'https://script.x/exec'
}));

import { loadState } from '../src/store.js';

describe('loadState', () => {
  it('assembles activo + queue + completed with participante refs', async () => {
    global.fetch = vi.fn(() => Promise.resolve({
      ok: true,
      json: async () => ({
        participantes: [
          { id: 'p001', nombre: 'María' },
          { id: 'p002', nombre: 'Ana' },
          { id: 'p003', nombre: 'Lupe' }
        ],
        turnos: [
          { id: 't001', participante_id: 'p001', estado: 'activo', posicion: '', fecha_inicio: '2026-05-05', fecha_fin_est: '2026-05-14', fecha_fin_real: '' },
          { id: 't002', participante_id: 'p002', estado: 'en_cola', posicion: '1', fecha_inicio: '', fecha_fin_est: '', fecha_fin_real: '' },
          { id: 't003', participante_id: 'p003', estado: 'en_cola', posicion: '2', fecha_inicio: '', fecha_fin_est: '', fecha_fin_real: '' }
        ],
        testimonios: [],
        config: { duracion_dias: '9', nombre_grupo: 'Familiar' }
      })
    }));

    const state = await loadState();
    expect(state.activo.participante.nombre).toBe('María');
    expect(state.queue).toHaveLength(2);
    expect(state.queue[0].participante.nombre).toBe('Ana');
    expect(state.queue[1].fechaInicioEst).toBeInstanceOf(Date);
  });

  it('throws if APPS_SCRIPT_URL not configured', async () => {
    vi.resetModules();
    vi.doMock('../src/config.js', () => ({
      TURNO_DAYS: 9,
      APPS_SCRIPT_URL: 'PUT_APPS_SCRIPT_EXEC_URL_HERE'
    }));
    const { loadState: ls } = await import('../src/store.js');
    await expect(ls()).rejects.toThrow(/Configura/);
    vi.doUnmock('../src/config.js');
  });
});
