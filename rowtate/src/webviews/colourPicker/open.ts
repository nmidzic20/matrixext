import * as vscode from "vscode";
import { getColorPickerHtml } from "./html";
import { state } from "../../state";
import { applyRowtateDecorations, rebuildDecorations } from "../../decorations";
import { getRowtateColors } from "../../decorations/colours";

async function openColorPickerWebview(context: vscode.ExtensionContext) {
  const colors = getRowtateColors();

  const panel = vscode.window.createWebviewPanel(
    "rowtateColors",
    "Rowtate: Pick Colors",
    vscode.ViewColumn.Active,
    { enableScripts: true, retainContextWhenHidden: false }
  );

  panel.webview.html = getColorPickerHtml(panel.webview, colors);

  panel.webview.onDidReceiveMessage(async (msg) => {
    if (!msg || typeof msg.type !== "string") return;

    if (msg.type === "save") {
      const { comment, key, value } = msg.colors ?? {};
      if (
        typeof comment !== "string" ||
        typeof key !== "string" ||
        typeof value !== "string"
      )
        return;

      const cfg = vscode.workspace.getConfiguration("rowtate");

      const target =
        colors.target === "workspace"
          ? vscode.ConfigurationTarget.Workspace
          : vscode.ConfigurationTarget.Global;

      await cfg.update("colors.comment", comment, target);
      await cfg.update("colors.key", key, target);
      await cfg.update("colors.value", value, target);

      rebuildDecorations(context);
      if (state.coloringEnabled) applyRowtateDecorations();

      panel.dispose();
    }

    if (msg.type === "cancel") {
      panel.dispose();
    }

    if (msg.type === "reset") {
      const cfg = vscode.workspace.getConfiguration("rowtate");
      const target =
        colors.target === "workspace"
          ? vscode.ConfigurationTarget.Workspace
          : vscode.ConfigurationTarget.Global;

      await cfg.update("colors.comment", undefined, target);
      await cfg.update("colors.key", undefined, target);
      await cfg.update("colors.value", undefined, target);

      rebuildDecorations(context);
      if (state.coloringEnabled) applyRowtateDecorations();

      panel.dispose();
    }
  });
}
export { openColorPickerWebview };
