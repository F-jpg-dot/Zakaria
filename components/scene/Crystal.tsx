"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Crystal() {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      // slow bob
      group.current.position.y = 2.4 + Math.sin(t * 0.6) * 0.25;
    }
    if (mesh.current) {
      mesh.current.rotation.y = t * 0.25;
      mesh.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    }
  });

  return (
    <group ref={group} position={[0, 2.4, -6]}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.3, 0]} />
        <meshPhysicalMaterial
          transmission={1}
          thickness={1.5}
          roughness={0.05}
          metalness={0}
          ior={1.6}
          iridescence={1}
          iridescenceIOR={1.8}
          iridescenceThicknessRange={[100, 800]}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={1.5}
          color="#ffffff"
          attenuationColor="#cc44ff"
          attenuationDistance={2}
          transparent
        />
      </mesh>

      {/* inner glowing core for bloom to grab onto */}
      <mesh scale={0.45}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#ff8a4c" toneMapped={false} />
      </mesh>
    </group>
  );
}
