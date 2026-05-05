import { describe, it, expect } from 'vitest';
import { formatDate, formatRange, countdownText, parseDate } from '../src/format.js';

describe('parseDate', () => {
  it('parses YYYY-MM-DD into a Date', () => {
    const d = parseDate('2026-05-14');
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(4); // May = 4
    expect(d.getDate()).toBe(14);
  });

  it('returns null for empty string', () => {
    expect(parseDate('')).toBeNull();
  });
});

describe('formatDate', () => {
  it('formats date in Spanish long form', () => {
    expect(formatDate(new Date(2026, 4, 14))).toBe('14 de mayo de 2026');
  });
});

describe('formatRange', () => {
  it('formats date range in same month', () => {
    expect(formatRange(new Date(2026, 4, 14), new Date(2026, 4, 23)))
      .toBe('14 al 23 de mayo');
  });

  it('formats date range across months', () => {
    expect(formatRange(new Date(2026, 4, 28), new Date(2026, 5, 6)))
      .toBe('28 de mayo al 6 de junio');
  });
});

describe('countdownText', () => {
  it('shows days remaining when positive', () => {
    expect(countdownText(4)).toBe('Faltan 4 días');
  });

  it('shows singular when 1 day', () => {
    expect(countdownText(1)).toBe('Falta 1 día');
  });

  it('shows "Hoy termina" when zero', () => {
    expect(countdownText(0)).toBe('Hoy termina');
  });

  it('shows overdue text when negative', () => {
    expect(countdownText(-2)).toBe('Pasó hace 2 días');
  });
});
