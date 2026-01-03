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
      retainContextWhenHidden: true,
    }
  );

  const colors = getRowtateColors();

  // NOTE: we pass only model.flatLines to the webview
  panel.webview.html = getReorderWebviewHtml(
    panel.webview,
    model.flatLines,
    colors
  );

  panel.webview.onDidReceiveMessage(async (msg) => {
    if (!msg || typeof msg.type !== "string") return;

    if (msg.type === "apply") {
      const newFlat = msg.lines as string[];
      if (!Array.isArray(newFlat)) return;

      if (newFlat.length !== model.flatLines.length) {
        vscode.window.showErrorMessage(
          "Rowtate: Reorder apply failed (line count mismatch)."
        );
        return;
      }

      // Rebuild full document:
      // - horizontal blocks unchanged
      // - vertical blocks replaced with reordered content (same sizes as original)
      const rebuiltSegments = model.segments.map((seg) => ({ ...seg }));

      let cursor = 0;
      for (let k = 0; k < model.verticalSegIndexes.length; k++) {
        const segIdx = model.verticalSegIndexes[k];
        const segLen = model.verticalSegLengths[k];

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
        doc.positionAt(text.length)
      );

      const edit = new vscode.WorkspaceEdit();
      edit.replace(doc.uri, fullRange, newText);
      await vscode.workspace.applyEdit(edit);
      await doc.save();

      if (state.coloringEnabled) applyRowtateDecorations();

      panel.dispose();
    }

    if (msg.type === "cancel") {
      panel.dispose();
    }
  });
}

function buildVerticalReorderModel(allLines: string[]): {
  segments: Segment[];
  verticalSegIndexes: number[];
  verticalSegLengths: number[];
  flatLines: string[];
} {
  const segments = splitIntoSegments(allLines);

  const verticalSegIndexes: number[] = [];
  const verticalSegLengths: number[] = [];
  const flatLines: string[] = [];

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];

    if (seg.kind !== "block") continue;

    // Reorderable if it is NOT horizontal (treat unknown as vertical-ish)
    // If you want stricter: use isVerticalBlock(seg.lines) instead.
    const isHoriz = isHorizontalBlock(seg.lines);
    if (isHoriz) continue;

    verticalSegIndexes.push(i);
    verticalSegLengths.push(seg.lines.length);
    flatLines.push(...seg.lines);
  }

  return { segments, verticalSegIndexes, verticalSegLengths, flatLines };
}
export { openReorderWebview };
