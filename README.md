# Marine Creature Motion

A procedural marine-creature generative-art studio. The application uses GPU particle fields and mathematical deformation. It does not use static creature images.

## Software
- React
- TypeScript
- Vite
- Three.js
- WebGL
- GLSL shaders

## Start

Install the software:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the production application:

```bash
npm run build
```

## Performance modes

| Mode | Target particle count |
|---|---:|
| Eco | 25,000 |
| Balanced | 50,000 |
| High | 100,000 |
| Ultra | 250,000 |

Low-performance devices have a 50,000-particle limit. Desktop-class devices can use up to 250,000 particles.

Ultra is a stress mode. It does not guarantee a specific frame rate.

## Benchmark panel

The control panel shows:

- Current FPS
- Average FPS
- 1% low FPS
- Renderer pixel ratio
- Sample count

The application keeps up to 600 recent frame samples. It removes frame samples that are longer than 250 ms from the benchmark data.

Use **Clear benchmark** before you test a new quality mode or a new creature.

For a useful test:

1. Select a quality mode.
2. Wait for the particle field to become stable.
3. Run the animation for at least 10 seconds.
4. Record the average FPS and 1% low FPS.
5. Repeat the test for each quality mode.

## Architecture

- `src/creatures` contains data-driven species definitions.
- `src/shaders` contains GPU shader programs.
- `src/renderer` contains WebGL, post-processing, and interaction code.
- `src/state` contains control state.

The mathematical field uses phase groups, harmonic frequencies, radial magnitude, nonlinear deformation, time modulation, and parametric curves.

The application allocates particle buffers when the particle density changes. The GPU calculates particle motion for each frame. The CPU does not run a per-particle simulation loop.

## Validation

1. Run `npm install`.
2. Run `npm run dev`.
3. Test all six creature presets.
4. Test the controls, pause, reset, randomize, and fullscreen functions.
5. Test all four performance modes.
6. Resize the application for desktop and mobile layouts.
7. Run `npm run build`.
