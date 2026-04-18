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

  // Anchor = segment under the active cursor (NOT the exact line)
  const activeBefore = editor.selection.active;
  const anchorSegIndex = findSegmentIndexAtLine(segments, activeBefore.line);

  // Decide mode of selected blocks
  let selectedHasHorizontal = false;
  let selectedHasVertical = false;

  for (const si of selectedSegIndexes) {
    const seg = segments[si];
    if (!seg || seg.kind !== "block") continue;

    // Ignore comment-only / neutral blocks when deciding direction.
    if (isCommentOnlyBlock(seg.lines)) continue;

    if (isHorizontalBlock(seg.lines)) {
      selectedHasHorizontal = true;
    } else if (isVerticalBlock(seg.lines)) {
      selectedHasVertical = true;
    }
  }

  if (!selectedHasHorizontal && !selectedHasVertical) {
    vscode.window.showWarningMessage("Rowtate: No convertible blocks selected.");
    return;
  }

  // Mixed selection => warn and do nothing
  if (selectedHasHorizontal && selectedHasVertical) {
    vscode.window.showWarningMessage(
      "Rowtate: Selected blocks are mixed (some horizontal, some vertical). Select blocks in the same layout and try again.",
    );
    return;
  }

  // All selected horizontal => toVertical, else toHorizontal
  const direction: "toVertical" | "toHorizontal" = selectedHasHorizontal
    ? "toVertical"
    : "toHorizontal";

  const newLines: string[] = [];

  // We'll compute where the anchor segment ends up in the NEW document
  let anchorNewStartLine: number | null = null;
  let anchorNewFirstContentLine: number | null = null;

  // Pulse ranges (in the NEW document coordinates)
  const toggledNewRanges: vscode.Range[] = [];

  // Helper: pick first meaningful line in a block output (skip leading blank/comment)
  const firstContentOffset = (blockLines: string[]): number => {
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

    // Record where this segment starts in the NEW doc
    const segNewStart = newLines.length;

    if (seg.kind === "blank") {
      newLines.push(...seg.lines);
      continue;
    }

    // block
    let outBlockLines: string[] = seg.lines;
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
        // unknown blocks: leave alone (same as your existing logic)
      }
    }

    // Emit output
    newLines.push(...outBlockLines);

    // If this block actually changed, record a whole-line range (new doc coordinates)
    if (changed) {
      const startLine = segNewStart;
      const endLine = segNewStart + outBlockLines.length - 1;
      if (endLine >= startLine) {
        toggledNewRanges.push(new vscode.Range(startLine, 0, endLine, 0));
      }
    }

    // If this is the anchor segment, compute target line after conversion
    if (si === anchorSegIndex) {
      anchorNewStartLine = segNewStart;
      anchorNewFirstContentLine =
        segNewStart + firstContentOffset(outBlockLines);
    }
  }

  const newText = newLines.join("\n").replace(/\s*$/, "") + "\n";

  const fullRange = new vscode.Range(
    doc.positionAt(0),
    doc.positionAt(text.length),
  );

  const edit = new vscode.WorkspaceEdit();
  edit.replace(doc.uri, fullRange, newText);
  await vscode.workspace.applyEdit(edit);

  // After edit, put cursor at the anchor block's new location (top-ish)
  const updatedDoc = editor.document;

  const targetLine =
    anchorNewFirstContentLine ??
    anchorNewStartLine ??
    Math.min(activeBefore.line, updatedDoc.lineCount - 1);

  const safeLine = Math.max(0, Math.min(targetLine, updatedDoc.lineCount - 1));
  const lineLen = updatedDoc.lineAt(safeLine).text.length;
  const safeChar = Math.max(0, Math.min(activeBefore.character, lineLen));

  const activeAfter = new vscode.Position(safeLine, safeChar);
  editor.selection = new vscode.Selection(activeAfter, activeAfter);

  editor.revealRange(
    new vscode.Range(activeAfter, activeAfter),
    vscode.TextEditorRevealType.AtTop,
  );

  applyRowtateDecorations();

  // Pulse after applying other decorations so it remains visible
  pulseRanges(editor, toggledNewRanges, 260);
}

const pulseDecoration = vscode.window.createTextEditorDecorationType({
  isWholeLine: true,
  backgroundColor: "rgba(122, 90, 18, 0.35)", // gold-ish
  borderRadius: "4px",
});

function pulseRanges(
  editor: vscode.TextEditor,
  ranges: vscode.Range[],
  ms = 300,
) {
  if (!ranges.length) return;

  editor.setDecorations(pulseDecoration, ranges);

  setTimeout(() => {
    // clear
    try {
      editor.setDecorations(pulseDecoration, []);
    } catch {}
  }, ms);
}

function findSegmentIndexAtLine(segments: Segment[], line: number): number {
  // Prefer the block containing the line; if the line is in blanks, pick nearest block above.
  let bestAbove = -1;

  for (let i = 0; i < segments.length; i++) {
    const s = segments[i];
    if (s.startLine <= line && s.endLine >= line) return i;
    if (s.endLine < line) bestAbove = i;
  }

  return bestAbove >= 0 ? bestAbove : 0;
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
    doc.positionAt(text.length),
  );

  const edit = new vscode.WorkspaceEdit();
  edit.replace(doc.uri, fullRange, newText);
  await vscode.workspace.applyEdit(edit);
  applyRowtateDecorations();
}
export { convertSelectedBlocks };

function getSelectedBlockSegmentIndexes(
  editor: vscode.TextEditor,
  segments: Segment[],
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
          s.kind === "block" && s.startLine <= selMin && s.endLine >= selMin,
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

function findAnchorTextInBlock(blockLines: string[]): string | undefined {
  // Pick something likely to survive the conversion:
  // - first non-empty, non-comment line
  for (const l of blockLines) {
    const t = l.trim();
    if (!t) continue;
    if (t.startsWith("//")) continue;
    return t;
  }
  return undefined;
}

function findLineIndexByExactTrimmedLine(
  allLines: string[],
  trimmedNeedle: string,
): number {
  for (let i = 0; i < allLines.length; i++) {
    if (allLines[i].trim() === trimmedNeedle) return i;
  }
  return -1;
}

function isCommentOnlyBlock(blockLines: string[]): boolean {
  let hasAnyNonEmpty = false;

  for (const line of blockLines) {
    const t = line.trim();
    if (!t) continue;
    hasAnyNonEmpty = true;
    if (!t.startsWith("//")) return false;
  }

  return hasAnyNonEmpty;
}
