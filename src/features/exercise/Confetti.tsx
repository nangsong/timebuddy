"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  color: string;
  delay: number;
  size: number;
}

const COLORS = [
  "#f59e0b", "#10b981", "#6366f1", "#ec4899", "#f97316",
  "#14b8a6", "#8b5cf6", "#06b6d4", "#84cc16",
];

export function Confetti({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }
    const newParticles: Particle[] = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.3,
      size: 6 + Math.random() * 8,
    }));
    setParticles(newParticles);
  }, [active]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: "-20px",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          initial={{ y: -20, opacity: 1, rotate: 0, x: 0 }}
          animate={{
            y: ["0vh", "110vh"],
            opacity: [1, 1, 0],
            rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
            x: [(Math.random() - 0.5) * 80, (Math.random() - 0.5) * 160],
          }}
          transition={{
            duration: 1.8 + Math.random() * 0.8,
            delay: p.delay,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}
