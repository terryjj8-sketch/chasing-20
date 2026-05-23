import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Card from './Card';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const DIFFICULTIES = [
  {
    id: 'easy',
    label: 'Water',
    description: 'Valid rows highlighted · Deck count shown',
  },
  {
    id: 'medium',
    label: 'Coffee',
    description: 'Valid rows highlighted · Deck count hidden',
  },
  {
    id: 'hard',
    label: 'Espresso',
    description: 'No hints · Deck count hidden',
  },
];

export default function SetupPhase({ drawPile, onComplete }) {
  const navigate = useNavigate();
  const [displayCards, setDisplayCards] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState(new Set());
  const [difficulty, setDifficulty] = useState('easy');

  useEffect(() => {
    setDisplayCards(drawPile.slice(0, 6));
  }, [drawPile]);

  const toggleSelect = (index) => {
    const newSelected = new Set(selectedIndices);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else if (newSelected.size < 4) {
      newSelected.add(index);
    }
    setSelectedIndices(newSelected);
  };

  const handleStart = () => {
    if (selectedIndices.size === 4) {
      onComplete(Array.from(selectedIndices), difficulty);
    }
  };

  const difficultyStyles = {
    easy:   { bg: 'linear-gradient(135deg, #22c55e, #16a34a)', emoji: '💧', tagline: 'think before you drink' },
    medium: { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', emoji: '☕', tagline: 'think before you drink' },
    hard:   { bg: 'linear-gradient(135deg, #ef4444, #b91c1c)', emoji: '☕☕', tagline: 'think before you drink' },
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden relative"
      style={{ background: 'linear-gradient(135deg, #ff006e 0%, #fb5607 15%, #ffbe0b 30%, #8338ec 45%, #3a86ff 60%, #06ffa5 85%, #ff006e 100%)' }}
    >
      {/* Floating colorful blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ y: [0, -20, 0], x: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-10 left-10 w-40 h-40 rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, #f43f5e, transparent)' }} />
        <motion.div animate={{ y: [0, 15, 0], x: [0, -12, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-20 right-8 w-32 h-32 rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }} />
        <motion.div animate={{ y: [0, -12, 0], x: [0, 8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-32 left-16 w-36 h-36 rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, #22d3ee, transparent)' }} />
        <motion.div animate={{ y: [0, 18, 0], x: [0, -8, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute bottom-20 right-12 w-44 h-44 rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, #4ade80, transparent)' }} />
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        className="text-center mb-6 sm:mb-8 relative z-10"
      >
        <motion.h1
          className="text-5xl sm:text-7xl font-black mb-2 leading-none"
          style={{
            background: 'linear-gradient(135deg, #facc15, #fb923c, #f472b6, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 2px 12px rgba(251,146,60,0.5))',
          }}
        >
          Chasing 20
        </motion.h1>
        <p className="text-base sm:text-lg font-semibold text-white/80 mt-2">Finally, a better solitaire game. 🃏</p>
        <p className="text-sm text-white/60 mt-1">Pick 4 cards · Build your rows · Beat the deck</p>
        <button
          onClick={() => navigate('/how-to-play')}
          className="mt-3 text-sm font-semibold px-4 py-1.5 rounded-full border border-white/30 text-white/70 hover:bg-white/10 hover:text-white transition-all"
        >
          How to Play →
        </button>
      </motion.div>

      {/* Difficulty Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-6 w-full max-w-sm sm:max-w-none px-2 sm:px-0 relative z-10"
      >
        {DIFFICULTIES.map(d => {
          const style = difficultyStyles[d.id];
          const active = difficulty === d.id;
          return (
            <motion.button
              key={d.id}
              onClick={() => setDifficulty(d.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="flex flex-col items-center px-5 py-3 rounded-2xl border-2 transition-all duration-200 flex-1 sm:flex-none relative overflow-hidden"
              style={{
                borderColor: active ? 'white' : 'rgba(255,255,255,0.2)',
                background: active ? style.bg : 'rgba(255,255,255,0.08)',
                boxShadow: active ? '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)' : undefined,
                color: 'white',
              }}
            >
              <span className="text-xl mb-0.5">{style.emoji}</span>
              <span className="font-black text-sm tracking-wide">{d.label}</span>
              <span className="text-[10px] mt-1 text-center leading-tight opacity-80">{d.description}</span>
              <span className="text-[8px] mt-1.5 text-center leading-tight opacity-50 italic">{style.tagline}</span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Card picker */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-3 sm:gap-4 flex-wrap justify-center max-w-2xl mb-6 sm:mb-8 px-2 relative z-10"
      >
        {displayCards.map((card, idx) => (
          <motion.button
            key={idx}
            onClick={() => toggleSelect(idx)}
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: 0.95 }}
            className="transition-all duration-200"
            style={{
              filter: selectedIndices.has(idx) ? 'drop-shadow(0 0 12px #facc15)' : undefined,
              transform: selectedIndices.has(idx) ? 'translateY(-6px)' : undefined,
            }}
          >
            <Card value={card.value} isSelected={selectedIndices.has(idx)} />
          </motion.button>
        ))}
      </motion.div>

      {/* Start button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center relative z-10"
      >
        <p className="text-white/60 mb-4 font-medium">
          {selectedIndices.size === 4
            ? '✅ Ready to play!'
            : `${selectedIndices.size} / 4 cards selected`}
        </p>
        <motion.button
          onClick={handleStart}
          disabled={selectedIndices.size !== 4}
          whileHover={selectedIndices.size === 4 ? { scale: 1.05 } : {}}
          whileTap={selectedIndices.size === 4 ? { scale: 0.97 } : {}}
          className="px-12 py-4 rounded-2xl text-xl font-black text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          style={selectedIndices.size === 4 ? {
            background: 'linear-gradient(135deg, #facc15, #fb923c, #f472b6)',
            boxShadow: '0 6px 30px rgba(251,146,60,0.5)',
            color: '#1e1b4b',
          } : {
            background: 'rgba(255,255,255,0.1)',
            border: '2px solid rgba(255,255,255,0.2)',
          }}
        >
          🎲 Let's Play!
        </motion.button>
      </motion.div>
    </div>
  );
}