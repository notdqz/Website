import { aiStore } from '../ai/store.js';

export function getConnectionState(){
  const ai=aiStore.get();
  return {
    application: 'ONLINE',
    network: navigator.onLine ? 'AVAILABLE' : 'UNAVAILABLE',
    backend: 'NOT CONFIGURED',
    ai: ai.apiKey && ai.model && ai.endpoint ? 'CONFIGURED' : 'NOT CONFIGURED',
    spotify: 'DISCONNECTED'
  };
}
