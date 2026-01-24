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
var vscode10 = __toESM(require("vscode"));

// src/webviews/sidebar/provider.ts
var vscode = __toESM(require("vscode"));

// src/utils/nonce.ts
function getNonce() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let nonce = "";
  for (let i = 0; i < 32; i++) {
    nonce += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return nonce;
}

// src/webviews/sidebar/html.ts
function getSidebarHtml(webview, opts) {
  const nonce = getNonce();
  const csp = `
    default-src 'none';
    img-src ${webview.cspSource} data:;
    style-src ${webview.cspSource} 'unsafe-inline';
    script-src 'nonce-${nonce}';
  `.replace(/\s+/g, " ").trim();
  return (
    /* html */
    `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="${csp}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { padding: 10px; font-family: system-ui, sans-serif; }

    .header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
      padding: 10px;
      border: 1px solid #4444;
      border-radius: 10px;
      background: var(--vscode-editor-background);
    }

    .logo {
      width: 64px;
      height: 64px;
      flex: 0 0 auto;
      border-radius: 12px;
      overflow: hidden;
      background: #0b1020;
      border: 1px solid #4444;
      display: grid;
      place-items: center;
    }
    .logo img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
    }

    .titleWrap { line-height: 1.1; }
    .title { font-weight: 650; }
    .subtitle { font-size: 12px; opacity: .75; margin-top: 2px; }

    .cmd { margin: 6px 0 10px; }

    .btn {
      width: 100%;
      text-align: left;
      padding: 8px 10px;
      margin: 0;
      border-radius: 8px;
      border: 1px solid #4444;
      background: var(--vscode-button-secondaryBackground);
      color: var(--vscode-button-secondaryForeground);
      cursor: pointer;
      outline: none;
      transition: filter .12s ease, transform .06s ease;
    }

    .btn:hover { filter: brightness(1.06); }
    .btn:active { transform: translateY(1px); }

    .btn.flash {
      background: #7a5a12;
      color: #d7d7d7;
      border-color: transparent;
    }

    .btn[disabled] {
      opacity: 0.55;
      cursor: not-allowed;
      filter: none;
      transform: none;
    }

    @keyframes pulseRing {
      0%   { box-shadow: 0 0 0 0 rgba(122,90,18,0.0); filter: brightness(1.0); }
      35%  { box-shadow: 0 0 0 3px rgba(122,90,18,0.55); filter: brightness(1.12); }
      100% { box-shadow: 0 0 0 0 rgba(122,90,18,0.0); filter: brightness(1.0); }
    }
    .btn.pulse { animation: pulseRing 320ms ease-out; }
    .btn:focus-visible { box-shadow: 0 0 0 2px #7a5a12aa; }

    .sub {
      display: flex;
      gap: 8px;
      align-items: center;
      margin: 4px 2px 0;
      font-size: 12px;
      opacity: .95;
      user-select: none;
      flex-wrap: wrap;
    }

    .sub a {
      color: #7fb7ff;
      text-decoration: none;
      cursor: pointer;
    }
    .sub a:hover { text-decoration: underline; }

    .dot { opacity: .5; }

    .hint { font-size: 12px; opacity: .75; margin-top: 10px; }
    .sep { margin: 10px 0; border-top: 1px solid #4444; }
  </style>
</head>

<body>
  <div class="header">
    <div class="logo" aria-label="Rowtate logo">
      <img src="${opts.logoUri}" alt="Rowtate animated logo" />
    </div>
    <div class="titleWrap">
      <div class="title">Rowtate</div>
      <div class="subtitle">Quick CSV row \u2194 key/value tools</div>
    </div>
  </div>

  <div class="hint">
    Tip: "Toggle Selection Layout" command acts on block(s) under your cursor (single block) or selection (single or multiple blocks).
  </div>

  <div class="cmd">
    <button class="btn" data-cmd="rowtate.toggleBlocksLayout">
      Toggle Selection Layout (Horizontal \u2194 Vertical)
    </button>
    <div class="sub">
      <a data-bind="rowtate.toggleBlocksLayout">Bind key\u2026</a>
      <span class="dot">\u2022</span>
      <a data-copy="rowtate.toggleBlocksLayout">Copy command id</a>
    </div>
  </div>

<div class="cmd">
    <button class="btn" data-cmd="rowtate.toggle">Toggle File Layout</button>
    <div class="sub">
      <a data-bind="rowtate.toggle">Bind key\u2026</a>
      <span class="dot">\u2022</span>
      <a data-copy="rowtate.toggle">Copy command id</a>
    </div>
  </div>

  <div class="cmd">
    <button class="btn" data-cmd="rowtate.toggleColours">Toggle Colours</button>
    <div class="sub">
      <a data-bind="rowtate.toggleColours">Bind key\u2026</a>
      <span class="dot">\u2022</span>
      <a data-copy="rowtate.toggleColours">Copy command id</a>
    </div>
  </div>

  <div class="cmd">
    <button class="btn" data-cmd="rowtate.reorderVertical">Reorder (Vertical rows)</button>
    <div class="sub">
      <a data-bind="rowtate.reorderVertical">Bind key\u2026</a>
      <span class="dot">\u2022</span>
      <a data-copy="rowtate.reorderVertical">Copy command id</a>
    </div>
  </div>

  <div class="cmd">
    <button class="btn" data-cmd="rowtate.pickColors">Pick Colours</button>
    <div class="sub">
      <a data-bind="rowtate.pickColors">Bind key\u2026</a>
      <span class="dot">\u2022</span>
      <a data-copy="rowtate.pickColors">Copy command id</a>
    </div>
  </div>

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();

    const buttons = Array.from(document.querySelectorAll("button[data-cmd]"));
    const bindLinks = Array.from(document.querySelectorAll("[data-bind]"));
    const copyLinks = Array.from(document.querySelectorAll("[data-copy]"));

    let busy = false;
    let pendingRequestId = null;

    function flash(btn) {
      btn.classList.remove("flash");
      void btn.offsetWidth; // restart
      btn.classList.add("flash");
      setTimeout(() => btn.classList.remove("flash"), 180);
    }

    function pulse(btn) {
      btn.classList.remove("pulse");
      void btn.offsetWidth;
      btn.classList.add("pulse");
      setTimeout(() => btn.classList.remove("pulse"), 400);
    }

    function setBusy(on) {
      busy = on;
      buttons.forEach(b => b.disabled = on);

      bindLinks.forEach(a => a.style.pointerEvents = on ? "none" : "auto");
      bindLinks.forEach(a => a.style.opacity = on ? "0.55" : "1");

      copyLinks.forEach(a => a.style.pointerEvents = on ? "none" : "auto");
      copyLinks.forEach(a => a.style.opacity = on ? "0.55" : "1");
    }

    function makeRequestId() {
      return String(Date.now()) + "-" + Math.random().toString(16).slice(2);
    }

    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        if (busy) return;

        flash(btn);

        setBusy(true);

        pendingRequestId = makeRequestId();
        vscode.postMessage({
          type: "cmd",
          command: btn.getAttribute("data-cmd"),
          requestId: pendingRequestId
        });
      });
    });

    bindLinks.forEach(a => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        if (busy) return;
        vscode.postMessage({ type: "bind", command: a.getAttribute("data-bind") });
      });
    });

    copyLinks.forEach(a => {
      a.addEventListener("click", async (e) => {
        e.preventDefault();
        if (busy) return;
        const cmd = a.getAttribute("data-copy");
        try { await navigator.clipboard.writeText(cmd); } catch {}
        vscode.postMessage({ type: "copied", command: cmd });
      });
    });

    window.addEventListener("message", (event) => {
      const msg = event.data;
      if (!msg || msg.type !== "done") return;
      if (pendingRequestId && msg.requestId !== pendingRequestId) return;

      pendingRequestId = null;
      setBusy(false);

      
    });
  </script>
</body>
</html>`
  );
}

// src/webviews/sidebar/provider.ts
var RowtateSidebarProvider = class {
  constructor(extensionUri) {
    this.extensionUri = extensionUri;
  }
  resolveWebviewView(webviewView) {
    const webview = webviewView.webview;
    webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, "media")]
    };
    const gifUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "media", "rowtate-anim.gif")
    );
    webview.html = getSidebarHtml(webview, { logoUri: String(gifUri) });
    webview.onDidReceiveMessage(async (msg) => {
      if (!msg || typeof msg.type !== "string") return;
      if (msg.type === "cmd" && typeof msg.command === "string") {
        const requestId = typeof msg.requestId === "string" ? msg.requestId : "";
        try {
          await vscode.commands.executeCommand(msg.command);
          webview.postMessage({ type: "done", requestId, ok: true });
        } catch (e) {
          webview.postMessage({
            type: "done",
            requestId,
            ok: false,
            error: String(e)
          });
          vscode.window.showErrorMessage(
            `Rowtate: Failed to run ${msg.command}: ${String(e)}`
          );
        }
        return;
      }
      if (msg.type === "bind" && typeof msg.command === "string") {
        await vscode.commands.executeCommand(
          "workbench.action.openGlobalKeybindings"
        );
        vscode.window.showInformationMessage(
          `Keyboard Shortcuts opened. Search for: ${msg.command} (or "Rowtate") to assign a keybinding.`
        );
        return;
      }
      if (msg.type === "copied" && typeof msg.command === "string") {
        vscode.window.showInformationMessage(`Copied: ${msg.command}`);
      }
    });
  }
};

// src/decorations/index.ts
var vscode3 = __toESM(require("vscode"));

// src/decorations/colours.ts
var vscode2 = __toESM(require("vscode"));
function getRowtateColors() {
  const cfg = vscode2.workspace.getConfiguration("rowtate");
  return {
    comment: cfg.get("colors.comment", "#87c66b"),
    key: cfg.get("colors.key", "#cd6060ff"),
    value: cfg.get("colors.value", "#6aa2f7ff"),
    target: cfg.get("colors.target", "user")
  };
}

// src/core/segment.ts
function splitIntoSegments(lines) {
  const segs = [];
  let i = 0;
  while (i < lines.length) {
    const start = i;
    const isBlank = lines[i].trim() === "";
    const buf = [];
    while (i < lines.length && lines[i].trim() === "" === isBlank) {
      buf.push(lines[i]);
      i++;
    }
    const end = i - 1;
    segs.push({
      kind: isBlank ? "blank" : "block",
      lines: buf,
      startLine: start,
      endLine: end
    });
  }
  return segs;
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

// src/core/detect.ts
function isHorizontalBlock(blockLines) {
  const content = blockLines.map((l) => l.trim()).filter((l) => l.length > 0 && !l.startsWith("//"));
  if (content.length < 2) return false;
  const header = content[0];
  const values = content[1];
  if (!header.startsWith("#") || !header.includes(",")) return false;
  const headerCommas = (header.match(/,/g) || []).length;
  const valueCommas = (values.match(/,/g) || []).length;
  return headerCommas >= 1 && valueCommas >= 1;
}
function isVerticalBlock(blockLines) {
  for (const raw of blockLines) {
    const t = raw.trim();
    if (!t || t.startsWith("//")) continue;
    if (!t.startsWith("#")) continue;
    if (!t.includes(",")) return true;
    if (/^#\S+\s+/.test(t)) return true;
  }
  return false;
}
function detectFileMode(lines) {
  const segments = splitIntoSegments(lines);
  let h = 0;
  let v = 0;
  for (const seg of segments) {
    if (seg.kind !== "block") continue;
    if (isHorizontalBlock(seg.lines)) h++;
    else if (isVerticalBlock(seg.lines)) v++;
    else {
      v++;
    }
  }
  if (h > 0 && v > 0) return "mixed";
  if (h > 0) return "horizontal";
  return "vertical";
}

// src/state.ts
var state = {
  coloringEnabled: false,
  commentDeco: void 0,
  keyDeco: void 0,
  valueDeco: void 0,
  statusItem: void 0
};

// src/decorations/index.ts
function rebuildDecorations(context) {
  state.commentDeco?.dispose();
  state.keyDeco?.dispose();
  state.valueDeco?.dispose();
  const colors = getRowtateColors();
  state.commentDeco = vscode3.window.createTextEditorDecorationType({
    color: colors.comment
  });
  state.keyDeco = vscode3.window.createTextEditorDecorationType({
    color: colors.key
  });
  state.valueDeco = vscode3.window.createTextEditorDecorationType({
    color: colors.value
  });
  context.subscriptions.push(state.commentDeco, state.keyDeco, state.valueDeco);
}
function applyRowtateDecorations() {
  const editor = vscode3.window.activeTextEditor;
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
        new vscode3.Range(
          new vscode3.Position(lineNo, 0),
          new vscode3.Position(lineNo, line.length)
        )
      );
    }
  }
  const segments = splitIntoSegments(lines);
  for (const seg of segments) {
    if (seg.kind !== "block") continue;
    if (isHorizontalBlock(seg.lines)) {
      applyHorizontalDecorationsForSegment(seg, keyRanges, valueRanges);
    } else {
      applyVerticalDecorationsForSegment(seg, keyRanges, valueRanges);
    }
  }
  editor.setDecorations(state.commentDeco, commentRanges);
  editor.setDecorations(state.keyDeco, keyRanges);
  editor.setDecorations(state.valueDeco, valueRanges);
}
function applyVerticalDecorationsForSegment(seg, keyRanges, valueRanges) {
  for (let i = 0; i < seg.lines.length; i++) {
    const absLineNo = seg.startLine + i;
    const raw = seg.lines[i];
    const trimmed = raw.trim();
    if (!trimmed.startsWith("#")) continue;
    if (trimmed.startsWith("//")) continue;
    const m = trimmed.match(/^(\S+)(\s+)(.*)$/) || trimmed.match(/^(\S+)$/);
    if (!m) continue;
    const key = m[1];
    const ws = m[2] ?? "";
    const keyStart = raw.indexOf(key);
    if (keyStart < 0) continue;
    const keyEnd = keyStart + key.length;
    keyRanges.push(new vscode3.Range(absLineNo, keyStart, absLineNo, keyEnd));
    if (ws) {
      const valueStart = keyEnd + ws.length;
      const valueEnd = raw.length;
      if (valueStart <= valueEnd) {
        valueRanges.push(
          new vscode3.Range(absLineNo, valueStart, absLineNo, valueEnd)
        );
      }
    }
  }
}
function applyHorizontalDecorationsForSegment(seg, keyRanges, valueRanges) {
  const trimmed = seg.lines.map((l) => l.trim());
  let headerIdx = -1;
  for (let i = 0; i < trimmed.length; i++) {
    if (trimmed[i] === "" || trimmed[i].startsWith("//")) continue;
    headerIdx = i;
    break;
  }
  if (headerIdx < 0) return;
  let valuesIdx = -1;
  for (let i = headerIdx + 1; i < trimmed.length; i++) {
    if (trimmed[i] === "" || trimmed[i].startsWith("//")) continue;
    valuesIdx = i;
    break;
  }
  if (valuesIdx < 0) return;
  const headerAbs = seg.startLine + headerIdx;
  const valuesAbs = seg.startLine + valuesIdx;
  keyRanges.push(
    new vscode3.Range(headerAbs, 0, headerAbs, seg.lines[headerIdx].length)
  );
  valueRanges.push(
    new vscode3.Range(valuesAbs, 0, valuesAbs, seg.lines[valuesIdx].length)
  );
}

// src/commands/index.ts
var vscode9 = __toESM(require("vscode"));

// src/commands/toggleLayout.ts
var vscode4 = __toESM(require("vscode"));

// src/core/csv.ts
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

// src/core/transform.ts
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
function convertBlockToVertical(blockLines) {
  const preserved = [];
  let i = 0;
  while (i < blockLines.length && !blockLines[i].trim().startsWith("#")) {
    preserved.push(blockLines[i]);
    i++;
  }
  if (i >= blockLines.length) return blockLines;
  const header = blockLines[i];
  const values = blockLines[i + 1];
  if (values === void 0) return blockLines;
  const keys = splitSimpleCsvLine(header);
  const vals = splitSimpleCsvLine(values);
  const maxLen = Math.max(keys.length, vals.length);
  const SEP = "	";
  const rows = [];
  for (let k = 0; k < maxLen; k++) {
    rows.push(`${keys[k] ?? ""}${SEP}${vals[k] ?? ""}`);
  }
  return [...preserved, ...rows];
}
function convertBlockToHorizontal(blockLines) {
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
  for (let idx = 0; idx < blockLines.length; idx++) {
    const rawLine = blockLines[idx];
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
  if (keys.length === 0) return blockLines;
  const headerLine = keys.join(",");
  const valueLine = values.map(csvEncodeField).join(",");
  const out = [];
  if (preserved.length > 0) out.push(...preserved);
  out.push(headerLine);
  out.push(valueLine);
  return out;
}

// src/commands/toggleLayout.ts
async function toggleKeyValueLayout() {
  const editor = vscode4.window.activeTextEditor;
  if (!editor) {
    vscode4.window.showErrorMessage("Rowtate: No active text editor.");
    return;
  }
  const doc = editor.document;
  const text = doc.getText();
  const lines = text.split(/\r?\n/);
  if (lines.every((l) => l.trim().length === 0)) {
    vscode4.window.showErrorMessage("Rowtate: Document is empty.");
    return;
  }
  const mode = detectFileMode(lines);
  let status;
  if (mode === "mixed") {
    state.statusItem.text = "$(sync) Rowtate: Mixed \u2192 Vertical";
    state.statusItem.show();
  }
  let newText;
  if (mode === "horizontal") {
    newText = toVertical(lines);
  } else if (mode === "vertical") {
    newText = toHorizontal(lines);
  } else {
    const segments = splitIntoSegments(lines);
    const newLines = [];
    for (const seg of segments) {
      if (seg.kind === "blank") {
        newLines.push(...seg.lines);
        continue;
      }
      if (isHorizontalBlock(seg.lines)) {
        newLines.push(...convertBlockToVertical(seg.lines));
      } else {
        newLines.push(...seg.lines);
      }
    }
    newText = newLines.join("\n").replace(/\s*$/, "") + "\n";
  }
  const fullRange = new vscode4.Range(
    doc.positionAt(0),
    doc.positionAt(text.length)
  );
  const edit = new vscode4.WorkspaceEdit();
  edit.replace(doc.uri, fullRange, newText);
  await vscode4.workspace.applyEdit(edit);
  if (state.coloringEnabled) applyRowtateDecorations();
  if (mode === "mixed") {
    setTimeout(() => state.statusItem.hide(), 2500);
  }
}

// src/commands/toggleColours.ts
var vscode5 = __toESM(require("vscode"));
function toggleColours() {
  state.coloringEnabled = !state.coloringEnabled;
  if (state.coloringEnabled) {
    applyRowtateDecorations();
    vscode5.window.setStatusBarMessage("Rowtate coloring: ON", 2e3);
  } else {
    clearRowtateDecorations();
    vscode5.window.setStatusBarMessage("Rowtate coloring: OFF", 2e3);
  }
}
function clearRowtateDecorations() {
  const editor = vscode5.window.activeTextEditor;
  if (!editor) return;
  editor.setDecorations(state.commentDeco, []);
  editor.setDecorations(state.keyDeco, []);
  editor.setDecorations(state.valueDeco, []);
}

// src/commands/convertBlocks.ts
var vscode6 = __toESM(require("vscode"));
async function toggleSelectedBlocksLayout() {
  const editor = vscode6.window.activeTextEditor;
  if (!editor) {
    vscode6.window.showErrorMessage("Rowtate: No active text editor.");
    return;
  }
  const doc = editor.document;
  const text = doc.getText();
  const lines = text.split(/\r?\n/);
  if (lines.every((l) => l.trim().length === 0)) {
    vscode6.window.showErrorMessage("Rowtate: Document is empty.");
    return;
  }
  const segments = splitIntoSegments(lines);
  const selectedSegIndexes = getSelectedBlockSegmentIndexes(editor, segments);
  if (selectedSegIndexes.size === 0) {
    vscode6.window.showWarningMessage("Rowtate: No blocks selected.");
    return;
  }
  const activeBefore = editor.selection.active;
  const anchorSegIndex = findSegmentIndexAtLine(segments, activeBefore.line);
  let selectedHasHorizontal = false;
  let selectedHasVertical = false;
  for (const si of selectedSegIndexes) {
    const seg = segments[si];
    if (!seg || seg.kind !== "block") continue;
    if (isHorizontalBlock(seg.lines)) selectedHasHorizontal = true;
    else if (isVerticalBlock(seg.lines)) selectedHasVertical = true;
    else selectedHasVertical = true;
  }
  if (selectedHasHorizontal && selectedHasVertical) {
    vscode6.window.showWarningMessage(
      "Rowtate: Selected blocks are mixed (some horizontal, some vertical). Select blocks in the same layout and try again."
    );
    return;
  }
  const direction = selectedHasHorizontal ? "toVertical" : "toHorizontal";
  const newLines = [];
  let anchorNewStartLine = null;
  let anchorNewFirstContentLine = null;
  const toggledNewRanges = [];
  const firstContentOffset = (blockLines) => {
    for (let i = 0; i < blockLines.length; i++) {
      const t = blockLines[i].trim();
      if (t === "") continue;
      if (t.startsWith("//")) continue;
      return i;
    }
    return 0;
  };
  for (let si = 0; si < segments.length; si++) {
    const seg = segments[si];
    const segNewStart = newLines.length;
    if (seg.kind === "blank") {
      newLines.push(...seg.lines);
      continue;
    }
    let outBlockLines = seg.lines;
    let changed = false;
    if (selectedSegIndexes.has(si)) {
      if (direction === "toVertical") {
        if (isHorizontalBlock(seg.lines)) {
          outBlockLines = convertBlockToVertical(seg.lines);
          changed = true;
        }
      } else {
        if (isVerticalBlock(seg.lines)) {
          outBlockLines = convertBlockToHorizontal(seg.lines);
          changed = true;
        }
      }
    }
    newLines.push(...outBlockLines);
    if (changed) {
      const startLine = segNewStart;
      const endLine = segNewStart + outBlockLines.length - 1;
      if (endLine >= startLine) {
        toggledNewRanges.push(new vscode6.Range(startLine, 0, endLine, 0));
      }
    }
    if (si === anchorSegIndex) {
      anchorNewStartLine = segNewStart;
      anchorNewFirstContentLine = segNewStart + firstContentOffset(outBlockLines);
    }
  }
  const newText = newLines.join("\n").replace(/\s*$/, "") + "\n";
  const fullRange = new vscode6.Range(
    doc.positionAt(0),
    doc.positionAt(text.length)
  );
  const edit = new vscode6.WorkspaceEdit();
  edit.replace(doc.uri, fullRange, newText);
  await vscode6.workspace.applyEdit(edit);
  const updatedDoc = editor.document;
  const targetLine = anchorNewFirstContentLine ?? anchorNewStartLine ?? Math.min(activeBefore.line, updatedDoc.lineCount - 1);
  const safeLine = Math.max(0, Math.min(targetLine, updatedDoc.lineCount - 1));
  const lineLen = updatedDoc.lineAt(safeLine).text.length;
  const safeChar = Math.max(0, Math.min(activeBefore.character, lineLen));
  const activeAfter = new vscode6.Position(safeLine, safeChar);
  editor.selection = new vscode6.Selection(activeAfter, activeAfter);
  editor.revealRange(
    new vscode6.Range(activeAfter, activeAfter),
    vscode6.TextEditorRevealType.AtTop
  );
  if (state.coloringEnabled) applyRowtateDecorations();
  pulseRanges(editor, toggledNewRanges, 260);
}
var pulseDecoration = vscode6.window.createTextEditorDecorationType({
  isWholeLine: true,
  backgroundColor: "rgba(122, 90, 18, 0.35)",
  // gold-ish
  borderRadius: "4px"
});
function pulseRanges(editor, ranges, ms = 300) {
  if (!ranges.length) return;
  editor.setDecorations(pulseDecoration, ranges);
  setTimeout(() => {
    try {
      editor.setDecorations(pulseDecoration, []);
    } catch {
    }
  }, ms);
}
function findSegmentIndexAtLine(segments, line) {
  let bestAbove = -1;
  for (let i = 0; i < segments.length; i++) {
    const s = segments[i];
    if (s.startLine <= line && s.endLine >= line) return i;
    if (s.endLine < line) bestAbove = i;
  }
  return bestAbove >= 0 ? bestAbove : 0;
}
function getSelectedBlockSegmentIndexes(editor, segments) {
  const selected = /* @__PURE__ */ new Set();
  const selections = editor.selections;
  for (const sel of selections) {
    const a = sel.start.line;
    const b = sel.end.line;
    const selMin = Math.min(a, b);
    const selMax = Math.max(a, b);
    if (sel.isEmpty) {
      const idx = segments.findIndex(
        (s) => s.kind === "block" && s.startLine <= selMin && s.endLine >= selMin
      );
      if (idx >= 0) selected.add(idx);
      continue;
    }
    for (let si = 0; si < segments.length; si++) {
      const s = segments[si];
      if (s.kind !== "block") continue;
      const intersects = !(s.endLine < selMin || s.startLine > selMax);
      if (intersects) selected.add(si);
    }
  }
  return selected;
}

// src/webviews/colourPicker/open.ts
var vscode7 = __toESM(require("vscode"));

// src/webviews/colourPicker/html.ts
function getColorPickerHtml(webview, colors) {
  const nonce = getNonce();
  const csp = `
    default-src 'none';
    style-src ${webview.cspSource} 'unsafe-inline';
    script-src 'nonce-${nonce}';
  `.replace(/\s+/g, " ").trim();
  const norm = (c) => c.startsWith("#") && c.length >= 7 ? c.slice(0, 7) : "#000000";
  return (
    /* html */
    `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="${csp}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rowtate: Pick Colors</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 16px; }
    .card { border: 1px solid #4444; border-radius: 10px; padding: 14px; }
    .row { display:flex; align-items:center; gap: 12px; margin: 12px 0; }
    label { width: 110px; opacity: .85; }
    input[type="text"] { width: 140px; padding: 6px 8px; }
    input[type="color"] { width: 44px; height: 30px; padding: 0; border: none; background: none; }
    .preview { margin-top: 14px; padding: 12px; border-radius: 8px; border: 1px solid #4444; background: var(--vscode-editor-background); }
    .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; white-space: pre; }
    .btns { display:flex; gap: 8px; margin-top: 14px; }
    button { padding: 6px 10px; cursor: pointer; }
    .small { opacity: .7; font-size: 12px; margin-top: 8px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="row">
      <label>Comment</label>
      <input id="commentPicker" type="color" value="${norm(colors.comment)}">
      <input id="commentText" type="text" value="${colors.comment}">
    </div>

    <div class="row">
      <label>Key</label>
      <input id="keyPicker" type="color" value="${norm(colors.key)}">
      <input id="keyText" type="text" value="${colors.key}">
    </div>

    <div class="row">
      <label>Value</label>
      <input id="valuePicker" type="color" value="${norm(colors.value)}">
      <input id="valueText" type="text" value="${colors.value}">
    </div>

    <div class="preview mono" id="preview">
<span id="cmt">// comment line</span>
<span id="key">#Key</span>	<span id="val">Value</span>
    </div>

    <div class="btns">
      <button id="save">Save</button>
      <button id="cancel">Cancel</button>
      <button id="reset">Reset defaults</button>
    </div>

    <div class="small">
      Saved to: <b>${colors.target === "workspace" ? "Workspace" : "User"}</b>
      (change via <code>rowtate.colors.target</code> setting)
    </div>
  </div>

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();

    const commentPicker = document.getElementById("commentPicker");
    const keyPicker = document.getElementById("keyPicker");
    const valuePicker = document.getElementById("valuePicker");

    const commentText = document.getElementById("commentText");
    const keyText = document.getElementById("keyText");
    const valueText = document.getElementById("valueText");

    const cmt = document.getElementById("cmt");
    const key = document.getElementById("key");
    const val = document.getElementById("val");

    function applyPreview() {
      cmt.style.color = commentText.value;
      key.style.color = keyText.value;
      val.style.color = valueText.value;
    }

    function syncFromPicker(picker, text) {
      text.value = picker.value;
      applyPreview();
    }

    function syncFromText(text, picker) {
      // Accept any CSS color string in text (hex/rgb/etc), but only update picker if it's #RRGGBB
      const v = text.value.trim();
      if (/^#[0-9a-fA-F]{6}$/.test(v)) picker.value = v;
      applyPreview();
    }

    commentPicker.addEventListener("input", () => syncFromPicker(commentPicker, commentText));
    keyPicker.addEventListener("input", () => syncFromPicker(keyPicker, keyText));
    valuePicker.addEventListener("input", () => syncFromPicker(valuePicker, valueText));

    commentText.addEventListener("input", () => syncFromText(commentText, commentPicker));
    keyText.addEventListener("input", () => syncFromText(keyText, keyPicker));
    valueText.addEventListener("input", () => syncFromText(valueText, valuePicker));

    document.getElementById("save").addEventListener("click", () => {
      vscode.postMessage({
        type: "save",
        colors: {
          comment: commentText.value.trim(),
          key: keyText.value.trim(),
          value: valueText.value.trim()
        }
      });
    });

    document.getElementById("cancel").addEventListener("click", () => {
      vscode.postMessage({ type: "cancel" });
    });

    document.getElementById("reset").addEventListener("click", () => {
      vscode.postMessage({ type: "reset" });
    });

    applyPreview();
  </script>
</body>
</html>`
  );
}

// src/webviews/colourPicker/open.ts
async function openColorPickerWebview(context) {
  const colors = getRowtateColors();
  const panel = vscode7.window.createWebviewPanel(
    "rowtateColors",
    "Rowtate: Pick Colors",
    vscode7.ViewColumn.Active,
    { enableScripts: true, retainContextWhenHidden: false }
  );
  panel.webview.html = getColorPickerHtml(panel.webview, colors);
  panel.webview.onDidReceiveMessage(async (msg) => {
    if (!msg || typeof msg.type !== "string") return;
    if (msg.type === "save") {
      const { comment, key, value } = msg.colors ?? {};
      if (typeof comment !== "string" || typeof key !== "string" || typeof value !== "string")
        return;
      const cfg = vscode7.workspace.getConfiguration("rowtate");
      const target = colors.target === "workspace" ? vscode7.ConfigurationTarget.Workspace : vscode7.ConfigurationTarget.Global;
      await cfg.update("colors.comment", comment, target);
      await cfg.update("colors.key", key, target);
      await cfg.update("colors.value", value, target);
      rebuildDecorations(context);
      if (state.coloringEnabled) applyRowtateDecorations();
      panel.dispose();
    }
    if (msg.type === "cancel") {
      panel.dispose();
    }
    if (msg.type === "reset") {
      const cfg = vscode7.workspace.getConfiguration("rowtate");
      const target = colors.target === "workspace" ? vscode7.ConfigurationTarget.Workspace : vscode7.ConfigurationTarget.Global;
      await cfg.update("colors.comment", void 0, target);
      await cfg.update("colors.key", void 0, target);
      await cfg.update("colors.value", void 0, target);
      rebuildDecorations(context);
      if (state.coloringEnabled) applyRowtateDecorations();
      panel.dispose();
    }
  });
}

// src/webviews/reorder/open.ts
var vscode8 = __toESM(require("vscode"));

// src/webviews/reorder/html.ts
function getReorderWebviewHtml(webview, lines, colors) {
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
    .comment { color: ${colors.comment}; }
    .kv-key { color: ${colors.key}; }
    .kv-val { color: ${colors.value}; }


    .blank .text { opacity: 0.5; font-style: italic; }
  </style>
</head>

<body>
  <div class="toolbar">
    <button id="apply">Apply</button>
    <button id="cancel">Cancel</button>
    <span class="hint">
      Drag rows to reorder. Only vertical blocks are shown, horizontal blocks are hidden and unchanged.
    </span>
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

// src/webviews/reorder/open.ts
async function openReorderWebview() {
  const editor = vscode8.window.activeTextEditor;
  if (!editor) {
    vscode8.window.showErrorMessage("Rowtate: No active text editor.");
    return;
  }
  const doc = editor.document;
  const text = doc.getText();
  const lines = text.split(/\r?\n/);
  if (lines.every((l) => l.trim().length === 0)) {
    vscode8.window.showErrorMessage("Rowtate: Document is empty.");
    return;
  }
  const model = buildVerticalReorderModel(lines);
  if (!model.includedSegIndexes.some((i) => model.segments[i]?.kind === "block")) {
    vscode8.window.showWarningMessage(
      "Rowtate: No vertical blocks found to reorder (only horizontal blocks detected)."
    );
    return;
  }
  const panel = vscode8.window.createWebviewPanel(
    "rowtateReorder",
    "Rowtate: Reorder Vertical Rows (Mixed Mode OK)",
    vscode8.ViewColumn.Beside,
    {
      enableScripts: true,
      retainContextWhenHidden: true
    }
  );
  const colors = getRowtateColors();
  panel.webview.html = getReorderWebviewHtml(
    panel.webview,
    model.flatLines,
    colors
  );
  panel.webview.onDidReceiveMessage(async (msg) => {
    if (!msg || typeof msg.type !== "string") return;
    if (msg.type === "apply") {
      const newFlat = msg.lines;
      if (!Array.isArray(newFlat)) return;
      if (newFlat.length !== model.flatLines.length) {
        vscode8.window.showErrorMessage(
          "Rowtate: Reorder apply failed (line count mismatch)."
        );
        return;
      }
      const rebuiltSegments = model.segments.map((seg) => ({ ...seg }));
      let cursor = 0;
      for (let k = 0; k < model.includedSegIndexes.length; k++) {
        const segIdx = model.includedSegIndexes[k];
        const segLen = model.includedSegLengths[k];
        const slice = newFlat.slice(cursor, cursor + segLen);
        cursor += segLen;
        rebuiltSegments[segIdx].lines = slice;
      }
      const newLines = [];
      for (const seg of rebuiltSegments) {
        newLines.push(...seg.lines);
      }
      const newText = newLines.join("\n").replace(/\s*$/, "") + "\n";
      const fullRange = new vscode8.Range(
        doc.positionAt(0),
        doc.positionAt(text.length)
      );
      const edit = new vscode8.WorkspaceEdit();
      edit.replace(doc.uri, fullRange, newText);
      await vscode8.workspace.applyEdit(edit);
      await doc.save();
      if (state.coloringEnabled) applyRowtateDecorations();
      panel.dispose();
    }
    if (msg.type === "cancel") {
      panel.dispose();
    }
  });
}
function buildVerticalReorderModel(allLines) {
  const segments = splitIntoSegments(allLines);
  const includedSegIndexes = [];
  const includedSegLengths = [];
  const flatLines = [];
  const isReorderableBlock = (seg) => seg.kind === "block" && !isHorizontalBlock(seg.lines);
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    if (isReorderableBlock(seg)) {
      includedSegIndexes.push(i);
      includedSegLengths.push(seg.lines.length);
      flatLines.push(...seg.lines);
      continue;
    }
    if (seg.kind === "blank") {
      const prev = segments[i - 1];
      const next = segments[i + 1];
      const prevIsVert = prev ? isReorderableBlock(prev) : false;
      const nextIsVert = next ? isReorderableBlock(next) : false;
      if (prevIsVert && nextIsVert) {
        includedSegIndexes.push(i);
        includedSegLengths.push(seg.lines.length);
        flatLines.push(...seg.lines);
      }
    }
  }
  return { segments, includedSegIndexes, includedSegLengths, flatLines };
}

// src/commands/index.ts
function registerCommands(context) {
  context.subscriptions.push(
    vscode9.commands.registerCommand("rowtate.toggle", toggleKeyValueLayout),
    vscode9.commands.registerCommand("rowtate.toggleColours", toggleColours),
    vscode9.commands.registerCommand(
      "rowtate.reorderVertical",
      openReorderWebview
    ),
    vscode9.commands.registerCommand(
      "rowtate.toggleBlocksLayout",
      () => toggleSelectedBlocksLayout()
    ),
    vscode9.commands.registerCommand(
      "rowtate.pickColors",
      () => openColorPickerWebview(context)
    )
  );
}

// src/extension.ts
function activate(context) {
  console.log("Rowtate is now active!");
  const provider = new RowtateSidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode10.window.registerWebviewViewProvider("rowtate.sidebar", provider)
  );
  rebuildDecorations(context);
  state.statusItem = vscode10.window.createStatusBarItem(
    vscode10.StatusBarAlignment.Left,
    1e3
  );
  state.statusItem.hide();
  context.subscriptions.push(state.statusItem);
  registerCommands(context);
  context.subscriptions.push(
    vscode10.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("rowtate.colors.comment") || e.affectsConfiguration("rowtate.colors.key") || e.affectsConfiguration("rowtate.colors.value")) {
        rebuildDecorations(context);
        if (state.coloringEnabled) applyRowtateDecorations();
      }
    })
  );
  context.subscriptions.push(
    vscode10.window.onDidChangeActiveTextEditor(() => {
      if (state.coloringEnabled) applyRowtateDecorations();
    }),
    vscode10.workspace.onDidChangeTextDocument(() => {
      if (state.coloringEnabled) applyRowtateDecorations();
    })
  );
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
