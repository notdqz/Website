import { store } from '../core/store.js';
import { inputState } from '../effects/input.js';

export const backgroundMeta = {
  network:['Interactive Network','Living nodes, proximity links, depth and mouse influence'],
  constellation:['Particle Constellation','Atmospheric stars, depth layers and temporary connections'],
  grid:['Digital Grid','Animated perspective grid with cursor distortion'],
  geometric:['Geometric Network','Floating circles, triangles, hexagons and links'],
  aurora:['Liquid Aurora','Moving luminous fields and atmospheric ribbons'],
  minimal:['Minimal Ambient','Subtle noise-like lighting with almost no geometry']
};

export class BackgroundEngine {
  constructor(canvas){
    this.canvas=canvas; this.ctx=canvas.getContext('2d'); this.w=0; this.h=0;
    this.nodes=[]; this.particles=[]; this.shapes=[]; this.running=false; this.last=0;
    addEventListener('resize',()=>this.resize());
    document.addEventListener('nexus:bg-change',()=>this.seed());
    document.addEventListener('nexus:quality-change',()=>{this.seed();this.resize()});
    document.addEventListener('nexus:render-scale',()=>this.resize());
    this.resize(); this.seed();
  }
  resize(){
    const scale=store.get().resolutionScale||1;
    const dpr=Math.min(devicePixelRatio||1,2)*scale;
    this.w=innerWidth; this.h=innerHeight;
    this.canvas.width=Math.max(1,Math.floor(this.w*dpr)); this.canvas.height=Math.max(1,Math.floor(this.h*dpr));
    this.canvas.style.width=this.w+'px'; this.canvas.style.height=this.h+'px'; this.ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  seed(){
    const s=store.get(), density=Math.max(.1,(s.particleDensity||.7)*(s.utilities?.particles===false?.35:1));
    this.nodes=Array.from({length:Math.round(130*density)},()=>({x:Math.random(),y:Math.random(),vx:(Math.random()-.5)*.00075,vy:(Math.random()-.5)*.00075,r:.7+Math.random()*2,z:.25+Math.random()*.75,p:Math.random()}));
    this.particles=Array.from({length:Math.round(260*density)},()=>({x:Math.random(),y:Math.random(),vx:(Math.random()-.5)*.0005,vy:(Math.random()-.5)*.0005,z:.15+Math.random()*.85,t:Math.random()*20}));
    this.shapes=Array.from({length:Math.round(42*density)},(_,i)=>({x:Math.random(),y:Math.random(),vx:(Math.random()-.5)*.00025,vy:(Math.random()-.5)*.00025,size:10+Math.random()*34,type:i%3}));
  }
  setBackground(name){if(backgroundMeta[name]){store.set({background:name});this.seed();}}
  start(){if(this.running)return;this.running=true;const loop=t=>{if(!this.running)return;this.draw(t);requestAnimationFrame(loop)};requestAnimationFrame(loop)}
  stop(){this.running=false}
  mouse(){return {x:inputState.mouse.x/innerWidth,y:inputState.mouse.y/innerHeight}}
  draw(t){const c=this.ctx,w=this.w,h=this.h,st=store.get(),bg=st.background||'network';c.clearRect(0,0,w,h);c.globalCompositeOperation='source-over';
    const base=c.createLinearGradient(0,0,w,h);base.addColorStop(0,'rgba(3,5,10,.98)');base.addColorStop(.5,'rgba(7,10,18,.98)');base.addColorStop(1,'rgba(10,7,18,.98)');c.fillStyle=base;c.fillRect(0,0,w,h);
    if(bg==='network')this.network(c,w,h,t); else if(bg==='constellation')this.constellation(c,w,h,t); else if(bg==='grid')this.grid(c,w,h,t); else if(bg==='geometric')this.geometric(c,w,h,t); else if(bg==='aurora')this.aurora(c,w,h,t); else this.minimal(c,w,h,t);
  }
  network(c,w,h,t){
    const st=store.get(),m=this.mouse(), speed=st.reducedMotion?0:.7*st.backgroundSpeed, influence=.11*st.interactionStrength;
    for(const n of this.nodes){n.x+=n.vx*speed;n.y+=n.vy*speed;if(n.x<0||n.x>1)n.vx*=-1;if(n.y<0||n.y>1)n.vy*=-1;const dx=m.x-n.x,dy=m.y-n.y,d=Math.hypot(dx,dy);if(d<influence){const push=(1-d/influence)*.0009*st.interactionStrength;n.x-=dx*push;n.y-=dy*push;}}
    for(let i=0;i<this.nodes.length;i++){
      const a=this.nodes[i];
      for(let j=i+1;j<this.nodes.length;j++){const b=this.nodes[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);if(d<.105){const alpha=(1-d/.105)*(.22+.16*a.z);c.strokeStyle=`rgba(123,164,255,${alpha})`;c.lineWidth=.55+a.z*.45;c.beginPath();c.moveTo(a.x*w,a.y*h);c.lineTo(b.x*w,b.y*h);c.stroke();}}
      const md=Math.hypot(m.x-a.x,m.y-a.y), glow=Math.max(0,1-md/.15);
      c.fillStyle=`rgba(180,207,255,${.16+a.z*.18+glow*.35})`;c.beginPath();c.arc(a.x*w,a.y*h,a.r+a.z*1.2+glow*1.8,0,Math.PI*2);c.fill();
    }
    const g=c.createRadialGradient(m.x*w,m.y*h,0,m.x*w,m.y*h,220);g.addColorStop(0,'rgba(112,160,255,.14)');g.addColorStop(1,'transparent');c.fillStyle=g;c.fillRect(0,0,w,h);
  }
  constellation(c,w,h,t){
    const st=store.get(),m=this.mouse(), speed=st.reducedMotion?0:.5*st.backgroundSpeed;
    for(const p of this.particles){p.x+=p.vx*speed;p.y+=p.vy*speed;if(p.x<0||p.x>1)p.vx*=-1;if(p.y<0||p.y>1)p.vy*=-1;}
    for(let i=0;i<this.particles.length;i++){
      const a=this.particles[i],px=a.x*w+(m.x-.5)*a.z*22,py=a.y*h+(m.y-.5)*a.z*12;
      for(let j=i+1;j<Math.min(this.particles.length,i+12);j++){const b=this.particles[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<.07){c.strokeStyle=`rgba(130,165,235,${(1-d/.07)*.1*a.z})`;c.beginPath();c.moveTo(px,py);c.lineTo(b.x*w+(m.x-.5)*b.z*22,b.y*h+(m.y-.5)*b.z*12);c.stroke();}}
      const tw=.05+a.z*.1+(Math.sin(t*.001+a.t)*.025);c.fillStyle=`rgba(215,229,255,${tw})`;c.beginPath();c.arc(px,py,.5+a.z*1.5,0,Math.PI*2);c.fill();
    }
  }
  grid(c,w,h,t){
    const st=store.get(),m=this.mouse(),motion=st.reducedMotion?0:st.backgroundSpeed;
    c.save();c.translate(w/2,h*.48);const horizon=-h*.05, offset=(t*.018*motion)%44;
    for(let i=-20;i<=20;i++){const x=i*52+(m.x-.5)*28;c.strokeStyle=`rgba(116,153,230,${.035+(1-Math.abs(i)/21)*.035})`;c.beginPath();c.moveTo(x,horizon);c.lineTo(x*.13,h);c.stroke();}
    for(let i=0;i<34;i++){const p=((i*44+offset)%h);const y=horizon+Math.pow(p/h,1.7)*h*.95;c.strokeStyle=`rgba(126,157,222,${.025+i*.0015})`;c.beginPath();c.moveTo(-w,y);c.lineTo(w,y);c.stroke();}
    c.restore();const g=c.createRadialGradient(m.x*w,m.y*h,0,m.x*w,m.y*h,340);g.addColorStop(0,'rgba(112,158,255,.16)');g.addColorStop(1,'transparent');c.fillStyle=g;c.fillRect(0,0,w,h);
  }
  geometric(c,w,h,t){
    const st=store.get(),m=this.mouse(),speed=st.reducedMotion?0:.5*st.backgroundSpeed;
    for(const s of this.shapes){s.x+=s.vx*speed;s.y+=s.vy*speed;if(s.x<-.1||s.x>1.1)s.vx*=-1;if(s.y<-.1||s.y>1.1)s.vy*=-1;}
    for(let i=0;i<this.shapes.length;i++){const a=this.shapes[i],ax=a.x*w+(m.x-.5)*a.size*3,ay=a.y*h+(m.y-.5)*a.size*2;c.strokeStyle=`rgba(132,166,242,${.035+(i%5)*.012})`;c.lineWidth=.7;c.beginPath();if(a.type===0)c.arc(ax,ay,a.size,0,Math.PI*2);else if(a.type===1){for(let k=0;k<3;k++){const q=k*Math.PI*2/3-Math.PI/2;const x=ax+Math.cos(q)*a.size,y=ay+Math.sin(q)*a.size;k?c.lineTo(x,y):c.moveTo(x,y)}c.closePath()}else{for(let k=0;k<6;k++){const q=k*Math.PI/3;const x=ax+Math.cos(q)*a.size,y=ay+Math.sin(q)*a.size;k?c.lineTo(x,y):c.moveTo(x,y)}c.closePath()}c.stroke();if(i<this.shapes.length-1){const b=this.shapes[i+1];c.strokeStyle='rgba(130,165,235,.035)';c.beginPath();c.moveTo(ax,ay);c.lineTo(b.x*w,b.y*h);c.stroke();}}
  }
  aurora(c,w,h,t){
    const st=store.get(),motion=st.reducedMotion?0:st.backgroundSpeed;
    c.save();c.globalCompositeOperation='screen';
    for(let i=0;i<7;i++){const x=w*(.08+i*.15)+Math.sin(t*.00018*motion+i)*70,y=h*(.2+i*.1)+Math.cos(t*.00013*motion+i*2)*45,r=190+i*28;const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,i%2?'rgba(92,231,205,.065)':'rgba(135,117,255,.075)');g.addColorStop(.45,'rgba(70,130,255,.018)');g.addColorStop(1,'transparent');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}
    c.filter='blur(22px)';for(let i=0;i<4;i++){c.beginPath();c.moveTo(-80,h*.22+i*75);for(let x=-80;x<=w+80;x+=28){const y=h*.22+i*75+Math.sin(x*.006+t*.0003*motion+i)*30+Math.sin(x*.015+t*.00019*motion+i*2)*16;c.lineTo(x,y);}c.lineTo(w+80,h);c.lineTo(-80,h);c.closePath();c.fillStyle=i%2?'rgba(112,120,255,.035)':'rgba(64,220,190,.03)';c.fill();}c.restore();
  }
  minimal(c,w,h,t){const m=this.mouse(),g=c.createRadialGradient(m.x*w,m.y*h,0,m.x*w,m.y*h,520);g.addColorStop(0,'rgba(126,162,255,.11)');g.addColorStop(.4,'rgba(121,104,205,.035)');g.addColorStop(1,'transparent');c.fillStyle=g;c.fillRect(0,0,w,h);const g2=c.createRadialGradient(w*.75,h*.2,0,w*.75,h*.2,360);g2.addColorStop(0,'rgba(75,220,198,.035)');g2.addColorStop(1,'transparent');c.fillStyle=g2;c.fillRect(0,0,w,h);}
}
