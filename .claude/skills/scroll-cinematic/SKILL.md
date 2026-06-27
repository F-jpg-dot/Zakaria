---
name: scroll-cinematic
description: >-
  Build scroll-driven cinematic and 3D websites — Apple-style scroll-scrubbed
  canvas frame sequences, sticky pinned sections, Lenis smooth scroll, and
  scroll-progress-driven text/HUD reveals. Use when the user wants a scroll
  cinematic, frame-sequence scrub, scrollytelling, pinned hero, "scroll to play
  a video frame by frame", or a scroll-driven WebGL/R3F camera. Covers both
  pre-rendered frame sequences (2.5D) and real-time React Three Fiber.
---

# Scroll Cinematic

Two complementary techniques for scroll-driven immersive sites. Pick based on
what the "3D" actually is:

| You have…                                  | Use technique            |
| ------------------------------------------ | ------------------------ |
| A pre-rendered video / Blender / 3D render | **Frame-sequence scrub** |
| Live, interactive 3D geometry & lighting   | **Real WebGL (R3F)**     |
| Both                                        | Layer them (R3F behind, frame scrub for a hero beat) |

Both share the **same three invariants** — get these right and everything else
is theming:

1. **A tall section (e.g. `height: 500vh`) with a `position: sticky` / `fixed`
   child pinned at `top: 0; height: 100vh`.** The tall outer drives scroll
   distance; the sticky inner is what the viewer sees. Scroll distance = how
   long the "shot" plays.
2. **A normalized progress value `p` in `[0,1]`** derived from the section's
   position, which drives *everything* (frame index, camera, text opacity).
3. **Lenis smooth scroll synced into a single rAF loop** so the scrub feels
   filmic instead of janky.

## The progress formula (memorize this)

```js
const rect = section.getBoundingClientRect();
const scrollable = rect.height - window.innerHeight; // total scrollable px
const p = Math.min(Math.max(-rect.top / scrollable, 0), 1); // 0 → 1
```

`-rect.top` is how far the section's top has scrolled past the viewport top.
Divide by `scrollable` and clamp. That's the only scroll math you need.

## Lenis + rAF sync (non-negotiable for smoothness)

Drive Lenis and your per-frame update from **one** `requestAnimationFrame` loop:

```js
const lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
function raf(t) {
  lenis.raf(t);
  scrubs.forEach((s) => s.update()); // your per-frame work
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
```

In a **GSAP/ScrollTrigger** project, sync via the GSAP ticker instead (this is
what the AURORA project in this repo does — see `components/SmoothScroll.tsx`):

```js
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

Never run two scroll loops. Read `p` in the render tick, never re-render React
state per scroll event.

---

## Technique A — Frame-sequence scrub (2.5D)

Draw a sequence of pre-rendered JPGs to a `<canvas>`, picking the frame from
`p`. This is the Apple AirPods / iPhone effect. Buttery, works everywhere, no
WebGL.

```js
const idx = Math.min(frameCount - 1, Math.floor(p * (frameCount - 1)));
if (idx !== current) { current = idx; draw(idx); }
```

**Bundled, ready-to-use implementations** (in `assets/`):

- `assets/react/CinematicReveal.tsx` — drop-in Next.js/React component.
  Props: `frameCount`, `framePath(i)`, `lines[]`, `scrollVh`. Self-contained
  (own canvas + sticky section + reveal lines).
- `assets/vanilla/` — `index.html` + `styles.css` + `scroll-cinematic.js`, a
  themeable HUD demo (Iron-Man "I AM INEVITABLE"). `Launch_Demo.command`
  double-click-launches a local server on macOS.

### Wiring the vanilla engine (important)

`scroll-cinematic.js` is the general "PRISM" engine: it reads a global
`window.SCRUB_SECTIONS` config and reveal elements with class `.reveal-line`
(via `data-in` / `data-out`). The bundled `index.html` is a *simpler* demo that
uses `.line` and no config. To run the engine, add before the script tag:

```html
<script>
  window.SCRUB_SECTIONS = [{
    section: "#cinematic",
    frameCount: 150,
    framePath: (i) => `frames/frame_${String(i).padStart(4, "0")}.jpg`,
    bg: "#02030a",
  }];
</script>
```

and give each reveal `<h1>` `class="reveal-line"` with `data-in`/`data-out`.
(The React component already handles all of this internally — prefer it in
Next.js projects.)

### Frame essentials

- **Preload every frame** before/while scrubbing (`new Image()` in a loop).
  Hundreds of small JPGs beat one huge video for scrub precision.
- **`canvas.getContext("2d", { alpha: false })`** + a solid `fillRect`
  background each draw — avoids ghosting.
- **`cover` math**, not stretch: scale by the larger ratio and center
  (see `draw()` in either file). Re-`draw()` on resize.
- **DPR cap at 2**: `Math.min(window.devicePixelRatio || 1, 2)` — retina sharp
  without quadrupling fill cost.
- **Frame count vs scroll height**: `~30 frames per 100vh` feels natural.
  150 frames → `height: 500vh`.

### Generating frames from a video (ffmpeg)

```bash
# extract N frames as zero-padded JPGs
ffmpeg -i source.mp4 -vf "fps=30,scale=1920:-1" -q:v 3 frames/frame_%04d.jpg
# count them so frameCount matches
ls frames | wc -l
```

Render Blender/3D exports straight to the same `frame_0001.jpg…` naming.

---

## Technique B — Real WebGL (React Three Fiber)

When the 3D must be live (interactive lighting, transmission, parallax depth),
drive the **camera** from `p` instead of a frame index. The AURORA project in
this repo is a full reference implementation — study these files:

- `components/SmoothScroll.tsx` — Lenis + GSAP ticker sync.
- `components/Scene.tsx` — `ScrollTrigger` writes `p` into a shared mutable
  singleton (`lib/scrollState.ts`) on scrub.
- `components/scene/CameraRig.tsx` — `useFrame` reads `p`, interpolates the
  camera across keyframes (position + look-at) with `smoothstep` + `lerp`.

Key pattern: **bridge ScrollTrigger → the R3F render loop through a plain
mutable object, not React state** — so scrolling never triggers re-renders:

```ts
// lib/scrollState.ts
export const scrollState = { progress: 0 };
// ScrollTrigger onUpdate: scrollState.progress = self.progress
// useFrame: read scrollState.progress, lerp the camera toward its keyframe
```

Camera keyframes are an array of `{ pos, look }`; map `p` onto segments, ease
within each with `smoothstep`, and `camera.position.lerp(target, 0.08)` for
trailing smoothness.

### Version gotcha (learned the hard way in this repo)

`@react-three/fiber` **v8 crashes under React 19** (`ReactCurrentOwner` was
removed). Next.js 16's App Router runs React 19. If you're on Next ≥ 15 / React
19, you **must** use the React-19 majors: `@react-three/fiber@9`,
`@react-three/drei@10`, `@react-three/postprocessing@3`. A passing `next build`
does **not** prove the scene works — the crash is client-only. Always render the
running page (headless browser screenshot) to verify, not just the build.

---

## Scroll-driven text reveals (both techniques)

Each line owns a window `[in, out]` in progress space; opacity peaks at the
window's midpoint and fades at its edges:

```js
const mid = (a + b) / 2, half = (b - a) / 2;
let o = 1 - Math.abs(p - mid) / half;     // 1 at center, 0 at edges
o = Math.max(0, Math.min(1, o));
el.style.opacity = o;
el.style.transform = `translateY(${(1 - o) * 30}px)`; // subtle rise
```

For one-shot reveals of normal page sections, use `IntersectionObserver` +
a `.in` class (see the bottom of `scroll-cinematic.js`), plus `animateCount()`
for stat count-ups.

---

## Build checklist

- [ ] Tall section + sticky/fixed 100vh child.
- [ ] Single `p` from `getBoundingClientRect`, clamped `[0,1]`.
- [ ] Lenis in one rAF/ticker loop; no second scroll listener doing layout.
- [ ] Frame scrub: all images preloaded, `alpha:false`, cover-fit, DPR ≤ 2.
- [ ] R3F: progress via mutable singleton (not state); fiber/drei majors match
      the React version.
- [ ] Verify in a real browser (screenshot the running page), not just `build`.
- [ ] Mobile: cap DPR, hide overlapping HUD labels under ~600px.

## Asset reference

```
assets/
  react/CinematicReveal.tsx     # Next.js component (self-contained)
  vanilla/index.html            # HUD demo markup
  vanilla/styles.css            # HUD / sticky / vignette / reveal styling
  vanilla/scroll-cinematic.js   # general scrub engine + reveals + counters
  vanilla/Launch_Demo.command   # macOS double-click local server
```
