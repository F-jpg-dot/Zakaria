/**
 * A tiny mutable singleton that bridges GSAP ScrollTrigger (DOM world) with
 * the React Three Fiber render loop. ScrollTrigger writes `progress` on scrub
 * and `useFrame` reads it — avoiding React re-renders on every scroll tick.
 */
export const scrollState = {
  /** Normalized scroll progress across the whole experience, 0 → 1. */
  progress: 0,
};
