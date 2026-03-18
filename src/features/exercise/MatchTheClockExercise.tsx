"use client";

import { useState, useMemo } from "react";
import { AnalogClock } from "@/features/clock/AnalogClock";
import { generateDistractors } from "@/lib/exercise/matchHelpers";
import type { MatchClockExercise as MatchClockExerciseType } from "@/lib/exercise/types";
import type { DifficultyLevel } from "@/lib/exercise/types";
import { cn } from "@/lib/utils";

interface ClockOption {
  hour: number;
  minute: number;
  isCorrect: boolean;
}

interface Props {
  exercise: MatchClockExerciseType;
  level: DifficultyLevel;
  onAnswer: (correct: boolean) => void;
}

export function MatchTheClockExercise({ exercise, level, onAnswer }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const options: ClockOption[] = useMemo(() => {
    const distractors =
      exercise.distractors.length >= 3
        ? exercise.distractors
        : generateDistractors({ hour: exercise.targetHour, minute: exercise.targetMinute }, level, 3);

    const all: ClockOption[] = [
      { hour: exercise.targetHour, minute: exercise.targetMinute, isCorrect: true },
      ...distractors.slice(0, 3).map((d) => ({ hour: d.hour, minute: d.minute, isCorrect: false })),
    ];
    // Shuffle
    return all.sort(() => Math.random() - 0.5);
  }, [exercise, level]);

  function handleSelect(index: number) {
    if (answered) return;
    setSelectedIndex(index);
    setAnswered(true);
    setTimeout(() => onAnswer(options[index].isCorrect), 700);
  }

  function getBorderClass(index: number) {
    if (!answered) {
      return selectedIndex === index
        ? "ring-4 ring-purple-500 scale-105"
        : "ring-2 ring-gray-200 hover:ring-purple-300 hover:scale-105";
    }
    if (options[index].isCorrect) return "ring-4 ring-green-500 scale-105 shadow-lg shadow-green-200";
    if (index === selectedIndex && !options[index].isCorrect) return "ring-4 ring-red-400 opacity-70";
    return "ring-2 ring-gray-200 opacity-50";
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Scenario */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl px-6 py-4 text-center max-w-sm">
        <p className="text-lg font-bold text-blue-800">{exercise.scenario}</p>
      </div>

      {/* Digital time target */}
      <div className="flex flex-col items-center gap-1">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Find this time
        </p>
        <p className="text-5xl font-black text-gray-800 tabular-nums bg-gray-100 rounded-2xl px-6 py-2">
          {exercise.digitalTime}
        </p>
      </div>

      {/* 2×2 grid of clocks */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            disabled={answered}
            className={cn(
              "flex items-center justify-center p-3 rounded-2xl bg-white transition-all duration-200 cursor-pointer",
              getBorderClass(i),
              answered && "cursor-default"
            )}
          >
            <AnalogClock
              hour={opt.hour}
              minute={opt.minute}
              size={120}
              showNumbers={false}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
