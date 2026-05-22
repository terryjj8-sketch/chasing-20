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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 sm:mb-10"
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-3">Chasing 20</h1>
        <p className="text-sm text-foreground/60 mb-4">Finally, a better solitaire game.</p>
        <p className="text-lg text-foreground/70">Choose four cards, build your rows, beat the deck.</p>
        <button
          onClick={() => navigate('/how-to-play')}
          className="mt-3 text-sm text-primary/70 underline underline-offset-2 hover:text-primary transition-colors"
        >
          How to Play
        </button>
      </motion.div>

      {/* Difficulty Selector */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-8 w-full max-w-sm sm:max-w-none px-2 sm:px-0"
      >
        {DIFFICULTIES.map(d => (
          <button
            key={d.id}
            onClick={() => setDifficulty(d.id)}
            className="flex flex-col items-center px-4 py-3 rounded-xl border-2 transition-all duration-150 flex-1 sm:flex-none"
            style={{
              borderColor: difficulty === d.id ? 'hsl(var(--primary))' : 'rgba(255,255,255,0.15)',
              background: difficulty === d.id ? 'hsl(var(--primary) / 0.2)' : 'rgba(255,255,255,0.05)',
              color: difficulty === d.id ? 'hsl(var(--primary))' : 'rgba(255,255,255,0.5)',
            }}
          >
            <span className="font-bold text-sm">{d.label}</span>
            <span className="text-[10px] mt-1 text-center leading-tight opacity-80">{d.description}</span>
            <span className="text-[8px] mt-2 text-center leading-tight opacity-50">think before you drink</span>
          </button>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-3 sm:gap-4 flex-wrap justify-center max-w-2xl mb-8 sm:mb-12 px-2"
      >
        {displayCards.map((card, idx) => (
          <motion.button
            key={idx}
            onClick={() => toggleSelect(idx)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`transition-all duration-200 ${
              selectedIndices.has(idx) ? 'ring-4 ring-secondary scale-105' : ''
            }`}
          >
            <Card
              value={card.value}
              isSelected={selectedIndices.has(idx)}
            />
          </motion.button>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <p className="text-foreground/60 mb-4">
          {selectedIndices.size} / 4 cards selected
        </p>
        <Button
          onClick={handleStart}
          disabled={selectedIndices.size !== 4}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
        >
          Start Game
        </Button>
      </motion.div>
    </div>
  );
}