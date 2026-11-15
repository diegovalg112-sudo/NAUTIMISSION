import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Headphones,
  Lightbulb,
  Lock,
  MessageSquare,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Tag,
  Timer,
  Volume2,
} from 'lucide-react';
import { getEscuchaImaginaStrings } from '../data/escuchaImaginaStrings';
import { UI_STRINGS } from '../data/uiStrings';
import type { MusicAudioControls } from '../hooks/useMusicAudio';
import type { SpeechControlsState } from '../hooks/useSpeech';
import type {
  EscuchaEpisodeProgress,
  EscuchaStage,
  TechnologyEpisodeRecord,
} from '../types/escuchaImagina';
import { playUiTone } from '../utils/soundFx';
import { FilomatasLogo } from './FilomatasLogo';
import { LanguageSelector } from './LanguageSelector';
import { NautiCharacterRig } from './NautiCharacterRig';
import { NautiLogo } from './NautiLogo';
import { SolarArrayReferenceDiagram } from './SolarArrayReferenceDiagram';
import { SoundControlButton } from './SoundControlButton';

interface EscuchaImaginaRunnerProps {
  episode: TechnologyEpisodeRecord;
  esEpisodeRef: TechnologyEpisodeRecord;
  enEpisodeRef: TechnologyEpisodeRecord;
  progress: EscuchaEpisodeProgress;
  onChangeProgress: (next: EscuchaEpisodeProgress) => void;
  audio: MusicAudioControls;
  speech: SpeechControlsState;
  onOpenVoiceSettings: () => void;
  onBackToLibrary: () => void;
  hasNextEpisode: boolean;
  onNextEpisode?: () => void;
}

const STAGE_ORDER: readonly EscuchaStage[] = [
  'podcast',
  'challenge',
  'timer',
  'reveal',
  'reflection',
] as const;

const CHALLENGE_TIMER_SECONDS = 120;

function formatClock(totalSeconds: number): string {
  const clamped = Math.max(0, Math.ceil(totalSeconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export const EscuchaImaginaRunner: React.FC<EscuchaImaginaRunnerProps> = ({
  episode,
  esEpisodeRef,
  enEpisodeRef,
  progress,
  onChangeProgress,
  audio,
  speech,
  onOpenVoiceSettings,
  onBackToLibrary,
  hasNextEpisode,
  onNextEpisode,
}) => {
  const t = UI_STRINGS[audio.audioLang];
  const s = getEscuchaImaginaStrings(audio.audioLang);

  // Podcast segmented player state
  const [podcastIndex, setPodcastIndex] = useState<number>(0);
  const [podcastStatus, setPodcastStatus] = useState<
    'idle' | 'playing' | 'paused' | 'completed'
  >('idle');

  // Challenge audio player state ('intro' announcement or 'description' spatial clues)
  const [challengeTrack, setChallengeTrack] = useState<'intro' | 'description'>(
    'intro',
  );
  const [challengeSegmentIndex, setChallengeSegmentIndex] = useState<number>(0);
  const [challengeStatus, setChallengeStatus] = useState<
    'idle' | 'playing' | 'paused' | 'completed'
  >('idle');
  const [challengeTranscriptOpen, setChallengeTranscriptOpen] =
    useState<boolean>(false);

  // Two-minute drawing timer state (timestamp-anchored to prevent drift across rerenders)
  const [timerStatus, setTimerStatus] = useState<
    'idle' | 'running' | 'paused' | 'expired'
  >(progress.timerCompleted ? 'expired' : 'idle');
  const [remainingSeconds, setRemainingSeconds] = useState<number>(
    progress.timerCompleted ? 0 : progress.timerDurationSeconds,
  );
  const [restartConfirmOpen, setRestartConfirmOpen] = useState<boolean>(false);
  const [earlyFinishConfirmOpen, setEarlyFinishConfirmOpen] =
    useState<boolean>(false);

  // Reveal stage state
  const [showPartLabels, setShowPartLabels] = useState<boolean>(false);

  // Refs for stable async timer & audio sequencing callbacks
  const endTimestampRef = useRef<number | null>(null);
  const remainingMsRef = useRef<number>(
    (progress.timerCompleted ? 0 : progress.timerDurationSeconds) * 1000,
  );
  const completionPlayedRef = useRef<boolean>(progress.timerCompleted);
  const playbackGenRef = useRef<number>(0);
  const segmentDelayTimerRef = useRef<number | null>(null);

  const stageIdx = STAGE_ORDER.indexOf(progress.stage);

  const cancelSegmentedAudio = useCallback(() => {
    playbackGenRef.current += 1;
    if (segmentDelayTimerRef.current !== null) {
      window.clearTimeout(segmentDelayTimerRef.current);
      segmentDelayTimerRef.current = null;
    }
    speech.stop();
  }, [speech]);

  useEffect(() => {
    return () => {
      playbackGenRef.current += 1;
      if (segmentDelayTimerRef.current !== null) {
        window.clearTimeout(segmentDelayTimerRef.current);
      }
    };
  }, []);

  // Stop active audio & close dialogs cleanly when switching stages or episodes
  const goToStage = useCallback(
    (nextStage: EscuchaStage) => {
      cancelSegmentedAudio();
      if (timerStatus === 'running') {
        if (endTimestampRef.current !== null) {
          remainingMsRef.current = Math.max(
            0,
            endTimestampRef.current - Date.now(),
          );
          endTimestampRef.current = null;
          setRemainingSeconds(Math.ceil(remainingMsRef.current / 1000));
        }
        setTimerStatus('paused');
      }
      setPodcastStatus((prev) => (prev === 'playing' ? 'paused' : prev));
      setChallengeStatus((prev) => (prev === 'playing' ? 'paused' : prev));
      setRestartConfirmOpen(false);
      setEarlyFinishConfirmOpen(false);
      playUiTone('tap', audio.sfxEnabled, false);
      onChangeProgress({
        ...progress,
        stage: nextStage,
      });
    },
    [
      cancelSegmentedAudio,
      timerStatus,
      audio.sfxEnabled,
      onChangeProgress,
      progress,
    ],
  );

  const ensureSpeechAvailableOrNotify = useCallback(() => {
    if (
      audio.audioLang === 'gn-PY' &&
      !speech.isGuaraniVoiceSupported &&
      speech.guaraniFallbackMode === 'none'
    ) {
      onOpenVoiceSettings();
      return false;
    }
    return true;
  }, [
    audio.audioLang,
    speech.isGuaraniVoiceSupported,
    speech.guaraniFallbackMode,
    onOpenVoiceSettings,
  ]);

  // Play a sequence of segments one-by-one with natural expressive pauses
  const speakSegmentSequence = useCallback(
    (
      segments: readonly string[],
      esSegments: readonly string[],
      enSegments: readonly string[],
      startIndex: number,
      pauseMsBetweenSegments: number,
      onIndexActive: (idx: number) => void,
      onSequenceComplete: () => void,
    ) => {
      if (!segments.length) return;
      if (!ensureSpeechAvailableOrNotify()) return;

      cancelSegmentedAudio();
      const myGen = playbackGenRef.current;
      audio.unlockAndStart();
      speech.markUserUnlocked();

      const playIdx = (idx: number) => {
        if (playbackGenRef.current !== myGen) return;
        if (idx >= segments.length) {
          onSequenceComplete();
          return;
        }
        onIndexActive(idx);
        const text = segments[idx];
        const esFallback = esSegments[idx] ?? text;
        const enFallback = enSegments[idx] ?? text;

        speech.speak(text, {
          force: true,
          fallbackTexts: {
            es: esFallback,
            en: enFallback,
          },
          onEnd: () => {
            if (playbackGenRef.current !== myGen) return;
            if (idx + 1 >= segments.length) {
              onSequenceComplete();
              return;
            }
            segmentDelayTimerRef.current = window.setTimeout(() => {
              if (playbackGenRef.current !== myGen) return;
              playIdx(idx + 1);
            }, pauseMsBetweenSegments);
          },
        });
      };

      playIdx(Math.max(0, Math.min(startIndex, segments.length - 1)));
    },
    [
      ensureSpeechAvailableOrNotify,
      cancelSegmentedAudio,
      audio,
      speech,
    ],
  );

  // Podcast controls
  const startOrResumePodcast = (fromIndex = podcastIndex) => {
    const startAt =
      podcastStatus === 'completed' || fromIndex >= episode.podcastSegments.length
        ? 0
        : fromIndex;
    setPodcastStatus('playing');
    speakSegmentSequence(
      episode.podcastSegments,
      esEpisodeRef.podcastSegments,
      enEpisodeRef.podcastSegments,
      startAt,
      360,
      (idx) => setPodcastIndex(idx),
      () => setPodcastStatus('completed'),
    );
  };

  const pausePodcast = () => {
    cancelSegmentedAudio();
    setPodcastStatus('paused');
  };

  const replayPodcast = () => {
    setPodcastIndex(0);
    startOrResumePodcast(0);
  };

  // Challenge audio controls
  const startChallengeTrack = (
    track: 'intro' | 'description',
    fromIndex = 0,
  ) => {
    const lines =
      track === 'intro'
        ? episode.challengeIntroLines
        : episode.audioDescriptionLines;
    const esLines =
      track === 'intro'
        ? esEpisodeRef.challengeIntroLines
        : esEpisodeRef.audioDescriptionLines;
    const enLines =
      track === 'intro'
        ? enEpisodeRef.challengeIntroLines
        : enEpisodeRef.audioDescriptionLines;

    setChallengeTrack(track);
    setChallengeSegmentIndex(fromIndex);
    setChallengeStatus('playing');
    speakSegmentSequence(
      lines,
      esLines,
      enLines,
      fromIndex,
      track === 'description' ? 720 : 420,
      (idx) => setChallengeSegmentIndex(idx),
      () => {
        if (track === 'intro') {
          // Automatically segue into the detailed piece description after a 650ms pause
          const segueGen = playbackGenRef.current;
          segmentDelayTimerRef.current = window.setTimeout(() => {
            if (playbackGenRef.current !== segueGen) return;
            startChallengeTrack('description', 0);
          }, 650);
        } else {
          setChallengeStatus('completed');
        }
      },
    );
  };

  const pauseChallengeAudio = () => {
    cancelSegmentedAudio();
    setChallengeStatus('paused');
  };

  // Countdown tick anchored to Date.now() so rerenders/tab pauses remain accurate
  useEffect(() => {
    if (timerStatus !== 'running') return;

    if (endTimestampRef.current === null) {
      endTimestampRef.current = Date.now() + remainingMsRef.current;
    }

    const tick = () => {
      if (endTimestampRef.current === null) return;
      const msLeft = Math.max(0, endTimestampRef.current - Date.now());
      remainingMsRef.current = msLeft;
      const secsLeft = Math.ceil(msLeft / 1000);
      setRemainingSeconds(secsLeft);

      if (msLeft <= 0) {
        endTimestampRef.current = null;
        setTimerStatus('expired');
        if (!completionPlayedRef.current) {
          completionPlayedRef.current = true;
          playUiTone('success', audio.sfxEnabled, false);
          window.setTimeout(() => {
            playUiTone('science', audio.sfxEnabled, false);
          }, 260);
        }
        onChangeProgress({
          ...progress,
          timerCompleted: true,
        });
      }
    };

    tick();
    const interval = window.setInterval(tick, 200);
    return () => window.clearInterval(interval);
  }, [timerStatus, audio.sfxEnabled, onChangeProgress, progress]);

  const handleStartTimer = () => {
    audio.unlockAndStart();
    speech.markUserUnlocked();
    playUiTone('confirm', audio.sfxEnabled, false);
    if (remainingMsRef.current <= 0) {
      remainingMsRef.current = CHALLENGE_TIMER_SECONDS * 1000;
      setRemainingSeconds(CHALLENGE_TIMER_SECONDS);
    }
    completionPlayedRef.current = false;
    endTimestampRef.current = Date.now() + remainingMsRef.current;
    setTimerStatus('running');
  };

  const handlePauseTimer = () => {
    playUiTone('tap', audio.sfxEnabled, false);
    if (endTimestampRef.current !== null) {
      remainingMsRef.current = Math.max(0, endTimestampRef.current - Date.now());
      endTimestampRef.current = null;
      setRemainingSeconds(Math.ceil(remainingMsRef.current / 1000));
    }
    setTimerStatus('paused');
  };

  const handleConfirmRestartTimer = () => {
    playUiTone('tap', audio.sfxEnabled, false);
    endTimestampRef.current = null;
    remainingMsRef.current = CHALLENGE_TIMER_SECONDS * 1000;
    completionPlayedRef.current = false;
    setRemainingSeconds(CHALLENGE_TIMER_SECONDS);
    setTimerStatus('idle');
    setRestartConfirmOpen(false);
    onChangeProgress({
      ...progress,
      timerCompleted: false,
      revealAuthorizedByTeacher: false,
    });
  };

  const handleAuthorizeReveal = () => {
    endTimestampRef.current = null;
    playUiTone('success', audio.sfxEnabled, false);
    setEarlyFinishConfirmOpen(false);
    onChangeProgress({
      ...progress,
      timerCompleted: true,
      revealAuthorizedByTeacher: true,
      stage: 'reveal',
    });
  };

  const handleToggleCriterion = (id: string) => {
    playUiTone('tap', audio.sfxEnabled, false);
    const exists = progress.checkedCriteriaIds.includes(id);
    const nextIds = exists
      ? progress.checkedCriteriaIds.filter((x) => x !== id)
      : [...progress.checkedCriteriaIds, id];
    onChangeProgress({
      ...progress,
      checkedCriteriaIds: nextIds,
    });
  };

  const podcastTotal = Math.max(1, episode.podcastSegments.length);
  const podcastPercent =
    podcastStatus === 'completed'
      ? 100
      : Math.round(((podcastIndex + (podcastStatus === 'playing' ? 0.5 : 0)) / podcastTotal) * 100);

  const activeChallengeLines =
    challengeTrack === 'intro'
      ? episode.challengeIntroLines
      : episode.audioDescriptionLines;
  const challengeTotal = Math.max(1, activeChallengeLines.length);

  const nautiStageLine = useMemo(() => {
    if (progress.stage === 'podcast') {
      if (podcastStatus === 'playing') {
        return episode.podcastSegments[podcastIndex] ?? episode.podcastTitle;
      }
      return episode.podcastSegments[0] ?? episode.shortTopic;
    }
    if (progress.stage === 'challenge') {
      if (challengeStatus === 'playing') {
        return activeChallengeLines[challengeSegmentIndex] ?? s.challengeHeading;
      }
      return episode.challengeIntroLines.join(' ');
    }
    if (progress.stage === 'timer') {
      if (timerStatus === 'expired') return s.timerExpiredTitle;
      if (timerStatus === 'running' && remainingSeconds <= 15) {
        return s.timerFinalWarning;
      }
      return s.timerHeading;
    }
    if (progress.stage === 'reveal') {
      return `${s.revealHeading} ${s.revealComparisonSubtitle}`;
    }
    return s.reflectionNautiPrompt;
  }, [
    progress.stage,
    podcastStatus,
    podcastIndex,
    episode,
    challengeStatus,
    activeChallengeLines,
    challengeSegmentIndex,
    s,
    timerStatus,
    remainingSeconds,
  ]);

  return (
    <div className="relative z-10 mx-auto flex h-full w-full max-w-[1220px] flex-col px-3 py-2 sm:px-5 sm:py-2.5">
      {/* Top Bar: Back + Logos + Stage Stepper + Language & Audio Controls */}
      <header className="flex flex-none items-center justify-between gap-2 pb-1.5 sm:pb-2">
        <div className="flex min-w-0 items-center gap-1.5 sm:gap-2.5">
          <button
            type="button"
            onClick={() => {
              cancelSegmentedAudio();
              onBackToLibrary();
            }}
            className="inline-flex min-h-[38px] flex-none items-center gap-1.5 rounded-xl border-2 border-[#48C5B5]/60 bg-[#101D35] px-2.5 py-1 text-xs font-black text-[#EAF4F2] shadow-[0_2px_0_#070e1c] transition hover:bg-[#162747]"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-[#48C5B5]" aria-hidden="true" />
            <span>{s.backToLibraryBtn}</span>
          </button>

          <div className="hidden items-center gap-2 sm:flex">
            <NautiLogo className="h-7" alt={t.platformName} />
            <span className="h-5 w-px bg-[#48C5B5]/35" aria-hidden="true" />
            <FilomatasLogo className="h-6" />
          </div>

          <h1 className="truncate text-xs font-black text-[#F2C66D] sm:text-sm">
            {episode.title}
          </h1>
        </div>

        <div className="flex flex-none items-center gap-1.5">
          <LanguageSelector
            value={audio.audioLang}
            onChange={(nextLang) => {
              cancelSegmentedAudio();
              setPodcastStatus('idle');
              setChallengeStatus('idle');
              audio.setAudioLang(nextLang);
            }}
            variant="hud"
          />
          <SoundControlButton
            audio={audio}
            speech={speech}
            onReplayCurrent={() => {
              if (progress.stage === 'podcast') {
                startOrResumePodcast(podcastIndex);
              } else if (progress.stage === 'challenge') {
                startChallengeTrack(challengeTrack, challengeSegmentIndex);
              } else {
                ensureSpeechAvailableOrNotify();
                speech.speak(nautiStageLine, { force: true });
              }
            }}
            onOpenVoiceModal={onOpenVoiceSettings}
          />
        </div>
      </header>

      {/* 5-Stage Progress Strip (Never unlocks Reveal before teacher authorization) */}
      <nav
        aria-label={s.experienceTitle}
        className="mb-2 flex flex-none items-center gap-1.5 overflow-x-auto rounded-2xl border border-[#314975] bg-[#101D35]/95 p-1.5"
      >
        {STAGE_ORDER.map((stageKey, idx) => {
          const isCurrent = progress.stage === stageKey;
          const isLocked =
            (stageKey === 'reveal' || stageKey === 'reflection') &&
            !progress.revealAuthorizedByTeacher;
          const isDone = idx < stageIdx;

          return (
            <button
              key={stageKey}
              type="button"
              disabled={isLocked}
              onClick={() => {
                if (!isLocked) goToStage(stageKey);
              }}
              className={`flex min-h-[34px] flex-1 items-center justify-center gap-1.5 rounded-xl px-2.5 py-1 text-[11px] font-black whitespace-nowrap transition ${
                isCurrent
                  ? 'bg-[#48C5B5] text-[#101D35] shadow-sm'
                  : isDone
                    ? 'bg-[#173057] text-[#EAF4F2] hover:bg-[#1e3f73]'
                    : isLocked
                      ? 'cursor-not-allowed bg-[#0d182e] text-[#64748b]'
                      : 'bg-[#142342] text-[#b9d4d0] hover:bg-[#1a2e56]'
              }`}
            >
              {isLocked ? (
                <Lock className="h-3 w-3 flex-none" aria-hidden="true" />
              ) : (
                <span className="tabular-nums">{idx + 1}.</span>
              )}
              <span>{s.stageShortLabels[stageKey]}</span>
            </button>
          );
        })}
      </nav>

      {/* Main Content Area (Landscape Smartphone Optimized) */}
      <div className="grid min-h-0 flex-1 grid-cols-12 gap-3 sm:gap-4">
        {/* LEFT COLUMN (4 cols): NAUTI Companion & Live Narration Box */}
        <aside className="col-span-4 flex h-full min-h-0 flex-col items-center justify-center gap-2 rounded-3xl border-2 border-[#314975] bg-[#101D35]/90 p-2.5 sm:p-3.5">
          <div className="w-[54%] max-w-[155px] flex-none">
            <NautiCharacterRig
              expression={
                progress.stage === 'reveal' || progress.stage === 'reflection'
                  ? 'celebrate'
                  : progress.stage === 'timer' &&
                      timerStatus === 'running' &&
                      remainingSeconds <= 15
                    ? 'surprised'
                    : 'happy'
              }
              gaze="right"
              isSpeaking={speech.isSpeaking}
              mouthPulse={speech.mouthPulse}
              stickerRim
            />
          </div>

          <div className="w-full flex-1 overflow-y-auto rounded-2xl border-2 border-[#EAF4F2] bg-[#EAF4F2] p-2.5 text-[#101D35] shadow-[0_4px_0_#070e1c]">
            <div className="mb-1 flex items-center justify-between gap-1">
              <span className="text-[10px] font-black tracking-wider text-[#1c7c71] uppercase">
                {t.nautiSays}
              </span>
              <span className="text-[10px] font-bold text-[#335275] tabular-nums">
                {s.stageCounter(stageIdx + 1, STAGE_ORDER.length)}
              </span>
            </div>
            <p className="text-[11px] leading-snug font-bold sm:text-xs">
              {nautiStageLine}
            </p>
          </div>

          {/* Persistent Hidden Image Reminder during Stages 1–3 */}
          {!progress.revealAuthorizedByTeacher && (
            <div className="flex w-full items-center gap-2 rounded-xl border border-[#F2C66D]/50 bg-[#2a2416]/90 px-2.5 py-1.5 text-[10px] font-bold text-[#F2C66D]">
              <EyeOff className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
              <span>{s.podcastHiddenNotice}</span>
            </div>
          )}
        </aside>

        {/* RIGHT COLUMN (8 cols): Active Stage Workspace */}
        <section className="cockpit-scroll col-span-8 flex min-h-0 flex-col justify-between overflow-y-auto rounded-3xl border-2 border-[#48C5B5]/60 bg-[#101D35]/95 p-3.5 text-[#EAF4F2] shadow-[0_6px_0_#070e1c] sm:p-5">
          {/* STAGE 1 — EDUCATIONAL PODCAST */}
          {progress.stage === 'podcast' && (
            <div className="flex min-h-0 flex-1 flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#314975] pb-2">
                <div>
                  <p className="text-[11px] font-black tracking-wide text-[#48C5B5] uppercase">
                    {s.stageLabels.podcast} · {s.podcastDurationHint}
                  </p>
                  <h2 className="mt-0.5 text-lg font-black text-[#EAF4F2] sm:text-xl">
                    {episode.podcastTitle}
                  </h2>
                </div>
                <span className="text-xs font-extrabold text-[#F2C66D] tabular-nums">
                  {s.podcastProgressLabel(
                    Math.min(podcastIndex + 1, podcastTotal),
                    podcastTotal,
                  )}
                </span>
              </div>

              {/* Podcast Player Deck */}
              <div className="rounded-2xl border border-[#314975] bg-[#162747] p-3">
                <div className="flex flex-wrap items-center gap-2">
                  {podcastStatus === 'playing' ? (
                    <button
                      type="button"
                      onClick={pausePodcast}
                      className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#F2C66D] px-4 py-2 text-xs font-black text-[#101D35] shadow-[0_2px_0_#9f7829] transition hover:brightness-105"
                    >
                      <Pause className="h-4 w-4 fill-current" aria-hidden="true" />
                      <span>{s.podcastPauseBtn}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => startOrResumePodcast(podcastIndex)}
                      className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#48C5B5] px-4 py-2 text-xs font-black text-[#101D35] shadow-[0_2px_0_#1e766b] transition hover:brightness-105"
                    >
                      <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                      <span>
                        {podcastStatus === 'paused'
                          ? s.podcastResumeBtn
                          : s.podcastPlayBtn}
                      </span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={replayPodcast}
                    className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border border-[#48C5B5]/50 bg-[#101D35] px-3.5 py-2 text-xs font-black text-[#EAF4F2] hover:bg-[#1b3158]"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-[#48C5B5]" aria-hidden="true" />
                    <span>{s.podcastReplayBtn}</span>
                  </button>
                </div>

                {/* Audio Progress Bar */}
                <div className="mt-2.5">
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#0b1528]">
                    <div
                      className="h-full rounded-full bg-[#48C5B5] transition-all duration-300"
                      style={{ width: `${podcastPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Accessible Interactive Transcript */}
              <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1">
                <p className="flex items-center gap-1.5 text-[11px] font-black text-[#48C5B5]">
                  <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{s.podcastTranscriptLabel}</span>
                </p>
                {episode.podcastSegments.map((paragraph, idx) => {
                  const isActive = idx === podcastIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setPodcastIndex(idx);
                        startOrResumePodcast(idx);
                      }}
                      className={`w-full rounded-xl border px-3 py-2 text-left text-xs leading-relaxed transition sm:text-[13px] ${
                        isActive
                          ? 'border-[#F2C66D] bg-[#EAF4F2] font-bold text-[#101D35]'
                          : 'border-[#2b426b] bg-[#142342]/85 font-semibold text-[#EAF4F2]/90 hover:border-[#48C5B5]/60'
                      }`}
                    >
                      <span
                        className={`mr-1.5 text-[10px] font-black tabular-nums ${
                          isActive ? 'text-[#1c7c71]' : 'text-[#48C5B5]'
                        }`}
                      >
                        {idx + 1}.
                      </span>
                      {paragraph}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-none justify-end border-t border-[#314975] pt-2.5">
                <button
                  type="button"
                  onClick={() => goToStage('challenge')}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl border-2 border-[#EAF4F2] bg-[#F2C66D] px-5 py-2 text-xs font-black text-[#101D35] shadow-[0_3px_0_#9f7829] transition hover:brightness-105 sm:text-sm"
                >
                  <span>{s.podcastContinueBtn}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 2 — AUDIO DRAWING CHALLENGE (IMAGE STRICTLY HIDDEN) */}
          {progress.stage === 'challenge' && (
            <div className="flex min-h-0 flex-1 flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#314975] pb-2">
                <div>
                  <p className="text-[11px] font-black tracking-wide text-[#F2C66D] uppercase">
                    {s.stageLabels.challenge}
                  </p>
                  <h2 className="mt-0.5 text-lg font-black text-[#EAF4F2] sm:text-xl">
                    {s.challengeHeading}
                  </h2>
                </div>
                <span className="text-xs font-extrabold text-[#48C5B5] tabular-nums">
                  {challengeSegmentIndex + 1} / {challengeTotal}
                </span>
              </div>

              {/* Hidden Mystery Diagram Notice (Zero spoilers) */}
              <div className="flex items-center gap-3.5 rounded-2xl border-2 border-dashed border-[#48C5B5]/60 bg-[#0d1930] p-3.5">
                <div className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl border border-[#48C5B5]/50 bg-[#162747] text-[#F2C66D]">
                  <Headphones className="h-7 w-7" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#F2C66D]">
                    {s.challengeHiddenBoxTitle}
                  </h3>
                  <p className="mt-0.5 text-xs leading-snug font-semibold text-[#EAF4F2]/90">
                    {s.challengeHiddenBoxBody}
                  </p>
                </div>
              </div>

              {/* Audio Challenge Announcement & Spatial Description Controls */}
              <div className="rounded-2xl border border-[#314975] bg-[#162747] p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => startChallengeTrack('intro', 0)}
                    className={`inline-flex min-h-[42px] items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition ${
                      challengeStatus === 'playing' && challengeTrack === 'intro'
                        ? 'bg-[#F2C66D] text-[#101D35]'
                        : 'bg-[#48C5B5] text-[#101D35] shadow-[0_2px_0_#1e766b]'
                    }`}
                  >
                    <Volume2 className="h-4 w-4" aria-hidden="true" />
                    <span>{s.challengePlayIntroBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => startChallengeTrack('description', 0)}
                    className={`inline-flex min-h-[42px] items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition ${
                      challengeStatus === 'playing' &&
                      challengeTrack === 'description'
                        ? 'bg-[#F2C66D] text-[#101D35]'
                        : 'border border-[#48C5B5] bg-[#101D35] text-[#EAF4F2] hover:bg-[#1b3158]'
                    }`}
                  >
                    <Play className="h-3.5 w-3.5 fill-current text-[#F2C66D]" aria-hidden="true" />
                    <span>{s.challengePlayDescriptionBtn}</span>
                  </button>

                  {challengeStatus === 'playing' && (
                    <button
                      type="button"
                      onClick={pauseChallengeAudio}
                      className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl bg-[#EAF4F2] px-3.5 py-2 text-xs font-black text-[#101D35]"
                    >
                      <Pause className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                      <span>{s.podcastPauseBtn}</span>
                    </button>
                  )}

                  {challengeStatus === 'paused' && (
                    <button
                      type="button"
                      onClick={() =>
                        startChallengeTrack(challengeTrack, challengeSegmentIndex)
                      }
                      className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl bg-[#48C5B5] px-3.5 py-2 text-xs font-black text-[#101D35]"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                      <span>{s.podcastResumeBtn}</span>
                    </button>
                  )}
                </div>

                {/* Challenge Announcement Card always visible (no spatial spoilers) */}
                <div className="mt-2.5 space-y-1 rounded-xl bg-[#101D35] p-3 text-xs leading-relaxed font-semibold text-[#EAF4F2]">
                  {episode.challengeIntroLines.map((line, idx) => (
                    <p
                      key={idx}
                      className={
                        challengeTrack === 'intro' &&
                        challengeStatus === 'playing' &&
                        challengeSegmentIndex === idx
                          ? 'font-black text-[#F2C66D]'
                          : undefined
                      }
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>

              {/* Optional Collapsible Spatial Transcript (for teacher reading or accessibility) */}
              <div>
                <button
                  type="button"
                  onClick={() => setChallengeTranscriptOpen((v) => !v)}
                  className="inline-flex items-center gap-1.5 text-xs font-black text-[#48C5B5] hover:underline"
                >
                  {challengeTranscriptOpen ? (
                    <ChevronUp className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span>
                    {challengeTranscriptOpen
                      ? s.challengeTranscriptToggleHide
                      : s.challengeTranscriptToggleShow}
                  </span>
                </button>

                {challengeTranscriptOpen && (
                  <ol className="mt-2 space-y-1 rounded-2xl border border-[#314975] bg-[#142342] p-3 text-xs leading-relaxed text-[#EAF4F2]">
                    {episode.audioDescriptionLines.map((line, idx) => (
                      <li
                        key={idx}
                        className={
                          challengeTrack === 'description' &&
                          challengeStatus === 'playing' &&
                          challengeSegmentIndex === idx
                            ? 'font-black text-[#F2C66D]'
                            : 'font-semibold'
                        }
                      >
                        <span className="mr-1.5 text-[#48C5B5] tabular-nums">
                          {idx + 1}.
                        </span>
                        {line}
                      </li>
                    ))}
                  </ol>
                )}
              </div>

              <div className="mt-auto flex flex-none items-center justify-between gap-2 border-t border-[#314975] pt-2.5">
                <button
                  type="button"
                  onClick={() => goToStage('podcast')}
                  className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl bg-[#162747] px-4 py-2 text-xs font-black text-[#EAF4F2] hover:bg-[#1e355f]"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  <span>{s.stageShortLabels.podcast}</span>
                </button>

                <button
                  type="button"
                  onClick={() => goToStage('timer')}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl border-2 border-[#EAF4F2] bg-[#F2C66D] px-5 py-2 text-xs font-black text-[#101D35] shadow-[0_3px_0_#9f7829] transition hover:brightness-105 sm:text-sm"
                >
                  <Timer className="h-4 w-4" aria-hidden="true" />
                  <span>{s.challengeContinueBtn}</span>
                </button>
              </div>
            </div>
          )}

          {/* STAGE 3 — TWO-MINUTE DRAWING TIMER (ON PAPER, NO AUTO-REVEAL) */}
          {progress.stage === 'timer' && (
            <div className="flex min-h-0 flex-1 flex-col justify-between gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#314975] pb-2">
                <div>
                  <p className="text-[11px] font-black tracking-wide text-[#48C5B5] uppercase">
                    {s.stageLabels.timer}
                  </p>
                  <h2 className="mt-0.5 text-xl font-black text-[#F2C66D] sm:text-2xl">
                    {timerStatus === 'expired'
                      ? s.timerExpiredTitle
                      : s.timerHeading}
                  </h2>
                </div>
                <span className="text-xs font-bold text-[#b9d4d0]">
                  {s.timerPaperReminder}
                </span>
              </div>

              {/* Central Two-Minute Countdown Display */}
              <div
                className={`flex flex-col items-center justify-center rounded-3xl border-2 p-4 text-center transition-colors sm:p-6 ${
                  timerStatus === 'expired'
                    ? 'border-[#F2C66D] bg-[#2a2416]'
                    : timerStatus === 'running' && remainingSeconds <= 15
                      ? 'border-[#F2C66D] bg-[#1e2638]'
                      : 'border-[#48C5B5]/60 bg-[#0d1930]'
                }`}
              >
                <div
                  aria-live="polite"
                  className={`font-mono text-5xl font-black tracking-tight tabular-nums sm:text-6xl ${
                    timerStatus === 'expired' ||
                    (timerStatus === 'running' && remainingSeconds <= 15)
                      ? 'text-[#F2C66D]'
                      : 'text-[#EAF4F2]'
                  }`}
                >
                  {formatClock(remainingSeconds)}
                </div>

                <p className="mt-2 max-w-md text-xs leading-snug font-bold text-[#EAF4F2]/90 sm:text-sm">
                  {timerStatus === 'expired'
                    ? s.timerExpiredSub
                    : timerStatus === 'running' && remainingSeconds <= 15
                      ? s.timerFinalWarning
                      : s.timerInstruction}
                </p>

                {/* Timer Controls */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
                  {timerStatus === 'idle' && (
                    <button
                      type="button"
                      onClick={handleStartTimer}
                      className="inline-flex min-h-[46px] items-center gap-2 rounded-2xl border-2 border-[#EAF4F2] bg-[#48C5B5] px-6 py-2.5 text-sm font-black text-[#101D35] shadow-[0_3px_0_#1e766b] transition hover:brightness-105"
                    >
                      <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                      <span>{s.timerStartBtn}</span>
                    </button>
                  )}

                  {timerStatus === 'running' && (
                    <button
                      type="button"
                      onClick={handlePauseTimer}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-[#F2C66D] px-5 py-2 text-xs font-black text-[#101D35] shadow-[0_3px_0_#9f7829] sm:text-sm"
                    >
                      <Pause className="h-4 w-4 fill-current" aria-hidden="true" />
                      <span>{s.timerPauseBtn}</span>
                    </button>
                  )}

                  {timerStatus === 'paused' && (
                    <button
                      type="button"
                      onClick={handleStartTimer}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-[#48C5B5] px-5 py-2 text-xs font-black text-[#101D35] shadow-[0_3px_0_#1e766b] sm:text-sm"
                    >
                      <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                      <span>{s.timerResumeBtn}</span>
                    </button>
                  )}

                  {timerStatus !== 'idle' && (
                    <button
                      type="button"
                      onClick={() => setRestartConfirmOpen(true)}
                      className="inline-flex min-h-[44px] items-center gap-1.5 rounded-2xl border border-[#48C5B5]/50 bg-[#162747] px-4 py-2 text-xs font-black text-[#EAF4F2] hover:bg-[#1e355f]"
                    >
                      <RotateCcw className="h-3.5 w-3.5 text-[#48C5B5]" aria-hidden="true" />
                      <span>{s.timerRestartBtn}</span>
                    </button>
                  )}
                </div>

                {/* Restart Confirmation Prompt */}
                {restartConfirmOpen && (
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-[#F2C66D] bg-[#101D35] px-4 py-2.5 text-xs">
                    <span className="font-black text-[#F2C66D]">
                      {s.timerRestartConfirmTitle}
                    </span>
                    <button
                      type="button"
                      onClick={handleConfirmRestartTimer}
                      className="rounded-xl bg-[#F2C66D] px-3 py-1.5 font-black text-[#101D35]"
                    >
                      {s.timerRestartConfirmYes}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRestartConfirmOpen(false)}
                      className="rounded-xl bg-[#162747] px-3 py-1.5 font-bold text-[#EAF4F2]"
                    >
                      {s.timerRestartConfirmNo}
                    </button>
                  </div>
                )}
              </div>

              {/* Teacher-Controlled Transition to Reveal */}
              <div className="space-y-2 border-t border-[#314975] pt-2.5">
                <p className="text-[11px] font-semibold text-[#b9d4d0]">
                  {s.timerTeacherControlNote}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => goToStage('challenge')}
                    className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl bg-[#162747] px-4 py-2 text-xs font-black text-[#EAF4F2] hover:bg-[#1e355f]"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    <span>{s.stageShortLabels.challenge}</span>
                  </button>

                  {timerStatus === 'expired' ||
                  progress.revealAuthorizedByTeacher ? (
                    <button
                      type="button"
                      onClick={handleAuthorizeReveal}
                      className="inline-flex min-h-[46px] items-center gap-2 rounded-2xl border-2 border-[#EAF4F2] bg-[#F2C66D] px-6 py-2 text-sm font-black text-[#101D35] shadow-[0_3px_0_#9f7829] transition hover:brightness-105"
                    >
                      <Eye className="h-4 w-4" aria-hidden="true" />
                      <span>{s.timerRevealPieceBtn}</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      {!earlyFinishConfirmOpen ? (
                        <button
                          type="button"
                          onClick={() => setEarlyFinishConfirmOpen(true)}
                          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#314975] bg-[#162747] px-3.5 py-2 text-xs font-bold text-[#b9d4d0] hover:border-[#F2C66D]/60 hover:text-[#EAF4F2]"
                        >
                          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{s.timerEarlyFinishBtn}</span>
                        </button>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#F2C66D]/70 bg-[#162747] px-3 py-1.5 text-[11px]">
                          <span className="font-bold text-[#F2C66D]">
                            {s.timerEarlyConfirmNote}
                          </span>
                          <button
                            type="button"
                            onClick={handleAuthorizeReveal}
                            className="rounded-lg bg-[#F2C66D] px-3 py-1 font-black text-[#101D35]"
                          >
                            {s.timerRevealPieceBtn}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEarlyFinishConfirmOpen(false)}
                            className="rounded-lg bg-[#101D35] px-2.5 py-1 font-bold text-[#EAF4F2]"
                          >
                            {s.timerRestartConfirmNo}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STAGE 4 — IMAGE REVEAL AND TEAM COMPARISON */}
          {progress.stage === 'reveal' && (
            <div className="flex min-h-0 flex-1 flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#314975] pb-2">
                <div>
                  <p className="text-[11px] font-black tracking-wide text-[#48C5B5] uppercase">
                    {s.stageLabels.reveal}
                  </p>
                  <h2 className="mt-0.5 text-lg font-black text-[#F2C66D] sm:text-xl">
                    {s.revealHeading}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowPartLabels((v) => !v)}
                    className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border border-[#48C5B5]/60 bg-[#162747] px-3 py-1.5 text-[11px] font-black text-[#EAF4F2] hover:bg-[#1e355f]"
                  >
                    <Tag className="h-3.5 w-3.5 text-[#48C5B5]" aria-hidden="true" />
                    <span>
                      {showPartLabels
                        ? s.revealTogglePartsHide
                        : s.revealTogglePartsShow}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => startChallengeTrack('description', 0)}
                    className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border border-[#F2C66D]/60 bg-[#162747] px-3 py-1.5 text-[11px] font-black text-[#F2C66D] hover:bg-[#1e355f]"
                  >
                    <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{s.revealListenAgainBtn}</span>
                  </button>
                </div>
              </div>

              <SolarArrayReferenceDiagram
                strings={s}
                referenceLabel={`${episode.referenceKindLabel} · ${episode.targetPieceTitle}`}
                showPartLabels={showPartLabels}
              />

              {/* 5 Teacher-Guided Classroom Comparison Criteria (No automated AI grading) */}
              <div className="rounded-2xl border border-[#314975] bg-[#162747] p-3">
                <h3 className="text-xs font-black text-[#F2C66D] sm:text-sm">
                  {s.revealComparisonTitle}
                </h3>
                <p className="mt-0.5 text-[11px] font-semibold text-[#b9d4d0]">
                  {s.revealComparisonSubtitle}
                </p>

                <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {episode.comparisonCriteria.map((crit) => {
                    const checked = progress.checkedCriteriaIds.includes(
                      crit.id,
                    );
                    return (
                      <button
                        key={crit.id}
                        type="button"
                        onClick={() => handleToggleCriterion(crit.id)}
                        className={`flex items-start gap-2 rounded-xl border px-2.5 py-2 text-left text-xs transition ${
                          checked
                            ? 'border-[#48C5B5] bg-[#EAF4F2] text-[#101D35]'
                            : 'border-[#314975] bg-[#101D35] text-[#EAF4F2] hover:border-[#48C5B5]/60'
                        }`}
                      >
                        <CheckCircle2
                          className={`mt-0.5 h-4 w-4 flex-none ${
                            checked ? 'text-[#1c7c71]' : 'text-[#48C5B5]/60'
                          }`}
                          aria-hidden="true"
                        />
                        <span>
                          <strong className="block font-black">
                            {crit.label}
                          </strong>
                          <span className="text-[11px] font-semibold opacity-90">
                            {crit.detail}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-auto flex flex-none justify-end border-t border-[#314975] pt-2.5">
                <button
                  type="button"
                  onClick={() => goToStage('reflection')}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl border-2 border-[#EAF4F2] bg-[#F2C66D] px-5 py-2 text-xs font-black text-[#101D35] shadow-[0_3px_0_#9f7829] transition hover:brightness-105 sm:text-sm"
                >
                  <span>{s.revealContinueBtn}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 5 — SCIENTIFIC REFLECTION & VERIFIED NASA SOURCE */}
          {progress.stage === 'reflection' && (
            <div className="flex min-h-0 flex-1 flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#314975] pb-2">
                <div>
                  <p className="text-[11px] font-black tracking-wide text-[#48C5B5] uppercase">
                    {s.stageLabels.reflection}
                  </p>
                  <h2 className="mt-0.5 text-lg font-black text-[#EAF4F2] sm:text-xl">
                    {s.reflectionHeading}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const summarySegments = [
                      episode.scientificExplanation.whatPieceIs,
                      episode.scientificExplanation.functionPerformed,
                      episode.scientificExplanation.howItConnects,
                      episode.scientificExplanation.whyDesignMatters,
                      episode.scientificExplanation.scientificFact,
                      ...episode.reflectionQuestions,
                    ];
                    const esSummary = [
                      esEpisodeRef.scientificExplanation.whatPieceIs,
                      esEpisodeRef.scientificExplanation.functionPerformed,
                      esEpisodeRef.scientificExplanation.howItConnects,
                      esEpisodeRef.scientificExplanation.whyDesignMatters,
                      esEpisodeRef.scientificExplanation.scientificFact,
                      ...esEpisodeRef.reflectionQuestions,
                    ];
                    const enSummary = [
                      enEpisodeRef.scientificExplanation.whatPieceIs,
                      enEpisodeRef.scientificExplanation.functionPerformed,
                      enEpisodeRef.scientificExplanation.howItConnects,
                      enEpisodeRef.scientificExplanation.whyDesignMatters,
                      enEpisodeRef.scientificExplanation.scientificFact,
                      ...enEpisodeRef.reflectionQuestions,
                    ];
                    speakSegmentSequence(
                      summarySegments,
                      esSummary,
                      enSummary,
                      0,
                      400,
                      () => {},
                      () => {},
                    );
                  }}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-[#48C5B5] px-3.5 py-1.5 text-xs font-black text-[#101D35] hover:brightness-105"
                >
                  <Volume2 className="h-4 w-4" aria-hidden="true" />
                  <span>{s.reflectionListenBtn}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
                <div className="space-y-2.5 lg:col-span-7">
                  <div className="rounded-2xl border border-[#314975] bg-[#162747] p-3 text-xs leading-relaxed">
                    <p className="font-black text-[#48C5B5]">
                      {s.reflectionPieceLabel}
                    </p>
                    <p className="mt-0.5 font-semibold text-[#EAF4F2]">
                      {episode.scientificExplanation.whatPieceIs}
                    </p>

                    <p className="mt-2 font-black text-[#48C5B5]">
                      {s.reflectionFunctionLabel}
                    </p>
                    <p className="mt-0.5 font-semibold text-[#EAF4F2]">
                      {episode.scientificExplanation.functionPerformed}
                    </p>

                    <p className="mt-2 font-black text-[#48C5B5]">
                      {s.reflectionConnectionLabel}
                    </p>
                    <p className="mt-0.5 font-semibold text-[#EAF4F2]">
                      {episode.scientificExplanation.howItConnects}
                    </p>

                    <p className="mt-2 font-black text-[#48C5B5]">
                      {s.reflectionDesignLabel}
                    </p>
                    <p className="mt-0.5 font-semibold text-[#EAF4F2]">
                      {episode.scientificExplanation.whyDesignMatters}
                    </p>

                    {episode.scientificExplanation.detailsToRecognize.length >
                      0 && (
                      <>
                        <p className="mt-2 font-black text-[#F2C66D]">
                          {s.reflectionDetailsLabel}
                        </p>
                        <ul className="mt-1 list-disc space-y-0.5 pl-4 font-semibold text-[#EAF4F2]/90">
                          {episode.scientificExplanation.detailsToRecognize.map(
                            (detail, idx) => (
                              <li key={idx}>{detail}</li>
                            ),
                          )}
                        </ul>
                      </>
                    )}
                  </div>

                  {/* NASA Fact */}
                  <div className="flex items-start gap-2.5 rounded-2xl border border-[#F2C66D]/60 bg-[#2a2416] p-3 text-xs">
                    <Sparkles
                      className="mt-0.5 h-4 w-4 flex-none text-[#F2C66D]"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-black text-[#F2C66D]">
                        {s.reflectionFactLabel}
                      </p>
                      <p className="mt-0.5 font-semibold text-[#EAF4F2]">
                        {episode.scientificExplanation.scientificFact}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 lg:col-span-5">
                  <SolarArrayReferenceDiagram
                    strings={s}
                    referenceLabel={episode.referenceKindLabel}
                    compact
                  />

                  {/* Classroom Reflection Questions */}
                  <div className="rounded-2xl border border-[#314975] bg-[#162747] p-3">
                    <h3 className="flex items-center gap-1.5 text-xs font-black text-[#F2C66D]">
                      <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{s.reflectionQuestionsTitle}</span>
                    </h3>
                    <ol className="mt-1.5 space-y-1 text-xs font-semibold text-[#EAF4F2]">
                      {episode.reflectionQuestions.map((q, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="font-black text-[#48C5B5] tabular-nums">
                            {idx + 1}.
                          </span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Verified NASA Source Card */}
                  <div className="rounded-2xl border border-[#48C5B5]/50 bg-[#0d1930] p-3 text-[11px]">
                    <div className="flex flex-wrap items-center justify-between gap-1 font-black">
                      <span className="text-[#48C5B5]">
                        {s.reflectionSourceTitle}
                      </span>
                      <span className="text-[#F2C66D]">
                        {episode.nasaSource.deploymentLabel}
                      </span>
                    </div>
                    <p className="mt-1 font-bold text-[#EAF4F2]">
                      {episode.nasaSource.title}
                    </p>
                    <p className="mt-0.5 text-[#b9d4d0]">
                      {s.reflectionOrganizationLabel}:{' '}
                      {episode.nasaSource.organization}
                      {episode.nasaSource.publicationDate
                        ? ` · ${episode.nasaSource.publicationDate}`
                        : ''}
                    </p>
                    <a
                      href={episode.nasaSource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 font-black text-[#48C5B5] underline hover:text-[#F2C66D]"
                    >
                      <span>{s.reflectionOpenSourceBtn}</span>
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Navigation Footer */}
              <div className="mt-auto flex flex-none flex-wrap items-center justify-between gap-2 border-t border-[#314975] pt-2.5">
                <button
                  type="button"
                  onClick={() => {
                    cancelSegmentedAudio();
                    onBackToLibrary();
                  }}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl border-2 border-[#48C5B5]/70 bg-[#162747] px-5 py-2 text-xs font-black text-[#EAF4F2] hover:bg-[#1e355f] sm:text-sm"
                >
                  <BookOpen className="h-4 w-4 text-[#48C5B5]" aria-hidden="true" />
                  <span>{s.backToTechnologiesBtn}</span>
                </button>

                {hasNextEpisode && onNextEpisode ? (
                  <button
                    type="button"
                    onClick={() => {
                      cancelSegmentedAudio();
                      onNextEpisode();
                    }}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl border-2 border-[#EAF4F2] bg-[#F2C66D] px-5 py-2 text-xs font-black text-[#101D35] shadow-[0_3px_0_#9f7829] transition hover:brightness-105 sm:text-sm"
                  >
                    <span>{s.nextTechnologyBtn}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#b9d4d0]">
                    <Lightbulb className="h-3.5 w-3.5 text-[#F2C66D]" aria-hidden="true" />
                    <span>{s.nextTechnologyUnavailableNote}</span>
                  </span>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
