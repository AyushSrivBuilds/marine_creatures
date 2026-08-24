# Marine Creature Motion

A procedural marine-creature generative-art studio. Creatures emerge from GPU particle fields and mathematical deformation rather than static image assets.

## Stack
- React + TypeScript + Vite
- Three.js + WebGL
- Custom GLSL particle shaders
- Typed BufferGeometry attributes
- Additive blending, bloom and temporal trails

## Run
```bash
npm install
npm run dev
```

Production build:
```bash
npm run build
```

## Performance tiers
The studio exposes four density tiers:

| Tier | Target particles |
|---|---:|
| Eco | 25,000 |
| Balanced | 50,000 |
| High | 100,000 |
| Ultra | 250,000 |

The active FPS counter is intended for profiling on the user's actual GPU. Ultra is a stress tier, not a guaranteed frame-rate target on every device.

## Architecture
- `src/creatures`: data-driven species definitions
- `src/shaders`: GPU position and appearance programs
- `src/renderer`: WebGL, post-processing and interaction
- `src/state`: control state

The mathematical field decomposes the supplied reference into phase groups, harmonic frequency terms, radial magnitude, nonlinear deformation, temporal modulation and topology-dependent parametric curves.

Static particle attributes are allocated only when density changes. Per-frame motion is evaluated on the GPU; there is no CPU-side per-particle simulation loop.

## Validation
1. `npm install`
2. `npm run dev`
3. Switch through all six presets.
4. Verify controls, pause/reset/randomize and fullscreen.
5. Test Eco → Ultra tiers and observe FPS.
6. Resize through desktop and mobile layouts.
7. Run `npm run build`.
