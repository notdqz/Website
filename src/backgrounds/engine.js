import { store } from '../core/store.js';
import { inputState } from '../effects/input.js';

export const backgroundMeta = {
  neural:['Neural Network','Nodes, connections, proximity response'],
  particles:['Particle Field','Ambient particles with cursor distortion'],
  grid:['Digital Grid','Perspective grid with responsive lighting'],
  liquid:['Liquid','Slow organic color fields'],
  aurora:['Aurora','Atmospheric ribbons and luminous haze'],
  geometric:['Geometric','Floating geometry with depth and parallax'],
  rain:['Digital Rain','Dense abstract character streams'],
  galaxy:['Galaxy','Layered stars and drifting dust'],
  noise:['Ambient Noise','Minimal animated texture and lighting']
};

export class BackgroundEngine {
  constructor(canvas){ this.canvas=canvas;this.ctx=canvas.getContext('2d');this.w=0;this.h=0;this.nodes=[];this.particles=[];this.stars=[];this.streams=[];this.running=false;this.last=0;addEventListener('resize',()=>this.resize());this.resize();this.seed(); }
  resize(){const dpr=Math.min(devicePixelRatio||1,2);this.w=innerWidth;this.h=innerHeight;this.canvas.width=this.w*dpr;this.canvas.height=this.h*dpr;this.canvas.style.width=this.w+'px';this.canvas.style.height=this.h+'px';this.ctx.setTransform(dpr,0,0,dpr,0,0);}
  seed(){const s=store.get(); const density=Math.max(.2,s.particleDensity);
    this.nodes=Array.from({length:Math.round(70*density)},()=>({x:Math.random(),y:Math.random(),vx:(Math.random()-.5)*.0009,vy:(Math.random()-.5)*.0009,r:.8+Math.random()*1.6,p:Math.random()}));
    this.particles=Array.from({length:Math.round(220*density)},()=>({x:Math.random(),y:Math.random(),vx:(Math.random()-.5)*.0004,vy:(Math.random()-.5)*.0004,z:Math.random()}));
    this.stars=Array.from({length:Math.round(320*density)},()=>({x:Math.random(),y:Math.random(),z:.1+Math.random(),s:.4+Math.random()*1.3,t:Math.random()*10}));
    this.streams=Array.from({length:Math.round(55*density)},()=>({x:Math.random(),y:Math.random(),l:10+Math.random()*26,s:.008+.015*Math.random()}));
  }
  setBackground(name){store.set({background:name});this.seed();}
  start(){if(this.running)return;this.running=true;const loop=t=>{if(!this.running)return;this.draw(t);requestAnimationFrame(loop)};requestAnimationFrame(loop)}
  stop(){this.running=false}
  clear(){this.ctx.clearRect(0,0,this.w,this.h)}
  draw(t){const c=this.ctx,w=this.w,h=this.h,st=store.get(),bg=st.background; c.clearRect(0,0,w,h); c.globalCompositeOperation='source-over';
    if(bg==='neural')this.neural(c,w,h,t); else if(bg==='particles')this.particleField(c,w,h,t); else if(bg==='grid')this.grid(c,w,h,t); else if(bg==='liquid')this.liquid(c,w,h,t); else if(bg==='aurora')this.aurora(c,w,h,t); else if(bg==='geometric')this.geometric(c,w,h,t); else if(bg==='rain')this.rain(c,w,h,t); else if(bg==='galaxy')this.galaxy(c,w,h,t); else this.noise(c,w,h,t);
  }
  mouseNorm(){return {x:inputState.mouse.x/innerWidth,y:inputState.mouse.y/innerHeight}}
  neural(c,w,h,t){const m=this.mouseNorm(); c.lineWidth=1; for(const n of this.nodes){n.x+=n.vx;n.y+=n.vy;if(n.x<0||n.x>1)n.vx*=-1;if(n.y<0||n.y>1)n.vy*=-1;const dx=m.x-n.x,dy=m.y-n.y,d=Math.hypot(dx,dy);if(d<.16){n.x-=dx*.0008;n.y-=dy*.0008} } for(let i=0;i<this.nodes.length;i++){const a=this.nodes[i]; for(let j=i+1;j<this.nodes.length;j++){const b=this.nodes[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);if(d<.14){const alpha=(1-d/.14)*.22;c.strokeStyle=`rgba(143,175,255,${alpha})`;c.beginPath();c.moveTo(a.x*w,a.y*h);c.lineTo(b.x*w,b.y*h);c.stroke()}} const md=Math.hypot(m.x-a.x,m.y-a.y);c.fillStyle=`rgba(181,201,255,${.16+Math.max(0,.16-md)*2.6})`;c.beginPath();c.arc(a.x*w,a.y*h,a.r+(md<.14?1.2:0),0,Math.PI*2);c.fill();}}
  particleField(c,w,h,t){const m=this.mouseNorm(); for(const p of this.particles){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>1)p.vx*=-1;if(p.y<0||p.y>1)p.vy*=-1;const dx=p.x-m.x,dy=p.y-m.y,d=Math.hypot(dx,dy);if(d<.16){p.x+=dx*.0008;p.y+=dy*.0008} const glow=Math.max(0,1-d*.8);c.fillStyle=`rgba(149,180,255,${.06+p.z*.08+glow*.12})`;c.beginPath();c.arc(p.x*w,p.y*h,.6+p.z*1.5,0,Math.PI*2);c.fill();}}
  grid(c,w,h,t){const m=this.mouseNorm(); c.save();c.translate(w/2,h*.52);const horizon=-h*.15; for(let i=-16;i<=16;i++){const x=i*50; c.strokeStyle=`rgba(122,152,220,${.06+(1-Math.abs(i)/17)*.03})`;c.beginPath();c.moveTo(x,0);c.lineTo(x*.15, h*.8);c.stroke()} for(let i=0;i<22;i++){const y=(i/22)**1.9*h*.95; c.strokeStyle=`rgba(125,153,214,${.04+i/600})`;c.beginPath();c.moveTo(-w,y);c.lineTo(w,y);c.stroke()} c.restore(); const grd=c.createRadialGradient(m.x*w,m.y*h,0,m.x*w,m.y*h,320);grd.addColorStop(0,'rgba(127,164,255,.12)');grd.addColorStop(1,'transparent');c.fillStyle=grd;c.fillRect(0,0,w,h)}
  liquid(c,w,h,t){const g=c.createRadialGradient(w*.25,h*.25,0,w*.25,h*.25,w*.55);g.addColorStop(0,'rgba(101,134,255,.11)');g.addColorStop(1,'transparent');c.fillStyle=g;c.fillRect(0,0,w,h);const g2=c.createRadialGradient(w*.8,h*.72,0,w*.8,h*.72,w*.5);g2.addColorStop(0,'rgba(176,102,255,.09)');g2.addColorStop(1,'transparent');c.fillStyle=g2;c.fillRect(0,0,w,h); c.globalCompositeOperation='screen';for(let i=0;i<5;i++){const x=w*(.1+i*.2)+Math.sin(t*.0002+i)*40,y=h*(.2+i*.13)+Math.cos(t*.00017+i*2)*32,r=150+i*34;const gg=c.createRadialGradient(x,y,0,x,y,r);gg.addColorStop(0,'rgba(104,163,255,.035)');gg.addColorStop(1,'transparent');c.fillStyle=gg;c.fillRect(x-r,y-r,r*2,r*2)}c.globalCompositeOperation='source-over'}
  aurora(c,w,h,t){for(let i=0;i<5;i++){c.save();c.globalCompositeOperation='screen';c.filter='blur(28px)';c.beginPath();c.moveTo(-100,h*.25+i*55);for(let x=-100;x<=w+100;x+=40){const y=h*.25+i*55+Math.sin(x*.006+t*.00035+i)*26+Math.sin(x*.014+t*.00021+i*3)*14;c.lineTo(x,y)}c.lineTo(w+100,h);c.lineTo(-100,h);c.closePath();c.fillStyle=i%2?'rgba(125,110,255,.025)':'rgba(94,227,201,.022)';c.fill();c.restore()}}
  geometric(c,w,h,t){const m=this.mouseNorm();for(let i=0;i<28;i++){const p=(i*0.618)%1,x=(.1+p*.85+Math.sin(t*.00015+i)*.03)*w,y=(.12+((i*37)%100)/115+Math.cos(t*.0002+i)*.025)*h,sz=10+((i*13)%28);const px=x+(m.x-.5)*sz*5,py=y+(m.y-.5)*sz*3;c.strokeStyle=`rgba(142,170,241,${.035+((i%5)/100)})`;c.beginPath();c.rect(px-sz/2,py-sz/2,sz,sz);c.stroke();if(i<27){const nx=x+Math.sin(i*2)*60,ny=y+Math.cos(i*1.7)*40;c.strokeStyle='rgba(142,170,241,.025)';c.beginPath();c.moveTo(px,py);c.lineTo(nx+(m.x-.5)*80,ny+(m.y-.5)*50);c.stroke()}}}
  rain(c,w,h,t){c.font='10px var(--mono)';for(const s of this.streams){s.y+=s.s;if(s.y>1.2)s.y=-.2;for(let i=0;i<s.l;i++){const y=s.y-i*.022;if(y<0||y>1)continue;const a=i===0?.2:Math.max(0,.14-i*.004);c.fillStyle=`rgba(120,190,255,${a})`;c.fillText(((i*17+Math.floor(t*.02)+Math.floor(s.x*100))%10),s.x*w,y*h)}}}
  galaxy(c,w,h,t){const m=this.mouseNorm();for(const s of this.stars){const depth=s.z*1.8;const x=s.x*w+(m.x-.5)*depth*18,y=s.y*h+(m.y-.5)*depth*10;const tw=.04+(Math.sin(t*.001+s.t)*.04)+(s.z*.05);c.fillStyle=`rgba(214,225,255,${tw})`;c.beginPath();c.arc(x,y,s.s*s.z,0,Math.PI*2);c.fill()}}
  noise(c,w,h,t){const m=this.mouseNorm();const g=c.createRadialGradient(m.x*w,m.y*h,0,m.x*w,m.y*h,520);g.addColorStop(0,'rgba(148,174,255,.085)');g.addColorStop(1,'transparent');c.fillStyle=g;c.fillRect(0,0,w,h)}
}
