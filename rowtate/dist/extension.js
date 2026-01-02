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
var rowtateStatusItem;
function activate(context) {
  console.log("Rowtate is now active!");
  const provider = new RowtateSidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("rowtate.sidebar", provider)
  );
  rebuildDecorations(context);
  rowtateStatusItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    1e3
  );
  rowtateStatusItem.hide();
  context.subscriptions.push(rowtateStatusItem);
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
    ),
    vscode.commands.registerCommand(
      "rowtate.blocksToVertical",
      () => convertSelectedBlocks("toVertical")
    ),
    vscode.commands.registerCommand(
      "rowtate.blocksToHorizontal",
      () => convertSelectedBlocks("toHorizontal")
    ),
    vscode.commands.registerCommand(
      "rowtate.pickColors",
      () => openColorPickerWebview(context)
    )
  );
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("rowtate.colors.comment") || e.affectsConfiguration("rowtate.colors.key") || e.affectsConfiguration("rowtate.colors.value")) {
        rebuildDecorations(context);
        if (coloringEnabled) applyRowtateDecorations();
      }
    })
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
var RowtateSidebarProvider = class {
  constructor(extensionUri) {
    this.extensionUri = extensionUri;
  }
  resolveWebviewView(webviewView) {
    webviewView.webview.options = {
      enableScripts: true
    };
    webviewView.webview.html = this.getHtml(webviewView.webview);
    webviewView.webview.onDidReceiveMessage(async (msg) => {
      if (!msg || typeof msg.type !== "string") return;
      if (msg.type === "cmd" && typeof msg.command === "string") {
        const requestId = typeof msg.requestId === "string" ? msg.requestId : "";
        try {
          await vscode.commands.executeCommand(msg.command);
          webviewView.webview.postMessage({
            type: "done",
            requestId,
            ok: true
          });
        } catch (e) {
          webviewView.webview.postMessage({
            type: "done",
            requestId,
            ok: false,
            error: String(e)
          });
          vscode.window.showErrorMessage(
            `Rowtate: Failed to run ${msg.command}: ${String(e)}`
          );
        }
      }
    });
  }
  getHtml(webview) {
    const nonce = getNonce();
    const csp = `
    default-src 'none';
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
    .title { font-weight: 600; margin-bottom: 10px; }

    .btn {
      width: 100%;
      text-align: left;
      padding: 8px 10px;
      margin: 6px 0;
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

    /* Selected (clicked) state */
    .btn.selected {
      background: #7a5a12;   /* dark golden */
      color: #d7d7d7;        /* lighter grey letters */
      border-color: transparent;
    }

    /* Disabled while running */
    .btn[disabled] {
      opacity: 0.55;
      cursor: not-allowed;
      filter: none;
      transform: none;
    }

    /* Pulse hint when clicking already-selected */
    @keyframes pulseRing {
      0%   { box-shadow: 0 0 0 0 rgba(122,90,18,0.0); filter: brightness(1.0); }
      35%  { box-shadow: 0 0 0 3px rgba(122,90,18,0.55); filter: brightness(1.12); }
      100% { box-shadow: 0 0 0 0 rgba(122,90,18,0.0); filter: brightness(1.0); }
    }
    .btn.pulse {
      animation: pulseRing 320ms ease-out;
    }

    /* Focus ring (keyboard) */
    .btn:focus-visible { box-shadow: 0 0 0 2px #7a5a12aa; }

    .hint { font-size: 12px; opacity: .75; margin-top: 10px; }
    .sep { margin: 10px 0; border-top: 1px solid #4444; }
  </style>
</head>
<body>
  <div class="title">Rowtate</div>

  <button class="btn" data-cmd="rowtate.toggle">Toggle Key/Value Layout</button>
  <button class="btn" data-cmd="rowtate.toggleColoring">Toggle Coloring</button>

  <div class="sep"></div>

  <button class="btn" data-cmd="rowtate.blocksToVertical">Selection \u2192 Vertical</button>
  <button class="btn" data-cmd="rowtate.blocksToHorizontal">Selection \u2192 Horizontal</button>

  <div class="sep"></div>

  <button class="btn" data-cmd="rowtate.reorderVertical">Reorder (Vertical rows)</button>
  <button class="btn" data-cmd="rowtate.pickColors">Pick Colors</button>

  <div class="hint">
    Tip: selection commands act on block(s) under your cursor/selection.
  </div>

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    const buttons = Array.from(document.querySelectorAll("button[data-cmd]"));

    let busy = false;
    let pendingRequestId = null;

    function setSelected(btn) {
      buttons.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    }

    function pulse(btn) {
      btn.classList.remove("pulse");
      // force reflow so animation restarts even on rapid clicks
      void btn.offsetWidth;
      btn.classList.add("pulse");
      setTimeout(() => btn.classList.remove("pulse"), 400);
    }

    function setBusy(on) {
      busy = on;
      buttons.forEach(b => b.disabled = on);
    }

    function makeRequestId() {
      return String(Date.now()) + "-" + Math.random().toString(16).slice(2);
    }

    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        if (busy) return;

        const alreadySelected = btn.classList.contains("selected");
        if (alreadySelected) {
          pulse(btn); // visual hint for "clicked again"
        } else {
          setSelected(btn);
        }

        setBusy(true);

        pendingRequestId = makeRequestId();
        vscode.postMessage({
          type: "cmd",
          command: btn.getAttribute("data-cmd"),
          requestId: pendingRequestId
        });
      });
    });

    window.addEventListener("message", (event) => {
      const msg = event.data;
      if (!msg || msg.type !== "done") return;

      // Ignore stale completions (if any)
      if (pendingRequestId && msg.requestId !== pendingRequestId) return;

      pendingRequestId = null;
      setBusy(false);

      // Optional: if command failed, pulse currently selected button to indicate "something happened"
      if (msg.ok === false) {
        const sel = buttons.find(b => b.classList.contains("selected"));
        if (sel) pulse(sel);
      }
    });
  </script>
</body>
</html>`
    );
  }
};
function getRowtateColors() {
  const cfg = vscode.workspace.getConfiguration("rowtate");
  return {
    comment: cfg.get("colors.comment", "#87c66b"),
    key: cfg.get("colors.key", "#cd6060ff"),
    value: cfg.get("colors.value", "#6aa2f7ff"),
    target: cfg.get("colors.target", "user")
  };
}
function rebuildDecorations(context) {
  commentDeco?.dispose();
  keyDeco?.dispose();
  valueDeco?.dispose();
  const colors = getRowtateColors();
  commentDeco = vscode.window.createTextEditorDecorationType({
    color: colors.comment
  });
  keyDeco = vscode.window.createTextEditorDecorationType({
    color: colors.key
  });
  valueDeco = vscode.window.createTextEditorDecorationType({
    color: colors.value
  });
  context.subscriptions.push(commentDeco, keyDeco, valueDeco);
}
async function openColorPickerWebview(context) {
  const colors = getRowtateColors();
  const panel = vscode.window.createWebviewPanel(
    "rowtateColors",
    "Rowtate: Pick Colors",
    vscode.ViewColumn.Active,
    { enableScripts: true, retainContextWhenHidden: false }
  );
  panel.webview.html = getColorPickerHtml(panel.webview, colors);
  panel.webview.onDidReceiveMessage(async (msg) => {
    if (!msg || typeof msg.type !== "string") return;
    if (msg.type === "save") {
      const { comment, key, value } = msg.colors ?? {};
      if (typeof comment !== "string" || typeof key !== "string" || typeof value !== "string")
        return;
      const cfg = vscode.workspace.getConfiguration("rowtate");
      const target = colors.target === "workspace" ? vscode.ConfigurationTarget.Workspace : vscode.ConfigurationTarget.Global;
      await cfg.update("colors.comment", comment, target);
      await cfg.update("colors.key", key, target);
      await cfg.update("colors.value", value, target);
      rebuildDecorations(context);
      if (coloringEnabled) applyRowtateDecorations();
      panel.dispose();
    }
    if (msg.type === "cancel") {
      panel.dispose();
    }
    if (msg.type === "reset") {
      const cfg = vscode.workspace.getConfiguration("rowtate");
      const target = colors.target === "workspace" ? vscode.ConfigurationTarget.Workspace : vscode.ConfigurationTarget.Global;
      await cfg.update("colors.comment", void 0, target);
      await cfg.update("colors.key", void 0, target);
      await cfg.update("colors.value", void 0, target);
      rebuildDecorations(context);
      if (coloringEnabled) applyRowtateDecorations();
      panel.dispose();
    }
  });
}
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
  const segments = splitIntoSegments(lines);
  for (const seg of segments) {
    if (seg.kind !== "block") continue;
    if (isHorizontalBlock(seg.lines)) {
      applyHorizontalDecorationsForSegment(seg, keyRanges, valueRanges);
    } else {
      applyVerticalDecorationsForSegment(seg, keyRanges, valueRanges);
    }
  }
  editor.setDecorations(commentDeco, commentRanges);
  editor.setDecorations(keyDeco, keyRanges);
  editor.setDecorations(valueDeco, valueRanges);
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
    keyRanges.push(new vscode.Range(absLineNo, keyStart, absLineNo, keyEnd));
    if (ws) {
      const valueStart = keyEnd + ws.length;
      const valueEnd = raw.length;
      if (valueStart <= valueEnd) {
        valueRanges.push(
          new vscode.Range(absLineNo, valueStart, absLineNo, valueEnd)
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
    new vscode.Range(headerAbs, 0, headerAbs, seg.lines[headerIdx].length)
  );
  valueRanges.push(
    new vscode.Range(valuesAbs, 0, valuesAbs, seg.lines[valuesIdx].length)
  );
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
  const mode = detectFileMode(lines);
  let status;
  if (mode === "mixed") {
    rowtateStatusItem.text = "$(sync) Rowtate: Mixed \u2192 Vertical";
    rowtateStatusItem.show();
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
  const fullRange = new vscode.Range(
    doc.positionAt(0),
    doc.positionAt(text.length)
  );
  const edit = new vscode.WorkspaceEdit();
  edit.replace(doc.uri, fullRange, newText);
  await vscode.workspace.applyEdit(edit);
  if (coloringEnabled) applyRowtateDecorations();
  if (mode === "mixed") {
    setTimeout(() => rowtateStatusItem.hide(), 2500);
  }
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
  if (lines.every((l) => l.trim().length === 0)) {
    vscode.window.showErrorMessage("Rowtate: Document is empty.");
    return;
  }
  const model = buildVerticalReorderModel(lines);
  if (model.verticalSegIndexes.length === 0) {
    vscode.window.showWarningMessage(
      "Rowtate: No vertical blocks found to reorder (only horizontal blocks detected)."
    );
    return;
  }
  const panel = vscode.window.createWebviewPanel(
    "rowtateReorder",
    "Rowtate: Reorder Vertical Rows (Mixed Mode OK)",
    vscode.ViewColumn.Beside,
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
        vscode.window.showErrorMessage(
          "Rowtate: Reorder apply failed (line count mismatch)."
        );
        return;
      }
      const rebuiltSegments = model.segments.map((seg) => ({ ...seg }));
      let cursor = 0;
      for (let k = 0; k < model.verticalSegIndexes.length; k++) {
        const segIdx = model.verticalSegIndexes[k];
        const segLen = model.verticalSegLengths[k];
        const slice = newFlat.slice(cursor, cursor + segLen);
        cursor += segLen;
        rebuiltSegments[segIdx].lines = slice;
      }
      const newLines = [];
      for (const seg of rebuiltSegments) {
        newLines.push(...seg.lines);
      }
      const newText = newLines.join("\n").replace(/\s*$/, "") + "\n";
      const fullRange = new vscode.Range(
        doc.positionAt(0),
        doc.positionAt(text.length)
      );
      const edit = new vscode.WorkspaceEdit();
      edit.replace(doc.uri, fullRange, newText);
      await vscode.workspace.applyEdit(edit);
      await doc.save();
      if (coloringEnabled) applyRowtateDecorations();
      panel.dispose();
    }
    if (msg.type === "cancel") {
      panel.dispose();
    }
  });
}
function buildVerticalReorderModel(allLines) {
  const segments = splitIntoSegments(allLines);
  const verticalSegIndexes = [];
  const verticalSegLengths = [];
  const flatLines = [];
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    if (seg.kind !== "block") continue;
    const isHoriz = isHorizontalBlock(seg.lines);
    if (isHoriz) continue;
    verticalSegIndexes.push(i);
    verticalSegLengths.push(seg.lines.length);
    flatLines.push(...seg.lines);
  }
  return { segments, verticalSegIndexes, verticalSegLengths, flatLines };
}
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
function getNonce() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let nonce = "";
  for (let i = 0; i < 32; i++) {
    nonce += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return nonce;
}
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
async function convertSelectedBlocks(direction) {
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
  const segments = splitIntoSegments(lines);
  const selectedSegIndexes = getSelectedBlockSegmentIndexes(editor, segments);
  if (selectedSegIndexes.size === 0) {
    vscode.window.showWarningMessage("Rowtate: No blocks selected.");
    return;
  }
  const newLines = [];
  for (let si = 0; si < segments.length; si++) {
    const seg = segments[si];
    if (seg.kind === "blank") {
      newLines.push(...seg.lines);
      continue;
    }
    if (!selectedSegIndexes.has(si)) {
      newLines.push(...seg.lines);
      continue;
    }
    if (direction === "toVertical") {
      if (isHorizontalBlock(seg.lines)) {
        newLines.push(...convertBlockToVertical(seg.lines));
      } else {
        newLines.push(...seg.lines);
      }
    } else {
      if (isVerticalBlock(seg.lines)) {
        newLines.push(...convertBlockToHorizontal(seg.lines));
      } else {
        newLines.push(...seg.lines);
      }
    }
  }
  const newText = newLines.join("\n").replace(/\s*$/, "") + "\n";
  const fullRange = new vscode.Range(
    doc.positionAt(0),
    doc.positionAt(text.length)
  );
  const edit = new vscode.WorkspaceEdit();
  edit.replace(doc.uri, fullRange, newText);
  await vscode.workspace.applyEdit(edit);
  if (coloringEnabled) applyRowtateDecorations();
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
