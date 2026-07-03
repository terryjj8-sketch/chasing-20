import React from 'react';
import { motion } from 'framer-motion';

// Tag → color mapping
const TAG_COLORS = {
  Word:        { bg: '#eff6ff', strip: '#3b82f6', text: '#1e40af', border: '#bfdbfe' },
  Daily:       { bg: '#fefce8', strip: '#eab308', text: '#713f12', border: '#fde68a' },
  NYT:         { bg: '#f1f5f9', strip: '#475569', text: '#0f172a', border: '#cbd5e1' },
  Puzzle:      { bg: '#fdf4ff', strip: '#a855f7', text: '#581c87', border: '#e9d5ff' },
  Number:      { bg: '#fff7ed', strip: '#f97316', text: '#7c2d12', border: '#fed7aa' },
  Logic:       { bg: '#ecfdf5', strip: '#059669', text: '#064e3b', border: '#a7f3d0' },
  Grid:        { bg: '#f0fdf4', strip: '#16a34a', text: '#14532d', border: '#86efac' },
  Category:    { bg: '#fefce8', strip: '#ca8a04', text: '#713f12', border: '#fde68a' },
  Casual:      { bg: '#fdf2f8', strip: '#ec4899', text: '#831843', border: '#fbcfe8' },
  Mobile:      { bg: '#eff6ff', strip: '#2563eb', text: '#1e3a8a', border: '#93c5fd' },
  Match3:      { bg: '#fff0f0', strip: '#ef4444', text: '#7f1d1d', border: '#fca5a5' },
  Block:       { bg: '#fef2f2', strip: '#dc2626', text: '#7f1d1d', border: '#fca5a5' },
  Battle:      { bg: '#fff7ed', strip: '#ea580c', text: '#7c2d12', border: '#fed7aa' },
  Multiplayer: { bg: '#f0fdf4', strip: '#15803d', text: '#14532d', border: '#86efac' },
  Shooter:     { bg: '#fef2f2', strip: '#b91c1c', text: '#7f1d1d', border: '#fca5a5' },
  Creative:    { bg: '#fdf4ff', strip: '#9333ea', text: '#581c87', border: '#d8b4fe' },
  Sandbox:     { bg: '#fefce8', strip: '#d97706', text: '#78350f', border: '#fde68a' },
  Social:      { bg: '#eff6ff', strip: '#0ea5e9', text: '#0c4a6e', border: '#7dd3fc' },
  Platform:    { bg: '#f0fdf4', strip: '#0d9488', text: '#134e4a', border: '#5eead4' },
  Strategy:    { bg: '#fdf4ff', strip: '#7c3aed', text: '#3b0764', border: '#c4b5fd' },
  Classic:     { bg: '#f8fafc', strip: '#64748b', text: '#1e293b', border: '#cbd5e1' },
  Board:       { bg: '#fef9c3', strip: '#b45309', text: '#451a03', border: '#fde68a' },
  Card:        { bg: '#fff0f0', strip: '#e11d48', text: '#881337', border: '#fda4af' },
  Solo:        { bg: '#f0f9ff', strip: '#0284c7', text: '#0c4a6e', border: '#bae6fd' },
  RPG:         { bg: '#fdf4ff', strip: '#c026d3', text: '#581c87', border: '#e9d5ff' },
  Adventure:   { bg: '#ecfdf5', strip: '#059669', text: '#064e3b', border: '#a7f3d0' },
  Arcade:      { bg: '#fff7ed', strip: '#f59e0b', text: '#78350f', border: '#fcd34d' },
  Retro:       { bg: '#fef2f2', strip: '#9f1239', text: '#881337', border: '#fda4af' },
  Sports:      { bg: '#f0fdf4', strip: '#16a34a', text: '#14532d', border: '#86efac' },
  Racing:      { bg: '#fff7ed', strip: '#ea580c', text: '#7c2d12', border: '#fed7aa' },
  Simulation:  { bg: '#eff6ff', strip: '#3b82f6', text: '#1e40af', border: '#bfdbfe' },
  Idle:        { bg: '#fefce8', strip: '#ca8a04', text: '#713f12', border: '#fde68a' },
  Party:       { bg: '#fdf2f8', strip: '#db2777', text: '#831843', border: '#fbcfe8' },
  Geography:   { bg: '#f0fdfa', strip: '#0d9488', text: '#134e4a', border: '#5eead4' },
  VR:          { bg: '#f5f3ff', strip: '#7c3aed', text: '#3b0764', border: '#c4b5fd' },
  Competitive: { bg: '#fff1f2', strip: '#e11d48', text: '#881337', border: '#fda4af' },
  Team:        { bg: '#f0fdf4', strip: '#15803d', text: '#14532d', border: '#86efac' },
  Cooperative: { bg: '#ecfdf5', strip: '#10b981', text: '#064e3b', border: '#6ee7b7' },
  Digital:     { bg: '#eff6ff', strip: '#2563eb', text: '#1e3a8a', border: '#93c5fd' },
  Action:      { bg: '#fef2f2', strip: '#dc2626', text: '#7f1d1d', border: '#fca5a5' },
  Cozy:        { bg: '#fdf2f8', strip: '#ec4899', text: '#831843', border: '#fbcfe8' },
  RTS:         { bg: '#fdf4ff', strip: '#9333ea', text: '#581c87', border: '#d8b4fe' },
};

const DEFAULT_COLORS = { bg: '#f8fafc', strip: '#64748b', text: '#1e293b', border: '#cbd5e1' };

function getColors(tags) {
  if (!tags || tags.length === 0) return DEFAULT_COLORS;
  return TAG_COLORS[tags[0]] || DEFAULT_COLORS;
}

export default function GamesCard({ card, width = 62, height = 88, animate = false, isNew = false }) {
  if (!card) return null;

  const isCrossover = card.isWild || card.type === 'crossover';
  const scale = width / 62;

  const colors = isCrossover
    ? { bg: '#fffbeb', strip: 'linear-gradient(135deg,#f59e0b,#d97706)', text: '#78350f', border: '#fcd34d' }
    : getColors(card.tags);

  const stripStyle = isCrossover
    ? { background: 'linear-gradient(135deg,#f59e0b,#d97706)' }
    : { background: `linear-gradient(135deg, ${colors.strip}ee, ${colors.strip}aa)` };

  // Show up to 2 tags as small pills
  const displayTags = card.tags ? card.tags.slice(0, 2) : [];

  const inner = (
    <div style={{
      width, height,
      borderRadius: width * 0.13,
      background: isCrossover ? '#fffbeb' : colors.bg,
      border: `2px solid ${isCrossover ? '#fcd34d' : colors.border}`,
      position: 'relative',
      overflow: 'hidden',
      boxShadow: isCrossover
        ? `0 3px 12px #f59e0b44, 0 1px 4px rgba(0,0,0,0.1)`
        : `0 2px 8px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08)`,
      flexShrink: 0,
      userSelect: 'none',
    }}>
      {/* Inner shine */}
      <div style={{ position: 'absolute', inset: 2, borderRadius: width * 0.1, border: '1px solid rgba(255,255,255,0.8)', pointerEvents: 'none' }} />

      {/* Colored top strip */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: height * 0.28, borderRadius: `${width * 0.13}px ${width * 0.13}px 0 0`, ...stripStyle }} />

      {/* Emoji on strip */}
      <div style={{ position: 'absolute', top: width * 0.05, left: width * 0.08 }}>
        <span style={{ fontSize: scale * 13 }}>{card.emoji || '🎮'}</span>
      </div>

      {/* Top-right: first tag abbreviation */}
      {!isCrossover && displayTags[0] && (
        <div style={{ position: 'absolute', top: width * 0.06, right: width * 0.06 }}>
          <span style={{ fontSize: scale * 6.5, fontWeight: 900, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.3)', lineHeight: 1 }}>{displayTags[0]}</span>
        </div>
      )}

      {/* Center body */}
      <div style={{ position: 'absolute', top: height * 0.3, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, padding: '0 3px', textAlign: 'center' }}>
        <span style={{ fontSize: scale * 20, lineHeight: 1 }}>{card.emoji || '🎮'}</span>
        <span style={{ fontSize: scale * 7, fontWeight: 900, color: isCrossover ? '#78350f' : colors.text, lineHeight: 1.15, textAlign: 'center' }}>{card.short || card.label}</span>

        {isCrossover && (
          <span style={{ fontSize: scale * 5.5, color: '#b45309', fontWeight: 800, letterSpacing: 0.5 }}>CROSSOVER</span>
        )}

        {/* Tag pills */}
        {!isCrossover && displayTags.length > 0 && (
          <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', marginTop: 2 }}>
            {displayTags.map(tag => (
              <span key={tag} style={{
                fontSize: scale * 4.5,
                fontWeight: 700,
                color: colors.strip,
                background: `${colors.strip}18`,
                borderRadius: 99,
                padding: `${scale * 1}px ${scale * 3}px`,
                lineHeight: 1.3,
              }}>{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (animate || isNew) {
    return (
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 15 }}>
        {inner}
      </motion.div>
    );
  }
  return inner;
}