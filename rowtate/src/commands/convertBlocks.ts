import * as vscode from "vscode";
import { splitIntoSegments, Segment } from "../core/segment";
import { isHorizontalBlock, isVerticalBlock } from "../core/detect";
import {
  convertBlockToVertical,
  convertBlockToHorizontal,
} from "../core/transform";
import { state } from "../state";
import { applyRowtateDecorations } from "../decorations/index";

async function toggleSelectedBlocksLayout() {
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

  // Decide mode of selected blocks
  let selectedHasHorizontal = false;
  let selectedHasVertical = false;

  for (const si of selectedSegIndexes) {
    const seg = segments[si];
    if (!seg || seg.kind !== "block") continue;

    if (isHorizontalBlock(seg.lines)) selectedHasHorizontal = true;
    else if (isVerticalBlock(seg.lines)) selectedHasVertical = true;
    else {
      // "unknown" blocks: treat as vertical-ish (same as file-mode logic)
      selectedHasVertical = true;
    }
  }

  // Mixed selection => warn and do nothing
  if (selectedHasHorizontal && selectedHasVertical) {
    vscode.window.showWarningMessage(
      "Rowtate: Selected blocks are mixed (some horizontal, some vertical). Select blocks in the same layout and try again."
    );
    return;
  }

  // All selected are horizontal => convert to vertical
  // All selected are vertical/unknown => convert to horizontal
  const direction: "toVertical" | "toHorizontal" = selectedHasHorizontal
    ? "toVertical"
    : "toHorizontal";

  const newLines: string[] = [];

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
      // only convert if actually horizontal
      if (isHorizontalBlock(seg.lines))
        newLines.push(...convertBlockToVertical(seg.lines));
      else newLines.push(...seg.lines);
    } else {
      // only convert if actually vertical-ish
      if (isVerticalBlock(seg.lines))
        newLines.push(...convertBlockToHorizontal(seg.lines));
      else {
        // for unknown blocks leave them alone
        // (so we don't mangle random text)
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

  if (state.coloringEnabled) applyRowtateDecorations();
}

export { toggleSelectedBlocksLayout };

async function convertSelectedBlocks(direction: "toVertical" | "toHorizontal") {
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

  const newLines: string[] = [];

  for (let si = 0; si < segments.length; si++) {
    const seg = segments[si];

    if (seg.kind === "blank") {
      newLines.push(...seg.lines);
      continue;
    }

    // block
    if (!selectedSegIndexes.has(si)) {
      newLines.push(...seg.lines);
      continue;
    }

    // Selected block: convert only if it's not already in the target mode
    if (direction === "toVertical") {
      if (isHorizontalBlock(seg.lines)) {
        newLines.push(...convertBlockToVertical(seg.lines));
      } else {
        newLines.push(...seg.lines); // already vertical or unknown => unchanged
      }
    } else {
      if (isVerticalBlock(seg.lines)) {
        newLines.push(...convertBlockToHorizontal(seg.lines));
      } else {
        newLines.push(...seg.lines); // already horizontal or unknown => unchanged
      }
    }
  }

  // Preserve trailing newline like your other operations
  const newText = newLines.join("\n").replace(/\s*$/, "") + "\n";

  const fullRange = new vscode.Range(
    doc.positionAt(0),
    doc.positionAt(text.length)
  );

  const edit = new vscode.WorkspaceEdit();
  edit.replace(doc.uri, fullRange, newText);
  await vscode.workspace.applyEdit(edit);
  if (state.coloringEnabled) applyRowtateDecorations();
}
export { convertSelectedBlocks };

function getSelectedBlockSegmentIndexes(
  editor: vscode.TextEditor,
  segments: Segment[]
): Set<number> {
  const selected = new Set<number>();

  const selections = editor.selections;

  for (const sel of selections) {
    const a = sel.start.line;
    const b = sel.end.line;
    const selMin = Math.min(a, b);
    const selMax = Math.max(a, b);

    // Empty selection => pick block under cursor line
    if (sel.isEmpty) {
      const idx = segments.findIndex(
        (s) =>
          s.kind === "block" && s.startLine <= selMin && s.endLine >= selMin
      );
      if (idx >= 0) selected.add(idx);
      continue;
    }

    // Non-empty selection => any block segment intersecting selection lines
    for (let si = 0; si < segments.length; si++) {
      const s = segments[si];
      if (s.kind !== "block") continue;

      const intersects = !(s.endLine < selMin || s.startLine > selMax);
      if (intersects) selected.add(si);
    }
  }

  return selected;
}
