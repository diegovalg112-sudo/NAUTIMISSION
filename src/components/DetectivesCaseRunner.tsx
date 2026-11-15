import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Eye,
  Hand,
  HelpCircle,
  Link2,
  Search,
  Sparkles,
  Square,
  Volume2,
  X,
} from 'lucide-react';
import caseWaterIllustration from '../assets/images/case_water_mystery_1794756806321.jpg';
import { getDetectivesStrings } from '../data/detectivesNasaStrings';
import { UI_STRINGS } from '../data/uiStrings';
import type { MusicAudioControls } from '../hooks/useMusicAudio';
import type { SpeechControlsState } from '../hooks/useSpeech';
import type {
  DetectiveCaseProgress,
  DetectiveCaseRecord,
  DetectiveCaseStage,
  DetectiveOptionId,
} from '../types/detectivesNasa';
import { playUiTone } from '../utils/soundFx';
import {
  CaseWaterFallbackDiagram,
  DetectiveEvidenceVisual,
} from './DetectiveEvidenceVisuals';
import { FilomatasLogo } from './FilomatasLogo';
import { LanguageSelector } from './LanguageSelector';
import {
  NautiCharacterRig,
  type NautiExpression,
  type TickleIntensity,
} from './NautiCharacterRig';
import { NautiLogo } from './NautiLogo';
import { SoundControlButton } from './SoundControlButton';

interface DetectivesCaseRunnerProps {
  activeCase: DetectiveCaseRecord;
  esCaseRef: DetectiveCaseRecord;
  enCaseRef: DetectiveCaseRecord;
  progress: DetectiveCaseProgress;
  onChangeProgress: (next: DetectiveCaseProgress) => void;
  onCaseSolved: (caseId: DetectiveCaseRecord['id']) => void;
  audio: MusicAudioControls;
  speech: SpeechControlsState;
  onOpenVoiceSettings: () => void;
  onBackToLibrary: () => void;
  onOpenDiscoveries: () => void;
  onBackToWelcome: () => void;
  tickleCaption?: string | null;
  onTickleSound?: (intensity: TickleIntensity) => void;
}

const STAGE_ORDER: readonly DetectiveCaseStage[] = [
  'mystery',
  'evidence',
  'connect',
  'solve',
  'resolved',
] as const;

export const DetectivesCaseRunner: React.FC<DetectivesCaseRunnerProps> = ({
  activeCase,
  esCaseRef,
  enCaseRef,
  progress,
  onChangeProgress,
  onCaseSolved,
  audio,
  speech,
  onOpenVoiceSettings,
  onBackToLibrary,
  onOpenDiscoveries,
  onBackToWelcome,
  tickleCaption = null,
  onTickleSound,
}) => {
  const t = UI_STRINGS[audio.audioLang];
  const s = getDetectivesStrings(audio.audioLang);

  const [imgError, setImgError] = useState<boolean>(false);
  const [selectedEvidenceForSlot, setSelectedEvidenceForSlot] = useState<
    string | null
  >(null);

  const currentStageIndex = STAGE_ORDER.indexOf(progress.stage);
  const allEvidenceRevealed =
    activeCase.evidenceCards.length > 0 &&
    activeCase.evidenceCards.every((c) =>
      progress.revealedEvidenceIds.includes(c.id),
    );
  const allSlotsFilled =
    activeCase.connectionSlots.length > 0 &&
    activeCase.connectionSlots.every((slot) =>
      Boolean(progress.selectedConnections[slot.id]),
    );

  // Determine the stage narration text across languages for TTS + Guaraní fallback
  const buildStageSpeech = useCallback(
    (
      caseRec: DetectiveCaseRecord,
      st: DetectiveCaseProgress,
    ): string => {
      if (st.stage === 'mystery') {
        return `${caseRec.title}. ${caseRec.stage1Narrative}`;
      }
      if (st.stage === 'evidence') {
        return caseRec.nautiStagePrompts.evidence;
      }
      if (st.stage === 'connect') {
        return `${caseRec.nautiStagePrompts.connect} ${caseRec.connectionQuestion}`;
      }
      if (st.stage === 'solve') {
        if (st.solveFeedback) {
          return st.solveFeedback.message;
        }
        return `${caseRec.nautiStagePrompts.solve} ${caseRec.finalQuestion}`;
      }
      return `${caseRec.title}. ${caseRec.finalExplanationParagraphs.join(' ')}`;
    },
    [],
  );

  const currentSpeechText = useMemo(
    () => buildStageSpeech(activeCase, progress),
    [activeCase, progress, buildStageSpeech],
  );

  const speechFallbacks = useMemo(
    () =>
      audio.audioLang === 'gn-PY'
        ? {
            es: buildStageSpeech(esCaseRef, progress),
            en: buildStageSpeech(enCaseRef, progress),
          }
        : undefined,
    [audio.audioLang, buildStageSpeech, esCaseRef, enCaseRef, progress],
  );

  const speakCustomText = useCallback(
    (text: string, esText?: string, enText?: string, force = true) => {
      speech.markUserUnlocked();
      if (
        audio.audioLang === 'gn-PY' &&
        !speech.isGuaraniVoiceSupported &&
        speech.guaraniFallbackMode === 'none'
      ) {
        onOpenVoiceSettings();
        return;
      }
      speech.speak(text, {
        force,
        fallbackTexts:
          audio.audioLang === 'gn-PY'
            ? {
                es: esText ?? text,
                en: enText ?? esText ?? text,
              }
            : undefined,
      });
    },
    [audio.audioLang, speech, onOpenVoiceSettings],
  );

  // Auto-narrate smoothly when moving between investigation stages or receiving solve feedback
  const narrationKey = [
    audio.audioLang,
    activeCase.id,
    progress.stage,
    progress.solveFeedback?.optionId ?? 'none',
    progress.attemptsUsed,
  ].join('|');

  const currentSpeechRef = useRef(currentSpeechText);
  currentSpeechRef.current = currentSpeechText;
  const speechFallbacksRef = useRef(speechFallbacks);
  speechFallbacksRef.current = speechFallbacks;
  const speakRef = useRef(speech.speak);
  speakRef.current = speech.speak;
  const stopRef = useRef(speech.stop);
  stopRef.current = speech.stop;
  const autoNarrateRef = useRef(speech.autoNarrate);
  autoNarrateRef.current = speech.autoNarrate;
  const volumeRef = useRef(speech.volume);
  volumeRef.current = speech.volume;

  useEffect(() => {
    stopRef.current();
    if (!autoNarrateRef.current || volumeRef.current <= 0) return;

    const timer = window.setTimeout(() => {
      if (autoNarrateRef.current && volumeRef.current > 0) {
        speakRef.current(currentSpeechRef.current, {
          force: false,
          isAuto: true,
          fallbackTexts: speechFallbacksRef.current,
        });
      }
    }, 340);

    return () => {
      window.clearTimeout(timer);
    };
  }, [narrationKey]);

  useEffect(() => {
    return () => {
      stopRef.current();
    };
  }, []);

  // Live NAUTI expression & bubble text matched to the current investigation moment
  const nautiUi = useMemo((): {
    expression: NautiExpression;
    bubbleText: string;
  } => {
    if (progress.stage === 'mystery') {
      return {
        expression: 'surprised',
        bubbleText: activeCase.nautiStagePrompts.mystery,
      };
    }
    if (progress.stage === 'evidence') {
      return {
        expression: allEvidenceRevealed ? 'happy' : 'thinking',
        bubbleText: activeCase.nautiStagePrompts.evidence,
      };
    }
    if (progress.stage === 'connect') {
      if (progress.connectionVerified) {
        return {
          expression: 'celebrate',
          bubbleText: activeCase.connectionSuccessMessage,
        };
      }
      if (progress.connectionFeedback) {
        return {
          expression: 'thinking',
          bubbleText: progress.connectionFeedback,
        };
      }
      return {
        expression: 'thinking',
        bubbleText: activeCase.nautiStagePrompts.connect,
      };
    }
    if (progress.stage === 'solve') {
      if (progress.solveFeedback) {
        return {
          expression: progress.solveFeedback.isCorrect
            ? 'celebrate'
            : 'thinking',
          bubbleText: progress.solveFeedback.message,
        };
      }
      return {
        expression: 'thinking',
        bubbleText: activeCase.nautiStagePrompts.solve,
      };
    }
    return {
      expression: 'celebrate',
      bubbleText: activeCase.nautiStagePrompts.resolved,
    };
  }, [activeCase, progress, allEvidenceRevealed]);

  const goToStage = (nextStage: DetectiveCaseStage) => {
    speech.stop();
    playUiTone('tap', audio.sfxEnabled, false);
    setSelectedEvidenceForSlot(null);
    onChangeProgress({
      ...progress,
      stage: nextStage,
    });
  };

  const canNavigateToStage = (stageId: DetectiveCaseStage): boolean => {
    if (stageId === 'mystery') return true;
    if (stageId === 'evidence') {
      return currentStageIndex >= 1 || progress.revealedEvidenceIds.length > 0;
    }
    if (stageId === 'connect') {
      return allEvidenceRevealed;
    }
    if (stageId === 'solve') {
      return progress.connectionVerified;
    }
    return progress.caseSolved;
  };

  const handleRevealEvidence = (evidenceId: string) => {
    const isAlready = progress.revealedEvidenceIds.includes(evidenceId);
    const cardIdx = activeCase.evidenceCards.findIndex(
      (c) => c.id === evidenceId,
    );
    const card = activeCase.evidenceCards[cardIdx];
    if (!card) return;

    playUiTone(isAlready ? 'tap' : 'confirm', audio.sfxEnabled, false);

    if (!isAlready) {
      onChangeProgress({
        ...progress,
        revealedEvidenceIds: [...progress.revealedEvidenceIds, evidenceId],
      });
    }

    if (audio.audioLang === 'gn-PY' && !speech.isGuaraniVoiceSupported && speech.guaraniFallbackMode === 'none') {
      return;
    }

    const esCard = esCaseRef.evidenceCards[cardIdx];
    const enCard = enCaseRef.evidenceCards[cardIdx];
    if (speech.voiceOn && speech.volume > 0) {
      speech.markUserUnlocked();
      speech.speak(`${card.title}. ${card.fact} ${card.explanation}`, {
        force: true,
        fallbackTexts:
          audio.audioLang === 'gn-PY' && esCard && enCard
            ? {
                es: `${esCard.title}. ${esCard.fact} ${esCard.explanation}`,
                en: `${enCard.title}. ${enCard.fact} ${enCard.explanation}`,
              }
            : undefined,
      });
    }
  };

  const handleAssignSlot = (slotId: string) => {
    if (progress.connectionVerified) return;

    // If user picked an evidence card first, place it into this slot
    if (selectedEvidenceForSlot) {
      playUiTone('tap', audio.sfxEnabled, false);
      const nextMap: Record<string, string> = {
        ...progress.selectedConnections,
      };
      // Ensure each evidence card only occupies one slot at a time
      for (const existingSlot of Object.keys(nextMap)) {
        if (nextMap[existingSlot] === selectedEvidenceForSlot) {
          delete nextMap[existingSlot];
        }
      }
      nextMap[slotId] = selectedEvidenceForSlot;
      setSelectedEvidenceForSlot(null);
      onChangeProgress({
        ...progress,
        selectedConnections: nextMap,
        connectionFeedback: null,
      });
      return;
    }

    // Otherwise, tapping an already-filled slot removes it so kids can adjust easily
    if (progress.selectedConnections[slotId]) {
      playUiTone('tap', audio.sfxEnabled, false);
      const nextMap = { ...progress.selectedConnections };
      delete nextMap[slotId];
      onChangeProgress({
        ...progress,
        selectedConnections: nextMap,
        connectionFeedback: null,
      });
    }
  };

  const handleCheckConnections = () => {
    if (!allSlotsFilled) return;
    const mismatchSlot = activeCase.connectionSlots.find(
      (slot) => progress.selectedConnections[slot.id] !== slot.expectedEvidenceId,
    );
    if (!mismatchSlot) {
      playUiTone('success', audio.sfxEnabled, false);
      onChangeProgress({
        ...progress,
        connectionVerified: true,
        connectionFeedback: activeCase.connectionSuccessMessage,
      });
      if (speech.voiceOn && speech.volume > 0) {
        speakCustomText(
          activeCase.connectionSuccessMessage,
          esCaseRef.connectionSuccessMessage,
          enCaseRef.connectionSuccessMessage,
          true,
        );
      }
      return;
    }

    playUiTone('tap', audio.sfxEnabled, false);
    const hint =
      activeCase.connectionMismatchHints[mismatchSlot.id] ??
      activeCase.connectionGuideHint;
    const esHint =
      esCaseRef.connectionMismatchHints[mismatchSlot.id] ??
      esCaseRef.connectionGuideHint;
    const enHint =
      enCaseRef.connectionMismatchHints[mismatchSlot.id] ??
      enCaseRef.connectionGuideHint;

    onChangeProgress({
      ...progress,
      connectionVerified: false,
      connectionFeedback: hint,
    });
    if (speech.voiceOn && speech.volume > 0) {
      speakCustomText(hint, esHint, enHint, true);
    }
  };

  const handleSubmitOption = () => {
    if (!progress.selectedOptionId) return;
    const pickedIdx = activeCase.answerOptions.findIndex(
      (opt) => opt.id === progress.selectedOptionId,
    );
    const picked = activeCase.answerOptions[pickedIdx];
    if (!picked) return;

    const nextAttempts = progress.attemptsUsed + 1;
    const esOpt = esCaseRef.answerOptions[pickedIdx];
    const enOpt = enCaseRef.answerOptions[pickedIdx];

    if (picked.isCorrect) {
      playUiTone('success', audio.sfxEnabled, false);
      onCaseSolved(activeCase.id);
      onChangeProgress({
        ...progress,
        attemptsUsed: nextAttempts,
        caseSolved: true,
        solveFeedback: {
          optionId: picked.id,
          isCorrect: true,
          message: picked.feedback,
          citedEvidenceIds: picked.citedEvidenceIds,
          guidedResolution: false,
        },
      });
      return;
    }

    // Incorrect on Attempt 1 -> supportive evidence-based feedback + allow 1 more try
    if (nextAttempts < 2) {
      playUiTone('tap', audio.sfxEnabled, false);
      onChangeProgress({
        ...progress,
        attemptsUsed: nextAttempts,
        solveFeedback: {
          optionId: picked.id,
          isCorrect: false,
          message: picked.feedback,
          citedEvidenceIds: picked.citedEvidenceIds,
          guidedResolution: false,
        },
      });
      return;
    }

    // Attempt 2 used -> supportive guided resolution explaining why the correct evidence-based answer works
    playUiTone('confirm', audio.sfxEnabled, false);
    onCaseSolved(activeCase.id);
    const correctOption =
      activeCase.answerOptions.find((opt) => opt.isCorrect) ?? picked;
    const guidedMessage = `${picked.feedback} — ${correctOption.feedback}`;
    const esGuided = `${esOpt?.feedback ?? ''} — ${esCaseRef.answerOptions.find((o) => o.isCorrect)?.feedback ?? ''}`;
    const enGuided = `${enOpt?.feedback ?? ''} — ${enCaseRef.answerOptions.find((o) => o.isCorrect)?.feedback ?? ''}`;

    onChangeProgress({
      ...progress,
      attemptsUsed: nextAttempts,
      caseSolved: true,
      solveFeedback: {
        optionId: picked.id,
        isCorrect: false,
        message: guidedMessage,
        citedEvidenceIds: correctOption.citedEvidenceIds,
        guidedResolution: true,
      },
    });
    if (speech.voiceOn && speech.volume > 0) {
      speakCustomText(guidedMessage, esGuided, enGuided, true);
    }
  };

  const handleRetrySolve = () => {
    playUiTone('tap', audio.sfxEnabled, false);
    onChangeProgress({
      ...progress,
      selectedOptionId: null,
      solveFeedback: null,
    });
  };

  const blocked = speech.narrationBlocked && !speech.isSpeaking;

  return (
    <div className="relative z-10 mx-auto flex h-full w-full max-w-[1220px] flex-col px-2.5 py-1.5 sm:px-5 sm:py-2.5">
      {/* Top Investigation Command Header */}
      <header className="flex flex-none flex-wrap items-center justify-between gap-2 pb-1.5 sm:pb-2">
        <div className="flex min-w-0 items-center gap-1.5 sm:gap-2.5">
          <button
            type="button"
            onClick={() => {
              speech.stop();
              playUiTone('tap', audio.sfxEnabled, false);
              onBackToLibrary();
            }}
            className="inline-flex min-h-[36px] flex-none items-center gap-1 rounded-xl border-2 border-[#48C5B5]/60 bg-[#101D35] px-2.5 py-1 text-xs font-black text-[#EAF4F2] shadow-[0_2px_0_#070e1c] transition hover:bg-[#162747]"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-[#48C5B5]" aria-hidden="true" />
            <span>{s.backToLibraryBtn}</span>
          </button>

          <div className="hidden min-w-0 items-center gap-2 md:flex">
            <NautiLogo className="h-7 lg:h-8" alt={t.platformName} />
            <span className="h-5 w-px bg-[#48C5B5]/35" aria-hidden="true" />
            <FilomatasLogo className="h-6 lg:h-7" />
          </div>

          {/* Stage Segmented Progress Strip */}
          <nav
            aria-label={s.stagePrefix}
            className="flex items-center gap-1 rounded-xl border border-[#314975] bg-[#101D35]/90 p-1"
          >
            {s.stageLabels.map((st) => {
              const active = progress.stage === st.id;
              const unlocked = canNavigateToStage(st.id);
              return (
                <button
                  key={st.id}
                  type="button"
                  disabled={!unlocked}
                  onClick={() => {
                    if (unlocked) goToStage(st.id);
                  }}
                  className={`whitespace-nowrap rounded-lg px-2 py-1 text-[10px] font-black transition sm:text-[11px] ${
                    active
                      ? 'bg-[#F2C66D] text-[#101D35] shadow-sm'
                      : unlocked
                        ? 'text-[#EAF4F2]/90 hover:bg-[#162747]'
                        : 'cursor-not-allowed text-[#647aa0]'
                  }`}
                >
                  {st.shortLabel}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-none items-center gap-1.5 sm:gap-2">
          <LanguageSelector
            value={audio.audioLang}
            onChange={audio.setAudioLang}
            variant="hud"
          />
          <SoundControlButton
            audio={audio}
            speech={speech}
            onReplayCurrent={() =>
              speakCustomText(
                currentSpeechText,
                buildStageSpeech(esCaseRef, progress),
                buildStageSpeech(enCaseRef, progress),
                true,
              )
            }
            onOpenVoiceModal={onOpenVoiceSettings}
          />
        </div>
      </header>

      {/* Main Horizontal 16:9 Investigation Split */}
      <main className="grid min-h-0 flex-1 grid-cols-12 gap-2.5 sm:gap-4">
        {/* LEFT BAY: Live NAUTI Guide + Dialogue Bubble */}
        <aside className="col-span-4 flex h-full min-h-0 flex-col items-center justify-center gap-2 lg:col-span-4">
          <div className="relative flex w-full max-w-[180px] flex-none items-center justify-center sm:max-w-[215px]">
            <NautiCharacterRig
              expression={nautiUi.expression}
              gaze="right"
              handPose={progress.stage === 'resolved' ? 'wave' : 'none'}
              isSpeaking={speech.isSpeaking}
              mouthPulse={speech.mouthPulse}
              className="w-[62%] max-w-[min(175px,31dvh)] sm:w-[68%]"
              stickerRim
              onTickleSound={onTickleSound}
            />
          </div>

          <div className="cockpit-scroll max-h-[42dvh] w-full overflow-y-auto rounded-2xl border-2 border-[#EAF4F2] bg-[#EAF4F2] px-3 py-2 text-[#101D35] shadow-[0_4px_0_#070e1c]">
            <div className="mb-1 flex items-center justify-between gap-1.5">
              <span className="text-[10px] font-black tracking-wider text-[#1c7c71] uppercase">
                {t.nautiSays}
              </span>
              {speech.isSpeaking ? (
                <button
                  type="button"
                  onClick={speech.stop}
                  className="inline-flex items-center gap-1 rounded-full bg-[#ff5c6c] px-2 py-0.5 text-[10px] font-black text-white"
                >
                  <Square className="h-2.5 w-2.5 fill-current" />
                  <span>{t.stopShort}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    audio.unlockAndStart();
                    speakCustomText(
                      currentSpeechText,
                      buildStageSpeech(esCaseRef, progress),
                      buildStageSpeech(enCaseRef, progress),
                      true,
                    );
                  }}
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black ${
                    blocked
                      ? 'bg-[#F2C66D] text-[#101D35]'
                      : 'bg-[#48C5B5]/20 text-[#101D35]'
                  }`}
                >
                  {blocked ? (
                    <Hand className="h-2.5 w-2.5" />
                  ) : (
                    <Volume2 className="h-2.5 w-2.5" />
                  )}
                  <span>{blocked ? t.tapToListen : t.listenAgain}</span>
                </button>
              )}
            </div>
            <p className="text-[11px] leading-snug font-bold sm:text-xs">
              {tickleCaption || nautiUi.bubbleText}
            </p>
          </div>
        </aside>

        {/* RIGHT BAY: 5-Stage Scientific Investigation Console */}
        <section className="col-span-8 flex min-h-0 flex-col overflow-hidden rounded-2xl border-2 border-[#48C5B5] bg-[#101D35]/95 text-[#EAF4F2] shadow-[0_6px_0_#070e1c] lg:col-span-8">
          <div className="cockpit-scroll min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
            {/* STAGE 1 — THE MYSTERY */}
            {progress.stage === 'mystery' && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold text-[#48C5B5]">
                  <span>
                    {s.stagePrefix} 1 / 5 · {activeCase.focusTopic}
                  </span>
                  <span className="tabular-nums text-[#F2C66D]">
                    {activeCase.estimatedMinutes}
                  </span>
                </div>

                <h1 className="text-lg leading-tight font-black text-[#EAF4F2] sm:text-2xl">
                  {activeCase.title}
                </h1>

                <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-12">
                  {/* Illustration (with automatic SVG fallback) */}
                  <div className="overflow-hidden rounded-2xl border-2 border-[#314975] bg-[#0b1528] md:col-span-5">
                    {!imgError ? (
                      <img
                        src={caseWaterIllustration}
                        alt={activeCase.title}
                        referrerPolicy="no-referrer"
                        onError={() => setImgError(true)}
                        className="aspect-[4/3] w-full object-cover"
                      />
                    ) : (
                      <CaseWaterFallbackDiagram className="aspect-[4/3] w-full" />
                    )}
                  </div>

                  {/* Narrative + Main Mystery Question */}
                  <div className="space-y-2.5 md:col-span-7">
                    <div className="space-y-1.5 text-xs leading-relaxed font-semibold text-[#EAF4F2]/95 sm:text-[13px]">
                      {activeCase.stage1Narrative
                        .split('\n\n')
                        .map((para, idx) => (
                          <p key={idx}>{para}</p>
                        ))}
                    </div>

                    <div className="rounded-2xl border-2 border-[#F2C66D] bg-[#162747] p-3">
                      <span className="flex items-center gap-1.5 text-[10px] font-black tracking-wide text-[#F2C66D] uppercase">
                        <Search className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{s.stage1QuestionLabel}</span>
                      </span>
                      <p className="mt-1 text-sm leading-snug font-black text-[#EAF4F2]">
                        {activeCase.mysteryQuestion}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 2 — DISCOVER THE EVIDENCE */}
            {progress.stage === 'evidence' && (
              <div className="flex flex-col gap-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h1 className="text-base leading-tight font-black text-[#EAF4F2] sm:text-xl">
                      {s.stage2Title}
                    </h1>
                    <p className="mt-0.5 text-[11px] font-semibold text-[#b9d4d0] sm:text-xs">
                      {s.stage2Subtitle}
                    </p>
                  </div>
                  <span className="tabular-nums text-xs font-black text-[#F2C66D]">
                    {s.evidenceProgressLabel(
                      progress.revealedEvidenceIds.length,
                      activeCase.evidenceCards.length,
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {activeCase.evidenceCards.map((card, cardIndex) => {
                    const isRevealed = progress.revealedEvidenceIds.includes(
                      card.id,
                    );
                    const esCard = esCaseRef.evidenceCards[cardIndex];
                    const enCard = enCaseRef.evidenceCards[cardIndex];

                    if (!isRevealed) {
                      return (
                        <button
                          key={card.id}
                          type="button"
                          onClick={() => handleRevealEvidence(card.id)}
                          className="flex min-h-[68px] w-full items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-[#48C5B5] bg-[#162747]/90 px-4 py-3 text-left transition hover:border-[#F2C66D] hover:bg-[#1a3057] active:translate-y-[1px]"
                        >
                          <div className="min-w-0">
                            <span className="block text-[10px] font-black text-[#48C5B5] uppercase">
                              {card.badge}
                            </span>
                            <span className="mt-0.5 block text-sm font-black text-[#EAF4F2]">
                              {card.title}
                            </span>
                          </div>
                          <span className="inline-flex flex-none items-center gap-1.5 rounded-xl bg-[#F2C66D] px-3 py-2 text-xs font-black text-[#101D35] shadow-[0_2px_0_#9f7829]">
                            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>{s.revealCardBtn}</span>
                          </span>
                        </button>
                      );
                    }

                    return (
                      <article
                        key={card.id}
                        className="rounded-2xl border-2 border-[#EAF4F2] bg-[#EAF4F2] p-3 text-[#101D35] shadow-[0_4px_0_#070e1c]"
                      >
                        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start">
                          <div className="flex-none">
                            <DetectiveEvidenceVisual
                              visualId={card.visualId}
                              className="h-16 w-28 rounded-xl"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-1.5">
                              <span className="text-[10px] font-black tracking-wide text-[#1c7c71] uppercase">
                                {card.badge}
                              </span>
                              <div className="flex items-center gap-2">
                                {card.figureValue && (
                                  <span className="tabular-nums rounded-md bg-[#101D35] px-2 py-0.5 text-[11px] font-black text-[#F2C66D]">
                                    {card.figureValue}
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={() =>
                                    speakCustomText(
                                      `${card.title}. ${card.fact} ${card.explanation}`,
                                      esCard
                                        ? `${esCard.title}. ${esCard.fact} ${esCard.explanation}`
                                        : undefined,
                                      enCard
                                        ? `${enCard.title}. ${enCard.fact} ${enCard.explanation}`
                                        : undefined,
                                      true,
                                    )
                                  }
                                  className="inline-flex items-center gap-1 rounded-lg border border-[#48C5B5] bg-white px-2 py-0.5 text-[10px] font-black text-[#101D35] hover:bg-[#e5f8f5]"
                                >
                                  <Volume2
                                    className="h-3 w-3 text-[#1c7c71]"
                                    aria-hidden="true"
                                  />
                                  <span>{s.listenCardBtn}</span>
                                </button>
                              </div>
                            </div>

                            <h2 className="mt-0.5 text-sm leading-tight font-black text-[#101D35] sm:text-base">
                              {card.title}
                            </h2>
                            <p className="mt-1 text-xs leading-snug font-bold text-[#101D35]">
                              {card.fact}
                            </p>
                            <p className="mt-1 text-[11px] leading-snug font-semibold text-[#1e355f]">
                              {card.explanation}
                            </p>
                            {card.caveatNote && (
                              <p className="mt-1.5 rounded-lg border border-[#d6b35a] bg-[#fef9e7] px-2.5 py-1 text-[11px] font-bold text-[#6e4c06]">
                                {card.caveatNote}
                              </p>
                            )}
                            <div className="mt-1.5 flex items-center justify-between gap-2 text-[10px] font-bold text-[#335275]">
                              <span>{card.figureLabel}</span>
                              <a
                                href={card.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[#1c7c71] underline hover:text-[#101D35]"
                              >
                                <span>{card.sourceLabel}</span>
                                <ExternalLink
                                  className="h-2.5 w-2.5"
                                  aria-hidden="true"
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STAGE 3 — CONNECT THE EVIDENCE (Touch-Friendly Board) */}
            {progress.stage === 'connect' && (
              <div className="flex flex-col gap-3">
                <div>
                  <h1 className="text-base leading-tight font-black text-[#EAF4F2] sm:text-xl">
                    {s.stage3Title}
                  </h1>
                  <p className="mt-0.5 text-xs font-bold text-[#F2C66D]">
                    {activeCase.connectionQuestion}
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold text-[#b9d4d0]">
                    {s.stage3Subtitle}
                  </p>
                </div>

                {/* Source Evidence Cards Pool */}
                <div>
                  <span className="mb-1.5 block text-[10px] font-black tracking-wide text-[#48C5B5] uppercase">
                    {s.stage3SelectCardPrompt}
                  </span>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {activeCase.evidenceCards.map((card) => {
                      const isPicked = selectedEvidenceForSlot === card.id;
                      const assignedSlotId = Object.keys(
                        progress.selectedConnections,
                      ).find(
                        (slotKey) =>
                          progress.selectedConnections[slotKey] === card.id,
                      );
                      return (
                        <button
                          key={card.id}
                          type="button"
                          disabled={progress.connectionVerified}
                          onClick={() => {
                            playUiTone('tap', audio.sfxEnabled, false);
                            setSelectedEvidenceForSlot((prev) =>
                              prev === card.id ? null : card.id,
                            );
                          }}
                          className={`flex min-h-[54px] flex-col items-start justify-between rounded-xl border-2 px-3 py-2 text-left transition ${
                            isPicked
                              ? 'border-[#F2C66D] bg-[#F2C66D] text-[#101D35] shadow-[0_3px_0_#9f7829]'
                              : assignedSlotId
                                ? 'border-[#48C5B5]/60 bg-[#162747]/80 text-[#b9d4d0]'
                                : 'border-[#48C5B5] bg-[#162747] text-[#EAF4F2] hover:bg-[#1e355f]'
                          }`}
                        >
                          <span className="text-[10px] font-black uppercase opacity-80">
                            {card.figureValue || card.badge}
                          </span>
                          <span className="mt-0.5 text-xs leading-tight font-black">
                            {card.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Connected 3-Node Logical Board */}
                <div className="rounded-2xl border border-[#314975] bg-[#0b1528] p-2.5 sm:p-3">
                  <div className="grid grid-cols-1 items-stretch gap-2 sm:grid-cols-3">
                    {activeCase.connectionSlots.map((slot, idx) => {
                      const placedEvidenceId =
                        progress.selectedConnections[slot.id];
                      const placedCard = placedEvidenceId
                        ? activeCase.evidenceCards.find(
                            (c) => c.id === placedEvidenceId,
                          )
                        : undefined;
                      const isReadyTarget = Boolean(
                        selectedEvidenceForSlot && !progress.connectionVerified,
                      );

                      return (
                        <div key={slot.id} className="relative flex flex-col">
                          <button
                            type="button"
                            disabled={progress.connectionVerified}
                            onClick={() => handleAssignSlot(slot.id)}
                            className={`flex h-full min-h-[96px] flex-col justify-between rounded-xl border-2 p-2.5 text-left transition ${
                              progress.connectionVerified
                                ? 'border-[#48C5B5] bg-[#13323a] text-[#EAF4F2]'
                                : isReadyTarget
                                  ? 'border-dashed border-[#F2C66D] bg-[#1b2f55] text-[#EAF4F2]'
                                  : placedCard
                                    ? 'border-[#48C5B5] bg-[#162747] text-[#EAF4F2]'
                                    : 'border-dashed border-[#314975] bg-[#101D35] text-[#b9d4d0]'
                            }`}
                          >
                            <div>
                              <span className="block text-[10px] font-black text-[#F2C66D]">
                                {slot.label}
                              </span>
                              <span className="mt-0.5 block text-[10px] font-semibold text-[#94a8c4]">
                                {slot.hint}
                              </span>
                            </div>

                            <div className="mt-2 border-t border-white/10 pt-1.5">
                              {placedCard ? (
                                <div className="flex items-center justify-between gap-1.5">
                                  <span className="text-xs font-black text-[#48C5B5]">
                                    {placedCard.title}
                                  </span>
                                  {!progress.connectionVerified && (
                                    <span className="inline-flex items-center gap-0.5 rounded bg-[#101D35] px-1.5 py-0.5 text-[10px] font-bold text-[#EAF4F2]/80">
                                      <X className="h-2.5 w-2.5" />
                                      {s.stage3ClearSlotBtn}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#F2C66D]/90">
                                  <Link2
                                    className="h-3.5 w-3.5"
                                    aria-hidden="true"
                                  />
                                  <span>{s.stage3PlaceHereBtn}</span>
                                </span>
                              )}
                            </div>
                          </button>

                          {idx < activeCase.connectionSlots.length - 1 && (
                            <div
                              className="hidden items-center justify-center py-1 text-[#48C5B5] sm:hidden"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Subtle connector summary bar */}
                  <div className="mt-2 flex items-center justify-center gap-2 text-[10px] font-bold text-[#48C5B5]">
                    <span>{activeCase.connectionSlots[0]?.stepNumber}</span>
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    <span>{activeCase.connectionSlots[1]?.stepNumber}</span>
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    <span>{activeCase.connectionSlots[2]?.stepNumber}</span>
                  </div>
                </div>

                {progress.connectionFeedback && (
                  <div
                    className={`rounded-xl border px-3 py-2 text-xs font-bold ${
                      progress.connectionVerified
                        ? 'border-[#48C5B5] bg-[#13323a] text-[#EAF4F2]'
                        : 'border-[#F2C66D] bg-[#2a2414] text-[#F2C66D]'
                    }`}
                  >
                    {progress.connectionFeedback}
                  </div>
                )}
              </div>
            )}

            {/* STAGE 4 — SOLVE THE MYSTERY */}
            {progress.stage === 'solve' && (
              <div className="flex flex-col gap-3">
                <div>
                  <span className="text-[10px] font-black tracking-wide text-[#48C5B5] uppercase">
                    {activeCase.finalSubprompt}
                  </span>
                  <h1 className="mt-0.5 text-base leading-snug font-black text-[#EAF4F2] sm:text-xl">
                    {activeCase.finalQuestion}
                  </h1>
                  <p className="mt-0.5 text-[11px] font-semibold text-[#F2C66D]">
                    {progress.attemptsUsed === 1 && !progress.caseSolved
                      ? s.stage4FinalAttempt
                      : s.stage4AttemptsRemaining}
                  </p>
                </div>

                <div
                  role="radiogroup"
                  aria-label={activeCase.finalQuestion}
                  className="grid grid-cols-1 gap-2"
                >
                  {activeCase.answerOptions.map((opt) => {
                    const isSelected = progress.selectedOptionId === opt.id;
                    const locked =
                      progress.caseSolved || progress.solveFeedback !== null;

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        disabled={locked}
                        onClick={() => {
                          playUiTone('tap', audio.sfxEnabled, false);
                          onChangeProgress({
                            ...progress,
                            selectedOptionId: opt.id,
                          });
                        }}
                        className={`flex min-h-[52px] w-full items-center gap-3 rounded-2xl border-2 px-3.5 py-2.5 text-left transition ${
                          isSelected
                            ? 'border-[#F2C66D] bg-[#EAF4F2] text-[#101D35] shadow-[0_3px_0_#9f7829]'
                            : 'border-[#314975] bg-[#162747] text-[#EAF4F2] hover:border-[#48C5B5]'
                        } disabled:opacity-80`}
                      >
                        <span
                          className={`flex h-7 w-7 flex-none items-center justify-center rounded-lg text-xs font-black ${
                            isSelected
                              ? 'bg-[#101D35] text-[#F2C66D]'
                              : 'bg-[#101D35] text-[#48C5B5]'
                          }`}
                        >
                          {opt.id}
                        </span>
                        <span className="flex-1 text-xs leading-snug font-bold sm:text-sm">
                          {opt.text}
                        </span>
                        {isSelected && (
                          <CheckCircle2
                            className="h-4.5 w-4.5 flex-none text-[#1c7c71]"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {progress.solveFeedback && (
                  <div
                    className={`rounded-2xl border-2 p-3 text-xs leading-relaxed ${
                      progress.solveFeedback.isCorrect
                        ? 'border-[#48C5B5] bg-[#13323a] text-[#EAF4F2]'
                        : 'border-[#F2C66D] bg-[#2a2414] text-[#EAF4F2]'
                    }`}
                  >
                    <p className="font-bold">{progress.solveFeedback.message}</p>
                    {progress.solveFeedback.citedEvidenceIds.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {progress.solveFeedback.citedEvidenceIds.map((eid) => {
                          const ev = activeCase.evidenceCards.find(
                            (c) => c.id === eid,
                          );
                          if (!ev) return null;
                          return (
                            <span
                              key={eid}
                              className="rounded-md bg-[#101D35]/90 px-2 py-0.5 text-[10px] font-black text-[#48C5B5]"
                            >
                              {ev.title}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* STAGE 5 — CASE RESOLVED & DIGITAL DISCOVERY CARD */}
            {progress.stage === 'resolved' && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h1 className="text-lg font-black text-[#F2C66D] sm:text-2xl">
                    {s.stage5Title}
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-md bg-[#48C5B5]/20 px-2.5 py-1 text-[11px] font-black text-[#48C5B5]">
                    <Award className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{s.stage5SavedBadge}</span>
                  </span>
                </div>

                {/* NAUTI Final Scientific Explanation */}
                <div className="space-y-1.5 rounded-2xl border border-[#314975] bg-[#162747] p-3 text-xs leading-relaxed font-semibold text-[#EAF4F2]">
                  {activeCase.finalExplanationParagraphs.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                  <p className="pt-1 text-[11px] font-bold text-[#48C5B5]">
                    {activeCase.scientificContextNote}
                  </p>
                </div>

                {/* Digital Scientific Discovery Card */}
                <article className="rounded-2xl border-2 border-[#F2C66D] bg-[#EAF4F2] p-3.5 text-[#101D35] shadow-[0_5px_0_#070e1c]">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#101D35]/15 pb-2">
                    <div>
                      <span className="block text-[10px] font-black tracking-wide text-[#1c7c71] uppercase">
                        {s.stage5DiscoveryCardTitle}
                      </span>
                      <h2 className="text-sm font-black text-[#101D35] sm:text-base">
                        {activeCase.discoveryCard.caseTitle}
                      </h2>
                    </div>
                    <span className="tabular-nums rounded-lg bg-[#101D35] px-2.5 py-1 text-xs font-black text-[#F2C66D]">
                      {activeCase.discoveryCard.keyNumericalData}
                    </span>
                  </div>

                  <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs">
                    <div>
                      <span className="block text-[10px] font-black text-[#335275] uppercase">
                        {s.stage5FactLabel}
                      </span>
                      <p className="mt-0.5 font-bold text-[#101D35]">
                        {activeCase.discoveryCard.mainScientificFact}
                      </p>
                    </div>
                    <div>
                      <span className="block text-[10px] font-black text-[#335275] uppercase">
                        {s.stage5ExplanationLabel}
                      </span>
                      <p className="mt-0.5 font-semibold text-[#1e355f]">
                        {activeCase.discoveryCard.shortExplanation}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-[#101D35]/15 pt-2 text-[11px]">
                    <span className="font-bold text-[#1c7c71]">
                      {s.stage5TechStatusLabel}:{' '}
                      {activeCase.discoveryCard.technologyStatusLabel}
                    </span>
                    <a
                      href={activeCase.nasaSource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-black text-[#101D35] underline hover:text-[#1c7c71]"
                    >
                      <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>
                        {activeCase.nasaSource.title} (
                        {activeCase.nasaSource.publicationDate})
                      </span>
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  </div>
                </article>
              </div>
            )}
          </div>

          {/* Sticky Investigation Footer Action Bar */}
          <footer className="flex flex-none flex-wrap items-center justify-between gap-2 border-t border-[#314975] bg-[#0b1528] px-3 py-2 sm:px-4">
            {progress.stage === 'mystery' && (
              <>
                <button
                  type="button"
                  onClick={onBackToLibrary}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#314975] bg-[#162747] px-3 py-1.5 text-xs font-black text-[#EAF4F2]"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>{s.backToLibraryBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={() => goToStage('evidence')}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border-2 border-[#EAF4F2] bg-[#F2C66D] px-5 py-1.5 text-xs font-black text-[#101D35] shadow-[0_3px_0_#9f7829] transition hover:brightness-105 active:translate-y-[1px] sm:text-sm"
                >
                  <Search className="h-4 w-4" aria-hidden="true" />
                  <span>{s.stage1InvestigateBtn}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </>
            )}

            {progress.stage === 'evidence' && (
              <>
                <button
                  type="button"
                  onClick={() => goToStage('mystery')}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#314975] bg-[#162747] px-3 py-1.5 text-xs font-black text-[#EAF4F2]"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>{t.prev}</span>
                </button>
                <button
                  type="button"
                  disabled={!allEvidenceRevealed}
                  onClick={() => goToStage('connect')}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border-2 border-[#EAF4F2] bg-[#F2C66D] px-5 py-1.5 text-xs font-black text-[#101D35] shadow-[0_3px_0_#9f7829] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-45 sm:text-sm"
                >
                  <span>{s.stage2ContinueBtn}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </>
            )}

            {progress.stage === 'connect' && (
              <>
                <button
                  type="button"
                  onClick={() => goToStage('evidence')}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#314975] bg-[#162747] px-3 py-1.5 text-xs font-black text-[#EAF4F2]"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>{t.prev}</span>
                </button>

                {!progress.connectionVerified ? (
                  <button
                    type="button"
                    disabled={!allSlotsFilled}
                    onClick={handleCheckConnections}
                    className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border-2 border-[#EAF4F2] bg-[#48C5B5] px-5 py-1.5 text-xs font-black text-[#101D35] shadow-[0_3px_0_#1c7c71] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-45 sm:text-sm"
                  >
                    <HelpCircle className="h-4 w-4" aria-hidden="true" />
                    <span>{s.stage3CheckBtn}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => goToStage('solve')}
                    className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border-2 border-[#EAF4F2] bg-[#F2C66D] px-5 py-1.5 text-xs font-black text-[#101D35] shadow-[0_3px_0_#9f7829] transition hover:brightness-105 sm:text-sm"
                  >
                    <span>{s.stage3ContinueBtn}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </>
            )}

            {progress.stage === 'solve' && (
              <>
                <button
                  type="button"
                  onClick={() => goToStage('connect')}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#314975] bg-[#162747] px-3 py-1.5 text-xs font-black text-[#EAF4F2]"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>{t.prev}</span>
                </button>

                {!progress.solveFeedback ? (
                  <button
                    type="button"
                    disabled={!progress.selectedOptionId}
                    onClick={handleSubmitOption}
                    className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border-2 border-[#EAF4F2] bg-[#F2C66D] px-5 py-1.5 text-xs font-black text-[#101D35] shadow-[0_3px_0_#9f7829] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-45 sm:text-sm"
                  >
                    <span>{s.stage4SubmitBtn}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : !progress.caseSolved ? (
                  <button
                    type="button"
                    onClick={handleRetrySolve}
                    className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border-2 border-[#EAF4F2] bg-[#F2C66D] px-5 py-1.5 text-xs font-black text-[#101D35] shadow-[0_3px_0_#9f7829]"
                  >
                    <span>{s.stage4RetryBtn}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => goToStage('resolved')}
                    className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border-2 border-[#EAF4F2] bg-[#48C5B5] px-5 py-1.5 text-xs font-black text-[#101D35] shadow-[0_3px_0_#1c7c71] sm:text-sm"
                  >
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    <span>{s.stage4ToResolvedBtn}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </>
            )}

            {progress.stage === 'resolved' && (
              <div className="flex w-full flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    speech.stop();
                    playUiTone('tap', audio.sfxEnabled, false);
                    onBackToWelcome();
                  }}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#314975] bg-[#162747] px-3 py-1.5 text-xs font-black text-[#EAF4F2]"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>{s.stage5BackMenuBtn}</span>
                </button>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      speech.stop();
                      playUiTone('tap', audio.sfxEnabled, false);
                      onOpenDiscoveries();
                    }}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#48C5B5] bg-[#162747] px-3.5 py-1.5 text-xs font-black text-[#48C5B5]"
                  >
                    <Award className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{s.stage5ViewDiscoveriesBtn}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      speech.stop();
                      playUiTone('confirm', audio.sfxEnabled, false);
                      onBackToLibrary();
                    }}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border-2 border-[#EAF4F2] bg-[#F2C66D] px-4 py-1.5 text-xs font-black text-[#101D35] shadow-[0_2px_0_#9f7829]"
                  >
                    <Search className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{s.stage5InvestigateAnotherBtn}</span>
                  </button>
                </div>
              </div>
            )}
          </footer>
        </section>
      </main>
    </div>
  );
};
