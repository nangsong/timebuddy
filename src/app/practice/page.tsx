"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ExerciseSession } from "@/features/exercise/ExerciseSession";
import { LevelSelector } from "@/features/settings/LevelSelector";
import { useProgress } from "@/hooks/useProgress";
import type { DifficultyLevel } from "@/lib/exercise/types";

export default function PracticePage() {
  const { progress, setLevel } = useProgress();
  const [sessionLevel, setSessionLevel] = useState<DifficultyLevel>(progress.level);
  const [started, setStarted] = useState(false);

  function handleLevelSelect(level: DifficultyLevel) {
    setSessionLevel(level);
    setLevel(level);
  }

  if (!started) {
    return (
      <AppShell>
        <div className="flex flex-col items-center gap-6 py-2">
          <div className="text-center">
            <h1 className="text-3xl font-black text-gray-800">Practice Time! 💪</h1>
            <p className="text-base font-semibold text-gray-500 mt-1">
              Pick your level and let&apos;s go!
            </p>
          </div>

          <LevelSelector selected={sessionLevel} onSelect={handleLevelSelect} />

          <button
            onClick={() => setStarted(true)}
            className="w-full max-w-sm bg-green-500 text-white rounded-2xl py-4 text-xl font-black hover:bg-green-600 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-green-200 mt-2"
          >
            Start Level {sessionLevel}! 🚀
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <ExerciseSession level={sessionLevel} />
    </AppShell>
  );
}
