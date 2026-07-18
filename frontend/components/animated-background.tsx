"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Subtle grid */}
      <div className="absolute inset-0 grid-bg opacity-50" />

      {/* Soft AI orbs - light theme, gentle motion */}
      <motion.div
        className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, transparent 70%)",
        }}
        animate={{ x: [0, 80, 0], y: [0, 60, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/4 -right-40 w-[420px] h-[420px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(8, 145, 178, 0.10) 0%, transparent 70%)",
        }}
        animate={{ x: [0, -100, 0], y: [0, 80, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 left-1/3 w-[360px] h-[360px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(167, 139, 250, 0.08) 0%, transparent 70%)",
        }}
        animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
