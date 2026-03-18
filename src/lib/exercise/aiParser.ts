import type { Exercise, ReadClockExercise, SetClockExercise, MatchClockExercise } from "./types";
import { formatTime } from "@/features/clock/clockUtils";

function validHour(h: unknown): boolean {
  return typeof h === "number" && h >= 1 && h <= 12;
}

function validMinute(m: unknown): boolean {
  return typeof m === "number" && m >= 0 && m <= 59;
}

function parseReadClock(e: Record<string, unknown>): ReadClockExercise | null {
  if (!validHour(e.targetHour) || !validMinute(e.targetMinute)) return null;
  const options = Array.isArray(e.options) ? e.options : [];
  if (options.length !== 4) return null;

  const correctStr = formatTime(e.targetHour as number, e.targetMinute as number);
  const correctIndex = options.findIndex((o: unknown) => o === correctStr);
  if (correctIndex === -1) return null;

  return {
    type: "read_clock",
    targetHour: e.targetHour as number,
    targetMinute: e.targetMinute as number,
    scenario: typeof e.scenario === "string" ? e.scenario : "What time does the clock show?",
    options: options as string[],
    correctIndex,
  };
}

function parseSetClock(e: Record<string, unknown>): SetClockExercise | null {
  if (!validHour(e.targetHour) || !validMinute(e.targetMinute)) return null;
  return {
    type: "set_clock",
    targetHour: e.targetHour as number,
    targetMinute: e.targetMinute as number,
    scenario: typeof e.scenario === "string" ? e.scenario : "Set the clock!",
  };
}

function parseMatchClock(e: Record<string, unknown>): MatchClockExercise | null {
  if (!validHour(e.targetHour) || !validMinute(e.targetMinute)) return null;
  return {
    type: "match_clock",
    targetHour: e.targetHour as number,
    targetMinute: e.targetMinute as number,
    digitalTime: formatTime(e.targetHour as number, e.targetMinute as number),
    scenario: typeof e.scenario === "string" ? e.scenario : "Find the matching clock!",
    distractors: [],
  };
}

export function parseAIExercises(raw: unknown[]): Exercise[] {
  const results: Exercise[] = [];

  for (const item of raw) {
    try {
      if (!item || typeof item !== "object") continue;
      const e = item as Record<string, unknown>;

      if (e.type === "read_clock") {
        const parsed = parseReadClock(e);
        if (parsed) results.push(parsed);
      } else if (e.type === "set_clock") {
        const parsed = parseSetClock(e);
        if (parsed) results.push(parsed);
      } else if (e.type === "match_clock") {
        const parsed = parseMatchClock(e);
        if (parsed) results.push(parsed);
      }
    } catch {
      // skip malformed item
    }
  }

  return results;
}
