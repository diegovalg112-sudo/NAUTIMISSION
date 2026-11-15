import { getSharedAudioContext, unlockSharedAudioContext } from './audioContext';

/**
 * Original Procedural Kawaii-Space Soundtrack Engine for NAUTI Space Simulator.
 * 100% offline Web Audio API synthesis — zero external downloads, seamless lookahead looping,
 * smooth crossfade transitions between game moments, and automatic narration ducking.
 */

export type MusicTheme =
  | 'menu'
  | 'tutorial'
  | 'practice'
  | 'mission'
  | 'trivia'
  | 'danger'
  | 'victory';

interface ThemeScore {
  bpm: number;
  stepsPerBar: number;
  totalSteps: number;
  /** Lead melody (MIDI note or null for rest) */
  lead: (number | null)[];
  /** Lead synth character */
  leadTimbre: 'celesta' | 'pluck' | 'chime';
  /** Bassline (MIDI note or null) */
  bass: (number | null)[];
  /** Pad chords updated every 8 or 16 steps: [stepIndex, midiNotes[]] */
  chords: { step: number; notes: number[]; durationSteps: number }[];
  /** Soft cosmic arpeggio sparkle (MIDI note or null) */
  arp: (number | null)[];
  /** Optional light rhythmic tick (0 = off, 1 = soft shaker/blip) */
  pulse?: number[];
  /** For victory: play fanfare on first pass, then settle into gentle coda */
  victoryCoda?: boolean;
}

const midiToFreq = (midi: number): number => 440 * Math.pow(2, (midi - 69) / 12);

const THEME_SCORES: Record<MusicTheme, ThemeScore> = {
  // 1. Menú principal: alegre, acogedora, kawaii espacial (C Major, ~104 BPM)
  menu: {
    bpm: 104,
    stepsPerBar: 8,
    totalSteps: 32,
    leadTimbre: 'celesta',
    lead: [
      72, null, 76, 79, 84, null, 79, 76,
      74, null, 77, 81, 79, null, 76, null,
      72, 74, 76, 79, 83, null, 81, 79,
      76, null, 74, 72, 74, null, null, null,
    ],
    bass: [
      48, null, null, 55, 48, null, 55, null,
      45, null, null, 52, 43, null, 50, null,
      41, null, null, 48, 43, null, 50, null,
      48, null, 55, null, 43, null, null, null,
    ],
    arp: [
      null, 64, null, 67, null, 71, null, 67,
      null, 65, null, 69, null, 64, null, 67,
      null, 65, null, 69, null, 67, null, 71,
      null, 64, null, 67, null, 62, null, 67,
    ],
    chords: [
      { step: 0, notes: [60, 64, 67, 71], durationSteps: 8 },
      { step: 8, notes: [57, 60, 64, 67], durationSteps: 4 },
      { step: 12, notes: [55, 59, 62, 67], durationSteps: 4 },
      { step: 16, notes: [53, 57, 60, 64], durationSteps: 4 },
      { step: 20, notes: [55, 59, 62, 65], durationSteps: 4 },
      { step: 24, notes: [60, 64, 67, 71], durationSteps: 8 },
    ],
    pulse: [1, 0, 0, 0, 1, 0, 0, 0],
  },

  // 2. Tutorial: tranquila, cálida y propicia para comprender (F Major -> C Major, ~84 BPM)
  tutorial: {
    bpm: 84,
    stepsPerBar: 8,
    totalSteps: 32,
    leadTimbre: 'chime',
    lead: [
      72, null, null, 76, 74, null, null, null,
      69, null, null, 72, 71, null, null, null,
      72, null, 74, null, 76, null, 79, null,
      76, null, null, 74, 72, null, null, null,
    ],
    bass: [
      41, null, null, null, 48, null, null, null,
      45, null, null, null, 43, null, null, null,
      41, null, null, null, 43, null, null, null,
      48, null, null, null, 48, null, null, null,
    ],
    arp: [
      null, null, 65, null, null, 69, null, null,
      null, null, 64, null, null, 67, null, null,
      null, null, 65, null, null, 67, null, null,
      null, null, 64, null, null, 67, null, null,
    ],
    chords: [
      { step: 0, notes: [53, 57, 60, 64], durationSteps: 8 },
      { step: 8, notes: [57, 60, 64, 67], durationSteps: 8 },
      { step: 16, notes: [53, 57, 60, 65], durationSteps: 4 },
      { step: 20, notes: [55, 59, 62, 67], durationSteps: 4 },
      { step: 24, notes: [60, 64, 67, 71], durationSteps: 8 },
    ],
  },

  // 3. Modo de práctica: curiosa y juguetona (G Major, ~106 BPM)
  practice: {
    bpm: 106,
    stepsPerBar: 8,
    totalSteps: 32,
    leadTimbre: 'pluck',
    lead: [
      79, null, 76, 74, 79, null, 83, null,
      81, 79, 76, null, 74, null, 76, null,
      79, null, 81, 83, 86, null, 83, 81,
      79, null, 76, 74, 74, null, null, null,
    ],
    bass: [
      43, null, 50, null, 43, null, 50, null,
      45, null, 52, null, 50, null, 45, null,
      48, null, 55, null, 43, null, 50, null,
      48, null, 50, null, 43, null, null, null,
    ],
    arp: [
      null, 67, null, 71, null, 74, null, 71,
      null, 69, null, 72, null, 66, null, 72,
      null, 67, null, 72, null, 71, null, 74,
      null, 67, null, 69, null, 67, null, null,
    ],
    chords: [
      { step: 0, notes: [55, 59, 62, 66], durationSteps: 8 },
      { step: 8, notes: [57, 60, 64, 69], durationSteps: 8 },
      { step: 16, notes: [60, 64, 67, 71], durationSteps: 8 },
      { step: 24, notes: [55, 59, 62, 67], durationSteps: 8 },
    ],
    pulse: [1, 0, 1, 0, 1, 0, 1, 0],
  },

  // 4. Misiones de decisión: exploración lunar con ligero suspenso y maravilla (D Dorian, ~92 BPM)
  mission: {
    bpm: 92,
    stepsPerBar: 8,
    totalSteps: 32,
    leadTimbre: 'chime',
    lead: [
      74, null, null, 77, 76, null, 74, null,
      72, null, null, 74, 69, null, null, null,
      74, null, 77, null, 81, null, 79, 77,
      76, null, 74, null, 72, null, null, null,
    ],
    bass: [
      38, null, null, 45, 38, null, null, null,
      41, null, null, 48, 43, null, null, null,
      46, null, null, 53, 45, null, null, null,
      43, null, null, 50, 38, null, null, null,
    ],
    arp: [
      null, 62, null, 65, null, 69, null, 65,
      null, 60, null, 64, null, 67, null, 64,
      null, 62, null, 65, null, 69, null, 64,
      null, 62, null, 67, null, 62, null, null,
    ],
    chords: [
      { step: 0, notes: [50, 53, 57, 60], durationSteps: 8 },
      { step: 8, notes: [53, 57, 60, 64], durationSteps: 8 },
      { step: 16, notes: [58, 62, 65, 69], durationSteps: 8 },
      { step: 24, notes: [55, 57, 62, 67], durationSteps: 8 },
    ],
    pulse: [1, 0, 0, 0, 0, 0, 1, 0],
  },

  // 5. Trivias científicas: divertida y dinámica (F Major, ~114 BPM)
  trivia: {
    bpm: 114,
    stepsPerBar: 8,
    totalSteps: 32,
    leadTimbre: 'pluck',
    lead: [
      77, 79, 81, null, 84, null, 81, null,
      79, null, 77, 74, 77, null, null, null,
      81, 84, 86, null, 84, null, 81, 79,
      77, null, 79, 81, 77, null, null, null,
    ],
    bass: [
      41, null, 48, null, 41, null, 48, null,
      46, null, 53, null, 48, null, 55, null,
      41, null, 48, null, 46, null, 53, null,
      48, null, 55, null, 41, null, null, null,
    ],
    arp: [
      null, 65, null, 69, null, 72, null, 69,
      null, 65, null, 70, null, 67, null, 72,
      null, 65, null, 69, null, 70, null, 67,
      null, 67, null, 72, null, 65, null, 69,
    ],
    chords: [
      { step: 0, notes: [53, 57, 60, 65], durationSteps: 8 },
      { step: 8, notes: [58, 62, 65, 69], durationSteps: 4 },
      { step: 12, notes: [55, 60, 64, 67], durationSteps: 4 },
      { step: 16, notes: [53, 57, 60, 65], durationSteps: 4 },
      { step: 20, notes: [58, 62, 65, 70], durationSteps: 4 },
      { step: 24, notes: [55, 60, 64, 67], durationSteps: 8 },
    ],
    pulse: [1, 0, 1, 0, 1, 0, 1, 1],
  },

  // 6. Emergencias: tensión moderada sin resultar alarmante (A Minor, ~100 BPM)
  danger: {
    bpm: 100,
    stepsPerBar: 8,
    totalSteps: 32,
    leadTimbre: 'chime',
    lead: [
      76, null, null, 74, 72, null, null, null,
      74, null, 72, null, 69, null, null, null,
      76, null, 77, null, 76, null, 74, null,
      72, null, 71, null, 69, null, null, null,
    ],
    bass: [
      45, null, 45, null, 45, null, 52, null,
      41, null, 41, null, 43, null, 50, null,
      45, null, 45, null, 41, null, 48, null,
      43, null, 40, null, 45, null, null, null,
    ],
    arp: [
      null, 64, null, 69, null, 64, null, 69,
      null, 65, null, 69, null, 62, null, 67,
      null, 64, null, 69, null, 65, null, 69,
      null, 62, null, 64, null, 60, null, null,
    ],
    chords: [
      { step: 0, notes: [57, 60, 64], durationSteps: 8 },
      { step: 8, notes: [53, 57, 60], durationSteps: 4 },
      { step: 12, notes: [55, 59, 62], durationSteps: 4 },
      { step: 16, notes: [57, 60, 64], durationSteps: 8 },
      { step: 24, notes: [52, 56, 59], durationSteps: 4 },
      { step: 28, notes: [57, 60, 64], durationSteps: 4 },
    ],
    pulse: [1, 0, 0, 1, 1, 0, 0, 0],
  },

  // 7. Victoria: fanfarria breve alegre seguida de coda luminosa (C Major, ~110 BPM)
  victory: {
    bpm: 110,
    stepsPerBar: 8,
    totalSteps: 32,
    leadTimbre: 'celesta',
    victoryCoda: true,
    lead: [
      72, 76, 79, null, 84, null, 83, 84,
      86, null, 84, null, 79, null, null, null,
      76, 79, 84, null, 88, null, 84, null,
      83, null, 81, 83, 84, null, null, null,
    ],
    bass: [
      48, null, 55, null, 48, null, 55, null,
      41, null, 48, null, 43, null, 50, null,
      45, null, 52, null, 41, null, 48, null,
      43, null, 55, null, 48, null, null, null,
    ],
    arp: [
      null, 67, null, 72, null, 76, null, 72,
      null, 69, null, 72, null, 71, null, 74,
      null, 69, null, 72, null, 69, null, 72,
      null, 67, null, 71, null, 72, null, 76,
    ],
    chords: [
      { step: 0, notes: [60, 64, 67, 72], durationSteps: 8 },
      { step: 8, notes: [53, 57, 60, 65], durationSteps: 4 },
      { step: 12, notes: [55, 59, 62, 67], durationSteps: 4 },
      { step: 16, notes: [57, 60, 64, 67], durationSteps: 4 },
      { step: 20, notes: [53, 57, 60, 64], durationSteps: 4 },
      { step: 24, notes: [60, 64, 67, 72], durationSteps: 8 },
    ],
    pulse: [1, 0, 0, 0, 1, 0, 1, 0],
  },
};

class SpaceMusicEngine {
  private ctx: AudioContext | null = null;
  private userGain: GainNode | null = null;
  private duckGain: GainNode | null = null;
  private transitionGain: GainNode | null = null;
  private dryGain: GainNode | null = null;
  private echoSend: GainNode | null = null;

  private schedulerId: number | null = null;
  private transitionTimerId: number | null = null;
  private transitionToken = 0;

  private activeTheme: MusicTheme = 'menu';
  private targetTheme: MusicTheme = 'menu';
  private isPlaying = false;
  private stepIndex = 0;
  private loopCount = 0;
  private nextStepTime = 0;

  private userVolume = 0.45;
  private enabled = true;
  private isDucking = false;

  private ensureGraph(): AudioContext | null {
    const ctx = getSharedAudioContext();
    if (!ctx) return null;

    if (!this.userGain || this.ctx !== ctx) {
      this.ctx = ctx;

      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-18, ctx.currentTime);
      compressor.ratio.setValueAtTime(3, ctx.currentTime);
      compressor.connect(ctx.destination);

      this.userGain = ctx.createGain();
      this.duckGain = ctx.createGain();
      this.transitionGain = ctx.createGain();
      this.dryGain = ctx.createGain();
      this.echoSend = ctx.createGain();

      // Gentle dreamy cosmic delay bus
      const delay = ctx.createDelay(1.0);
      delay.delayTime.setValueAtTime(0.28, ctx.currentTime);
      const delayFilter = ctx.createBiquadFilter();
      delayFilter.type = 'lowpass';
      delayFilter.frequency.setValueAtTime(1550, ctx.currentTime);
      const delayFeedback = ctx.createGain();
      delayFeedback.gain.setValueAtTime(0.22, ctx.currentTime);

      delay.connect(delayFilter);
      delayFilter.connect(delayFeedback);
      delayFeedback.connect(delay);
      delayFilter.connect(this.transitionGain);

      this.dryGain.gain.setValueAtTime(0.92, ctx.currentTime);
      this.echoSend.gain.setValueAtTime(0.32, ctx.currentTime);

      this.dryGain.connect(this.transitionGain);
      this.echoSend.connect(delay);

      this.transitionGain.gain.setValueAtTime(1, ctx.currentTime);
      this.duckGain.gain.setValueAtTime(this.isDucking ? 0.22 : 1, ctx.currentTime);
      this.userGain.gain.setValueAtTime(
        this.enabled ? this.userVolume * 0.48 : 0,
        ctx.currentTime,
      );

      this.transitionGain.connect(this.duckGain);
      this.duckGain.connect(this.userGain);
      this.userGain.connect(compressor);
    }

    return ctx;
  }

  public async startOrResume(): Promise<void> {
    if (!this.enabled) return;
    const ctx = await unlockSharedAudioContext();
    if (!ctx) return;
    this.ensureGraph();

    if (this.isPlaying && this.schedulerId !== null) {
      return;
    }

    this.isPlaying = true;
    this.stepIndex = 0;
    this.loopCount = 0;
    this.nextStepTime = ctx.currentTime + 0.06;

    if (this.transitionGain) {
      this.transitionGain.gain.cancelScheduledValues(ctx.currentTime);
      this.transitionGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      this.transitionGain.gain.setTargetAtTime(1.0, ctx.currentTime, 0.24);
    }

    if (this.schedulerId !== null) {
      window.clearInterval(this.schedulerId);
    }

    this.schedulerId = window.setInterval(() => this.tick(), 25);
  }

  public stop(): void {
    if (this.schedulerId !== null) {
      window.clearInterval(this.schedulerId);
      this.schedulerId = null;
    }
    if (this.transitionTimerId !== null) {
      window.clearTimeout(this.transitionTimerId);
      this.transitionTimerId = null;
    }
    this.isPlaying = false;
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    const ctx = this.ensureGraph();
    if (ctx && this.userGain) {
      const target = enabled ? this.userVolume * 0.48 : 0;
      this.userGain.gain.setTargetAtTime(target, ctx.currentTime, 0.08);
    }
    if (!enabled) {
      this.stop();
    } else if (ctx && ctx.state === 'running') {
      void this.startOrResume();
    }
  }

  public setVolume(volume01: number): void {
    this.userVolume = Math.max(0, Math.min(1, volume01));
    const ctx = this.ensureGraph();
    if (ctx && this.userGain) {
      const target = this.enabled ? this.userVolume * 0.48 : 0;
      this.userGain.gain.setTargetAtTime(target, ctx.currentTime, 0.06);
    }
  }

  public setDucking(isSpeaking: boolean): void {
    this.isDucking = isSpeaking;
    const ctx = this.ensureGraph();
    if (ctx && this.duckGain) {
      const now = ctx.currentTime;
      if (isSpeaking) {
        this.duckGain.gain.setTargetAtTime(0.22, now, 0.08);
      } else {
        this.duckGain.gain.setTargetAtTime(1.0, now, 0.28);
      }
    }
  }

  public setTheme(nextTheme: MusicTheme): void {
    if (this.targetTheme === nextTheme && this.activeTheme === nextTheme) return;
    this.targetTheme = nextTheme;

    if (!this.isPlaying || !this.ctx || !this.transitionGain) {
      this.activeTheme = nextTheme;
      this.stepIndex = 0;
      this.loopCount = 0;
      return;
    }

    const token = ++this.transitionToken;
    if (this.transitionTimerId !== null) {
      window.clearTimeout(this.transitionTimerId);
    }

    const now = this.ctx.currentTime;
    this.transitionGain.gain.cancelScheduledValues(now);
    this.transitionGain.gain.setTargetAtTime(0.0001, now, 0.09);

    this.transitionTimerId = window.setTimeout(() => {
      if (token !== this.transitionToken || !this.ctx || !this.transitionGain) return;
      this.activeTheme = nextTheme;
      this.stepIndex = 0;
      this.loopCount = 0;
      this.nextStepTime = this.ctx.currentTime + 0.03;
      this.transitionGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.transitionGain.gain.setTargetAtTime(1.0, this.ctx.currentTime, 0.18);
    }, 280);
  }

  private tick(): void {
    if (!this.isPlaying || !this.ctx || !this.enabled) return;
    if (this.ctx.state !== 'running') return;

    const score = THEME_SCORES[this.activeTheme];
    const stepDuration = 60 / score.bpm / 2; // eighth-note step

    // Prevent catch-up bursts after tab backgrounding
    if (this.nextStepTime < this.ctx.currentTime - 0.35) {
      this.nextStepTime = this.ctx.currentTime + 0.05;
    }

    while (this.nextStepTime < this.ctx.currentTime + 0.14) {
      this.scheduleStep(score, this.stepIndex, this.nextStepTime, stepDuration);
      this.nextStepTime += stepDuration;
      this.stepIndex += 1;
      if (this.stepIndex >= score.totalSteps) {
        this.stepIndex = 0;
        this.loopCount += 1;
      }
    }
  }

  private scheduleStep(
    score: ThemeScore,
    step: number,
    time: number,
    stepDuration: number,
  ): void {
    const isVictoryCoda = Boolean(score.victoryCoda && this.loopCount > 0);

    // 1. Warm Space Pad Chords
    const chord = score.chords.find((c) => c.step === step);
    if (chord) {
      const dur = chord.durationSteps * stepDuration;
      this.playPadChord(chord.notes, time, dur, isVictoryCoda ? 0.045 : 0.055);
    }

    // 2. Lead Melody (softened in victory coda)
    const leadNote = score.lead[step];
    if (leadNote !== null && (!isVictoryCoda || step % 4 === 0)) {
      this.playLeadNote(
        midiToFreq(leadNote),
        time,
        stepDuration * (score.leadTimbre === 'chime' ? 2.2 : 1.5),
        score.leadTimbre,
        isVictoryCoda ? 0.055 : 0.09,
      );
    }

    // 3. Cozy Triangle Bass
    const bassNote = score.bass[step];
    if (bassNote !== null && !isVictoryCoda) {
      this.playBassNote(midiToFreq(bassNote), time, stepDuration * 1.85);
    }

    // 4. Soft Sparkling Arpeggio
    const arpNote = score.arp[step];
    if (arpNote !== null) {
      this.playSparkle(midiToFreq(arpNote), time, stepDuration * 1.15);
    }

    // 5. Gentle Micro-Pulse
    if (score.pulse && !isVictoryCoda) {
      const pulseVal = score.pulse[step % score.pulse.length];
      if (pulseVal) {
        this.playSoftPulse(time, pulseVal > 1 ? 0.018 : 0.012);
      }
    }
  }

  private playLeadNote(
    freq: number,
    time: number,
    duration: number,
    timbre: 'celesta' | 'pluck' | 'chime',
    peakGain: number,
  ): void {
    if (!this.ctx || !this.dryGain || !this.echoSend) return;

    const osc = this.ctx.createOscillator();
    const harmonic = this.ctx.createOscillator();
    const harmonicGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    const env = this.ctx.createGain();

    osc.type = timbre === 'pluck' ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(freq, time);

    harmonic.type = 'sine';
    harmonic.frequency.setValueAtTime(freq * 2, time);
    harmonicGain.gain.setValueAtTime(
      timbre === 'celesta' ? 0.25 : timbre === 'chime' ? 0.18 : 0.12,
      time,
    );

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(timbre === 'pluck' ? 2200 : 2800, time);
    filter.frequency.exponentialRampToValueAtTime(900, time + duration);

    env.gain.setValueAtTime(0.0001, time);
    env.gain.exponentialRampToValueAtTime(peakGain, time + 0.018);
    env.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    harmonic.connect(harmonicGain);
    harmonicGain.connect(filter);
    filter.connect(env);

    env.connect(this.dryGain);
    env.connect(this.echoSend);

    osc.start(time);
    harmonic.start(time);
    osc.stop(time + duration + 0.04);
    harmonic.stop(time + duration + 0.04);
  }

  private playPadChord(
    notes: number[],
    time: number,
    duration: number,
    peakPerVoice: number,
  ): void {
    if (!this.ctx || !this.dryGain) return;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(760, time);

    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0.0001, time);
    env.gain.linearRampToValueAtTime(peakPerVoice, time + Math.min(0.45, duration * 0.3));
    env.gain.setTargetAtTime(0.0001, time + duration * 0.68, duration * 0.22);

    filter.connect(env);
    env.connect(this.dryGain);

    for (const midi of notes) {
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(midiToFreq(midi), time);
      osc.connect(filter);
      osc.start(time);
      osc.stop(time + duration + 0.15);
    }
  }

  private playBassNote(freq: number, time: number, duration: number): void {
    if (!this.ctx || !this.dryGain) return;
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    env.gain.setValueAtTime(0.0001, time);
    env.gain.exponentialRampToValueAtTime(0.11, time + 0.025);
    env.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(env);
    env.connect(this.dryGain);

    osc.start(time);
    osc.stop(time + duration + 0.03);
  }

  private playSparkle(freq: number, time: number, duration: number): void {
    if (!this.ctx || !this.echoSend || !this.dryGain) return;
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    env.gain.setValueAtTime(0.0001, time);
    env.gain.exponentialRampToValueAtTime(0.038, time + 0.012);
    env.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(env);
    env.connect(this.dryGain);
    env.connect(this.echoSend);

    osc.start(time);
    osc.stop(time + duration + 0.03);
  }

  private playSoftPulse(time: number, gainPeak: number): void {
    if (!this.ctx || !this.dryGain) return;
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1600, time);
    osc.frequency.exponentialRampToValueAtTime(620, time + 0.035);

    env.gain.setValueAtTime(0.0001, time);
    env.gain.exponentialRampToValueAtTime(gainPeak, time + 0.005);
    env.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);

    osc.connect(env);
    env.connect(this.dryGain);
    osc.start(time);
    osc.stop(time + 0.05);
  }
}

export const musicEngine = new SpaceMusicEngine();
