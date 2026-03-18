"use client";

import { cn } from "@/lib/utils";

type ButtonState = "default" | "correct" | "wrong" | "selected";

interface AnswerChoiceButtonProps {
  label: string;
  onClick: () => void;
  state?: ButtonState;
  disabled?: boolean;
}

const stateClasses: Record<ButtonState, string> = {
  default:
    "bg-white border-2 border-gray-200 text-gray-800 hover:border-purple-400 hover:bg-purple-50 hover:scale-105 active:scale-95",
  selected:
    "bg-purple-100 border-2 border-purple-500 text-purple-800 scale-105",
  correct:
    "bg-green-500 border-2 border-green-600 text-white scale-110 shadow-lg shadow-green-200",
  wrong:
    "bg-red-400 border-2 border-red-500 text-white animate-[shake_0.4s_ease-in-out]",
};

export function AnswerChoiceButton({
  label,
  onClick,
  state = "default",
  disabled = false,
}: AnswerChoiceButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full min-h-16 rounded-2xl px-4 py-3 text-xl font-bold transition-all duration-200 shadow-sm",
        stateClasses[state],
        disabled && "opacity-70 cursor-not-allowed pointer-events-none"
      )}
    >
      {label}
    </button>
  );
}
