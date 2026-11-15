import React from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  FlaskConical,
  Info,
  Radio,
  RotateCcw,
  Square,
  Volume2,
} from 'lucide-react';
import { NautiLogo } from './NautiLogo';
import { FilomatasLogo } from './FilomatasLogo';
import { DEMO_STRINGS, UI_STRINGS } from '../data/uiStrings';
import type { MusicAudioControls } from '../hooks/useMusicAudio';
import type { SpeechControlsState } from '../hooks/useSpeech';
import { LanguageSelector } from './LanguageSelector';
import { SoundControlButton } from './SoundControlButton';
import { NautiCharacterRig, type TickleIntensity } from './NautiCharacterRig';
import {
  AguaStickerIcon,
  EnergiaStickerIcon,
  SaludStickerIcon,
} from './ResourceStickers';

export interface DemoOptionOutcome {
  energy: number;
  health: number;
  water: number;
  research: number;
}

export const DEMO_BASE_RESOURCES = {
  energy: 50,
  health: 50,
  water: 50,
  research: 0,
} as const;

export const DEMO_OPTION_DELTAS: readonly [DemoOptionOutcome, DemoOptionOutcome] = [
  { energy: -10, health: 5, water: 5, research: 0 },
  { energy: 5, health: -5, water: -5, research: 5 },
] as const;

interface DemoExperienceProps {
  selectedOption: number | null;
  submitted: boolean;
  onSelectOption: (idx: number) => void;
  onSubmitDecision: () => void;
  onRetryDemo: () => void;
  onBackToWelcome: () => void;
  audio: MusicAudioControls;
  speech: SpeechControlsState;
  onOpenVoiceModal: () => void;
  onReplayCurrent: () => void;
  onToggleSpeak: () => void;
  tickleCaption?: string | null;
  onTickleSound?: (intensity: TickleIntensity) => void;
}

function formatDemoDelta(n: number): string {
  if (n > 0) return `+${n}`;
  if (n < 0) return `−${Math.abs(n)}`;
  return '0';
}

export const DemoExperience: React.FC<DemoExperienceProps> = ({
  selectedOption,
  submitted,
  onSelectOption,
  onSubmitDecision,
  onRetryDemo,
  onBackToWelcome,
  audio,
  speech,
  onOpenVoiceModal,
  onReplayCurrent,
  onToggleSpeak,
  tickleCaption = null,
  onTickleSound,
}) => {
  const d = DEMO_STRINGS[audio.audioLang];
  const t = UI_STRINGS[audio.audioLang];

  const chosenOpt =
    selectedOption !== null && selectedOption >= 0
      ? d.options[selectedOption]
      : null;
  const chosenDeltas =
    selectedOption !== null && selectedOption >= 0
      ? DEMO_OPTION_DELTAS[selectedOption]
      : null;

  const nautiBubbleText =
    tickleCaption ??
    (submitted && chosenOpt ? chosenOpt.nautiReaction : d.nautiPrompt);

  const indicatorRows = chosenDeltas
    ? [
        {
          key: 'energy',
          label: d.energyLabel,
          before: DEMO_BASE_RESOURCES.energy,
          delta: chosenDeltas.energy,
          after: DEMO_BASE_RESOURCES.energy + chosenDeltas.energy,
          Icon: EnergiaStickerIcon,
        },
        {
          key: 'health',
          label: d.healthLabel,
          before: DEMO_BASE_RESOURCES.health,
          delta: chosenDeltas.health,
          after: DEMO_BASE_RESOURCES.health + chosenDeltas.health,
          Icon: SaludStickerIcon,
        },
        {
          key: 'water',
          label: d.waterLabel,
          before: DEMO_BASE_RESOURCES.water,
          delta: chosenDeltas.water,
          after: DEMO_BASE_RESOURCES.water + chosenDeltas.water,
          Icon: AguaStickerIcon,
        },
        {
          key: 'research',
          label: d.researchLabel,
          before: DEMO_BASE_RESOURCES.research,
          delta: chosenDeltas.research,
          after: DEMO_BASE_RESOURCES.research + chosenDeltas.research,
          Icon: Radio,
        },
      ]
    : [];

  return (
    <div className="relative z-10 flex h-full w-full flex-col overflow-hidden">
      {/* Top Bar: NAUTI Platform + Isolated Demo Label + Language & Audio */}
      <header className="compact-hud relative z-20 flex flex-none items-center justify-between gap-2 border-b-2 border-[#00d2e0]/40 bg-[#07173b]/95 px-2.5 py-1.5 backdrop-blur-md sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <NautiLogo className="h-7 sm:h-9" alt={t.platformName} />
          <span
            className="hidden h-5 w-px flex-none bg-[#00d2e0]/35 sm:inline-block"
            aria-hidden="true"
          />
          <FilomatasLogo className="hidden h-6 sm:block sm:h-8" />
          <div className="min-w-0 border-l border-[#00d2e0]/30 pl-2 leading-tight">
            <span className="block truncate text-xs font-black text-white sm:text-sm">
              {t.experienceTitle}
            </span>
            <span className="block truncate text-[10px] font-bold text-[#fde047]">
              {d.badge}
            </span>
          </div>
        </div>

        <div className="flex flex-none items-center gap-1.5">
          <button
            type="button"
            onClick={onBackToWelcome}
            className="flex min-h-[34px] items-center gap-1 rounded-xl border border-[#00d2e0]/60 bg-[#0c2e70] px-2.5 py-1 text-[11px] font-black text-[#e6faff] transition hover:bg-[#13429b] active:scale-95"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">{d.backBtn.replace(/^←\s*/, '')}</span>
          </button>

          <button
            type="button"
            onClick={onToggleSpeak}
            aria-label={speech.isSpeaking ? t.stopVoiceAria : t.listenAgainAria}
            className={`flex min-h-[34px] min-w-[34px] items-center justify-center rounded-xl border-2 transition active:scale-95 ${
              speech.isSpeaking
                ? 'border-white bg-[#ff5c6c] text-white'
                : 'border-[#00d2e0]/70 bg-[#0c2d6e] text-[#9df8ff] hover:bg-[#13429b]'
            }`}
          >
            {speech.isSpeaking ? (
              <Square className="h-3.5 w-3.5 fill-current" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>

          <LanguageSelector
            value={audio.audioLang}
            onChange={audio.setAudioLang}
            variant="hud"
          />

          <SoundControlButton
            audio={audio}
            speech={speech}
            onReplayCurrent={onReplayCurrent}
            onOpenVoiceModal={onOpenVoiceModal}
          />
        </div>
      </header>

      {/* Main 16:9 Split Console */}
      <main className="relative z-10 mx-auto flex min-h-0 w-full max-w-[1160px] flex-1 flex-row gap-2.5 p-2 sm:gap-4 sm:p-3.5">
        {/* LEFT BAY: NAUTI Character & Reaction Bubble */}
        <aside className="flex w-[36%] min-w-[190px] max-w-[340px] flex-none flex-col items-center justify-center gap-2">
          <NautiCharacterRig
            expression={submitted ? 'happy' : 'normal'}
            gaze={submitted ? 'up-right' : 'center'}
            isSpeaking={speech.isSpeaking}
            mouthPulse={speech.mouthPulse}
            className="w-[68%] max-w-[min(210px,36dvh)]"
            stickerRim
            onTickleSound={onTickleSound}
          />
          <div className="w-full rounded-2xl border-2 border-white bg-[#f4fcff]/95 px-3 py-2 text-[#08265b] shadow-[0_4px_0_#041029]">
            <span className="block text-[10px] font-black tracking-wider text-[#007e99] uppercase">
              {t.nautiSays}
            </span>
            <p className="mt-0.5 text-[11px] leading-snug font-bold sm:text-xs">
              {nautiBubbleText}
            </p>
          </div>
        </aside>

        {/* RIGHT BAY: Isolated Demo Scenario & Consequence View */}
        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border-2 border-white bg-[#f4fcff]/95 text-[#08265b] shadow-[0_6px_0_#041029] backdrop-blur-md">
          <div className="cockpit-scroll min-h-0 flex-1 overflow-y-auto p-3 sm:p-5">
            {!submitted ? (
              <div className="flex flex-col gap-2.5 sm:gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-black tracking-wide text-[#007e99] uppercase">
                    <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
                    {d.badge}
                  </span>
                </div>

                <div>
                  <h2 className="text-base font-black text-[#08265b] sm:text-xl">
                    {d.title}
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed font-semibold text-[#1e3a5f] sm:text-sm">
                    {d.problem}
                  </p>
                  <p className="mt-1.5 text-xs font-black text-[#08265b] sm:text-sm">
                    {d.question}
                  </p>
                </div>

                {/* Two Simple Team Decisions */}
                <div className="grid gap-2 sm:grid-cols-2">
                  {d.options.map((opt, idx) => {
                    const selected = selectedOption === idx;
                    const letter = idx === 0 ? 'A' : 'B';
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => onSelectOption(idx)}
                        aria-pressed={selected}
                        className={`flex min-h-[72px] flex-col items-start justify-start rounded-xl border-2 p-2.5 text-left transition active:scale-[0.99] sm:p-3 ${
                          selected
                            ? 'border-[#08265b] bg-[#fef08a] shadow-[0_3px_0_#08265b]'
                            : 'border-[#00d2e0]/45 bg-white hover:border-[#0099b8] hover:bg-[#e8faff]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`flex h-6 w-6 flex-none items-center justify-center rounded-lg text-xs font-black ${
                              selected
                                ? 'bg-[#08265b] text-[#fde047]'
                                : 'bg-[#00d2e0]/20 text-[#006e8a]'
                            }`}
                          >
                            {letter}
                          </span>
                          <span className="text-xs font-black text-[#08265b] sm:text-sm">
                            {opt.label}
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] leading-snug font-semibold text-[#334155]">
                          {opt.summary}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-start gap-2 rounded-xl border border-[#0284c7]/25 bg-[#e0f2fe] px-3 py-2 text-[11px] font-bold text-[#0c4a6e]">
                  <Info className="mt-0.5 h-3.5 w-3.5 flex-none text-[#0284c7]" aria-hidden="true" />
                  <span>{d.isolatedNote}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 sm:gap-3">
                <div className="flex items-center gap-1.5 text-[11px] font-black tracking-wide text-[#007e99] uppercase">
                  <CheckCircle2 className="h-4 w-4 text-[#16a34a]" aria-hidden="true" />
                  <span>{d.badge}</span>
                </div>

                <div>
                  <h2 className="text-base font-black text-[#08265b] sm:text-xl">
                    {chosenOpt?.resultTitle}
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed font-semibold text-[#1e3a5f] sm:text-sm">
                    {chosenOpt?.resultNarrative}
                  </p>
                </div>

                {/* Simplified Resource Indicator Changes */}
                <div className="rounded-xl border border-[#00d2e0]/40 bg-white p-2.5 sm:p-3">
                  <span className="block text-[11px] font-black tracking-wide text-[#007e99] uppercase">
                    {d.indicatorsTitle}
                  </span>
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {indicatorRows.map(({ key, label, before, delta, after, Icon }) => {
                      const deltaTone =
                        delta > 0
                          ? 'text-[#15803d] bg-[#dcfce7]'
                          : delta < 0
                            ? 'text-[#b91c1c] bg-[#fee2e2]'
                            : 'text-[#475569] bg-[#f1f5f9]';
                      return (
                        <div
                          key={key}
                          className="rounded-xl border border-[#cbd5e1] bg-[#f8fafc] p-2"
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="flex items-center gap-1 text-[11px] font-black text-[#08265b]">
                              <Icon className="h-3.5 w-3.5 flex-none text-[#0284c7]" />
                              <span className="truncate">{label}</span>
                            </span>
                            <span
                              className={`tabular-nums rounded px-1.5 py-0.5 text-[10px] font-black ${deltaTone}`}
                            >
                              {formatDemoDelta(delta)}
                            </span>
                          </div>
                          <div className="tabular-nums mt-1 text-xs font-black text-[#0f172a]">
                            {before} → {after}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Explanation that Full Mission has 5 Interconnected Days */}
                <div className="rounded-xl border border-[#f59e0b]/40 bg-[#fef9c3] px-3 py-2 text-[#78350f]">
                  <h3 className="text-xs font-black sm:text-sm">
                    {d.fullMissionTitle}
                  </h3>
                  <p className="mt-0.5 text-[11px] leading-snug font-semibold sm:text-xs">
                    {d.fullMissionDesc}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Footer Actions */}
          <div className="flex flex-none flex-wrap items-center justify-between gap-2 border-t border-[#cbd5e1] bg-white px-3 py-2 sm:px-5 sm:py-2.5">
            {!submitted ? (
              <>
                <button
                  type="button"
                  onClick={onBackToWelcome}
                  className="flex min-h-[42px] items-center gap-1.5 rounded-xl border border-[#94a3b8] bg-white px-3.5 py-1.5 text-xs font-extrabold text-[#334155] transition hover:bg-[#f1f5f9] active:scale-95"
                >
                  <span>{d.backBtn}</span>
                </button>
                <button
                  type="button"
                  disabled={selectedOption === null}
                  onClick={onSubmitDecision}
                  className="flex min-h-[42px] items-center gap-2 rounded-xl border-2 border-[#08265b] bg-[#facc15] px-5 py-1.5 text-xs font-black text-[#08265b] shadow-[0_3px_0_#08265b] transition hover:bg-[#fde047] active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-45 sm:text-sm"
                >
                  <span>{d.confirmBtn}</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onRetryDemo}
                  className="flex min-h-[42px] items-center gap-1.5 rounded-xl border-2 border-[#00d2e0] bg-[#e0f7ff] px-4 py-1.5 text-xs font-black text-[#08265b] transition hover:bg-[#bae6fd] active:scale-95 sm:text-sm"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{d.retryBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={onBackToWelcome}
                  className="flex min-h-[42px] items-center gap-1.5 rounded-xl border-2 border-[#08265b] bg-[#08265b] px-4 py-1.5 text-xs font-black text-white transition hover:bg-[#0f3880] active:scale-95 sm:text-sm"
                >
                  <span>{d.backBtn}</span>
                </button>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};
