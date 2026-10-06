import {store} from '../core/store.js';
import {getUtilities,toggleUtility,updateKeybind,getKeybind} from '../utilities/registry.js';

function esc(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\'':'&#39;','"':'&quot;'}[c]))}
export function utilitiesPage(){
 const st=store.get();
 return `<div class="page utilities-page"><div class="page-title"><div><h2>Utilities</h2><p>Central registry for HUDs, visual systems, and application-level controls.</p></div><span class="code-pill">${getUtilities().filter(x=>x.enabled).length} ACTIVE</span></div>
 <div class="utility-layout"><section class="glass section-card"><div class="section-top"><h3>Registry</h3><span class="muted">Keybind aware</span></div><div class="utility-table">${getUtilities().map(u=>`<div class="utility-item ${u.enabled?'enabled':''}"><div><div class="utility-name">${esc(u.name)}</div><div class="utility-meta">${u.category} · ${u.enabled?'RUNNING':'IDLE'}</div></div><div class="utility-actions"><span class="keybind"><input data-bind="${u.id}" value="${esc(getKeybind(u.id))}" aria-label="${esc(u.name)} keybind"></span><button class="switch ${u.enabled?'on':''}" data-util="${u.id}" aria-label="Toggle ${esc(u.name)}"></button></div></div>`).join('')}</div></section>
 <section class="glass section-card"><div class="section-top"><h3>Local Autoclicker</h3><span class="code-pill">PAGE ONLY</span></div><div class="notice" style="margin-top:12px">This utility can dispatch synthetic clicks inside this webpage only. It cannot generate trusted operating-system or external-browser clicks.</div><div class="control-grid"><div class="control"><label>CPS <span id="auto-cps-value">${st.autoclicker?.cps||10}</span></label><input id="auto-cps" type="range" min="1" max="30" value="${st.autoclicker?.cps||10}"></div><div class="control"><label>Mode <select id="auto-mode"><option value="hold" ${st.autoclicker?.mode==='hold'?'selected':''}>Hold</option><option value="toggle" ${st.autoclicker?.mode==='toggle'?'selected':''}>Toggle</option></select></label><small>Target: current pointer location when started.</small></div></div><div class="hero-actions"><button class="primary-btn" id="auto-start">START</button><button class="ghost-btn" id="auto-stop">STOP</button><span id="auto-status" class="code-pill">${st.autoclicker?.enabled?'RUNNING':'IDLE'}</span></div></section></div></div>`;
}
export function bindUtilities({toast}){
 const root=document.querySelector('.utilities-page');if(!root)return;
 root.querySelectorAll('[data-util]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.util;toggleUtility(id);renderUtilities();toast(`${id} updated`)}));
 root.querySelectorAll('[data-bind]').forEach(inp=>inp.addEventListener('change',e=>{updateKeybind(e.target.dataset.bind,e.target.value.trim());toast('Keybind saved')}));
 root.querySelector('#auto-cps')?.addEventListener('input',e=>{store.set({autoclicker:{...(store.get().autoclicker||{}),cps:+e.target.value}});root.querySelector('#auto-cps-value').textContent=e.target.value});
 root.querySelector('#auto-mode')?.addEventListener('change',e=>store.set({autoclicker:{...(store.get().autoclicker||{}),mode:e.target.value}}));
 root.querySelector('#auto-start')?.addEventListener('click',()=>{document.dispatchEvent(new CustomEvent('nexus:autoclicker',{detail:{action:'start'}}));toast('Local autoclicker started')});
 root.querySelector('#auto-stop')?.addEventListener('click',()=>{document.dispatchEvent(new CustomEvent('nexus:autoclicker',{detail:{action:'stop'}}));toast('Local autoclicker stopped')});
}
function renderUtilities(){const page=location.hash.slice(1);if(page==='utilities'){const html=utilitiesPage();document.querySelector('#main-content').innerHTML=html;bindUtilities({toast:m=>m});}}
