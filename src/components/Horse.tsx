"use client";

import { motion } from "framer-motion";

export default function Horse() {
  return (
    <motion.svg
      width="120"
      height="120"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.path
        d="M20 50 C 20 40, 30 20, 50 20 C 60 20, 70 25, 80 30 C 80 30, 85 20, 90 15 C 90 15, 85 35, 80 40 C 80 50, 75 60, 70 70 L 65 90 L 55 90 L 60 70 C 50 70, 40 75, 30 80 L 25 90 L 15 90 L 20 70 C 15 65, 10 60, 10 50 Z"
        fill="url(#horse-gradient)"
        stroke="#FCD34D"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      <motion.path
        d="M50 20 C 45 15, 40 15, 35 20 C 35 20, 30 30, 35 40"
        stroke="#FCD34D"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />
      <defs>
        <linearGradient id="horse-gradient" x1="10" y1="90" x2="90" y2="15" gradientUnits="userSpaceOnUse">
          <stop stopColor="#991B1B" />
          <stop offset="0.5" stopColor="#DC2626" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
}
