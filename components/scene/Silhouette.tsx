"use client";

import * as THREE from "three";

/**
 * A simple dark human silhouette standing on the dunes, dwarfed by the crystal
 * and aurora — the lone observer that gives the landscape its scale.
 */
export default function Silhouette() {
  const material = (
    <meshStandardMaterial color="#050008" roughness={0.9} metalness={0} />
  );

  return (
    <group position={[1.6, -1.2, -7]} rotation={[0, -0.4, 0]}>
      {/* legs */}
      <mesh position={[-0.12, 0.45, 0]}>
        <capsuleGeometry args={[0.07, 0.8, 4, 8]} />
        {material}
      </mesh>
      <mesh position={[0.12, 0.45, 0]}>
        <capsuleGeometry args={[0.07, 0.8, 4, 8]} />
        {material}
      </mesh>
      {/* torso */}
      <mesh position={[0, 1.25, 0]}>
        <capsuleGeometry args={[0.18, 0.6, 4, 8]} />
        {material}
      </mesh>
      {/* head */}
      <mesh position={[0, 1.85, 0]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        {material}
      </mesh>
      {/* arms resting at the sides */}
      <mesh position={[-0.26, 1.2, 0]} rotation={[0, 0, 0.12]}>
        <capsuleGeometry args={[0.05, 0.55, 4, 8]} />
        {material}
      </mesh>
      <mesh position={[0.26, 1.2, 0]} rotation={[0, 0, -0.12]}>
        <capsuleGeometry args={[0.05, 0.55, 4, 8]} />
        {material}
      </mesh>
    </group>
  );
}
