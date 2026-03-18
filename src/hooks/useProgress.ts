"use client";

import { useState, useCallback } from "react";
import type { Progress, DifficultyLevel } from "@/lib/exercise/types";

const STORAGE_KEY = "timebuddy_progress";

const DEFAULT_PROGRESS: Progress = {
  level: 1,
  totalStars: 0,
  sessionsCompleted: 0,
  lastPlayedAt: null,
};

function readProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

function writeProgress(p: Progress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // ignore storage errors
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(() => {
    if (typeof window === "undefined") return { ...DEFAULT_PROGRESS };
    return readProgress();
  });

  const setLevel = useCallback((level: DifficultyLevel) => {
    setProgress((prev) => {
      const next = { ...prev, level };
      writeProgress(next);
      return next;
    });
  }, []);

  const addStar = useCallback(() => {
    setProgress((prev) => {
      const next = { ...prev, totalStars: prev.totalStars + 1 };
      writeProgress(next);
      return next;
    });
  }, []);

  const completeSession = useCallback(() => {
    setProgress((prev) => {
      const next = {
        ...prev,
        sessionsCompleted: prev.sessionsCompleted + 1,
        lastPlayedAt: new Date().toISOString(),
      };
      writeProgress(next);
      return next;
    });
  }, []);

  const resetProgress = useCallback(() => {
    const next = { ...DEFAULT_PROGRESS };
    writeProgress(next);
    setProgress(next);
  }, []);

  return { progress, setLevel, addStar, completeSession, resetProgress };
}
