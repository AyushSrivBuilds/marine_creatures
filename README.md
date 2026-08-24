# Marine Creature Motion

A procedural marine-creature generative-art studio. Creatures are generated from GPU particle fields and mathematical deformation rather than image assets.

## Stack

- React + TypeScript + Vite
- Three.js WebGL renderer
- Custom GLSL vertex and fragment shaders
- Typed `BufferGeometry` attributes
- Additive particle blending

## Run

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Architecture

`src/creatures` contains data-driven species definitions. `src/shaders` contains GPU position and appearance programs. The vertex shader decomposes the supplied mathematical reference into phase groups, harmonic frequency terms, radial magnitude, nonlinear deformation, temporal modulation and topology-dependent parametric curves.

The renderer assigns each particle static seed and topology coordinates once. Per-frame movement is evaluated on the GPU, avoiding CPU-side particle object allocation and rendering loops.

## Presets

Jellyfish, Squid, Octopus, Crab, Lobster and Seahorse are implemented as data-driven presets with independent body topology, appendage defaults, symmetry semantics, aspect ratio, motion/deformation coefficients and bioluminescent palettes.

## Performance

The desktop default is 50,000 particles. Density can be adjusted from 10,000 to 100,000 through the UI. The architecture uses static GPU attributes and can be extended toward larger particle counts without changing the simulation model.

## Validation checklist

1. `npm install`
2. `npm run dev`
3. Switch through all six presets.
4. Verify every control updates live.
5. Test pause, reset, randomize and fullscreen.
6. Resize through desktop and mobile layouts.
7. Run `npm run build`.
