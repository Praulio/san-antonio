import { describe, it, expect, vi } from 'vitest';

vi.mock('../src/config.js', () => ({
  csvUrl: gid => `https://x?gid=${gid}`,
  SHEET_GIDS: { participantes: '0', turnos: '1', testimonios: '2', config: '3' },
  TURNO_DAYS: 9,
  APPS_SCRIPT_URL: 'https://script.x'
}));

import { loadState } from '../src/store.js';

describe('loadState', () => {
  it('assembles activo + queue + completed with participante refs', async () => {
    global.fetch = vi.fn(url => {
      const gid = new URL(url).searchParams.get('gid');
      const fixtures = {
        '0': 'id,nombre,whatsapp\np001,María,+521\np002,Ana,+521\np003,Lupe,+521',
        '1': 'id,participante_id,estado,posicion,fecha_inicio,fecha_fin_est,fecha_fin_real\nt001,p001,activo,,2026-05-05,2026-05-14,\nt002,p002,en_cola,1,,,\nt003,p003,en_cola,2,,,',
        '2': 'id,participante_id,texto,publicar\n',
        '3': 'duracion_dias,nombre_grupo\n9,Familiar'
      };
      return Promise.resolve({ ok: true, text: async () => fixtures[gid] });
    });

    const state = await loadState();
    expect(state.activo.participante.nombre).toBe('María');
    expect(state.queue).toHaveLength(2);
    expect(state.queue[0].participante.nombre).toBe('Ana');
    expect(state.queue[1].fechaInicioEst).toBeInstanceOf(Date);
  });
});
