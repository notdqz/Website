# NEXUS Personal Web OS — v0.2

NEXUS is a modular personal interactive web environment built for static hosting and local execution. It is intentionally not a generic dashboard: the application shell, glass surfaces, visual background engine, HUD layer, game runtime, and future provider/companion boundaries are separate modules.

## v0.2 additions

- Local HTML game library backed by IndexedDB
- Game runtime iframe with local/same-origin execution bridge
- Game-scoped developer console with `help`, `clear`, `status`, `context`, and `eval <expression>`
- Game console output capture for `console.log/info/warn/error`
- Console minimize/maximize/resize/drag behavior
- Central utility registry and configurable utility keybinds
- HUD toggles plus direct HUD scale/opacity controls
- Page-local synthetic autoclicker with explicit browser-only limitation
- Provider-neutral AI workspace with local conversation storage
- OpenAI / Claude / DeepSeek provider architecture stubs without embedded secrets
- Spoof/tab appearance controls for document title and SPA history state
- Manual render-resolution scaling tied to canvas render cost
- Background and visual systems remain modular and persistent

## Run locally

Serve the folder over HTTP so browser modules and IndexedDB behave consistently:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/`.

The same static build can be deployed to GitHub Pages.

## Project structure

```text
src/
  ai/             provider interfaces + local AI chat store
  backgrounds/    interactive canvas background engine
  core/           store, routing, theme, performance
  effects/        input + mouse/click effect engines
  games/          local game persistence and runtime bridge
  hud/            persistent HUD manager
  pages/          page renderers and page binders
  ui/             application shell / console
  utilities/      utility registry + keybind infrastructure
```

## Capability boundaries

The project deliberately does not fake browser privileges.

- GitHub Pages cannot safely hold private provider secrets by itself.
- Cross-origin iframes cannot be treated as same-origin game contexts.
- A static webpage cannot become a system-wide network proxy.
- Browser JavaScript cannot arbitrarily rewrite the real browser address bar.
- Unrestricted phone control requires browser-supported protocols and/or a companion application.
- The included autoclicker only dispatches synthetic clicks inside the NEXUS page.

## Validation

The v0.2 build was validated with JavaScript syntax checks and a local static HTTP server fetch of the primary HTML, CSS, and module assets.
