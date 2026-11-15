import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  ExternalLink,
  Hand,
  HelpCircle,
  Home,
  Play,
  Search,
  Square,
  Volume2,
  X,
} from 'lucide-react';
import { getDetectiveCases } from '../data/detectivesNasaContent';
import { getDetectivesStrings } from '../data/detectivesNasaStrings';
import { getExperienceCredits } from '../data/experienceCredits';
import { PLATFORM_STRINGS, UI_STRINGS } from '../data/uiStrings';
import type { MusicAudioControls } from '../hooks/useMusicAudio';
import type { SpeechControlsState } from '../hooks/useSpeech';
import type {
  DetectiveCaseId,
  DetectiveCaseProgress,
  DetectivesSavedState,
} from '../types/detectivesNasa';
import { createInitialDetectiveCaseProgress } from '../utils/detectivesStorage';
import { DetectivesCaseRunner } from './DetectivesCaseRunner';
import { ExperienceCredits } from './ExperienceCredits';
import { FilomatasLogo } from './FilomatasLogo';
import { LanguageSelector } from './LanguageSelector';
import { NautiCharacterRig, type TickleIntensity } from './NautiCharacterRig';
import { NautiLogo } from './NautiLogo';
import { SoundControlButton } from './SoundControlButton';

export type DetectivesView = 'intro' | 'library' | 'activity';
export type DetectivesLibraryTab = 'cases' | 'discoveries';

interface DetectivesNasaExperienceProps {
  view: DetectivesView;
  onChangeView: (view: DetectivesView) => void;
  libraryTab: DetectivesLibraryTab;
  onChangeLibraryTab: (tab: DetectivesLibraryTab) => void;
  progress: DetectiveCaseProgress;
  onChangeProgress: (next: DetectiveCaseProgress) => void;
  savedState: DetectivesSavedState;
  onCaseSolved: (caseId: DetectiveCaseId) => void;
  audio: MusicAudioControls;
  speech: SpeechControlsState;
  onListen: (customText?: string) => void;
  onStopVoice: () => void;
  onOpenVoiceSettings: () => void;
  onBackToDesktop: () => void;
  tickleCaption?: string | null;
  onTickleSound?: (intensity: TickleIntensity) => void;
}

export const DetectivesNasaExperience: React.FC<
  DetectivesNasaExperienceProps
> = ({
  view,
  onChangeView,
  libraryTab,
  onChangeLibraryTab,
  progress,
  onChangeProgress,
  savedState,
  onCaseSolved,
  audio,
  speech,
  onListen,
  onStopVoice,
  onOpenVoiceSettings,
  onBackToDesktop,
  tickleCaption = null,
  onTickleSound,
}) => {
  const [howToOpen, setHowToOpen] = useState<boolean>(false);

  const t = UI_STRINGS[audio.audioLang];
  const p = PLATFORM_STRINGS[audio.audioLang];
  const s = getDetectivesStrings(audio.audioLang);
  const cases = getDetectiveCases(audio.audioLang);
  const esCases = getDetectiveCases('es');
  const enCases = getDetectiveCases('en');
  const credits = getExperienceCredits(
    'detectives-de-la-nasa',
    audio.audioLang,
  );
  const blocked = speech.narrationBlocked && !speech.isSpeaking;

  const activeCase = progress.caseId
    ? cases.find((c) => c.id === progress.caseId)
    : undefined;
  const activeEsRef = activeCase
    ? esCases.find((c) => c.id === activeCase.id) ?? esCases[0]
    : esCases[0];
  const activeEnRef = activeCase
    ? enCases.find((c) => c.id === activeCase.id) ?? enCases[0]
    : enCases[0];

  const unlockedCaseList = cases.filter((c) =>
    Boolean(savedState.unlockedDiscoveries[c.id]),
  );

  if (view === 'activity' && activeCase) {
    return (
      <DetectivesCaseRunner
        activeCase={activeCase}
        esCaseRef={activeEsRef}
        enCaseRef={activeEnRef}
        progress={progress}
        onChangeProgress={onChangeProgress}
        onCaseSolved={onCaseSolved}
        audio={audio}
        speech={speech}
        onOpenVoiceSettings={onOpenVoiceSettings}
        onBackToLibrary={() => {
          speech.stop();
          onChangeLibraryTab('cases');
          onChangeView('library');
        }}
        onOpenDiscoveries={() => {
          speech.stop();
          onChangeLibraryTab('discoveries');
          onChangeView('library');
        }}
        onBackToWelcome={() => {
          speech.stop();
          onChangeView('intro');
        }}
        tickleCaption={tickleCaption}
        onTickleSound={onTickleSound}
      />
    );
  }

  if (view === 'library') {
    return (
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1220px] flex-col px-3 py-2 sm:px-5 sm:py-3">
        {/* Top Bar */}
        <header className="flex flex-none items-center justify-between gap-2 pb-1.5 sm:pb-2.5">
          <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={onBackToDesktop}
              title={p.backToDesktopBtn}
              aria-label={p.backToDesktopBtn}
              className="inline-flex min-h-[36px] flex-none items-center gap-1 rounded-xl border-2 border-[#48C5B5]/60 bg-[#101D35] px-2.5 py-1 text-xs font-black text-[#EAF4F2] shadow-[0_2px_0_#070e1c] transition hover:bg-[#162747]"
            >
              <Home className="h-3.5 w-3.5 text-[#48C5B5]" aria-hidden="true" />
              <span className="hidden lg:inline">{p.backToDesktopBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                speech.stop();
                onChangeView('intro');
              }}
              className="inline-flex min-h-[36px] flex-none items-center gap-1.5 rounded-xl border-2 border-[#48C5B5]/60 bg-[#101D35] px-2.5 py-1 text-xs font-black text-[#EAF4F2] shadow-[0_2px_0_#070e1c] transition hover:bg-[#162747]"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-[#48C5B5]" aria-hidden="true" />
              <span>{s.backToIntroBtn}</span>
            </button>

            <div className="hidden min-w-0 items-center gap-2 sm:flex">
              <NautiLogo className="h-7 sm:h-9" alt={t.platformName} />
              <span className="h-5 w-px bg-[#48C5B5]/35" aria-hidden="true" />
              <FilomatasLogo className="h-6 sm:h-8" />
            </div>
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
                onListen(
                  libraryTab === 'discoveries'
                    ? s.discoveriesSubtitle
                    : s.librarySubtitle,
                )
              }
              onOpenVoiceModal={onOpenVoiceSettings}
            />
          </div>
        </header>

        {/* Cases & Mis Descubrimientos Tabs */}
        <div className="cockpit-scroll min-h-0 flex-1 overflow-y-auto pr-1 pb-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-xl font-black text-[#EAF4F2] sm:text-2xl">
                {libraryTab === 'discoveries'
                  ? s.discoveriesTitle
                  : s.libraryTitle}
              </h1>
              <p className="mt-0.5 text-xs font-semibold text-[#48C5B5] sm:text-sm">
                {libraryTab === 'discoveries'
                  ? s.discoveriesSubtitle
                  : s.librarySubtitle}
              </p>
            </div>

            <div
              role="tablist"
              className="inline-flex self-start rounded-xl border border-[#314975] bg-[#101D35] p-1"
            >
              <button
                type="button"
                role="tab"
                aria-selected={libraryTab === 'cases'}
                onClick={() => onChangeLibraryTab('cases')}
                className={`rounded-lg px-3 py-1.5 text-xs font-black transition ${
                  libraryTab === 'cases'
                    ? 'bg-[#F2C66D] text-[#101D35]'
                    : 'text-[#EAF4F2]/85 hover:text-[#EAF4F2]'
                }`}
              >
                <Search className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />
                {s.tabCases}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={libraryTab === 'discoveries'}
                onClick={() => onChangeLibraryTab('discoveries')}
                className={`rounded-lg px-3 py-1.5 text-xs font-black transition ${
                  libraryTab === 'discoveries'
                    ? 'bg-[#48C5B5] text-[#101D35]'
                    : 'text-[#EAF4F2]/85 hover:text-[#EAF4F2]'
                }`}
              >
                <Award className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />
                {s.tabDiscoveries} ({unlockedCaseList.length})
              </button>
            </div>
          </div>

          {libraryTab === 'cases' ? (
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              {cases.map((caseItem) => {
                const isAvailable = caseItem.status === 'available';
                const isSolved = Boolean(
                  savedState.unlockedDiscoveries[caseItem.id],
                );
                const isResumable =
                  isAvailable &&
                  progress.caseId === caseItem.id &&
                  progress.stage !== 'mystery' &&
                  !progress.caseSolved;

                return (
                  <article
                    key={caseItem.id}
                    className={`flex flex-col justify-between rounded-2xl border-2 p-3.5 sm:p-4 ${
                      isAvailable
                        ? 'border-[#EAF4F2] bg-[#EAF4F2] text-[#101D35] shadow-[0_5px_0_#070e1c]'
                        : 'border-[#314975] bg-[#101D35]/85 text-[#EAF4F2] shadow-[0_4px_0_#070e1c]'
                    }`}
                  >
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-black">
                        <span
                          className={
                            isAvailable ? 'text-[#1c7c71]' : 'text-[#F2C66D]'
                          }
                        >
                          {isAvailable
                            ? s.statusAvailableBadge
                            : s.statusComingSoonBadge}
                          {isSolved && ` · ${s.solvedChip}`}
                        </span>
                        <span
                          className={`tabular-nums ${
                            isAvailable ? 'text-[#335275]' : 'text-[#48C5B5]'
                          }`}
                        >
                          {caseItem.estimatedMinutes}
                        </span>
                      </div>

                      <h2 className="mt-1.5 text-base leading-tight font-black sm:text-lg">
                        {caseItem.title}
                      </h2>
                      <p
                        className={`mt-1 text-xs leading-snug font-bold ${
                          isAvailable ? 'text-[#101D35]' : 'text-[#EAF4F2]'
                        }`}
                      >
                        {caseItem.mysteryQuestion}
                      </p>
                      <p
                        className={`mt-1 text-[11px] leading-snug font-semibold ${
                          isAvailable ? 'text-[#1e355f]' : 'text-[#cbd5e1]'
                        }`}
                      >
                        {caseItem.shortDescription}
                      </p>
                    </div>

                    <div className="mt-3 space-y-2 border-t border-current/15 pt-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] font-bold">
                        <span
                          className={
                            isAvailable ? 'text-[#335275]' : 'text-[#94a8c4]'
                          }
                        >
                          {s.caseFocusLabel}: {caseItem.focusTopic}
                        </span>
                        <a
                          href={caseItem.nasaSource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1 underline ${
                            isAvailable
                              ? 'text-[#1c7c71] hover:text-[#101D35]'
                              : 'text-[#48C5B5] hover:text-[#F2C66D]'
                          }`}
                        >
                          <span>{s.nasaSourceShort}</span>
                          <ExternalLink className="h-3 w-3" aria-hidden="true" />
                        </a>
                      </div>

                      {isAvailable ? (
                        <button
                          type="button"
                          onClick={() => {
                            speech.stop();
                            if (progress.caseId !== caseItem.id || progress.caseSolved) {
                              onChangeProgress(
                                createInitialDetectiveCaseProgress(caseItem.id),
                              );
                            }
                            onChangeView('activity');
                          }}
                          className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#101D35] px-4 py-2 text-xs font-black text-[#EAF4F2] shadow-[0_3px_0_#070e1c] transition hover:bg-[#192d52] active:translate-y-[1px] sm:text-sm"
                        >
                          <Play className="h-4 w-4 fill-current text-[#F2C66D]" />
                          <span>
                            {isResumable
                              ? s.resumeCaseBtn
                              : isSolved
                                ? s.reviewCaseBtn
                                : s.openCaseBtn}
                          </span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled
                          aria-disabled="true"
                          className="flex min-h-[40px] w-full cursor-not-allowed items-center justify-center gap-1.5 rounded-xl border border-[#314975] bg-[#162747] px-4 py-2 text-xs font-black text-[#94a8c4]"
                        >
                          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{s.comingSoonBtn}</span>
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            /* MIS DESCUBRIMIENTOS COLLECTION TAB */
            <div className="mt-3">
              {unlockedCaseList.length === 0 ? (
                <div className="rounded-2xl border-2 border-[#314975] bg-[#101D35]/90 p-5 text-center text-[#EAF4F2]">
                  <Award
                    className="mx-auto h-10 w-10 text-[#F2C66D]"
                    aria-hidden="true"
                  />
                  <h2 className="mt-2 text-base font-black sm:text-lg">
                    {s.discoveriesEmptyTitle}
                  </h2>
                  <p className="mx-auto mt-1 max-w-lg text-xs font-semibold text-[#b9d4d0] sm:text-sm">
                    {s.discoveriesEmptyBody}
                  </p>
                  <button
                    type="button"
                    onClick={() => onChangeLibraryTab('cases')}
                    className="mt-4 inline-flex min-h-[42px] items-center gap-2 rounded-xl border-2 border-[#EAF4F2] bg-[#F2C66D] px-5 py-2 text-xs font-black text-[#101D35] shadow-[0_3px_0_#9f7829]"
                  >
                    <Search className="h-4 w-4" aria-hidden="true" />
                    <span>{s.discoveriesGoToCasesBtn}</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {unlockedCaseList.map((solvedCase) => (
                    <article
                      key={solvedCase.id}
                      className="flex flex-col justify-between rounded-2xl border-2 border-[#F2C66D] bg-[#EAF4F2] p-4 text-[#101D35] shadow-[0_5px_0_#070e1c]"
                    >
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1 text-[11px] font-black text-[#1c7c71] uppercase">
                            <CheckCircle2
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                            <span>{s.solvedChip}</span>
                          </span>
                          <span className="tabular-nums rounded-lg bg-[#101D35] px-2.5 py-0.5 text-xs font-black text-[#F2C66D]">
                            {solvedCase.discoveryCard.keyNumericalData}
                          </span>
                        </div>

                        <h2 className="mt-1.5 text-base font-black text-[#101D35] sm:text-lg">
                          {solvedCase.discoveryCard.caseTitle}
                        </h2>

                        <p className="mt-1.5 text-xs leading-snug font-bold text-[#101D35]">
                          {solvedCase.discoveryCard.mainScientificFact}
                        </p>
                        <p className="mt-1 text-xs leading-snug font-semibold text-[#1e355f]">
                          {solvedCase.discoveryCard.shortExplanation}
                        </p>
                      </div>

                      <div className="mt-3 space-y-2 border-t border-[#101D35]/15 pt-2.5 text-[11px]">
                        <p className="font-bold text-[#1c7c71]">
                          {solvedCase.discoveryCard.technologyStatusLabel}
                        </p>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <a
                            href={solvedCase.discoveryCard.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-black text-[#101D35] underline hover:text-[#1c7c71]"
                          >
                            <BookOpen
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                            <span>
                              {solvedCase.discoveryCard.sourceTitle} (
                              {solvedCase.discoveryCard.sourceDate})
                            </span>
                            <ExternalLink
                              className="h-3 w-3"
                              aria-hidden="true"
                            />
                          </a>

                          <button
                            type="button"
                            onClick={() => {
                              speech.stop();
                              onChangeProgress(
                                createInitialDetectiveCaseProgress(solvedCase.id),
                              );
                              onChangeView('activity');
                            }}
                            className="inline-flex items-center gap-1 rounded-lg bg-[#101D35] px-3 py-1.5 text-xs font-black text-[#EAF4F2]"
                          >
                            <span>{s.reviewCaseBtn}</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // WELCOME SCREEN ('intro')
  return (
    <div className="relative z-10 mx-auto flex h-full w-full max-w-[1160px] flex-col px-3 py-2 sm:px-6 sm:py-3">
      {/* Top Bar */}
      <header className="flex flex-none items-center justify-between gap-2 pb-1.5 sm:pb-2.5">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onBackToDesktop}
            className="inline-flex min-h-[36px] flex-none items-center gap-1.5 rounded-xl border-2 border-[#48C5B5]/60 bg-[#101D35] px-2.5 py-1 text-xs font-black text-[#EAF4F2] shadow-[0_2px_0_#070e1c] transition hover:bg-[#162747]"
          >
            <Home className="h-3.5 w-3.5 text-[#48C5B5]" aria-hidden="true" />
            <span>{p.backToDesktopBtn}</span>
          </button>

          <NautiLogo className="h-7 sm:h-10 md:h-11" alt={t.platformName} />
          <span
            className="h-5 w-px flex-none bg-[#48C5B5]/40 sm:h-7"
            aria-hidden="true"
          />
          <FilomatasLogo className="h-6 sm:h-9 md:h-10" />
        </div>

        <div className="flex flex-none items-center gap-1.5 sm:gap-2">
          <LanguageSelector
            value={audio.audioLang}
            onChange={audio.setAudioLang}
            variant="compact"
          />
          <SoundControlButton
            audio={audio}
            speech={speech}
            onReplayCurrent={() =>
              onListen(s.welcomeParagraphs.join(' '))
            }
            onOpenVoiceModal={onOpenVoiceSettings}
          />
        </div>
      </header>

      {/* Main Intro Split */}
      <div className="grid min-h-0 flex-1 grid-cols-12 items-center gap-3 sm:gap-6">
        {/* LEFT: NAUTI Mascot + Speech Bubble */}
        <div className="col-span-5 flex h-full min-h-0 flex-col items-center justify-center gap-1.5 sm:gap-2.5">
          <div className="relative flex w-full max-w-[210px] flex-none items-center justify-center sm:max-w-[250px]">
            <NautiCharacterRig
              expression="happy"
              gaze="right"
              isSpeaking={speech.isSpeaking}
              mouthPulse={speech.mouthPulse}
              className="w-[64%] max-w-[min(200px,35dvh)] sm:w-[70%]"
              stickerRim
              onTickleSound={onTickleSound}
            />
          </div>

          <div className="w-full max-w-[350px] rounded-2xl border-2 border-[#EAF4F2] bg-[#EAF4F2] px-2.5 py-2 text-[#101D35] shadow-[0_4px_0_#070e1c] sm:px-3">
            <div className="mb-0.5 flex items-center justify-between gap-1.5">
              <span className="text-[10px] font-black tracking-wider text-[#1c7c71] uppercase">
                {t.nautiSays}
              </span>
              {speech.isSpeaking ? (
                <button
                  type="button"
                  onClick={onStopVoice}
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
                    speech.markUserUnlocked();
                    onListen(s.welcomeParagraphs.join(' '));
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
              {tickleCaption || s.welcomeNautiPrompt}
            </p>
          </div>
        </div>

        {/* RIGHT: Welcome Card + Detrás de esta experiencia */}
        <div className="cockpit-scroll col-span-7 flex max-h-full min-h-0 flex-col overflow-y-auto pr-1">
          <div className="my-auto flex flex-col gap-2.5 py-0.5 sm:gap-3">
            <section className="rounded-2xl border-2 border-[#48C5B5]/60 bg-[#101D35]/95 p-3.5 shadow-[0_6px_0_#070e1c] sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-black uppercase">
                <span className="inline-flex items-center gap-1.5 text-[#F2C66D]">
                  <Search className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{s.welcomeBadge}</span>
                </span>
                <span className="text-[#48C5B5]">{s.statusAvailableBadge}</span>
              </div>

              <h1 className="mt-1 text-2xl font-black tracking-tight text-[#EAF4F2] sm:text-3xl">
                {s.experienceTitle}
              </h1>
              <p className="mt-0.5 text-[11px] font-black tracking-wide text-[#48C5B5]">
                {s.corePrinciple}
              </p>

              <div className="mt-2.5 space-y-1.5 text-xs leading-relaxed font-semibold text-[#EAF4F2]/95 sm:text-[13px]">
                {s.welcomeParagraphs.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    speech.stop();
                    onChangeLibraryTab('cases');
                    onChangeView('library');
                  }}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl border-2 border-[#EAF4F2] bg-[#F2C66D] px-5 py-2 text-xs font-black text-[#101D35] shadow-[0_3px_0_#9f7829] transition hover:brightness-105 active:translate-y-[1px] sm:text-sm"
                >
                  <span>{s.startInvestigationBtn}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => setHowToOpen(true)}
                  className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-2xl border-2 border-[#48C5B5]/60 bg-[#162747] px-4 py-2 text-xs font-black text-[#EAF4F2] transition hover:bg-[#1e355f] sm:text-sm"
                >
                  <HelpCircle
                    className="h-4 w-4 text-[#48C5B5]"
                    aria-hidden="true"
                  />
                  <span>{s.howToPlayBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    speech.stop();
                    onChangeLibraryTab('discoveries');
                    onChangeView('library');
                  }}
                  className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-2xl border border-[#314975] bg-[#101D35] px-3.5 py-2 text-xs font-black text-[#F2C66D] transition hover:border-[#F2C66D]"
                >
                  <Award className="h-4 w-4" aria-hidden="true" />
                  <span>
                    {s.myDiscoveriesBtn} ({unlockedCaseList.length})
                  </span>
                </button>
              </div>
            </section>

            {credits && (
              <ExperienceCredits
                credits={credits}
                lang={audio.audioLang}
                defaultExpanded={false}
              />
            )}
          </div>
        </div>
      </div>

      {/* Footer Attribution */}
      <footer className="flex flex-none flex-wrap items-center justify-center gap-2 pt-1.5 sm:justify-end sm:pt-2">
        <span className="text-[11px] font-bold text-[#EAF4F2]/90 sm:text-xs">
          {t.createdBy}
        </span>
      </footer>

      {/* How To Play Modal */}
      {howToOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="detectives-howto-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        >
          <div className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-3xl border-2 border-[#48C5B5] bg-[#101D35] p-4 text-[#EAF4F2] shadow-2xl sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <h2
                id="detectives-howto-title"
                className="text-base font-black text-[#F2C66D] sm:text-lg"
              >
                {s.howToPlayTitle}
              </h2>
              <button
                type="button"
                onClick={() => setHowToOpen(false)}
                aria-label={s.closeModalBtn}
                className="rounded-xl border border-[#314975] bg-[#162747] p-1.5 text-[#EAF4F2]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-2 text-xs font-bold text-[#48C5B5]">
              {s.howToPlayIntro}
            </p>

            <ol className="mt-3 space-y-2">
              {s.howToPlaySteps.map((st, idx) => (
                <li
                  key={idx}
                  className="rounded-xl border border-[#314975] bg-[#162747] px-3 py-2 text-xs"
                >
                  <p className="font-black text-[#F2C66D]">{st.title}</p>
                  <p className="mt-0.5 font-semibold text-[#EAF4F2]/90">
                    {st.detail}
                  </p>
                </li>
              ))}
            </ol>

            <p className="mt-3 rounded-xl border border-[#314975] bg-[#0d1930] px-3 py-2 text-[11px] font-semibold text-[#b9d4d0]">
              {s.teacherNote}
            </p>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setHowToOpen(false)}
                className="rounded-xl bg-[#F2C66D] px-4 py-2 text-xs font-black text-[#101D35]"
              >
                {s.closeModalBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
