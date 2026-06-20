import React from 'react';
import { motion } from 'framer-motion';

// Custom factions — 0 & 1 are dark, 2 & 3 are red
// Each has a unique symbol instead of traditional suits
export const FACTIONS = [
  { symbol: '⚡', label: 'Storm',  isDark: true,  bg: '#1a1a2e', fg: '#e2e8f0', accent: '#60a5fa' }, // dark blue
  { symbol: '🌑', label: 'Void',   isDark: true,  bg: '#0f1a0f', fg: '#d1fae5', accent: '#4ade80' }, // dark green
  { symbol: '🔥', label: 'Blaze',  isDark: false, bg: '#fff0f0', fg: '#991b1b', accent: '#ef4444' }, // light red
  { symbol: '🌸', label: 'Dawn',   isDark: false, bg: '#fff5f8', fg: '#9d174d', accent: '#f472b6' }, // light pink
];

export default function SolitaireCard({ value, suit, width = 52, height = 72, animate = false, isNew = false, cardIndex }) {
  const isZero = value === 0;
  const faction = FACTIONS[suit ?? 0];
  // Scale factor relative to the 62px mobile card width these font sizes were tuned for
  const scale = width / 62;

  const inner = (
    <div
      className="rounded-lg flex items-center justify-center relative overflow-hidden select-none"
      style={{
        width,
        height,
        background: faction.bg,
        border: `2px solid ${faction.accent}55`,
        boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
        flexShrink: 0,
      }}
    >
      {/* Inner border */}
      <div
        className="absolute rounded-sm pointer-events-none"
        style={{ inset: 3, border: `1px solid ${faction.accent}33` }}
      />

      {/* Corner pips */}
      {!isZero && (
        <>
          <div className="absolute top-1 left-1.5 flex flex-col items-center leading-none">
            <span className="font-black leading-none" style={{ fontSize: 9 * scale, color: faction.fg }}>{value}</span>
            <span className="leading-none" style={{ fontSize: 10 * scale }}>{faction.symbol}</span>
          </div>
          <div className="absolute bottom-1 right-1.5 flex flex-col items-center leading-none rotate-180">
            <span className="font-black leading-none" style={{ fontSize: 9 * scale, color: faction.fg }}>{value}</span>
            <span className="leading-none" style={{ fontSize: 10 * scale }}>{faction.symbol}</span>
          </div>
        </>
      )}
      {isZero && (
        <>
          <div className="absolute top-1 left-1.5 leading-none">
            <span className="font-black" style={{ fontSize: 8 * scale, color: faction.accent }}>★</span>
          </div>
          <div className="absolute top-1 right-1.5 leading-none">
            <span className="font-black" style={{ fontSize: 8 * scale, color: faction.accent }}>★</span>
          </div>
        </>
      )}

      {/* Center */}
      {isZero ? (
        <div className="text-center z-10 flex flex-col items-center gap-0.5">
          <div style={{ fontSize: 18 * scale }}>★</div>
          <div className="font-black tracking-widest" style={{ fontSize: 13 * scale, color: faction.accent, letterSpacing: '0.15em' }}>
            WILD
          </div>
          <div style={{ fontSize: 18 * scale }}>★</div>
        </div>
      ) : (
        <div className="text-center z-10 flex flex-col items-center">
          <div
            className="font-black"
            style={{ fontSize: 32 * scale, color: faction.fg }}
          >
            {value}
          </div>
        </div>
      )}

      {/* Faction watermark in center-bottom */}
      {!isZero && (
        <div
          className="absolute bottom-5 left-0 right-0 text-center pointer-events-none"
          style={{ fontSize: width < 60 ? 10 : 13, opacity: 0.18 }}
        >
          {faction.symbol}
        </div>
      )}
    </div>
  );

  if (animate || isNew) {
    return (
      <motion.div
        initial={{ scale: 0.7, opacity: 0, y: -10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', bounce: 0.4, duration: 0.35 }}
      >
        {inner}
      </motion.div>
    );
  }

  return inner;
}