"use client";

import { motion } from "framer-motion";

/**
 * The 500vh scroll container that ScrollTrigger measures to drive the camera.
 * It carries floating text sections that fade as they enter the viewport while
 * the WebGL canvas plays behind everything.
 */
const SECTIONS = [
  {
    kicker: "01 / INTRO",
    title: "At the edge of dawn",
    body: "An immersive descent into a procedural desert where light bends through crystal and the sky burns from violet to amber.",
  },
  {
    kicker: "02 / COMPANY",
    title: "We craft the unreal",
    body: "A studio building real-time worlds on the web — where WebGL, motion and sound dissolve the line between site and experience.",
  },
  {
    kicker: "03 / SERVICES",
    title: "Worlds, on demand",
    body: "Interactive 3D, generative visuals, and scroll-driven storytelling — engineered to run smooth in every browser.",
  },
  {
    kicker: "04 / VISION",
    title: "Beyond the horizon",
    body: "Every crest of the dune reveals another layer. The journey doesn't end — it only rises toward the light.",
  },
  {
    kicker: "·",
    title: "AURORA°",
    body: "Begin the descent.",
  },
];

function Section({
  kicker,
  title,
  body,
  align,
}: {
  kicker: string;
  title: string;
  body: string;
  align: "left" | "right" | "center";
}) {
  const alignment =
    align === "center"
      ? "items-center text-center"
      : align === "right"
        ? "items-end text-right"
        : "items-start text-left";

  return (
    <section className="flex h-screen w-full items-center justify-center px-8 md:px-24">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ margin: "-30% 0px -30% 0px" }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`flex max-w-xl flex-col gap-4 ${alignment}`}
      >
        <span className="font-mono text-xs tracking-[0.3em] text-aurora">
          {kicker}
        </span>
        <h2 className="font-grotesk text-4xl font-bold leading-tight text-[#f4ecff] md:text-6xl">
          {title}
        </h2>
        <p className="font-mono text-sm leading-relaxed text-[#f4ecff]/70 md:text-base">
          {body}
        </p>
      </motion.div>
    </section>
  );
}

export default function ScrollSections() {
  const aligns: ("left" | "right" | "center")[] = [
    "left",
    "right",
    "left",
    "right",
    "center",
  ];

  return (
    <div id="scroll-container" className="relative z-[5] w-full">
      {SECTIONS.map((s, i) => (
        <Section key={i} {...s} align={aligns[i]} />
      ))}
    </div>
  );
}
