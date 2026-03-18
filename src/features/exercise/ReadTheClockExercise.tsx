"use client";

import { useState } from "react";
import { AnalogClock } from "@/features/clock/AnalogClock";
import { AnswerChoiceButton } from "./AnswerChoiceButton";
import type { ReadClockExercise as ReadClockExerciseType } from "@/lib/exercise/types";

interface Props {
  exercise: ReadClockExerciseType;
  onAnswer: (correct: boolean) => void;
}

export function ReadTheClockExercise({ exercise, onAnswer }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  function handleSelect(index: number) {
    if (answered) return;
    setSelectedIndex(index);
    setAnswered(true);
    const correct = index === exercise.correctIndex;
    setTimeout(() => onAnswer(correct), 600);
  }

  function getButtonState(index: number) {
    if (!answered) return selectedIndex === index ? "selected" : "default";
    if (index === exercise.correctIndex) return "correct";
    if (index === selectedIndex) return "wrong";
    return "default";
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Scenario */}
      <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl px-6 py-4 text-center max-w-sm">
        <p className="text-lg font-bold text-purple-800">{exercise.scenario}</p>
      </div>

      {/* Clock */}
      <AnalogClock
        hour={exercise.targetHour}
        minute={exercise.targetMinute}
        size={220}
      />

      {/* Choices */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {exercise.options.map((opt, i) => (
          <AnswerChoiceButton
            key={i}
            label={opt}
            onClick={() => handleSelect(i)}
            state={getButtonState(i)}
            disabled={answered}
          />
        ))}
      </div>
    </div>
  );
}
