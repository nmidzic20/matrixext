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
    ),
    vscode.commands.registerCommand("rowtate.reorderVertical", () =>
      openReorderWebview()
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

function applyVerticalDecorations(
  lines: string[],
  keyRanges: vscode.Range[],
  valueRanges: vscode.Range[]
) {
  for (let lineNo = 0; lineNo < lines.length; lineNo++) {
    const raw = lines[lineNo];
    const trimmed = raw.trim();

    if (!trimmed.startsWith("#")) continue;
    if (trimmed.startsWith("//")) continue;

    // Find first whitespace after key token
    // key token = first non-space token (starts with #)
    const keyMatch =
      trimmed.match(/^(\S+)(\s+)(.*)$/) || trimmed.match(/^(\S+)$/);
    if (!keyMatch) continue;

    const key = keyMatch[1];
    const ws = keyMatch[2] ?? "";
    // const value = keyMatch[3] ?? ""; // not needed for ranges

    const keyStart = raw.indexOf(key);
    if (keyStart < 0) continue;
    const keyEnd = keyStart + key.length;

    keyRanges.push(new vscode.Range(lineNo, keyStart, lineNo, keyEnd));

    if (ws) {
      const valueStart = keyEnd + ws.length;
      const valueEnd = raw.length;
      if (valueStart <= valueEnd) {
        valueRanges.push(
          new vscode.Range(lineNo, valueStart, lineNo, valueEnd)
        );
      }
    }
  }
}

function applyHorizontalDecorations(
  lines: string[],
  keyRanges: vscode.Range[],
  valueRanges: vscode.Range[]
) {
  const trimmedLines = lines.map((l) => l.trim());

  let i = 0;
  while (i < lines.length) {
    if (trimmedLines[i] === "") {
      i++;
      continue;
    }
    if (trimmedLines[i].startsWith("//")) {
      i++;
      continue;
    }

    const headerLineNo = i;
    const header = trimmedLines[headerLineNo];

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

        // entire header as keys
        keyRanges.push(
          new vscode.Range(
            headerLineNo,
            0,
            headerLineNo,
            lines[headerLineNo].length
          )
        );
        // entire values as values
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

function applyRowtateDecorations() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const doc = editor.document;
  const text = doc.getText();
  const lines = text.split(/\r?\n/);

  const commentRanges: vscode.Range[] = [];
  const keyRanges: vscode.Range[] = [];
  const valueRanges: vscode.Range[] = [];

  // 1) Always color comment lines (whole line)
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

  // 2) Decide mode and apply ONLY that mode's decorations
  const isHorizontal = looksLikeHorizontalCsv(lines);

  if (isHorizontal) {
    applyHorizontalDecorations(lines, keyRanges, valueRanges);
  } else {
    applyVerticalDecorations(lines, keyRanges, valueRanges);
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

async function openReorderWebview() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("Rowtate: No active text editor.");
    return;
  }

  const doc = editor.document;
  const text = doc.getText();
  const lines = text.split(/\r?\n/);

  // Only allow in vertical mode
  if (looksLikeHorizontalCsv(lines)) {
    vscode.window.showWarningMessage(
      "Rowtate: Reordering is available only in vertical mode. Toggle to vertical first."
    );
    return;
  }

  const panel = vscode.window.createWebviewPanel(
    "rowtateReorder",
    "Rowtate: Reorder Rows",
    vscode.ViewColumn.Beside,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
    }
  );

  panel.webview.html = getReorderWebviewHtml(panel.webview, lines);

  panel.webview.onDidReceiveMessage(async (msg) => {
    if (!msg || typeof msg.type !== "string") return;

    if (msg.type === "apply") {
      const newLines = msg.lines as string[];
      if (!Array.isArray(newLines)) return;

      // Preserve trailing newline behaviour: keep exactly one trailing newline
      const newText = newLines.join("\n").replace(/\s*$/, "") + "\n";

      const fullRange = new vscode.Range(
        doc.positionAt(0),
        doc.positionAt(text.length)
      );

      const edit = new vscode.WorkspaceEdit();
      edit.replace(doc.uri, fullRange, newText);
      await vscode.workspace.applyEdit(edit);
      await doc.save();

      panel.dispose();
    }

    if (msg.type === "cancel") {
      panel.dispose();
    }
  });
}
function getReorderWebviewHtml(
  webview: vscode.Webview,
  lines: string[]
): string {
  const nonce = getNonce();
  const data = JSON.stringify(lines);

  // minimal CSP
  const csp = `
    default-src 'none';
    img-src ${webview.cspSource} https:;
    style-src ${webview.cspSource} 'unsafe-inline';
    script-src 'nonce-${nonce}';
  `
    .replace(/\s+/g, " ")
    .trim();

  return /* html */ `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="${csp}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Rowtate Reorder</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 10px; }
    .toolbar {
      position: sticky;
      top: 0;
      z-index: 10;
      display: flex;
      gap: 8px;
      align-items: center;
      padding: 10px 0;
      margin-bottom: 10px;
      background: var(--vscode-editor-background);
      border-bottom: 1px solid #4444;
    }
    button { padding:6px 10px; cursor:pointer; }
    .hint { opacity:0.75; font-size:12px; }

    .list { border: 1px solid #4444; border-radius: 8px; overflow: hidden; }
    .row {
      display: grid;
      grid-template-columns: 28px 1fr;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      border-top: 1px solid #4444;
      user-select: none;
    }
    .row:first-child { border-top: none; }

    .handle { opacity:0.7; cursor: grab; text-align:center; }
    .row.dragging { opacity: 0.5; }
    .row.drop-target { outline: 2px dashed #888; outline-offset: -2px; }

    .text { white-space: pre; overflow-x: auto; }
    .comment { color: #87c66b; }
    .kv-key { color: #cd6060ff; }
    .kv-val { color: #6aa2f7ff; }

    .blank .text { opacity: 0.5; font-style: italic; }
  </style>
</head>

<body>
  <div class="toolbar">
    <button id="apply">Apply</button>
    <button id="cancel">Cancel</button>
    <span class="hint">Drag rows to reorder. Blank lines and comments are draggable too.</span>
  </div>

  <div id="list" class="list"></div>

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    let lines = ${data};

    const listEl = document.getElementById("list");

    function classify(line) {
      const t = line.trim();
      if (t === "") return "blank";
      if (t.startsWith("//")) return "comment";
      if (t.startsWith("#")) return "kv";
      return "other";
    }

    function render() {
      listEl.innerHTML = "";
      lines.forEach((line, idx) => {
        const kind = classify(line);

        const row = document.createElement("div");
        row.className = "row " + kind;
        row.draggable = true;
        row.dataset.index = String(idx);

        const handle = document.createElement("div");
        handle.className = "handle";
        handle.textContent = "≡";

        const text = document.createElement("div");
        text.className = "text";

        if (kind === "blank") {
          text.textContent = "(blank)";
        } else if (kind === "comment") {
          const span = document.createElement("span");
          span.className = "comment";
          span.textContent = line;
          text.appendChild(span);
        } else if (kind === "kv") {
          // Try to color key/value separately for display only
          // (This doesn't affect saved output; saved output is exact original line string.)
          const m = line.match(/^(\s*#\\S+)(\\s+)(.*)$/);
          if (m) {
            const keySpan = document.createElement("span");
            keySpan.className = "kv-key";
            keySpan.textContent = m[1];

            const wsSpan = document.createElement("span");
            wsSpan.textContent = m[2];

            const valSpan = document.createElement("span");
            valSpan.className = "kv-val";
            valSpan.textContent = m[3];

            text.appendChild(keySpan);
            text.appendChild(wsSpan);
            text.appendChild(valSpan);
          } else {
            // Key-only line
            const keySpan = document.createElement("span");
            keySpan.className = "kv-key";
            keySpan.textContent = line;
            text.appendChild(keySpan);
          }
        } else {
          text.textContent = line;
        }

        row.appendChild(handle);
        row.appendChild(text);
        listEl.appendChild(row);
      });

      wireDnD();
    }

    let dragFromIndex = null;

    function wireDnD() {
      const rows = Array.from(listEl.querySelectorAll(".row"));

      rows.forEach(row => {
        row.addEventListener("dragstart", (e) => {
          dragFromIndex = Number(row.dataset.index);
          row.classList.add("dragging");
          e.dataTransfer.effectAllowed = "move";
        });

        row.addEventListener("dragend", () => {
          dragFromIndex = null;
          row.classList.remove("dragging");
          rows.forEach(r => r.classList.remove("drop-target"));
        });

        row.addEventListener("dragover", (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
          row.classList.add("drop-target");
        });

        row.addEventListener("dragleave", () => {
          row.classList.remove("drop-target");
        });

        row.addEventListener("drop", (e) => {
          e.preventDefault();
          const toIndex = Number(row.dataset.index);
          rows.forEach(r => r.classList.remove("drop-target"));

          if (dragFromIndex === null || Number.isNaN(toIndex)) return;
          if (toIndex === dragFromIndex) return;

          const [moved] = lines.splice(dragFromIndex, 1);
          lines.splice(toIndex, 0, moved);

          // Re-render so indices stay correct
          render();
        });
      });
    }

    document.getElementById("apply").addEventListener("click", () => {
      // Convert "(blank)" placeholders back to actual empty lines
      // In our model, blank lines are stored as "" already.
      vscode.postMessage({ type: "apply", lines });
    });

    document.getElementById("cancel").addEventListener("click", () => {
      vscode.postMessage({ type: "cancel" });
    });

    render();
  </script>
</body>
</html>
`;
}

function getNonce(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let nonce = "";
  for (let i = 0; i < 32; i++) {
    nonce += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return nonce;
}
