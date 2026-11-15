import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Compass,
  FlaskConical,
  Hand,
  HelpCircle,
  Lightbulb,
  MessageSquare,
  PenTool,
  RotateCcw,
  Search,
  Share2,
  Square,
  Users,
  Volume2,
} from 'lucide-react';
import { getTraduciendoStrings } from '../data/traduciendoStrings';
import { UI_STRINGS } from '../data/uiStrings';
import type { MusicAudioControls } from '../hooks/useMusicAudio';
import type { SpeechControlsState } from '../hooks/useSpeech';
import type {
  ScienceEvidenceCard,
  ScienceStudyRecord,
  TraduciendoProgressState,
  TraduciendoStage,
} from '../types/traduciendoCiencia';
import {
  TRADUCIENDO_STAGE_ORDER,
  buildFormativeChecklist,
  createInitialTraduciendoState,
  markEvidenceCardReviewed,
  moveDebateQuestion,
  selectTranslateChoice,
  submitDebateGroupAnswer,
} from '../utils/traduciendoEngine';
import { FilomatasLogo } from './FilomatasLogo';
import { LanguageSelector } from './LanguageSelector';
import { NautiCharacterRig } from './NautiCharacterRig';
import { NautiLogo } from './NautiLogo';
import { SoundControlButton } from './SoundControlButton';

interface TraduciendoActivityRunnerProps {
  study: ScienceStudyRecord;
  progress: TraduciendoProgressState;
  onChangeProgress: (next: TraduciendoProgressState) => void;
  audio: MusicAudioControls;
  speech: SpeechControlsState;
  onListen: (customText?: string) => void;
  onStopVoice: () => void;
  onOpenVoiceSettings: () => void;
  onBackToLibrary: () => void;
}

const STAGE_ICONS: Record<
  TraduciendoStage,
  React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
> = {
  discover: BookOpen,
  investigate: Search,
  debate: Users,
  translate: PenTool,
  share: Share2,
};

const EVIDENCE_ICONS: Record<
  ScienceEvidenceCard['id'],
  React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
> = {
  question: HelpCircle,
  method: FlaskConical,
  finding: Compass,
  importance: Lightbulb,
};

export const TraduciendoActivityRunner: React.FC<
  TraduciendoActivityRunnerProps
> = ({
  study,
  progress,
  onChangeProgress,
  audio,
  speech,
  onListen,
  onStopVoice,
  onOpenVoiceSettings,
  onBackToLibrary,
}) => {
  const t = UI_STRINGS[audio.audioLang];
  const s = getTraduciendoStrings(audio.audioLang);
  const [openClueId, setOpenClueId] = useState<ScienceEvidenceCard['id']>(
    'question',
  );
  const [showCluesDrawer, setShowCluesDrawer] = useState<boolean>(false);

  const stage = progress.stage;
  const currentQ = study.debateQuestions[progress.debateIndex];
  const submittedAnswer = currentQ
    ? progress.submittedDebateAnswers[currentQ.id]
    : undefined;
  const blocked = speech.narrationBlocked && !speech.isSpeaking;

  const currentStagePrompt =
    stage === 'discover'
      ? study.storyParagraphs.join(' ')
      : stage === 'investigate'
        ? s.investigateHint
        : stage === 'debate'
          ? s.debateTeamPrompt
          : stage === 'translate'
            ? s.translateNautiPrompt
            : s.shareNautiPrompt;

  const setStage = (nextStage: TraduciendoStage) => {
    speech.stop();
    setShowCluesDrawer(false);
    onChangeProgress({
      ...progress,
      stage: nextStage,
    });
  };

  return (
    <div className="relative z-10 mx-auto flex h-full w-full max-w-[1200px] flex-col px-3 py-2 sm:px-5 sm:py-2.5">
      {/* Top Bar */}
      <header className="flex flex-none items-center justify-between gap-2 pb-1.5">
        <div className="flex min-w-0 items-center gap-1.5 sm:gap-2.5">
          <button
            type="button"
            onClick={onBackToLibrary}
            className="inline-flex min-h-[34px] flex-none items-center gap-1 rounded-xl border-2 border-[#48C5B5]/60 bg-[#101D35] px-2.5 py-1 text-xs font-black text-[#EAF4F2] shadow-[0_2px_0_#070e1c] transition hover:bg-[#162747] active:translate-y-[1px]"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-[#48C5B5]" aria-hidden="true" />
            <span className="hidden sm:inline">{s.backToLibraryBtn}</span>
          </button>

          <NautiLogo className="h-6 sm:h-8" alt={t.platformName} />
          <span
            className="hidden h-5 w-px flex-none bg-[#48C5B5]/35 md:inline-block"
            aria-hidden="true"
          />
          <FilomatasLogo className="hidden h-6 md:block md:h-7" />
        </div>

        <div className="flex flex-none items-center gap-1.5">
          <LanguageSelector
            value={audio.audioLang}
            onChange={audio.setAudioLang}
            variant="hud"
          />
          <SoundControlButton
            audio={audio}
            speech={speech}
            onReplayCurrent={() => onListen(currentStagePrompt)}
            onOpenVoiceModal={onOpenVoiceSettings}
          />
        </div>
      </header>

      {/* 5-Stage Progress Strip */}
      <nav
        aria-label={study.studentTitle}
        className="mb-1.5 flex flex-none items-center gap-1 overflow-x-auto rounded-2xl border border-[#48C5B5]/35 bg-[#101D35]/90 p-1.5"
      >
        {TRADUCIENDO_STAGE_ORDER.map((stageId, idx) => {
          const Icon = STAGE_ICONS[stageId];
          const isCurrent = stage === stageId;
          const currentIdx = TRADUCIENDO_STAGE_ORDER.indexOf(stage);
          const isVisited = idx <= currentIdx;
          return (
            <button
              key={stageId}
              type="button"
              onClick={() => setStage(stageId)}
              className={`flex min-w-0 flex-1 items-center justify-center gap-1 rounded-xl px-2 py-1 text-[11px] font-black transition ${
                isCurrent
                  ? 'bg-[#48C5B5] text-[#101D35]'
                  : isVisited
                    ? 'bg-[#162747] text-[#EAF4F2] hover:bg-[#1d335c]'
                    : 'text-[#94a8c4] hover:bg-[#162747]/60'
              }`}
            >
              <Icon className="h-3.5 w-3.5 flex-none" aria-hidden={true} />
              <span className="truncate">
                {idx + 1}. {s.stageNames[stageId]}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Main Activity Scroll Container */}
      <div className="cockpit-scroll min-h-0 flex-1 overflow-y-auto pr-1 pb-2">
        {/* Honest Demo vs Verified OSDR Identification Banner */}
        <div
          className={`mb-2 flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3 py-1.5 text-[11px] font-bold ${
            study.isDemonstration
              ? 'border-[#F2C66D]/60 bg-[#2a2416]/90 text-[#F2C66D]'
              : 'border-[#48C5B5]/50 bg-[#101D35]/90 text-[#48C5B5]'
          }`}
        >
          <span>
            {study.isDemonstration ? s.demoWarningBanner : study.sourceLabel}
          </span>
          <span className="rounded-md bg-black/25 px-2 py-0.5 text-[10px] font-black uppercase">
            {study.osdrIdentifier}
          </span>
        </div>

        {/* STAGE 1: DESCUBRIR */}
        {stage === 'discover' && (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
            <section className="rounded-2xl border-2 border-[#48C5B5]/50 bg-[#101D35]/95 p-3.5 shadow-[0_5px_0_#070e1c] sm:p-4 lg:col-span-8">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-md bg-[#48C5B5]/20 px-2 py-0.5 text-[10px] font-black tracking-wide text-[#48C5B5] uppercase">
                  1. {s.stageNames.discover}
                </span>
                {speech.isSpeaking ? (
                  <button
                    type="button"
                    onClick={onStopVoice}
                    className="inline-flex items-center gap-1 rounded-full bg-[#ff5c6c] px-2.5 py-0.5 text-[11px] font-black text-white"
                  >
                    <Square className="h-3 w-3 fill-current" />
                    <span>{t.stopShort}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      audio.unlockAndStart();
                      speech.markUserUnlocked();
                      onListen(study.storyParagraphs.join(' '));
                    }}
                    className="inline-flex items-center gap-1 rounded-full bg-[#48C5B5]/20 px-2.5 py-0.5 text-[11px] font-black text-[#48C5B5] hover:bg-[#48C5B5]/30"
                  >
                    <Volume2 className="h-3 w-3" />
                    <span>{blocked ? t.tapToListen : t.listenAgain}</span>
                  </button>
                )}
              </div>

              <h1 className="mt-1.5 text-lg leading-tight font-black text-[#EAF4F2] sm:text-xl">
                {study.studentTitle}
              </h1>

              <div className="mt-2.5 space-y-2 text-xs leading-relaxed font-semibold text-[#EAF4F2]/95 sm:text-sm">
                {study.storyParagraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              <div className="mt-3 rounded-xl border border-[#F2C66D]/45 bg-[#162747] px-3 py-2 text-[11px] font-semibold text-[#F2C66D]">
                <strong className="font-black uppercase">
                  {s.narrativeVsScienceTitle}:{' '}
                </strong>
                {study.storyDistinctionNote}
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-[11px] font-bold text-[#9df8ff]">
                  {s.facilitatorLabel}: {study.facilitatorDiscoverPrompt}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const updated = markEvidenceCardReviewed(progress, 'question');
                    setOpenClueId('question');
                    setStageAndUpdate(updated, 'investigate');
                  }}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-2xl bg-[#F2C66D] px-5 py-2 text-xs font-black text-[#101D35] shadow-[0_3px_0_#9f7829] transition hover:brightness-105 active:translate-y-[1px] sm:text-sm"
                >
                  <span>{s.discoverContinueBtn}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </section>

            {/* Right Integrity Card: Methods, Limits & Scope */}
            <aside className="flex flex-col gap-2.5 rounded-2xl border border-[#314975] bg-[#101D35]/85 p-3.5 text-xs lg:col-span-4">
              <h2 className="text-xs font-black tracking-wide text-[#48C5B5] uppercase">
                {s.methodsLimitsTitle}
              </h2>
              <div>
                <p className="text-[10px] font-black text-[#F2C66D] uppercase">
                  {s.methodsLabel}
                </p>
                <p className="mt-0.5 leading-snug font-semibold text-[#EAF4F2]/90">
                  {study.studyMethods}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black text-[#F2C66D] uppercase">
                  {s.limitationsLabel}
                </p>
                <p className="mt-0.5 leading-snug font-semibold text-[#EAF4F2]/90">
                  {study.limitations}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black text-[#F2C66D] uppercase">
                  {s.applicationsLabel}
                </p>
                <p className="mt-0.5 leading-snug font-semibold text-[#EAF4F2]/90">
                  {study.potentialApplications}
                </p>
              </div>
            </aside>
          </div>
        )}

        {/* STAGE 2: INVESTIGAR */}
        {stage === 'investigate' && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#48C5B5]/40 bg-[#101D35]/90 px-3.5 py-2.5">
              <div>
                <h1 className="text-base font-black text-[#EAF4F2] sm:text-lg">
                  2. {s.investigateTitle}
                </h1>
                <p className="text-xs font-semibold text-[#b9d4d0]">
                  {s.investigateHint}
                </p>
              </div>
              <span className="rounded-lg bg-[#162747] px-2.5 py-1 text-xs font-black text-[#48C5B5]">
                {s.investigateReviewedCount(
                  progress.reviewedEvidenceIds.length,
                  study.evidenceCards.length,
                )}
              </span>
            </div>

            {/* 4 Interactive Evidence Cards */}
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {study.evidenceCards.map((card, idx) => {
                const CardIcon = EVIDENCE_ICONS[card.id];
                const isOpen = openClueId === card.id;
                const isReviewed = progress.reviewedEvidenceIds.includes(card.id);
                return (
                  <div
                    key={card.id}
                    className={`rounded-2xl border-2 transition ${
                      isOpen
                        ? 'border-[#48C5B5] bg-[#EAF4F2] text-[#101D35] shadow-[0_4px_0_#070e1c]'
                        : 'border-[#314975] bg-[#101D35]/90 text-[#EAF4F2] hover:border-[#48C5B5]/70'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setOpenClueId(card.id);
                        onChangeProgress(
                          markEvidenceCardReviewed(progress, card.id),
                        );
                      }}
                      className="flex w-full items-center justify-between gap-2 p-3 text-left"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          className={`flex h-8 w-8 flex-none items-center justify-center rounded-xl ${
                            isOpen
                              ? 'bg-[#101D35] text-[#48C5B5]'
                              : 'bg-[#162747] text-[#48C5B5]'
                          }`}
                        >
                          <CardIcon className="h-4 w-4" aria-hidden={true} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-black sm:text-sm">
                            {idx + 1}. {card.promptTitle}
                          </p>
                          {!isOpen && (
                            <p className="text-[11px] font-semibold text-[#94a8c4]">
                              {s.evidenceTapHint}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="flex items-center gap-1">
                        {isReviewed && (
                          <CheckCircle2
                            className={`h-4 w-4 ${
                              isOpen ? 'text-[#1c7c71]' : 'text-[#48C5B5]'
                            }`}
                            aria-hidden="true"
                          />
                        )}
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <ChevronDown className="h-4 w-4" aria-hidden="true" />
                        )}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="border-t border-[#101D35]/15 px-3 pb-3 pt-2 text-xs">
                        <p className="font-extrabold text-[#101D35]">
                          {card.summary}
                        </p>
                        <p className="mt-1 leading-snug font-semibold text-[#23395d]">
                          {card.detail}
                        </p>
                        <p className="mt-2 rounded-lg bg-[#d5ebe7] px-2.5 py-1.5 text-[11px] font-bold text-[#101D35]">
                          <strong>{s.obsVsInterpLabel}: </strong>
                          {card.observationVsInterpretationNote}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setStage('debate')}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-[#F2C66D] px-5 py-2 text-xs font-black text-[#101D35] shadow-[0_3px_0_#9f7829] transition hover:brightness-105 sm:text-sm"
              >
                <span>{s.investigateDoneBtn}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* STAGE 3: DEBATIR */}
        {stage === 'debate' && currentQ && (
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#48C5B5]/45 bg-[#101D35]/95 px-3.5 py-2.5">
              <div>
                <p className="text-[11px] font-black tracking-wide text-[#48C5B5] uppercase">
                  3. {s.debateTitle} · {progress.debateIndex + 1}/
                  {study.debateQuestions.length}
                </p>
                <p className="text-xs font-bold text-[#F2C66D]">
                  {s.debateTeamPrompt}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCluesDrawer((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#48C5B5]/50 bg-[#162747] px-3 py-1.5 text-xs font-black text-[#EAF4F2] hover:bg-[#1d3460]"
              >
                <Search className="h-3.5 w-3.5 text-[#48C5B5]" />
                <span>
                  {showCluesDrawer ? s.debateHideCluesBtn : s.debateShowCluesBtn}
                </span>
              </button>
            </div>

            {showCluesDrawer && (
              <div className="grid grid-cols-1 gap-2 rounded-2xl border border-[#48C5B5]/40 bg-[#0d1930] p-2.5 sm:grid-cols-2">
                {study.evidenceCards.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-xl border border-[#314975] bg-[#162747] p-2 text-[11px]"
                  >
                    <p className="font-black text-[#48C5B5]">{c.promptTitle}</p>
                    <p className="mt-0.5 font-semibold text-[#EAF4F2]">
                      {c.summary}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <section className="rounded-2xl border-2 border-[#EAF4F2]/85 bg-[#EAF4F2] p-3.5 text-[#101D35] shadow-[0_5px_0_#070e1c] sm:p-4">
              <h2 className="text-sm leading-snug font-black sm:text-base">
                {currentQ.question}
              </h2>

              <div className="mt-2.5 space-y-2">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = progress.selectedDebateOption === idx;
                  const isSubmitted = submittedAnswer !== undefined;
                  const isSupported = idx === currentQ.supportedOptionIndex;
                  let tone =
                    'border-[#b8d4cf] bg-white hover:border-[#48C5B5] text-[#101D35]';
                  if (isSubmitted) {
                    if (isSupported) {
                      tone =
                        'border-[#1c7c71] bg-[#d6f5ee] text-[#101D35] font-black';
                    } else if (isSelected) {
                      tone = 'border-[#d97706] bg-[#fef3c7] text-[#101D35]';
                    } else {
                      tone = 'border-[#d5e0de] bg-white/70 text-[#475569]';
                    }
                  } else if (isSelected) {
                    tone =
                      'border-[#101D35] bg-[#c9f0e9] text-[#101D35] shadow-[0_2px_0_#101D35]';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() =>
                        onChangeProgress({
                          ...progress,
                          selectedDebateOption: idx,
                        })
                      }
                      className={`flex min-h-[44px] w-full items-center gap-2.5 rounded-xl border-2 px-3 py-2 text-left text-xs font-bold transition sm:text-sm ${tone}`}
                    >
                      <span className="flex h-6 w-6 flex-none items-center justify-center rounded-lg bg-[#101D35] text-xs font-black text-[#EAF4F2]">
                        {'ABC'[idx]}
                      </span>
                      <span className="flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {submittedAnswer === undefined ? (
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[11px] font-bold text-[#335275]">
                    {s.facilitatorLabel}: {currentQ.facilitatorPrompt}
                  </p>
                  <button
                    type="button"
                    disabled={progress.selectedDebateOption === null}
                    onClick={() =>
                      onChangeProgress(
                        submitDebateGroupAnswer(progress, currentQ.id),
                      )
                    }
                    className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#101D35] px-4 py-2 text-xs font-black text-[#EAF4F2] transition hover:bg-[#192d52] disabled:cursor-not-allowed disabled:opacity-45 sm:text-sm"
                  >
                    <span>{s.debateConfirmBtn}</span>
                  </button>
                </div>
              ) : (
                <div className="mt-3 space-y-2 rounded-xl border border-[#48C5B5] bg-white p-3 text-xs">
                  <p className="font-black text-[#1c7c71]">
                    {submittedAnswer === currentQ.supportedOptionIndex
                      ? s.debateSupportedTitle
                      : s.debateReviewTitle}
                  </p>
                  <p className="leading-snug font-semibold text-[#101D35]">
                    {currentQ.scientificExplanation}
                  </p>
                  <p className="leading-snug font-semibold text-[#334155]">
                    <strong>{s.debateWhyOthersLabel} </strong>
                    {currentQ.whyOthersAreLessAppropriate}
                  </p>
                  {(() => {
                    const card = study.evidenceCards.find(
                      (c) => c.id === currentQ.supportingEvidenceCardId,
                    );
                    if (!card) return null;
                    return (
                      <p className="rounded-lg bg-[#EAF4F2] px-2.5 py-1.5 text-[11px] font-bold text-[#101D35]">
                        <strong>{s.debateEvidenceRefLabel}: </strong>
                        {card.promptTitle} — {card.summary}
                      </p>
                    );
                  })()}

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    {progress.debateIndex > 0 ? (
                      <button
                        type="button"
                        onClick={() =>
                          onChangeProgress(
                            moveDebateQuestion(
                              progress,
                              progress.debateIndex - 1,
                              study,
                            ),
                          )
                        }
                        className="inline-flex items-center gap-1 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-3 py-1.5 text-xs font-black text-[#101D35]"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>{s.debatePrevBtn}</span>
                      </button>
                    ) : (
                      <span />
                    )}

                    {progress.debateIndex < study.debateQuestions.length - 1 ? (
                      <button
                        type="button"
                        onClick={() =>
                          onChangeProgress(
                            moveDebateQuestion(
                              progress,
                              progress.debateIndex + 1,
                              study,
                            ),
                          )
                        }
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#48C5B5] px-4 py-1.5 text-xs font-black text-[#101D35]"
                      >
                        <span>{s.debateNextBtn}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setStage('translate')}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#F2C66D] px-4 py-1.5 text-xs font-black text-[#101D35]"
                      >
                        <span>{s.debateToTranslateBtn}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {/* STAGE 4: TRADUCIR */}
        {stage === 'translate' && (
          <div className="space-y-3">
            {/* Compact NAUTI Divulgation Prompt */}
            <div className="flex items-center gap-3 rounded-2xl border-2 border-[#EAF4F2] bg-[#EAF4F2] p-3 text-[#101D35] shadow-[0_4px_0_#070e1c]">
              <div className="w-12 flex-none">
                <NautiCharacterRig
                  expression="happy"
                  gaze="right"
                  isSpeaking={speech.isSpeaking}
                  mouthPulse={speech.mouthPulse}
                  interactiveTickle={false}
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-black tracking-wider text-[#1c7c71] uppercase">
                  {t.nautiSays}
                </span>
                <p className="text-xs leading-snug font-extrabold sm:text-sm">
                  {s.translateNautiPrompt}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold text-[#335275]">
                  {study.translateChallenge.contextHint}
                </p>
              </div>
            </div>

            {/* 3 Communication Challenge Options (A, B, C) */}
            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
              {study.translateChallenge.options.map((opt, idx) => {
                const active = progress.translateChoice === opt.choice;
                return (
                  <button
                    key={opt.choice}
                    type="button"
                    onClick={() =>
                      onChangeProgress(selectTranslateChoice(progress, opt.choice))
                    }
                    className={`flex flex-col justify-between rounded-2xl border-2 p-3 text-left transition ${
                      active
                        ? 'border-[#F2C66D] bg-[#162747] text-[#EAF4F2] shadow-[0_4px_0_#070e1c]'
                        : 'border-[#314975] bg-[#101D35]/90 text-[#EAF4F2] hover:border-[#48C5B5]'
                    }`}
                  >
                    <div>
                      <span className="inline-block rounded-md bg-[#48C5B5]/20 px-2 py-0.5 text-[10px] font-black text-[#48C5B5] uppercase">
                        {'ABC'[idx]}
                      </span>
                      <h2 className="mt-1.5 text-sm font-black">
                        {opt.title}
                      </h2>
                      <p className="mt-1 text-xs leading-snug font-semibold text-[#b9d4d0]">
                        {opt.instructions}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {progress.translateChoice && (() => {
              const selectedOpt = study.translateChallenge.options.find(
                (o) => o.choice === progress.translateChoice,
              );
              if (!selectedOpt) return null;
              return (
                <div className="rounded-2xl border border-[#48C5B5]/50 bg-[#101D35]/95 p-3.5 text-xs">
                  <p className="font-black text-[#F2C66D]">
                    {selectedOpt.guidingPrompt}
                  </p>
                  {selectedOpt.choice === 'draw' && (
                    <p className="mt-1 rounded-lg bg-[#162747] px-2.5 py-1.5 font-semibold text-[#48C5B5]">
                      {s.translateOfflineDrawingNote}
                    </p>
                  )}
                  <label className="mt-2 block text-[11px] font-bold text-[#b9d4d0]">
                    {s.translateDraftLabel}
                    <textarea
                      rows={3}
                      value={progress.translateDraft}
                      onChange={(e) =>
                        onChangeProgress({
                          ...progress,
                          translateDraft: e.target.value,
                        })
                      }
                      placeholder={selectedOpt.placeholderText}
                      className="mt-1 w-full rounded-xl border border-[#48C5B5]/45 bg-[#091224] p-2.5 text-xs font-semibold text-[#EAF4F2] placeholder:text-[#6b84a6] focus:border-[#F2C66D] focus:outline-none"
                    />
                  </label>
                </div>
              );
            })()}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() =>
                  onChangeProgress({
                    ...progress,
                    stage: 'share',
                    completedReflection: true,
                  })
                }
                className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-[#F2C66D] px-5 py-2 text-xs font-black text-[#101D35] shadow-[0_3px_0_#9f7829] transition hover:brightness-105 sm:text-sm"
              >
                <span>{s.translateFinishBtn}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* STAGE 5: COMPARTIR */}
        {stage === 'share' && (() => {
          const checklist = buildFormativeChecklist(progress, study);
          return (
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
              <section className="space-y-2.5 rounded-2xl border-2 border-[#48C5B5]/60 bg-[#101D35]/95 p-3.5 shadow-[0_5px_0_#070e1c] sm:p-4 lg:col-span-7">
                <div className="flex items-center gap-3 rounded-xl bg-[#EAF4F2] p-2.5 text-[#101D35]">
                  <div className="w-11 flex-none">
                    <NautiCharacterRig
                      expression="celebrate"
                      gaze="center"
                      isSpeaking={speech.isSpeaking}
                      mouthPulse={speech.mouthPulse}
                      interactiveTickle={false}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-[#1c7c71] uppercase">
                      {t.nautiSays}
                    </p>
                    <p className="text-xs font-black sm:text-sm">
                      {s.shareNautiPrompt}
                    </p>
                  </div>
                </div>

                <p className="text-xs leading-snug font-semibold text-[#EAF4F2] sm:text-sm">
                  {s.shareInviteBody}
                </p>

                {progress.translateDraft.trim() && (
                  <div className="rounded-xl border border-[#48C5B5]/35 bg-[#162747] p-2.5 text-xs">
                    <p className="text-[10px] font-black text-[#48C5B5] uppercase">
                      <MessageSquare className="mr-1 inline h-3 w-3" />
                      {s.translateDraftLabel}
                    </p>
                    <p className="mt-1 font-semibold text-[#EAF4F2]">
                      {progress.translateDraft}
                    </p>
                  </div>
                )}

                <div className="rounded-xl border border-[#314975] bg-[#0d1930] p-3">
                  <h2 className="text-xs font-black text-[#F2C66D] uppercase">
                    {s.shareReflectionTitle}
                  </h2>
                  <ul className="mt-1.5 space-y-1 text-xs font-bold text-[#EAF4F2]">
                    {s.shareReflectionQuestions.map((q, idx) => (
                      <li key={idx}>• {q}</li>
                    ))}
                  </ul>
                </div>

                <p className="rounded-xl border border-[#F2C66D]/50 bg-[#2a2416] px-3 py-2 text-xs font-black text-[#F2C66D] sm:text-sm">
                  {s.shareMissionComplete}
                </p>
              </section>

              {/* Honest Non-Punitive Formative Journey Summary */}
              <aside className="flex flex-col justify-between gap-3 rounded-2xl border border-[#314975] bg-[#101D35]/90 p-3.5 lg:col-span-5">
                <div>
                  <h2 className="text-xs font-black tracking-wide text-[#48C5B5] uppercase">
                    {s.shareFormativeTitle}
                  </h2>
                  <ul className="mt-2 space-y-1.5">
                    {checklist.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center gap-2 text-xs font-bold text-[#EAF4F2]"
                      >
                        {item.completed ? (
                          <CheckCircle2
                            className="h-4 w-4 flex-none text-[#48C5B5]"
                            aria-hidden="true"
                          />
                        ) : (
                          <Circle
                            className="h-4 w-4 flex-none text-[#64748b]"
                            aria-hidden="true"
                          />
                        )}
                        <span>{s.shareChecklistLabels[item.id]}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2.5 text-[11px] leading-snug font-semibold text-[#94a8c4]">
                    {s.shareFormativeDisclaimer}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onChangeProgress(createInitialTraduciendoState(study.id))
                    }
                    className="inline-flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#48C5B5]/50 bg-[#162747] px-3 py-2 text-xs font-black text-[#EAF4F2] hover:bg-[#1e355f]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>{s.shareRestartBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={onBackToLibrary}
                    className="inline-flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#F2C66D] px-3 py-2 text-xs font-black text-[#101D35] hover:brightness-105"
                  >
                    <span>{s.shareBackToLibraryBtn}</span>
                  </button>
                </div>
              </aside>
            </div>
          );
        })()}
      </div>
    </div>
  );

  function setStageAndUpdate(
    nextProgress: TraduciendoProgressState,
    nextStage: TraduciendoStage,
  ) {
    speech.stop();
    setShowCluesDrawer(false);
    onChangeProgress({
      ...nextProgress,
      stage: nextStage,
    });
  }
};
