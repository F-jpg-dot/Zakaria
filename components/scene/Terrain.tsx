"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  uniform float uTime;
  varying float vElevation;
  varying vec2 vUv;

  // Classic 2D simplex-ish value noise (cheap, good enough for dunes).
  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
          dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
      mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
          dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
      u.y);
  }

  float fbm(vec2 p) {
    float total = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    for (int i = 0; i < 5; i++) {
      total += amp * noise(p * freq);
      freq *= 2.0;
      amp *= 0.5;
    }
    return total;
  }

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Large rolling dunes + finer ripples drifting slowly over time.
    float dunes = fbm(pos.xy * 0.06 + vec2(uTime * 0.01, 0.0)) * 6.0;
    float ripples = fbm(pos.xy * 0.4 + vec2(0.0, uTime * 0.03)) * 0.6;
    float elevation = dunes + ripples;

    pos.z += elevation;
    vElevation = elevation;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uLow;
  uniform vec3 uHigh;
  uniform vec3 uAurora;
  varying float vElevation;
  varying vec2 vUv;

  void main() {
    float t = smoothstep(-2.0, 6.0, vElevation);
    vec3 col = mix(uLow, uHigh, t);

    // aurora rim catching the crests
    col += uAurora * smoothstep(4.0, 7.0, vElevation) * 0.35;

    // darken toward the far edges for depth
    float edge = smoothstep(0.0, 0.35, vUv.y);
    col *= mix(0.35, 1.0, edge);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function Terrain() {
  const mat = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (mat.current) {
      mat.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, -20]}>
      {/* 256x256 segment plane for smooth GLSL displacement */}
      <planeGeometry args={[160, 160, 256, 256]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uLow: { value: new THREE.Color("#1a0b2e") },
          uHigh: { value: new THREE.Color("#3a1a5e") },
          uAurora: { value: new THREE.Color("#CC44FF") },
        }}
      />
    </mesh>
  );
}
