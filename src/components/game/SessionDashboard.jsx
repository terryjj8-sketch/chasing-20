import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { formatTime } from './GameTimer';
import confetti from 'canvas-confetti';
import { Trophy, Timer, Target, TrendingUp, BarChart2, Star } from 'lucide-react';

const HISTORY_KEY = 'chasing20_session_history';
const MAX_HISTORY = 20;

const accentHex = { 0: '#B833FF', 1: '#FF3399', 2: '#FFD700', 3: '#00D4FF' };
const difficultyLabel = { easy: 'Beginner', medium: 'Novice', hard: 'Pro' };

// Efficiency = cards played into rows / total cards in deck (×100)
function calcEfficiency(rows, totalCards) {
  const played = rows.reduce((sum, r) => sum + r.cards.length, 0);
  // subtract the 4 starting cards since they weren't drawn from deck
  const actual = Math.max(played - 4, 0);
  return totalCards > 0 ? Math.round((actual / totalCards) * 100) : 0;
}

function saveGame(record) {
  const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  history.unshift(record);
  if (history.length > MAX_HISTORY) history.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  return history;
}

function StatCard({ icon: Icon, label, value, sub, accent, highlight }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl p-4 flex flex-col gap-1"
      style={{
        background: highlight ? `${accent}20` : 'rgba(255,255,255,0.05)',
        border: `1px solid ${highlight ? accent : 'rgba(255,255,255,0.1)'}`,
      }}
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest" style={{ color: accent }}>
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <div className="text-2xl font-black text-white">{value}</div>
      {sub && <div className="text-xs text-white/40">{sub}</div>}
    </motion.div>
  );
}

export default function SessionDashboard({ rows, finalTime, difficulty, totalCards, onPlayAgain }) {
  const [history, setHistory] = useState([]);
  const [thisGame, setThisGame] = useState(null);

  const isWin = rows.some(r => r.cards.length >= 20);
  const efficiency = calcEfficiency(rows, totalCards);

  useEffect(() => {
    const record = {
      date: Date.now(),
      isWin,
      finalTime,
      difficulty,
      efficiency,
      rowCounts: rows.map(r => r.cards.length),
    };
    setThisGame(record);
    const saved = saveGame(record);
    setHistory(saved);

    if (isWin) {
      setTimeout(() => confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } }), 300);
    }
  }, []);

  if (!thisGame) return null;

  const previousGames = history.slice(1); // exclude current
  const wins = history.filter(g => g.isWin);
  const bestTime = wins.length ? Math.min(...wins.map(g => g.finalTime)) : null;
  const avgEfficiency = history.length > 1
    ? Math.round(previousGames.reduce((s, g) => s + g.efficiency, 0) / previousGames.length)
    : null;
  const isNewBest = isWin && bestTime === finalTime && wins.length === 1 || (isWin && finalTime === bestTime && wins.filter(g => g.finalTime === finalTime).length === 1);
  const efficiencyDiff = avgEfficiency !== null ? efficiency - avgEfficiency : null;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start p-4 sm:p-6 overflow-y-auto"
      style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1a1a3e 50%, #0f172a 100%)' }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', bounce: 0.4 }}
        className="text-center mt-4 mb-6"
      >
        {isWin ? (
          <>
            <div className="text-5xl mb-2">🎉</div>
            <h1 className="text-4xl sm:text-5xl font-black text-yellow-400" style={{ textShadow: '0 0 30px rgba(251,191,36,0.6)' }}>
              YOU WIN!
            </h1>
            <p className="text-white/60 mt-1 text-sm">Row {rows.findIndex(r => r.cards.length >= 20) + 1} reached 20 cards</p>
            <p className="text-base font-bold text-white mt-3">That was great. See if you can do it again.</p>
          </>
        ) : (
          <>
            <div className="text-5xl mb-2">💀</div>
            <h1 className="text-4xl sm:text-5xl font-black text-red-400">Game Over</h1>
            <p className="text-base font-bold text-white mt-3">You were so close. Let's go again.</p>
          </>
        )}
        <div className="mt-2 text-xs font-bold px-3 py-1 rounded-full inline-block" style={{ background: 'rgba(255,255,255,0.1)', color: '#94a3b8' }}>
          {difficultyLabel[difficulty] || difficulty} mode
        </div>
      </motion.div>

      {/* Main stats row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-3 gap-3 w-full max-w-md mb-4"
      >
        <StatCard
          icon={Timer}
          label="Time"
          value={formatTime(finalTime)}
          sub={isNewBest ? '🏆 New Best!' : bestTime && bestTime !== finalTime ? `Best: ${formatTime(bestTime)}` : null}
          accent="#38bdf8"
          highlight={isNewBest}
        />
        <StatCard
          icon={Target}
          label="Efficiency"
          value={`${efficiency}%`}
          sub={efficiencyDiff !== null ? `${efficiencyDiff >= 0 ? '+' : ''}${efficiencyDiff}% vs avg` : 'First game'}
          accent={efficiency >= 50 ? '#4ade80' : '#f59e0b'}
          highlight={efficiencyDiff !== null && efficiencyDiff > 0}
        />
        <StatCard
          icon={Trophy}
          label="Win Rate"
          value={history.length ? `${Math.round((wins.length / history.length) * 100)}%` : '—'}
          sub={`${wins.length}/${history.length} games`}
          accent="#fbbf24"
          highlight={false}
        />
      </motion.div>

      {/* Row breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="grid grid-cols-4 gap-2 w-full max-w-md mb-4"
      >
        {rows.map((row, idx) => {
          const isWinRow = row.cards.length >= 20;
          return (
            <div
              key={idx}
              className="rounded-xl p-3 text-center"
              style={{
                background: isWinRow ? `${accentHex[idx]}25` : 'rgba(255,255,255,0.04)',
                border: `2px solid ${isWinRow ? accentHex[idx] : 'rgba(255,255,255,0.08)'}`,
              }}
            >
              <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: accentHex[idx] }}>
                Row {idx + 1}
              </div>
              <div className="text-2xl font-black" style={{ color: accentHex[idx] }}>{row.cards.length}</div>
              <div className="text-[9px] text-white/40 mt-0.5">cards</div>
              {isWinRow && <div className="text-lg mt-1">⭐</div>}
            </div>
          );
        })}
      </motion.div>

      {/* Recent games mini-chart */}
      {history.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="w-full max-w-md mb-4 rounded-xl p-4"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <BarChart2 className="w-4 h-4 text-white/50" />
            <span className="text-xs font-bold uppercase tracking-widest text-white/50">Recent Games</span>
          </div>
          <div className="flex items-end gap-1.5 h-16">
            {history.slice(0, 10).reverse().map((g, i) => {
              const maxEff = Math.max(...history.slice(0, 10).map(x => x.efficiency), 1);
              const barH = Math.max(8, Math.round((g.efficiency / maxEff) * 56));
              const isThis = i === history.slice(0, 10).length - 1;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-sm"
                    style={{
                      height: barH,
                      background: isThis
                        ? (isWin ? '#4ade80' : '#f87171')
                        : (g.isWin ? 'rgba(74,222,128,0.5)' : 'rgba(248,113,113,0.4)'),
                      transition: 'height 0.4s',
                    }}
                  />
                  {isThis && <Star className="w-2.5 h-2.5 text-yellow-400" />}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[9px] text-white/30">oldest</span>
            <span className="text-[9px] text-white/30">this game ★</span>
          </div>
        </motion.div>
      )}

      {/* Play Again */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mb-8"
      >
        <Button
          onClick={onPlayAgain}
          className="px-10 py-3 text-lg font-black rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, #facc15, #fb923c, #f472b6)',
            color: '#1e1b4b',
            boxShadow: '0 6px 30px rgba(251,146,60,0.4)',
          }}
        >
          🎲 Play Again
        </Button>
      </motion.div>
    </div>
  );
}