# NEXUS Personal Web OS — v0.3

V0.3 is the **actual feature implementation pass**. It keeps the v0.2 visual foundation but replaces several cosmetic/placeholder paths with working browser-side systems.

## Working in this build

- Static GitHub Pages-compatible frontend; no required backend for the core shell.
- Connection model separates application, network, backend, AI and Spotify states.
- Settings are opened by the gear; there is no Settings route in the main navigation.
- Persistent local profile with migration from the v0.1/v0.2 `nexus-webos:v1` storage key.
- Real UI scale that transforms the application shell and HUD.
- Real render scale for Canvas-based visual systems.
- Aspect-ratio composition modes and viewport stretch mode.
- Live quality presets that change Canvas resolution, particle counts, blur, glow and interaction behavior.
- Six separate Canvas background systems:
  - Interactive Network
  - Particle Constellation
  - Digital Grid
  - Geometric Network
  - Liquid Aurora
  - Minimal Ambient
- Interactive Network includes moving nodes, proximity links, cursor influence and lighting.
- FPS HUD uses requestAnimationFrame timing.
- CPS HUD reads actual pointer input.
- Keystrokes HUD reads actual keyboard input and can auto-switch between WASD and arrow keys.
- Active Utilities HUD lists only enabled utilities.
- HUD widgets can be dragged and their position/scale/opacity persist.
- Utilities page controls HUDs, mouse/click effects, trails, particles and the page-local synthetic autoclicker.
- Local HTML game import/storage uses IndexedDB.
- Local game runtime supports launch, reload, stop, fullscreen, and a same-origin console bridge.
- AI workspace supports local conversation persistence, rename/delete/clear, file attachment, provider/model/endpoint/key configuration, and real HTTP requests to the configured endpoint.
- Spoof page genuinely changes document title and favicon.
- Proxy/Phone pages provide real capability/service-boundary controls and optional helper endpoint testing rather than fake connections.
- Data export/import/reset.

## Honest browser limitations

- GitHub Pages is an online static host. The application therefore reports `ONLINE` when loaded; lack of a backend is reported separately.
- A static page cannot become a system-wide proxy.
- A webpage cannot arbitrarily rewrite the browser address bar.
- Phone mirroring/control requires supported browser APIs, explicit permissions, or a companion application.
- AI direct-browser calls can be blocked by provider CORS rules. A CORS-enabled endpoint or backend adapter is required in that case.
- AI keys entered into this personal build are stored in local browser storage. They are never hard-coded into the repository, but users should understand that browser-stored secrets are not equivalent to server-side secret storage.
- Imported local games are stored as HTML and launched in an isolated iframe. Cross-origin execution remains subject to normal browser security.

## V0.3 audit result

### Replaced

- `CONNECTED/OFFLINE` was replaced with separate connection states.
- Settings route was replaced with a gear-opened system settings overlay.
- UI Scale now affects the actual application shell.
- Quality presets now alter live rendering behavior.
- Render Scale now changes Canvas backing resolution.
- Background selection now swaps independent Canvas systems.
- Home was reduced to a launch/status surface.
- HUDs are actual persistent overlays rather than informational counts.
- AI no longer pretends to be connected: it either makes a real configured request or reports that no request was sent.

### Still intentionally external / partial

- Spotify playback integration: **PARTIALLY IMPLEMENTED** — no Spotify account/auth service is bundled in the static build, so Spotify remains `DISCONNECTED` until a real integration is attached.
- Phone control: **PARTIALLY IMPLEMENTED** — service boundary and helper endpoint testing exist; unrestricted device control is outside normal static-browser privileges.
- Proxy: **PARTIALLY IMPLEMENTED** — helper endpoint testing exists; system-wide proxying needs a local helper/backend.
- Account/cloud sync: **NOT IMPLEMENTED** in this pass; local persistence is the source of truth.

## Validation

- Every JavaScript module passes `node --check`.
- The project serves successfully from a local static HTTP server.
- The Chromium headless smoke test was attempted, but the environment's Chromium process did not terminate cleanly under the test harness, so this build does **not** claim a successful automated browser smoke test.
