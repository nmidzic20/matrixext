"use strict";var ye=Object.create;var z=Object.defineProperty;var be=Object.getOwnPropertyDescriptor;var xe=Object.getOwnPropertyNames;var ke=Object.getPrototypeOf,Ee=Object.prototype.hasOwnProperty;var Se=(e,n)=>{for(var t in n)z(e,t,{get:n[t],enumerable:!0})},_=(e,n,t,s)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of xe(n))!Ee.call(e,o)&&o!==t&&z(e,o,{get:()=>n[o],enumerable:!(s=be(n,o))||s.enumerable});return e};var S=(e,n,t)=>(t=e!=null?ye(ke(e)):{},_(n||!e||!e.__esModule?z(t,"default",{value:e,enumerable:!0}):t,e)),Ce=e=>_(z({},"__esModule",{value:!0}),e);var $e={};Se($e,{activate:()=>We,deactivate:()=>Pe});module.exports=Ce($e);var I=S(require("vscode"));var C=S(require("vscode"));function B(){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n="";for(let t=0;t<32;t++)n+=e.charAt(Math.floor(Math.random()*e.length));return n}function ee(e,n){let t=B();return`<!DOCTYPE html>
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
      Toggle Selection Layout (Horizontal \u2194 Vertical)
    </button>
    <div class="sub">
      <a data-bind="rowtate.toggleBlocksLayout">Bind key\u2026</a>
      <span class="dot">\u2022</span>
      <a data-copy="rowtate.toggleBlocksLayout">Copy command id</a>
    </div>
  </div>

<div class="cmd">
    <button class="btn" data-cmd="rowtate.toggle">Toggle File Layout</button>
    <div class="sub">
      <a data-bind="rowtate.toggle">Bind key\u2026</a>
      <span class="dot">\u2022</span>
      <a data-copy="rowtate.toggle">Copy command id</a>
    </div>
  </div>

  <div class="cmd">
    <button class="btn" data-cmd="rowtate.toggleColours">Toggle Colours</button>
    <div class="sub">
      <a data-bind="rowtate.toggleColours">Bind key\u2026</a>
      <span class="dot">\u2022</span>
      <a data-copy="rowtate.toggleColours">Copy command id</a>
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
</html>`}var H=class{constructor(n){this.extensionUri=n}resolveWebviewView(n){let t=n.webview;t.options={enableScripts:!0,localResourceRoots:[C.Uri.joinPath(this.extensionUri,"media")]};let s=t.asWebviewUri(C.Uri.joinPath(this.extensionUri,"media","rowtate-anim.gif"));t.html=ee(t,{logoUri:String(s)}),t.onDidReceiveMessage(async o=>{if(!(!o||typeof o.type!="string")){if(o.type==="cmd"&&typeof o.command=="string"){let i=typeof o.requestId=="string"?o.requestId:"";try{await C.commands.executeCommand(o.command),t.postMessage({type:"done",requestId:i,ok:!0})}catch(r){t.postMessage({type:"done",requestId:i,ok:!1,error:String(r)}),C.window.showErrorMessage(`Rowtate: Failed to run ${o.command}: ${String(r)}`)}return}if(o.type==="bind"&&typeof o.command=="string"){await C.commands.executeCommand("workbench.action.openGlobalKeybindings"),C.window.showInformationMessage(`Keyboard Shortcuts opened. Search for: ${o.command} (or "Rowtate") to assign a keybinding.`);return}o.type==="copied"&&typeof o.command=="string"&&C.window.showInformationMessage(`Copied: ${o.command}`)}})}};var b=S(require("vscode"));var te=S(require("vscode"));function M(){let e=te.workspace.getConfiguration("rowtate");return{comment:e.get("colors.comment","#87c66b"),key:e.get("colors.key","#cd6060ff"),value:e.get("colors.value","#6aa2f7ff"),target:e.get("colors.target","user")}}function R(e){let n=[],t=0;for(;t<e.length;){let s=t,o=e[t].trim()==="",i=[];for(;t<e.length&&e[t].trim()===""===o;)i.push(e[t]),t++;let r=t-1;n.push({kind:o?"blank":"block",lines:i,startLine:s,endLine:r})}return n}function Q(e){let n=[],t=[];for(let s of e)s.trim()===""?t.length>0&&(n.push(t),t=[]):t.push(s);return t.length>0&&n.push(t),n}function T(e){let n=e.map(r=>r.trim()).filter(r=>r.length>0&&!r.startsWith("//"));if(n.length<2)return!1;let t=n[0],s=n[1];if(!t.startsWith("#")||!t.includes(","))return!1;let o=(t.match(/,/g)||[]).length,i=(s.match(/,/g)||[]).length;return o>=1&&i>=1}function q(e){for(let n of e){let t=n.trim();if(!(!t||t.startsWith("//"))&&t.startsWith("#")&&(!t.includes(",")||/^#\S+\s+/.test(t)))return!0}return!1}function oe(e){let n=R(e),t=0,s=0;for(let o of n)o.kind==="block"&&(T(o.lines)?t++:(q(o.lines),s++));return t>0&&s>0?"mixed":t>0?"horizontal":"vertical"}var d={coloringEnabled:!1,commentDeco:void 0,keyDeco:void 0,valueDeco:void 0,statusItem:void 0};function W(e){d.commentDeco?.dispose(),d.keyDeco?.dispose(),d.valueDeco?.dispose();let n=M();d.commentDeco=b.window.createTextEditorDecorationType({color:n.comment}),d.keyDeco=b.window.createTextEditorDecorationType({color:n.key}),d.valueDeco=b.window.createTextEditorDecorationType({color:n.value}),e.subscriptions.push(d.commentDeco,d.keyDeco,d.valueDeco)}function h(){let e=b.window.activeTextEditor;if(!e)return;let s=e.document.getText().split(/\r?\n/),o=[],i=[],r=[];for(let a=0;a<s.length;a++){let l=s[a];l.trim().startsWith("//")&&o.push(new b.Range(new b.Position(a,0),new b.Position(a,l.length)))}let c=R(s);for(let a of c)a.kind==="block"&&(T(a.lines)?Te(a,i,r):Re(a,i,r));e.setDecorations(d.commentDeco,o),e.setDecorations(d.keyDeco,i),e.setDecorations(d.valueDeco,r)}function Re(e,n,t){for(let s=0;s<e.lines.length;s++){let o=e.startLine+s,i=e.lines[s],r=i.trim();if(!r.startsWith("#")||r.startsWith("//"))continue;let c=r.match(/^(\S+)(\s+)(.*)$/)||r.match(/^(\S+)$/);if(!c)continue;let a=c[1],l=c[2]??"",u=i.indexOf(a);if(u<0)continue;let p=u+a.length;if(n.push(new b.Range(o,u,o,p)),l){let g=p+l.length,f=i.length;g<=f&&t.push(new b.Range(o,g,o,f))}}}function Te(e,n,t){let s=e.lines.map(a=>a.trim()),o=-1;for(let a=0;a<s.length;a++)if(!(s[a]===""||s[a].startsWith("//"))){o=a;break}if(o<0)return;let i=-1;for(let a=o+1;a<s.length;a++)if(!(s[a]===""||s[a].startsWith("//"))){i=a;break}if(i<0)return;let r=e.startLine+o,c=e.startLine+i;n.push(new b.Range(r,0,r,e.lines[o].length)),t.push(new b.Range(c,0,c,e.lines[i].length))}var P=S(require("vscode"));var L=S(require("vscode"));function A(e){let n=[],t="",s=!1;for(let o=0;o<e.length;o++){let i=e[o];if(i===","&&!s){n.push(ne(t)),t="";continue}if(i==='"'){let r=e[o+1];if(s&&r==='"'){t+='""',o++;continue}s=!s,t+='"';continue}if(i==="\\"&&s){let r=e[o+1];if(r==='"'||r==="\\"){t+="\\"+r,o++;continue}}t+=i}return n.push(ne(t)),n}function ne(e){return e.trim()}function Y(e){if(e==="")return"";let n=e.trim();return n.length>=2&&n.startsWith('"')&&n.endsWith('"')?n:/[",\r\n]/.test(e)||e!==e.trim()?`"${e.replace(/"/g,'""')}"`:e}function se(e){let n=Q(e),t=[];for(let s of n){let o=[],i=0;for(;i<s.length&&!s[i].trim().startsWith("#");)o.push(s[i]),i++;if(i>=s.length){t.push(s.join(`
`));continue}let r=s[i],c=s[i+1];if(c===void 0){t.push(s.join(`
`));continue}let a=A(r),l=A(c),u=Math.max(a.length,l.length),p="	",g=[];for(let y=0;y<u;y++)g.push(`${a[y]??""}${p}${l[y]??""}`);let f=[...o,...g].join(`
`);t.push(f)}return t.join(`

`)+`
`}function ie(e){let n=Q(e),t=[];for(let s of n){let o=[],i=[],r=[],c=null,a=()=>{c!==null&&(i.push(c),r.push(""),c=null)};for(let p=0;p<s.length;p++){let g=s[p],f=g.trim();if(f){if(f.startsWith("//")){o.push(g);continue}if(c!==null)if(f.startsWith("#"))i.push(c),r.push(""),c=null;else{i.push(c),r.push(f),c=null;continue}if(f.startsWith("#")){let y=f.match(/^(\S+)\s+(.+)$/);if(y){i.push(y[1].trim()),r.push(y[2].trim());continue}c=f;continue}o.push(g)}}if(a(),i.length===0){t.push(s.join(`
`));continue}let l=`${i.join(",")}
${r.map(Y).join(",")}`,u=o.length>0?`${o.join(`
`)}
${l}`:l;t.push(u)}return t.join(`

`)+`
`}function j(e){let n=[],t=0;for(;t<e.length&&!e[t].trim().startsWith("#");)n.push(e[t]),t++;if(t>=e.length)return e;let s=e[t],o=e[t+1];if(o===void 0)return e;let i=A(s),r=A(o),c=Math.max(i.length,r.length),a="	",l=[];for(let u=0;u<c;u++)l.push(`${i[u]??""}${a}${r[u]??""}`);return[...n,...l]}function re(e){let n=[],t=[],s=[],o=null,i=()=>{o!==null&&(t.push(o),s.push(""),o=null)};for(let l=0;l<e.length;l++){let u=e[l],p=u.trim();if(p){if(p.startsWith("//")){n.push(u);continue}if(o!==null)if(p.startsWith("#"))t.push(o),s.push(""),o=null;else{t.push(o),s.push(p),o=null;continue}if(p.startsWith("#")){let g=p.match(/^(\S+)\s+(.+)$/);if(g){t.push(g[1].trim()),s.push(g[2].trim());continue}o=p;continue}n.push(u)}}if(i(),t.length===0)return e;let r=t.join(","),c=s.map(Y).join(","),a=[];return n.length>0&&a.push(...n),a.push(r),a.push(c),a}async function ae(){let e=L.window.activeTextEditor;if(!e){L.window.showErrorMessage("Rowtate: No active text editor.");return}let n=e.document,t=n.getText(),s=t.split(/\r?\n/);if(s.every(l=>l.trim().length===0)){L.window.showErrorMessage("Rowtate: Document is empty.");return}let o=oe(s),i;o==="mixed"&&(d.statusItem.text="$(sync) Rowtate: Mixed \u2192 Vertical",d.statusItem.show());let r;if(o==="horizontal")r=se(s);else if(o==="vertical")r=ie(s);else{let l=R(s),u=[];for(let p of l){if(p.kind==="blank"){u.push(...p.lines);continue}T(p.lines)?u.push(...j(p.lines)):u.push(...p.lines)}r=u.join(`
`).replace(/\s*$/,"")+`
`}let c=new L.Range(n.positionAt(0),n.positionAt(t.length)),a=new L.WorkspaceEdit;a.replace(n.uri,c,r),await L.workspace.applyEdit(a),d.coloringEnabled&&h(),o==="mixed"&&setTimeout(()=>d.statusItem.hide(),2500)}var U=S(require("vscode"));function ce(){d.coloringEnabled=!d.coloringEnabled,d.coloringEnabled?(h(),U.window.setStatusBarMessage("Rowtate coloring: ON",2e3)):(Le(),U.window.setStatusBarMessage("Rowtate coloring: OFF",2e3))}function Le(){let e=U.window.activeTextEditor;e&&(e.setDecorations(d.commentDeco,[]),e.setDecorations(d.keyDeco,[]),e.setDecorations(d.valueDeco,[]))}var m=S(require("vscode"));async function de(){let e=m.window.activeTextEditor;if(!e){m.window.showErrorMessage("Rowtate: No active text editor.");return}let n=e.document,t=n.getText(),s=t.split(/\r?\n/);if(s.every(x=>x.trim().length===0)){m.window.showErrorMessage("Rowtate: Document is empty.");return}let o=R(s),i=Be(e,o);if(i.size===0){m.window.showWarningMessage("Rowtate: No blocks selected.");return}let r=e.selection.active,c=De(o,r.line),a=!1,l=!1;for(let x of i){let v=o[x];!v||v.kind!=="block"||(T(v.lines)?a=!0:(q(v.lines),l=!0))}if(a&&l){m.window.showWarningMessage("Rowtate: Selected blocks are mixed (some horizontal, some vertical). Select blocks in the same layout and try again.");return}let u=a?"toVertical":"toHorizontal",p=[],g=null,f=null,y=[],E=x=>{for(let v=0;v<x.length;v++){let D=x[v].trim();if(D!==""&&!D.startsWith("//"))return v}return 0};for(let x=0;x<o.length;x++){let v=o[x],D=p.length;if(v.kind==="blank"){p.push(...v.lines);continue}let $=v.lines,G=!1;if(i.has(x)&&(u==="toVertical"?T(v.lines)&&($=j(v.lines),G=!0):q(v.lines)&&($=re(v.lines),G=!0)),p.push(...$),G){let X=D,Z=D+$.length-1;Z>=X&&y.push(new m.Range(X,0,Z,0))}x===c&&(g=D,f=D+E($))}let K=p.join(`
`).replace(/\s*$/,"")+`
`,V=new m.Range(n.positionAt(0),n.positionAt(t.length)),F=new m.WorkspaceEdit;F.replace(n.uri,V,K),await m.workspace.applyEdit(F);let O=e.document,ve=f??g??Math.min(r.line,O.lineCount-1),J=Math.max(0,Math.min(ve,O.lineCount-1)),he=O.lineAt(J).text.length,we=Math.max(0,Math.min(r.character,he)),N=new m.Position(J,we);e.selection=new m.Selection(N,N),e.revealRange(new m.Range(N,N),m.TextEditorRevealType.AtTop),d.coloringEnabled&&h(),Ie(e,y,260)}var le=m.window.createTextEditorDecorationType({isWholeLine:!0,backgroundColor:"rgba(122, 90, 18, 0.35)",borderRadius:"4px"});function Ie(e,n,t=300){n.length&&(e.setDecorations(le,n),setTimeout(()=>{try{e.setDecorations(le,[])}catch{}},t))}function De(e,n){let t=-1;for(let s=0;s<e.length;s++){let o=e[s];if(o.startLine<=n&&o.endLine>=n)return s;o.endLine<n&&(t=s)}return t>=0?t:0}function Be(e,n){let t=new Set,s=e.selections;for(let o of s){let i=o.start.line,r=o.end.line,c=Math.min(i,r),a=Math.max(i,r);if(o.isEmpty){let l=n.findIndex(u=>u.kind==="block"&&u.startLine<=c&&u.endLine>=c);l>=0&&t.add(l);continue}for(let l=0;l<n.length;l++){let u=n[l];if(u.kind!=="block")continue;!(u.endLine<c||u.startLine>a)&&t.add(l)}}return t}var k=S(require("vscode"));function ue(e,n){let t=B(),s=`
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
</html>`}async function pe(e){let n=M(),t=k.window.createWebviewPanel("rowtateColors","Rowtate: Pick Colors",k.ViewColumn.Active,{enableScripts:!0,retainContextWhenHidden:!1});t.webview.html=ue(t.webview,n),t.webview.onDidReceiveMessage(async s=>{if(!(!s||typeof s.type!="string")){if(s.type==="save"){let{comment:o,key:i,value:r}=s.colors??{};if(typeof o!="string"||typeof i!="string"||typeof r!="string")return;let c=k.workspace.getConfiguration("rowtate"),a=n.target==="workspace"?k.ConfigurationTarget.Workspace:k.ConfigurationTarget.Global;await c.update("colors.comment",o,a),await c.update("colors.key",i,a),await c.update("colors.value",r,a),W(e),d.coloringEnabled&&h(),t.dispose()}if(s.type==="cancel"&&t.dispose(),s.type==="reset"){let o=k.workspace.getConfiguration("rowtate"),i=n.target==="workspace"?k.ConfigurationTarget.Workspace:k.ConfigurationTarget.Global;await o.update("colors.comment",void 0,i),await o.update("colors.key",void 0,i),await o.update("colors.value",void 0,i),W(e),d.coloringEnabled&&h(),t.dispose()}}})}var w=S(require("vscode"));function me(e,n,t){let s=B(),o=JSON.stringify(n);return`
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
`}async function ge(){let e=w.window.activeTextEditor;if(!e){w.window.showErrorMessage("Rowtate: No active text editor.");return}let n=e.document,t=n.getText(),s=t.split(/\r?\n/);if(s.every(c=>c.trim().length===0)){w.window.showErrorMessage("Rowtate: Document is empty.");return}let o=Me(s);if(!o.includedSegIndexes.some(c=>o.segments[c]?.kind==="block")){w.window.showWarningMessage("Rowtate: No vertical blocks found to reorder (only horizontal blocks detected).");return}let i=w.window.createWebviewPanel("rowtateReorder","Rowtate: Reorder Vertical Rows (Mixed Mode OK)",w.ViewColumn.Beside,{enableScripts:!0,retainContextWhenHidden:!0}),r=M();i.webview.html=me(i.webview,o.flatLines,r),i.webview.onDidReceiveMessage(async c=>{if(!(!c||typeof c.type!="string")){if(c.type==="apply"){let a=c.lines;if(!Array.isArray(a))return;if(a.length!==o.flatLines.length){w.window.showErrorMessage("Rowtate: Reorder apply failed (line count mismatch).");return}let l=o.segments.map(E=>({...E})),u=0;for(let E=0;E<o.includedSegIndexes.length;E++){let K=o.includedSegIndexes[E],V=o.includedSegLengths[E],F=a.slice(u,u+V);u+=V,l[K].lines=F}let p=[];for(let E of l)p.push(...E.lines);let g=p.join(`
`).replace(/\s*$/,"")+`
`,f=new w.Range(n.positionAt(0),n.positionAt(t.length)),y=new w.WorkspaceEdit;y.replace(n.uri,f,g),await w.workspace.applyEdit(y),await n.save(),d.coloringEnabled&&h(),i.dispose()}c.type==="cancel"&&i.dispose()}})}function Me(e){let n=R(e),t=[],s=[],o=[],i=r=>r.kind==="block"&&!T(r.lines);for(let r=0;r<n.length;r++){let c=n[r];if(i(c)){t.push(r),s.push(c.lines.length),o.push(...c.lines);continue}if(c.kind==="blank"){let a=n[r-1],l=n[r+1],u=a?i(a):!1,p=l?i(l):!1;u&&p&&(t.push(r),s.push(c.lines.length),o.push(...c.lines))}}return{segments:n,includedSegIndexes:t,includedSegLengths:s,flatLines:o}}function fe(e){e.subscriptions.push(P.commands.registerCommand("rowtate.toggle",ae),P.commands.registerCommand("rowtate.toggleColours",ce),P.commands.registerCommand("rowtate.reorderVertical",ge),P.commands.registerCommand("rowtate.toggleBlocksLayout",()=>de()),P.commands.registerCommand("rowtate.pickColors",()=>pe(e)))}function We(e){console.log("Rowtate is now active!");let n=new H(e.extensionUri);e.subscriptions.push(I.window.registerWebviewViewProvider("rowtate.sidebar",n)),W(e),d.statusItem=I.window.createStatusBarItem(I.StatusBarAlignment.Left,1e3),d.statusItem.hide(),e.subscriptions.push(d.statusItem),fe(e),e.subscriptions.push(I.workspace.onDidChangeConfiguration(t=>{(t.affectsConfiguration("rowtate.colors.comment")||t.affectsConfiguration("rowtate.colors.key")||t.affectsConfiguration("rowtate.colors.value"))&&(W(e),d.coloringEnabled&&h())})),e.subscriptions.push(I.window.onDidChangeActiveTextEditor(()=>{d.coloringEnabled&&h()}),I.workspace.onDidChangeTextDocument(()=>{d.coloringEnabled&&h()}))}function Pe(){}0&&(module.exports={activate,deactivate});
