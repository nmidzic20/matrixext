import * as vscode from "vscode";
import { state } from "../state";
import { applyRowtateDecorations } from "../decorations";

function toggleColoring() {
  state.coloringEnabled = !state.coloringEnabled;

  if (state.coloringEnabled) {
    applyRowtateDecorations();
    vscode.window.setStatusBarMessage("Rowtate coloring: ON", 2000);
  } else {
    clearRowtateDecorations();
    vscode.window.setStatusBarMessage("Rowtate coloring: OFF", 2000);
  }
}
export { toggleColoring };

function clearRowtateDecorations() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  editor.setDecorations(state.commentDeco, []);
  editor.setDecorations(state.keyDeco, []);
  editor.setDecorations(state.valueDeco, []);
}
