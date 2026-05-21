import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function EndGamePhase({ rows, onPlayAgain }) {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const winningRows = rows.filter(r => r.cards.length >= 20);
    const isWin = winningRows.length > 0;

    setResult({
      isWin,
      winningRows,
      allRows: rows.map((r, idx) => ({
        number: idx + 1,
        cards: r.cards.length,
      })),
    });

    if (isWin) {
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }, 300);
    }
  }, [rows]);

  if (!result) return null;

  const accentHex = {
    0: '#B833FF',
    1: '#FF3399',
    2: '#FFD700',
    3: '#00D4FF',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-12"
      >
        {result.isWin ? (
          <>
            <motion.h1
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.6 }}
              className="text-6xl font-bold text-secondary mb-2"
            >
              🎉 YOU WIN! 🎉
            </motion.h1>
            <p className="text-xl text-foreground/70">
              Row {result.winningRows[0] + 1} reached 20 cards!
            </p>
          </>
        ) : (
          <>
            <h1 className="text-6xl font-bold text-destructive mb-2">Game Over</h1>
            <p className="text-xl text-foreground/70">
              No row reached 20 cards. Better luck next time!
            </p>
          </>
        )}
      </motion.div>

      {/* Results Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 gap-4 mb-12 max-w-md"
      >
        {result.allRows.map((row, idx) => {
          const isWinning = row.cards >= 20;
          return (
            <motion.div
              key={idx}
              animate={isWinning ? { scale: [1, 1.05, 1] } : {}}
              transition={{ delay: 0.1 * idx, duration: 0.5 }}
              className="bg-card/50 border-2 rounded-lg p-4 text-center"
              style={{
                borderColor: accentHex[idx],
                backgroundColor: isWinning ? `${accentHex[idx]}20` : undefined,
              }}
            >
              <div className="text-sm text-muted-foreground mb-2">Row {row.number}</div>
              <div className="text-4xl font-bold" style={{ color: accentHex[idx] }}>
                {row.cards}
              </div>
              <div className="text-xs text-foreground/60 mt-1">cards</div>
              {isWinning && (
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="mt-2 text-lg"
                >
                  ⭐
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Play Again Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          onClick={onPlayAgain}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
        >
          Play Again
        </Button>
      </motion.div>
    </div>
  );
}