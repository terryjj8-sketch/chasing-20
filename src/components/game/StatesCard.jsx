import React from 'react';
import { motion } from 'framer-motion';
import { STATES_DATA } from '@/lib/statesData';

// White cards with vibrant state-themed colors
const STATE_COLORS = {
  california:   { top: '#fff7ed', bottom: '#ffedd5', accent: '#ea580c', text: '#7c2d12', border: '#fed7aa' },
  texas:        { top: '#fef2f2', bottom: '#fee2e2', accent: '#dc2626', text: '#7f1d1d', border: '#fca5a5' },
  florida:      { top: '#ecfdf5', bottom: '#d1fae5', accent: '#059669', text: '#064e3b', border: '#6ee7b7' },
  new_york:     { top: '#eff6ff', bottom: '#dbeafe', accent: '#2563eb', text: '#1e3a8a', border: '#93c5fd' },
  illinois:     { top: '#f0fdf4', bottom: '#dcfce7', accent: '#16a34a', text: '#14532d', border: '#86efac' },
  pennsylvania: { top: '#fdf4ff', bottom: '#fae8ff', accent: '#a855f7', text: '#581c87', border: '#d8b4fe' },
  ohio:         { top: '#fefce8', bottom: '#fef9c3', accent: '#ca8a04', text: '#713f12', border: '#fde68a' },
  georgia:      { top: '#fff1f2', bottom: '#ffe4e6', accent: '#e11d48', text: '#881337', border: '#fda4af' },
  colorado:     { top: '#eff6ff', bottom: '#dbeafe', accent: '#0284c7', text: '#0c4a6e', border: '#7dd3fc' },
  washington:   { top: '#f0fdfa', bottom: '#ccfbf1', accent: '#0d9488', text: '#134e4a', border: '#5eead4' },
};

function getCardInfo(card) {
  const colors = STATE_COLORS[card.stateId] || { top: '#f8fafc', bottom: '#f1f5f9', accent: '#64748b', text: '#334155', border: '#cbd5e1' };
  const stateData = STATES_DATA.find(s => s.id === card.stateId);

  if (card.isCapital) {
    return {
      label: card.short,
      sublabel: stateData?.short || '',
      emoji: '⭐',
      type: 'capital',
      top: '#fffbeb', bottom: '#fef3c7',
      accent: '#d97706', text: '#78350f', border: '#fcd34d',
    };
  }

  if (card.type === 'state' || card.isStarter) {
    return {
      label: card.short,
      sublabel: card.label,
      emoji: card.emoji || '🗺️',
      type: 'state',
      ...colors,
    };
  }

  // city card
  return {
    label: card.short,
    sublabel: stateData?.short || '',
    emoji: stateData?.emoji || '🏙️',
    type: 'city',
    ...colors,
  };
}

export default function StatesCard({ card, width = 62, height = 88, animate = false, isNew = false }) {
  if (!card) return null;
  const info = getCardInfo(card);
  const scale = width / 62;
  const isCapital = info.type === 'capital';
  const isState = info.type === 'state';

  const inner = (
    <div style={{
      width, height,
      borderRadius: width * 0.13,
      background: `linear-gradient(160deg, ${info.top} 0%, ${info.bottom} 100%)`,
      border: `2px solid ${info.border}`,
      position: 'relative',
      overflow: 'hidden',
      boxShadow: isCapital
        ? `0 3px 12px ${info.accent}44, 0 1px 4px rgba(0,0,0,0.1)`
        : `0 2px 8px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08)`,
      flexShrink: 0,
      userSelect: 'none',
    }}>
      {/* Subtle inner border shine */}
      <div style={{
        position: 'absolute', inset: 2,
        borderRadius: width * 0.1,
        border: `1px solid rgba(255,255,255,0.8)`,
        pointerEvents: 'none',
      }} />

      {/* Colored top strip */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: height * 0.28,
        background: isCapital
          ? `linear-gradient(135deg, #f59e0b, #d97706)`
          : `linear-gradient(135deg, ${info.accent}ee, ${info.accent}bb)`,
        borderRadius: `${width * 0.13}px ${width * 0.13}px 0 0`,
      }} />

      {/* Top-left: emoji on strip */}
      <div style={{ position: 'absolute', top: width * 0.05, left: width * 0.08, lineHeight: 1 }}>
        <div style={{ fontSize: scale * 13 }}>{info.emoji}</div>
      </div>

      {/* Top-right: state abbreviation */}
      <div style={{ position: 'absolute', top: width * 0.06, right: width * 0.08, lineHeight: 1 }}>
        <div style={{ fontSize: scale * 7.5, fontWeight: 900, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>{info.sublabel}</div>
      </div>

      {/* Center body */}
      <div style={{ position: 'absolute', top: height * 0.3, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, padding: '0 3px', textAlign: 'center' }}>
        <span style={{ fontSize: scale * 20, lineHeight: 1 }}>{info.emoji}</span>
        <span style={{ fontSize: scale * 8, fontWeight: 900, color: info.text, lineHeight: 1.15 }}>{info.label}</span>
        {isCapital && (
          <span style={{ fontSize: scale * 5.5, color: info.accent, fontWeight: 800, letterSpacing: 0.5 }}>CAPITAL</span>
        )}
        {isState && (
          <span style={{ fontSize: scale * 5.5, color: info.accent, fontWeight: 800, letterSpacing: 0.5 }}>STATE</span>
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