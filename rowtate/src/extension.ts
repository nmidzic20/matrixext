import * as vscode from "vscode";
import { RowtateSidebarProvider } from "./webviews/sidebar/provider";

import {
  rebuildDecorations,
  applyRowtateDecorations,
} from "./decorations/index";
import { state } from "./state";
import { registerCommands } from "./commands";

export function activate(context: vscode.ExtensionContext) {
  console.log("Rowtate is now active!");

  const provider = new RowtateSidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("rowtate.sidebar", provider),
  );

  rebuildDecorations(context);

  state.statusItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    1000,
  );
  state.statusItem.hide();
  context.subscriptions.push(state.statusItem);

  registerCommands(context);

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (
        e.affectsConfiguration("rowtate.colors.comment") ||
        e.affectsConfiguration("rowtate.colors.key") ||
        e.affectsConfiguration("rowtate.colors.value")
      ) {
        rebuildDecorations(context);
        applyRowtateDecorations();
      }
    }),
  );

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(() => {
      applyRowtateDecorations();
    }),
    vscode.workspace.onDidChangeTextDocument(() => {
      applyRowtateDecorations();
    }),
  );

  applyRowtateDecorations();
}

export function deactivate() {}
