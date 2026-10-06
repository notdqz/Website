const KEY = 'nexus-webos:v1';
const defaults = {
  page: 'home',
  theme: 'Obsidian',
  background: 'neural',
  quality: 'High',
  resolutionScale: 1,
  blur: 24,
  glow: 1,
  particleDensity: .65,
  mouseEffects: true,
  clickEffects: true,
  trails: true,
  parallax: true,
  reducedMotion: false,
  highContrast: false,
  uiScale: 1,
  uiSounds: false,
  keybinds: { fps:'F7', cps:'F8', keystrokes:'F9', particles:'F10', trails:'F11', background:'KeyB', console:'F3' },
  autoclicker: { enabled:false, cps:10, mode:'hold' },
  hud: {
    fps: { enabled: true, x: 20, y: 95, opacity: 1, scale: 1 },
    cps: { enabled: true, x: 20, y: 160, opacity: 1, scale: 1 },
    keys: { enabled: true, x: 20, y: 235, opacity: 1, scale: 1, mode: 'auto' },
    utilities: { enabled: true, x: 20, y: 345, opacity: 1, scale: 1 }
  },
  utilities: {
    fps: true, cps: true, keystrokes: true, particles: true, trails: true
  },
  recent: ['home']
};

function deepMerge(base, patch) {
  const output = Array.isArray(base) ? [...base] : { ...base };
  for (const [k, v] of Object.entries(patch || {})) {
    if (v && typeof v === 'object' && !Array.isArray(v) && base?.[k] && typeof base[k] === 'object') output[k] = deepMerge(base[k], v);
    else output[k] = v;
  }
  return output;
}

let state = deepMerge(defaults, (() => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } })());
const listeners = new Set();

export const store = {
  get: () => state,
  set(patch) {
    state = deepMerge(state, patch);
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
    listeners.forEach(fn => fn(state));
  },
  subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
  reset() { state = structuredClone(defaults); try { localStorage.removeItem(KEY); } catch {} listeners.forEach(fn => fn(state)); }
};
