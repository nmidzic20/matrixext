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
    vscode.window.registerWebviewViewProvider("rowtate.sidebar", provider)
  );

  // Build decorations from settings (instead of hardcoded colors)
  rebuildDecorations(context);

  // Status bar item
  state.statusItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    1000
  );
  state.statusItem.hide();
  context.subscriptions.push(state.statusItem);

  // Commands
  registerCommands(context);

  // Rebuild decorations when Rowtate color settings change
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (
        e.affectsConfiguration("rowtate.colors.comment") ||
        e.affectsConfiguration("rowtate.colors.key") ||
        e.affectsConfiguration("rowtate.colors.value")
      ) {
        rebuildDecorations(context);
        if (state.coloringEnabled) applyRowtateDecorations();
      }
    })
  );

  // Re-apply on editor/document changes when enabled
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(() => {
      if (state.coloringEnabled) applyRowtateDecorations();
    }),
    vscode.workspace.onDidChangeTextDocument(() => {
      if (state.coloringEnabled) applyRowtateDecorations();
    })
  );
}

export function deactivate() {}
