"use client";

// 简单的 seeded PRNG，确保 SSR 和客户端生成一致的粒子
function seededRandom(seed: number) {
  return () => {
    seed = (seed * 16807 + 0) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function generateParticles() {
  const rand = seededRandom(42);
  return Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${rand() * 100}%`,
    top: `${rand() * 100}%`,
    delay: rand() * 3,
    size: rand() * 4 + 2,
  }));
}

const particles = generateParticles();

export default function Sparkles() {

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
