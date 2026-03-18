import type {
  DifficultyLevel,
  Exercise,
  ReadClockExercise,
  SetClockExercise,
  MatchClockExercise,
  TimeValue,
} from "./types";
import { formatTime } from "@/features/clock/clockUtils";

// Valid minutes per difficulty level
const VALID_MINUTES: Record<DifficultyLevel, number[]> = {
  1: [0],
  2: [0, 30],
  3: [0, 15, 30, 45],
  4: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
  5: Array.from({ length: 60 }, (_, i) => i),
};

const SCENARIOS_READ = [
  "The school bus leaves at this time! What time is it?",
  "Snack time is shown on the clock. What time is it?",
  "Recess starts when the clock shows this time!",
  "The class begins at what time?",
  "Bedtime is at this time. Can you read it?",
  "Lunchtime! What does the clock say?",
  "Story time starts at this time. Can you read the clock?",
  "PE class starts now! What time does the clock show?",
  "The park closes at this time. What time is it?",
  "Movie time! What time does the clock say?",
];

const SCENARIOS_SET = [
  "Your soccer game starts at {time}. Set the clock!",
  "It's time for your favourite cartoon at {time}. Move the hands!",
  "Dinner is at {time}. Show the time on the clock!",
  "School starts at {time}. Can you set the clock?",
  "Story time is at {time}. Set the hands!",
  "The birthday party starts at {time}. Set the clock!",
  "Swimming lessons are at {time}. Move the clock hands!",
  "Wake-up time is {time}. Can you set the clock?",
  "Playdate starts at {time}. Show it on the clock!",
  "Recess is at {time}. Set the clock!",
];

const SCENARIOS_MATCH = [
  "Find the clock that shows snack time!",
  "Which clock shows lunchtime?",
  "Find the clock that matches!",
  "Which clock shows the right time?",
  "Find the clock that shows recess time!",
  "Which clock shows bedtime?",
  "Find the clock that shows the bus time!",
];

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomTime(level: DifficultyLevel): TimeValue {
  const hour = Math.floor(Math.random() * 12) + 1;
  const minute = randomChoice(VALID_MINUTES[level]);
  return { hour, minute };
}

function generateDistractors(
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

export function generateReadClock(level: DifficultyLevel): ReadClockExercise {
  const correct = randomTime(level);
  const distractors = generateDistractors(correct, level, 3);
  const allOptions = [...distractors, correct];
  // Shuffle
  const shuffled = allOptions.sort(() => Math.random() - 0.5);
  const correctIndex = shuffled.findIndex(
    (o) => o.hour === correct.hour && o.minute === correct.minute
  );

  return {
    type: "read_clock",
    targetHour: correct.hour,
    targetMinute: correct.minute,
    scenario: randomChoice(SCENARIOS_READ),
    options: shuffled.map((o) => formatTime(o.hour, o.minute)),
    correctIndex,
  };
}

export function generateSetClock(level: DifficultyLevel): SetClockExercise {
  const t = randomTime(level);
  const timeStr = formatTime(t.hour, t.minute);
  const template = randomChoice(SCENARIOS_SET);
  return {
    type: "set_clock",
    targetHour: t.hour,
    targetMinute: t.minute,
    scenario: template.replace("{time}", timeStr),
  };
}

export function generateMatchClock(level: DifficultyLevel): MatchClockExercise {
  const correct = randomTime(level);
  return {
    type: "match_clock",
    targetHour: correct.hour,
    targetMinute: correct.minute,
    digitalTime: formatTime(correct.hour, correct.minute),
    scenario: randomChoice(SCENARIOS_MATCH),
    distractors: generateDistractors(correct, level, 3),
  };
}

/** Generate a mixed batch of exercises for a session. */
export function generateExerciseBatch(
  level: DifficultyLevel,
  count = 6
): Exercise[] {
  const sequence: Array<"read_clock" | "set_clock" | "match_clock"> = [
    "read_clock",
    "set_clock",
    "match_clock",
    "read_clock",
    "set_clock",
    "match_clock",
    "read_clock",
    "set_clock",
    "match_clock",
    "read_clock",
  ];

  return sequence.slice(0, count).map((type) => {
    if (type === "read_clock") return generateReadClock(level);
    if (type === "set_clock") return generateSetClock(level);
    return generateMatchClock(level);
  });
}
