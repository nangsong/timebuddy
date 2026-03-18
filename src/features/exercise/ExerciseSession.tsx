"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReadTheClockExercise } from "./ReadTheClockExercise";
import { SetTheClockExercise } from "./SetTheClockExercise";
import { MatchTheClockExercise } from "./MatchTheClockExercise";
import { FeedbackOverlay } from "./FeedbackOverlay";
import { ProgressBar } from "./ProgressBar";
import { useExercise } from "@/hooks/useExercise";
import { useSound } from "@/hooks/useSound";
import { useProgress } from "@/hooks/useProgress";
import type { DifficultyLevel } from "@/lib/exercise/types";
import { Clock, RotateCcw, ChevronRight } from "lucide-react";

type SessionStatus = "loading" | "in_progress" | "feedback" | "complete";

interface ExerciseSessionProps {
  level: DifficultyLevel;
}

export function ExerciseSession({ level }: ExerciseSessionProps) {
  const { exercises, loading, regenerate } = useExercise(level, 6);
  const { play } = useSound();
  const { addStar, completeSession } = useProgress();

  const [status, setStatus] = useState<SessionStatus>("loading");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [starsEarned, setStarsEarned] = useState(0);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [key, setKey] = useState(0); // force re-mount exercise on advance

  // Start session when exercises load
  const totalExercises = exercises.length;
  if (!loading && status === "loading" && totalExercises > 0) {
    setStatus("in_progress");
  }

  const handleAnswer = useCallback(
    (correct: boolean) => {
      setLastCorrect(correct);
      if (correct) {
        play("correct");
        addStar();
        setStarsEarned((s) => s + 1);
      } else {
        play("wrong");
      }
      setStatus("feedback");
    },
    [play, addStar]
  );

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= totalExercises) {
      completeSession();
      if (starsEarned + (lastCorrect ? 0 : 0) >= totalExercises * 0.8) {
        play("levelup");
      }
      setStatus("complete");
    } else {
      setCurrentIndex((i) => i + 1);
      setKey((k) => k + 1);
      setStatus("in_progress");
    }
  }, [currentIndex, totalExercises, completeSession, starsEarned, lastCorrect, play]);

  const handleRestart = useCallback(() => {
    setStatus("loading");
    setCurrentIndex(0);
    setStarsEarned(0);
    setKey(0);
    regenerate();
    setTimeout(() => setStatus("in_progress"), 100);
  }, [regenerate]);

  if (loading || status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Clock className="w-12 h-12 text-purple-400" />
        </motion.div>
        <p className="text-xl font-bold text-gray-500">Getting your exercises ready...</p>
      </div>
    );
  }

  if (status === "complete") {
    const percentage = Math.round((starsEarned / totalExercises) * 100);
    return (
      <motion.div
        className="flex flex-col items-center gap-6 py-8 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-6xl">
          {percentage >= 80 ? "🏆" : percentage >= 50 ? "⭐" : "💪"}
        </div>
        <h2 className="text-3xl font-black text-gray-800">
          {percentage >= 80 ? "Amazing job!" : percentage >= 50 ? "Good work!" : "Keep practicing!"}
        </h2>
        <p className="text-xl font-bold text-gray-600">
          You got {starsEarned} out of {totalExercises} stars!
        </p>
        <ProgressBar starsEarned={starsEarned} total={totalExercises} />
        <button
          onClick={handleRestart}
          className="flex items-center gap-2 bg-purple-500 text-white rounded-2xl px-8 py-4 text-xl font-black hover:bg-purple-600 hover:scale-105 active:scale-95 transition-all shadow-lg mt-4"
        >
          <RotateCcw className="w-5 h-5" />
          Play Again!
        </button>
      </motion.div>
    );
  }

  const exercise = exercises[currentIndex];

  return (
    <div className="flex flex-col gap-5 w-full max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <ProgressBar starsEarned={starsEarned} total={totalExercises} />
        <span className="text-sm font-bold text-gray-400">
          {currentIndex + 1}/{totalExercises}
        </span>
      </div>

      {/* Exercise */}
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="w-full"
        >
          {exercise.type === "read_clock" && (
            <ReadTheClockExercise exercise={exercise} onAnswer={handleAnswer} />
          )}
          {exercise.type === "set_clock" && (
            <SetTheClockExercise exercise={exercise} level={level} onAnswer={handleAnswer} />
          )}
          {exercise.type === "match_clock" && (
            <MatchTheClockExercise exercise={exercise} level={level} onAnswer={handleAnswer} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Feedback overlay */}
      <FeedbackOverlay
        show={status === "feedback"}
        isCorrect={lastCorrect}
        onDismiss={handleNext}
      />

      {/* Skip button (small, secondary) */}
      {status === "in_progress" && (
        <button
          onClick={() => handleAnswer(false)}
          className="flex items-center justify-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors mt-2"
        >
          Skip <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
