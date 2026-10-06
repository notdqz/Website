import { store } from '../core/store.js';

export const inputState = { keys:new Set(), mouse:{x:innerWidth/2,y:innerHeight/2,left:false,right:false}, leftClicks:[], rightClicks:[] };
const keyListeners = new Set();

function trim(now, arr){ while(arr.length && now-arr[0] > 1000) arr.shift(); }
export function initInput(){
  addEventListener('pointermove',e=>{ inputState.mouse.x=e.clientX; inputState.mouse.y=e.clientY; document.documentElement.style.setProperty('--mx', `${e.clientX}px`); document.documentElement.style.setProperty('--my', `${e.clientY}px`); });
  addEventListener('pointerdown',e=>{ if(e.button===0){ inputState.mouse.left=true; inputState.leftClicks.push(performance.now()); if(store.get().clickEffects) document.dispatchEvent(new CustomEvent('nexus:click',{detail:{x:e.clientX,y:e.clientY,button:0}})); } if(e.button===2){ inputState.mouse.right=true; inputState.rightClicks.push(performance.now()); if(store.get().clickEffects) document.dispatchEvent(new CustomEvent('nexus:click',{detail:{x:e.clientX,y:e.clientY,button:2}})); }});
  addEventListener('pointerup',e=>{ if(e.button===0) inputState.mouse.left=false; if(e.button===2) inputState.mouse.right=false; });
  addEventListener('keydown',e=>{ inputState.keys.add(e.code); keyListeners.forEach(fn=>fn(e,true)); });
  addEventListener('keyup',e=>{ inputState.keys.delete(e.code); keyListeners.forEach(fn=>fn(e,false)); });
}
export function onKey(fn){ keyListeners.add(fn); return ()=>keyListeners.delete(fn); }
export function getCPS(){ const now=performance.now(); trim(now,inputState.leftClicks); trim(now,inputState.rightClicks); return {left:inputState.leftClicks.length,right:inputState.rightClicks.length,total:inputState.leftClicks.length+inputState.rightClicks.length}; }
