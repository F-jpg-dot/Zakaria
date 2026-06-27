# AURORA° — Immersive 3D Website

A Lusion-inspired immersive WebGL experience: a scroll-driven journey through a
procedural desert at the edge of dawn, with a floating iridescent crystal,
diagonal aurora light beams, and a lone human silhouette beneath a burning sky.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** — _started on Next 14 / React 18 per spec; bumped for security (see Security below)_
- **React Three Fiber 9** + **Drei 10** — WebGL scene
- **GSAP** + **ScrollTrigger** + **Lenis** — scroll-driven camera
- **Framer Motion** — UI animation only
- **Tailwind CSS** — UI styling only
- **@react-three/postprocessing** — Bloom, Vignette, Chromatic Aberration, Film grain

## Scene

- Full-screen fixed WebGL canvas; the DOM floats above it.
- 500vh scroll height drives the camera through 5 keyframes via ScrollTrigger scrub.
- Procedural desert terrain — 256×256 plane with GLSL FBM displacement.
- Floating iridescent crystal — `IcosahedronGeometry` + `MeshPhysicalMaterial`
  with transmission & iridescence.
- Diagonal aurora light beams — additive blending, emissive shader.
- Human silhouette standing on the dunes (dark material).
- Sky gradient shader: deep purple → magenta → warm amber.

## Camera

Starts at `[0, 1.8, 6]`, FOV 65. Scroll drives a forward dolly, lateral pan,
and rise across 5 keyframes (`components/scene/CameraRig.tsx`).

## Lenis + GSAP sync

```ts
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

See `components/SmoothScroll.tsx`.

## Colors

| Token      | Hex       |
| ---------- | --------- |
| Background | `#080010` |
| Terrain    | `#1a0b2e` |
| Aurora     | `#CC44FF` |
| Horizon    | `#FF6B35` |

## Fonts (`next/font`)

- **Space Grotesk** — navigation / headings
- **IBM Plex Mono** — body text

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Security

`npm audit` reports **0 vulnerabilities**. Getting there required:

- **Next.js → 16.2.9** — clears the high-severity Next.js advisories (DoS,
  cache poisoning, SSRF, XSS) present in the 14.x line.
- **React → 19 + R3F 9 / Drei 10 / postprocessing 3** — Next 16's App Router
  runs on React 19, and `@react-three/fiber` v8 crashes at runtime under React
  19 (`ReactCurrentOwner` was removed). The whole 3D stack was upgraded to its
  React 19-compatible majors. _Note: the production build passes either way —
  the v8 crash only surfaces in the browser, so this was caught by rendering
  the running app headlessly, not by `next build`._
- **`overrides: { "postcss": "^8.5.15" }`** — Next bundles an older `postcss`
  internally; this pins it to the patched line to clear the remaining moderate
  CSS-stringify XSS advisory.

## Project structure

```
app/
  layout.tsx          # fonts + metadata
  page.tsx            # composition (Scene + Overlay + ScrollSections)
  globals.css         # Tailwind + Lenis base styles
components/
  SmoothScroll.tsx    # Lenis + GSAP ticker sync
  Scene.tsx           # R3F Canvas, lights, environment, ScrollTrigger
  scene/
    CameraRig.tsx     # 5-keyframe scroll-driven camera
    Sky.tsx           # gradient sky shader
    Terrain.tsx       # 256x256 GLSL displaced dunes
    Crystal.tsx       # iridescent transmission crystal
    Aurora.tsx        # additive aurora beams
    Silhouette.tsx    # dark human figure
    Effects.tsx       # post-processing stack
  ui/
    Overlay.tsx       # logo, menu, sidebar nav, scroll hint (Framer Motion)
    ScrollSections.tsx# 500vh scroll content
lib/
  scrollState.ts      # bridge between ScrollTrigger and useFrame
```
