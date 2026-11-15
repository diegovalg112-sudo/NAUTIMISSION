import React from 'react';
import {
  ArrowLeft,
  FlaskConical,
  Radio,
  Volume2,
  Square,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { CATALOG_STRINGS, UI_STRINGS } from '../data/uiStrings';
import type { GamePhase, GameStats, StatKey } from '../data/missionData';
import type { MusicAudioControls } from '../hooks/useMusicAudio';
import type { SpeechControlsState } from '../hooks/useSpeech';
import { NautiLogo } from './NautiLogo';
import { FilomatasLogo } from './FilomatasLogo';
import { SoundControlButton } from './SoundControlButton';
import { EduTooltip } from './EduTooltip';
import { LanguageSelector } from './LanguageSelector';
import {
  AguaStickerIcon,
  EnergiaStickerIcon,
  RadarDialBadge,
  SaludStickerIcon,
} from './ResourceStickers';

interface HudBarProps {
  phase: GamePhase;
  step: number;
  stats: GameStats;
  science: number;
  research: number;
  isSpeaking: boolean;
  highlightedStat?: StatKey | 'science' | 'research' | null;
  audio: MusicAudioControls;
  speech: SpeechControlsState;
  onOpenAudio: () => void;
  onReplayCurrent: () => void;
  onToggleSpeak: () => void;
  onBackToCatalog?: () => void;
}

export const HudBar: React.FC<HudBarProps> = ({
  phase,
  step,
  stats,
  science,
  research,
  isSpeaking,
  highlightedStat = null,
  audio,
  speech,
  onOpenAudio,
  onReplayCurrent,
  onToggleSpeak,
  onBackToCatalog,
}) => {
  const showMissionMeters = phase !== 'intro';
  const jornadaNum = Math.min(step + 1, 5);
  const anyCritical = Object.values(stats).some((v) => v < 25);
  const t = UI_STRINGS[audio.audioLang];
  const c = CATALOG_STRINGS[audio.audioLang];

  const statMeta: {
    key: StatKey;
    label: string;
    tooltip: string;
    Icon: React.FC<{ className?: string }>;
    cardTone: string;
    barFill: string;
    labelColor: string;
  }[] = [
    {
      key: 'energia',
      label: t.hudEnergy,
      tooltip: t.tooltipEnergy,
      Icon: EnergiaStickerIcon,
      cardTone: 'border-[#facc15]/80 bg-[#1a2748]/95',
      barFill: 'from-[#fde047] to-[#f59e0b]',
      labelColor: 'text-[#fef08a]',
    },
    {
      key: 'salud',
      label: t.hudHealth,
      tooltip: t.tooltipHealth,
      Icon: SaludStickerIcon,
      cardTone: 'border-[#22c55e]/80 bg-[#0f2f35]/95',
      barFill: 'from-[#4ade80] to-[#16a34a]',
      labelColor: 'text-[#bbf7d0]',
    },
    {
      key: 'agua',
      label: t.hudWater,
      tooltip: t.tooltipWater,
      Icon: AguaStickerIcon,
      cardTone: 'border-[#29b6f6]/80 bg-[#0d2854]/95',
      barFill: 'from-[#38bdf8] to-[#0284c7]',
      labelColor: 'text-[#bae6fd]',
    },
  ];

  return (
    <header className="compact-hud relative z-20 flex flex-none items-center justify-between gap-2 border-b-2 border-[#00d2e0]/40 bg-[#07173b]/95 px-2.5 py-1.5 backdrop-blur-md sm:px-4">
      {/* Left: Back to Episodes + Original NAUTI Logo & Mission Title */}
      <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
        {onBackToCatalog && (
          <button
            type="button"
            onClick={onBackToCatalog}
            aria-label={
              phase === 'tutorial' ? t.pauseTutorialBtn : c.backToCatalogBtn
            }
            title={
              phase === 'tutorial' ? t.pauseTutorialBtn : c.backToCatalogBtn
            }
            className="inline-flex min-h-[34px] flex-none items-center gap-1 rounded-xl border-2 border-[#00d2e0]/55 bg-[#0c2d6e] px-2 py-1 text-[11px] font-black text-[#e6faff] transition hover:bg-[#13429b] active:scale-95"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-[#34f0fa]" aria-hidden="true" />
            <span className="hidden lg:inline">
              {phase === 'tutorial' ? t.pauseTutorialBtn : c.backToCatalogBtn}
            </span>
          </button>
        )}
        <NautiLogo className="h-6 sm:h-8" alt={t.platformName} />
        <span
          className="hidden h-5 w-px flex-none bg-[#00d2e0]/35 md:inline-block"
          aria-hidden="true"
        />
        <FilomatasLogo className="hidden h-6 md:block md:h-7" />
        <div className="min-w-0 leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-xs font-black tracking-wide text-white sm:text-sm">
              {t.hudMission}
            </span>
            {(phase === 'scene' || phase === 'result' || phase === 'trivia') && (
              <span className="tabular-nums rounded-lg bg-[#facc15] px-1.5 py-0.5 text-[10px] font-black text-[#08265b] shadow-sm">
                {t.hudShiftPrefix}
                {jornadaNum}/5
              </span>
            )}
          </div>
          <p className="hidden truncate text-[10px] font-bold text-[#9df8ff] md:block">
            {t.hudOfflineSub}
          </p>
        </div>
      </div>

      {/* Center: Color-Coded Card-Deck Resource Meters + Radar Dial */}
      {showMissionMeters ? (
        <div className="flex flex-1 items-center justify-center gap-1.5 sm:gap-2.5">
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {statMeta.map(({ key, label, tooltip, Icon, cardTone, barFill, labelColor }) => {
              const value = stats[key];
              const critical = value < 25;
              const isHighlighted = highlightedStat === key;
              return (
                <EduTooltip
                  key={key}
                  content={tooltip}
                  preferredSide="bottom"
                  tapAnchorOpens
                  className="relative"
                >
                  {({ isOpen, openTouch }) => (
                    <div
                      role="button"
                      tabIndex={0}
                      aria-label={t.tooltipInfoAria(label)}
                      aria-expanded={isOpen}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          openTouch(e);
                        }
                      }}
                      className={`min-w-[74px] cursor-help rounded-xl border-2 px-1.5 py-1 shadow-[0_2px_0_#041029] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#34f0fa] sm:min-w-[106px] sm:px-2 ${
                        critical
                          ? 'border-[#ff5c6c] bg-[#450d21]/95 anim-alert-glow'
                          : cardTone
                      } ${
                        isHighlighted
                          ? 'scale-[1.06] ring-2 ring-[#fde047] ring-offset-1 ring-offset-[#07173b]'
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 text-[10px] font-black sm:text-[11px]">
                        <span
                          className={`flex items-center gap-1 ${
                            critical ? 'text-[#fecdd3]' : labelColor
                          }`}
                        >
                          {critical ? (
                            <AlertTriangle className="h-3.5 w-3.5 text-[#ff5c6c]" />
                          ) : (
                            <Icon className="h-4 w-4 flex-none" />
                          )}
                          <span className="hidden sm:inline">{label}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span
                            className={`tabular-nums font-black ${
                              critical ? 'text-[#ff9aa4]' : 'text-white'
                            }`}
                          >
                            {value}
                          </span>
                          <Info
                            className={`h-2.5 w-2.5 flex-none transition ${
                              isOpen ? 'text-[#34f0fa] opacity-100' : 'text-[#9df8ff] opacity-65'
                            }`}
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#041029]">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r transition-all duration-300 ${
                            critical ? 'from-[#ff5c6c] to-[#ef4444]' : barFill
                          }`}
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  )}
                </EduTooltip>
              );
            })}
          </div>

          {/* Radar Dial + Science & Research Telemetry */}
          <div className="hidden items-center gap-2 border-l border-[#00d2e0]/25 pl-2 sm:flex">
            <RadarDialBadge isDanger={anyCritical} />
            <div className="flex flex-col leading-tight">
              <EduTooltip content={t.tooltipScience} preferredSide="bottom" tapAnchorOpens>
                {({ isOpen, openTouch }) => (
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={t.tooltipInfoAria(t.hudScience)}
                    aria-expanded={isOpen}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openTouch(e);
                      }
                    }}
                    className={`flex cursor-help items-center gap-1 rounded px-1 text-[11px] font-black text-[#fde047] transition focus:outline-none focus:ring-1 focus:ring-[#34f0fa] ${
                      highlightedStat === 'science' ? 'bg-[#fde047]/20 ring-1 ring-[#fde047]' : ''
                    }`}
                  >
                    <FlaskConical className="h-3 w-3" />
                    <span className="tabular-nums">{science}</span>
                    <span className="hidden text-[10px] font-bold text-[#fef08a] lg:inline">
                      {t.hudScience}
                    </span>
                    <Info className="h-2.5 w-2.5 opacity-70" aria-hidden="true" />
                  </div>
                )}
              </EduTooltip>
              <EduTooltip content={t.tooltipResearch} preferredSide="bottom" tapAnchorOpens>
                {({ isOpen, openTouch }) => (
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={t.tooltipInfoAria(t.hudResearch)}
                    aria-expanded={isOpen}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openTouch(e);
                      }
                    }}
                    className={`flex cursor-help items-center gap-1 rounded px-1 text-[11px] font-black text-[#34f0fa] transition focus:outline-none focus:ring-1 focus:ring-[#34f0fa] ${
                      highlightedStat === 'research' ? 'bg-[#34f0fa]/20 ring-1 ring-[#34f0fa]' : ''
                    }`}
                  >
                    <Radio className="h-3 w-3" />
                    <span className="tabular-nums">{research}/60</span>
                    <span className="hidden text-[10px] font-bold text-[#a5f3fc] lg:inline">
                      {t.hudResearch}
                    </span>
                    <Info className="h-2.5 w-2.5 opacity-70" aria-hidden="true" />
                  </div>
                )}
              </EduTooltip>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden flex-1 items-center justify-center gap-2 sm:flex">
          <span className="rounded-full bg-[#facc15] px-3 py-0.5 text-[11px] font-black text-[#08265b] shadow-sm">
            {t.kitBanner}
          </span>
        </div>
      )}

      {/* Right: Quick Narration + Filómatas LAB + Persistent Top-Right Sound Control Button */}
      <div className="flex flex-none items-center gap-1.5">
        {showMissionMeters && (
          <div className="flex items-center gap-1.5 rounded-lg border border-[#00d2e0]/35 bg-[#0c265a] px-1.5 py-1 text-[10px] font-black sm:hidden">
            <EduTooltip content={t.tooltipScience} preferredSide="bottom" tapAnchorOpens>
              {({ isOpen, openTouch }) => (
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={t.tooltipInfoAria(t.hudScience)}
                  aria-expanded={isOpen}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openTouch(e);
                    }
                  }}
                  className="tabular-nums flex items-center gap-0.5 text-[#fde047]"
                >
                  <FlaskConical className="h-3 w-3" />
                  {science}
                </span>
              )}
            </EduTooltip>
            <EduTooltip content={t.tooltipResearch} preferredSide="bottom" tapAnchorOpens>
              {({ isOpen, openTouch }) => (
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={t.tooltipInfoAria(t.hudResearch)}
                  aria-expanded={isOpen}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openTouch(e);
                    }
                  }}
                  className="tabular-nums flex items-center gap-0.5 text-[#34f0fa]"
                >
                  <Radio className="h-3 w-3" />
                  {research}/60
                </span>
              )}
            </EduTooltip>
          </div>
        )}

        <EduTooltip
          content={isSpeaking ? t.tooltipStopVoice : t.tooltipListenAgain}
          preferredSide="bottom"
          showInfoButton
          infoAriaLabel={t.tooltipInfoAria(isSpeaking ? t.stopVoice : t.listenAgain)}
          infoButtonClassName="h-5 w-5"
          className="inline-flex items-center gap-0.5"
        >
          <button
            type="button"
            onClick={onToggleSpeak}
            aria-label={isSpeaking ? t.stopVoiceAria : t.listenAgainAria}
            className={`flex min-h-[36px] min-w-[36px] items-center justify-center rounded-xl border-2 transition active:scale-95 ${
              isSpeaking
                ? 'border-white bg-[#ff5c6c] text-white'
                : 'border-[#00d2e0]/70 bg-[#0c2d6e] text-[#9df8ff] hover:bg-[#13429b]'
            }`}
          >
            {isSpeaking ? (
              <Square className="h-3.5 w-3.5 fill-current" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>
        </EduTooltip>

        <LanguageSelector
          value={audio.audioLang}
          onChange={audio.setAudioLang}
          variant="hud"
        />

        <SoundControlButton
          audio={audio}
          speech={speech}
          onReplayCurrent={onReplayCurrent}
          onOpenVoiceModal={onOpenAudio}
        />
      </div>
    </header>
  );
};
