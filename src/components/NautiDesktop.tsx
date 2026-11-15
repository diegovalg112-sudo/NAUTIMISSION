import React from 'react';
import {
  Compass,
  FlaskConical,
  Hand,
  Headphones,
  Square,
  Volume2,
} from 'lucide-react';
import {
  getDesktopApps,
  type DesktopAppId,
  type DesktopPlaceholderIconKey,
} from '../data/desktopApps';
import { DESKTOP_STRINGS, UI_STRINGS } from '../data/uiStrings';
import type { MusicAudioControls } from '../hooks/useMusicAudio';
import type { SpeechControlsState } from '../hooks/useSpeech';
import { interpolateTemplate } from '../locales';
import {
  ExperienceCardTooltip,
  ExperienceCardTooltipProvider,
} from './ExperienceCardTooltip';
import { FilomatasLogo } from './FilomatasLogo';
import { LanguageSelector } from './LanguageSelector';
import { NautiCharacterRig, type TickleIntensity } from './NautiCharacterRig';
import { NautiLogo } from './NautiLogo';
import { SoundControlButton } from './SoundControlButton';

interface NautiDesktopProps {
  isSpeaking: boolean;
  mouthPulse: number;
  audio: MusicAudioControls;
  speech: SpeechControlsState;
  onListenPrompt: () => void;
  onStopVoice: () => void;
  onOpenVoiceSettings: () => void;
  onOpenApp: (appId: DesktopAppId) => void;
  tickleCaption?: string | null;
  onTickleSound?: (intensity: TickleIntensity) => void;
}

const PLACEHOLDER_ICON_COMPONENTS: Record<
  DesktopPlaceholderIconKey,
  React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
> = {
  explore: Compass,
  lab: FlaskConical,
  sound: Headphones,
};

export const NautiDesktop: React.FC<NautiDesktopProps> = ({
  isSpeaking,
  mouthPulse,
  audio,
  speech,
  onListenPrompt,
  onStopVoice,
  onOpenVoiceSettings,
  onOpenApp,
  tickleCaption = null,
  onTickleSound,
}) => {
  const t = UI_STRINGS[audio.audioLang];
  const d = DESKTOP_STRINGS[audio.audioLang];
  const apps = getDesktopApps(audio.audioLang);
  const blocked = speech.narrationBlocked && !isSpeaking;

  return (
    <div className="relative z-10 mx-auto flex h-full w-full max-w-[1160px] flex-col px-3 py-2 sm:px-6 sm:py-3">
      {/* Top Bar: Official NAUTI & Filómatas LAB Logos + Language & Audio Controls */}
      <header className="flex flex-none items-center justify-between gap-2 pb-1.5 sm:pb-2.5">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3.5">
          <NautiLogo className="h-8 sm:h-11 md:h-12" alt={t.platformName} />
          <span
            className="h-6 w-px flex-none bg-[#48C5B5]/40 sm:h-8"
            aria-hidden="true"
          />
          <FilomatasLogo className="h-7 sm:h-10 md:h-11" />
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

      {/* Main Desktop Area: Greeting + Non-Dominating NAUTI Companion + 4-App Grid */}
      <main className="cockpit-scroll flex min-h-0 flex-1 flex-col justify-center gap-2.5 overflow-y-auto pr-0.5 sm:gap-4">
        {/* Top Row: Desktop Heading + Compact NAUTI Mascot Speech Strip */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <h1 className="text-xl leading-tight font-black tracking-tight text-[#EAF4F2] sm:text-2xl lg:text-3xl">
              {d.heading}
            </h1>
            <p className="mt-0.5 text-xs font-semibold text-[#48C5B5] sm:text-sm">
              {d.subtitle}
            </p>
          </div>

          {/* Compact NAUTI Speech Bubble Companion */}
          <div className="flex max-w-md items-center gap-2.5 rounded-2xl border-2 border-[#EAF4F2]/90 bg-[#EAF4F2] px-2.5 py-1.5 text-[#101D35] shadow-[0_4px_0_#091224] sm:flex-none">
            <div className="w-11 flex-none sm:w-12">
              <NautiCharacterRig
                expression="happy"
                gaze="center"
                isSpeaking={isSpeaking}
                mouthPulse={mouthPulse}
                onTickleSound={onTickleSound}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-black tracking-wider text-[#1c7c71] uppercase">
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
                    className="inline-flex items-center gap-1 rounded-full bg-[#F2C66D] px-2 py-0.5 text-[10px] font-black text-[#101D35]"
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
                    className="inline-flex items-center gap-1 rounded-full bg-[#48C5B5]/20 px-2 py-0.5 text-[10px] font-black text-[#101D35] hover:bg-[#48C5B5]/35"
                  >
                    <Volume2 className="h-2.5 w-2.5" />
                    <span>{t.listenAgain}</span>
                  </button>
                )}
              </div>
              <p className="mt-0.5 text-[11px] leading-snug font-bold sm:text-xs">
                {tickleCaption || d.nautiPrompt}
              </p>
            </div>
          </div>
        </div>

        {/* Educational Application OS Icon Grid (Landscape Smartphone Optimized) */}
        <ExperienceCardTooltipProvider>
          <section
            aria-label={d.heading}
            className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4"
          >
            {apps.map((app) => {
              const isInteractive =
                app.status === 'available' || app.status === 'in_preparation';
              const isAvailable = app.status === 'available';
              const PlaceholderIcon = app.placeholderIcon
                ? PLACEHOLDER_ICON_COMPONENTS[app.placeholderIcon]
                : Compass;
              const statusLabel = isAvailable
                ? d.availableBadge
                : app.status === 'in_preparation'
                  ? d.inPreparationBadge
                  : d.comingSoonBadge;
              const tooltipLabels = {
                whatStudentsLearn: d.tooltipLabels.whatStudentsLearn,
                interactiveActivity: d.tooltipLabels.interactiveActivity,
                plannedActivityPrefix: d.tooltipLabels.plannedActivityPrefix,
                infoAria: interpolateTemplate(d.tooltipLabels.infoAria, {
                  name: app.name,
                }),
                closeAria: d.tooltipLabels.closeAria,
              };

              return (
                <ExperienceCardTooltip
                  key={app.id}
                  title={app.name}
                  description={app.tooltip.description}
                  learningObjective={app.tooltip.learningObjective}
                  interactiveActivity={app.tooltip.interactiveActivity}
                  isPlanned={app.status !== 'available'}
                  statusLabel={statusLabel}
                  labels={tooltipLabels}
                  preferredSide={app.order <= 3 ? 'bottom' : 'top'}
                >
                  {isInteractive ? (
                    <button
                      type="button"
                      onClick={() => onOpenApp(app.id)}
                      className="group flex h-full w-full flex-col items-center rounded-3xl border-2 border-[#48C5B5] bg-[#101D35]/95 px-2.5 py-3 text-center shadow-[0_5px_0_#070e1c] transition hover:border-[#F2C66D] hover:bg-[#152645] active:translate-y-[2px] sm:px-3.5 sm:py-3.5"
                    >
                      {/* Exact Rounded-Square White Application Icon */}
                      <div className="h-20 w-20 flex-none overflow-hidden rounded-[22px] bg-white shadow-[0_3px_0_#091224] transition-transform group-hover:scale-[1.03] sm:h-24 sm:w-24 lg:rounded-[24px]">
                        {app.iconAsset && (
                          <img
                            src={app.iconAsset}
                            alt={app.name}
                            referrerPolicy="no-referrer"
                            draggable={false}
                            className={`h-full w-full select-none ${
                              app.cropIconRim
                                ? 'scale-[1.15] object-cover'
                                : 'object-contain p-1'
                            }`}
                          />
                        )}
                      </div>

                      <div className="mt-2.5 min-w-0">
                        <span
                          className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-black tracking-wide uppercase ${
                            isAvailable
                              ? 'bg-[#48C5B5]/20 text-[#48C5B5]'
                              : 'bg-[#F2C66D]/20 text-[#F2C66D]'
                          }`}
                        >
                          {statusLabel}
                        </span>
                        <h2 className="mt-1 text-sm leading-tight font-black text-[#EAF4F2] sm:text-base">
                          {app.name}
                        </h2>
                        <p className="mt-0.5 text-[11px] leading-snug font-semibold text-[#b9d4d0] sm:text-xs">
                          {app.subtitle}
                        </p>
                      </div>
                    </button>
                  ) : (
                    <div
                      aria-disabled="true"
                      className="flex h-full w-full flex-col items-center rounded-3xl border-2 border-[#2a3f66] bg-[#101D35]/75 px-2.5 py-3 text-center opacity-85 shadow-[0_4px_0_#070e1c] sm:px-3.5 sm:py-3.5"
                    >
                      {/* Minimal Flat Placeholder App Tile */}
                      <div className="flex h-20 w-20 flex-none items-center justify-center rounded-[22px] border-2 border-[#314975] bg-[#162747] text-[#48C5B5]/80 sm:h-24 sm:w-24 lg:rounded-[24px]">
                        <PlaceholderIcon
                          className="h-9 w-9 sm:h-10 sm:w-10"
                          aria-hidden={true}
                        />
                      </div>

                      <div className="mt-2.5 min-w-0">
                        <span className="inline-block rounded-md bg-[#F2C66D]/15 px-2 py-0.5 text-[10px] font-black tracking-wide text-[#F2C66D] uppercase">
                          {statusLabel}
                        </span>
                        <h2 className="mt-1 text-sm leading-tight font-black text-[#EAF4F2]/90 sm:text-base">
                          {app.name}
                        </h2>
                        <p className="mt-0.5 text-[11px] leading-snug font-semibold text-[#94a8c4] sm:text-xs">
                          {app.subtitle}
                        </p>
                      </div>
                    </div>
                  )}
                </ExperienceCardTooltip>
              );
            })}
          </section>
        </ExperienceCardTooltipProvider>
      </main>

      {/* Creator Attribution Footer */}
      <footer className="flex flex-none flex-wrap items-center justify-center gap-2 pt-1.5 sm:justify-end sm:pt-2">
        <span className="text-[11px] font-bold text-[#EAF4F2]/90 sm:text-xs">
          {t.createdBy}
        </span>
      </footer>
    </div>
  );
};
