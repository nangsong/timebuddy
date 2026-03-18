import type { TimeValue, DifficultyLevel } from "./types";

const VALID_MINUTES: Record<DifficultyLevel, number[]> = {
  1: [0],
  2: [0, 30],
  3: [0, 15, 30, 45],
  4: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
  5: Array.from({ length: 60 }, (_, i) => i),
};

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateDistractors(
  correct: TimeValue,
  level: DifficultyLevel,
  count = 3
): TimeValue[] {
  const distractors: TimeValue[] = [];
  const validMins = VALID_MINUTES[level];
  let attempts = 0;

  while (distractors.length < count && attempts < 100) {
    attempts++;
    const h = Math.floor(Math.random() * 12) + 1;
    const m = randomChoice(validMins);
    const isDuplicate =
      (h === correct.hour && m === correct.minute) ||
      distractors.some((d) => d.hour === h && d.minute === m);
    if (!isDuplicate) distractors.push({ hour: h, minute: m });
  }
  return distractors;
}
