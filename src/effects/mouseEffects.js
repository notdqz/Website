import { store } from '../core/store.js';
import { inputState } from './input.js';

export class MouseEffects {
  constructor(canvas){ this.canvas=canvas; this.ctx=canvas.getContext('2d'); this.trail=[]; this.bursts=[]; this.running=false; this.resize=()=>this.sync(); this.onClick=e=>this.burst(e.detail); addEventListener('resize',this.resize); document.addEventListener('nexus:click',this.onClick); this.sync(); }
  sync(){ const dpr=Math.min(devicePixelRatio || 1,2); this.w=innerWidth;this.h=innerHeight;this.canvas.width=this.w*dpr;this.canvas.height=this.h*dpr;this.canvas.style.width=this.w+'px';this.canvas.style.height=this.h+'px';this.ctx.setTransform(dpr,0,0,dpr,0,0); }
  burst({x,y}){ if(!store.get().clickEffects) return; const count=store.get().quality==='Ultra'?28:16; for(let i=0;i<count;i++){ const a=Math.random()*Math.PI*2, s=25+Math.random()*80; this.bursts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:.5+Math.random()*.35}); } }
  start(){ if(this.running)return; this.running=true; const loop=(t)=>{if(!this.running)return; this.frame(t); requestAnimationFrame(loop)}; requestAnimationFrame(loop); }
  stop(){this.running=false}
  frame(dt){ const ctx=this.ctx; ctx.clearRect(0,0,this.w,this.h); const st=store.get(); if(!st.mouseEffects && !st.clickEffects && !st.trails)return; const x=inputState.mouse.x,y=inputState.mouse.y;
    if(st.trails){ this.trail.push({x,y,a:1}); if(this.trail.length>Math.min(24,Math.round(10+st.particleDensity*30)))this.trail.shift(); for(let i=0;i<this.trail.length;i++){const p=this.trail[i], f=i/this.trail.length;ctx.fillStyle=`rgba(142,176,255,${f*.15})`;ctx.beginPath();ctx.arc(p.x,p.y,1.2+f*2.2,0,Math.PI*2);ctx.fill();}}
    for(const b of this.bursts){ b.x+=b.vx*.016;b.y+=b.vy*.016;b.vx*=.95;b.vy*=.95;b.life-=.018;ctx.fillStyle=`rgba(160,190,255,${Math.max(0,b.life)*.7})`;ctx.fillRect(b.x,b.y,1.5,1.5); } this.bursts=this.bursts.filter(b=>b.life>0);
  }
}
