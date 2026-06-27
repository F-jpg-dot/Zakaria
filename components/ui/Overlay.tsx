"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const SECTIONS = ["INTRO", "COMPANY", "SERVICES"];

const fade = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.4 + i * 0.15, duration: 0.8, ease: "easeOut" },
  }),
};

export default function Overlay() {
  const [active, setActive] = useState(0);

  return (
    <div className="pointer-events-none fixed inset-0 z-10 select-none">
      {/* Logo — top left */}
      <motion.div
        custom={0}
        variants={fade}
        initial="hidden"
        animate="show"
        className="absolute left-6 top-6 md:left-10 md:top-8"
      >
        <span className="font-grotesk text-lg font-bold tracking-[0.2em] text-[#f4ecff]">
          AURORA<span className="text-aurora">°</span>
        </span>
      </motion.div>

      {/* MENU — top right */}
      <motion.button
        custom={1}
        variants={fade}
        initial="hidden"
        animate="show"
        className="pointer-events-auto absolute right-6 top-6 font-grotesk text-sm font-medium tracking-[0.25em] text-[#f4ecff] transition-opacity hover:opacity-60 md:right-10 md:top-8"
      >
        MENU
      </motion.button>

      {/* Left sidebar nav */}
      <motion.nav
        custom={2}
        variants={fade}
        initial="hidden"
        animate="show"
        className="pointer-events-auto absolute left-6 top-1/2 hidden -translate-y-1/2 flex-col gap-4 md:left-10 md:flex"
      >
        {SECTIONS.map((s, i) => (
          <button
            key={s}
            onClick={() => setActive(i)}
            className="group flex items-center gap-3 text-left"
          >
            <span
              className={`h-px transition-all duration-500 ${
                active === i
                  ? "w-8 bg-aurora"
                  : "w-4 bg-[#f4ecff]/40 group-hover:w-6"
              }`}
            />
            <span
              className={`font-mono text-xs tracking-[0.2em] transition-colors duration-300 ${
                active === i
                  ? "text-[#f4ecff]"
                  : "text-[#f4ecff]/40 group-hover:text-[#f4ecff]/70"
              }`}
            >
              {String(i + 1).padStart(2, "0")} / {s}
            </span>
          </button>
        ))}
      </motion.nav>

      {/* SCROLL TO DISCOVER — bottom center */}
      <motion.div
        custom={3}
        variants={fade}
        initial="hidden"
        animate="show"
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] tracking-[0.35em] text-[#f4ecff]/70">
          SCROLL TO DISCOVER
        </span>
        <motion.span
          animate={{ y: [0, 8, 0], opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="h-6 w-px bg-gradient-to-b from-aurora to-transparent"
        />
      </motion.div>
    </div>
  );
}
