import * as vscode from "vscode";
import { getReorderWebviewHtml } from "./html";
import { isHorizontalBlock } from "../../core/detect";
import { splitIntoSegments, Segment } from "../../core/segment";
import { applyRowtateDecorations } from "../../decorations";
import { state } from "../../state";
import { getRowtateColors } from "../../decorations/colours";

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

  // Build model: only vertical blocks become reorderable content
  const model = buildVerticalReorderModel(lines);

  if (
    !model.includedSegIndexes.some((i) => model.segments[i]?.kind === "block")
  ) {
    vscode.window.showWarningMessage(
      "Rowtate: No vertical blocks found to reorder (only horizontal blocks detected).",
    );
    return;
  }

  const panel = vscode.window.createWebviewPanel(
    "rowtateReorder",
    "Rowtate: Reorder Vertical Rows (Mixed Mode OK)",
    vscode.ViewColumn.Beside,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
    },
  );

  const colors = getRowtateColors();

  // NOTE: we pass only model.flatLines to the webview
  panel.webview.html = getReorderWebviewHtml(
    panel.webview,
    model.flatLines,
    colors,
  );

  panel.webview.onDidReceiveMessage(async (msg) => {
    if (!msg || typeof msg.type !== "string") return;

    if (msg.type === "apply") {
      const newFlat = msg.lines as string[];
      if (!Array.isArray(newFlat)) return;

      if (newFlat.length !== model.flatLines.length) {
        vscode.window.showErrorMessage(
          "Rowtate: Reorder apply failed (line count mismatch).",
        );
        return;
      }

      // Rebuild full document:
      // - horizontal blocks unchanged
      // - vertical blocks replaced with reordered content (same sizes as original)
      const rebuiltSegments = model.segments.map((seg) => ({ ...seg }));

      let cursor = 0;
      for (let k = 0; k < model.includedSegIndexes.length; k++) {
        const segIdx = model.includedSegIndexes[k];
        const segLen = model.includedSegLengths[k];

        const slice = newFlat.slice(cursor, cursor + segLen);
        cursor += segLen;

        rebuiltSegments[segIdx].lines = slice;
      }

      const newLines: string[] = [];
      for (const seg of rebuiltSegments) {
        newLines.push(...seg.lines);
      }

      const newText = newLines.join("\n").replace(/\s*$/, "") + "\n";

      const fullRange = new vscode.Range(
        doc.positionAt(0),
        doc.positionAt(text.length),
      );

      const edit = new vscode.WorkspaceEdit();
      edit.replace(doc.uri, fullRange, newText);
      await vscode.workspace.applyEdit(edit);
      await doc.save();

      applyRowtateDecorations();

      panel.dispose();
    }

    if (msg.type === "cancel") {
      panel.dispose();
    }
  });
}
function buildVerticalReorderModel(allLines: string[]): {
  segments: Segment[];
  includedSegIndexes: number[]; // segments shown in the webview (vertical blocks + in-between blanks)
  includedSegLengths: number[]; // lengths for slicing back
  flatLines: string[]; // what webview edits/reorders
} {
  const segments = splitIntoSegments(allLines);

  const includedSegIndexes: number[] = [];
  const includedSegLengths: number[] = [];
  const flatLines: string[] = [];

  // Helper: is this a vertical-ish block we allow reordering?
  const isReorderableBlock = (seg: Segment) =>
    seg.kind === "block" && !isHorizontalBlock(seg.lines);

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];

    // 1) Include vertical-ish blocks
    if (isReorderableBlock(seg)) {
      includedSegIndexes.push(i);
      includedSegLengths.push(seg.lines.length);
      flatLines.push(...seg.lines);
      continue;
    }

    // 2) Include BLANK segments only when they are BETWEEN two reorderable vertical blocks
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
export { openReorderWebview };
