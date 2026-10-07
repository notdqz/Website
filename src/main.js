import { store } from './core/store.js';
import { applyTheme } from './core/theme.js';
import { startRouter } from './core/router.js';
import { BackgroundEngine } from './backgrounds/engine.js';
import { MouseEffects } from './effects/mouseEffects.js';
import { initInput, onKey } from './effects/input.js';
import { HUDManager } from './hud/manager.js';
import { AppUI } from './ui/app.js';
import { findByKey, toggleUtility } from './utilities/registry.js';
import { gameManager } from './games/manager.js';

const appUI=new AppUI();
const bg=new BackgroundEngine(document.querySelector('#bg-canvas'));
const fx=new MouseEffects(document.querySelector('#fx-canvas'));
const hud=new HUDManager(document.querySelector('#hud-layer'));
initInput();applyTheme();
startRouter(page=>{appUI.render(page);hud.render()});
document.addEventListener('nexus:app-render',()=>hud.render());
document.addEventListener('nexus:bg-change',()=>bg.seed());
document.addEventListener('nexus:render-scale',()=>{bg.resize();fx.sync()});
document.addEventListener('nexus:quality-change',()=>{bg.seed();bg.resize();fx.sync();hud.render()});
document.addEventListener('nexus:hud-change',()=>hud.render());
document.addEventListener('nexus:aspect-change',()=>{document.body.dataset.aspect=store.get().aspectRatio});

bg.start();fx.start();
gameManager.init().then(()=>document.dispatchEvent(new CustomEvent('nexus:games-ready')));

onKey((e,down)=>{
 if(!down)return;
 if(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement)return;
 const def=findByKey(e.code)||findByKey(e.key);
 if(def){e.preventDefault();if(def.id==='console'){appUI.openConsole(location.hash.slice(1)||'home');return}toggleUtility(def.id);hud.render()}
});

let autoTimer=null;
function stopAuto(){if(autoTimer){clearInterval(autoTimer);autoTimer=null}if(store.get().autoclicker.enabled)store.set({autoclicker:{...store.get().autoclicker,enabled:false}})}
function startAuto(){stopAuto();const st=store.get(),cps=Math.max(1,Math.min(30,st.autoclicker.cps||10));store.set({autoclicker:{...st.autoclicker,enabled:true}});autoTimer=setInterval(()=>{const cfg=store.get().autoclicker;if(cfg.mode==='hold'&&!document.querySelector(':hover'))return;const x=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--mx'))||innerWidth/2,y=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--my'))||innerHeight/2,target=document.elementFromPoint(x,y);target?.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,clientX:x,clientY:y,view:window}))},1000/cps)}
document.addEventListener('nexus:autoclicker',e=>e.detail?.action==='start'?startAuto():stopAuto());
addEventListener('pagehide',stopAuto);
addEventListener('online',()=>appUI.render(location.hash.slice(1)||'home'));
addEventListener('offline',()=>appUI.render(location.hash.slice(1)||'home'));
function frame(t){hud.tick(t);requestAnimationFrame(frame)}requestAnimationFrame(frame);
