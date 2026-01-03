import { getNonce } from "../../utils/nonce";
import * as vscode from "vscode";

function getColorPickerHtml(
  webview: vscode.Webview,
  colors: {
    comment: string;
    key: string;
    value: string;
    target: "user" | "workspace";
  }
) {
  const nonce = getNonce();
  const csp = `
    default-src 'none';
    style-src ${webview.cspSource} 'unsafe-inline';
    script-src 'nonce-${nonce}';
  `
    .replace(/\s+/g, " ")
    .trim();

  // <input type="color"> only supports #RRGGBB, so we normalize by slicing first 7 chars if needed
  const norm = (c: string) =>
    c.startsWith("#") && c.length >= 7 ? c.slice(0, 7) : "#000000";

  return /* html */ `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="${csp}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rowtate: Pick Colors</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 16px; }
    .card { border: 1px solid #4444; border-radius: 10px; padding: 14px; }
    .row { display:flex; align-items:center; gap: 12px; margin: 12px 0; }
    label { width: 110px; opacity: .85; }
    input[type="text"] { width: 140px; padding: 6px 8px; }
    input[type="color"] { width: 44px; height: 30px; padding: 0; border: none; background: none; }
    .preview { margin-top: 14px; padding: 12px; border-radius: 8px; border: 1px solid #4444; background: var(--vscode-editor-background); }
    .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; white-space: pre; }
    .btns { display:flex; gap: 8px; margin-top: 14px; }
    button { padding: 6px 10px; cursor: pointer; }
    .small { opacity: .7; font-size: 12px; margin-top: 8px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="row">
      <label>Comment</label>
      <input id="commentPicker" type="color" value="${norm(colors.comment)}">
      <input id="commentText" type="text" value="${colors.comment}">
    </div>

    <div class="row">
      <label>Key</label>
      <input id="keyPicker" type="color" value="${norm(colors.key)}">
      <input id="keyText" type="text" value="${colors.key}">
    </div>

    <div class="row">
      <label>Value</label>
      <input id="valuePicker" type="color" value="${norm(colors.value)}">
      <input id="valueText" type="text" value="${colors.value}">
    </div>

    <div class="preview mono" id="preview">
<span id="cmt">// comment line</span>
<span id="key">#Key</span>\t<span id="val">Value</span>
    </div>

    <div class="btns">
      <button id="save">Save</button>
      <button id="cancel">Cancel</button>
      <button id="reset">Reset defaults</button>
    </div>

    <div class="small">
      Saved to: <b>${colors.target === "workspace" ? "Workspace" : "User"}</b>
      (change via <code>rowtate.colors.target</code> setting)
    </div>
  </div>

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();

    const commentPicker = document.getElementById("commentPicker");
    const keyPicker = document.getElementById("keyPicker");
    const valuePicker = document.getElementById("valuePicker");

    const commentText = document.getElementById("commentText");
    const keyText = document.getElementById("keyText");
    const valueText = document.getElementById("valueText");

    const cmt = document.getElementById("cmt");
    const key = document.getElementById("key");
    const val = document.getElementById("val");

    function applyPreview() {
      cmt.style.color = commentText.value;
      key.style.color = keyText.value;
      val.style.color = valueText.value;
    }

    function syncFromPicker(picker, text) {
      text.value = picker.value;
      applyPreview();
    }

    function syncFromText(text, picker) {
      // Accept any CSS color string in text (hex/rgb/etc), but only update picker if it's #RRGGBB
      const v = text.value.trim();
      if (/^#[0-9a-fA-F]{6}$/.test(v)) picker.value = v;
      applyPreview();
    }

    commentPicker.addEventListener("input", () => syncFromPicker(commentPicker, commentText));
    keyPicker.addEventListener("input", () => syncFromPicker(keyPicker, keyText));
    valuePicker.addEventListener("input", () => syncFromPicker(valuePicker, valueText));

    commentText.addEventListener("input", () => syncFromText(commentText, commentPicker));
    keyText.addEventListener("input", () => syncFromText(keyText, keyPicker));
    valueText.addEventListener("input", () => syncFromText(valueText, valuePicker));

    document.getElementById("save").addEventListener("click", () => {
      vscode.postMessage({
        type: "save",
        colors: {
          comment: commentText.value.trim(),
          key: keyText.value.trim(),
          value: valueText.value.trim()
        }
      });
    });

    document.getElementById("cancel").addEventListener("click", () => {
      vscode.postMessage({ type: "cancel" });
    });

    document.getElementById("reset").addEventListener("click", () => {
      vscode.postMessage({ type: "reset" });
    });

    applyPreview();
  </script>
</body>
</html>`;
}
export { getColorPickerHtml };
