import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GAMES } from '@/lib/gamesData';

// All unique tags, with a color + description
const TAG_META = {
  Word:        { color: '#6366f1', desc: 'Letter & word-based games' },
  Daily:       { color: '#0ea5e9', desc: 'Play-once-a-day games' },
  NYT:         { color: '#1e293b', desc: 'New York Times games' },
  Puzzle:      { color: '#8b5cf6', desc: 'Logic & problem-solving games' },
  Category:    { color: '#7c3aed', desc: 'Sorting & grouping games' },
  Number:      { color: '#0284c7', desc: 'Math & number-based games' },
  Logic:       { color: '#0369a1', desc: 'Deduction & reasoning games' },
  Grid:        { color: '#475569', desc: 'Grid-layout puzzle games' },
  Classic:     { color: '#b45309', desc: 'Timeless, enduring titles' },
  Casual:      { color: '#16a34a', desc: 'Easy to pick up & play' },
  Mobile:      { color: '#15803d', desc: 'Primarily mobile games' },
  Match3:      { color: '#d97706', desc: 'Match-3 tile games' },
  Block:       { color: '#dc2626', desc: 'Block-placement games' },
  Arcade:      { color: '#ea580c', desc: 'Score-chasing arcade games' },
  Battle:      { color: '#b91c1c', desc: 'Battle royale games' },
  Multiplayer: { color: '#7c3aed', desc: 'Play with others online' },
  Shooter:     { color: '#991b1b', desc: 'Shooting & aim-based games' },
  Competitive: { color: '#9333ea', desc: 'Ranked competitive games' },
  Team:        { color: '#2563eb', desc: 'Team-based cooperative play' },
  Creative:    { color: '#ec4899', desc: 'Build & create freely' },
  Social:      { color: '#059669', desc: 'Social & community games' },
  Sandbox:     { color: '#ca8a04', desc: 'Open-world sandbox games' },
  Platform:    { color: '#0891b2', desc: 'Platformer & jump games' },
  Simulation:  { color: '#0d9488', desc: 'Life & world simulation games' },
  Cozy:        { color: '#f472b6', desc: 'Relaxing, low-stress games' },
  Strategy:    { color: '#1d4ed8', desc: 'Planning & strategy games' },
  Board:       { color: '#78350f', desc: 'Digital board games' },
  Cooperative: { color: '#166534', desc: 'Work together to win' },
  Card:        { color: '#9f1239', desc: 'Card-based games' },
  Solo:        { color: '#334155', desc: 'Single-player games' },
  Digital:     { color: '#6d28d9', desc: 'Digital-native card games' },
  Party:       { color: '#f59e0b', desc: 'Fun for groups & parties' },
  Geography:   { color: '#0369a1', desc: 'Location & map-based games' },
  Retro:       { color: '#92400e', desc: 'Old-school retro games' },
  RPG:         { color: '#7e22ce', desc: 'Role-playing adventure games' },
  Adventure:   { color: '#065f46', desc: 'Exploration & story games' },
  Action:      { color: '#b91c1c', desc: 'Fast-paced action games' },
  Sports:      { color: '#1d4ed8', desc: 'Sports simulation games' },
  Racing:      { color: '#dc2626', desc: 'Racing & driving games' },
  Idle:        { color: '#6b7280', desc: 'Idle & clicker games' },
  RTS:         { color: '#1e40af', desc: 'Real-time strategy games' },
  VR:          { color: '#4f46e5', desc: 'Virtual reality games' },
};

const ALL_TAGS = Object.keys(TAG_META);

export default function GamesTagGuide({ onClose }) {
  const [selectedTag, setSelectedTag] = useState(null);

  const filteredGames = selectedTag
    ? GAMES.filter(g => g.tags.includes(selectedTag))
    : [];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      }}
    >
      <motion.div
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 18 }}
        style={{
          background: 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 100%)',
          border: '2px solid rgba(148,163,184,0.2)',
          borderRadius: 24, padding: 24, maxWidth: 480, width: '100%',
          maxHeight: '88vh', overflowY: 'auto',
          boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#fbbf24' }}>🏷️ Tag Relationship Guide</h2>
            <p style={{ margin: '4px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>
              Cards sharing a tag can be chained. Tap a tag to see its games.
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#94a3b8', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontSize: 18 }}>×</button>
        </div>

        {/* Tag pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {ALL_TAGS.map(tag => {
            const meta = TAG_META[tag] || { color: '#64748b', desc: '' };
            const active = selectedTag === tag;
            return (
              <motion.button
                key={tag}
                onClick={() => setSelectedTag(active ? null : tag)}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: active ? meta.color : 'rgba(255,255,255,0.07)',
                  border: `1px solid ${active ? meta.color : 'rgba(255,255,255,0.15)'}`,
                  color: active ? '#fff' : 'rgba(255,255,255,0.75)',
                  borderRadius: 99, padding: '4px 12px', fontSize: 12, fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: active ? `0 0 12px ${meta.color}88` : 'none',
                }}
              >
                {tag}
              </motion.button>
            );
          })}
        </div>

        {/* Tag detail */}
        <AnimatePresence>
          {selectedTag && (
            <motion.div
              key={selectedTag}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                background: 'rgba(255,255,255,0.05)', borderRadius: 16,
                padding: '14px 16px', marginBottom: 16,
                border: `1px solid ${TAG_META[selectedTag]?.color || '#475569'}44`,
              }}
            >
              <p style={{ margin: '0 0 10px', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                <span style={{ color: TAG_META[selectedTag]?.color || '#fff', fontWeight: 900 }}>{selectedTag}</span>
                {' — '}{TAG_META[selectedTag]?.desc || ''}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {filteredGames.map(g => (
                  <div key={g.id} style={{
                    background: 'rgba(255,255,255,0.08)', borderRadius: 8,
                    padding: '4px 10px', fontSize: 12, color: 'rgba(255,255,255,0.85)',
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}>
                    <span>{g.emoji}</span>
                    <span>{g.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Full tag chart */}
        {!selectedTag && (
          <div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>
              Tap any tag above to see which games share it and can be chained.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {ALL_TAGS.slice(0, 12).map(tag => {
                const meta = TAG_META[tag] || { color: '#64748b', desc: '' };
                const count = GAMES.filter(g => g.tags.includes(tag)).length;
                return (
                  <div key={tag} onClick={() => setSelectedTag(tag)} style={{
                    display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                    background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '8px 12px',
                  }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: meta.color, flexShrink: 0 }} />
                    <span style={{ fontWeight: 700, color: '#fff', fontSize: 13, flex: 1 }}>{tag}</span>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{count} games</span>
                  </div>
                );
              })}
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: 4 }}>
                + {ALL_TAGS.length - 12} more — tap a tag pill above to explore
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}