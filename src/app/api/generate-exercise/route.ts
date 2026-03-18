import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import type { DifficultyLevel } from "@/lib/exercise/types";

const LEVEL_DESC: Record<DifficultyLevel, string> = {
  1: "only whole hours (1:00, 2:00, ... 12:00) — targetMinute must always be 0",
  2: "only half-hours — targetMinute must be 0 or 30",
  3: "quarter-hours — targetMinute must be 0, 15, 30, or 45",
  4: "5-minute marks — targetMinute must be 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, or 55",
  5: "any time — targetMinute can be 0–59",
};

function buildPrompt(level: DifficultyLevel, count: number): string {
  return `You are creating clock-reading exercises for Grade 1 children aged 6-7.
Generate exactly ${count} exercises. Each exercise alternates between types in this order:
read_clock, set_clock, match_clock, read_clock, set_clock, match_clock, ...

Difficulty level ${level}: ${LEVEL_DESC[level]}

Return ONLY a valid JSON array. No markdown, no commentary, no extra text — just the JSON array.

Each object must exactly match one of these schemas:

read_clock:
{
  "type": "read_clock",
  "targetHour": <integer 1-12>,
  "targetMinute": <integer, must follow level rules above>,
  "scenario": "<fun 1-sentence story for a child, e.g. The school bus leaves at this time!>",
  "options": ["H:MM", "H:MM", "H:MM", "H:MM"]
}
The options array must have exactly 4 strings. Exactly one must equal the correct time formatted as H:MM.
Example: if targetHour=3 and targetMinute=0, one option must be "3:00". The other 3 must be different valid times for this level.

set_clock:
{
  "type": "set_clock",
  "targetHour": <integer 1-12>,
  "targetMinute": <integer, must follow level rules above>,
  "scenario": "<fun instruction, e.g. The soccer game starts at 3:00. Set the clock!>"
}

match_clock:
{
  "type": "match_clock",
  "targetHour": <integer 1-12>,
  "targetMinute": <integer, must follow level rules above>,
  "digitalTime": "<H:MM format, matching targetHour:targetMinute>",
  "scenario": "<fun instruction, e.g. Find the clock that shows snack time!>"
}

Rules:
- targetHour must be 1–12 (inclusive)
- targetMinute must follow the level restriction above
- For read_clock: exactly one option must be the correct time in H:MM format (e.g. "3:00" not "03:00")
- For match_clock: digitalTime must exactly equal H:MM of targetHour:targetMinute
- Scenarios must be cheerful and relatable to Grade 1 life (school, snacks, cartoons, bedtime, sports, birthday parties)
- Vary the scenarios — don't repeat the same scenario

Return ONLY the JSON array, starting with [ and ending with ].`;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const level = (body.level ?? 1) as DifficultyLevel;
  const count = Math.min(Number(body.count ?? 6), 12);

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "no_api_key" }, { status: 503 });
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const msg = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      messages: [{ role: "user", content: buildPrompt(level, count) }],
    });

    const text =
      msg.content[0].type === "text" ? msg.content[0].text.trim() : "";

    // Extract JSON array from response
    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");
    if (start === -1 || end === -1) {
      return NextResponse.json({ error: "parse_failed", raw: text }, { status: 500 });
    }

    const exercises = JSON.parse(text.slice(start, end + 1));
    return NextResponse.json({ exercises });
  } catch (err) {
    console.error("AI exercise generation failed:", err);
    return NextResponse.json({ error: "generation_failed" }, { status: 500 });
  }
}
