import { getSharedAudioContext } from './audioContext';

// Synthesized offline Web Audio API micro-sound effects (no external audio files required)
// Automatically softens when NAUTI is speaking so narration always remains crystal clear.

export type SoundFxType = 'tap' | 'confirm' | 'success' | 'alert' | 'science' | 'giggle';

export function playUiTone(
  type: SoundFxType,
  enabled = true,
  isNarrating = false,
) {
  if (!enabled) return;
  const ctx = getSharedAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  const now = ctx.currentTime;
  const duckScale = isNarrating ? 0.32 : 1;

  const playNote = (
    freq: number,
    startOffset: number,
    duration: number,
    wave: OscillatorType = 'sine',
    gainPeak = 0.06,
  ) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const peak = Math.max(0.001, gainPeak * duckScale);
    osc.type = wave;
    osc.frequency.setValueAtTime(freq, now + startOffset);
    gain.gain.setValueAtTime(0.0001, now + startOffset);
    gain.gain.exponentialRampToValueAtTime(peak, now + startOffset + 0.014);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + startOffset + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + startOffset);
    osc.stop(now + startOffset + duration + 0.025);
  };

  if (type === 'tap') {
    playNote(580, 0, 0.07, 'sine', 0.045);
  } else if (type === 'science') {
    playNote(523.25, 0, 0.09, 'triangle', 0.05);
    playNote(783.99, 0.07, 0.14, 'triangle', 0.05);
  } else if (type === 'confirm') {
    playNote(440, 0, 0.08, 'sine', 0.05);
    playNote(659.25, 0.07, 0.14, 'sine', 0.055);
  } else if (type === 'success') {
    playNote(523.25, 0, 0.1, 'triangle', 0.055);
    playNote(659.25, 0.08, 0.1, 'triangle', 0.055);
    playNote(783.99, 0.16, 0.22, 'triangle', 0.065);
  } else if (type === 'alert') {
    playNote(330, 0, 0.12, 'triangle', 0.04);
    playNote(277.18, 0.13, 0.18, 'triangle', 0.038);
  } else if (type === 'giggle') {
    // Cute bubbly staccato cartoon giggle ("ji-ji-ji!")
    if (isNarrating) return;
    playNote(698.46, 0.0, 0.075, 'sine', 0.05);
    playNote(880.0, 0.075, 0.075, 'sine', 0.055);
    playNote(783.99, 0.155, 0.07, 'sine', 0.048);
    playNote(987.77, 0.23, 0.09, 'sine', 0.055);
    playNote(1174.66, 0.325, 0.13, 'triangle', 0.045);
  }
}
