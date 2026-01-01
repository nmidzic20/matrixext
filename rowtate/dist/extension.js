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
function activate(context) {
  console.log("Rowtate is now active!");
  const disposable = vscode.commands.registerCommand(
    "rowtate.toggle",
    () => toggleKeyValueLayout()
  );
  context.subscriptions.push(disposable);
}
function deactivate() {
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
    for (const rawLine of block) {
      const trimmed = rawLine.trim();
      if (!trimmed) continue;
      if (trimmed.startsWith("//")) {
        preserved.push(rawLine);
        continue;
      }
      if (!trimmed.startsWith("#")) {
        preserved.push(rawLine);
        continue;
      }
      const m = trimmed.match(/^(\S+)\s*(.*)$/);
      if (!m) {
        preserved.push(rawLine);
        continue;
      }
      const key = m[1].trim();
      const value = (m[2] ?? "").trim();
      keys.push(key);
      values.push(value);
    }
    if (keys.length === 0) {
      outBlocks.push(block.join("\n"));
      continue;
    }
    const csvBlock = `${keys.join(",")}
${values.join(",")}`;
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
    if (ch === '"') {
      if (inQuotes) {
        const next = line[i + 1];
        if (next === '"') {
          cur += '"';
          i++;
          continue;
        }
        inQuotes = false;
        continue;
      } else {
        inQuotes = true;
        continue;
      }
    }
    if (ch === "\\" && inQuotes) {
      const next = line[i + 1];
      if (next === '"' || next === "\\") {
        cur += next;
        i++;
        continue;
      }
      cur += ch;
      continue;
    }
    if (ch === "," && !inQuotes) {
      out.push(cur.trim());
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur.trim());
  return out.map((field) => {
    const f = field.trim();
    if (f.length >= 2 && f.startsWith('"') && f.endsWith('"')) {
      return f.slice(1, -1);
    }
    return f;
  });
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
