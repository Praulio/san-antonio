const cfg = window.SAN_ANTONIO_CONFIG || {};

export const TURNO_DAYS = cfg.turnoDays ?? 9;
export const GROUP_NAME = cfg.groupName ?? 'San Antonio';
export const APPS_SCRIPT_URL = cfg.appsScriptUrl;

export function csvUrl(sheetGid) {
  if (!cfg.sheetId || cfg.sheetId.startsWith('PUT_')) {
    throw new Error('Configura sheetId en index.html');
  }
  return `https://docs.google.com/spreadsheets/d/${cfg.sheetId}/gviz/tq?tqx=out:csv&gid=${sheetGid}`;
}

export const SHEET_GIDS = {
  participantes: '1001',
  turnos: '1002',
  testimonios: '1003',
  config: '1004'
};
