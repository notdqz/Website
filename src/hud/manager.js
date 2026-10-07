import { store } from '../core/store.js';
import { inputState, getCPS } from '../effects/input.js';
import { getUtilities } from '../utilities/registry.js';

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export class HUDManager {
  constructor(root){this.root=root;this.fps=0;this.frames=0;this.last=performance.now();this.lastKeys='';}
  render(){
    const st=store.get();
    const defs=[['fps','FPS'],['cps','CPS'],['keys','KEYSTROKES'],['utilities','ACTIVE UTILITIES']];
    this.root.innerHTML=defs.map(([id,label])=>`<div class="hud-widget" data-id="${id}"><div class="hud-head drag-handle"><span>${label}</span><span class="hud-live">${id==='utilities'?'ACTIVE':'LIVE'}</span></div><div class="hud-content" id="hud-${id}"></div></div>`).join('');
    for(const el of this.root.querySelectorAll('.hud-widget')){
      const id=el.dataset.id,cfg=st.hud[id];el.style.left=cfg.x+'px';el.style.top=cfg.y+'px';el.style.opacity=cfg.opacity;el.style.transform=`scale(${cfg.scale})`;el.style.display=cfg.enabled?'block':'none';this.enableDrag(el,id);
    }
    this.paint();
  }
  enableDrag(el,id){let start=null;const down=e=>{if(!e.target.closest('.drag-handle'))return;start={x:e.clientX,y:e.clientY,ox:el.offsetLeft,oy:el.offsetTop};el.setPointerCapture?.(e.pointerId)};const move=e=>{if(!start)return;const x=clamp(start.ox+e.clientX-start.x,4,Math.max(4,innerWidth-el.offsetWidth-4)),y=clamp(start.oy+e.clientY-start.y,4,Math.max(4,innerHeight-el.offsetHeight-4));el.style.left=x+'px';el.style.top=y+'px'};const up=()=>{if(!start)return;store.set({hud:{[id]:{...store.get().hud[id],x:parseFloat(el.style.left),y:parseFloat(el.style.top)}}});start=null};el.addEventListener('pointerdown',down);el.addEventListener('pointermove',move);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);}
  tick(now){this.frames++;if(now-this.last>=250){this.fps=Math.round(this.frames*1000/(now-this.last));this.frames=0;this.last=now;this.paint();}}
  paint(){
    const st=store.get(),fps=this.root.querySelector('#hud-fps'),cps=this.root.querySelector('#hud-cps'),keys=this.root.querySelector('#hud-keys'),utils=this.root.querySelector('#hud-utilities');
    if(fps)fps.innerHTML=`<div class="hud-number">${this.fps}<small> FPS</small></div>`;
    if(cps){const c=getCPS();cps.innerHTML=`<div class="hud-number">${c.left}<small> L</small> ${c.right}<small> R</small></div>`;}
    if(keys){const arrow=st.hud.keys.mode==='arrows'||(st.hud.keys.mode==='auto'&&([...inputState.keys].some(k=>k.startsWith('Arrow'))));const layout=arrow?['ArrowUp','ArrowLeft','ArrowDown','ArrowRight']:['KeyW','KeyA','KeyS','KeyD'];const labels=arrow?['↑','←','↓','→']:['W','A','S','D'];keys.innerHTML=`<div class="hud-key-grid">${layout.map((code,i)=>`<div class="hud-key ${inputState.keys.has(code)?'pressed':''}">${labels[i]}</div>`).join('')}</div><div class="hud-space ${inputState.keys.has('Space')?'pressed':''}">SPACE</div>`;}
    if(utils){const active=getUtilities().filter(x=>x.enabled&&['fps','cps','keystrokes','particles','trails','mouseEffects','clickEffects','autoclicker'].includes(x.id));utils.innerHTML=active.length?active.map(x=>`<div class="utility-row"><span>${x.name}</span><span class="on">ON</span></div>`).join(''):'<div class="hud-muted">No active utilities</div>';}
  }
}
