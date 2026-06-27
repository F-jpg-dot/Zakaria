"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { AdditiveBlending } from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;

  void main() {
    // vertical falloff so the beam fades at both ends
    float vFade = smoothstep(0.0, 0.25, vUv.y) * smoothstep(1.0, 0.6, vUv.y);

    // soft horizontal core
    float core = smoothstep(0.5, 0.0, abs(vUv.x - 0.5));

    // drifting flicker
    float flicker = 0.6 + 0.4 * sin(vUv.y * 12.0 + uTime * 1.5);

    float alpha = core * vFade * flicker;
    gl_FragColor = vec4(uColor * alpha * 1.6, alpha);
  }
`;

function Beam({
  position,
  rotation,
  color,
  scale,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  scale: [number, number];
}) {
  const mat = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (mat.current) {
      mat.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[scale[0], scale[1]]} />
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        side={THREE.DoubleSide}
        fog={false}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(color) },
        }}
      />
    </mesh>
  );
}

export default function Aurora() {
  return (
    <group position={[0, 6, -18]}>
      <Beam
        position={[-6, 0, -4]}
        rotation={[0, 0, 0.5]}
        color="#CC44FF"
        scale={[6, 26]}
      />
      <Beam
        position={[3, 1, -8]}
        rotation={[0, 0, 0.35]}
        color="#9a4cff"
        scale={[5, 24]}
      />
      <Beam
        position={[8, -1, -2]}
        rotation={[0, 0, 0.6]}
        color="#ff6b35"
        scale={[4, 22]}
      />
      <Beam
        position={[-2, 0, -10]}
        rotation={[0, 0, 0.42]}
        color="#e0a0ff"
        scale={[3.5, 20]}
      />
    </group>
  );
}
