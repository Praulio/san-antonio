const SHEET_ID = 'PUT_THE_SHEET_ID_HERE';
const TAB_PARTICIPANTES = 'participantes';
const TAB_TURNOS = 'turnos';
const TAB_TESTIMONIOS = 'testimonios';

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;
    if (action === 'apuntarme') return ok(handleApuntarme(payload));
    if (action === 'testimonio') return ok(handleTestimonio(payload));
    return fail('Unknown action: ' + action);
  } catch (err) {
    return fail(err.message);
  }
}

function handleApuntarme(p) {
  if (!p.nombre || !p.whatsapp) throw new Error('Faltan datos');
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const partTab = ss.getSheetByName(TAB_PARTICIPANTES);
  const turnosTab = ss.getSheetByName(TAB_TURNOS);

  const participanteId = 'p' + Date.now();
  const turnoId = 't' + Date.now();
  const today = formatToday_();

  partTab.appendRow([
    participanteId, p.nombre.trim(), p.whatsapp.trim(),
    today, 'activa', p.mensaje || ''
  ]);

  const turnos = turnosTab.getDataRange().getValues();
  const enColaCount = turnos.filter(r => r[2] === 'en_cola').length;
  const posicion = enColaCount + 1;

  turnosTab.appendRow([turnoId, participanteId, 'en_cola', posicion, '', '', '']);

  return { ok: true, posicion: posicion, participante_id: participanteId };
}

function handleTestimonio(p) {
  if (!p.nombre || !p.texto) throw new Error('Faltan datos');
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const partTab = ss.getSheetByName(TAB_PARTICIPANTES);
  const testTab = ss.getSheetByName(TAB_TESTIMONIOS);

  const rows = partTab.getDataRange().getValues();
  const match = rows.find(r => String(r[1]).trim().toLowerCase() === p.nombre.trim().toLowerCase());
  const participanteId = match ? match[0] : ('p' + Date.now());

  testTab.appendRow([
    'ts' + Date.now(),
    participanteId,
    formatToday_(),
    p.encontro_pareja || 'proceso',
    p.texto,
    'no'
  ]);
  return { ok: true };
}

function formatToday_() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function ok(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function fail(msg) {
  return ContentService.createTextOutput(JSON.stringify({ ok: false, error: msg }))
    .setMimeType(ContentService.MimeType.JSON);
}
