import * as vscode from "vscode";
import { getNonce } from "../../utils/nonce";

export function getSidebarHtml(webview: vscode.Webview): string {
  const nonce = getNonce();

  const csp = `
    default-src 'none';
    style-src ${webview.cspSource} 'unsafe-inline';
    script-src 'nonce-${nonce}';
  `
    .replace(/\s+/g, " ")
    .trim();

  return /* html */ `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="${csp}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { padding: 10px; font-family: system-ui, sans-serif; }
    .title { font-weight: 600; margin-bottom: 10px; }

    .btn {
      width: 100%;
      text-align: left;
      padding: 8px 10px;
      margin: 6px 0;
      border-radius: 8px;
      border: 1px solid #4444;
      background: var(--vscode-button-secondaryBackground);
      color: var(--vscode-button-secondaryForeground);
      cursor: pointer;
      outline: none;
      transition: filter .12s ease, transform .06s ease;
    }

    .btn:hover { filter: brightness(1.06); }
    .btn:active { transform: translateY(1px); }

    .btn.selected {
      background: #7a5a12;
      color: #d7d7d7;
      border-color: transparent;
    }

    .btn[disabled] {
      opacity: 0.55;
      cursor: not-allowed;
      filter: none;
      transform: none;
    }

    @keyframes pulseRing {
      0%   { box-shadow: 0 0 0 0 rgba(122,90,18,0.0); filter: brightness(1.0); }
      35%  { box-shadow: 0 0 0 3px rgba(122,90,18,0.55); filter: brightness(1.12); }
      100% { box-shadow: 0 0 0 0 rgba(122,90,18,0.0); filter: brightness(1.0); }
    }
    .btn.pulse {
      animation: pulseRing 320ms ease-out;
    }

    .btn:focus-visible { box-shadow: 0 0 0 2px #7a5a12aa; }

    .hint { font-size: 12px; opacity: .75; margin-top: 10px; }
    .sep { margin: 10px 0; border-top: 1px solid #4444; }
  </style>
</head>
<body>
  <div class="title">Rowtate</div>

  <button class="btn" data-cmd="rowtate.toggle">Toggle Key/Value Layout</button>
  <button class="btn" data-cmd="rowtate.toggleColoring">Toggle Coloring</button>

  <div class="sep"></div>

  <button class="btn" data-cmd="rowtate.blocksToVertical">Selection → Vertical</button>
  <button class="btn" data-cmd="rowtate.blocksToHorizontal">Selection → Horizontal</button>

  <div class="sep"></div>

  <button class="btn" data-cmd="rowtate.reorderVertical">Reorder (Vertical rows)</button>
  <button class="btn" data-cmd="rowtate.pickColors">Pick Colors</button>

  <div class="hint">
    Tip: selection commands act on block(s) under your cursor/selection.
  </div>

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    const buttons = Array.from(document.querySelectorAll("button[data-cmd]"));

    let busy = false;
    let pendingRequestId = null;

    function setSelected(btn) {
      buttons.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    }

    function pulse(btn) {
      btn.classList.remove("pulse");
      void btn.offsetWidth;
      btn.classList.add("pulse");
      setTimeout(() => btn.classList.remove("pulse"), 400);
    }

    function setBusy(on) {
      busy = on;
      buttons.forEach(b => b.disabled = on);
    }

    function makeRequestId() {
      return String(Date.now()) + "-" + Math.random().toString(16).slice(2);
    }

    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        if (busy) return;

        const alreadySelected = btn.classList.contains("selected");
        if (alreadySelected) pulse(btn);
        else setSelected(btn);

        setBusy(true);

        pendingRequestId = makeRequestId();
        vscode.postMessage({
          type: "cmd",
          command: btn.getAttribute("data-cmd"),
          requestId: pendingRequestId
        });
      });
    });

    window.addEventListener("message", (event) => {
      const msg = event.data;
      if (!msg || msg.type !== "done") return;
      if (pendingRequestId && msg.requestId !== pendingRequestId) return;

      pendingRequestId = null;
      setBusy(false);

      if (msg.ok === false) {
        const sel = buttons.find(b => b.classList.contains("selected"));
        if (sel) pulse(sel);
      }
    });
  </script>
</body>
</html>`;
}
