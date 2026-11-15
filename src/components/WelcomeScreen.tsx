import React from 'react';
import {
  ArrowLeft,
  BookOpen,
  Hand,
  Play,
  Square,
  Volume2,
} from 'lucide-react';
import { NautiCharacterRig, type TickleIntensity } from './NautiCharacterRig';
import { NautiLogo } from './NautiLogo';
import { FilomatasLogo } from './FilomatasLogo';
import { SoundControlButton } from './SoundControlButton';
import { EduTooltip } from './EduTooltip';
import { LanguageSelector } from './LanguageSelector';
import { getEpisodeCatalog, type EpisodeId } from '../data/episodesCatalog';
import { CATALOG_STRINGS, UI_STRINGS } from '../data/uiStrings';
import type { MusicAudioControls } from '../hooks/useMusicAudio';
import type { SpeechControlsState } from '../hooks/useSpeech';

interface WelcomeScreenProps {
  episodeId?: EpisodeId;
  welcomeLine: string;
  launchLine: string;
  isLaunching: boolean;
  isSpeaking: boolean;
  mouthPulse: number;
  audio: MusicAudioControls;
  speech: SpeechControlsState;
  onListenWelcome: () => void;
  onStopVoice: () => void;
  onOpenVoiceSettings: () => void;
  onBackToCatalog: () => void;
  onStartMission: () => void;
  onResumeMission?: () => void;
  hasSavedMission?: boolean;
  onReviewTutorial: () => void;
  tickleCaption?: string | null;
  onTickleSound?: (intensity: TickleIntensity) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  episodeId = 'ep-01-energia-aurora',
  welcomeLine,
  launchLine,
  isLaunching,
  isSpeaking,
  mouthPulse,
  audio,
  speech,
  onListenWelcome,
  onStopVoice,
  onOpenVoiceSettings,
  onBackToCatalog,
  onStartMission,
  onResumeMission,
  hasSavedMission = false,
  onReviewTutorial,
  tickleCaption = null,
  onTickleSound,
}) => {
  const t = UI_STRINGS[audio.audioLang];
  const c = CATALOG_STRINGS[audio.audioLang];
  const catalog = getEpisodeCatalog(audio.audioLang);
  const currentEpisode =
    catalog.find((ep) => ep.id === episodeId) ?? catalog[0];
  const blocked = speech.narrationBlocked && !isSpeaking && !isLaunching;

  return (
    <div className="relative z-10 mx-auto flex h-full w-full max-w-[1160px] flex-col px-3 py-2 sm:px-6 sm:py-3.5">
      {/* Top Bar: Back to Episodes + NAUTI Identity + Language Selector + Audio Controls */}
      <header className="flex flex-none items-center justify-between gap-2 pb-1.5 sm:pb-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            disabled={isLaunching}
            onClick={onBackToCatalog}
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border-2 border-[#00d2e0]/60 bg-[#0c2d6e]/95 px-2.5 py-1 text-xs font-black text-[#e6faff] shadow-[0_2px_0_#041029] transition hover:bg-[#13429b] active:translate-y-[1px] disabled:opacity-60"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-[#34f0fa]" aria-hidden="true" />
            <span>{c.backToCatalogBtn}</span>
          </button>

          <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
            <NautiLogo className="h-7 sm:h-9" alt={t.platformName} />
            <span
              className="h-5 w-px flex-none bg-[#00d2e0]/40 sm:h-6"
              aria-hidden="true"
            />
            <FilomatasLogo className="h-6 sm:h-8" />
          </div>
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
            onReplayCurrent={onListenWelcome}
            onOpenVoiceModal={onOpenVoiceSettings}
          />
        </div>
      </header>

      {/* Main 16:9 Landscape Composition */}
      <div className="grid min-h-0 flex-1 grid-cols-12 items-center gap-3 sm:gap-6">
        {/* LEFT AREA (5 cols): NAUTI Mascot + Compact Speech Bubble */}
        <div className="col-span-5 flex h-full min-h-0 flex-col items-center justify-center gap-1.5 sm:gap-2.5">
          <div className="relative flex w-full max-w-[230px] flex-none items-center justify-center sm:max-w-[270px]">
            <div
              className={`pointer-events-none absolute h-32 w-32 rounded-full blur-2xl transition-colors duration-500 sm:h-40 sm:w-40 ${
                isLaunching ? 'bg-[#facc15]/35' : 'bg-[#00d2e0]/25'
              }`}
              aria-hidden="true"
            />
            <NautiCharacterRig
              expression={isLaunching ? 'celebrate' : 'normal'}
              gaze="center"
              isSpeaking={isSpeaking}
              mouthPulse={mouthPulse}
              className="w-[64%] max-w-[min(210px,36dvh)] sm:w-[70%] sm:max-w-[min(235px,40dvh)]"
              stickerRim
              onTickleSound={onTickleSound}
            />
          </div>

          {/* Readable NAUTI Speech Bubble preserving personality & audio trigger */}
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
                      onListenWelcome();
                    }}
                    className="inline-flex items-center gap-1 rounded-full bg-[#fde047] px-2 py-0.5 text-[10px] font-black text-[#08265b] shadow-sm transition hover:bg-[#fef08a] active:scale-95"
                  >
                    <Hand className="h-3 w-3" />
                    <span>{t.tapToListen}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isLaunching}
                    onClick={() => {
                      audio.unlockAndStart();
                      speech.markUserUnlocked();
                      onListenWelcome();
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
              {isLaunching ? launchLine : tickleCaption || welcomeLine}
            </p>
          </div>
        </div>

        {/* RIGHT AREA (7 cols): Simplified Episode Cover (Title, Narrative Synopsis, Start & Review Tutorial) */}
        <div className="cockpit-scroll col-span-7 flex max-h-full min-h-0 flex-col justify-center gap-3 overflow-y-auto pr-1 sm:gap-4">
          {/* Episode Title & Experience Context */}
          <div>
            <p className="text-[11px] font-black tracking-wider text-[#9df8ff] uppercase sm:text-xs">
              {t.experienceTitle} · {currentEpisode.numberLabel}
            </p>
            <h1 className="mt-1 text-2xl leading-tight font-black tracking-tight text-white drop-shadow-[0_3px_0_#041029] sm:text-3xl lg:text-4xl">
              {currentEpisode.title}
            </h1>
          </div>

          {/* Short Narrative Synopsis (specific to episode, no redundant rules) */}
          <section
            aria-label={currentEpisode.title}
            className="rounded-2xl border-2 border-[#00d2e0]/45 bg-[#07183d]/85 p-3.5 shadow-[0_4px_0_#041029] backdrop-blur-sm sm:p-5"
          >
            <p className="text-sm leading-relaxed font-semibold text-[#e6faff] sm:text-base">
              {currentEpisode.coverSynopsis}
            </p>
          </section>

          {/* Primary & Secondary Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-0.5 sm:gap-3">
            {hasSavedMission && onResumeMission ? (
              <>
                <button
                  type="button"
                  disabled={isLaunching}
                  onClick={onResumeMission}
                  className="flex min-h-[44px] items-center justify-center gap-2 rounded-2xl border-2 border-white bg-[#facc15] px-5 py-2 text-xs font-black text-[#08265b] shadow-[0_3px_0_#b45309] transition hover:bg-[#fde047] active:translate-y-[2px] disabled:opacity-90 sm:min-h-[48px] sm:px-6 sm:text-sm"
                >
                  <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                  <span>{t.continueMissionCta}</span>
                </button>

                <EduTooltip
                  content={t.tooltipStartMission}
                  preferredSide="top"
                  showInfoButton
                  infoAriaLabel={t.tooltipInfoAria(t.startMissionCta)}
                >
                  <button
                    type="button"
                    disabled={isLaunching}
                    onClick={onStartMission}
                    className="flex min-h-[44px] items-center justify-center gap-2 rounded-2xl border-2 border-[#00d2e0] bg-[#0c2e70]/95 px-4 py-2 text-xs font-black text-[#e6faff] shadow-[0_3px_0_#041029] transition hover:bg-[#13429b] active:translate-y-[2px] disabled:opacity-90 sm:min-h-[48px] sm:px-5 sm:text-sm"
                  >
                    <span>{isLaunching ? t.launching : t.startMissionCta}</span>
                  </button>
                </EduTooltip>
              </>
            ) : (
              <EduTooltip
                content={t.tooltipStartMission}
                preferredSide="top"
                showInfoButton
                infoAriaLabel={t.tooltipInfoAria(t.startMissionCta)}
              >
                <button
                  type="button"
                  disabled={isLaunching}
                  onClick={onStartMission}
                  className="flex min-h-[44px] items-center justify-center gap-2 rounded-2xl border-2 border-white bg-[#facc15] px-5 py-2 text-xs font-black text-[#08265b] shadow-[0_3px_0_#b45309] transition hover:bg-[#fde047] active:translate-y-[2px] disabled:opacity-90 sm:min-h-[48px] sm:px-6 sm:text-sm"
                >
                  <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                  <span>{isLaunching ? t.launching : t.startMissionCta}</span>
                </button>
              </EduTooltip>
            )}

            <EduTooltip
              content={t.tooltipTutorial}
              preferredSide="top"
              showInfoButton
              infoAriaLabel={t.tooltipInfoAria(t.reviewTutorialBtn)}
            >
              <button
                type="button"
                disabled={isLaunching}
                onClick={onReviewTutorial}
                className="flex min-h-[44px] items-center justify-center gap-2 rounded-2xl border-2 border-[#00d2e0] bg-[#0c2e70]/95 px-4 py-2 text-xs font-black text-[#e6faff] shadow-[0_3px_0_#041029] transition hover:bg-[#13429b] active:translate-y-[2px] disabled:opacity-90 sm:min-h-[48px] sm:px-5 sm:text-sm"
              >
                <BookOpen className="h-4 w-4 text-[#34f0fa]" aria-hidden="true" />
                <span>{t.reviewTutorialBtn}</span>
              </button>
            </EduTooltip>
          </div>

          {/* Secondary Filómatas LAB attribution */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <span className="text-[11px] font-bold text-[#e6faff] drop-shadow-[0_1px_2px_rgba(4,16,41,0.9)]">
              {t.createdBy}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
