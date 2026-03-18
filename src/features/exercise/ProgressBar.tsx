"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";

interface ProgressBarProps {
  starsEarned: number;
  total: number;
}

export function ProgressBar({ starsEarned, total }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-1.5 justify-center flex-wrap">
      {Array.from({ length: total }, (_, i) => (
        <AnimatePresence key={i} mode="wait">
          {i < starsEarned ? (
            <motion.div
              key="filled"
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 15, delay: i * 0.05 }}
            >
              <Star className="w-7 h-7 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
              <Star className="w-7 h-7 fill-gray-200 text-gray-300" />
            </motion.div>
          )}
        </AnimatePresence>
      ))}
      <span className="ml-2 text-base font-bold text-gray-500">
        {starsEarned}/{total}
      </span>
    </div>
  );
}
