"use client";

import dynamic from "next/dynamic";
import SmoothScroll from "@/components/SmoothScroll";
import Overlay from "@/components/ui/Overlay";
import ScrollSections from "@/components/ui/ScrollSections";

// The WebGL scene is client-only and lazily loaded so SSR never touches
// three.js / window.
const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

export default function Home() {
  return (
    <SmoothScroll>
      {/* Fixed full-screen WebGL canvas — the DOM floats above it */}
      <Scene />

      {/* Floating UI chrome (logo, menu, sidebar, scroll hint) */}
      <Overlay />

      {/* 500vh of scroll height that drives the camera via ScrollTrigger */}
      <ScrollSections />
    </SmoothScroll>
  );
}
