import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock,
  Hand,
  Home,
  Play,
  Square,
  Volume2,
} from 'lucide-react';
import {
  getEpisodeCatalog,
  type EpisodeId,
} from '../data/episodesCatalog';
import { CATALOG_STRINGS, PLATFORM_STRINGS, UI_STRINGS } from '../data/uiStrings';
import type { MusicAudioControls } from '../hooks/useMusicAudio';
import type { SpeechControlsState } from '../hooks/useSpeech';
import { EpisodeIllustration } from './EpisodeIllustration';
import { FilomatasLogo } from './FilomatasLogo';
import { LanguageSelector } from './LanguageSelector';
import { NautiCharacterRig } from './NautiCharacterRig';
import { NautiLogo } from './NautiLogo';
import { SoundControlButton } from './SoundControlButton';

interface EpisodeCatalogScreenProps {
  hasSavedMission: boolean;
  savedDayNumber: number;
  isSpeaking: boolean;
  mouthPulse: number;
  audio: MusicAudioControls;
  speech: SpeechControlsState;
  onListenPrompt: () => void;
  onStopVoice: () => void;
  onOpenVoiceSettings: () => void;
  onBackToDesktop: () => void;
  onBackToNauti: () => void;
  onSelectEpisode: (episodeId: EpisodeId) => void;
  onResumeSavedMission: () => void;
  onReviewTutorial?: () => void;
}

export const EpisodeCatalogScreen: React.FC<EpisodeCatalogScreenProps> = ({
  hasSavedMission,
  savedDayNumber,
  isSpeaking,
  mouthPulse,
  audio,
  speech,
  onListenPrompt,
  onStopVoice,
  onOpenVoiceSettings,
  onBackToDesktop,
  onBackToNauti,
  onSelectEpisode,
  onResumeSavedMission,
  onReviewTutorial,
}) => {
  const t = UI_STRINGS[audio.audioLang];
  const p = PLATFORM_STRINGS[audio.audioLang];
  const c = CATALOG_STRINGS[audio.audioLang];
  const episodes = getEpisodeCatalog(audio.audioLang);
  const blocked = speech.narrationBlocked && !isSpeaking;

  return (
    <div className="relative z-10 mx-auto flex h-full w-full max-w-[1220px] flex-col px-3 py-2 sm:px-5 sm:py-3">
      {/* Top Bar: Back to NAUTI Main Menu + Brand + Language + Sound */}
      <header className="flex flex-none items-center justify-between gap-2 pb-1.5 sm:pb-2">
        <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onBackToDesktop}
            title={p.backToDesktopBtn}
            aria-label={p.backToDesktopBtn}
            className="inline-flex min-h-[36px] flex-none items-center gap-1 rounded-xl border-2 border-[#00d2e0]/60 bg-[#0c2d6e]/95 px-2 py-1 text-xs font-black text-[#e6faff] shadow-[0_2px_0_#041029] transition hover:bg-[#13429b] active:translate-y-[1px]"
          >
            <Home className="h-3.5 w-3.5 text-[#34f0fa]" aria-hidden="true" />
            <span className="hidden lg:inline">{p.backToDesktopBtn}</span>
          </button>

          <button
            type="button"
            onClick={onBackToNauti}
            className="inline-flex min-h-[36px] flex-none items-center gap-1.5 rounded-xl border-2 border-[#00d2e0]/60 bg-[#0c2d6e]/95 px-2.5 py-1 text-xs font-black text-[#e6faff] shadow-[0_2px_0_#041029] transition hover:bg-[#13429b] active:translate-y-[1px]"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-[#34f0fa]" aria-hidden="true" />
            <span>{c.backToNautiBtn}</span>
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
          {onReviewTutorial && (
            <button
              type="button"
              onClick={onReviewTutorial}
              className="inline-flex min-h-[36px] flex-none items-center gap-1.5 rounded-xl border-2 border-[#00d2e0]/60 bg-[#0c2d6e]/95 px-2.5 py-1 text-xs font-black text-[#e6faff] shadow-[0_2px_0_#041029] transition hover:bg-[#13429b] active:translate-y-[1px]"
            >
              <BookOpen className="h-3.5 w-3.5 text-[#34f0fa]" aria-hidden="true" />
              <span className="hidden sm:inline">{t.reviewTutorialBtn}</span>
            </button>
          )}

          <LanguageSelector
            value={audio.audioLang}
            onChange={audio.setAudioLang}
            variant="hud"
          />

          <SoundControlButton
            audio={audio}
            speech={speech}
            onReplayCurrent={onListenPrompt}
            onOpenVoiceModal={onOpenVoiceSettings}
          />
        </div>
      </header>

      {/* Main Catalog Stage */}
      <div className="cockpit-scroll min-h-0 flex-1 overflow-y-auto pr-1 pb-2">
        {/* Heading + Supporting Description + NAUTI Voice Strip */}
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-2xl leading-none font-black tracking-tight text-white drop-shadow-[0_3px_0_#041029] sm:text-3xl">
              {c.heading}
            </h1>
            <p className="mt-1 text-sm font-black text-[#34f0fa] sm:text-base">
              {c.subtitle}
            </p>
            <p className="mt-1 text-xs leading-snug font-semibold text-[#d7f3ff] sm:text-[13px]">
              {c.supportingText}
            </p>
          </div>

          {/* Compact NAUTI Prompt Strip */}
          <div className="flex max-w-md items-center gap-2.5 rounded-2xl border-2 border-white/90 bg-[#f4fcff]/95 px-2.5 py-1.5 text-[#08265b] shadow-[0_4px_0_#041029]">
            <div className="w-11 flex-none">
              <NautiCharacterRig
                expression="happy"
                gaze="center"
                isSpeaking={isSpeaking}
                mouthPulse={mouthPulse}
                interactiveTickle={false}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-black tracking-wider text-[#007e99] uppercase">
                  {t.nautiSays}
                </span>
                {isSpeaking ? (
                  <button
                    type="button"
                    onClick={onStopVoice}
                    aria-label={t.stopVoiceAria}
                    className="inline-flex items-center gap-1 rounded-full bg-[#ff5c6c] px-2 py-0.5 text-[10px] font-black text-white transition hover:brightness-105"
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
                    className="inline-flex items-center gap-1 rounded-full bg-[#fde047] px-2 py-0.5 text-[10px] font-black text-[#08265b]"
                  >
                    <Hand className="h-2.5 w-2.5" />
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
                    className="inline-flex items-center gap-1 rounded-full bg-[#e0f7ff] px-2 py-0.5 text-[10px] font-black text-[#006e8a] hover:bg-[#bae6fd]"
                  >
                    <Volume2 className="h-2.5 w-2.5" />
                    <span>{t.listenAgain}</span>
                  </button>
                )}
              </div>
              <p className="mt-0.5 text-[11px] leading-snug font-bold">
                {c.nautiPrompt}
              </p>
            </div>
          </div>
        </div>

        {/* Saved Mission Banner (only when a mission was paused mid-play) */}
        {hasSavedMission && (
          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 rounded-2xl border-2 border-[#facc15] bg-[#0a2359]/95 px-3.5 py-2 shadow-[0_4px_0_#041029]">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs font-bold text-[#fef08a]">
              <span className="font-black text-white">{c.inProgressTag}</span>
              <span className="text-[#9df8ff]">
                · {t.chapterShift(savedDayNumber)}
              </span>
            </div>
            <button
              type="button"
              onClick={onResumeSavedMission}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-[#facc15] px-4 py-1.5 text-xs font-black text-[#08265b] shadow-[0_2px_0_#b45309] transition hover:bg-[#fde047] active:translate-y-[1px]"
            >
              <span>{c.resumeMissionBtn}</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Independent 4-Episode Catalog Grid */}
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {episodes.map((episode) => {
            const isAvailable = episode.status === 'available';
            return (
              <article
                key={episode.id}
                className={`flex flex-col overflow-hidden rounded-2xl border-2 transition ${
                  isAvailable
                    ? 'border-white bg-[#f4fcff] text-[#08265b] shadow-[0_6px_0_#041029]'
                    : 'border-[#4872ab]/55 bg-[#0a204d]/85 text-[#e6faff] shadow-[0_4px_0_#041029]'
                }`}
              >
                <EpisodeIllustration
                  kind={episode.illustrationKey}
                  muted={!isAvailable}
                  className="h-24 w-full flex-none border-b border-black/10 sm:h-28"
                />

                <div className="flex flex-1 flex-col justify-between p-3 sm:p-3.5">
                  <div>
                    <div className="flex items-center justify-between gap-2 text-[11px] font-black uppercase">
                      <span
                        className={
                          isAvailable ? 'text-[#007e99]' : 'text-[#9df8ff]'
                        }
                      >
                        {episode.numberLabel}
                      </span>
                      <span
                        className={
                          isAvailable ? 'text-[#15803d]' : 'text-[#cbd5e1]'
                        }
                      >
                        {isAvailable ? c.statusAvailable : c.statusComingSoon}
                      </span>
                    </div>

                    <h2
                      className={`mt-1 text-base leading-tight font-black sm:text-lg ${
                        isAvailable ? 'text-[#08265b]' : 'text-white'
                      }`}
                    >
                      {episode.title}
                    </h2>

                    <p
                      className={`mt-1 text-[11px] font-extrabold ${
                        isAvailable ? 'text-[#0369a1]' : 'text-[#7dd3fc]'
                      }`}
                    >
                      {c.initialProblemLabel}: {episode.initialProblem}
                    </p>

                    <p
                      className={`mt-1.5 text-xs leading-snug font-semibold ${
                        isAvailable ? 'text-[#15385e]' : 'text-[#cbd5e1]'
                      }`}
                    >
                      {episode.description}
                    </p>

                    <p
                      className={`mt-2 border-t pt-1.5 text-[10px] font-black tracking-wide ${
                        isAvailable
                          ? 'border-[#08265b]/15 text-[#007e99]'
                          : 'border-white/15 text-[#9df8ff]'
                      }`}
                    >
                      {c.sharedSystemsLine}
                    </p>
                  </div>

                  <div className="mt-3 pt-1">
                    {isAvailable ? (
                      <button
                        type="button"
                        onClick={() => onSelectEpisode(episode.id)}
                        className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#facc15] px-4 py-2 text-xs font-black text-[#08265b] shadow-[0_3px_0_#b45309] transition hover:bg-[#fde047] active:translate-y-[1px] sm:text-sm"
                      >
                        <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                        <span>{c.playBtn}</span>
                      </button>
                    ) : (
                      <div>
                        <button
                          type="button"
                          disabled
                          aria-disabled="true"
                          className="flex min-h-[42px] w-full cursor-not-allowed items-center justify-center gap-1.5 rounded-xl border border-[#6488b8]/50 bg-[#102b63]/80 px-4 py-2 text-xs font-black text-[#cbd5e1] opacity-90 sm:text-sm"
                        >
                          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{c.comingSoonBtn}</span>
                        </button>
                        <p className="mt-1.5 text-[10px] leading-snug font-semibold text-[#94a3b8]">
                          {c.comingSoonHint}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Creator Credit Footer */}
        <footer className="mt-3 flex flex-wrap items-center justify-center gap-2 border-t border-[#00d2e0]/20 pt-2 text-center">
          <span className="text-[11px] font-bold text-[#e6faff] drop-shadow-[0_1px_2px_rgba(4,16,41,0.9)]">
            {t.createdBy}
          </span>
        </footer>
      </div>
    </div>
  );
};
