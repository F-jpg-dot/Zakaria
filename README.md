# AURORA° — Immersive 3D Website

A Lusion-inspired immersive WebGL experience: a scroll-driven journey through a
procedural desert at the edge of dawn, with a floating iridescent crystal,
diagonal aurora light beams, and a lone human silhouette beneath a burning sky.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **React Three Fiber** + **Drei** — WebGL scene
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
