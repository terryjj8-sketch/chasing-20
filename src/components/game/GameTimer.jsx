import React, { useEffect, useState } from 'react';
import { Timer } from 'lucide-react';

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function GameTimer({ isRunning, elapsedSeconds }) {
  return (
    <div className="flex items-center gap-2 bg-black/30 px-3 py-2 rounded-lg text-base border border-white/10">
      <Timer className="w-4 h-4 text-foreground" />
      <span className="text-foreground font-bold font-mono text-lg">{formatTime(elapsedSeconds)}</span>
    </div>
  );
}