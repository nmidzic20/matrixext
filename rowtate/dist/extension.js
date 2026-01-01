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
function applyRowtateDecorations() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;
  const doc = editor.document;
  const text = doc.getText();
  const lines = text.split(/\r?\n/);
  const commentRanges = [];
  const keyRanges = [];
  const valueRanges = [];
  const blocks = splitIntoBlocks(lines);
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
  let lineCursor = 0;
  for (let lineNo = 0; lineNo < lines.length; lineNo++) {
    const raw = lines[lineNo];
    const trimmed = raw.trim();
    if (!trimmed.startsWith("#")) continue;
    if (trimmed.includes(",")) continue;
    if (trimmed.startsWith("//")) continue;
    const m = trimmed.match(/^(\S+)(\s+)(.*)$/) || trimmed.match(/^(\S+)$/);
    if (!m) continue;
    const key = m[1];
    const ws = m[2] ?? "";
    const value = m[3] ?? "";
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
  {
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
          const values = trimmedLines[valuesLineNo];
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
