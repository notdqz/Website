import { store } from './store.js';

export const themes = {
  Obsidian: { accent:'#86a8ff', accent2:'#b694ff', bg0:'#04060a', bg1:'#070b11', bg2:'#0d1420' },
  Cyber: { accent:'#65e7ff', accent2:'#c57dff', bg0:'#03070b', bg1:'#061018', bg2:'#101022' },
  Inferno: { accent:'#ff8a5b', accent2:'#ff4f7b', bg0:'#080403', bg1:'#110806', bg2:'#1b0c08' },
  Plasma: { accent:'#d78cff', accent2:'#ff7bdc', bg0:'#07030a', bg1:'#0c0713', bg2:'#170b1d' },
  Ocean: { accent:'#6bdcff', accent2:'#77a3ff', bg0:'#02070a', bg1:'#031017', bg2:'#071721' },
  Toxic: { accent:'#8dff8f', accent2:'#b8ff58', bg0:'#040804', bg1:'#071108', bg2:'#0d180b' },
  Aurora: { accent:'#7cf4d2', accent2:'#8e98ff', bg0:'#030708', bg1:'#061014', bg2:'#0e1120' },
  Monochrome: { accent:'#e8edf7', accent2:'#9da7b6', bg0:'#040404', bg1:'#080808', bg2:'#121212' }
};

export function applyTheme(name = store.get().theme) {
  const t = themes[name] || themes.Obsidian;
  const root = document.documentElement;
  root.style.setProperty('--accent', t.accent);
  root.style.setProperty('--accent-2', t.accent2);
  root.style.setProperty('--bg-0', t.bg0);
  root.style.setProperty('--bg-1', t.bg1);
  root.style.setProperty('--bg-2', t.bg2);
  root.style.setProperty('--blur', `${store.get().blur}px`);
  root.style.setProperty('--ui-scale', store.get().uiScale);
  document.body.dataset.stretch = store.get().stretchToViewport ? 'true' : 'false';
  document.body.dataset.aspect = store.get().aspectRatio || 'native';
  root.style.setProperty('--glow-strength', store.get().glow);
  document.body.classList.toggle('reduce-motion', !!store.get().reducedMotion);
  document.body.classList.toggle('high-contrast', !!store.get().highContrast);
  document.body.classList.toggle('no-mouse-effects', !store.get().mouseEffects);
}
