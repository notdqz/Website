import { store } from './core/store.js';
import { applyTheme } from './core/theme.js';
import { startRouter } from './core/router.js';
import { BackgroundEngine } from './backgrounds/engine.js';
import { MouseEffects } from './effects/mouseEffects.js';
import { initInput, onKey } from './effects/input.js';
import { HUDManager } from './hud/manager.js';
import { AppUI } from './ui/app.js';

const appUI = new AppUI();
const bg = new BackgroundEngine(document.querySelector('#bg-canvas'));
const fx = new MouseEffects(document.querySelector('#fx-canvas'));
const hud = new HUDManager(document.querySelector('#hud-layer'));

initInput();
applyTheme();
startRouter(page=>{ appUI.render(page); hud.render(); });
document.addEventListener('nexus:app-render',()=>hud.render());
bg.start();
fx.start();

onKey(()=>hud.updateKeys());
document.addEventListener('nexus:bg-change',()=>{bg.seed();});
addEventListener('online',()=>appUI.render(location.hash.slice(1)||'home'));
addEventListener('offline',()=>appUI.render(location.hash.slice(1)||'home'));

function frame(t){hud.tick(t);requestAnimationFrame(frame)}requestAnimationFrame(frame);
