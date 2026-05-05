import { describe, it, expect } from 'vitest';
import { parseCsv } from '../src/csv.js';

describe('parseCsv', () => {
  it('parses header and rows into array of objects', () => {
    const input = 'id,nombre,estado\np001,María,activa\np002,Ana,en_cola';
    expect(parseCsv(input)).toEqual([
      { id: 'p001', nombre: 'María', estado: 'activa' },
      { id: 'p002', nombre: 'Ana', estado: 'en_cola' }
    ]);
  });

  it('handles quoted strings with commas inside', () => {
    const input = 'id,texto\nts01,"Hola, mundo"\nts02,"Otro, con coma"';
    expect(parseCsv(input)).toEqual([
      { id: 'ts01', texto: 'Hola, mundo' },
      { id: 'ts02', texto: 'Otro, con coma' }
    ]);
  });

  it('handles escaped double quotes', () => {
    const input = 'id,texto\nts01,"Dijo ""hola"" feliz"';
    expect(parseCsv(input)).toEqual([
      { id: 'ts01', texto: 'Dijo "hola" feliz' }
    ]);
  });

  it('returns empty array for empty input', () => {
    expect(parseCsv('')).toEqual([]);
  });

  it('skips trailing empty lines', () => {
    const input = 'id,nombre\np001,Ana\n\n\n';
    expect(parseCsv(input)).toEqual([{ id: 'p001', nombre: 'Ana' }]);
  });
});
