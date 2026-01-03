// src/webviews/sidebar/provider.ts
import * as vscode from "vscode";
import { getSidebarHtml } from "./html";

class RowtateSidebarProvider implements vscode.WebviewViewProvider {
  constructor(private readonly extensionUri: vscode.Uri) {}

  resolveWebviewView(webviewView: vscode.WebviewView) {
    const webview = webviewView.webview;

    webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, "media")],
    };

    const gifUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "media", "rowtate-anim.gif")
    );

    webview.html = getSidebarHtml(webview, { logoUri: String(gifUri) });

    webview.onDidReceiveMessage(async (msg) => {
      if (!msg || typeof msg.type !== "string") return;

      if (msg.type === "cmd" && typeof msg.command === "string") {
        const requestId =
          typeof msg.requestId === "string" ? msg.requestId : "";
        try {
          await vscode.commands.executeCommand(msg.command);
          webview.postMessage({ type: "done", requestId, ok: true });
        } catch (e) {
          webview.postMessage({
            type: "done",
            requestId,
            ok: false,
            error: String(e),
          });
          vscode.window.showErrorMessage(
            `Rowtate: Failed to run ${msg.command}: ${String(e)}`
          );
        }
        return;
      }

      if (msg.type === "bind" && typeof msg.command === "string") {
        await vscode.commands.executeCommand(
          "workbench.action.openGlobalKeybindings"
        );
        vscode.window.showInformationMessage(
          `Keyboard Shortcuts opened. Search for: ${msg.command} (or "Rowtate") to assign a keybinding.`
        );
        return;
      }

      if (msg.type === "copied" && typeof msg.command === "string") {
        vscode.window.showInformationMessage(`Copied: ${msg.command}`);
      }
    });
  }
}

export { RowtateSidebarProvider };
