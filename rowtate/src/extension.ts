import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log("Rowtate is now active!");

  const disposable = vscode.commands.registerCommand("rowtate.toggle", () =>
    toggleKeyValueLayout()
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}

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
  const blocks: string[][] = splitIntoBlocks(allLines);
  const outBlocks: string[] = [];

  for (const block of blocks) {
    const preserved: string[] = [];
    const keys: string[] = [];
    const values: string[] = [];

    for (const rawLine of block) {
      const trimmed = rawLine.trim();
      if (!trimmed) continue;

      // Preserve comment lines exactly
      if (trimmed.startsWith("//")) {
        preserved.push(rawLine);
        continue;
      }

      // KV lines: key always starts with '#'
      // (If you want to allow non-# keys too, remove this check.)
      if (!trimmed.startsWith("#")) {
        // Preserve unexpected lines instead of corrupting output
        preserved.push(rawLine);
        continue;
      }

      // Parse: key = first non-whitespace token, value = rest
      // Allows single-space separator, tabs, multiple spaces, etc.
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

    // If we didn't collect any KV pairs, keep original block as-is
    if (keys.length === 0) {
      outBlocks.push(block.join("\n"));
      continue;
    }

    const csvBlock = `${keys.join(",")}\n${values.join(",")}`;

    // Put preserved lines (comments, etc.) above the CSV block
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

    if (ch === '"') {
      if (inQuotes) {
        const next = line[i + 1];

        // Case 1: CSV-style escaped quote: ""
        if (next === '"') {
          cur += '"';
          i++; // consume second quote
          continue;
        }

        // Case 2: backslash-escaped quote inside quoted field: \"
        // (This will be handled when we see the backslash, but some inputs might not use it consistently.
        // Here, if we see an un-doubled quote, treat it as closing quote.)
        inQuotes = false;
        continue;
      } else {
        inQuotes = true;
        continue;
      }
    }

    // Handle backslash escapes inside quoted fields (e.g. \" or \\)
    if (ch === "\\" && inQuotes) {
      const next = line[i + 1];
      if (next === '"' || next === "\\") {
        cur += next;
        i++; // consume escaped char
        continue;
      }
      // otherwise keep backslash as-is
      cur += ch;
      continue;
    }

    // Split on commas only when not in quotes
    if (ch === "," && !inQuotes) {
      out.push(cur.trim());
      cur = "";
      continue;
    }

    cur += ch;
  }

  out.push(cur.trim());

  // Optional: strip surrounding quotes (but keep inner quotes already unescaped)
  return out.map((field) => {
    const f = field.trim();
    if (f.length >= 2 && f.startsWith('"') && f.endsWith('"')) {
      return f.slice(1, -1);
    }
    return f;
  });
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
