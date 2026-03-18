"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ClockFace } from "./ClockFace";
import {
  hourAngle,
  minuteAngle,
  secondAngle,
  positionToAngle,
  snapMinuteAngle,
  snapHourAngle,
  angleToMinute,
  angleToHour,
} from "./clockUtils";
import type { DifficultyLevel } from "@/lib/exercise/types";

interface AnalogClockProps {
  hour?: number;
  minute?: number;
  second?: number;
  /** If true, user can drag the hands */
  interactive?: boolean;
  level?: DifficultyLevel;
  onTimeChange?: (hour: number, minute: number) => void;
  size?: number;
  showNumbers?: boolean;
  /** Highlight a hand for teaching mode */
  highlightHand?: "hour" | "minute" | null;
  /** Pulse animation on a hand */
  pulseHand?: "hour" | "minute" | null;
  className?: string;
}

export function AnalogClock({
  hour = 12,
  minute = 0,
  second,
  interactive = false,
  level = 1,
  onTimeChange,
  size = 220,
  showNumbers = true,
  highlightHand = null,
  pulseHand = null,
  className,
}: AnalogClockProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef<"hour" | "minute" | null>(null);

  // Interactive state — initialized from props
  const [interactiveHourAngle, setInteractiveHourAngle] = useState(() =>
    hourAngle(hour, minute)
  );
  const [interactiveMinuteAngle, setInteractiveMinuteAngle] = useState(() =>
    minuteAngle(minute)
  );

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.44;

  // Derived display angles
  const displayHourAngle = interactive ? interactiveHourAngle : hourAngle(hour, minute);
  const displayMinuteAngle = interactive ? interactiveMinuteAngle : minuteAngle(minute);
  const displaySecondAngle = second !== undefined ? secondAngle(second) : null;

  // ── Arrow hand path builder ──────────────────────────────────────────
  // Arrow shape pointing UP (toward 12 o'clock) at 0°.
  // Origin at (cx, cy). Rotation applied by parent motion.g.
  //
  //          tip (cx, cy-len)
  //           /\
  //          /  \          ← arrowhead
  // (cx-aw, cy-ab)  (cx+aw, cy-ab)
  //      |  shaft  |
  // (cx-sw, cy+tail)  (cx+sw, cy+tail)  ← counterweight
  //
  function arrowHandPath(len: number, tail: number, sw: number, aw: number, ab: number): string {
    return [
      `M ${cx - sw} ${cy + tail}`,
      `L ${cx - sw} ${cy - ab}`,
      `L ${cx - aw} ${cy - ab}`,
      `L ${cx}      ${cy - len}`,
      `L ${cx + aw} ${cy - ab}`,
      `L ${cx + sw} ${cy - ab}`,
      `L ${cx + sw} ${cy + tail}`,
      "Z",
    ].join(" ");
  }

  // Hour hand — short, thick, wide arrowhead
  const hourHandPath = arrowHandPath(
    r * 0.56,     // tip length from center
    r * 0.14,     // counterweight tail
    size * 0.030, // shaft half-width
    size * 0.052, // arrowhead half-width
    r * 0.38      // where arrowhead starts
  );

  // Minute hand — long, slimmer shaft, narrower arrowhead
  const minuteHandPath = arrowHandPath(
    r * 0.82,     // tip length — significantly longer
    r * 0.17,     // counterweight tail
    size * 0.018, // shaft half-width (thinner than hour)
    size * 0.034, // arrowhead half-width
    r * 0.60      // arrowhead starts further out
  );

  function getAngleFromPointer(e: React.PointerEvent): number {
    if (!svgRef.current) return 0;
    const rect = svgRef.current.getBoundingClientRect();
    const svgCx = rect.left + rect.width / 2;
    const svgCy = rect.top + rect.height / 2;
    return positionToAngle(e.clientX - svgCx, e.clientY - svgCy);
  }

  const handlePointerDown = useCallback(
    (hand: "hour" | "minute") => (e: React.PointerEvent<SVGElement>) => {
      if (!interactive) return;
      e.preventDefault();
      (e.currentTarget as SVGElement).setPointerCapture(e.pointerId);
      dragging.current = hand;
    },
    [interactive]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!dragging.current || !interactive) return;
      const rawAngle = getAngleFromPointer(e);

      if (dragging.current === "minute") {
        if (level === 1) return; // minute locked in level 1
        const snapped = snapMinuteAngle(rawAngle, level);
        setInteractiveMinuteAngle(snapped);
        // Update hour hand to follow minute
        const newMinute = angleToMinute(snapped);
        const currentHour = angleToHour(interactiveHourAngle);
        const newHourAngle = hourAngle(currentHour, newMinute);
        setInteractiveHourAngle(newHourAngle);
        onTimeChange?.(currentHour, newMinute);
      } else {
        const snapped = snapHourAngle(rawAngle);
        setInteractiveHourAngle(snapped);
        const newHour = angleToHour(snapped);
        const currentMinute = level === 1 ? 0 : angleToMinute(interactiveMinuteAngle);
        onTimeChange?.(newHour, currentMinute);
      }
    },
    [interactive, level, interactiveHourAngle, interactiveMinuteAngle, onTimeChange]
  );

  const handlePointerUp = useCallback(() => {
    dragging.current = null;
  }, []);

  const hourOpacity = highlightHand === "minute" ? 0.3 : 1;
  const minuteOpacity = highlightHand === "hour" ? 0.3 : 1;
  const hourColor =
    highlightHand === "hour" || pulseHand === "hour"
      ? "var(--highlight-hand)"
      : "var(--hour-hand)";
  const minuteColor =
    highlightHand === "minute" || pulseHand === "minute"
      ? "var(--highlight-hand)"
      : "var(--minute-hand)";

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={{ touchAction: "none", userSelect: "none" }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <ClockFace size={size} showNumbers={showNumbers} />

      {/* Hour hand */}
      <motion.g
        style={{ cursor: interactive ? "grab" : "default", transformOrigin: `${cx}px ${cy}px` }}
        animate={
          pulseHand === "hour"
            ? { rotate: displayHourAngle, scale: [1, 1.05, 1] }
            : { rotate: displayHourAngle }
        }
        transition={
          pulseHand === "hour"
            ? { scale: { repeat: Infinity, duration: 1.4 } }
            : interactive
            ? { duration: 0 }
            : { type: "spring", stiffness: 50, damping: 18 }
        }
        opacity={hourOpacity}
        onPointerDown={handlePointerDown("hour")}
      >
        <path
          d={hourHandPath}
          fill={hourColor}
          style={{ filter: highlightHand === "hour" || pulseHand === "hour" ? "drop-shadow(0 0 8px var(--highlight-hand))" : undefined }}
        />
      </motion.g>

      {/* Minute hand */}
      <motion.g
        style={{ cursor: interactive && level > 1 ? "grab" : "default", transformOrigin: `${cx}px ${cy}px` }}
        animate={
          pulseHand === "minute"
            ? { rotate: displayMinuteAngle, scale: [1, 1.05, 1] }
            : { rotate: displayMinuteAngle }
        }
        transition={
          pulseHand === "minute"
            ? { scale: { repeat: Infinity, duration: 1.4 } }
            : interactive
            ? { duration: 0 }
            : { type: "spring", stiffness: 50, damping: 18 }
        }
        opacity={minuteOpacity}
        onPointerDown={handlePointerDown("minute")}
      >
        <path
          d={minuteHandPath}
          fill={minuteColor}
          style={{ filter: highlightHand === "minute" || pulseHand === "minute" ? "drop-shadow(0 0 8px var(--highlight-hand))" : undefined }}
        />
      </motion.g>

      {/* Second hand */}
      {displaySecondAngle !== null && (
        <motion.g
          style={{ transformOrigin: `${cx}px ${cy}px` }}
          animate={{ rotate: displaySecondAngle }}
          transition={{ duration: 0 }}
        >
          <line
            x1={cx}
            y1={cy + r * 0.15}
            x2={cx}
            y2={cy - r * 0.85}
            stroke="var(--second-hand)"
            strokeWidth={size * 0.012}
            strokeLinecap="round"
          />
        </motion.g>
      )}

      {/* Center dot (on top of everything) */}
      <circle cx={cx} cy={cy} r={size * 0.028} fill="var(--clock-border)" />
    </svg>
  );
}
