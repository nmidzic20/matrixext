import * as vscode from "vscode";

let coloringEnabled = false;

let commentDeco: vscode.TextEditorDecorationType;
let keyDeco: vscode.TextEditorDecorationType;
let valueDeco: vscode.TextEditorDecorationType;

export function activate(context: vscode.ExtensionContext) {
  console.log("Rowtate is now active!");

  // Decorations
  commentDeco = vscode.window.createTextEditorDecorationType({
    color: "#87c66b",
  });

  keyDeco = vscode.window.createTextEditorDecorationType({
    color: "#cd6060ff",
  });

  valueDeco = vscode.window.createTextEditorDecorationType({
    color: "#6aa2f7ff",
  });

  context.subscriptions.push(
    vscode.commands.registerCommand("rowtate.toggle", () =>
      toggleKeyValueLayout()
    ),
    vscode.commands.registerCommand("rowtate.toggleColoring", () =>
      toggleColoring()
    )
  );

  // Re-apply on editor/document changes when enabled
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(() => {
      if (coloringEnabled) applyRowtateDecorations();
    }),
    vscode.workspace.onDidChangeTextDocument(() => {
      if (coloringEnabled) applyRowtateDecorations();
    })
  );
}

export function deactivate() {}

function toggleColoring() {
  coloringEnabled = !coloringEnabled;

  if (coloringEnabled) {
    applyRowtateDecorations();
    vscode.window.setStatusBarMessage("Rowtate coloring: ON", 2000);
  } else {
    clearRowtateDecorations();
    vscode.window.setStatusBarMessage("Rowtate coloring: OFF", 2000);
  }
}

function clearRowtateDecorations() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  editor.setDecorations(commentDeco, []);
  editor.setDecorations(keyDeco, []);
  editor.setDecorations(valueDeco, []);
}

function applyRowtateDecorations() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const doc = editor.document;
  const text = doc.getText();
  const lines = text.split(/\r?\n/);

  const commentRanges: vscode.Range[] = [];
  const keyRanges: vscode.Range[] = [];
  const valueRanges: vscode.Range[] = [];

  // Identify if we are in horizontal CSV mode by blocks
  const blocks = splitIntoBlocks(lines);

  // 1) Always color comment lines green (whole line)
  for (let lineNo = 0; lineNo < lines.length; lineNo++) {
    const line = lines[lineNo];
    if (line.trim().startsWith("//")) {
      commentRanges.push(
        new vscode.Range(
          new vscode.Position(lineNo, 0),
          new vscode.Position(lineNo, line.length)
        )
      );
    }
  }

  // 2) For each block, decide if it's horizontal or vertical and color accordingly
  let lineCursor = 0; // used to map block lines to document line numbers

  // We'll build a map from line content to absolute line numbers by walking through `lines`
  // (simpler: just scan `lines` directly for vertical rows; then separately scan blocks for horizontal header/value)
  // Do both approaches safely:

  // 2a) Vertical rows: lines starting with #key...
  for (let lineNo = 0; lineNo < lines.length; lineNo++) {
    const raw = lines[lineNo];
    const trimmed = raw.trim();

    if (!trimmed.startsWith("#")) continue; // keys always start with #
    if (trimmed.includes(",")) continue; // likely horizontal header, handled below
    if (trimmed.startsWith("//")) continue; // comment already handled

    // Split into key + value by first whitespace
    // - key: first non-space token
    // - value: rest (can be empty)
    const m = trimmed.match(/^(\S+)(\s+)(.*)$/) || trimmed.match(/^(\S+)$/);
    if (!m) continue;

    const key = m[1];
    const ws = m[2] ?? "";
    const value = m[3] ?? "";

    // Find key start/end in the original raw line (respect indentation)
    const keyStart = raw.indexOf(key);
    if (keyStart < 0) continue;
    const keyEnd = keyStart + key.length;

    keyRanges.push(new vscode.Range(lineNo, keyStart, lineNo, keyEnd));

    // Value begins after the whitespace after key (if present)
    if (ws) {
      const valueStart = keyEnd + ws.length;
      const valueEnd = raw.length; // highlight rest of line as value (including spaces inside)
      if (valueStart <= valueEnd) {
        valueRanges.push(
          new vscode.Range(lineNo, valueStart, lineNo, valueEnd)
        );
      }
    }
  }

  // 2b) Horizontal CSV: for each block, color first two non-comment lines as header(keys) + values
  // (We rely on the file’s structure: header starts with # and contains commas.)
  {
    // Build a line index lookup: line number -> trimmed line
    const trimmedLines = lines.map((l) => l.trim());

    // Walk blocks using the original `lines` by scanning line numbers
    let i = 0;
    while (i < lines.length) {
      // skip blank lines
      if (trimmedLines[i] === "") {
        i++;
        continue;
      }

      // preserve comment lines
      if (trimmedLines[i].startsWith("//")) {
        i++;
        continue;
      }

      const headerLineNo = i;
      const header = trimmedLines[headerLineNo];

      // if it looks like horizontal header
      if (header.startsWith("#") && header.includes(",")) {
        // find next non-empty, non-comment line for values
        let j = headerLineNo + 1;
        while (
          j < lines.length &&
          (trimmedLines[j] === "" || trimmedLines[j].startsWith("//"))
        )
          j++;
        if (j < lines.length) {
          const valuesLineNo = j;
          const values = trimmedLines[valuesLineNo];

          // Color entire header line as keys (simple + fast)
          keyRanges.push(
            new vscode.Range(
              headerLineNo,
              0,
              headerLineNo,
              lines[headerLineNo].length
            )
          );

          // Color entire values line as values
          valueRanges.push(
            new vscode.Range(
              valuesLineNo,
              0,
              valuesLineNo,
              lines[valuesLineNo].length
            )
          );

          i = valuesLineNo + 1;
          continue;
        }
      }

      i++;
    }
  }

  editor.setDecorations(commentDeco, commentRanges);
  editor.setDecorations(keyDeco, keyRanges);
  editor.setDecorations(valueDeco, valueRanges);
}

async function toggleKeyValueLayout() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("Rowtate: No active text editor.");
    return;
  }

  const doc = editor.document;
  const text = doc.getText();

  const lines = text.split(/\r?\n/);

  if (lines.every((l) => l.trim().length === 0)) {
    vscode.window.showErrorMessage("Rowtate: Document is empty.");
    return;
  }

  let newText: string;

  if (looksLikeHorizontalCsv(lines)) {
    newText = toVertical(lines);
  } else {
    newText = toHorizontal(lines);
  }

  const fullRange = new vscode.Range(
    doc.positionAt(0),
    doc.positionAt(text.length)
  );

  const edit = new vscode.WorkspaceEdit();
  edit.replace(doc.uri, fullRange, newText);
  await vscode.workspace.applyEdit(edit);
}

// ---------- Layout detection ----------

function looksLikeHorizontalCsv(lines: string[]): boolean {
  const blocks = splitIntoBlocks(lines);

  for (const block of blocks) {
    if (block.length < 2) continue;

    const a = block[0].trim();
    const b = block[1].trim();

    const aCommas = (a.match(/,/g) || []).length;
    const bCommas = (b.match(/,/g) || []).length;

    if (aCommas >= 1 && bCommas >= 1) return true;
  }
  return false;
}

// ---------- Transformations ----------
function toVertical(allLines: string[]): string {
  const blocks = splitIntoBlocks(allLines);
  const outBlocks: string[] = [];

  for (const block of blocks) {
    const preserved: string[] = [];
    let i = 0;

    // 1) Preserve leading comment lines (// ...) and any non-header lines
    // until we hit the header line that starts with '#'
    while (i < block.length && !block[i].trim().startsWith("#")) {
      preserved.push(block[i]);
      i++;
    }

    // If no header found, keep block as-is
    if (i >= block.length) {
      outBlocks.push(block.join("\n"));
      continue;
    }

    const header = block[i];
    const values = block[i + 1];

    // If header exists but values row is missing, keep block as-is
    if (values === undefined) {
      outBlocks.push(block.join("\n"));
      continue;
    }

    const keys = splitSimpleCsvLine(header);
    const vals = splitSimpleCsvLine(values);

    const maxLen = Math.max(keys.length, vals.length);
    const SEP = "\t";

    const rows: string[] = [];
    for (let k = 0; k < maxLen; k++) {
      rows.push(`${keys[k] ?? ""}${SEP}${vals[k] ?? ""}`);
    }

    // 2) Output: preserved comments first, then the KV rows
    const out = [...preserved, ...rows].join("\n");

    outBlocks.push(out);
  }

  return outBlocks.join("\n\n") + "\n";
}

function toHorizontal(allLines: string[]): string {
  const blocks = splitIntoBlocks(allLines);
  const outBlocks: string[] = [];

  for (const block of blocks) {
    const preserved: string[] = [];
    const keys: string[] = [];
    const values: string[] = [];

    let pendingKey: string | null = null;

    const flushPending = () => {
      if (pendingKey !== null) {
        keys.push(pendingKey);
        values.push("");
        pendingKey = null;
      }
    };

    for (let idx = 0; idx < block.length; idx++) {
      const rawLine = block[idx];
      const trimmed = rawLine.trim();
      if (!trimmed) continue;

      // Preserve comment lines exactly (and don't attach them as values)
      if (trimmed.startsWith("//")) {
        // if we had a pending key and hit a comment, keep waiting for a value
        preserved.push(rawLine);
        continue;
      }

      // If we are waiting for a value line for a previous "#Key" line:
      if (pendingKey !== null) {
        // If the next meaningful line is another key, then previous key had empty value
        if (trimmed.startsWith("#")) {
          keys.push(pendingKey);
          values.push("");
          pendingKey = null;
          // fall through to process this key line normally
        } else {
          // This line becomes the value (keep it as-is, including quotes)
          keys.push(pendingKey);
          values.push(trimmed);
          pendingKey = null;
          continue;
        }
      }

      // Now handle key lines
      if (trimmed.startsWith("#")) {
        // Case A: "#Key    Value" (single-line KV)
        const m = trimmed.match(/^(\S+)\s+(.+)$/);
        if (m) {
          keys.push(m[1].trim());
          values.push(m[2].trim());
          continue;
        }

        // Case B: "#Key" alone (value expected on next non-comment line)
        pendingKey = trimmed; // whole token is the key
        continue;
      }

      // Non-key, non-comment lines with no pending key => preserve
      preserved.push(rawLine);
    }

    // If file ends with a pending key, give it empty value
    flushPending();

    if (keys.length === 0) {
      outBlocks.push(block.join("\n"));
      continue;
    }

    const csvBlock =
      `${keys.join(",")}\n` + `${values.map(csvEncodeField).join(",")}`;

    const out =
      preserved.length > 0 ? `${preserved.join("\n")}\n${csvBlock}` : csvBlock;

    outBlocks.push(out);
  }

  return outBlocks.join("\n\n") + "\n";
}

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

function splitIntoBlocks(lines: string[]): string[][] {
  const blocks: string[][] = [];
  let current: string[] = [];

  for (const line of lines) {
    if (line.trim() === "") {
      if (current.length > 0) {
        blocks.push(current);
        current = [];
      }
    } else {
      current.push(line);
    }
  }
  if (current.length > 0) blocks.push(current);

  return blocks;
}
