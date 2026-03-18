"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { LESSON_STEPS } from "./lessonData";
import { LessonStep } from "./LessonStep";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";

export function LearnSession() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [interactiveUnlocked, setInteractiveUnlocked] = useState(false);

  const step = LESSON_STEPS[currentIndex];
  const isLast = currentIndex === LESSON_STEPS.length - 1;
  const isInteractive = step.interactive && !interactiveUnlocked;

  function goNext() {
    if (isLast) {
      router.push("/practice?level=1");
      return;
    }
    setInteractiveUnlocked(false);
    setDirection(1);
    setCurrentIndex((i) => i + 1);
  }

  function goPrev() {
    if (currentIndex === 0) return;
    setInteractiveUnlocked(false);
    setDirection(-1);
    setCurrentIndex((i) => i - 1);
  }

  function handleInteractiveSuccess() {
    setInteractiveUnlocked(true);
  }

  const canAdvance = !step.interactive || interactiveUnlocked;

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
      {/* Step dots */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        {LESSON_STEPS.map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i === currentIndex
                ? "w-5 h-3 bg-purple-500"
                : i < currentIndex
                ? "w-2.5 h-2.5 bg-purple-300"
                : "w-2.5 h-2.5 bg-gray-200"
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-bold text-gray-400">
          {currentIndex + 1}/{LESSON_STEPS.length}
        </span>
      </div>

      {/* Lesson content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step.id}
          custom={direction}
          variants={{
            enter: (d: number) => ({ opacity: 0, x: d * 40 }),
            center: { opacity: 1, x: 0 },
            exit: (d: number) => ({ opacity: 0, x: d * -40 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <LessonStep step={step} onInteractiveSuccess={handleInteractiveSuccess} />
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3 mt-2">
        {currentIndex > 0 ? (
          <button
            onClick={goPrev}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 font-bold px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" /> Back
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={goNext}
          disabled={!canAdvance}
          className={`flex items-center gap-2 rounded-2xl px-6 py-3 text-lg font-black transition-all shadow-md ${
            canAdvance
              ? isLast
                ? "bg-green-500 text-white hover:bg-green-600 hover:scale-105 active:scale-95"
                : "bg-purple-500 text-white hover:bg-purple-600 hover:scale-105 active:scale-95"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isLast ? (
            <>
              Start Practicing! <Zap className="w-5 h-5" />
            </>
          ) : (
            <>
              Next <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>

      {/* Interactive hint */}
      {step.interactive && !interactiveUnlocked && (
        <p className="text-center text-sm text-gray-400 font-semibold">
          Complete the exercise above to continue!
        </p>
      )}
    </div>
  );
}
