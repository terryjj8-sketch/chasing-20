import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const Section = ({ title, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white/5 border border-primary/20 rounded-xl p-5 mb-4"
  >
    <h2 className="text-lg font-bold text-primary mb-3">{title}</h2>
    {children}
  </motion.div>
);

export default function HowToPlay() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex flex-col">
      {/* Banner */}
      <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border-b border-primary/30 px-4 py-3 text-center">
        <div className="text-sm font-semibold tracking-widest text-primary">
          chasing 20 the most difficult solitaire game you'll ever play
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-primary mb-2">How to Play</h1>
          <p className="text-foreground/60">Chasing 20</p>
        </motion.div>

        {/* Goal */}
        <Section title="🎯 The Goal" delay={0.1}>
          <p className="text-foreground/80 leading-relaxed">
            Get <span className="text-secondary font-bold">any one of your four rows</span> to reach <span className="text-secondary font-bold">20 cards</span> before the deck runs out. That's all it takes to win — but it's harder than it sounds.
          </p>
        </Section>

        {/* Setup */}
        <Section title="🃏 Setup" delay={0.2}>
          <ul className="text-foreground/80 space-y-2 leading-relaxed list-disc list-inside">
            <li>You are dealt <strong>6 cards</strong> face up.</li>
            <li>Pick <strong>4 of them</strong> — one to start each of your four rows.</li>
            <li><strong>Zeros cannot start your rows</strong> — you must pick numbered cards.</li>
            <li>The 2 unchosen cards go back into the deck, which is then shuffled.</li>
          </ul>
        </Section>

        {/* Playing */}
        <Section title="🔄 Taking a Turn" delay={0.3}>
          <ul className="text-foreground/80 space-y-2 leading-relaxed list-disc list-inside">
            <li>Tap the deck to flip the top card.</li>
            <li>You must either <strong>play it on a row</strong> or <strong>discard it</strong>.</li>
            <li>To play it, tap a valid row to select it, then tap <strong>Play</strong>.</li>
            <li>To throw it away, tap <strong>Discard</strong>.</li>
            <li>The game ends when the deck is empty.</li>
          </ul>
        </Section>

        {/* Rules */}
        <Section title="📏 The Rules — What Makes a Card Valid?" delay={0.4}>
          <p className="text-foreground/70 mb-3">A card can only be played on a row if its value is:</p>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-primary/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-black text-primary">+1</div>
              <div className="text-xs text-foreground/60 mt-1">One more than the row's current number</div>
            </div>
            <div className="bg-secondary/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-black text-secondary">−1</div>
              <div className="text-xs text-foreground/60 mt-1">One less than the row's current number</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-black text-foreground">=</div>
              <div className="text-xs text-foreground/60 mt-1">The same as the row's current number</div>
            </div>
          </div>
          <p className="text-foreground/70 text-sm mb-2">
            Example: if a row's current card is <strong>7</strong>, you can play a <strong>6</strong>, <strong>7</strong>, or <strong>8</strong> on it.
          </p>
          <p className="text-foreground/70 text-sm">
            You can also play a <strong>0</strong> on any row to reset it — the next card can be any value.
          </p>
        </Section>

        {/* Zeros */}
        <Section title="✨ Zero Cards — The Wild Reset" delay={0.5}>
          <p className="text-foreground/80 leading-relaxed mb-2">
            Zero cards are special. Playing a zero on a row <strong>resets it</strong> — the next card played there can be <em>any</em> value.
          </p>
          <p className="text-foreground/80 leading-relaxed mb-2">
            Each row can only receive <strong>3 zeros</strong> total. After the third zero, no more zeros can be played on that row.
          </p>
          <p className="text-foreground/60 text-sm">
            Use zeros wisely — they're your best tool for jumping to a new number sequence.
          </p>
        </Section>

        {/* Undo */}
        <Section title="↩️ Undo" delay={0.6}>
          <p className="text-foreground/80 leading-relaxed">
            Made a mistake? Tap the <strong>undo button</strong> (↩) to take back your last move. You can only undo one step at a time.
          </p>
        </Section>

        {/* Tips */}
        <Section title="💡 Tips" delay={0.7}>
          <ul className="text-foreground/80 space-y-2 leading-relaxed list-disc list-inside">
            <li>Focus your effort on <strong>one or two rows</strong> — spreading evenly rarely wins.</li>
            <li>Save zeros for when you're stuck, not just for convenience.</li>
            <li>Discarding is sometimes the right move — don't force bad plays.</li>
            <li>The deck has <strong>90 cards</strong>. Getting to 20 in one row means using roughly 1 in 4.5 cards wisely.</li>
          </ul>
        </Section>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6 mb-8"
        >
          <Button
            onClick={() => navigate('/')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Game
          </Button>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="border-t border-primary/30 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 px-4 py-3 text-center">
        <div className="text-xs text-foreground/50 tracking-wide">
          Copyright © 2026 Twssguy, llc. All rights reserved.
        </div>
      </div>
    </div>
  );
}