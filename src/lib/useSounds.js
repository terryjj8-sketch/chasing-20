import { useRef, useCallback } from 'react';

// Generate sounds using Web Audio API
function createAudioCtx() {
  return new (window.AudioContext || window.webkitAudioContext)();
}

function playTone(ctx, { frequency = 440, type = 'sine', duration = 0.15, gain = 0.3, detune = 0, rampTo = null }) {
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);
  if (detune) osc.detune.setValueAtTime(detune, ctx.currentTime);
  gainNode.gain.setValueAtTime(gain, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  if (rampTo) osc.frequency.linearRampToValueAtTime(rampTo, ctx.currentTime + duration);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

export function useSounds(enabled) {
  const ctxRef = useRef(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) ctxRef.current = createAudioCtx();
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const playCardFlip = useCallback(() => {
    if (!enabled) return;
    const ctx = getCtx();
    playTone(ctx, { frequency: 800, type: 'triangle', duration: 0.08, gain: 0.2 });
    setTimeout(() => playTone(ctx, { frequency: 1000, type: 'triangle', duration: 0.06, gain: 0.15 }), 50);
  }, [enabled, getCtx]);

  const playCardPlay = useCallback(() => {
    if (!enabled) return;
    const ctx = getCtx();
    playTone(ctx, { frequency: 520, type: 'sine', duration: 0.12, gain: 0.25 });
    setTimeout(() => playTone(ctx, { frequency: 700, type: 'sine', duration: 0.1, gain: 0.2 }), 80);
  }, [enabled, getCtx]);

  const playDiscard = useCallback(() => {
    if (!enabled) return;
    const ctx = getCtx();
    playTone(ctx, { frequency: 300, type: 'sawtooth', duration: 0.15, gain: 0.15, rampTo: 150 });
  }, [enabled, getCtx]);

  const playShuffle = useCallback(() => {
    if (!enabled) return;
    const ctx = getCtx();
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        playTone(ctx, { frequency: 600 + Math.random() * 400, type: 'triangle', duration: 0.07, gain: 0.1 });
      }, i * 60);
    }
  }, [enabled, getCtx]);

  const playWin = useCallback(() => {
    if (!enabled) return;
    const ctx = getCtx();
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(ctx, { frequency: freq, type: 'sine', duration: 0.3, gain: 0.3 }), i * 120);
    });
  }, [enabled, getCtx]);

  const playUndo = useCallback(() => {
    if (!enabled) return;
    const ctx = getCtx();
    playTone(ctx, { frequency: 500, type: 'sine', duration: 0.1, gain: 0.2, rampTo: 350 });
  }, [enabled, getCtx]);

  return { playCardFlip, playCardPlay, playDiscard, playShuffle, playWin, playUndo };
}