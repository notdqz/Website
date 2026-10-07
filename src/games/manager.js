const DB_NAME = 'nexus-webos-games';
const STORE = 'games';

function openDb(){
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open(DB_NAME,1);
    req.onupgradeneeded=()=>req.result.createObjectStore(STORE,{keyPath:'id'});
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error);
  });
}

export class GameManager {
  constructor(){this.games=[];this.activeId=null;this.iframe=null;this.listeners=new Set();}
  async init(){
    try{const db=await openDb();this.games=await new Promise((resolve,reject)=>{const r=db.transaction(STORE,'readonly').objectStore(STORE).getAll();r.onsuccess=()=>resolve(r.result||[]);r.onerror=()=>reject(r.error)});}catch{this.games=[]}
    return this.games;
  }
  subscribe(fn){this.listeners.add(fn);return()=>this.listeners.delete(fn)}
  notify(){this.listeners.forEach(fn=>fn(this.games))}
  async save(game){
    const db=await openDb();await new Promise((resolve,reject)=>{const r=db.transaction(STORE,'readwrite').objectStore(STORE).put(game);r.onsuccess=resolve;r.onerror=()=>reject(r.error)});this.games=await this.init();this.notify();return game;
  }
  async importHtml(file){
    const html=await file.text();
    const now=new Date().toISOString();
    const game={id:crypto.randomUUID(),name:file.name.replace(/\.html?$/i,''),fileName:file.name,html,size:file.size,createdAt:now,updatedAt:now,lastPlayed:null};
    await this.save(game);return game;
  }
  async remove(id){
    const db=await openDb();await new Promise((resolve,reject)=>{const r=db.transaction(STORE,'readwrite').objectStore(STORE).delete(id);r.onsuccess=resolve;r.onerror=()=>reject(r.error)});this.games=await this.init();this.notify();if(this.activeId===id){this.activeId=null;this.iframe=null;}}
  get(id){return this.games.find(g=>g.id===id)}
  mount(id,iframe){const game=this.get(id);if(!game)return null;this.activeId=id;this.iframe=iframe;const bridge=`<script>(()=>{const p=(level,args)=>parent.postMessage({source:'nexus-game-console',gameId:${JSON.stringify(id)},level,message:Array.from(args).map(v=>{try{return typeof v==='string'?v:JSON.stringify(v)}catch{return String(v)}}).join(' ')},'*');['log','info','warn','error'].forEach(k=>{const orig=console[k];console[k]=function(){p(k,arguments);orig.apply(console,arguments)}});window.addEventListener('error',e=>p('error',[e.message+' @ '+e.filename+':'+e.lineno]));window.addEventListener('unhandledrejection',e=>p('error',[e.reason]));parent.postMessage({source:'nexus-game-ready',gameId:${JSON.stringify(id)}},'*');})();<\\/script>`;
    iframe.srcdoc=game.html.replace(/<\/body>/i,bridge+'</body>');
    game.lastPlayed=new Date().toISOString();
    this.save(game).catch(()=>{});
    return game;
  }
  evaluate(expression){
    if(!this.iframe?.contentWindow) throw new Error('No active game context');
    if(this.iframe.contentWindow.location) return this.iframe.contentWindow.eval(expression);
    throw new Error('Game context unavailable');
  }
  getActive(){return this.activeId?this.get(this.activeId):null}
}

export const gameManager=new GameManager();
