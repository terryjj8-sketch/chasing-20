import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { formatTime } from './GameTimer';
import confetti from 'canvas-confetti';
import { Trophy, Timer, Target, BarChart2, Star, Globe } from 'lucide-react';
import Leaderboard from './Leaderboard';

const HISTORY_KEY = 'chasing20_session_history';
const LEADERBOARD_KEY = 'chasing20_leaderboard';
const PLAYER_NAME_KEY = 'chasing20_player_name';
const MAX_HISTORY = 20;

const accentHex = { 0: '#B833FF', 1: '#FF3399', 2: '#FFD700', 3: '#00D4FF' };
const difficultyLabel = { easy: 'Beginner', medium: 'Novice', hard: 'Pro' };

function calcEfficiency(rows, totalCards) {
  const played = rows.reduce((sum, r) => sum + r.cards.length, 0);
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

// Upsert a leaderboard entry in localStorage
function upsertLeaderboard(playerName, difficulty, isWin, finalTime) {
  const all = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]');
  const idx = all.findIndex(
    e => e.player_name === playerName && e.difficulty === difficulty
  );
  if (idx >= 0) {
    const e = all[idx];
    all[idx] = {
      ...e,
      wins: (e.wins || 0) + (isWin ? 1 : 0),
      total_games: (e.total_games || 0) + 1,
      best_time:
        isWin
          ? e.best_time
            ? Math.min(e.best_time, finalTime)
            : finalTime
          : e.best_time,
    };
  } else {
    all.push({
      player_name: playerName,
      difficulty,
      wins: isWin ? 1 : 0,
      total_games: 1,
      best_time: isWin ? finalTime : null,
    });
  }
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(all));
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
      <div
        className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest"
        style={{ color: accent }}
      >
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <div className="text-2xl font-black text-white">{value}</div>
      {sub && <div className="text-xs text-white/40">{sub}</div>}
    </motion.div>
  );
}

export default function SessionDashboard({
  rows,
  finalTime,
  difficulty,
  totalCards,
  onPlayAgain,
}) {
  const [history, setHistory] = useState([]);
  const [thisGame, setThisGame] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [playerName, setPlayerName] = useState(
    () => localStorage.getItem(PLAYER_NAME_KEY) || ''
  );
  const [nameInput, setNameInput] = useState('');
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
      setTimeout(
        () => confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } }),
        300
      );
    }
  }, []);

  const submitScore = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    localStorage.setItem(PLAYER_NAME_KEY, trimmed);
    setPlayerName(trimmed);
    setShowNamePrompt(false);
    setSubmitted(true);
    upsertLeaderboard(trimmed, difficulty, isWin, finalTime);
  };

  const handleSubmitClick = () => {
    if (playerName) {
      submitScore(playerName);
    } else {
      setNameInput('');
      setShowNamePrompt(true);
    }
  };

  if (!thisGame) return null;

  const previousGames = history.slice(1);
  const wins = history.filter(g => g.isWin);
  const bestTime = wins.length ? Math.min(...wins.map(g => g.finalTime)) : null;
  const avgEfficiency =
    history.length > 1
      ? Math.round(
          previousGames.reduce((s, g) => s + g.efficiency, 0) /
            previousGames.length
        )
      : null;
  const isNewBest =
    isWin &&
    bestTime === finalTime &&
    wins.filter(g => g.finalTime === finalTime).length === 1;
  const efficiencyDiff =
    avgEfficiency !== null ? efficiency - avgEfficiency : null;

  const NamePromptModal = showNamePrompt && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-gray-900 border border-white/20 rounded-2xl p-6 w-full max-w-xs text-white">
        <h3 className="font-black text-lg mb-3">Enter your name</h3>
        <input
          autoFocus
          value={nameInput}
          onChange={e => setNameInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submitScore(nameInput)}
          placeholder="Your name..."
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/30 outline-none focus:border-yellow-400 mb-4"
        />
        <div className="flex gap-2">
          <button
            onClick={() => setShowNamePrompt(false)}
            className="flex-1 py-2 rounded-lg text-sm text-white/50 border border-white/10"
          >
            Cancel
          </button>
          <button
            onClick={() => submitScore(nameInput)}
            className="flex-1 py-2 rounded-lg text-sm font-black"
            style={{
              background: 'linear-gradient(135deg,#facc15,#fb923c)',
              color: '#1e1b4b',
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {NamePromptModal}
      {showLeaderboard && (
        <Leaderboard onClose={() => setShowLeaderboard(false)} />
      )}
      <div
        className="min-h-screen flex flex-col items-center justify-start p-4 sm:p-6 overflow-y-auto"
        style={{
          background:
            'linear-gradient(160deg, #0f172a 0%, #1a1a3e 50%, #0f172a 100%)',
        }}
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
              <div className="text-5xl mb-2">🏆</div>
              <h1
                className="text-4xl sm:text-5xl font-black text-yellow-400"
                style={{ textShadow: '0 0 30px rgba(251,191,36,0.6)' }}
              >
                YOU WIN!
              </h1>
              <p className="text-white/60 mt-1 text-sm">
                Row {rows.findIndex(r => r.cards.length >= 20) + 1} reached 20
                cards
              </p>
              <p className="text-base font-bold text-white mt-3">
                That was great. See if you can do it again.
              </p>
            </>
          ) : (
            <>
              <div className="text-5xl mb-2">🎮</div>
              <h1 className="text-4xl sm:text-5xl font-black text-red-400">
                Game Over
              </h1>
              <p className="text-base font-bold text-white mt-3">
                You were so close. Let's go again.
              </p>
            </>
          )}
          <div
            className="mt-2 text-xs font-bold px-3 py-1 rounded-full inline-block"
            style={{ background: 'rgba(255,255,255,0.1)', color: '#94a3b8' }}
          >
            {difficultyLabel[difficulty] || difficulty} mode
          </div>
        </motion.div>

        {/* Main stats */}
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
            sub={
              isNewBest
                ? '⭐ New Best!'
                : bestTime && bestTime !== finalTime
                ? `Best: ${formatTime(bestTime)}`
                : null
            }
            accent="#38bdf8"
            highlight={isNewBest}
          />
          <StatCard
            icon={Target}
            label="Efficiency"
            value={`${efficiency}%`}
            sub={
              efficiencyDiff !== null
                ? `${efficiencyDiff >= 0 ? '+' : ''}${efficiencyDiff}% vs avg`
                : 'First game'
            }
            accent={efficiency >= 50 ? '#4ade80' : '#f59e0b'}
            highlight={efficiencyDiff !== null && efficiencyDiff > 0}
          />
          <StatCard
            icon={Trophy}
            label="Win Rate"
            value={
              history.length
                ? `${Math.round((wins.length / history.length) * 100)}%`
                : '‚Äî'
            }
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
                  background: isWinRow
                    ? `${accentHex[idx]}25`
                    : 'rgba(255,255,255,0.04)',
                  border: `2px solid ${
                    isWinRow ? accentHex[idx] : 'rgba(255,255,255,0.08)'
                  }`,
                }}
              >
                <div
                  className="text-[10px] font-bold uppercase tracking-widest mb-1"
                  style={{ color: accentHex[idx] }}
                >
                  Row {idx + 1}
                </div>
                <div
                  className="text-2xl font-black"
                  style={{ color: accentHex[idx] }}
                >
                  {row.cards.length}
                </div>
                <div className="text-[9px] text-white/40 mt-0.5">cards</div>
                {isWinRow && <div className="text-lg mt-1">‚≠ê</div>}
              </div>
            );
          })}
        </motion.div>

        {/* Recent games chart */}
        {history.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="w-full max-w-md mb-4 rounded-xl p-4"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <BarChart2 className="w-4 h-4 text-white/50" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/50">
                Recent Games
              </span>
            </div>
            <div className="flex items-end gap-1.5 h-16">
              {history
                .slice(0, 10)
                .reverse()
                .map((g, i) => {
                  const maxEff = Math.max(
                    ...history.slice(0, 10).map(x => x.efficiency),
                    1
                  );
                  const barH = Math.max(8, Math.round((g.efficiency / maxEff) * 56));
                  const isThis = i === history.slice(0, 10).length - 1;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-sm"
                        style={{
                          height: barH,
                          background: isThis
                            ? isWin
                              ? '#4ade80'
                              : '#f87171'
                            : g.isWin
                            ? 'rgba(74,222,128,0.5)'
                            : 'rgba(248,113,113,0.4)',
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
              <span className="text-[9px] text-white/30">this game →</span>
            </div>
          </motion.div>
        )}

        {/* Submit + Leaderboard */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="flex flex-col items-center gap-3 mb-4 w-full max-w-md"
        >
          <div className="flex gap-3 w-full">
            {!submitted ? (
              <button
                onClick={handleSubmitClick}
                className="flex-1 py-2.5 rounded-xl text-sm font-black border border-yellow-400/40 text-yellow-400 hover:bg-yellow-400/10 transition-all"
              >
                {playerName ? `Submit as "${playerName}"` : '🎯 Submit Score'}
              </button>
            ) : (
              <div className="flex-1 py-2.5 rounded-xl text-sm font-bold text-center text-green-400 border border-green-400/30">
                ‚úÖ Score submitted!
              </div>
            )}
            <button
              onClick={() => setShowLeaderboard(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-black border border-white/20 text-white/70 hover:bg-white/10 transition-all"
            >
              <Globe className="w-4 h-4" /> Leaderboard
            </button>
          </div>
        </motion.div>

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
            Play Again
          </Button>
        </motion.div>
      </div>
    </>
  );
}
