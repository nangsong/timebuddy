"use client";

import { useState } from "react";
import { AnalogClock } from "@/features/clock/AnalogClock";
import { isTimeCorrect, formatTime } from "@/features/clock/clockUtils";
import type { SetClockExercise as SetClockExerciseType } from "@/lib/exercise/types";
import type { DifficultyLevel } from "@/lib/exercise/types";

interface Props {
  exercise: SetClockExerciseType;
  level: DifficultyLevel;
  onAnswer: (correct: boolean) => void;
}

export function SetTheClockExercise({ exercise, level, onAnswer }: Props) {
  const [currentHour, setCurrentHour] = useState(12);
  const [currentMinute, setCurrentMinute] = useState(0);
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);

  function handleTimeChange(hour: number, minute: number) {
    setCurrentHour(hour);
    setCurrentMinute(minute);
  }

  function handleCheck() {
    if (checked) return;
    const correct = isTimeCorrect(
      currentHour,
      currentMinute,
      exercise.targetHour,
      exercise.targetMinute,
      level <= 2 ? 1 : 2
    );
    setResult(correct);
    setChecked(true);
    setTimeout(() => onAnswer(correct), 800);
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Scenario */}
      <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl px-6 py-4 text-center max-w-sm">
        <p className="text-lg font-bold text-orange-800">{exercise.scenario}</p>
      </div>

      {/* Target time display */}
      <div className="flex flex-col items-center gap-1">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Set the clock to
        </p>
        <p className="text-5xl font-black text-gray-800 tabular-nums">
          {formatTime(exercise.targetHour, exercise.targetMinute)}
        </p>
      </div>

      {/* Interactive clock */}
      <AnalogClock
        hour={12}
        minute={0}
        interactive
        level={level}
        onTimeChange={handleTimeChange}
        size={240}
      />

      {/* Current user time */}
      <p className="text-2xl font-bold text-gray-600 tabular-nums">
        Your clock: {formatTime(currentHour, currentMinute)}
      </p>

      {/* Check button */}
      <button
        onClick={handleCheck}
        disabled={checked}
        className={`w-full max-w-sm py-4 rounded-2xl text-xl font-black transition-all duration-200 shadow-md ${
          checked
            ? result
              ? "bg-green-500 text-white"
              : "bg-red-400 text-white"
            : "bg-green-500 text-white hover:bg-green-600 hover:scale-105 active:scale-95"
        } disabled:opacity-80 disabled:cursor-not-allowed`}
      >
        {checked ? (result ? "Correct! ⭐" : "Oops!") : "Check My Answer!"}
      </button>
    </div>
  );
}
