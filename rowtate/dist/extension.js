"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"));
var coloringEnabled = false;
var commentDeco;
var keyDeco;
var valueDeco;
function activate(context) {
  console.log("Rowtate is now active!");
  commentDeco = vscode.window.createTextEditorDecorationType({
    color: "#87c66b"
  });
  keyDeco = vscode.window.createTextEditorDecorationType({
    color: "#cd6060ff"
  });
  valueDeco = vscode.window.createTextEditorDecorationType({
    color: "#6aa2f7ff"
  });
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "rowtate.toggle",
      () => toggleKeyValueLayout()
    ),
    vscode.commands.registerCommand(
      "rowtate.toggleColoring",
      () => toggleColoring()
    ),
    vscode.commands.registerCommand(
      "rowtate.reorderVertical",
      () => openReorderWebview()
    )
  );
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(() => {
      if (coloringEnabled) applyRowtateDecorations();
    }),
    vscode.workspace.onDidChangeTextDocument(() => {
      if (coloringEnabled) applyRowtateDecorations();
    })
  );
}
function deactivate() {
}
function toggleColoring() {
  coloringEnabled = !coloringEnabled;
  if (coloringEnabled) {
    applyRowtateDecorations();
    vscode.window.setStatusBarMessage("Rowtate coloring: ON", 2e3);
  } else {
    clearRowtateDecorations();
    vscode.window.setStatusBarMessage("Rowtate coloring: OFF", 2e3);
  }
}
function clearRowtateDecorations() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;
  editor.setDecorations(commentDeco, []);
  editor.setDecorations(keyDeco, []);
  editor.setDecorations(valueDeco, []);
}
function applyVerticalDecorations(lines, keyRanges, valueRanges) {
  for (let lineNo = 0; lineNo < lines.length; lineNo++) {
    const raw = lines[lineNo];
    const trimmed = raw.trim();
    if (!trimmed.startsWith("#")) continue;
    if (trimmed.startsWith("//")) continue;
    const keyMatch = trimmed.match(/^(\S+)(\s+)(.*)$/) || trimmed.match(/^(\S+)$/);
    if (!keyMatch) continue;
    const key = keyMatch[1];
    const ws = keyMatch[2] ?? "";
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
function applyHorizontalDecorations(lines, keyRanges, valueRanges) {
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
      let j = headerLineNo + 1;
      while (j < lines.length && (trimmedLines[j] === "" || trimmedLines[j].startsWith("//")))
        j++;
      if (j < lines.length) {
        const valuesLineNo = j;
        keyRanges.push(
          new vscode.Range(
            headerLineNo,
            0,
            headerLineNo,
            lines[headerLineNo].length
          )
        );
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
  const commentRanges = [];
  const keyRanges = [];
  const valueRanges = [];
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
  let newText;
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
function looksLikeHorizontalCsv(lines) {
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
function toVertical(allLines) {
  const blocks = splitIntoBlocks(allLines);
  const outBlocks = [];
  for (const block of blocks) {
    const preserved = [];
    let i = 0;
    while (i < block.length && !block[i].trim().startsWith("#")) {
      preserved.push(block[i]);
      i++;
    }
    if (i >= block.length) {
      outBlocks.push(block.join("\n"));
      continue;
    }
    const header = block[i];
    const values = block[i + 1];
    if (values === void 0) {
      outBlocks.push(block.join("\n"));
      continue;
    }
    const keys = splitSimpleCsvLine(header);
    const vals = splitSimpleCsvLine(values);
    const maxLen = Math.max(keys.length, vals.length);
    const SEP = "	";
    const rows = [];
    for (let k = 0; k < maxLen; k++) {
      rows.push(`${keys[k] ?? ""}${SEP}${vals[k] ?? ""}`);
    }
    const out = [...preserved, ...rows].join("\n");
    outBlocks.push(out);
  }
  return outBlocks.join("\n\n") + "\n";
}
function toHorizontal(allLines) {
  const blocks = splitIntoBlocks(allLines);
  const outBlocks = [];
  for (const block of blocks) {
    const preserved = [];
    const keys = [];
    const values = [];
    let pendingKey = null;
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
      if (trimmed.startsWith("//")) {
        preserved.push(rawLine);
        continue;
      }
      if (pendingKey !== null) {
        if (trimmed.startsWith("#")) {
          keys.push(pendingKey);
          values.push("");
          pendingKey = null;
        } else {
          keys.push(pendingKey);
          values.push(trimmed);
          pendingKey = null;
          continue;
        }
      }
      if (trimmed.startsWith("#")) {
        const m = trimmed.match(/^(\S+)\s+(.+)$/);
        if (m) {
          keys.push(m[1].trim());
          values.push(m[2].trim());
          continue;
        }
        pendingKey = trimmed;
        continue;
      }
      preserved.push(rawLine);
    }
    flushPending();
    if (keys.length === 0) {
      outBlocks.push(block.join("\n"));
      continue;
    }
    const csvBlock = `${keys.join(",")}
${values.map(csvEncodeField).join(",")}`;
    const out = preserved.length > 0 ? `${preserved.join("\n")}
${csvBlock}` : csvBlock;
    outBlocks.push(out);
  }
  return outBlocks.join("\n\n") + "\n";
}
function splitSimpleCsvLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === "," && !inQuotes) {
      out.push(normalizeField(cur));
      cur = "";
      continue;
    }
    if (ch === '"') {
      const next = line[i + 1];
      if (inQuotes && next === '"') {
        cur += '""';
        i++;
        continue;
      }
      inQuotes = !inQuotes;
      cur += '"';
      continue;
    }
    if (ch === "\\" && inQuotes) {
      const next = line[i + 1];
      if (next === '"' || next === "\\") {
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
function normalizeField(field) {
  const f = field.trim();
  return f;
}
function csvEncodeField(field) {
  if (field === "") return "";
  const trimmed = field.trim();
  if (trimmed.length >= 2 && trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed;
  }
  const needsQuotes = /[",\r\n]/.test(field) || field !== field.trim();
  if (!needsQuotes) return field;
  const escaped = field.replace(/"/g, '""');
  return `"${escaped}"`;
}
function splitIntoBlocks(lines) {
  const blocks = [];
  let current = [];
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
      retainContextWhenHidden: true
    }
  );
  panel.webview.html = getReorderWebviewHtml(panel.webview, lines);
  panel.webview.onDidReceiveMessage(async (msg) => {
    if (!msg || typeof msg.type !== "string") return;
    if (msg.type === "apply") {
      const newLines = msg.lines;
      if (!Array.isArray(newLines)) return;
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
function getReorderWebviewHtml(webview, lines) {
  const nonce = getNonce();
  const data = JSON.stringify(lines);
  const csp = `
    default-src 'none';
    img-src ${webview.cspSource} https:;
    style-src ${webview.cspSource} 'unsafe-inline';
    script-src 'nonce-${nonce}';
  `.replace(/\s+/g, " ").trim();
  return (
    /* html */
    `
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
        handle.textContent = "\u2261";

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
          const m = line.match(/^(s*#\\S+)(\\s+)(.*)$/);
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
`
  );
}
function getNonce() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let nonce = "";
  for (let i = 0; i < 32; i++) {
    nonce += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return nonce;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
