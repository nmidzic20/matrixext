"use strict";var he=Object.create;var z=Object.defineProperty;var we=Object.getOwnPropertyDescriptor;var ye=Object.getOwnPropertyNames;var be=Object.getPrototypeOf,xe=Object.prototype.hasOwnProperty;var ke=(e,n)=>{for(var t in n)z(e,t,{get:n[t],enumerable:!0})},Z=(e,n,t,s)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of ye(n))!xe.call(e,o)&&o!==t&&z(e,o,{get:()=>n[o],enumerable:!(s=we(n,o))||s.enumerable});return e};var L=(e,n,t)=>(t=e!=null?he(be(e)):{},Z(n||!e||!e.__esModule?z(t,"default",{value:e,enumerable:!0}):t,e)),Ee=e=>Z(z({},"__esModule",{value:!0}),e);var We={};ke(We,{activate:()=>De,deactivate:()=>Be});module.exports=Ee(We);var I=L(require("vscode"));var S=L(require("vscode"));function B(){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n="";for(let t=0;t<32;t++)n+=e.charAt(Math.floor(Math.random()*e.length));return n}function _(e,n){let t=B();return`<!DOCTYPE html>
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
      <img src="${n.logoUri}" alt="Rowtate animated logo" />
    </div>
    <div class="titleWrap">
      <div class="title">Rowtate</div>
      <div class="subtitle">Quick CSV row \u2194 key/value tools</div>
    </div>
  </div>

  <div class="hint">
    Tip: "Toggle Selection Layout" command acts on block(s) under your cursor (single block) or selection (single or multiple blocks).
  </div>

  <div class="cmd">
    <button class="btn" data-cmd="rowtate.toggleBlocksLayout">
      Toggle Selection (default: Ctrl+Alt+Q)
    </button>
    <div class="sub">
      <a data-bind="rowtate.toggleBlocksLayout">Bind key\u2026</a>
      <span class="dot">\u2022</span>
      <a data-copy="rowtate.toggleBlocksLayout">Copy command id</a>
    </div>
  </div>

<div class="cmd">
    <button class="btn" data-cmd="rowtate.toggle">Toggle File (default: Ctrl+Alt+R)</button>
    <div class="sub">
      <a data-bind="rowtate.toggle">Bind key\u2026</a>
      <span class="dot">\u2022</span>
      <a data-copy="rowtate.toggle">Copy command id</a>
    </div>
  </div>

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

  <script nonce="${t}">
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
</html>`}var H=class{constructor(n){this.extensionUri=n}resolveWebviewView(n){let t=n.webview;t.options={enableScripts:!0,localResourceRoots:[S.Uri.joinPath(this.extensionUri,"media")]};let s=t.asWebviewUri(S.Uri.joinPath(this.extensionUri,"media","rowtate-anim.gif"));t.html=_(t,{logoUri:String(s)}),t.onDidReceiveMessage(async o=>{if(!(!o||typeof o.type!="string")){if(o.type==="cmd"&&typeof o.command=="string"){let i=typeof o.requestId=="string"?o.requestId:"";try{await S.commands.executeCommand(o.command),t.postMessage({type:"done",requestId:i,ok:!0})}catch(r){t.postMessage({type:"done",requestId:i,ok:!1,error:String(r)}),S.window.showErrorMessage(`Rowtate: Failed to run ${o.command}: ${String(r)}`)}return}if(o.type==="bind"&&typeof o.command=="string"){await S.commands.executeCommand("workbench.action.openGlobalKeybindings"),S.window.showInformationMessage(`Keyboard Shortcuts opened. Search for: ${o.command} (or "Rowtate") to assign a keybinding.`);return}o.type==="copied"&&typeof o.command=="string"&&S.window.showInformationMessage(`Copied: ${o.command}`)}})}};var x=L(require("vscode"));var ee=L(require("vscode"));function W(){let e=ee.workspace.getConfiguration("rowtate");return{comment:e.get("colors.comment","#87c66b"),key:e.get("colors.key","#cd6060ff"),value:e.get("colors.value","#6aa2f7ff"),target:e.get("colors.target","user")}}function C(e){let n=[],t=0;for(;t<e.length;){let s=t,o=e[t].trim()==="",i=[];for(;t<e.length&&e[t].trim()===""===o;)i.push(e[t]),t++;let r=t-1;n.push({kind:o?"blank":"block",lines:i,startLine:s,endLine:r})}return n}function G(e){let n=[],t=[];for(let s of e)s.trim()===""?t.length>0&&(n.push(t),t=[]):t.push(s);return t.length>0&&n.push(t),n}function R(e){let n=e.map(r=>r.trim()).filter(r=>r.length>0&&!r.startsWith("//"));if(n.length<2)return!1;let t=n[0],s=n[1];if(!t.startsWith("#")||!t.includes(","))return!1;let o=(t.match(/,/g)||[]).length,i=(s.match(/,/g)||[]).length;return o>=1&&i>=1}function q(e){for(let n of e){let t=n.trim();if(!(!t||t.startsWith("//"))&&t.startsWith("#")&&(!t.includes(",")||/^#\S+\s+/.test(t)))return!0}return!1}function te(e){let n=C(e),t=0,s=0;for(let o of n)o.kind==="block"&&(R(o.lines)?t++:(q(o.lines),s++));return t>0&&s>0?"mixed":t>0?"horizontal":"vertical"}var m={commentDeco:void 0,keyDeco:void 0,valueDeco:void 0,statusItem:void 0};function M(e){m.commentDeco?.dispose(),m.keyDeco?.dispose(),m.valueDeco?.dispose();let n=W();m.commentDeco=x.window.createTextEditorDecorationType({color:n.comment}),m.keyDeco=x.window.createTextEditorDecorationType({color:n.key}),m.valueDeco=x.window.createTextEditorDecorationType({color:n.value}),e.subscriptions.push(m.commentDeco,m.keyDeco,m.valueDeco)}function y(){let e=x.window.activeTextEditor;if(!e)return;let s=e.document.getText().split(/\r?\n/),o=[],i=[],r=[];for(let c=0;c<s.length;c++){let l=s[c];l.trim().startsWith("//")&&o.push(new x.Range(new x.Position(c,0),new x.Position(c,l.length)))}let a=C(s);for(let c of a)c.kind==="block"&&(R(c.lines)||Se(c,i,r));e.setDecorations(m.commentDeco,o),e.setDecorations(m.keyDeco,i),e.setDecorations(m.valueDeco,r)}function Se(e,n,t){for(let s=0;s<e.lines.length;s++){let o=e.startLine+s,i=e.lines[s],r=i.trim();if(!r.startsWith("#")||r.startsWith("//"))continue;let a=r.match(/^(\S+)(\s+)(.*)$/)||r.match(/^(\S+)$/);if(!a)continue;let c=a[1],l=a[2]??"",d=i.indexOf(c);if(d<0)continue;let u=d+c.length;if(n.push(new x.Range(o,d,o,u)),l){let g=u+l.length,v=i.length;g<=v&&t.push(new x.Range(o,g,o,v))}}}var A=L(require("vscode"));var T=L(require("vscode"));function $(e){let n=[],t="",s=!1;for(let o=0;o<e.length;o++){let i=e[o];if(i===","&&!s){n.push(ne(t)),t="";continue}if(i==='"'){let r=e[o+1];if(s&&r==='"'){t+='""',o++;continue}s=!s,t+='"';continue}if(i==="\\"&&s){let r=e[o+1];if(r==='"'||r==="\\"){t+="\\"+r,o++;continue}}t+=i}return n.push(ne(t)),n}function ne(e){return e.trim()}function Q(e){if(e==="")return"";let n=e.trim();return n.length>=2&&n.startsWith('"')&&n.endsWith('"')?n:/[",\r\n]/.test(e)||e!==e.trim()?`"${e.replace(/"/g,'""')}"`:e}function oe(e){let n=G(e),t=[];for(let s of n){let o=[],i=0;for(;i<s.length&&!s[i].trim().startsWith("#");)o.push(s[i]),i++;if(i>=s.length){t.push(s.join(`
`));continue}let r=s[i],a=s[i+1];if(a===void 0){t.push(s.join(`
`));continue}let c=$(r),l=$(a),d=Math.max(c.length,l.length),u="	",g=[];for(let w=0;w<d;w++)g.push(`${c[w]??""}${u}${l[w]??""}`);let v=[...o,...g].join(`
`);t.push(v)}return t.join(`

`)+`
`}function se(e){let n=G(e),t=[];for(let s of n){let o=[],i=[],r=[],a=null,c=()=>{a!==null&&(i.push(a),r.push(""),a=null)};for(let u=0;u<s.length;u++){let g=s[u],v=g.trim();if(v){if(v.startsWith("//")){o.push(g);continue}if(a!==null)if(v.startsWith("#"))i.push(a),r.push(""),a=null;else{i.push(a),r.push(v),a=null;continue}if(v.startsWith("#")){let w=v.match(/^(\S+)\s+(.+)$/);if(w){i.push(w[1].trim()),r.push(w[2].trim());continue}a=v;continue}o.push(g)}}if(c(),i.length===0){t.push(s.join(`
`));continue}let l=`${i.join(",")}
${r.map(Q).join(",")}`,d=o.length>0?`${o.join(`
`)}
${l}`:l;t.push(d)}return t.join(`

`)+`
`}function j(e){let n=[],t=0;for(;t<e.length&&!e[t].trim().startsWith("#");)n.push(e[t]),t++;if(t>=e.length)return e;let s=e[t],o=e[t+1];if(o===void 0)return e;let i=$(s),r=$(o),a=Math.max(i.length,r.length),c="	",l=[];for(let d=0;d<a;d++)l.push(`${i[d]??""}${c}${r[d]??""}`);return[...n,...l]}function ie(e){let n=[],t=[],s=[],o=null,i=()=>{o!==null&&(t.push(o),s.push(""),o=null)};for(let l=0;l<e.length;l++){let d=e[l],u=d.trim();if(u){if(u.startsWith("//")){n.push(d);continue}if(o!==null)if(u.startsWith("#"))t.push(o),s.push(""),o=null;else{t.push(o),s.push(u),o=null;continue}if(u.startsWith("#")){let g=u.match(/^(\S+)\s+(.+)$/);if(g){t.push(g[1].trim()),s.push(g[2].trim());continue}o=u;continue}n.push(d)}}if(i(),t.length===0)return e;let r=t.join(","),a=s.map(Q).join(","),c=[];return n.length>0&&c.push(...n),c.push(r),c.push(a),c}async function re(){let e=T.window.activeTextEditor;if(!e){T.window.showErrorMessage("Rowtate: No active text editor.");return}let n=e.document,t=n.getText(),s=t.split(/\r?\n/);if(s.every(l=>l.trim().length===0)){T.window.showErrorMessage("Rowtate: Document is empty.");return}let o=te(s),i;o==="mixed"&&(m.statusItem.text="$(sync) Rowtate: Mixed \u2192 Vertical",m.statusItem.show());let r;if(o==="horizontal")r=oe(s);else if(o==="vertical")r=se(s);else{let l=C(s),d=[];for(let u of l){if(u.kind==="blank"){d.push(...u.lines);continue}R(u.lines)?d.push(...j(u.lines)):d.push(...u.lines)}r=d.join(`
`).replace(/\s*$/,"")+`
`}let a=new T.Range(n.positionAt(0),n.positionAt(t.length)),c=new T.WorkspaceEdit;c.replace(n.uri,a,r),await T.workspace.applyEdit(c),y(),o==="mixed"&&setTimeout(()=>m.statusItem.hide(),2500)}var p=L(require("vscode"));async function ce(){let e=p.window.activeTextEditor;if(!e){p.window.showErrorMessage("Rowtate: No active text editor.");return}let n=e.document,t=n.getText(),s=t.split(/\r?\n/);if(s.every(b=>b.trim().length===0)){p.window.showErrorMessage("Rowtate: Document is empty.");return}let o=C(s),i=Te(e,o);if(i.size===0){p.window.showWarningMessage("Rowtate: No blocks selected.");return}let r=e.selection.active,a=Re(o,r.line),c=!1,l=!1;for(let b of i){let f=o[b];!f||f.kind!=="block"||Le(f.lines)||(R(f.lines)?c=!0:q(f.lines)&&(l=!0))}if(!c&&!l){p.window.showWarningMessage("Rowtate: No convertible blocks selected.");return}if(c&&l){p.window.showWarningMessage("Rowtate: Selected blocks are mixed (some horizontal, some vertical). Select blocks in the same layout and try again.");return}let d=c?"toVertical":"toHorizontal",u=[],g=null,v=null,w=[],E=b=>{for(let f=0;f<b.length;f++){let D=b[f].trim();if(D!==""&&!D.startsWith("//"))return f}return 0};for(let b=0;b<o.length;b++){let f=o[b],D=u.length;if(f.kind==="blank"){u.push(...f.lines);continue}let P=f.lines,O=!1;if(i.has(b)&&(d==="toVertical"?R(f.lines)&&(P=j(f.lines),O=!0):q(f.lines)&&(P=ie(f.lines),O=!0)),u.push(...P),O){let J=D,X=D+P.length-1;X>=J&&w.push(new p.Range(J,0,X,0))}b===a&&(g=D,v=D+E(P))}let U=u.join(`
`).replace(/\s*$/,"")+`
`,V=new p.Range(n.positionAt(0),n.positionAt(t.length)),N=new p.WorkspaceEdit;N.replace(n.uri,V,U),await p.workspace.applyEdit(N);let K=e.document,ge=v??g??Math.min(r.line,K.lineCount-1),Y=Math.max(0,Math.min(ge,K.lineCount-1)),fe=K.lineAt(Y).text.length,ve=Math.max(0,Math.min(r.character,fe)),F=new p.Position(Y,ve);e.selection=new p.Selection(F,F),e.revealRange(new p.Range(F,F),p.TextEditorRevealType.AtTop),y(),Ce(e,w,260)}var ae=p.window.createTextEditorDecorationType({isWholeLine:!0,backgroundColor:"rgba(122, 90, 18, 0.35)",borderRadius:"4px"});function Ce(e,n,t=300){n.length&&(e.setDecorations(ae,n),setTimeout(()=>{try{e.setDecorations(ae,[])}catch{}},t))}function Re(e,n){let t=-1;for(let s=0;s<e.length;s++){let o=e[s];if(o.startLine<=n&&o.endLine>=n)return s;o.endLine<n&&(t=s)}return t>=0?t:0}function Te(e,n){let t=new Set,s=e.selections;for(let o of s){let i=o.start.line,r=o.end.line,a=Math.min(i,r),c=Math.max(i,r);if(o.isEmpty){let l=n.findIndex(d=>d.kind==="block"&&d.startLine<=a&&d.endLine>=a);l>=0&&t.add(l);continue}for(let l=0;l<n.length;l++){let d=n[l];if(d.kind!=="block")continue;!(d.endLine<a||d.startLine>c)&&t.add(l)}}return t}function Le(e){let n=!1;for(let t of e){let s=t.trim();if(s&&(n=!0,!s.startsWith("//")))return!1}return n}var k=L(require("vscode"));function le(e,n){let t=B(),s=`
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
</html>`}async function de(e){let n=W(),t=k.window.createWebviewPanel("rowtateColors","Rowtate: Pick Colors",k.ViewColumn.Active,{enableScripts:!0,retainContextWhenHidden:!1});t.webview.html=le(t.webview,n),t.webview.onDidReceiveMessage(async s=>{if(!(!s||typeof s.type!="string")){if(s.type==="save"){let{comment:o,key:i,value:r}=s.colors??{};if(typeof o!="string"||typeof i!="string"||typeof r!="string")return;let a=k.workspace.getConfiguration("rowtate"),c=n.target==="workspace"?k.ConfigurationTarget.Workspace:k.ConfigurationTarget.Global;await a.update("colors.comment",o,c),await a.update("colors.key",i,c),await a.update("colors.value",r,c),M(e),y(),t.dispose()}if(s.type==="cancel"&&t.dispose(),s.type==="reset"){let o=k.workspace.getConfiguration("rowtate"),i=n.target==="workspace"?k.ConfigurationTarget.Workspace:k.ConfigurationTarget.Global;await o.update("colors.comment",void 0,i),await o.update("colors.key",void 0,i),await o.update("colors.value",void 0,i),M(e),y(),t.dispose()}}})}var h=L(require("vscode"));function ue(e,n,t){let s=B(),o=JSON.stringify(n);return`
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
`}async function pe(){let e=h.window.activeTextEditor;if(!e){h.window.showErrorMessage("Rowtate: No active text editor.");return}let n=e.document,t=n.getText(),s=t.split(/\r?\n/);if(s.every(a=>a.trim().length===0)){h.window.showErrorMessage("Rowtate: Document is empty.");return}let o=Ie(s);if(!o.includedSegIndexes.some(a=>o.segments[a]?.kind==="block")){h.window.showWarningMessage("Rowtate: No vertical blocks found to reorder (only horizontal blocks detected).");return}let i=h.window.createWebviewPanel("rowtateReorder","Rowtate: Reorder Vertical Rows (Mixed Mode OK)",h.ViewColumn.Beside,{enableScripts:!0,retainContextWhenHidden:!0}),r=W();i.webview.html=ue(i.webview,o.flatLines,r),i.webview.onDidReceiveMessage(async a=>{if(!(!a||typeof a.type!="string")){if(a.type==="apply"){let c=a.lines;if(!Array.isArray(c))return;if(c.length!==o.flatLines.length){h.window.showErrorMessage("Rowtate: Reorder apply failed (line count mismatch).");return}let l=o.segments.map(E=>({...E})),d=0;for(let E=0;E<o.includedSegIndexes.length;E++){let U=o.includedSegIndexes[E],V=o.includedSegLengths[E],N=c.slice(d,d+V);d+=V,l[U].lines=N}let u=[];for(let E of l)u.push(...E.lines);let g=u.join(`
`).replace(/\s*$/,"")+`
`,v=new h.Range(n.positionAt(0),n.positionAt(t.length)),w=new h.WorkspaceEdit;w.replace(n.uri,v,g),await h.workspace.applyEdit(w),await n.save(),y(),i.dispose()}a.type==="cancel"&&i.dispose()}})}function Ie(e){let n=C(e),t=[],s=[],o=[],i=r=>r.kind==="block"&&!R(r.lines);for(let r=0;r<n.length;r++){let a=n[r];if(i(a)){t.push(r),s.push(a.lines.length),o.push(...a.lines);continue}if(a.kind==="blank"){let c=n[r-1],l=n[r+1],d=c?i(c):!1,u=l?i(l):!1;d&&u&&(t.push(r),s.push(a.lines.length),o.push(...a.lines))}}return{segments:n,includedSegIndexes:t,includedSegLengths:s,flatLines:o}}function me(e){e.subscriptions.push(A.commands.registerCommand("rowtate.toggle",re),A.commands.registerCommand("rowtate.reorderVertical",pe),A.commands.registerCommand("rowtate.toggleBlocksLayout",()=>ce()),A.commands.registerCommand("rowtate.pickColors",()=>de(e)))}function De(e){console.log("Rowtate is now active!");let n=new H(e.extensionUri);e.subscriptions.push(I.window.registerWebviewViewProvider("rowtate.sidebar",n)),M(e),m.statusItem=I.window.createStatusBarItem(I.StatusBarAlignment.Left,1e3),m.statusItem.hide(),e.subscriptions.push(m.statusItem),me(e),e.subscriptions.push(I.workspace.onDidChangeConfiguration(t=>{(t.affectsConfiguration("rowtate.colors.comment")||t.affectsConfiguration("rowtate.colors.key")||t.affectsConfiguration("rowtate.colors.value"))&&(M(e),y())})),e.subscriptions.push(I.window.onDidChangeActiveTextEditor(()=>{y()}),I.workspace.onDidChangeTextDocument(()=>{y()})),y()}function Be(){}0&&(module.exports={activate,deactivate});
