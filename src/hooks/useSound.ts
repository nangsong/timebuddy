"use client";

import { useState, useCallback, useRef, useEffect } from "react";

type SoundName = "correct" | "wrong" | "tick" | "levelup";

const MUTE_KEY = "timebuddy_mute";

function createBeep(
  ctx: AudioContext,
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  gainValue = 0.3
): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);
  gain.gain.setValueAtTime(gainValue, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

function playCorrect(ctx: AudioContext) {
  createBeep(ctx, 523, 0.1, "sine", 0.3); // C5
  setTimeout(() => createBeep(ctx, 659, 0.1, "sine", 0.3), 100); // E5
  setTimeout(() => createBeep(ctx, 784, 0.2, "sine", 0.3), 200); // G5
}

function playWrong(ctx: AudioContext) {
  createBeep(ctx, 330, 0.15, "sawtooth", 0.2);
  setTimeout(() => createBeep(ctx, 277, 0.25, "sawtooth", 0.15), 180);
}

function playTick(ctx: AudioContext) {
  createBeep(ctx, 880, 0.05, "square", 0.1);
}

function playLevelup(ctx: AudioContext) {
  [523, 659, 784, 1047].forEach((freq, i) => {
    setTimeout(() => createBeep(ctx, freq, 0.15, "sine", 0.35), i * 120);
  });
}

export function useSound() {
  const [muted, setMuted] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem(MUTE_KEY) === "true";
    } catch {
      return false;
    }
  });

  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      audioCtxRef.current?.close();
    };
  }, []);

  const getCtx = useCallback((): AudioContext | null => {
    if (typeof window === "undefined") return null;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioCtxRef.current;
  }, []);

  const play = useCallback(
    (sound: SoundName) => {
      if (muted) return;
      const ctx = getCtx();
      if (!ctx) return;

      // Resume context if suspended (required after user gesture)
      if (ctx.state === "suspended") ctx.resume();

      switch (sound) {
        case "correct":
          playCorrect(ctx);
          break;
        case "wrong":
          playWrong(ctx);
          break;
        case "tick":
          playTick(ctx);
          break;
        case "levelup":
          playLevelup(ctx);
          break;
      }
    },
    [muted, getCtx]
  );

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(MUTE_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return { play, muted, toggleMute };
}
