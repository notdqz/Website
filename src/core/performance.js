import { store } from './store.js';
const presets = {
  'Very Low': { resolutionScale:.5, blur:8, particleDensity:.18, glow:.25, mouseEffects:false, trails:false, clickEffects:false },
  Low: { resolutionScale:.67, blur:12, particleDensity:.3, glow:.4 },
  Medium: { resolutionScale:.8, blur:18, particleDensity:.45, glow:.65 },
  High: { resolutionScale:1, blur:24, particleDensity:.65, glow:1 },
  Ultra: { resolutionScale:1, blur:32, particleDensity:1, glow:1.3 }
};
export function applyQuality(name) { const p=presets[name]; if (!p) return; store.set({ quality:name, ...p }); }
export function qualityOptions(){ return Object.keys(presets); }
