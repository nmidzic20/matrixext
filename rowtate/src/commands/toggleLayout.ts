import * as vscode from "vscode";
import { detectFileMode, isHorizontalBlock } from "../core/detect";
import {
  toHorizontal,
  toVertical,
  convertBlockToVertical,
} from "../core/transform";
import { splitIntoSegments } from "../core/segment";
import { applyRowtateDecorations } from "../decorations/index";
import { state } from "../state";

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

  let status: vscode.Disposable | undefined;

  if (mode === "mixed") {
    state.statusItem!.text = "$(sync) Rowtate: Mixed → Vertical";
    state.statusItem!.show();
  }

  let newText: string;

  if (mode === "horizontal") {
    // same as before
    newText = toVertical(lines);
  } else if (mode === "vertical") {
    // same as before
    newText = toHorizontal(lines);
  } else {
    // mixed => convert ALL to vertical by converting only horizontal blocks
    const segments = splitIntoSegments(lines);
    const newLines: string[] = [];

    for (const seg of segments) {
      if (seg.kind === "blank") {
        newLines.push(...seg.lines);
        continue;
      }

      // block
      if (isHorizontalBlock(seg.lines)) {
        newLines.push(...convertBlockToVertical(seg.lines));
      } else {
        // already vertical (or unknown) => keep as-is
        newLines.push(...seg.lines);
      }
    }

    newText = newLines.join("\n").replace(/\s*$/, "") + "\n";
  }

  const fullRange = new vscode.Range(
    doc.positionAt(0),
    doc.positionAt(text.length),
  );

  const edit = new vscode.WorkspaceEdit();
  edit.replace(doc.uri, fullRange, newText);
  await vscode.workspace.applyEdit(edit);

  applyRowtateDecorations();

  if (mode === "mixed") {
    setTimeout(() => state.statusItem!.hide(), 2500);
  }
}
export { toggleKeyValueLayout };
