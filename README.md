WARNING!! This project is 108% vibe coded

# NEXUS — Personal Interactive Web OS

A dependency-light first build of the personal interactive web OS described in the project brief.

## Run locally

Because this uses ES modules, serve the directory with any static file server.

Examples:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

You can also upload the contents of this folder to GitHub Pages. No build step or npm package is required.

## What is implemented

- Modular router, persistent state store, theme engine, performance presets
- Liquid-glass UI shell with responsive layout and dynamic cursor lighting
- 9 independent canvas background systems
- Cursor trail and click-particle effects
- Live FPS/CPS/keystrokes HUDs with drag persistence
- Active Utilities HUD
- Settings application with themes, quality, background, effects, HUD, import/export, and reset
- Online/offline status detection
- Developer-style console shell with honest same-origin/local-game limitation
- Placeholder architecture pages for Games, AI, Proxy, Phone, Spoof, Utilities

## Important browser boundaries

This first build does **not** fake capabilities a static browser page cannot securely provide. In particular:

- A browser page cannot become a system-wide proxy by itself.
- A static GitHub Pages build should not contain private API secrets.
- Cross-origin iframes cannot be inspected like same-origin/local games.
- Browser JavaScript cannot manufacture trusted OS-level mouse clicks for a real autoclicker.
- Unrestricted phone control needs supported APIs and usually a companion application.
- JavaScript can modify document title, favicon, and SPA history state, but not arbitrarily rewrite the real browser address bar.

## Extension strategy

Each major system is already isolated in its own module. Add future providers/integrations beside the corresponding module instead of expanding `main.js` into a monolith.
