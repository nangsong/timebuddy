"use client";

import { useState, useCallback, useEffect } from "react";
import type { Exercise, DifficultyLevel } from "@/lib/exercise/types";
import { generateExerciseBatch } from "@/lib/exercise/generator";
import { parseAIExercises } from "@/lib/exercise/aiParser";

interface UseExerciseReturn {
  exercises: Exercise[];
  loading: boolean;
  error: string | null;
  regenerate: () => void;
}

export function useExercise(level: DifficultyLevel, count = 6): UseExerciseReturn {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExercises = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const res = await fetch("/api/generate-exercise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level, count }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (res.status === 503) {
        // No API key — fall back silently
        throw new Error("no_api_key");
      }

      if (!res.ok) throw new Error("api_error");

      const data = await res.json();
      const parsed = parseAIExercises(data.exercises ?? []);

      if (parsed.length >= 3) {
        setExercises(parsed);
      } else {
        // Not enough valid exercises, use local
        setExercises(generateExerciseBatch(level, count));
      }
    } catch {
      // Fallback to local generator
      setExercises(generateExerciseBatch(level, count));
    } finally {
      setLoading(false);
    }
  }, [level, count]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  return { exercises, loading, error, regenerate: fetchExercises };
}
