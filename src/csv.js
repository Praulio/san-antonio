export function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter(line => line.length > 0);
  if (lines.length === 0) return [];
  const headers = splitRow(lines[0]);
  return lines.slice(1).map(line => {
    const cells = splitRow(line);
    return Object.fromEntries(headers.map((h, i) => [h, cells[i] ?? '']));
  });
}

function splitRow(line) {
  const cells = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (ch === ',' && !inQuotes) {
      cells.push(cur); cur = '';
    } else {
      cur += ch;
    }
  }
  cells.push(cur);
  return cells;
}
