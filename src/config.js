const cfg = window.SAN_ANTONIO_CONFIG || {};

export const TURNO_DAYS = cfg.turnoDays ?? 9;
export const GROUP_NAME = cfg.groupName ?? 'San Antonio';
export const APPS_SCRIPT_URL = cfg.appsScriptUrl;

export function csvUrl(sheetGid) {
  if (!cfg.sheetCsvBase || cfg.sheetCsvBase.startsWith('PUT_')) {
    throw new Error('Configura sheetCsvBase en index.html');
  }
  return `${cfg.sheetCsvBase}&gid=${sheetGid}`;
}

export const SHEET_GIDS = {
  participantes: '0',
  turnos: '1',
  testimonios: '2',
  config: '3'
};
