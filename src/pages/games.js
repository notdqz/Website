import { gameManager } from '../games/manager.js';

function card(game, active){
  return `<article class="game-card ${active?'active':''}" data-game-card="${game.id}">
    <div class="game-art"><span>HTML</span><b>${escapeHtml(game.name.slice(0,1).toUpperCase())}</b></div>
    <div class="game-card-body"><div class="game-card-title">${escapeHtml(game.name)}</div><div class="game-card-meta">${escapeHtml(game.fileName)} · ${formatBytes(game.size)}</div>
    <div class="game-card-actions"><button class="primary-btn game-launch" data-game="${game.id}">LAUNCH</button><button class="ghost-btn game-remove" data-game="${game.id}">REMOVE</button></div></div>
  </article>`
}
const escapeHtml=s=>String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\'':'&#39;','"':'&quot;'}[c]));
const formatBytes=n=>n<1024?n+' B':n<1048576?(n/1024).toFixed(1)+' KB':(n/1048576).toFixed(1)+' MB';

export function gamesPage(){
  const games=gameManager.games;
  const active=gameManager.getActive();
  return `<div class="page games-page"><div class="page-title"><div><h2>Games</h2><p>Local-first launcher. Imported HTML games stay in this browser profile.</p></div><div class="page-title-actions"><label class="primary-btn import-game">IMPORT HTML<input id="game-import" type="file" accept=".html,.htm,text/html" hidden></label><span class="code-pill">${games.length} LOCAL</span></div></div>
  <div class="games-layout"><section class="glass section-card game-library"><div class="section-top"><h3>Library</h3><span class="muted">IndexedDB</span></div><div class="game-grid">${games.length?games.map(g=>card(g,g.id===active?.id)).join(''):`<div class="empty game-empty"><div class="empty-icon">▦</div><strong>No local games yet</strong><span>Import a self-contained HTML game and it becomes launchable from this panel.</span></div>`}</div></section>
  <section class="glass section-card game-runtime"><div class="section-top"><h3>Runtime</h3><span class="code-pill">${active?'RUNNING':'IDLE'}</span></div><div class="game-runtime-frame"><iframe id="game-frame" title="NEXUS game runtime" ${active?'':'hidden'}></iframe><div id="game-runtime-empty" class="empty" ${active?'hidden':''}><div class="empty-icon">▶</div><strong>No game mounted</strong><span>Launch a local game to connect the developer console to its same-origin execution context.</span></div></div><div class="runtime-bar"><div><span class="muted">Context</span><b id="game-context-label">${active?escapeHtml(active.name):'Not mounted'}</b></div><div class="runtime-actions"><button class="ghost-btn" id="open-game-console" ${active?'':'disabled'}>OPEN CONSOLE</button><button class="ghost-btn" id="stop-game" ${active?'':'disabled'}>STOP</button></div></div></section></div>
  <section class="glass section-card"><div class="section-top"><h3>Game Boundary</h3><span class="muted">No fake browser privileges</span></div><div class="notice" style="margin-top:12px">Local and same-origin games can expose console output through a small injected bridge. Cross-origin frames remain isolated by browser security. Remote GitHub repository discovery can be added later without changing the local game format.</div></section></div>`;
}

export function bindGames({openConsole,toast}){
  const root=document.querySelector('.games-page');if(!root)return;
  root.querySelector('#game-import')?.addEventListener('change',async e=>{
    const file=e.target.files?.[0];if(!file)return;
    try{await gameManager.importHtml(file);toast(`Imported ${file.name}`);renderGamesOnly();}catch(err){toast(`Import failed: ${err.message||'unknown error'}`)}
  });
  root.querySelectorAll('.game-launch').forEach(b=>b.addEventListener('click',()=>launch(b.dataset.game)));
  root.querySelectorAll('.game-remove').forEach(b=>b.addEventListener('click',async()=>{await gameManager.remove(b.dataset.game);renderGamesOnly();toast('Game removed')}));
  root.querySelector('#open-game-console')?.addEventListener('click',()=>openConsole('games'));
  root.querySelector('#stop-game')?.addEventListener('click',()=>{gameManager.activeId=null;gameManager.iframe=null;renderGamesOnly();toast('Game stopped')});
  const frame=root.querySelector('#game-frame'); if(frame && gameManager.getActive()) gameManager.mount(gameManager.getActive().id,frame);

  function launch(id){const frame=document.querySelector('#game-frame');if(!frame)return;const game=gameManager.mount(id,frame);if(game){renderGamesOnly();toast(`Launching ${game.name}`)}}
  function renderGamesOnly(){const active=gameManager.getActive();const library=root.querySelector('.game-grid');if(library)library.innerHTML=gameManager.games.length?gameManager.games.map(g=>card(g,g.id===active?.id)).join(''):'';
    const frame=root.querySelector('#game-frame'),empty=root.querySelector('#game-runtime-empty'),label=root.querySelector('#game-context-label'),open=root.querySelector('#open-game-console'),stop=root.querySelector('#stop-game');
    if(active){frame.hidden=false;empty.hidden=true;label.textContent=active.name;open.disabled=false;stop.disabled=false;gameManager.mount(active.id,frame)}else{frame.hidden=true;empty.hidden=false;label.textContent='Not mounted';open.disabled=true;stop.disabled=true}
    root.querySelectorAll('.game-launch').forEach(b=>b.addEventListener('click',()=>launch(b.dataset.game)));
    root.querySelectorAll('.game-remove').forEach(b=>b.addEventListener('click',async()=>{await gameManager.remove(b.dataset.game);renderGamesOnly();toast('Game removed')}));
  }
}
