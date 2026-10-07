const KEY = 'nexus-webos:v3';
const defaults = {
  page: 'home',
  theme: 'Obsidian',
  background: 'network',
  quality: 'High',
  resolutionScale: 1,
  aspectRatio: 'native',
  stretchToViewport: true,
  blur: 24,
  glow: 1,
  particleDensity: .7,
  backgroundSpeed: 1,
  interactionStrength: 1,
  mouseEffects: true,
  clickEffects: true,
  trails: true,
  parallax: true,
  reducedMotion: false,
  highContrast: false,
  uiScale: 1,
  uiSounds: false,
  startupPage: 'home',
  keybinds: { fps:'F7', cps:'F8', keystrokes:'F9', particles:'F10', trails:'F11', background:'KeyB', console:'F3' },
  autoclicker: { enabled:false, cps:10, mode:'hold' },
  hud: {
    fps: { enabled: true, x: 20, y: 96, opacity: 1, scale: 1, style:'compact' },
    cps: { enabled: true, x: 20, y: 160, opacity: 1, scale: 1, style:'compact' },
    keys: { enabled: true, x: 20, y: 235, opacity: 1, scale: 1, mode: 'auto' },
    utilities: { enabled: false, x: 20, y: 360, opacity: 1, scale: 1, compact:false }
  },
  utilities: {
    fps: true, cps: true, keystrokes: true, particles: true, trails: true,
    mouseEffects: true, clickEffects: true, activeUtilities: false
  },
  spoof: { title: 'NEXUS // Personal Web OS', faviconData: '' },
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

let state = deepMerge(defaults, (() => {
  try {
    const current = localStorage.getItem(KEY);
    if (current) return JSON.parse(current);
    const legacy = JSON.parse(localStorage.getItem('nexus-webos:v1') || '{}');
    const backgroundMap = { neural:'network', particles:'constellation', grid:'grid', liquid:'aurora', aurora:'aurora', geometric:'geometric', rain:'constellation', galaxy:'constellation', noise:'minimal' };
    if (legacy.background) legacy.background = backgroundMap[legacy.background] || 'network';
    if (legacy.hud?.keys && !legacy.hud.keys.mode) legacy.hud.keys.mode = 'auto';
    if (legacy.utilities) legacy.utilities = {...defaults.utilities, ...legacy.utilities};
    return legacy;
  } catch { return {}; }
})());
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
