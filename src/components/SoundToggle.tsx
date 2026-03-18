"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useSound } from "@/hooks/useSound";

export function SoundToggle() {
  const { muted, toggleMute } = useSound();

  return (
    <button
      onClick={toggleMute}
      title={muted ? "Unmute sounds" : "Mute sounds"}
      className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
    >
      {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
    </button>
  );
}
