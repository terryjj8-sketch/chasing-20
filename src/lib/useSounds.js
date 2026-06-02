import { useRef, useCallback } from 'react';

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

// Noise burst for swoosh/whoosh effects
function playNoise(ctx, { duration = 0.08, gain = 0.15, filterFreq = 2000 }) {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(filterFreq, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(filterFreq * 3, ctx.currentTime + duration);
  filter.Q.value = 0.8;

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(gain, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);
  source.start(ctx.currentTime);
  source.stop(ctx.currentTime + duration);
}

export function useSounds(enabled) {
  const ctxRef = useRef(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) ctxRef.current = createAudioCtx();
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  // Card flip: crisp paper snap + brief whoosh
  const playCardFlip = useCallback(() => {
    if (!enabled) return;
    const ctx = getCtx();
    playNoise(ctx, { duration: 0.06, gain: 0.25, filterFreq: 3000 });
    playTone(ctx, { frequency: 1200, type: 'triangle', duration: 0.05, gain: 0.1, rampTo: 900 });
  }, [enabled, getCtx]);

  // Card play: same sparkle trill as wild
  const playCardPlay = useCallback(() => {
    if (!enabled) return;
    const ctx = getCtx();
    [800, 1000, 1200, 1500, 1800].forEach((freq, i) => {
      setTimeout(() => playTone(ctx, { frequency: freq, type: 'sine', duration: 0.15, gain: 0.18 }), i * 45);
    });
    playNoise(ctx, { duration: 0.25, gain: 0.1, filterFreq: 4000 });
  }, [enabled, getCtx]);

  // Discard: silent
  const playDiscard = useCallback(() => {}, []);

  // Shuffle: rapid card flutter
  const playShuffle = useCallback(() => {
    if (!enabled) return;
    const ctx = getCtx();
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        playNoise(ctx, { duration: 0.05, gain: 0.12, filterFreq: 2000 + Math.random() * 2000 });
        playTone(ctx, { frequency: 500 + Math.random() * 600, type: 'triangle', duration: 0.05, gain: 0.08 });
      }, i * 55);
    }
  }, [enabled, getCtx]);

  // Win: triumphant ascending fanfare
  const playWin = useCallback(() => {
    if (!enabled) return;
    const ctx = getCtx();
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(ctx, { frequency: freq, type: 'sine', duration: 0.3, gain: 0.3 }), i * 120);
    });
  }, [enabled, getCtx]);

  // Undo: gentle rewind whoosh
  const playUndo = useCallback(() => {
    if (!enabled) return;
    const ctx = getCtx();
    playNoise(ctx, { duration: 0.1, gain: 0.12, filterFreq: 1200 });
    playTone(ctx, { frequency: 600, type: 'sine', duration: 0.12, gain: 0.2, rampTo: 350 });
  }, [enabled, getCtx]);

  // Row complete: sparkly fanfare
  const playRowComplete = useCallback(() => {
    if (!enabled) return;
    const ctx = getCtx();
    const notes = [523, 659, 784, 1047, 1319];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(ctx, { frequency: freq, type: 'sine', duration: 0.25, gain: 0.35 }), i * 90);
    });
    setTimeout(() => playTone(ctx, { frequency: 1568, type: 'triangle', duration: 0.4, gain: 0.2 }), 500);
  }, [enabled, getCtx]);

  // Wild card played: magical shimmer
  const playWild = useCallback(() => {
    if (!enabled) return;
    const ctx = getCtx();
    // Sparkle arpeggio
    [800, 1000, 1200, 1500, 1800].forEach((freq, i) => {
      setTimeout(() => playTone(ctx, { frequency: freq, type: 'sine', duration: 0.15, gain: 0.18 }), i * 45);
    });
    // Noise shimmer
    playNoise(ctx, { duration: 0.25, gain: 0.1, filterFreq: 4000 });
  }, [enabled, getCtx]);



  return { playCardFlip, playCardPlay, playDiscard, playShuffle, playWin, playUndo, playRowComplete, playWild };
}