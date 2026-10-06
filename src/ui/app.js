import { store } from '../core/store.js';
import { applyTheme } from '../core/theme.js';
import { startRouter, go, getPage } from '../core/router.js';
import { homePage } from '../pages/home.js';
import { settingsPage, bindSettings } from '../pages/settings.js';
import { simplePage, bindSimple } from '../pages/other.js';
import { gamesPage, bindGames } from '../pages/games.js';
import { utilitiesPage, bindUtilities } from '../pages/utilities.js';
import { aiPage, bindAI } from '../pages/ai.js';
import { gameManager } from '../games/manager.js';
import { icons } from './icons.js';

const labels=[['home','Home'],['games','Games'],['ai','AI'],['proxy','Proxy'],['phone','Phone'],['spoof','Spoof'],['utilities','Utilities'],['settings','Settings']];
export class AppUI {
 constructor(){this.app=document.querySelector('#app');this.toastStack=document.createElement('div');this.toastStack.className='toast-stack';document.body.appendChild(this.toastStack);this.clockTimer=null;this.consoleHistory=[];this.consoleIndex=-1;this.consolePage='home';this.hidePageOutput=false;this.maxConsole=false;this.installGameEvents()}
 toast(msg){const e=document.createElement('div');e.className='toast';e.textContent=msg;this.toastStack.appendChild(e);setTimeout(()=>e.remove(),2200)}
 render(page=getPage()){
  document.documentElement.style.setProperty('--ui-scale',store.get().uiScale);const online=navigator.onLine;
  this.app.innerHTML=`<div class="app-shell"><header class="topbar glass"><div class="brand"><div class="brand-mark"></div><div><div class="brand-name">NEXUS</div><div class="brand-sub">PERSONAL WEB OS</div></div></div><nav class="nav">${labels.map(([id,label])=>`<button class="nav-btn ${page===id?'active':''}" data-page="${id}">${label}</button>`).join('')}</nav><div class="top-actions"><div class="status-pill ${online?'':'offline'}"><span class="status-dot"></span><span class="status-text">${online?'CONNECTED':'OFFLINE'}</span></div><div class="clock-pill"><span class="clock-text clock-main" id="clock">--:--</span><span class="clock-date" id="date">---</span></div><button class="icon-btn" title="Console" id="console-btn">${icons.console}</button><button class="icon-btn" title="Settings" id="settings-btn">${icons.settings}</button></div></header><main class="app-main" id="main-content"></main></div><div class="hud-layer" id="hud-layer"></div><div class="modal-backdrop" id="console-modal"><section class="modal glass"><div class="modal-head"><div><h3>GAME CONSOLE</h3><div class="muted modal-sub">Same-origin/local execution context.</div></div><div class="modal-actions"><button class="icon-btn" id="console-hide-output" title="Toggle page output">≋</button><button class="icon-btn" id="console-min" title="Minimize">−</button><button class="icon-btn" id="console-max" title="Maximize">□</button><button class="icon-btn" id="console-close" title="Close">×</button></div></div><div class="modal-body"><div class="console"><div class="console-log" id="console-log"></div><div class="console-input"><input id="console-input" autocomplete="off" placeholder="type a command… (try help)"/><button id="console-send">EXEC</button></div></div></div></section></div>`;
  const main=this.app.querySelector('#main-content');
  if(page==='home')main.innerHTML=homePage();
  else if(page==='games')main.innerHTML=gamesPage();
  else if(page==='ai')main.innerHTML=aiPage();
  else if(page==='utilities')main.innerHTML=utilitiesPage();
  else if(page==='settings')main.innerHTML=settingsPage();
  else main.innerHTML=simplePage(page);
  this.bindNav();this.updateClock();if(!this.clockTimer)this.clockTimer=setInterval(()=>this.updateClock(),1000);
  this.app.querySelector('#settings-btn')?.addEventListener('click',()=>go('settings'));
  this.app.querySelector('#console-btn')?.addEventListener('click',()=>this.openConsole(page));
  this.bindConsole();
  if(page==='settings')bindSettings({rerender:()=>this.render(getPage()),toast:m=>this.toast(m)});
  if(page==='games')bindGames({openConsole:()=>this.openConsole('games'),toast:m=>this.toast(m)});
  if(page==='ai')bindAI();
  if(page==='utilities')bindUtilities({toast:m=>this.toast(m)});
  bindSimple(page,{toast:m=>this.toast(m)});
  document.dispatchEvent(new CustomEvent('nexus:app-render'));
 }
 bindNav(){this.app.querySelectorAll('[data-page]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.page)))}
 updateClock(){const now=new Date();const c=document.querySelector('#clock'),d=document.querySelector('#date');if(!c)return;c.textContent=now.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'});if(d)d.textContent=now.toLocaleDateString([], {month:'short',day:'2-digit'}).toUpperCase()}
 openConsole(page){const modal=document.querySelector('#console-modal');if(!modal)return;this.consolePage=page;modal.classList.add('open');modal.classList.remove('minimized');const log=document.querySelector('#console-log');if(log && !log.childElementCount){if(page!=='games')this.log('Console is available for games only. Open a game first.','warn');else if(gameManager.getActive())this.log(`Attached: ${gameManager.getActive().name}`,'info');else this.log('No game is mounted. Launch a local game first.','warn')}document.querySelector('#console-input')?.focus()}
 bindConsole(){
  document.querySelector('#console-close')?.addEventListener('click',()=>document.querySelector('#console-modal')?.classList.remove('open'));
  document.querySelector('#console-min')?.addEventListener('click',()=>document.querySelector('#console-modal')?.classList.toggle('minimized'));
  document.querySelector('#console-max')?.addEventListener('click',()=>{this.maxConsole=!this.maxConsole;document.querySelector('#console-modal .modal')?.classList.toggle('maximized',this.maxConsole)});
  document.querySelector('#console-hide-output')?.addEventListener('click',()=>{this.hidePageOutput=!this.hidePageOutput;this.log(`Game output ${this.hidePageOutput?'hidden':'visible'} for page/runtime output.`,'info')});
  const modal=document.querySelector('#console-modal .modal'),head=document.querySelector('#console-modal .modal-head');let drag=null;head?.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,left:modal.offsetLeft,top:modal.offsetTop};head.setPointerCapture?.(e.pointerId)});head?.addEventListener('pointermove',e=>{if(!drag||this.maxConsole)return;modal.style.left=(drag.left+e.clientX-drag.x)+'px';modal.style.top=(drag.top+e.clientY-drag.y)+'px';});head?.addEventListener('pointerup',()=>drag=null);
  const send=()=>{const input=document.querySelector('#console-input');const value=input?.value.trim();if(!value)return;this.consoleHistory.push(value);this.consoleIndex=this.consoleHistory.length;this.log('> '+value,'cmd');this.executeCommand(value);input.value='';input.focus()};
  document.querySelector('#console-send')?.addEventListener('click',send);document.querySelector('#console-input')?.addEventListener('keydown',e=>{if(e.key==='Enter')send();else if(e.key==='ArrowUp'){this.consoleIndex=Math.max(0,this.consoleIndex-1);e.target.value=this.consoleHistory[this.consoleIndex]||''}else if(e.key==='ArrowDown'){this.consoleIndex=Math.min(this.consoleHistory.length,this.consoleIndex+1);e.target.value=this.consoleHistory[this.consoleIndex]||''}})
 }
 executeCommand(value){
  const game=gameManager.getActive();
  if(value==='help'){this.log('Commands: help, clear, status, context, eval <expression>','info');return}
  if(value==='clear'){const l=document.querySelector('#console-log');if(l)l.innerHTML='';return}
  if(value==='status'){this.log(`shell=ready | page=${getPage()} | game=${game?game.name:'none'}`,'info');return}
  if(value==='context'){if(game)this.log(JSON.stringify({id:game.id,name:game.name},null,2),'info');else this.log('No active game context.','warn');return}
  if(value.startsWith('eval ')){if(!game){this.log('No active game context.','warn');return}try{const result=gameManager.evaluate(value.slice(5));this.log(typeof result==='undefined'?'undefined':String(result),'info')}catch(err){this.log(err.message||String(err),'error')}return}
  this.log(`Unknown command: ${value}`,'error')
 }
 log(text,type='info'){const log=document.querySelector('#console-log');if(!log)return;const el=document.createElement('div');el.className='line '+type;el.textContent=text;log.appendChild(el);log.scrollTop=log.scrollHeight}
 installGameEvents(){window.addEventListener('message',e=>{if(e.data?.source!=='nexus-game-console')return;const active=gameManager.getActive();if(active && e.data.gameId!==active.id)return;if(this.hidePageOutput && e.data.level!=='cmd')return;this.log(`[game:${e.data.level}] ${e.data.message}`,e.data.level==='error'?'error':e.data.level==='warn'?'warn':'info')})}
}
