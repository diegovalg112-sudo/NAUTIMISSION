import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock,
  FlaskConical,
  Hand,
  HelpCircle,
  Home,
  Play,
  Square,
  Volume2,
  X,
} from 'lucide-react';
import { getExperienceCredits } from '../data/experienceCredits';
import { getTraduciendoStudies } from '../data/traduciendoContent';
import { getTraduciendoStrings } from '../data/traduciendoStrings';
import { PLATFORM_STRINGS, UI_STRINGS } from '../data/uiStrings';
import type { MusicAudioControls } from '../hooks/useMusicAudio';
import type { SpeechControlsState } from '../hooks/useSpeech';
import type {
  ScienceCategoryId,
  TraduciendoProgressState,
} from '../types/traduciendoCiencia';
import { createInitialTraduciendoState } from '../utils/traduciendoEngine';
import { ExperienceCredits } from './ExperienceCredits';
import { FilomatasLogo } from './FilomatasLogo';
import { LanguageSelector } from './LanguageSelector';
import { NautiCharacterRig, type TickleIntensity } from './NautiCharacterRig';
import { NautiLogo } from './NautiLogo';
import { SoundControlButton } from './SoundControlButton';
import { TraduciendoActivityRunner } from './TraduciendoActivityRunner';

export type TraduciendoView = 'intro' | 'library' | 'activity';

interface TraduciendoExperienceProps {
  view: TraduciendoView;
  onChangeView: (view: TraduciendoView) => void;
  progress: TraduciendoProgressState;
  onChangeProgress: (next: TraduciendoProgressState) => void;
  audio: MusicAudioControls;
  speech: SpeechControlsState;
  onListen: (customText?: string) => void;
  onStopVoice: () => void;
  onOpenVoiceSettings: () => void;
  onBackToDesktop: () => void;
  tickleCaption?: string | null;
  onTickleSound?: (intensity: TickleIntensity) => void;
}

const ALL_CATEGORIES: readonly ScienceCategoryId[] = [
  'space_biology',
  'human_health',
  'plants_food',
  'microorganisms',
  'extreme_environments',
] as const;

export const TraduciendoExperience: React.FC<TraduciendoExperienceProps> = ({
  view,
  onChangeView,
  progress,
  onChangeProgress,
  audio,
  speech,
  onListen,
  onStopVoice,
  onOpenVoiceSettings,
  onBackToDesktop,
  tickleCaption = null,
  onTickleSound,
}) => {
  const [howItWorksOpen, setHowItWorksOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<
    ScienceCategoryId | 'all'
  >('all');

  const t = UI_STRINGS[audio.audioLang];
  const p = PLATFORM_STRINGS[audio.audioLang];
  const s = getTraduciendoStrings(audio.audioLang);
  const studies = getTraduciendoStudies(audio.audioLang);
  const credits = getExperienceCredits('traduciendo-la-ciencia', audio.audioLang);
  const blocked = speech.narrationBlocked && !speech.isSpeaking;

  const activeStudy = progress.studyId
    ? studies.find((st) => st.id === progress.studyId)
    : undefined;

  if (view === 'activity' && activeStudy) {
    return (
      <TraduciendoActivityRunner
        study={activeStudy}
        progress={progress}
        onChangeProgress={onChangeProgress}
        audio={audio}
        speech={speech}
        onListen={onListen}
        onStopVoice={onStopVoice}
        onOpenVoiceSettings={onOpenVoiceSettings}
        onBackToLibrary={() => {
          speech.stop();
          onChangeView('library');
        }}
      />
    );
  }

  if (view === 'library') {
    const filteredStudies =
      selectedCategory === 'all'
        ? studies
        : studies.filter((st) => st.category === selectedCategory);

    return (
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1220px] flex-col px-3 py-2 sm:px-5 sm:py-3">
        {/* Top Bar */}
        <header className="flex flex-none items-center justify-between gap-2 pb-1.5 sm:pb-2">
          <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={onBackToDesktop}
              title={p.backToDesktopBtn}
              aria-label={p.backToDesktopBtn}
              className="inline-flex min-h-[36px] flex-none items-center gap-1 rounded-xl border-2 border-[#48C5B5]/60 bg-[#101D35] px-2 py-1 text-xs font-black text-[#EAF4F2] shadow-[0_2px_0_#070e1c] transition hover:bg-[#162747]"
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
              onReplayCurrent={() => onListen(s.librarySubtitle)}
              onOpenVoiceModal={onOpenVoiceSettings}
            />
          </div>
        </header>

        {/* Research Library Content */}
        <div className="cockpit-scroll min-h-0 flex-1 overflow-y-auto pr-1 pb-2">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-xl font-black text-[#EAF4F2] sm:text-2xl">
                {s.libraryTitle}
              </h1>
              <p className="mt-0.5 text-xs font-semibold text-[#48C5B5] sm:text-sm">
                {s.librarySubtitle}
              </p>
            </div>

            <p className="max-w-md rounded-xl border border-[#F2C66D]/45 bg-[#2a2416]/85 px-3 py-1.5 text-[11px] font-bold text-[#F2C66D]">
              {s.osdrIntegrityNote}
            </p>
          </div>

          {/* 5 Research Category Filter Tabs */}
          <div
            role="tablist"
            aria-label={s.libraryTitle}
            className="mt-2.5 flex flex-wrap gap-1.5"
          >
            <button
              type="button"
              role="tab"
              aria-selected={selectedCategory === 'all'}
              onClick={() => setSelectedCategory('all')}
              className={`rounded-xl px-3 py-1.5 text-xs font-black transition ${
                selectedCategory === 'all'
                  ? 'bg-[#48C5B5] text-[#101D35]'
                  : 'border border-[#314975] bg-[#101D35] text-[#EAF4F2] hover:border-[#48C5B5]/60'
              }`}
            >
              {s.allCategoriesLabel}
            </button>
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-3 py-1.5 text-xs font-black transition ${
                  selectedCategory === cat
                    ? 'bg-[#48C5B5] text-[#101D35]'
                    : 'border border-[#314975] bg-[#101D35] text-[#EAF4F2] hover:border-[#48C5B5]/60'
                }`}
              >
                {s.categories[cat]}
              </button>
            ))}
          </div>

          {/* Study Cards */}
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {filteredStudies.map((study) => {
              const isInteractive = study.status !== 'coming_soon';
              const isResumable =
                progress.studyId === study.id && progress.stage !== 'discover';

              return (
                <article
                  key={study.id}
                  className={`flex flex-col justify-between rounded-2xl border-2 p-3.5 ${
                    isInteractive
                      ? 'border-[#EAF4F2] bg-[#EAF4F2] text-[#101D35] shadow-[0_5px_0_#070e1c]'
                      : 'border-[#314975] bg-[#101D35]/85 text-[#EAF4F2] shadow-[0_4px_0_#070e1c]'
                  }`}
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-1.5 text-[10px] font-black uppercase">
                      <span
                        className={`rounded-md px-2 py-0.5 ${
                          study.isDemonstration
                            ? 'bg-[#F2C66D]/35 text-[#7c5607]'
                            : study.isVerifiedOsdr
                              ? 'bg-[#48C5B5]/25 text-[#0f5e55]'
                              : 'bg-[#1e355f] text-[#F2C66D]'
                        }`}
                      >
                        {study.isDemonstration
                          ? s.statusDemoBadge
                          : study.isVerifiedOsdr
                            ? s.statusOsdrBadge
                            : s.statusComingSoonBadge}
                      </span>
                      <span
                        className={
                          isInteractive ? 'text-[#1c7c71]' : 'text-[#48C5B5]'
                        }
                      >
                        {s.categories[study.category]}
                      </span>
                    </div>

                    <h2 className="mt-2 text-base leading-tight font-black">
                      {study.studentTitle}
                    </h2>
                    <p
                      className={`mt-1 text-[11px] font-bold ${
                        isInteractive ? 'text-[#335275]' : 'text-[#94a8c4]'
                      }`}
                    >
                      {study.officialTitle}
                    </p>

                    <p
                      className={`mt-1.5 text-xs leading-snug font-semibold ${
                        isInteractive ? 'text-[#1e355f]' : 'text-[#cbd5e1]'
                      }`}
                    >
                      {study.shortDescription}
                    </p>
                  </div>

                  <div className="mt-3 space-y-2 border-t border-current/15 pt-2">
                    <div
                      className={`flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] font-bold ${
                        isInteractive ? 'text-[#335275]' : 'text-[#94a8c4]'
                      }`}
                    >
                      <span>
                        {s.ageLabel}: {study.ageRange}
                      </span>
                      <span>
                        {s.durationLabel}: {study.durationMinutes}
                      </span>
                    </div>
                    <p
                      className={`text-[10px] font-semibold ${
                        isInteractive ? 'text-[#475569]' : 'text-[#94a8c4]'
                      }`}
                    >
                      <strong>{s.sourceLabel}: </strong>
                      {study.sourceLabel}
                    </p>

                    {isInteractive ? (
                      <button
                        type="button"
                        onClick={() => {
                          speech.stop();
                          if (progress.studyId !== study.id) {
                            onChangeProgress(
                              createInitialTraduciendoState(study.id),
                            );
                          }
                          onChangeView('activity');
                        }}
                        className="flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl bg-[#101D35] px-4 py-2 text-xs font-black text-[#EAF4F2] shadow-[0_3px_0_#070e1c] transition hover:bg-[#192d52] active:translate-y-[1px]"
                      >
                        <Play className="h-3.5 w-3.5 fill-current text-[#F2C66D]" />
                        <span>
                          {isResumable ? s.resumeStudyBtn : s.openStudyBtn}
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
        </div>
      </div>
    );
  }

  // INTRO VIEW
  return (
    <div className="relative z-10 mx-auto flex h-full w-full max-w-[1160px] flex-col px-3 py-2 sm:px-6 sm:py-3">
      {/* Top Bar: Back to Desktop + Paired Official Logos + Language & Sound */}
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
            onReplayCurrent={() => onListen(s.introNautiPrompt)}
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
                    onListen(s.introNautiPrompt);
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
              {tickleCaption || s.introNautiPrompt}
            </p>
          </div>
        </div>

        {/* RIGHT: Experience Intro Card + Detrás de esta experiencia */}
        <div className="cockpit-scroll col-span-7 flex max-h-full min-h-0 flex-col overflow-y-auto pr-1">
          <div className="my-auto flex flex-col gap-2.5 py-0.5 sm:gap-3">
            <section className="rounded-2xl border-2 border-[#48C5B5]/60 bg-[#101D35]/95 p-3.5 shadow-[0_6px_0_#070e1c] sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-black uppercase">
                <span className="inline-flex items-center gap-1 text-[#F2C66D]">
                  <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{s.statusDemoBadge}</span>
                </span>
                <span className="text-[#48C5B5]">OSDR · Filómatas LAB</span>
              </div>

              <h1 className="mt-1.5 text-2xl font-black tracking-tight text-[#EAF4F2] sm:text-3xl">
                {s.experienceTitle}
              </h1>
              <p className="mt-0.5 text-sm font-black text-[#48C5B5] sm:text-base">
                {s.experienceSubtitle}
              </p>

              <p className="mt-2 text-xs leading-relaxed font-semibold text-[#EAF4F2]/90 sm:text-sm">
                {s.introDescription}
              </p>

              <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    speech.stop();
                    onChangeView('library');
                  }}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl border-2 border-[#EAF4F2] bg-[#F2C66D] px-5 py-2 text-xs font-black text-[#101D35] shadow-[0_3px_0_#9f7829] transition hover:brightness-105 active:translate-y-[1px] sm:text-sm"
                >
                  <BookOpen className="h-4 w-4" aria-hidden="true" />
                  <span>{s.exploreResearchBtn}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => setHowItWorksOpen(true)}
                  className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-2xl border-2 border-[#48C5B5]/60 bg-[#162747] px-4 py-2 text-xs font-black text-[#EAF4F2] transition hover:bg-[#1e355f] sm:text-sm"
                >
                  <HelpCircle className="h-4 w-4 text-[#48C5B5]" />
                  <span>{s.howItWorksBtn}</span>
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

      {/* How It Works Modal */}
      {howItWorksOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="traduciendo-howto-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        >
          <div className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-3xl border-2 border-[#48C5B5] bg-[#101D35] p-4 text-[#EAF4F2] shadow-2xl sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <h2
                id="traduciendo-howto-title"
                className="text-base font-black text-[#F2C66D] sm:text-lg"
              >
                {s.howItWorksTitle}
              </h2>
              <button
                type="button"
                onClick={() => setHowItWorksOpen(false)}
                aria-label={s.howItWorksClose}
                className="rounded-xl border border-[#314975] bg-[#162747] p-1.5 text-[#EAF4F2]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <ol className="mt-3 space-y-2">
              {s.howItWorksSteps.map((st, idx) => (
                <li
                  key={idx}
                  className="rounded-xl border border-[#314975] bg-[#162747] px-3 py-2 text-xs"
                >
                  <p className="font-black text-[#48C5B5]">{st.stage}</p>
                  <p className="mt-0.5 font-semibold text-[#EAF4F2]/90">
                    {st.summary}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setHowItWorksOpen(false)}
                className="rounded-xl bg-[#F2C66D] px-4 py-2 text-xs font-black text-[#101D35]"
              >
                {s.howItWorksClose}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
