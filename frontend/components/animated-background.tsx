"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Grid bg */}
      <div className="absolute inset-0 grid-bg opacity-40" />

      {/* Glowing orbs */}
      <motion.div
        className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(167, 139, 250, 0.25) 0%, transparent 70%)",
        }}
        animate={{ x: [0, 100, 0], y: [0, 80, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 -right-40 w-[450px] h-[450px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(96, 165, 250, 0.22) 0%, transparent 70%)",
        }}
        animate={{ x: [0, -120, 0], y: [0, 100, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 left-1/3 w-[400px] h-[400px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(244, 114, 182, 0.18) 0%, transparent 70%)",
        }}
        animate={{ x: [0, 60, 0], y: [0, -60, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Noise overlay */}
      <div className="absolute inset-0 noise" />
    </div>
  );
}
