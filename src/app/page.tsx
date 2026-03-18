"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { AnalogClock } from "@/features/clock/AnalogClock";
import { useProgress } from "@/hooks/useProgress";
import { BookOpen, Dumbbell, Star } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { progress } = useProgress();
  const [currentTime, setCurrentTime] = useState({ hour: 12, minute: 0, second: 0 });

  // Live clock on home page
  useEffect(() => {
    const update = () => {
      const now = new Date();
      let hour = now.getHours() % 12;
      if (hour === 0) hour = 12;
      setCurrentTime({ hour, minute: now.getMinutes(), second: now.getSeconds() });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <AppShell>
      <div className="flex flex-col items-center gap-8 py-4 text-center">
        {/* Hero */}
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-black text-gray-800 leading-tight">
            Learn to Read<br />
            <span className="text-purple-600">the Clock!</span>
          </h1>
          <p className="text-base font-semibold text-gray-500 max-w-xs">
            Fun exercises to help you tell time like a pro!
          </p>
        </motion.div>

        {/* Live clock */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 150, damping: 18, delay: 0.2 }}
          className="drop-shadow-lg"
        >
          <AnalogClock
            hour={currentTime.hour}
            minute={currentTime.minute}
            second={currentTime.second}
            size={240}
          />
        </motion.div>

        {/* Stars earned */}
        {progress.totalStars > 0 && (
          <motion.div
            className="flex items-center gap-2 bg-yellow-50 border-2 border-yellow-200 rounded-2xl px-5 py-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-black text-yellow-700">
              {progress.totalStars} star{progress.totalStars !== 1 ? "s" : ""} earned!
            </span>
          </motion.div>
        )}

        {/* Action buttons */}
        <motion.div
          className="flex flex-col gap-4 w-full max-w-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <button
            onClick={() => router.push("/learn")}
            className="flex items-center justify-center gap-3 bg-purple-500 text-white rounded-2xl px-6 py-5 text-xl font-black hover:bg-purple-600 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-purple-200"
          >
            <BookOpen className="w-6 h-6" />
            Let&apos;s Learn! 📖
          </button>

          <button
            onClick={() => router.push("/practice")}
            className="flex items-center justify-center gap-3 bg-green-500 text-white rounded-2xl px-6 py-5 text-xl font-black hover:bg-green-600 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-green-200"
          >
            <Dumbbell className="w-6 h-6" />
            Let&apos;s Practice! 💪
          </button>
        </motion.div>

        {/* Progress info */}
        {progress.sessionsCompleted > 0 && (
          <p className="text-sm font-semibold text-gray-400">
            Sessions completed: {progress.sessionsCompleted} · Level {progress.level}
          </p>
        )}
      </div>
    </AppShell>
  );
}
