"use strict";var ie=Object.create;var W=Object.defineProperty;var re=Object.getOwnPropertyDescriptor;var ae=Object.getOwnPropertyNames;var ce=Object.getPrototypeOf,de=Object.prototype.hasOwnProperty;var le=(e,n)=>{for(var t in n)W(e,t,{get:n[t],enumerable:!0})},q=(e,n,t,s)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of ae(n))!de.call(e,o)&&o!==t&&W(e,o,{get:()=>n[o],enumerable:!(s=re(n,o))||s.enumerable});return e};var x=(e,n,t)=>(t=e!=null?ie(ce(e)):{},q(n||!e||!e.__esModule?W(t,"default",{value:e,enumerable:!0}):t,e)),pe=e=>q(W({},"__esModule",{value:!0}),e);var ye={};le(ye,{activate:()=>we,deactivate:()=>he});module.exports=pe(ye);var T=x(require("vscode"));var k=x(require("vscode"));function L(){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n="";for(let t=0;t<32;t++)n+=e.charAt(Math.floor(Math.random()*e.length));return n}function j(e,n){let t=L();return`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="${`
    default-src 'none';
    img-src ${e.cspSource} data:;
    style-src ${e.cspSource} 'unsafe-inline';
    script-src 'nonce-${t}';
  `.replace(/\s+/g," ").trim()}">
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
      <img src="${n.logoUri}" alt="Rowtate animated logo" />
    </div>
    <div class="titleWrap">
      <div class="title">Rowtate</div>
      <div class="subtitle">Quick CSV row \u2194 key/value tools</div>
    </div>
  </div>

  <div class="cmd">
    <button class="btn" data-cmd="rowtate.toggle">Toggle Key/Value Layout</button>
    <div class="sub">
      <a data-bind="rowtate.toggle">Bind key\u2026</a>
      <span class="dot">\u2022</span>
      <a data-copy="rowtate.toggle">Copy command id</a>
    </div>
  </div>

  <div class="cmd">
    <button class="btn" data-cmd="rowtate.toggleColoring">Toggle Colouring</button>
    <div class="sub">
      <a data-bind="rowtate.toggleColoring">Bind key\u2026</a>
      <span class="dot">\u2022</span>
      <a data-copy="rowtate.toggleColoring">Copy command id</a>
    </div>
  </div>

  <div class="sep"></div>

  <div class="cmd">
    <button class="btn" data-cmd="rowtate.blocksToVertical">Selection \u2192 Vertical</button>
    <div class="sub">
      <a data-bind="rowtate.blocksToVertical">Bind key\u2026</a>
      <span class="dot">\u2022</span>
      <a data-copy="rowtate.blocksToVertical">Copy command id</a>
    </div>
  </div>

  <div class="cmd">
    <button class="btn" data-cmd="rowtate.blocksToHorizontal">Selection \u2192 Horizontal</button>
    <div class="sub">
      <a data-bind="rowtate.blocksToHorizontal">Bind key\u2026</a>
      <span class="dot">\u2022</span>
      <a data-copy="rowtate.blocksToHorizontal">Copy command id</a>
    </div>
  </div>

  <div class="sep"></div>

  <div class="cmd">
    <button class="btn" data-cmd="rowtate.reorderVertical">Reorder (Vertical rows)</button>
    <div class="sub">
      <a data-bind="rowtate.reorderVertical">Bind key\u2026</a>
      <span class="dot">\u2022</span>
      <a data-copy="rowtate.reorderVertical">Copy command id</a>
    </div>
  </div>

  <div class="cmd">
    <button class="btn" data-cmd="rowtate.pickColors">Pick Colours</button>
    <div class="sub">
      <a data-bind="rowtate.pickColors">Bind key\u2026</a>
      <span class="dot">\u2022</span>
      <a data-copy="rowtate.pickColors">Copy command id</a>
    </div>
  </div>

  <div class="hint">
    Tip: selection commands act on block(s) under your cursor/selection.
  </div>

  <script nonce="${t}">
    const vscode = acquireVsCodeApi();

    const buttons = Array.from(document.querySelectorAll("button[data-cmd]"));
    const bindLinks = Array.from(document.querySelectorAll("[data-bind]"));
    const copyLinks = Array.from(document.querySelectorAll("[data-copy]"));

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

      if (msg.ok === false) {
        const sel = buttons.find(b => b.classList.contains("selected"));
        if (sel) pulse(sel);
      }
    });
  </script>
</body>
</html>`}var $=class{constructor(n){this.extensionUri=n}resolveWebviewView(n){let t=n.webview;t.options={enableScripts:!0,localResourceRoots:[k.Uri.joinPath(this.extensionUri,"media")]};let s=t.asWebviewUri(k.Uri.joinPath(this.extensionUri,"media","rowtate-anim.gif"));t.html=j(t,{logoUri:String(s)}),t.onDidReceiveMessage(async o=>{if(!(!o||typeof o.type!="string")){if(o.type==="cmd"&&typeof o.command=="string"){let i=typeof o.requestId=="string"?o.requestId:"";try{await k.commands.executeCommand(o.command),t.postMessage({type:"done",requestId:i,ok:!0})}catch(r){t.postMessage({type:"done",requestId:i,ok:!1,error:String(r)}),k.window.showErrorMessage(`Rowtate: Failed to run ${o.command}: ${String(r)}`)}return}if(o.type==="bind"&&typeof o.command=="string"){await k.commands.executeCommand("workbench.action.openGlobalKeybindings"),k.window.showInformationMessage(`Keyboard Shortcuts opened. Search for: ${o.command} (or "Rowtate") to assign a keybinding.`);return}o.type==="copied"&&typeof o.command=="string"&&k.window.showInformationMessage(`Copied: ${o.command}`)}})}};var w=x(require("vscode"));var U=x(require("vscode"));function D(){let e=U.workspace.getConfiguration("rowtate");return{comment:e.get("colors.comment","#87c66b"),key:e.get("colors.key","#cd6060ff"),value:e.get("colors.value","#6aa2f7ff"),target:e.get("colors.target","user")}}function E(e){let n=[],t=0;for(;t<e.length;){let s=t,o=e[t].trim()==="",i=[];for(;t<e.length&&e[t].trim()===""===o;)i.push(e[t]),t++;let r=t-1;n.push({kind:o?"blank":"block",lines:i,startLine:s,endLine:r})}return n}function F(e){let n=[],t=[];for(let s of e)s.trim()===""?t.length>0&&(n.push(t),t=[]):t.push(s);return t.length>0&&n.push(t),n}function C(e){let n=e.map(r=>r.trim()).filter(r=>r.length>0&&!r.startsWith("//"));if(n.length<2)return!1;let t=n[0],s=n[1];if(!t.startsWith("#")||!t.includes(","))return!1;let o=(t.match(/,/g)||[]).length,i=(s.match(/,/g)||[]).length;return o>=1&&i>=1}function A(e){for(let n of e){let t=n.trim();if(!(!t||t.startsWith("//"))&&t.startsWith("#")&&(!t.includes(",")||/^#\S+\s+/.test(t)))return!0}return!1}function K(e){let n=E(e),t=0,s=0;for(let o of n)o.kind==="block"&&(C(o.lines)?t++:(A(o.lines),s++));return t>0&&s>0?"mixed":t>0?"horizontal":"vertical"}var d={coloringEnabled:!1,commentDeco:void 0,keyDeco:void 0,valueDeco:void 0,statusItem:void 0};function B(e){d.commentDeco?.dispose(),d.keyDeco?.dispose(),d.valueDeco?.dispose();let n=D();d.commentDeco=w.window.createTextEditorDecorationType({color:n.comment}),d.keyDeco=w.window.createTextEditorDecorationType({color:n.key}),d.valueDeco=w.window.createTextEditorDecorationType({color:n.value}),e.subscriptions.push(d.commentDeco,d.keyDeco,d.valueDeco)}function g(){let e=w.window.activeTextEditor;if(!e)return;let s=e.document.getText().split(/\r?\n/),o=[],i=[],r=[];for(let c=0;c<s.length;c++){let l=s[c];l.trim().startsWith("//")&&o.push(new w.Range(new w.Position(c,0),new w.Position(c,l.length)))}let a=E(s);for(let c of a)c.kind==="block"&&(C(c.lines)?me(c,i,r):ue(c,i,r));e.setDecorations(d.commentDeco,o),e.setDecorations(d.keyDeco,i),e.setDecorations(d.valueDeco,r)}function ue(e,n,t){for(let s=0;s<e.lines.length;s++){let o=e.startLine+s,i=e.lines[s],r=i.trim();if(!r.startsWith("#")||r.startsWith("//"))continue;let a=r.match(/^(\S+)(\s+)(.*)$/)||r.match(/^(\S+)$/);if(!a)continue;let c=a[1],l=a[2]??"",p=i.indexOf(c);if(p<0)continue;let u=p+c.length;if(n.push(new w.Range(o,p,o,u)),l){let m=u+l.length,v=i.length;m<=v&&t.push(new w.Range(o,m,o,v))}}}function me(e,n,t){let s=e.lines.map(c=>c.trim()),o=-1;for(let c=0;c<s.length;c++)if(!(s[c]===""||s[c].startsWith("//"))){o=c;break}if(o<0)return;let i=-1;for(let c=o+1;c<s.length;c++)if(!(s[c]===""||s[c].startsWith("//"))){i=c;break}if(i<0)return;let r=e.startLine+o,a=e.startLine+i;n.push(new w.Range(r,0,r,e.lines[o].length)),t.push(new w.Range(a,0,a,e.lines[i].length))}var I=x(require("vscode"));var S=x(require("vscode"));function P(e){let n=[],t="",s=!1;for(let o=0;o<e.length;o++){let i=e[o];if(i===","&&!s){n.push(O(t)),t="";continue}if(i==='"'){let r=e[o+1];if(s&&r==='"'){t+='""',o++;continue}s=!s,t+='"';continue}if(i==="\\"&&s){let r=e[o+1];if(r==='"'||r==="\\"){t+="\\"+r,o++;continue}}t+=i}return n.push(O(t)),n}function O(e){return e.trim()}function z(e){if(e==="")return"";let n=e.trim();return n.length>=2&&n.startsWith('"')&&n.endsWith('"')?n:/[",\r\n]/.test(e)||e!==e.trim()?`"${e.replace(/"/g,'""')}"`:e}function G(e){let n=F(e),t=[];for(let s of n){let o=[],i=0;for(;i<s.length&&!s[i].trim().startsWith("#");)o.push(s[i]),i++;if(i>=s.length){t.push(s.join(`
`));continue}let r=s[i],a=s[i+1];if(a===void 0){t.push(s.join(`
`));continue}let c=P(r),l=P(a),p=Math.max(c.length,l.length),u="	",m=[];for(let y=0;y<p;y++)m.push(`${c[y]??""}${u}${l[y]??""}`);let v=[...o,...m].join(`
`);t.push(v)}return t.join(`

`)+`
`}function Q(e){let n=F(e),t=[];for(let s of n){let o=[],i=[],r=[],a=null,c=()=>{a!==null&&(i.push(a),r.push(""),a=null)};for(let u=0;u<s.length;u++){let m=s[u],v=m.trim();if(v){if(v.startsWith("//")){o.push(m);continue}if(a!==null)if(v.startsWith("#"))i.push(a),r.push(""),a=null;else{i.push(a),r.push(v),a=null;continue}if(v.startsWith("#")){let y=v.match(/^(\S+)\s+(.+)$/);if(y){i.push(y[1].trim()),r.push(y[2].trim());continue}a=v;continue}o.push(m)}}if(c(),i.length===0){t.push(s.join(`
`));continue}let l=`${i.join(",")}
${r.map(z).join(",")}`,p=o.length>0?`${o.join(`
`)}
${l}`:l;t.push(p)}return t.join(`

`)+`
`}function M(e){let n=[],t=0;for(;t<e.length&&!e[t].trim().startsWith("#");)n.push(e[t]),t++;if(t>=e.length)return e;let s=e[t],o=e[t+1];if(o===void 0)return e;let i=P(s),r=P(o),a=Math.max(i.length,r.length),c="	",l=[];for(let p=0;p<a;p++)l.push(`${i[p]??""}${c}${r[p]??""}`);return[...n,...l]}function Y(e){let n=[],t=[],s=[],o=null,i=()=>{o!==null&&(t.push(o),s.push(""),o=null)};for(let l=0;l<e.length;l++){let p=e[l],u=p.trim();if(u){if(u.startsWith("//")){n.push(p);continue}if(o!==null)if(u.startsWith("#"))t.push(o),s.push(""),o=null;else{t.push(o),s.push(u),o=null;continue}if(u.startsWith("#")){let m=u.match(/^(\S+)\s+(.+)$/);if(m){t.push(m[1].trim()),s.push(m[2].trim());continue}o=u;continue}n.push(p)}}if(i(),t.length===0)return e;let r=t.join(","),a=s.map(z).join(","),c=[];return n.length>0&&c.push(...n),c.push(r),c.push(a),c}async function J(){let e=S.window.activeTextEditor;if(!e){S.window.showErrorMessage("Rowtate: No active text editor.");return}let n=e.document,t=n.getText(),s=t.split(/\r?\n/);if(s.every(l=>l.trim().length===0)){S.window.showErrorMessage("Rowtate: Document is empty.");return}let o=K(s),i;o==="mixed"&&(d.statusItem.text="$(sync) Rowtate: Mixed \u2192 Vertical",d.statusItem.show());let r;if(o==="horizontal")r=G(s);else if(o==="vertical")r=Q(s);else{let l=E(s),p=[];for(let u of l){if(u.kind==="blank"){p.push(...u.lines);continue}C(u.lines)?p.push(...M(u.lines)):p.push(...u.lines)}r=p.join(`
`).replace(/\s*$/,"")+`
`}let a=new S.Range(n.positionAt(0),n.positionAt(t.length)),c=new S.WorkspaceEdit;c.replace(n.uri,a,r),await S.workspace.applyEdit(c),d.coloringEnabled&&g(),o==="mixed"&&setTimeout(()=>d.statusItem.hide(),2500)}var V=x(require("vscode"));function X(){d.coloringEnabled=!d.coloringEnabled,d.coloringEnabled?(g(),V.window.setStatusBarMessage("Rowtate coloring: ON",2e3)):(ge(),V.window.setStatusBarMessage("Rowtate coloring: OFF",2e3))}function ge(){let e=V.window.activeTextEditor;e&&(e.setDecorations(d.commentDeco,[]),e.setDecorations(d.keyDeco,[]),e.setDecorations(d.valueDeco,[]))}var b=x(require("vscode"));async function H(e){let n=b.window.activeTextEditor;if(!n){b.window.showErrorMessage("Rowtate: No active text editor.");return}let t=n.document,s=t.getText(),o=s.split(/\r?\n/);if(o.every(u=>u.trim().length===0)){b.window.showErrorMessage("Rowtate: Document is empty.");return}let i=E(o),r=fe(n,i);if(r.size===0){b.window.showWarningMessage("Rowtate: No blocks selected.");return}let a=[];for(let u=0;u<i.length;u++){let m=i[u];if(m.kind==="blank"){a.push(...m.lines);continue}if(!r.has(u)){a.push(...m.lines);continue}e==="toVertical"?C(m.lines)?a.push(...M(m.lines)):a.push(...m.lines):A(m.lines)?a.push(...Y(m.lines)):a.push(...m.lines)}let c=a.join(`
`).replace(/\s*$/,"")+`
`,l=new b.Range(t.positionAt(0),t.positionAt(s.length)),p=new b.WorkspaceEdit;p.replace(t.uri,l,c),await b.workspace.applyEdit(p),d.coloringEnabled&&g()}function fe(e,n){let t=new Set,s=e.selections;for(let o of s){let i=o.start.line,r=o.end.line,a=Math.min(i,r),c=Math.max(i,r);if(o.isEmpty){let l=n.findIndex(p=>p.kind==="block"&&p.startLine<=a&&p.endLine>=a);l>=0&&t.add(l);continue}for(let l=0;l<n.length;l++){let p=n[l];if(p.kind!=="block")continue;!(p.endLine<a||p.startLine>c)&&t.add(l)}}return t}var h=x(require("vscode"));function Z(e,n){let t=L(),s=`
    default-src 'none';
    style-src ${e.cspSource} 'unsafe-inline';
    script-src 'nonce-${t}';
  `.replace(/\s+/g," ").trim(),o=i=>i.startsWith("#")&&i.length>=7?i.slice(0,7):"#000000";return`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="${s}">
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
      <input id="commentPicker" type="color" value="${o(n.comment)}">
      <input id="commentText" type="text" value="${n.comment}">
    </div>

    <div class="row">
      <label>Key</label>
      <input id="keyPicker" type="color" value="${o(n.key)}">
      <input id="keyText" type="text" value="${n.key}">
    </div>

    <div class="row">
      <label>Value</label>
      <input id="valuePicker" type="color" value="${o(n.value)}">
      <input id="valueText" type="text" value="${n.value}">
    </div>

    <div class="preview mono" id="preview">
<span id="cmt">// comment line</span>
<span id="key">#Key</span>	<span id="val">Value</span>
    </div>

    <div class="btns">
      <button id="save">Save</button>
      <button id="cancel">Cancel</button>
      <button id="reset">Reset defaults</button>
    </div>

    <div class="small">
      Saved to: <b>${n.target==="workspace"?"Workspace":"User"}</b>
      (change via <code>rowtate.colors.target</code> setting)
    </div>
  </div>

  <script nonce="${t}">
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
</html>`}async function _(e){let n=D(),t=h.window.createWebviewPanel("rowtateColors","Rowtate: Pick Colors",h.ViewColumn.Active,{enableScripts:!0,retainContextWhenHidden:!1});t.webview.html=Z(t.webview,n),t.webview.onDidReceiveMessage(async s=>{if(!(!s||typeof s.type!="string")){if(s.type==="save"){let{comment:o,key:i,value:r}=s.colors??{};if(typeof o!="string"||typeof i!="string"||typeof r!="string")return;let a=h.workspace.getConfiguration("rowtate"),c=n.target==="workspace"?h.ConfigurationTarget.Workspace:h.ConfigurationTarget.Global;await a.update("colors.comment",o,c),await a.update("colors.key",i,c),await a.update("colors.value",r,c),B(e),d.coloringEnabled&&g(),t.dispose()}if(s.type==="cancel"&&t.dispose(),s.type==="reset"){let o=h.workspace.getConfiguration("rowtate"),i=n.target==="workspace"?h.ConfigurationTarget.Workspace:h.ConfigurationTarget.Global;await o.update("colors.comment",void 0,i),await o.update("colors.key",void 0,i),await o.update("colors.value",void 0,i),B(e),d.coloringEnabled&&g(),t.dispose()}}})}var f=x(require("vscode"));function ee(e,n,t){let s=L(),o=JSON.stringify(n);return`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="${`
    default-src 'none';
    img-src ${e.cspSource} https:;
    style-src ${e.cspSource} 'unsafe-inline';
    script-src 'nonce-${s}';
  `.replace(/\s+/g," ").trim()}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Rowtate Reorder</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 10px; }
    .toolbar {
      position: sticky;
      top: 0;
      z-index: 10;
      display: flex;
      gap: 8px;
      align-items: center;
      padding: 10px 0;
      margin-bottom: 10px;
      background: var(--vscode-editor-background);
      border-bottom: 1px solid #4444;
    }
    button { padding:6px 10px; cursor:pointer; }
    .hint { opacity:0.75; font-size:12px; }

    .list { border: 1px solid #4444; border-radius: 8px; overflow: hidden; }
    .row {
      display: grid;
      grid-template-columns: 28px 1fr;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      border-top: 1px solid #4444;
      user-select: none;
    }
    .row:first-child { border-top: none; }

    .handle { opacity:0.7; cursor: grab; text-align:center; }
    .row.dragging { opacity: 0.5; }
    .row.drop-target { outline: 2px dashed #888; outline-offset: -2px; }

    .text { white-space: pre; overflow-x: auto; }
    .comment { color: ${t.comment}; }
    .kv-key { color: ${t.key}; }
    .kv-val { color: ${t.value}; }


    .blank .text { opacity: 0.5; font-style: italic; }
  </style>
</head>

<body>
  <div class="toolbar">
    <button id="apply">Apply</button>
    <button id="cancel">Cancel</button>
    <span class="hint">
      Drag rows to reorder. Only vertical blocks are shown, horizontal blocks are hidden and unchanged.
    </span>
  </div>

  <div id="list" class="list"></div>

  <script nonce="${s}">
    const vscode = acquireVsCodeApi();
    let lines = ${o};

    const listEl = document.getElementById("list");

    function classify(line) {
      const t = line.trim();
      if (t === "") return "blank";
      if (t.startsWith("//")) return "comment";
      if (t.startsWith("#")) return "kv";
      return "other";
    }

    function render() {
      listEl.innerHTML = "";
      lines.forEach((line, idx) => {
        const kind = classify(line);

        const row = document.createElement("div");
        row.className = "row " + kind;
        row.draggable = true;
        row.dataset.index = String(idx);

        const handle = document.createElement("div");
        handle.className = "handle";
        handle.textContent = "\u2261";

        const text = document.createElement("div");
        text.className = "text";

        if (kind === "blank") {
          text.textContent = "(blank)";
        } else if (kind === "comment") {
          const span = document.createElement("span");
          span.className = "comment";
          span.textContent = line;
          text.appendChild(span);
        } else if (kind === "kv") {
          // Try to color key/value separately for display only
          // (This doesn't affect saved output; saved output is exact original line string.)
          const m = line.match(/^(s*#\\S+)(\\s+)(.*)$/);
          if (m) {
            const keySpan = document.createElement("span");
            keySpan.className = "kv-key";
            keySpan.textContent = m[1];

            const wsSpan = document.createElement("span");
            wsSpan.textContent = m[2];

            const valSpan = document.createElement("span");
            valSpan.className = "kv-val";
            valSpan.textContent = m[3];

            text.appendChild(keySpan);
            text.appendChild(wsSpan);
            text.appendChild(valSpan);
          } else {
            // Key-only line
            const keySpan = document.createElement("span");
            keySpan.className = "kv-key";
            keySpan.textContent = line;
            text.appendChild(keySpan);
          }
        } else {
          text.textContent = line;
        }

        row.appendChild(handle);
        row.appendChild(text);
        listEl.appendChild(row);
      });

      wireDnD();
    }

    let dragFromIndex = null;

    function wireDnD() {
      const rows = Array.from(listEl.querySelectorAll(".row"));

      rows.forEach(row => {
        row.addEventListener("dragstart", (e) => {
          dragFromIndex = Number(row.dataset.index);
          row.classList.add("dragging");
          e.dataTransfer.effectAllowed = "move";
        });

        row.addEventListener("dragend", () => {
          dragFromIndex = null;
          row.classList.remove("dragging");
          rows.forEach(r => r.classList.remove("drop-target"));
        });

        row.addEventListener("dragover", (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
          row.classList.add("drop-target");
        });

        row.addEventListener("dragleave", () => {
          row.classList.remove("drop-target");
        });

        row.addEventListener("drop", (e) => {
          e.preventDefault();
          const toIndex = Number(row.dataset.index);
          rows.forEach(r => r.classList.remove("drop-target"));

          if (dragFromIndex === null || Number.isNaN(toIndex)) return;
          if (toIndex === dragFromIndex) return;

          const [moved] = lines.splice(dragFromIndex, 1);
          lines.splice(toIndex, 0, moved);

          // Re-render so indices stay correct
          render();
        });
      });
    }

    document.getElementById("apply").addEventListener("click", () => {
      // Convert "(blank)" placeholders back to actual empty lines
      // In our model, blank lines are stored as "" already.
      vscode.postMessage({ type: "apply", lines });
    });

    document.getElementById("cancel").addEventListener("click", () => {
      vscode.postMessage({ type: "cancel" });
    });

    render();
  </script>
</body>
</html>
`}async function te(){let e=f.window.activeTextEditor;if(!e){f.window.showErrorMessage("Rowtate: No active text editor.");return}let n=e.document,t=n.getText(),s=t.split(/\r?\n/);if(s.every(a=>a.trim().length===0)){f.window.showErrorMessage("Rowtate: Document is empty.");return}let o=ve(s);if(!o.includedSegIndexes.some(a=>o.segments[a]?.kind==="block")){f.window.showWarningMessage("Rowtate: No vertical blocks found to reorder (only horizontal blocks detected).");return}let i=f.window.createWebviewPanel("rowtateReorder","Rowtate: Reorder Vertical Rows (Mixed Mode OK)",f.ViewColumn.Beside,{enableScripts:!0,retainContextWhenHidden:!0}),r=D();i.webview.html=ee(i.webview,o.flatLines,r),i.webview.onDidReceiveMessage(async a=>{if(!(!a||typeof a.type!="string")){if(a.type==="apply"){let c=a.lines;if(!Array.isArray(c))return;if(c.length!==o.flatLines.length){f.window.showErrorMessage("Rowtate: Reorder apply failed (line count mismatch).");return}let l=o.segments.map(R=>({...R})),p=0;for(let R=0;R<o.includedSegIndexes.length;R++){let ne=o.includedSegIndexes[R],N=o.includedSegLengths[R],se=c.slice(p,p+N);p+=N,l[ne].lines=se}let u=[];for(let R of l)u.push(...R.lines);let m=u.join(`
`).replace(/\s*$/,"")+`
`,v=new f.Range(n.positionAt(0),n.positionAt(t.length)),y=new f.WorkspaceEdit;y.replace(n.uri,v,m),await f.workspace.applyEdit(y),await n.save(),d.coloringEnabled&&g(),i.dispose()}a.type==="cancel"&&i.dispose()}})}function ve(e){let n=E(e),t=[],s=[],o=[],i=r=>r.kind==="block"&&!C(r.lines);for(let r=0;r<n.length;r++){let a=n[r];if(i(a)){t.push(r),s.push(a.lines.length),o.push(...a.lines);continue}if(a.kind==="blank"){let c=n[r-1],l=n[r+1],p=c?i(c):!1,u=l?i(l):!1;p&&u&&(t.push(r),s.push(a.lines.length),o.push(...a.lines))}}return{segments:n,includedSegIndexes:t,includedSegLengths:s,flatLines:o}}function oe(e){e.subscriptions.push(I.commands.registerCommand("rowtate.toggle",J),I.commands.registerCommand("rowtate.toggleColoring",X),I.commands.registerCommand("rowtate.reorderVertical",te),I.commands.registerCommand("rowtate.blocksToVertical",()=>H("toVertical")),I.commands.registerCommand("rowtate.blocksToHorizontal",()=>H("toHorizontal")),I.commands.registerCommand("rowtate.pickColors",()=>_(e)))}function we(e){console.log("Rowtate is now active!");let n=new $(e.extensionUri);e.subscriptions.push(T.window.registerWebviewViewProvider("rowtate.sidebar",n)),B(e),d.statusItem=T.window.createStatusBarItem(T.StatusBarAlignment.Left,1e3),d.statusItem.hide(),e.subscriptions.push(d.statusItem),oe(e),e.subscriptions.push(T.workspace.onDidChangeConfiguration(t=>{(t.affectsConfiguration("rowtate.colors.comment")||t.affectsConfiguration("rowtate.colors.key")||t.affectsConfiguration("rowtate.colors.value"))&&(B(e),d.coloringEnabled&&g())})),e.subscriptions.push(T.window.onDidChangeActiveTextEditor(()=>{d.coloringEnabled&&g()}),T.workspace.onDidChangeTextDocument(()=>{d.coloringEnabled&&g()}))}function he(){}0&&(module.exports={activate,deactivate});
