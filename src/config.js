const cfg = window.SAN_ANTONIO_CONFIG || {};

export const TURNO_DAYS = cfg.turnoDays ?? 9;
export const GROUP_NAME = cfg.groupName ?? 'San Antonio';
export const APPS_SCRIPT_URL = cfg.appsScriptUrl;

const PUBLIC_RANGES = {
  participantes: 'A:B',
  turnos: 'A:G',
  testimonios: 'A:F',
  config: 'A:D'
};

export function csvUrl(sheetGid, sheetName) {
  if (!cfg.sheetId || cfg.sheetId.startsWith('PUT_')) {
    throw new Error('Configura sheetId en index.html');
  }
  const range = sheetName ? PUBLIC_RANGES[sheetName] : null;
  const rangeParam = range ? `&range=${range}` : '';
  return `https://docs.google.com/spreadsheets/d/${cfg.sheetId}/gviz/tq?tqx=out:csv&gid=${sheetGid}${rangeParam}`;
}

export const SHEET_GIDS = {
  participantes: '1001',
  turnos: '1002',
  testimonios: '1003',
  config: '1004'
};
