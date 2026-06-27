"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { Suspense, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

import { scrollState } from "@/lib/scrollState";
import CameraRig from "@/components/scene/CameraRig";
import Sky from "@/components/scene/Sky";
import Terrain from "@/components/scene/Terrain";
import Crystal from "@/components/scene/Crystal";
import Aurora from "@/components/scene/Aurora";
import Silhouette from "@/components/scene/Silhouette";
import Effects from "@/components/scene/Effects";

gsap.registerPlugin(ScrollTrigger);

export default function Scene() {
  // Drive the shared scroll progress from the 500vh scroll container.
  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: "#scroll-container",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        scrollState.progress = self.progress;
      },
    });

    // ScrollTrigger needs a refresh once the DOM container is measured.
    ScrollTrigger.refresh();

    return () => trigger.kill();
  }, []);

  return (
    <div className="fixed inset-0 z-0 h-screen w-screen">
      <Canvas
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        camera={{ position: [0, 1.8, 6], fov: 65, near: 0.1, far: 200 }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#080010"]} />
        <fog attach="fog" args={["#080010", 18, 70]} />

        <Suspense fallback={null}>
          <CameraRig />
          <Sky />
          <Terrain />
          <Crystal />
          <Aurora />
          <Silhouette />

          {/* Lighting */}
          <ambientLight intensity={0.25} color="#8a5cff" />
          <directionalLight
            position={[-8, 6, -10]}
            intensity={1.4}
            color="#ff8a4c"
          />
          <pointLight position={[0, 4, 2]} intensity={6} color="#cc44ff" distance={30} />

          {/* Procedural environment for transmission / iridescence reflections
              (no network HDR fetch required) */}
          <Environment resolution={256} frames={1}>
            <color attach="background" args={["#080010"]} />
            <Lightformer
              intensity={3}
              color="#cc44ff"
              position={[-5, 5, -5]}
              scale={[10, 10, 1]}
            />
            <Lightformer
              intensity={2}
              color="#ff6b35"
              position={[5, 2, -8]}
              scale={[10, 5, 1]}
            />
            <Lightformer
              intensity={1.5}
              color="#ffffff"
              position={[0, -3, 4]}
              scale={[8, 8, 1]}
            />
          </Environment>

          <Effects />
        </Suspense>
      </Canvas>
    </div>
  );
}
