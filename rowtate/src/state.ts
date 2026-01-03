import * as vscode from "vscode";

export const state = {
  coloringEnabled: false,

  commentDeco: undefined as vscode.TextEditorDecorationType | undefined,
  keyDeco: undefined as vscode.TextEditorDecorationType | undefined,
  valueDeco: undefined as vscode.TextEditorDecorationType | undefined,

  statusItem: undefined as vscode.StatusBarItem | undefined,
};
