"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BackSide } from "three";

const vertexShader = /* glsl */ `
  varying vec3 vWorldPosition;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vWorldPosition;
  uniform vec3 uTop;
  uniform vec3 uMid;
  uniform vec3 uHorizon;
  uniform float uTime;

  void main() {
    float h = normalize(vWorldPosition).y;

    // deep purple (top) -> magenta (mid) -> warm amber (horizon)
    vec3 col = mix(uHorizon, uMid, smoothstep(-0.05, 0.45, h));
    col = mix(col, uTop, smoothstep(0.35, 0.95, h));

    // subtle glowing band at the horizon
    float glow = smoothstep(0.12, 0.0, abs(h - 0.02));
    col += uHorizon * glow * 0.55;

    // faint shifting aurora wash high in the sky
    float shimmer = 0.04 * sin(vWorldPosition.x * 0.15 + uTime * 0.2) * smoothstep(0.3, 1.0, h);
    col += uMid * shimmer;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function Sky() {
  const mat = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (mat.current) {
      mat.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh scale={[1, 1, 1]}>
      <sphereGeometry args={[100, 32, 32]} />
      <shaderMaterial
        ref={mat}
        side={BackSide}
        depthWrite={false}
        fog={false}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTop: { value: new THREE.Color("#1a0033") },
          uMid: { value: new THREE.Color("#cc44ff") },
          uHorizon: { value: new THREE.Color("#FF6B35") },
          uTime: { value: 0 },
        }}
      />
    </mesh>
  );
}
