"use client";

import { useState, useEffect } from "react";

export default function Sparkles() {
  const [particles, setParticles] = useState<
    { id: number; left: string; top: string; delay: number; size: number }[]
  >([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: Math.random() * 3,
        size: Math.random() * 4 + 2,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="sparkle absolute rounded-full bg-yellow-200"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            boxShadow: `0 0 ${p.size * 2}px rgba(253, 224, 71, 0.8)`,
            opacity: 0.6,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
