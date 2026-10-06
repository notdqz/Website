import { store } from './store.js';
const valid = ['home','games','ai','proxy','phone','spoof','utilities','settings'];
export function getPage() { return valid.includes(location.hash.slice(1)) ? location.hash.slice(1) : store.get().page || 'home'; }
export function go(page) { if (!valid.includes(page)) page='home'; store.set({ page, recent:[page, ...(store.get().recent || []).filter(x => x !== page)].slice(0,6) }); location.hash = page; }
export function startRouter(render) { if (!location.hash) location.hash = '#home'; const onChange = () => render(getPage()); window.addEventListener('hashchange', onChange); onChange(); return () => window.removeEventListener('hashchange', onChange); }
