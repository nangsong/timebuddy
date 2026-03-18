"use client";

import { cn } from "@/lib/utils";
import type { DifficultyLevel } from "@/lib/exercise/types";

const LEVELS: Array<{ level: DifficultyLevel; name: string; desc: string; emoji: string }> = [
  { level: 1, name: "O'Clock", desc: "1:00, 2:00...", emoji: "🕐" },
  { level: 2, name: "Half Past", desc: "1:30, 3:30...", emoji: "🕧" },
  { level: 3, name: "Quarter Hours", desc: ":15 and :45", emoji: "🕒" },
  { level: 4, name: "5 Minutes", desc: "Any 5-min mark", emoji: "🕑" },
  { level: 5, name: "Any Time", desc: "All minutes!", emoji: "⏱" },
];

interface LevelSelectorProps {
  selected: DifficultyLevel;
  onSelect: (level: DifficultyLevel) => void;
}

export function LevelSelector({ selected, onSelect }: LevelSelectorProps) {
  return (
    <div className="flex flex-col gap-3 w-full max-w-sm">
      {LEVELS.map(({ level, name, desc, emoji }) => (
        <button
          key={level}
          onClick={() => onSelect(level)}
          className={cn(
            "flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left transition-all duration-200 font-bold",
            selected === level
              ? "border-purple-500 bg-purple-50 shadow-md scale-[1.02]"
              : "border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50 hover:scale-[1.01]"
          )}
        >
          <span className="text-2xl">{emoji}</span>
          <div className="flex-1">
            <p className={cn("text-base font-black", selected === level ? "text-purple-800" : "text-gray-800")}>
              Level {level}: {name}
            </p>
            <p className="text-sm font-semibold text-gray-500">{desc}</p>
          </div>
          {selected === level && (
            <div className="w-3 h-3 rounded-full bg-purple-500 flex-shrink-0" />
          )}
        </button>
      ))}
    </div>
  );
}
