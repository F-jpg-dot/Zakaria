# Video assets

The site auto-detects these files. Drop them here and reload — no code changes
needed. Until they exist, the site shows a polished dark-luxury CSS fallback
(animated spotlight stage for the hero, red-lit cockpit panel for the interior).

| File                   | Section            | Spec                              |
| ---------------------- | ------------------ | --------------------------------- |
| `exterior-orbit.mp4`   | Hero (Section 1)   | Verde Mantis 360° studio orbit, 1080p 16:9, 6–8s loop |
| `interior-cockpit.mp4` | Interior (Sec. 3)  | Cockpit focus-sweep, 1080p, 6–8s  |
| `exterior-poster.jpg`  | Hero poster        | optional still (first frame)      |
| `interior-poster.jpg`  | Interior poster    | optional still                    |

## Source

These were specified for generation via the Higgsfield MCP (`kling3_0_turbo`,
1080p / 16:9 / 7s). If you have the Higgsfield clip URLs instead of local files,
either:

1. Download them to this folder with the names above, **or**
2. Edit `index.html` — change the `data-src` on `#heroMedia` / `#intMedia`
   to the CDN URL.

## Poster stills from a clip (ffmpeg)

```bash
ffmpeg -i exterior-orbit.mp4 -vf "select=eq(n\,0)" -q:v 3 exterior-poster.jpg
ffmpeg -i interior-cockpit.mp4 -vf "select=eq(n\,0)" -q:v 3 interior-poster.jpg
```
