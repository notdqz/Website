import {store} from '../core/store.js';
const defs=[
 {id:'fps',name:'FPS Display',category:'HUD',key:'F7',hud:'fps'},
 {id:'cps',name:'CPS Display',category:'HUD',key:'F8',hud:'cps'},
 {id:'keystrokes',name:'Keystrokes',category:'HUD',key:'F9',hud:'keys'},
 {id:'activeUtilities',name:'Active Utilities HUD',category:'HUD',key:'',hud:'utilities'},
 {id:'particles',name:'Background Particles',category:'Visual',key:'F10'},
 {id:'trails',name:'Cursor Trail',category:'Visual',key:'F11'},
 {id:'mouseEffects',name:'Mouse Effects',category:'Effects',key:''},
 {id:'clickEffects',name:'Click Effects',category:'Effects',key:''},
 {id:'autoclicker',name:'Local Autoclicker',category:'Utility',key:'',}
];
export const utilityRegistry=defs.map(x=>({...x}));
export function getUtilities(){return utilityRegistry.map(d=>({...d,enabled:isEnabled(d)}))}
export function isEnabled(def){
 const st=store.get();
 if(def.hud)return !!st.hud[def.hud]?.enabled;
 if(def.id==='particles')return st.utilities.particles!==false;
 if(def.id==='trails')return !!st.trails;
 if(def.id==='mouseEffects')return !!st.mouseEffects;
 if(def.id==='clickEffects')return !!st.clickEffects;
 if(def.id==='autoclicker')return !!st.autoclicker.enabled;
 return false;
}
export function toggleUtility(id){
 const def=utilityRegistry.find(x=>x.id===id);if(!def)return;
 const next=!isEnabled(def),st=store.get();
 if(def.hud)store.set({hud:{[def.hud]:{...st.hud[def.hud],enabled:next}}});
 else if(['particles','trails','mouseEffects','clickEffects'].includes(id))store.set({[id==='particles'?'utilities':id]:id==='particles'?{...st.utilities,particles:next}:next});
 else if(id==='autoclicker')document.dispatchEvent(new CustomEvent('nexus:autoclicker',{detail:{action:next?'start':'stop'}}));
 return next;
}
export function updateKeybind(id,key){const bind={...(store.get().keybinds||{})};bind[id]=key;store.set({keybinds:bind})}
export function getKeybind(id){return store.get().keybinds?.[id] || utilityRegistry.find(x=>x.id===id)?.key || ''}
export function findByKey(key){const k=key.toLowerCase();return utilityRegistry.find(d=>getKeybind(d.id).toLowerCase()===k)}
