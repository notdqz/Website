import { store } from '../core/store.js';
import { inputState, getCPS } from '../effects/input.js';

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export class HUDManager {
  constructor(root){this.root=root;this.fps=0;this.frameCount=0;this.last=performance.now();this.mode='WASD';this.activeDrag=null;}
  render(){
    const st=store.get();
    this.root.innerHTML=`<div class="hud-widget" data-id="fps"><div class="hud-head drag-handle"><span>FPS</span><span id="fps-sub">LIVE</span></div><div id="fps-value" class="hud-value">--</div></div>
    <div class="hud-widget" data-id="cps"><div class="hud-head drag-handle"><span>CPS</span><span>INPUT</span></div><div id="cps-value" class="hud-value">L 0&nbsp;&nbsp;R 0</div></div>
    <div class="hud-widget" data-id="keys"><div class="hud-head drag-handle"><span>KEYSTROKES</span><span id="keys-mode">AUTO</span></div><div id="key-grid" class="hud-keys"></div></div>
    <div class="hud-widget" data-id="utilities"><div class="hud-head drag-handle"><span>UTILITIES</span><span>ACTIVE</span></div><div id="utility-list" class="hud-utility"></div></div>`;
    for(const el of this.root.querySelectorAll('.hud-widget')){const id=el.dataset.id;const cfg=st.hud[id];el.style.left=cfg.x+'px';el.style.top=cfg.y+'px';el.style.opacity=cfg.opacity;el.style.transform=`scale(${cfg.scale})`;el.style.display=cfg.enabled?'block':'none';this.enableDrag(el,id)}
    this.paintKeys();this.paintUtilities();
  }
  enableDrag(el,id){let start=null;const down=e=>{if(!e.target.classList.contains('drag-handle') && !e.currentTarget.querySelector('.drag-handle')?.contains(e.target))return;start={x:e.clientX,y:e.clientY,ox:el.offsetLeft,oy:el.offsetTop};el.setPointerCapture?.(e.pointerId)};const move=e=>{if(!start)return;const x=clamp(start.ox+e.clientX-start.x,6,innerWidth-el.offsetWidth-6),y=clamp(start.oy+e.clientY-start.y,6,innerHeight-el.offsetHeight-6);el.style.left=x+'px';el.style.top=y+'px'};const up=()=>{if(!start)return;store.set({hud:{[id]:{...store.get().hud[id],x:parseFloat(el.style.left),y:parseFloat(el.style.top)}}});start=null};el.addEventListener('pointerdown',down);el.addEventListener('pointermove',move);el.addEventListener('pointerup',up);}
  tick(now){ if(now-this.last>=350){this.fps=Math.round((this.frameCount*1000)/(now-this.last));this.frameCount=0;this.last=now;const el=this.root.querySelector('#fps-value');if(el)el.textContent=`${this.fps} FPS`;const cps=getCPS();const c=this.root.querySelector('#cps-value');if(c)c.textContent=`L ${cps.left}  R ${cps.right}`;this.paintUtilities()} this.frameCount++; }
  paintKeys(){const root=this.root.querySelector('#key-grid');if(!root)return;const st=store.get();const arrow=st.hud.keys.mode==='arrows'||(st.hud.keys.mode==='auto' && ['ArrowUp','ArrowLeft','ArrowDown','ArrowRight'].filter(x=>inputState.keys.has(x)).length>0);const keys=arrow?['↖','↑','↗','←','↓','→']:['W','A','S','D','SPACE','LMB'];root.innerHTML='';for(const label of keys){const map={'W':'KeyW','A':'KeyA','S':'KeyS','D':'KeyD','SPACE':'Space','LMB':'MouseLeft','↑':'ArrowUp','←':'ArrowLeft','↓':'ArrowDown','→':'ArrowRight'};const el=document.createElement('div');el.className='hud-key';if(inputState.keys.has(map[label]))el.classList.add('pressed');el.textContent=label;root.appendChild(el)}const mode=this.root.querySelector('#keys-mode');if(mode)mode.textContent=arrow?'ARROWS':'WASD'}
  paintUtilities(){const root=this.root.querySelector('#utility-list');if(!root)return;const u=store.get().utilities;const rows=[];if(u.fps)rows.push(['FPS Display','[ON]']);if(u.cps)rows.push(['CPS Display','[ON]']);if(u.keystrokes)rows.push(['Keystrokes','[ON]']);if(u.particles)rows.push(['Particles',`[${store.get().background!=='noise'?'ON':'OFF'}]`]);if(u.trails&&store.get().trails)rows.push(['Cursor Trail','[ON]']);root.innerHTML=rows.map(([n,s])=>`<div class="utility-row"><span>${n}</span><span class="on">${s}</span></div>`).join('');}
  updateKeys(){this.paintKeys()}
}
