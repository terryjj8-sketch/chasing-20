import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Card from './Card';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const DIFFICULTIES = [
  {
    id: 'easy',
    label: 'Beginner',
    description: 'See valid rows + deck count',
  },
  {
    id: 'medium',
    label: 'Novice',
    description: 'See valid rows only',
  },
  {
    id: 'hard',
    label: 'Pro',
    description: 'No help, no hints',
  },
];

export default function SetupPhase({ drawPile, onComplete }) {
  const navigate = useNavigate();
  const [displayCards, setDisplayCards] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState(new Set());
  const [difficulty, setDifficulty] = useState('easy');

  useEffect(() => {
    const nonZero = drawPile.filter(c => c.value !== 0);
    setDisplayCards(nonZero.slice(0, 6));
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
    easy:   { activeBg: 'linear-gradient(135deg, #10b981, #059669)', inactiveBg: 'linear-gradient(135deg, #d1fae5, #a7f3d0)', emoji: '🌱', tagline: 'Best for learning', textColor: '#000' },
    medium: { activeBg: 'linear-gradient(135deg, #f59e0b, #d97706)', inactiveBg: 'linear-gradient(135deg, #fef3c7, #fde68a)', emoji: '🔥', tagline: 'For a real challenge', textColor: '#000' },
    hard:   { activeBg: 'linear-gradient(135deg, #ec4899, #be185d)', inactiveBg: 'linear-gradient(135deg, #fce7f3, #fbcfe8)', emoji: '⚡', tagline: 'Experts only', textColor: '#000' },
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start py-6 px-6 overflow-y-auto relative"
      style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}
    >
      {/* Subtle colorful accent blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ y: [0, -20, 0], x: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-10 left-10 w-48 h-48 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(251,113,133,0.25), transparent)' }} />
        <motion.div animate={{ y: [0, 15, 0], x: [0, -12, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-20 right-8 w-40 h-40 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.2), transparent)' }} />
        <motion.div animate={{ y: [0, -12, 0], x: [0, 8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-32 left-16 w-36 h-36 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.2), transparent)' }} />
        <motion.div animate={{ y: [0, 18, 0], x: [0, -8, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute bottom-20 right-12 w-44 h-44 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.18), transparent)' }} />
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        className="text-center mb-6 sm:mb-8 relative z-10"
      >
        <motion.h1
          className="text-6xl sm:text-8xl font-black mb-2 leading-none tracking-tight"
          style={{
            color: '#ffffff',
            textShadow: '0 0 40px rgba(251,191,36,0.6), 0 4px 0 #000, 2px 2px 0 #000, -2px -2px 0 #000, 4px 8px 20px rgba(0,0,0,0.9)',
            letterSpacing: '-0.02em',
          }}
        >
          Chasing 20
        </motion.h1>
        <p className="text-base sm:text-lg font-bold text-white mt-3" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
          Quite. Possibly. The most addictive game you'll ever play...
        </p>
        <p className="text-sm font-semibold mt-1" style={{ color: '#94a3b8', textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
         Pick 4 cards · Build your rows · Beat the deck
        </p>

        {/* How to Play — big and unmissable */}
        <motion.button
          onClick={() => navigate('/how-to-play')}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.97 }}
          className="mt-5 inline-flex items-center gap-2 text-base font-black px-6 py-2.5 rounded-full transition-all"
          style={{
            background: 'linear-gradient(135deg, #fbbf24, #f97316)',
            color: '#000',
            boxShadow: '0 4px 20px rgba(251,191,36,0.5), 0 2px 0 rgba(0,0,0,0.4)',
          }}
        >
          📖 How to Play
        </motion.button>
      </motion.div>

      {/* Difficulty Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10 justify-center w-full px-2 sm:px-0 relative z-10"
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
              className="flex flex-col items-center px-6 py-4 rounded-2xl border-2 transition-all duration-200 w-full sm:w-auto relative overflow-hidden"
              style={{
                borderColor: active ? '#000' : 'rgba(0,0,0,0.3)',
                background: active ? style.activeBg : style.inactiveBg,
                boxShadow: active ? '0 6px 20px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.2)',
                color: '#000',
                opacity: active ? 1 : 0.75,
              }}
            >
              <span className="text-2xl mb-1">{style.emoji}</span>
              <span className="font-black text-base tracking-wide">{d.label}</span>
              <span className="text-xs mt-2 text-center leading-snug font-semibold">{d.description}</span>
              <span className="text-[11px] mt-2 text-center leading-tight opacity-70 italic">{style.tagline}</span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Win Condition Statement */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8 px-6 py-4 rounded-2xl relative z-10 border-2"
        style={{
          background: 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(251,146,60,0.15))',
          borderColor: '#fb923c',
          boxShadow: '0 0 20px rgba(251,146,60,0.3)'
        }}
      >
        <p className="text-center font-black text-base tracking-wide" style={{ color: '#fbbf24' }}>
          ⭐ Get one row to 20 cards to win ⭐
        </p>
        <p className="text-center text-sm text-white/80 mt-2 font-semibold">
          Build your rows: match the top card, go one higher, or go one lower · ★ Wild cards reset any row
        </p>
      </motion.div>

      {/* Card picker instructions */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="text-center font-bold text-lg mb-6 relative z-10"
        style={{ color: '#fbbf24', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}
      >
        Choose four cards to begin
      </motion.p>

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
          >
            <Card value={card.value} suit={card.suit} isSelected={selectedIndices.has(idx)} />
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
        <p className="mb-4 font-bold text-base" style={{ color: selectedIndices.size === 4 ? '#4ade80' : '#94a3b8', textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}>
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