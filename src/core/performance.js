import { store } from './store.js';

const presets = {
  'Very Low': { resolutionScale:.5, blur:8, particleDensity:.18, glow:.25, mouseEffects:false, trails:false, clickEffects:false },
  Low: { resolutionScale:.67, blur:12, particleDensity:.3, glow:.4, mouseEffects:true, trails:false, clickEffects:false },
  Medium: { resolutionScale:.8, blur:18, particleDensity:.48, glow:.65, mouseEffects:true, trails:true, clickEffects:true },
  High: { resolutionScale:1, blur:24, particleDensity:.7, glow:1, mouseEffects:true, trails:true, clickEffects:true },
  Ultra: { resolutionScale:1, blur:32, particleDensity:1, glow:1.3, mouseEffects:true, trails:true, clickEffects:true }
};
export function applyQuality(name) {
  const p=presets[name]; if (!p) { if(name==='Custom') store.set({quality:'Custom'}); return; }
  store.set({ quality:name, ...p });
  document.dispatchEvent(new CustomEvent('nexus:quality-change'));
}
export function qualityOptions(){ return [...Object.keys(presets), 'Custom']; }
export function getQualityPreset(name){ return presets[name] ? {...presets[name]} : null; }
