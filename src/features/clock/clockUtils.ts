/**
 * Pure angle math for the analog clock.
 * All functions are side-effect free and unit-testable.
 */

/**
 * Hour hand angle in degrees (0° = 12 o'clock, clockwise).
 * The hour hand moves continuously — 0.5° per minute.
 */
export function hourAngle(hour: number, minute: number): number {
  return (hour % 12) * 30 + minute * 0.5;
}

/**
 * Minute hand angle in degrees.
 * 6° per minute.
 */
export function minuteAngle(minute: number): number {
  return minute * 6;
}

/**
 * Second hand angle in degrees.
 */
export function secondAngle(second: number): number {
  return second * 6;
}

/**
 * Snap granularity (degrees) per difficulty level for the minute hand.
 * Level 1: minute locked to 0, hour snaps every 30°
 * Level 2: minute snaps to 0° or 180° (0 or 30 min)
 * Level 3: minute snaps every 90° (0, 15, 30, 45 min)
 * Level 4: minute snaps every 30° (every 5 min)
 * Level 5: minute snaps every 6° (every 1 min)
 */
const MINUTE_SNAP_DEGREES: Record<number, number> = {
  1: 360, // effectively locked — always snaps to 0
  2: 180,
  3: 90,
  4: 30,
  5: 6,
};

/** Snap an angle (degrees) to nearest snap increment. */
export function snapAngle(rawAngleDeg: number, snapDeg: number): number {
  if (snapDeg <= 0) return 0;
  const normalized = ((rawAngleDeg % 360) + 360) % 360;
  return Math.round(normalized / snapDeg) * snapDeg;
}

export function snapMinuteAngle(rawAngleDeg: number, level: number): number {
  const snap = MINUTE_SNAP_DEGREES[level] ?? 6;
  return snapAngle(rawAngleDeg, snap);
}

export function snapHourAngle(rawAngleDeg: number): number {
  // Hour always snaps to nearest hour mark (30° increments)
  return snapAngle(rawAngleDeg, 30);
}

/**
 * Convert a pointer position (relative to clock center) to an angle.
 * 0° = 12 o'clock, increases clockwise.
 */
export function positionToAngle(x: number, y: number): number {
  const rawRad = Math.atan2(y, x);
  const rawDeg = (rawRad * 180) / Math.PI;
  const adjusted = rawDeg + 90;
  return ((adjusted % 360) + 360) % 360;
}

/**
 * Convert minute hand angle to minutes (0–59).
 */
export function angleToMinute(angleDeg: number): number {
  return Math.round(((angleDeg % 360) + 360) % 360 / 6) % 60;
}

/**
 * Convert hour hand angle to hour (1–12).
 */
export function angleToHour(angleDeg: number): number {
  const normalized = ((angleDeg % 360) + 360) % 360;
  const hourRaw = Math.round(normalized / 30) % 12;
  return hourRaw === 0 ? 12 : hourRaw;
}

/**
 * Check if user's dragged time is close enough to the target.
 * Handles 12-hour wraparound (e.g. 11:58 vs 12:02).
 */
export function isTimeCorrect(
  userHour: number,
  userMinute: number,
  targetHour: number,
  targetMinute: number,
  toleranceMinutes = 2
): boolean {
  const userTotal = (userHour % 12) * 60 + userMinute;
  const targetTotal = (targetHour % 12) * 60 + targetMinute;
  const diff = Math.abs(userTotal - targetTotal);
  const wrappedDiff = Math.min(diff, 720 - diff);
  return wrappedDiff <= toleranceMinutes;
}

/**
 * Format a time as a human-readable string.
 */
export function formatTime(hour: number, minute: number): string {
  return `${hour}:${minute.toString().padStart(2, "0")}`;
}
