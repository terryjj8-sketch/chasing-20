import React, { useEffect, useState } from 'react';
import { Timer } from 'lucide-react';

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function GameTimer({ isRunning, elapsedSeconds }) {
  return (
    <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg text-sm">
      <Timer className="w-3.5 h-3.5 text-foreground/50" />
      <span className="text-foreground font-bold font-mono">{formatTime(elapsedSeconds)}</span>
    </div>
  );
}