// src/webviews/sidebar/html.ts
import * as vscode from "vscode";
import { getNonce } from "../../utils/nonce";

export function getSidebarHtml(
  webview: vscode.Webview,
  opts: { logoUri: string }
): string {
  const nonce = getNonce();

  const csp = `
    default-src 'none';
    img-src ${webview.cspSource} data:;
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

    .header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
      padding: 10px;
      border: 1px solid #4444;
      border-radius: 10px;
      background: var(--vscode-editor-background);
    }

    .logo {
      width: 64px;
      height: 64px;
      flex: 0 0 auto;
      border-radius: 12px;
      overflow: hidden;
      background: #0b1020;
      border: 1px solid #4444;
      display: grid;
      place-items: center;
    }
    .logo img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
    }

    .titleWrap { line-height: 1.1; }
    .title { font-weight: 650; }
    .subtitle { font-size: 12px; opacity: .75; margin-top: 2px; }

    .cmd { margin: 6px 0 10px; }

    .btn {
      width: 100%;
      text-align: left;
      padding: 8px 10px;
      margin: 0;
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

    .btn.flash {
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
    .btn.pulse { animation: pulseRing 320ms ease-out; }
    .btn:focus-visible { box-shadow: 0 0 0 2px #7a5a12aa; }

    .sub {
      display: flex;
      gap: 8px;
      align-items: center;
      margin: 4px 2px 0;
      font-size: 12px;
      opacity: .95;
      user-select: none;
      flex-wrap: wrap;
    }

    .sub a {
      color: #7fb7ff;
      text-decoration: none;
      cursor: pointer;
    }
    .sub a:hover { text-decoration: underline; }

    .dot { opacity: .5; }

    .hint { font-size: 12px; opacity: .75; margin-top: 10px; }
    .sep { margin: 10px 0; border-top: 1px solid #4444; }
  </style>
</head>

<body>
  <div class="header">
    <div class="logo" aria-label="Rowtate logo">
      <img src="${opts.logoUri}" alt="Rowtate animated logo" />
    </div>
    <div class="titleWrap">
      <div class="title">Rowtate</div>
      <div class="subtitle">Quick CSV row ↔ key/value tools</div>
    </div>
  </div>

  <div class="hint">
    Tip: "Toggle Selection Layout" command acts on block(s) under your cursor (single block) or selection (single or multiple blocks).
  </div>

  <div class="cmd">
    <button class="btn" data-cmd="rowtate.toggleBlocksLayout">
      Toggle Selection Layout (Horizontal ↔ Vertical)
    </button>
    <div class="sub">
      <a data-bind="rowtate.toggleBlocksLayout">Bind key…</a>
      <span class="dot">•</span>
      <a data-copy="rowtate.toggleBlocksLayout">Copy command id</a>
    </div>
  </div>

<div class="cmd">
    <button class="btn" data-cmd="rowtate.toggle">Toggle File Layout</button>
    <div class="sub">
      <a data-bind="rowtate.toggle">Bind key…</a>
      <span class="dot">•</span>
      <a data-copy="rowtate.toggle">Copy command id</a>
    </div>
  </div>

  <div class="cmd">
    <button class="btn" data-cmd="rowtate.toggleColours">Toggle Colours</button>
    <div class="sub">
      <a data-bind="rowtate.toggleColours">Bind key…</a>
      <span class="dot">•</span>
      <a data-copy="rowtate.toggleColours">Copy command id</a>
    </div>
  </div>

  <div class="cmd">
    <button class="btn" data-cmd="rowtate.reorderVertical">Reorder (Vertical rows)</button>
    <div class="sub">
      <a data-bind="rowtate.reorderVertical">Bind key…</a>
      <span class="dot">•</span>
      <a data-copy="rowtate.reorderVertical">Copy command id</a>
    </div>
  </div>

  <div class="cmd">
    <button class="btn" data-cmd="rowtate.pickColors">Pick Colours</button>
    <div class="sub">
      <a data-bind="rowtate.pickColors">Bind key…</a>
      <span class="dot">•</span>
      <a data-copy="rowtate.pickColors">Copy command id</a>
    </div>
  </div>

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();

    const buttons = Array.from(document.querySelectorAll("button[data-cmd]"));
    const bindLinks = Array.from(document.querySelectorAll("[data-bind]"));
    const copyLinks = Array.from(document.querySelectorAll("[data-copy]"));

    let busy = false;
    let pendingRequestId = null;

    function flash(btn) {
      btn.classList.remove("flash");
      void btn.offsetWidth; // restart
      btn.classList.add("flash");
      setTimeout(() => btn.classList.remove("flash"), 180);
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

      bindLinks.forEach(a => a.style.pointerEvents = on ? "none" : "auto");
      bindLinks.forEach(a => a.style.opacity = on ? "0.55" : "1");

      copyLinks.forEach(a => a.style.pointerEvents = on ? "none" : "auto");
      copyLinks.forEach(a => a.style.opacity = on ? "0.55" : "1");
    }

    function makeRequestId() {
      return String(Date.now()) + "-" + Math.random().toString(16).slice(2);
    }

    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        if (busy) return;

        flash(btn);

        setBusy(true);

        pendingRequestId = makeRequestId();
        vscode.postMessage({
          type: "cmd",
          command: btn.getAttribute("data-cmd"),
          requestId: pendingRequestId
        });
      });
    });

    bindLinks.forEach(a => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        if (busy) return;
        vscode.postMessage({ type: "bind", command: a.getAttribute("data-bind") });
      });
    });

    copyLinks.forEach(a => {
      a.addEventListener("click", async (e) => {
        e.preventDefault();
        if (busy) return;
        const cmd = a.getAttribute("data-copy");
        try { await navigator.clipboard.writeText(cmd); } catch {}
        vscode.postMessage({ type: "copied", command: cmd });
      });
    });

    window.addEventListener("message", (event) => {
      const msg = event.data;
      if (!msg || msg.type !== "done") return;
      if (pendingRequestId && msg.requestId !== pendingRequestId) return;

      pendingRequestId = null;
      setBusy(false);

      
    });
  </script>
</body>
</html>`;
}
