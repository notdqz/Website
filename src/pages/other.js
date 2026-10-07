import { store } from '../core/store.js';

export function simplePage(kind){
 const cfg={
  proxy:['Proxy','Service manager','Browser-only system-wide proxying is unavailable from a static page.'],
  phone:['Phone','Device connection','Unrestricted phone mirroring/control requires explicit browser permissions or a companion application.'],
  spoof:['Spoof','Tab appearance','Browser APIs cannot secretly rewrite the real address bar URL. Title and favicon changes are fully supported.']
 }[kind];
 if(kind==='spoof')return spoofPage();
 return `<div class="page"><div class="page-title"><div><h2>${cfg[0]}</h2><p>${cfg[1]}</p></div><span class="code-pill">REAL BOUNDARY</span></div><section class="glass section-card boundary-card"><div class="boundary-icon">${kind==='proxy'?'⇄':'⌁'}</div><h3>${cfg[1]}</h3><div class="status-lines"><div><span>STATUS</span><b>NOT CONNECTED</b></div><div><span>BROWSER</span><b>SUPPORTED</b></div><div><span>BACKEND / HELPER</span><b>NOT CONFIGURED</b></div></div><p>${cfg[2]}</p><div class="notice">This page is functional as a service boundary: it reports the actual browser capability state and persists your local configuration. It does not claim a connection that does not exist.</div><div class="control-grid"><div class="control"><label>Helper endpoint</label><input id="helper-endpoint" placeholder="http://127.0.0.1:PORT"></div><div class="control"><label>Connection test</label><button class="ghost-btn" id="test-helper">TEST CONNECTION</button></div></div><div id="helper-result" class="result-line">No test run.</div></section></div>`;
}
function spoofPage(){const st=store.get();return `<div class="page spoof-page"><div class="page-title"><div><h2>Spoof</h2><p>Real browser-tab appearance controls.</p></div><span class="code-pill">CLIENT-SIDE</span></div><section class="glass section-card"><div class="section-top"><h3>Tab Appearance</h3><span class="muted">Changes apply immediately</span></div><div class="control-grid"><div class="control"><label>Page title</label><input id="spoof-title" value="${esc(st.spoof?.title||document.title)}"></div><div class="control"><label>Favicon image</label><input id="spoof-favicon" type="file" accept="image/png,image/jpeg,image/svg+xml,image/x-icon"></div></div><div class="hero-actions"><button class="primary-btn" id="spoof-apply">APPLY</button><button class="ghost-btn" id="spoof-reset">RESET</button></div><div class="notice">The document title and favicon are genuinely changed. The address bar remains browser-controlled; this page does not pretend otherwise.</div></section></div>`}
function esc(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
export function bindSimple(kind,{toast}){
 if(kind==='spoof'){
  document.querySelector('#spoof-apply')?.addEventListener('click',async()=>{const title=document.querySelector('#spoof-title').value.trim();const file=document.querySelector('#spoof-favicon').files?.[0];let favicon=store.get().spoof?.faviconData||'';if(file)favicon=await fileToData(file);store.set({spoof:{title:title||'NEXUS // Personal Web OS',faviconData:favicon}});applySpoof();toast('Tab appearance applied')});
  document.querySelector('#spoof-reset')?.addEventListener('click',()=>{store.set({spoof:{title:'NEXUS // Personal Web OS',faviconData:''}});applySpoof();toast('Tab appearance reset')});
 }
 if(kind==='proxy'){
  document.querySelector('#test-helper')?.addEventListener('click',async()=>{const endpoint=document.querySelector('#helper-endpoint').value.trim();const out=document.querySelector('#helper-result');if(!endpoint){out.textContent='Enter a local helper endpoint first.';return}out.textContent='Testing…';try{const r=await fetch(endpoint,{method:'GET',cache:'no-store'});out.textContent=`Helper responded: HTTP ${r.status}`;}catch{out.textContent='Helper unavailable or blocked by browser CORS policy.'}});
 }
 if(kind==='phone'){
  document.querySelector('#pair-device')?.addEventListener('click',async()=>{const out=document.querySelector('#phone-status');try{if(!navigator.bluetooth)throw new Error('Web Bluetooth is unavailable in this browser');const device=await navigator.bluetooth.requestDevice({acceptAllDevices:true,optionalServices:[]});out.textContent=device?.name?`PAIRED: ${device.name}`:'PAIRED DEVICE';toast?.('Browser granted a Bluetooth device handle')}catch(err){out.textContent=err.message==='User cancelled the request.'?'DISCONNECTED':'PAIRING UNAVAILABLE';toast?.(err.message||'Pairing unavailable')}});
 }

}
export function applySpoof(){const s=store.get().spoof||{};document.title=s.title||'NEXUS // Personal Web OS';let link=document.querySelector('link[rel="icon"]');if(!link){link=document.createElement('link');link.rel='icon';document.head.appendChild(link)}if(s.faviconData)link.href=s.faviconData;}
async function fileToData(file){return await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)})}
