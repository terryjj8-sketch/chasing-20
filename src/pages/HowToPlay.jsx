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
            Build <span className="text-secondary font-bold">two roads</span> to <span className="text-secondary font-bold">20+ cards each</span> before the cards run out. But not just any roads — the two roads <span className="text-secondary font-bold">you called</span>. An uncalled road can grow to 20 and it won't count.
          </p>
        </Section>

        {/* Setup */}
        <Section title="🃏 Setup" delay={0.2}>
          <ul className="text-foreground/80 space-y-2 leading-relaxed list-disc list-inside">
            <li>You are dealt <strong>6 cards</strong> face up.</li>
            <li>Pick <strong>4 of them</strong> — one to start each of your four rows.</li>
            <li>The 2 unchosen cards go back into the deck, which is then shuffled.</li>
          </ul>
        </Section>

        {/* Call Your Roads */}
        <Section title="🎯 Call Your Roads" delay={0.25}>
          <p className="text-foreground/80 leading-relaxed mb-2">
            Before you play a single card, <strong>tap the two roads you're betting on</strong>. Look at your starting cards, read the board, and commit. Then hit <strong>LOCK IN MY ROADS</strong>.
          </p>
          <p className="text-foreground/80 leading-relaxed mb-2">
            Only your called roads can win the game. Your calls are marked with a <span className="font-bold" style={{ color: '#fbbf24' }}>🎯 CALLED</span> badge for the whole game.
          </p>
          <p className="text-foreground/60 text-sm">
            This is where the skill lives — anyone can get lucky, but calling your roads means predicting how the game will go. Win with your calls and you bank credits.
          </p>
        </Section>

        {/* Playing */}
        <Section title="🔄 Taking a Turn" delay={0.3}>
          <ul className="text-foreground/80 space-y-2 leading-relaxed list-disc list-inside">
            <li>Tap the deck to flip the top card.</li>
            <li>You must either <strong>play it on a row</strong> or <strong>discard it</strong>.</li>
            <li>To play it, <strong>drag the face-up card</strong> onto a valid row and release it there.</li>
            <li>Valid rows light up as you drag so you can see exactly where the card can land.</li>
            <li>To throw it away, tap <strong>Discard</strong>.</li>
            <li>When the draw pile runs out, <strong>your discards shuffle back in</strong> — but cards played on roads are gone from the deck for good.</li>
            <li>The game ends when you win, or when no playable cards remain.</li>
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
        </Section>

        {/* Zeros */}
        <Section title="🛣️ Merging Roads — The Secret Weapon" delay={0.5}>
          <p className="text-foreground/80 leading-relaxed mb-2">
            Any road can be <strong>picked up and stacked onto another road</strong>. Drag a road's <strong>label</strong> (the "ROW 2" tag above the cards) onto another road.
          </p>
          <p className="text-foreground/80 leading-relaxed mb-2">
            The merge is legal when the ends connect: the target road's last card must be <strong>the same, one higher, or one lower</strong> than either end of the road you're dragging. If it only fits backwards, the road <strong>flips around automatically</strong>.
          </p>
          <p className="text-foreground/80 leading-relaxed mb-2">
            Legal targets <strong>glow</strong> while you drag. After a merge, the empty road can be restarted with any playable card.
          </p>
          <p className="text-foreground/80 leading-relaxed mb-2">
            If a <span className="font-bold" style={{ color: '#fbbf24' }}>🎯 called</span> road merges into another road, <strong>your call rides along with the cards</strong>. But your two called roads will <strong>never merge with each other</strong> — you committed to building two, so build two.
          </p>
          <p className="text-foreground/60 text-sm">
            Two short roads can become one long one — sometimes the winning move isn't playing a card, it's joining two highways.
          </p>
        </Section>

        {/* Flip a Road */}
        <Section title="⇅ Flip a Road — Once" delay={0.55}>
          <p className="text-foreground/80 leading-relaxed mb-2">
            Each road can be <strong>reversed one time per game</strong> — tap the <span className="font-bold" style={{ color: '#38bdf8' }}>⇅ FLIP</span> chip in its header and the road turns around, making its starting card the new playable end.
          </p>
          <p className="text-foreground/80 leading-relaxed mb-2">
            A road that started low and climbed high can flip back down and catch all those low cards again.
          </p>
          <p className="text-foreground/60 text-sm">
            One flip per road, no refunds — spend it when it counts. Merged roads share their flip: if either road already flipped, the combined road can't.
          </p>
        </Section>

        {/* Difficulty Modes */}
        <Section title="🎮 Difficulty Modes" delay={0.6}>
          <div className="grid grid-cols-1 gap-3">
            {/* Beginner */}
            <div className="rounded-xl p-4 border" style={{ background: 'rgba(16,185,129,0.12)', borderColor: 'rgba(16,185,129,0.4)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🌱</span>
                <span className="font-black text-base" style={{ color: '#10b981' }}>Beginner</span>
              </div>
              <ul className="text-foreground/80 text-sm space-y-1 leading-relaxed list-disc list-inside">
                <li>Valid rows <strong>glow and pulse</strong> ~2 seconds after you flip a card, so you know where you can drag before you even start</li>
                <li>The <strong>remaining deck count</strong> is shown on the deck</li>
                <li>Each road shows its <strong>card count</strong></li>
              </ul>
            </div>
            {/* Novice */}
            <div className="rounded-xl p-4 border" style={{ background: 'rgba(245,158,11,0.12)', borderColor: 'rgba(245,158,11,0.4)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🔥</span>
                <span className="font-black text-base" style={{ color: '#f59e0b' }}>Novice</span>
              </div>
              <ul className="text-foreground/80 text-sm space-y-1 leading-relaxed list-disc list-inside">
                <li><strong>No deck count</strong> shown — you won't know how many cards remain</li>
                <li>No road card counts — keep the count in your head</li>
              </ul>
            </div>
            {/* Pro */}
            <div className="rounded-xl p-4 border" style={{ background: 'rgba(236,72,153,0.12)', borderColor: 'rgba(236,72,153,0.4)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">⚡</span>
                <span className="font-black text-base" style={{ color: '#ec4899' }}>Pro</span>
              </div>
              <ul className="text-foreground/80 text-sm space-y-1 leading-relaxed list-disc list-inside">
                <li><strong>No hints</strong> — you must figure out valid roads yourself</li>
                <li><strong>No deck count</strong> shown</li>
                <li>No road card counts either — you're on your own</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Undo */}
        <Section title="↩️ Undo" delay={0.7}>
          <p className="text-foreground/80 leading-relaxed">
            Made a mistake? Tap the <strong>undo button</strong> (↩) to take back your last move. You can only undo one step at a time.
          </p>
        </Section>

        {/* Tips */}
        <Section title="💡 Tips" delay={0.8}>
          <ul className="text-foreground/80 space-y-2 leading-relaxed list-disc list-inside">
            <li>Pour your cards into your <strong>called roads</strong> — the other two are support, not destinations.</li>
            <li>Uncalled roads make great <strong>feeders</strong>: grow one, then merge it into a called road when the ends line up.</li>
            <li>Don't call two roads that are headed the <strong>same direction</strong> — they can never merge, and they'll fight over the same cards.</li>
            <li>Save your <strong>flips</strong> for when a road truly stalls — you only get one per road.</li>
            <li>Discarding is sometimes the right move, but the reshuffles are <strong>limited</strong> — don't burn cards carelessly.</li>
          </ul>
        </Section>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
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