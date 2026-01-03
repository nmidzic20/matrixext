import * as vscode from "vscode";
import { getRowtateColors } from "../decorations/colours";
import { Segment, splitIntoSegments } from "../core/segment";
import { isHorizontalBlock } from "../core/detect";
import { state } from "../state";

function rebuildDecorations(context: vscode.ExtensionContext) {
  // Dispose previous decoration types so they don't leak
  state.commentDeco?.dispose();
  state.keyDeco?.dispose();
  state.valueDeco?.dispose();

  const colors = getRowtateColors();

  state.commentDeco = vscode.window.createTextEditorDecorationType({
    color: colors.comment,
  });

  state.keyDeco = vscode.window.createTextEditorDecorationType({
    color: colors.key,
  });

  state.valueDeco = vscode.window.createTextEditorDecorationType({
    color: colors.value,
  });

  // Ensure they are disposed on deactivate
  context.subscriptions.push(state.commentDeco, state.keyDeco, state.valueDeco);
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

  // 1) Always color comment lines (whole line) across the entire file
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

  // 2) Color per-block (supports mixed horizontal + vertical in same file)
  const segments = splitIntoSegments(lines);

  for (const seg of segments) {
    if (seg.kind !== "block") continue;

    if (isHorizontalBlock(seg.lines)) {
      applyHorizontalDecorationsForSegment(seg, keyRanges, valueRanges);
    } else {
      // Treat as vertical by default; this keeps coloring stable in mixed files
      applyVerticalDecorationsForSegment(seg, keyRanges, valueRanges);
    }
  }

  editor.setDecorations(state.commentDeco, commentRanges);
  editor.setDecorations(state.keyDeco, keyRanges);
  editor.setDecorations(state.valueDeco, valueRanges);
}

function applyVerticalDecorationsForSegment(
  seg: Segment,
  keyRanges: vscode.Range[],
  valueRanges: vscode.Range[]
) {
  // seg.lines correspond to absolute lines seg.startLine ... seg.endLine
  for (let i = 0; i < seg.lines.length; i++) {
    const absLineNo = seg.startLine + i;
    const raw = seg.lines[i];
    const trimmed = raw.trim();

    if (!trimmed.startsWith("#")) continue;
    if (trimmed.startsWith("//")) continue;

    // key token = first non-space token (#...)
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

function applyHorizontalDecorationsForSegment(
  seg: Segment,
  keyRanges: vscode.Range[],
  valueRanges: vscode.Range[]
) {
  const trimmed = seg.lines.map((l) => l.trim());

  // Find first non-empty, non-comment line = header, next non-empty non-comment = values
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

  // Entire header line as keys
  keyRanges.push(
    new vscode.Range(headerAbs, 0, headerAbs, seg.lines[headerIdx].length)
  );
  // Entire values line as values
  valueRanges.push(
    new vscode.Range(valuesAbs, 0, valuesAbs, seg.lines[valuesIdx].length)
  );
}

export { rebuildDecorations, applyRowtateDecorations };
