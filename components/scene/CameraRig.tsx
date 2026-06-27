"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import { scrollState } from "@/lib/scrollState";

/**
 * Five camera keyframes the scroll progress interpolates between. Each keyframe
 * carries a position and a look-at target, producing a forward dolly, a lateral
 * pan, and a rise as the journey unfolds.
 */
type Key = { pos: [number, number, number]; look: [number, number, number] };

const KEYS: Key[] = [
  { pos: [0, 1.8, 6], look: [0, 1.5, 0] }, // 0   intro — eye level
  { pos: [-2.5, 2.4, 1], look: [0, 2, -6] }, // 25  glide left toward crystal
  { pos: [2.5, 3.6, -4], look: [0, 2.5, -12] }, // 50  swing right, climbing
  { pos: [-1, 6, -12], look: [0, 3, -22] }, // 75  rise above the dunes
  { pos: [0, 11, -26], look: [0, 2, -40] }, // 100 soar toward the horizon
];

// Reusable temporaries to avoid per-frame allocations.
const tmpPos = new THREE.Vector3();
const tmpLook = new THREE.Vector3();
const fromPos = new THREE.Vector3();
const toPos = new THREE.Vector3();
const fromLook = new THREE.Vector3();
const toLook = new THREE.Vector3();

const smoothstep = (t: number) => t * t * (3 - 2 * t);

export default function CameraRig() {
  const { camera } = useThree();
  const currentLook = useRef(new THREE.Vector3(0, 1.5, 0));

  useFrame(() => {
    const p = THREE.MathUtils.clamp(scrollState.progress, 0, 1);

    // Locate the active segment between two keyframes.
    const segments = KEYS.length - 1;
    const scaled = p * segments;
    const i = Math.min(Math.floor(scaled), segments - 1);
    const localT = smoothstep(scaled - i);

    fromPos.set(...KEYS[i].pos);
    toPos.set(...KEYS[i + 1].pos);
    fromLook.set(...KEYS[i].look);
    toLook.set(...KEYS[i + 1].look);

    tmpPos.lerpVectors(fromPos, toPos, localT);
    tmpLook.lerpVectors(fromLook, toLook, localT);

    // Ease the camera toward its target for buttery motion.
    camera.position.lerp(tmpPos, 0.08);
    currentLook.current.lerp(tmpLook, 0.08);
    camera.lookAt(currentLook.current);
  });

  return null;
}
