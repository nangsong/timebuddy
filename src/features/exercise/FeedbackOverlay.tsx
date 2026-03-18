"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, RefreshCw } from "lucide-react";
import { Confetti } from "./Confetti";

const CORRECT_MESSAGES = [
  "Amazing! ⭐",
  "You got it! 🎉",
  "Super smart! 🌟",
  "Fantastic! ✨",
  "Brilliant! 🏆",
  "Yes! That's right! 🎈",
  "Wow, you're great! 🌈",
];

const WRONG_MESSAGES = [
  "Oops! Almost there!",
  "Not quite — try the next one!",
  "Good try! You'll get the next one!",
  "Keep going — you're learning!",
  "Close! Let's try another!",
];

interface FeedbackOverlayProps {
  show: boolean;
  isCorrect: boolean;
  onDismiss: () => void;
}

export function FeedbackOverlay({ show, isCorrect, onDismiss }: FeedbackOverlayProps) {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onDismiss, 1800);
    return () => clearTimeout(timer);
  }, [show, onDismiss]);

  const message = isCorrect
    ? CORRECT_MESSAGES[Math.floor(Math.random() * CORRECT_MESSAGES.length)]
    : WRONG_MESSAGES[Math.floor(Math.random() * WRONG_MESSAGES.length)];

  return (
    <>
      <Confetti active={show && isCorrect} />
      <AnimatePresence>
        {show && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <div
              className={
                isCorrect
                  ? "absolute inset-0 bg-green-500/20 backdrop-blur-[2px]"
                  : "absolute inset-0 bg-orange-400/20 backdrop-blur-[2px]"
              }
            />
            {/* Card */}
            <motion.div
              className={`relative z-10 rounded-3xl px-10 py-8 shadow-2xl flex flex-col items-center gap-4 ${
                isCorrect ? "bg-green-500" : "bg-orange-400"
              }`}
              initial={{ scale: 0.5, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {isCorrect ? (
                <Star className="w-16 h-16 fill-yellow-300 text-yellow-300" />
              ) : (
                <RefreshCw className="w-14 h-14 text-white" />
              )}
              <p className="text-3xl font-black text-white text-center leading-tight">
                {message}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
