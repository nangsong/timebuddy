"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";

export function StarCounter() {
  const { progress } = useProgress();

  return (
    <motion.div
      className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-1.5"
      key={progress.totalStars}
      animate={{ scale: [1, 1.15, 1] }}
      transition={{ duration: 0.3 }}
    >
      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      <span className="text-sm font-black text-yellow-700 tabular-nums">
        {progress.totalStars}
      </span>
    </motion.div>
  );
}
