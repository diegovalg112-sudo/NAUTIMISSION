import React from 'react';
import {
  ArrowRight,
  BookOpen,
  Compass,
  Hand,
  Home,
  Lock,
  Play,
  Square,
  Volume2,
} from 'lucide-react';
import { NautiCharacterRig, type TickleIntensity } from './NautiCharacterRig';
import { NautiLogo } from './NautiLogo';
import { FilomatasLogo } from './FilomatasLogo';
import { SoundControlButton } from './SoundControlButton';
import { LanguageSelector } from './LanguageSelector';
import { ExperienceCredits } from './ExperienceCredits';
import { getExperienceCredits } from '../data/experienceCredits';
import { PLATFORM_STRINGS, UI_STRINGS } from '../data/uiStrings';
import type { MusicAudioControls } from '../hooks/useMusicAudio';
import type { SpeechControlsState } from '../hooks/useSpeech';

interface NautiMainMenuProps {
  tutorialCompleted: boolean;
  tutorialSavedStep: number;
  isSpeaking: boolean;
  mouthPulse: number;
  audio: MusicAudioControls;
  speech: SpeechControlsState;
  onListenPrompt: () => void;
  onStopVoice: () => void;
  onOpenVoiceSettings: () => void;
  onBackToDesktop: () => void;
  onEnterEfectoDomino: () => void;
  onStartTutorial: () => void;
  tickleCaption?: string | null;
  onTickleSound?: (intensity: TickleIntensity) => void;
}

export const NautiMainMenu: React.FC<NautiMainMenuProps> = ({
  tutorialCompleted,
  tutorialSavedStep,
  isSpeaking,
  mouthPulse,
  audio,
  speech,
  onListenPrompt,
  onStopVoice,
  onOpenVoiceSettings,
  onBackToDesktop,
  onEnterEfectoDomino,
  onStartTutorial,
  tickleCaption = null,
  onTickleSound,
}) => {
  const t = UI_STRINGS[audio.audioLang];
  const p = PLATFORM_STRINGS[audio.audioLang];
  const credits = getExperienceCredits('efecto-domino', audio.audioLang);
  const blocked = speech.narrationBlocked && !isSpeaking;

  return (
    <div className="relative z-10 mx-auto flex h-full w-full max-w-[1160px] flex-col px-3 py-2 sm:px-6 sm:py-3.5">
      {/* Top Bar: Back to Desktop + Official NAUTI & Filómatas LAB Logos + Language Selector + Audio Controls */}
      <header className="flex flex-none items-center justify-between gap-2 pb-1.5 sm:pb-2.5">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onBackToDesktop}
            className="inline-flex min-h-[36px] flex-none items-center gap-1.5 rounded-xl border-2 border-[#00d2e0]/60 bg-[#0c2d6e]/95 px-2.5 py-1 text-xs font-black text-[#e6faff] shadow-[0_2px_0_#041029] transition hover:bg-[#13429b] active:translate-y-[1px]"
          >
            <Home className="h-3.5 w-3.5 text-[#34f0fa]" aria-hidden="true" />
            <span>{p.backToDesktopBtn}</span>
          </button>

          <NautiLogo
            className="h-7 sm:h-10 md:h-11"
            alt={t.platformName}
          />
          <span
            className="h-5 w-px flex-none bg-[#00d2e0]/40 sm:h-7"
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
            onReplayCurrent={onListenPrompt}
            onOpenVoiceModal={onOpenVoiceSettings}
          />
        </div>
      </header>

      {/* Main 16:9 Landscape Composition */}
      <div className="grid min-h-0 flex-1 grid-cols-12 items-center gap-3 sm:gap-6">
        {/* LEFT AREA (5 cols): Floating NAUTI Mascot + Speech Bubble */}
        <div className="col-span-5 flex h-full min-h-0 flex-col items-center justify-center gap-1.5 sm:gap-2.5">
          <div className="relative flex w-full max-w-[230px] flex-none items-center justify-center sm:max-w-[270px]">
            <div
              className="pointer-events-none absolute h-32 w-32 rounded-full bg-[#00d2e0]/25 blur-2xl sm:h-40 sm:w-40"
              aria-hidden="true"
            />
            <NautiCharacterRig
              expression="happy"
              gaze="right"
              isSpeaking={isSpeaking}
              mouthPulse={mouthPulse}
              className="w-[64%] max-w-[min(210px,36dvh)] sm:w-[70%] sm:max-w-[min(235px,40dvh)]"
              stickerRim
              onTickleSound={onTickleSound}
            />
          </div>

          <div className="w-full max-w-[350px] rounded-2xl border-2 border-white bg-[#f4fcff]/95 px-2.5 py-2 text-[#08265b] shadow-[0_4px_0_#041029] sm:px-3">
            <div className="mb-0.5 flex items-center justify-between gap-1.5">
              <span className="text-[10px] font-black tracking-wider text-[#007e99] uppercase">
                {t.nautiSays}
              </span>

              <div className="flex items-center gap-1">
                {isSpeaking ? (
                  <button
                    type="button"
                    onClick={onStopVoice}
                    aria-label={t.stopVoiceAria}
                    className="inline-flex items-center gap-1 rounded-full bg-[#ff5c6c] px-2 py-0.5 text-[10px] font-black text-white transition hover:brightness-105 active:scale-95"
                  >
                    <Square className="h-2.5 w-2.5 fill-current" />
                    <span>{t.stopShort}</span>
                  </button>
                ) : blocked ? (
                  <button
                    type="button"
                    onClick={() => {
                      audio.unlockAndStart();
                      speech.markUserUnlocked();
                      onListenPrompt();
                    }}
                    className="inline-flex items-center gap-1 rounded-full bg-[#fde047] px-2 py-0.5 text-[10px] font-black text-[#08265b] shadow-sm transition hover:bg-[#fef08a] active:scale-95"
                  >
                    <Hand className="h-3 w-3" />
                    <span>{t.tapToListen}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      audio.unlockAndStart();
                      speech.markUserUnlocked();
                      onListenPrompt();
                    }}
                    aria-label={t.listenAgainAria}
                    className="inline-flex items-center gap-1 rounded-full bg-[#e0f7ff] px-2 py-0.5 text-[10px] font-black text-[#006e8a] transition hover:bg-[#bae6fd] active:scale-95"
                  >
                    <Volume2 className="h-2.5 w-2.5" />
                    <span>{t.listenAgain}</span>
                  </button>
                )}
              </div>
            </div>
            <p className="text-[11px] leading-snug font-bold sm:text-xs">
              {tickleCaption || p.nautiPrompt}
            </p>
          </div>
        </div>

        {/* RIGHT AREA (7 cols): Featured Experience Card + Detrás de esta experiencia */}
        <div className="cockpit-scroll col-span-7 flex max-h-full min-h-0 flex-col overflow-y-auto pr-1">
          <div className="my-auto flex flex-col gap-2.5 py-0.5 sm:gap-3">
            {/* Featured Interactive Experience Card: EFECTO DOMINÓ */}
            <section
              aria-labelledby="featured-experience-title"
              className="rounded-2xl border-2 border-[#00d2e0]/60 bg-[#081d4a]/90 p-3.5 shadow-[0_6px_0_#041029] backdrop-blur-sm sm:p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-black uppercase">
                <span className="text-[#fde047]">{p.featuredLabel}</span>
                <span className="inline-flex items-center gap-1 text-[#9df8ff]">
                  <Compass className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{p.experienceLocation}</span>
                </span>
              </div>

              <h1
                id="featured-experience-title"
                className="mt-1 text-2xl font-black tracking-tight text-white drop-shadow-[0_3px_0_#041029] sm:text-3xl"
              >
                {p.experienceName}
              </h1>

              <p className="mt-1.5 whitespace-pre-line text-xs leading-snug font-semibold text-[#e6faff] sm:text-[13px] sm:leading-relaxed">
                {p.experienceSummary}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2.5 sm:gap-3">
                {tutorialCompleted ? (
                  <>
                    <button
                      type="button"
                      onClick={onEnterEfectoDomino}
                      className="flex min-h-[42px] items-center justify-center gap-2 rounded-2xl border-2 border-white bg-[#facc15] px-5 py-2 text-xs font-black text-[#08265b] shadow-[0_3px_0_#b45309] transition hover:bg-[#fde047] active:translate-y-[2px] sm:min-h-[46px] sm:px-6 sm:text-sm"
                    >
                      <span>{p.enterExperienceBtn}</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>

                    <button
                      type="button"
                      onClick={onStartTutorial}
                      title={t.tooltipTutorial}
                      className="flex min-h-[42px] items-center justify-center gap-2 rounded-2xl border-2 border-[#00d2e0] bg-[#0c2e70]/95 px-4 py-2 text-xs font-black text-[#e6faff] shadow-[0_3px_0_#041029] transition hover:bg-[#13429b] active:translate-y-[2px] sm:min-h-[46px] sm:px-5 sm:text-sm"
                    >
                      <BookOpen
                        className="h-4 w-4 flex-none text-[#34f0fa]"
                        aria-hidden="true"
                      />
                      <span>{t.reviewTutorialBtn}</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={onStartTutorial}
                      className="flex min-h-[42px] items-center justify-center gap-2 rounded-2xl border-2 border-white bg-[#facc15] px-5 py-2 text-xs font-black text-[#08265b] shadow-[0_3px_0_#b45309] transition hover:bg-[#fde047] active:translate-y-[2px] sm:min-h-[46px] sm:px-6 sm:text-sm"
                    >
                      <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                      <span>
                        {tutorialSavedStep > 0
                          ? t.resumeTutorialBtn
                          : t.startTrainingBtn}
                      </span>
                    </button>

                    <button
                      type="button"
                      disabled
                      aria-disabled="true"
                      title={t.tutorialLockedHint}
                      className="flex min-h-[42px] cursor-not-allowed items-center justify-center gap-2 rounded-2xl border-2 border-[#6488b8]/50 bg-[#0a204d]/85 px-4 py-2 text-xs font-black text-[#cbd5e1] opacity-75 sm:min-h-[46px] sm:px-5 sm:text-sm"
                    >
                      <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{p.enterExperienceBtn}</span>
                    </button>
                  </>
                )}
              </div>
              {!tutorialCompleted && (
                <p className="mt-2 text-[11px] font-bold text-[#fde047]">
                  {t.tutorialLockedHint}
                </p>
              )}
            </section>

            {/* Reusable Creator Recognition & Inspiration Block */}
            {credits && (
              <ExperienceCredits
                credits={credits}
                lang={audio.audioLang}
              />
            )}
          </div>
        </div>
      </div>

      {/* Bottom Credits Area: Attribution */}
      <footer className="flex flex-none flex-wrap items-center justify-center gap-2 pt-1.5 sm:justify-end sm:pt-2">
        <span className="text-[11px] font-bold text-[#e6faff] drop-shadow-[0_1px_2px_rgba(4,16,41,0.9)] sm:text-xs">
          {t.createdBy}
        </span>
      </footer>
    </div>
  );
};
