export type ExerciseType = "read_clock" | "set_clock" | "match_clock";

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export interface TimeValue {
  hour: number; // 1–12
  minute: number; // 0–59
}

export interface ReadClockExercise {
  type: "read_clock";
  targetHour: number;
  targetMinute: number;
  scenario: string;
  options: string[]; // 4 formatted time strings
  correctIndex: number; // index of correct answer in options[]
}

export interface SetClockExercise {
  type: "set_clock";
  targetHour: number;
  targetMinute: number;
  scenario: string;
}

export interface MatchClockExercise {
  type: "match_clock";
  targetHour: number;
  targetMinute: number;
  digitalTime: string;
  scenario: string;
  distractors: TimeValue[]; // 3 wrong clocks
}

export type Exercise = ReadClockExercise | SetClockExercise | MatchClockExercise;

export interface Progress {
  level: DifficultyLevel;
  totalStars: number;
  sessionsCompleted: number;
  lastPlayedAt: string | null;
}
