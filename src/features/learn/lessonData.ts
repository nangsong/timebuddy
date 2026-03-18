export interface LessonStep {
  id: string;
  title: string;
  body: string;
  clockConfig: {
    hour: number;
    minute: number;
    animated?: boolean;
    highlightHand?: "hour" | "minute" | null;
    pulseHand?: "hour" | "minute" | null;
    showSeconds?: boolean;
  };
  interactive?: boolean;
  interactiveTarget?: { hour: number; minute: number };
  interactivePrompt?: string;
  tip?: string;
}

export const LESSON_STEPS: LessonStep[] = [
  {
    id: "welcome",
    title: "Welcome to the Clock! 🕐",
    body: "A clock helps us tell what time it is. Clocks have hands that move around — just like magic!",
    clockConfig: { hour: 3, minute: 0, showSeconds: true },
  },
  {
    id: "two-hands",
    title: "Meet the Two Hands",
    body: "Look carefully at the clock. Can you see two hands? One is SHORT and one is LONG.",
    clockConfig: { hour: 3, minute: 0 },
    tip: "The hands point to numbers to tell us the time!",
  },
  {
    id: "hour-hand",
    title: "The Short Hand ⏰",
    body: "The SHORT hand is called the HOUR HAND. It tells us which HOUR it is. Right now it points to 3!",
    clockConfig: { hour: 3, minute: 0, highlightHand: "hour", pulseHand: "hour" },
    tip: "SHORT hand = HOURS. Think: short word, short hand!",
  },
  {
    id: "minute-hand",
    title: "The Long Hand ⏱",
    body: "The LONG hand is called the MINUTE HAND. When the long hand points straight UP to 12, it means zero minutes — it's exactly on the hour!",
    clockConfig: { hour: 3, minute: 0, highlightHand: "minute", pulseHand: "minute" },
    tip: "LONG hand = MINUTES. Think: long word, long hand!",
  },
  {
    id: "read-3-oclock",
    title: "3 O'Clock!",
    body: "Short hand → 3. Long hand → 12. This is THREE O'CLOCK! We write it as 3:00.",
    clockConfig: { hour: 3, minute: 0 },
  },
  {
    id: "read-6-oclock",
    title: "6 O'Clock!",
    body: "Now the short hand moved to 6. Long hand still at 12. This is SIX O'CLOCK — 6:00! Can you tell what the time is?",
    clockConfig: { hour: 6, minute: 0, animated: true },
  },
  {
    id: "hours-parade",
    title: "All the O'Clocks!",
    body: "The short hand travels through all 12 numbers in one day. Each number is one hour. Let's watch it move!",
    clockConfig: { hour: 1, minute: 0, animated: true, highlightHand: "hour" },
  },
  {
    id: "half-past-intro",
    title: "Half Past — What's That?",
    body: "When the long hand points DOWN to 6, it means 30 minutes have passed. We call this HALF PAST! The clock shows 30 minutes.",
    clockConfig: { hour: 3, minute: 30, animated: true, highlightHand: "minute" },
    tip: "Long hand pointing DOWN = 30 minutes!",
  },
  {
    id: "half-past-example",
    title: "3:30 — Half Past Three!",
    body: "Short hand between 3 and 4. Long hand pointing down at 6. This is 3:30 — we say 'half past three!'",
    clockConfig: { hour: 3, minute: 30 },
  },
  {
    id: "try-3-oclock",
    title: "Your Turn! Set 3:00 ✋",
    body: "Drag the SHORT hand to point at the 3, and make sure the LONG hand points at 12!",
    clockConfig: { hour: 12, minute: 0 },
    interactive: true,
    interactiveTarget: { hour: 3, minute: 0 },
    interactivePrompt: "Drag the short hand to 3!",
  },
  {
    id: "try-half-past",
    title: "Your Turn! Set 6:30 ✋",
    body: "Now try to set the clock to 6:30. Short hand to 6, long hand pointing down!",
    clockConfig: { hour: 12, minute: 0 },
    interactive: true,
    interactiveTarget: { hour: 6, minute: 30 },
    interactivePrompt: "Drag to show 6:30!",
  },
  {
    id: "ready",
    title: "You're Ready! 🌟",
    body: "Wow — you learned how to read a clock! Short hand = hours, long hand = minutes. Now let's practice with some fun exercises!",
    clockConfig: { hour: 12, minute: 0, showSeconds: true },
  },
];
