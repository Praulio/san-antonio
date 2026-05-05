import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readSheet, submitApuntarme, submitTestimonio, validateApuntarmePayload } from '../src/api.js';

describe('validateApuntarmePayload', () => {
  it('returns no errors for valid payload', () => {
    expect(validateApuntarmePayload({ nombre: 'Ana', whatsapp: '+5218112345678' })).toEqual([]);
  });

  it('requires nombre', () => {
    const errs = validateApuntarmePayload({ nombre: '', whatsapp: '+5218112345678' });
    expect(errs).toContain('Falta el nombre');
  });

  it('requires whatsapp', () => {
    const errs = validateApuntarmePayload({ nombre: 'Ana', whatsapp: '' });
    expect(errs).toContain('Falta el WhatsApp');
  });

  it('rejects whatsapp shorter than 10 digits', () => {
    const errs = validateApuntarmePayload({ nombre: 'Ana', whatsapp: '123' });
    expect(errs).toContain('WhatsApp debe tener al menos 10 dígitos');
  });
});

describe('readSheet', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('fetches CSV from given URL and parses', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      text: async () => 'id,nombre\np001,Ana'
    });
    const rows = await readSheet('https://example.com/sheet.csv');
    expect(rows).toEqual([{ id: 'p001', nombre: 'Ana' }]);
    expect(global.fetch).toHaveBeenCalledWith('https://example.com/sheet.csv', { cache: 'no-store' });
  });

  it('throws when fetch fails', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 500 });
    await expect(readSheet('https://x')).rejects.toThrow();
  });
});

describe('submitApuntarme', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('posts payload to endpoint', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, posicion: 5 })
    });
    const result = await submitApuntarme(
      'https://script.google.com/x',
      { nombre: 'Ana', whatsapp: '+5218112345678', mensaje: 'hola' }
    );
    expect(result).toEqual({ ok: true, posicion: 5 });
    expect(global.fetch).toHaveBeenCalledWith('https://script.google.com/x', expect.objectContaining({
      method: 'POST',
      body: expect.stringContaining('"action":"apuntarme"')
    }));
  });
});

describe('submitTestimonio', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('posts testimonio with action=testimonio', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    await submitTestimonio('https://script.google.com/x', {
      nombre: 'Ana',
      texto: 'Encontré pareja',
      encontro_pareja: 'si'
    });
    expect(global.fetch).toHaveBeenCalledWith(
      'https://script.google.com/x',
      expect.objectContaining({
        body: expect.stringContaining('"action":"testimonio"')
      })
    );
  });
});
