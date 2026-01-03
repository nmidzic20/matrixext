// ---------- Helpers ----------

function splitSimpleCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    // Split on commas only when not in quotes
    if (ch === "," && !inQuotes) {
      out.push(normalizeField(cur));
      cur = "";
      continue;
    }

    if (ch === '"') {
      const next = line[i + 1];

      if (inQuotes && next === '"') {
        // CSV escaped quote inside quotes: "" -> keep both chars as-is
        cur += '""';
        i++; // consume second quote
        continue;
      }

      // Toggle quote state but KEEP the quote character
      inQuotes = !inQuotes;
      cur += '"';
      continue;
    }

    if (ch === "\\" && inQuotes) {
      const next = line[i + 1];
      if (next === '"' || next === "\\") {
        // keep the escape sequence as-is (\" or \\)
        cur += "\\" + next;
        i++;
        continue;
      }
    }

    cur += ch;
  }

  out.push(normalizeField(cur));
  return out;
}

function normalizeField(field: string): string {
  // Trim whitespace around fields, but keep quotes if present.
  const f = field.trim();
  return f;
}

function csvEncodeField(field: string): string {
  // Preserve empty
  if (field === "") return "";

  // If it already looks quoted, keep it as-is (assume user intentionally provided CSV quoting)
  const trimmed = field.trim();
  if (trimmed.length >= 2 && trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed;
  }

  // Needs quotes if it contains comma, quote, newline, or leading/trailing whitespace
  const needsQuotes = /[",\r\n]/.test(field) || field !== field.trim();

  if (!needsQuotes) return field;

  // Escape quotes by doubling them
  const escaped = field.replace(/"/g, '""');
  return `"${escaped}"`;
}
export { csvEncodeField, splitSimpleCsvLine, normalizeField };
