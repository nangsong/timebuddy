"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AnalogClock } from "@/features/clock/AnalogClock";
import { isTimeCorrect, formatTime } from "@/features/clock/clockUtils";
import type { LessonStep as LessonStepType } from "./lessonData";
import type { DifficultyLevel } from "@/lib/exercise/types";

interface LessonStepProps {
  step: LessonStepType;
  onInteractiveSuccess?: () => void;
}

export function LessonStep({ step, onInteractiveSuccess }: LessonStepProps) {
  const [interactiveHour, setInteractiveHour] = useState(12);
  const [interactiveMinute, setInteractiveMinute] = useState(0);
  const [interactiveSuccess, setInteractiveSuccess] = useState(false);
  const [second, setSecond] = useState<number | undefined>(undefined);

  // Live second hand for steps with showSeconds
  useEffect(() => {
    if (!step.clockConfig.showSeconds) {
      setSecond(undefined);
      return;
    }
    const update = () => setSecond(new Date().getSeconds());
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [step.clockConfig.showSeconds]);

  // Reset interactive state when step changes
  useEffect(() => {
    setInteractiveHour(12);
    setInteractiveMinute(0);
    setInteractiveSuccess(false);
  }, [step.id]);

  function handleTimeChange(hour: number, minute: number) {
    setInteractiveHour(hour);
    setInteractiveMinute(minute);

    if (step.interactiveTarget) {
      const match = isTimeCorrect(
        hour,
        minute,
        step.interactiveTarget.hour,
        step.interactiveTarget.minute,
        5 // generous tolerance for learning mode
      );
      if (match && !interactiveSuccess) {
        setInteractiveSuccess(true);
        setTimeout(() => onInteractiveSuccess?.(), 600);
      }
    }
  }

  // For animated parade step — cycle through hours
  const [paradeHour, setParadeHour] = useState(1);
  useEffect(() => {
    if (step.id !== "hours-parade") return;
    const id = setInterval(() => {
      setParadeHour((h) => (h % 12) + 1);
    }, 900);
    return () => clearInterval(id);
  }, [step.id]);

  const clockHour = step.id === "hours-parade" ? paradeHour : step.clockConfig.hour;

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {/* Step title */}
      <motion.h2
        className="text-2xl sm:text-3xl font-black text-gray-800 text-center leading-tight"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {step.title}
      </motion.h2>

      {/* Clock */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.15 }}
      >
        <AnalogClock
          hour={clockHour}
          minute={step.interactive ? interactiveMinute : step.clockConfig.minute}
          second={second}
          interactive={step.interactive}
          level={step.id === "try-half-past" ? 2 : 1}
          onTimeChange={handleTimeChange}
          size={230}
          highlightHand={step.clockConfig.highlightHand}
          pulseHand={step.clockConfig.pulseHand}
        />
      </motion.div>

      {/* Interactive feedback */}
      {step.interactive && (
        <motion.div
          className={`rounded-2xl px-5 py-3 text-center font-bold text-lg ${
            interactiveSuccess
              ? "bg-green-100 text-green-700 border-2 border-green-300"
              : "bg-purple-50 text-purple-700 border-2 border-purple-200"
          }`}
          animate={interactiveSuccess ? { scale: [1, 1.08, 1] } : {}}
          transition={{ duration: 0.4 }}
        >
          {interactiveSuccess
            ? "✅ Perfect! Great job!"
            : step.interactivePrompt ?? "Drag the hands!"}
        </motion.div>
      )}

      {/* Interactive current time display */}
      {step.interactive && !interactiveSuccess && (
        <p className="text-xl font-bold text-gray-500 tabular-nums">
          Clock shows: {formatTime(interactiveHour, interactiveMinute)}
        </p>
      )}

      {/* Body text */}
      <motion.div
        className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-100 max-w-sm text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-lg font-semibold text-gray-700 leading-relaxed">{step.body}</p>
      </motion.div>

      {/* Tip */}
      {step.tip && (
        <motion.div
          className="bg-yellow-50 border-2 border-yellow-200 rounded-xl px-5 py-3 max-w-sm text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <p className="text-sm font-bold text-yellow-800">💡 {step.tip}</p>
        </motion.div>
      )}
    </div>
  );
}
