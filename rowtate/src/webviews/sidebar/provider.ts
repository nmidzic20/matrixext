import * as vscode from "vscode";
import { getSidebarHtml } from "./html";

class RowtateSidebarProvider implements vscode.WebviewViewProvider {
  constructor(private readonly extensionUri: vscode.Uri) {}

  resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.options = {
      enableScripts: true,
    };

    // HTML comes from separate file now
    webviewView.webview.html = getSidebarHtml(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (msg) => {
      if (!msg || typeof msg.type !== "string") return;

      if (msg.type === "cmd" && typeof msg.command === "string") {
        const requestId =
          typeof msg.requestId === "string" ? msg.requestId : "";

        try {
          await vscode.commands.executeCommand(msg.command);

          webviewView.webview.postMessage({
            type: "done",
            requestId,
            ok: true,
          });
        } catch (e) {
          webviewView.webview.postMessage({
            type: "done",
            requestId,
            ok: false,
            error: String(e),
          });

          vscode.window.showErrorMessage(
            `Rowtate: Failed to run ${msg.command}: ${String(e)}`
          );
        }
      }
    });
  }
}

export { RowtateSidebarProvider };
