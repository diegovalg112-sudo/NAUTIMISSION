import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  Gamepad2,
  Lightbulb,
  Pause,
  Radio,
  Rocket,
  RotateCcw,
  Star,
  Trophy,
} from 'lucide-react';
import type { AppLang, StatKey } from '../data/missionData';
import { UI_STRINGS } from '../data/uiStrings';
import { INITIAL_RESOURCES, THRESHOLDS } from '../utils/missionEngine';
import { TOTAL_TUTORIAL_STEPS } from '../utils/tutorialProgress';
import { playUiTone } from '../utils/soundFx';
import {
  AguaStickerIcon,
  EnergiaStickerIcon,
  SaludStickerIcon,
} from './ResourceStickers';

interface TutorialExperienceProps {
  lang: AppLang;
  step: number;
  tutorialCompleted: boolean;
  practiceCompleted: boolean;
  sfxEnabled: boolean;
  isSpeaking: boolean;
  onStepChange: (nextStep: number) => void;
  onPracticeCompleted: () => void;
  onCompleteAndExplore: () => void;
  onPauseTutorial: () => void;
  onHighlightStat: (stat: StatKey | 'science' | 'research' | null) => void;
}

type PreviewDeltas = {
  energy: number;
  water: number;
  health: number;
  research: number;
};

const ZERO_DELTAS: PreviewDeltas = {
  energy: 0,
  water: 0,
  health: 0,
  research: 0,
};

function formatSignedDelta(value: number): string {
  if (value > 0) return `+${value}`;
  if (value < 0) return `−${Math.abs(value)}`;
  return '0';
}

export const TutorialExperience: React.FC<TutorialExperienceProps> = ({
  lang,
  step,
  tutorialCompleted,
  practiceCompleted,
  sfxEnabled,
  isSpeaking,
  onStepChange,
  onPracticeCompleted,
  onCompleteAndExplore,
  onPauseTutorial,
  onHighlightStat,
}) => {
  const t = UI_STRINGS[lang];
  const ob = t.tutorialOnboarding;
  const pr = ob.practice;

  // Section 1: Sandbox animated indicator demo (strictly isolated from real mission state)
  const [previewDeltas, setPreviewDeltas] = useState<PreviewDeltas>(ZERO_DELTAS);
  const [activeDemoPreset, setActiveDemoPreset] = useState<'none' | 'lab' | 'care'>('none');

  // Section 3: Collapsible NASA Scientific Help 3-part summary
  const [helpPreviewOpen, setHelpPreviewOpen] = useState<boolean>(false);

  // Step 5: Isolated 5-step interactive practice state
  const [practiceStage, setPracticeStage] = useState<number>(
    practiceCompleted ? 5 : 1,
  );
  const [practiceFeedback, setPracticeFeedback] = useState<{
    tone: 'ok' | 'hint';
    text: string;
  } | null>(null);
  const [chosenSampleIdx, setChosenSampleIdx] = useState<number | null>(null);
  const [practiceModelShown, setPracticeModelShown] = useState<boolean>(false);

  useEffect(() => {
    if (practiceCompleted && practiceStage < 5) {
      setPracticeStage(5);
    }
  }, [practiceCompleted, practiceStage]);

  useEffect(() => {
    setPracticeFeedback(null);
  }, [step]);

  const badgeText =
    ob.sectionBadges[step] ?? t.stepProgressLabel(step + 1, TOTAL_TUTORIAL_STEPS);

  const previewValues = {
    energy: INITIAL_RESOURCES.energy + previewDeltas.energy,
    water: INITIAL_RESOURCES.water + previewDeltas.water,
    health: INITIAL_RESOURCES.health + previewDeltas.health,
    research: INITIAL_RESOURCES.research + previewDeltas.research,
  };

  const applyDemoPreset = (preset: 'none' | 'lab' | 'care') => {
    playUiTone(preset === 'none' ? 'tap' : 'science', sfxEnabled, isSpeaking);
    setActiveDemoPreset(preset);
    if (preset === 'lab') {
      setPreviewDeltas({ energy: -10, water: 0, health: 0, research: 3 });
      onHighlightStat('research');
    } else if (preset === 'care') {
      setPreviewDeltas({ energy: -5, water: 2, health: 6, research: 0 });
      onHighlightStat('salud');
    } else {
      setPreviewDeltas(ZERO_DELTAS);
      onHighlightStat(null);
    }
  };

  // Practice handlers (isolated from game engine & science points)
  const handlePracticeIdentifyIndicator = (key: 'energy' | 'water' | 'health' | 'research') => {
    if (key === 'water') {
      playUiTone('success', sfxEnabled, isSpeaking);
      setPracticeFeedback({ tone: 'ok', text: pr.step1Success });
      onHighlightStat('agua');
      if (practiceStage < 2) setPracticeStage(2);
    } else {
      playUiTone('tap', sfxEnabled, isSpeaking);
      setPracticeFeedback({ tone: 'hint', text: pr.step1Wrong });
      onHighlightStat(key === 'energy' ? 'energia' : key === 'health' ? 'salud' : 'research');
    }
  };

  const handlePracticeSelectOption = (idx: number) => {
    playUiTone('tap', sfxEnabled, isSpeaking);
    setChosenSampleIdx(idx);
    setPracticeModelShown(false);
    setPracticeFeedback({ tone: 'ok', text: pr.step2Success });
    if (practiceStage < 3) setPracticeStage(3);
  };

  const handlePracticeModel = () => {
    if (chosenSampleIdx === null) return;
    playUiTone('science', sfxEnabled, isSpeaking);
    setPracticeModelShown(true);
    setPracticeFeedback({ tone: 'ok', text: pr.step3Success });
    if (practiceStage < 4) setPracticeStage(4);
  };

  const handlePracticeConfirmButton = (btn: 'help' | 'model' | 'confirm') => {
    if (btn === 'confirm') {
      playUiTone('success', sfxEnabled, isSpeaking);
      setPracticeFeedback({ tone: 'ok', text: pr.step4Success });
      if (practiceStage < 5) setPracticeStage(5);
    } else {
      playUiTone('tap', sfxEnabled, isSpeaking);
      setPracticeFeedback({ tone: 'hint', text: pr.step4Wrong });
    }
  };

  const handlePracticeConsequence = (choiceIdx: number) => {
    if (choiceIdx === 0) {
      playUiTone('success', sfxEnabled, isSpeaking);
      setPracticeFeedback({ tone: 'ok', text: pr.step5Success });
      onPracticeCompleted();
    } else {
      playUiTone('tap', sfxEnabled, isSpeaking);
      setPracticeFeedback({ tone: 'hint', text: pr.step5Wrong });
    }
  };

  const canAdvance = step < 5 || practiceCompleted;
  const donePracticeCount = practiceCompleted
    ? 5
    : Math.max(0, practiceStage - 1);

  return (
    <div className="flex h-full flex-col justify-between p-2.5 sm:p-4">
      {/* Top Progress Header */}
      <div className="mb-2 flex flex-none flex-wrap items-center justify-between gap-2 border-b border-[#d6eef7] pb-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="inline-block rounded-full bg-[#facc15] px-2.5 py-0.5 text-[10px] font-black tracking-wide text-[#08265b] uppercase">
            {badgeText}
          </span>
          <span className="hidden text-[11px] font-bold text-[#007e99] sm:inline">
            {tutorialCompleted ? ob.reviewBadge : ob.mandatoryBadge}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={TOTAL_TUTORIAL_STEPS}
            aria-valuenow={step + 1}
            aria-label={t.stepProgressLabel(step + 1, TOTAL_TUTORIAL_STEPS)}
          >
            {Array.from({ length: TOTAL_TUTORIAL_STEPS }).map((_, idx) => {
              const reached = idx <= step;
              const canJump = tutorialCompleted || idx <= step;
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={!canJump}
                  onClick={() => {
                    if (!canJump) return;
                    playUiTone('tap', sfxEnabled, isSpeaking);
                    onHighlightStat(null);
                    onStepChange(idx);
                  }}
                  aria-label={t.stepProgressLabel(idx + 1, TOTAL_TUTORIAL_STEPS)}
                  className={`h-2.5 rounded-full border border-[#08265b]/20 transition-all ${
                    idx === step
                      ? 'w-6 bg-[#08265b]'
                      : reached
                        ? 'w-4 bg-[#00d2e0]'
                        : 'w-3.5 bg-[#d9eef7]'
                  } disabled:cursor-default`}
                />
              );
            })}
          </div>

          <span className="tabular-nums text-[11px] font-black text-[#08265b]">
            {step + 1}/{TOTAL_TUTORIAL_STEPS}
          </span>

          <button
            type="button"
            onClick={onPauseTutorial}
            title={ob.pauseTooltip}
            className="inline-flex min-h-[30px] items-center gap-1 rounded-lg border border-[#00d2e0]/60 bg-[#e6f7fc] px-2 py-0.5 text-[11px] font-black text-[#006e8a] transition hover:bg-[#bae6fd] active:scale-95"
          >
            <Pause className="h-3 w-3" aria-hidden="true" />
            <span>{t.pauseTutorialBtn}</span>
          </button>
        </div>
      </div>

      {/* Main Scrollable Content Bay */}
      <div className="cockpit-scroll min-h-0 flex-1 overflow-y-auto pr-1">
        {/* SECTION 1 — INDICATORS */}
        {step === 0 && (
          <div className="space-y-2.5">
            <h1 className="text-base leading-tight font-black text-[#08265b] sm:text-xl">
              {ob.section1.title}
            </h1>
            <p className="whitespace-pre-line text-xs leading-snug font-semibold text-[#15385e] sm:text-[13px]">
              {ob.section1.intro}
            </p>

            {/* Four Resource Cards with Actual Game Values & Animated Test Bars */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {[
                {
                  key: 'energy' as const,
                  hudKey: 'energia' as const,
                  label: t.hudEnergy,
                  desc: t.tutEnergyDesc,
                  val: previewValues.energy,
                  delta: previewDeltas.energy,
                  max: 100,
                  cardTone: 'border-[#eab308] bg-[#fef9c3]',
                  barTone: 'bg-[#eab308]',
                  textTone: 'text-[#713f12]',
                  Icon: EnergiaStickerIcon,
                },
                {
                  key: 'water' as const,
                  hudKey: 'agua' as const,
                  label: t.hudWater,
                  desc: t.tutWaterDesc,
                  val: previewValues.water,
                  delta: previewDeltas.water,
                  max: 100,
                  cardTone: 'border-[#0ea5e9] bg-[#e0f2fe]',
                  barTone: 'bg-[#0284c7]',
                  textTone: 'text-[#0c4a6e]',
                  Icon: AguaStickerIcon,
                },
                {
                  key: 'health' as const,
                  hudKey: 'salud' as const,
                  label: t.hudHealth,
                  desc: t.tutHealthDesc,
                  val: previewValues.health,
                  delta: previewDeltas.health,
                  max: 100,
                  cardTone: 'border-[#22c55e] bg-[#dcfce7]',
                  barTone: 'bg-[#16a34a]',
                  textTone: 'text-[#14532d]',
                  Icon: SaludStickerIcon,
                },
                {
                  key: 'research' as const,
                  hudKey: 'research' as const,
                  label: t.researchFullLabel,
                  desc: t.tutResearchDesc,
                  val: previewValues.research,
                  delta: previewDeltas.research,
                  max: 100,
                  goal: THRESHOLDS.researchGoal,
                  cardTone: 'border-[#00d2e0] bg-[#ecfeff]',
                  barTone: 'bg-[#0891b2]',
                  textTone: 'text-[#164e63]',
                  Icon: Radio,
                },
              ].map((ind) => {
                const Icon = ind.Icon;
                return (
                  <button
                    key={ind.key}
                    type="button"
                    onClick={() => {
                      playUiTone('tap', sfxEnabled, isSpeaking);
                      onHighlightStat(ind.hudKey);
                    }}
                    className={`rounded-xl border-2 p-2.5 text-left shadow-[0_2px_0_rgba(8,38,91,0.12)] transition active:translate-y-[1px] ${ind.cardTone}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Icon className="h-5 w-5 flex-none text-[#08265b]" />
                        <span className="text-xs font-black text-[#08265b] sm:text-sm">
                          {ind.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 tabular-nums">
                        {ind.delta !== 0 && (
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-black ${
                              ind.delta > 0
                                ? 'bg-[#16a34a] text-white'
                                : 'bg-[#e11d48] text-white'
                            }`}
                          >
                            {formatSignedDelta(ind.delta)}
                          </span>
                        )}
                        <span className="rounded bg-white/90 px-1.5 py-0.5 text-[11px] font-black text-[#08265b]">
                          {ind.val}
                          {ind.goal ? `/${ind.goal}` : ''}
                        </span>
                      </div>
                    </div>
                    <p className={`mt-1 text-[11px] leading-snug font-bold ${ind.textTone}`}>
                      {ind.desc}
                    </p>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/85">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${ind.barTone}`}
                        style={{ width: `${Math.min(100, Math.max(0, ind.val))}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Interactive Animated Example Controls (Isolated) */}
            <div className="rounded-xl border-2 border-[#00d2e0]/60 bg-white p-2.5 shadow-[0_2px_0_#bae6fd]">
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <span className="text-[11px] font-black text-[#007e99]">
                  {ob.section1.demoTitle}
                </span>
                <span className="text-[10px] font-bold text-[#52708b]">
                  {ob.section1.initialLabel}: 50 · {ob.section1.goalLabel} ({t.researchFullLabel}): {THRESHOLDS.researchGoal}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => applyDemoPreset('lab')}
                  className={`min-h-[34px] rounded-lg border px-2.5 py-1 text-[11px] font-extrabold transition ${
                    activeDemoPreset === 'lab'
                      ? 'border-[#08265b] bg-[#08265b] text-[#facc15]'
                      : 'border-[#bae6fd] bg-[#f0f9ff] text-[#08265b] hover:bg-[#e0f2fe]'
                  }`}
                >
                  {ob.section1.demoLabBtn}
                </button>
                <button
                  type="button"
                  onClick={() => applyDemoPreset('care')}
                  className={`min-h-[34px] rounded-lg border px-2.5 py-1 text-[11px] font-extrabold transition ${
                    activeDemoPreset === 'care'
                      ? 'border-[#08265b] bg-[#08265b] text-[#4ade80]'
                      : 'border-[#bbf7d0] bg-[#f0fdf4] text-[#08265b] hover:bg-[#dcfce7]'
                  }`}
                >
                  {ob.section1.demoCareBtn}
                </button>
                <button
                  type="button"
                  onClick={() => applyDemoPreset('none')}
                  className="inline-flex min-h-[34px] items-center gap-1 rounded-lg border border-[#cbd5e1] bg-[#f8fafc] px-2.5 py-1 text-[11px] font-extrabold text-[#334155] hover:bg-[#e2e8f0]"
                >
                  <RotateCcw className="h-3 w-3" aria-hidden="true" />
                  <span>{ob.section1.demoResetBtn}</span>
                </button>
              </div>
              <p className="mt-1 text-[10px] font-semibold text-[#52708b]">
                {ob.section1.demoNote}
              </p>
            </div>
          </div>
        )}

        {/* SECTION 2 — SCIENCE POINTS */}
        {step === 1 && (
          <div className="space-y-2.5">
            <h1 className="text-base leading-tight font-black text-[#08265b] sm:text-xl">
              {ob.section2.title}
            </h1>
            <p className="whitespace-pre-line text-xs leading-snug font-semibold text-[#15385e] sm:text-[13px]">
              {ob.section2.intro}
            </p>

            <div className="grid gap-2.5 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  playUiTone('tap', sfxEnabled, isSpeaking);
                  onHighlightStat('research');
                }}
                className="flex flex-col justify-between rounded-xl border-2 border-[#00d2e0] bg-[#ecfeff] p-3 text-left shadow-[0_3px_0_#a5f3fc] transition active:translate-y-[1px]"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Radio className="h-5 w-5 text-[#0891b2]" aria-hidden="true" />
                    <span className="text-xs font-black text-[#08265b] sm:text-sm">
                      {ob.section2.researchCardTitle}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-snug font-semibold text-[#15385e]">
                    {ob.section2.researchCardDesc}
                  </p>
                </div>
                <span className="mt-2 inline-block self-start rounded-lg bg-[#08265b] px-2.5 py-1 text-[11px] font-black text-[#34f0fa] tabular-nums">
                  {ob.section2.researchCardValue}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playUiTone('science', sfxEnabled, isSpeaking);
                  onHighlightStat('science');
                }}
                className="flex flex-col justify-between rounded-xl border-2 border-[#facc15] bg-[#fef9c3] p-3 text-left shadow-[0_3px_0_#eab308] transition active:translate-y-[1px]"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-[#f59e0b] text-[#b45309]" aria-hidden="true" />
                    <span className="text-xs font-black text-[#08265b] sm:text-sm">
                      {ob.section2.scienceCardTitle}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-snug font-semibold text-[#713f12]">
                    {ob.section2.scienceCardDesc}
                  </p>
                </div>
                <span className="mt-2 inline-block self-start rounded-lg bg-[#08265b] px-2.5 py-1 text-[11px] font-black text-[#fde047] tabular-nums">
                  {ob.section2.scienceCardValue}
                </span>
              </button>
            </div>

            <div className="flex items-start gap-2 rounded-xl border-2 border-[#08265b]/20 bg-white p-2.5 text-xs font-bold text-[#08265b]">
              <FlaskConical className="mt-0.5 h-4 w-4 flex-none text-[#d97706]" aria-hidden="true" />
              <span>{ob.section2.earnRuleNote}</span>
            </div>
          </div>
        )}

        {/* SECTION 3 — DECISION BUTTONS, MODELAR & GAMEPLAY TOOLS */}
        {step === 2 && (
          <div className="space-y-2.5">
            <h1 className="flex items-center gap-2 text-base leading-tight font-black text-[#08265b] sm:text-xl">
              <Gamepad2 className="h-5 w-5 flex-none text-[#007e99]" aria-hidden="true" />
              <span>{ob.section3.title}</span>
            </h1>

            <div className="grid gap-2 sm:grid-cols-3">
              <div className="rounded-xl border-2 border-[#bae6fd] bg-white p-2.5 shadow-[0_2px_0_#d7ebf5]">
                <span className="inline-block rounded bg-[#e0f2fe] px-2 py-0.5 text-[10px] font-black text-[#0369a1]">
                  1
                </span>
                <h2 className="mt-1 text-xs font-black text-[#08265b]">
                  {ob.section3.selectTitle}
                </h2>
                <p className="mt-0.5 text-[11px] leading-snug font-semibold text-[#15385e]">
                  {ob.section3.selectBody}
                </p>
              </div>

              <div className="rounded-xl border-2 border-[#facc15] bg-[#fefce8] p-2.5 shadow-[0_2px_0_#eab308]/50">
                <span className="inline-flex items-center gap-1 rounded bg-[#facc15] px-2 py-0.5 text-[10px] font-black text-[#08265b]">
                  <FlaskConical className="h-3 w-3" aria-hidden="true" />
                  2 · {ob.section3.modelTitle}
                </span>
                <p className="mt-1 whitespace-pre-line text-[11px] leading-snug font-semibold text-[#713f12]">
                  {ob.section3.modelBody}
                </p>
              </div>

              <div className="rounded-xl border-2 border-[#4ade80] bg-[#f0fdf4] p-2.5 shadow-[0_2px_0_#86efac]">
                <span className="inline-block rounded bg-[#16a34a] px-2 py-0.5 text-[10px] font-black text-white">
                  3
                </span>
                <h2 className="mt-1 text-xs font-black text-[#08265b]">
                  {ob.section3.confirmTitle}
                </h2>
                <p className="mt-0.5 text-[11px] leading-snug font-semibold text-[#14532d]">
                  {ob.section3.confirmBody}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-xl border-2 border-[#f59e0b]/70 bg-[#fffbeb] px-3 py-2 text-[11px] font-extrabold text-[#78350f] sm:text-xs">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-none text-[#d97706]" aria-hidden="true" />
              <span>{ob.section3.importantWarning}</span>
            </div>

            {/* Other real gameplay buttons */}
            <div className="rounded-xl border border-[#bae6fd] bg-white p-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-[11px] font-black tracking-wide text-[#007e99] uppercase">
                  {ob.section3.otherToolsTitle}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    playUiTone('science', sfxEnabled, isSpeaking);
                    setHelpPreviewOpen((v) => !v);
                  }}
                  className="inline-flex items-center gap-1 rounded-lg bg-[#e0f7ff] px-2 py-1 text-[10px] font-black text-[#006e8a] hover:bg-[#bae6fd]"
                >
                  <Lightbulb className="h-3 w-3" aria-hidden="true" />
                  <span>{ob.section3.toggleHelpPreviewBtn}</span>
                  {helpPreviewOpen ? (
                    <ChevronUp className="h-3 w-3" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="h-3 w-3" aria-hidden="true" />
                  )}
                </button>
              </div>

              <div className="mt-1.5 grid gap-1.5 sm:grid-cols-2">
                {ob.section3.otherTools.map((tool, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-[#e2f1f8] bg-[#f8fcfe] px-2.5 py-1.5"
                  >
                    <span className="block text-[11px] font-black text-[#08265b]">
                      {tool.label}
                    </span>
                    <span className="block text-[11px] leading-snug font-semibold text-[#334155]">
                      {tool.desc}
                    </span>
                  </div>
                ))}
              </div>

              {helpPreviewOpen && (
                <div className="mt-2 rounded-xl border-2 border-[#00d2e0] bg-[#f0f9ff] p-2.5">
                  <p className="text-xs font-black text-[#007e99]">
                    {t.tutHelpGuide.heading}
                  </p>
                  <div className="mt-1.5 grid gap-1.5 sm:grid-cols-3">
                    {t.tutHelpGuide.parts.map((part, idx) => (
                      <div key={idx} className="rounded-lg border border-[#bae6fd] bg-white p-2">
                        <p className="text-[11px] font-black text-[#08265b]">{part.title}</p>
                        <p className="mt-0.5 text-[10px] leading-snug font-semibold text-[#15385e]">
                          {part.description}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-1.5 text-[11px] font-extrabold text-[#08265b]">
                    {t.tutHelpGuide.finalReminder}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SECTION 4 — SCIENTIFIC TRIVIA */}
        {step === 3 && (
          <div className="space-y-2.5">
            <h1 className="flex items-center gap-2 text-base leading-tight font-black text-[#08265b] sm:text-xl">
              <Brain className="h-5 w-5 flex-none text-[#007e99]" aria-hidden="true" />
              <span>{ob.section4.title}</span>
            </h1>
            <p className="whitespace-pre-line text-xs leading-snug font-semibold text-[#15385e] sm:text-[13px]">
              {ob.section4.intro}
            </p>

            <div className="grid gap-2 sm:grid-cols-2">
              {ob.section4.cards.map((card, idx) => {
                const styles = [
                  'border-[#7dd3fc] bg-white',
                  'border-[#00d2e0] bg-[#ecfeff]',
                  'border-[#22c55e] bg-[#f0fdf4]',
                  'border-[#fde047] bg-[#fefce8]',
                ];
                return (
                  <div
                    key={idx}
                    className={`rounded-xl border-2 p-2.5 shadow-[0_2px_0_rgba(8,38,91,0.08)] ${styles[idx] ?? 'border-[#bae6fd] bg-white'}`}
                  >
                    <h2 className="flex items-center gap-1.5 text-xs font-black text-[#08265b]">
                      {idx === 1 && <BookOpen className="h-3.5 w-3.5 text-[#0891b2]" aria-hidden="true" />}
                      {idx === 2 && <Star className="h-3.5 w-3.5 fill-[#facc15] text-[#ca8a04]" aria-hidden="true" />}
                      <span>{card.heading}</span>
                    </h2>
                    <p className="mt-1 text-[11px] leading-snug font-semibold text-[#15385e]">
                      {card.body}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="rounded-xl bg-[#08265b] px-3 py-2 text-[11px] leading-snug font-extrabold text-[#fef08a] sm:text-xs">
              {ob.section4.distinctionBanner}
            </div>
          </div>
        )}

        {/* SECTION 5 — HOW TO WIN OR LOSE */}
        {step === 4 && (
          <div className="space-y-2.5">
            <h1 className="flex items-center gap-2 text-base leading-tight font-black text-[#08265b] sm:text-xl">
              <Trophy className="h-5 w-5 flex-none text-[#d97706]" aria-hidden="true" />
              <span>{ob.section5.title}</span>
            </h1>
            <p className="text-xs leading-snug font-bold text-[#15385e] sm:text-[13px]">
              {ob.section5.objectiveText}
            </p>

            <div className="grid gap-2 sm:grid-cols-2">
              {ob.section5.rules.map((rule, idx) => {
                const toneMap = {
                  success: 'border-[#22c55e] bg-[#f0fdf4] text-[#14532d]',
                  danger: 'border-[#ff5c6c] bg-[#fff1f2] text-[#881337]',
                  warning: 'border-[#f59e0b] bg-[#fffbeb] text-[#78350f]',
                  info: 'border-[#00d2e0] bg-[#ecfeff] text-[#164e63]',
                } as const;
                const badgeMap = {
                  success: 'bg-[#16a34a] text-white',
                  danger: 'bg-[#e11d48] text-white',
                  warning: 'bg-[#d97706] text-white',
                  info: 'bg-[#08265b] text-[#34f0fa]',
                } as const;
                const tone =
                  rule.tone === 'success' ||
                  rule.tone === 'danger' ||
                  rule.tone === 'warning' ||
                  rule.tone === 'info'
                    ? rule.tone
                    : 'info';
                return (
                  <div
                    key={idx}
                    className={`rounded-xl border-2 p-2.5 ${toneMap[tone]}`}
                  >
                    <span
                      className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-black uppercase ${badgeMap[tone]}`}
                    >
                      {rule.badge}
                    </span>
                    <p className="mt-1 text-[11px] leading-snug font-bold">
                      {rule.body}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="rounded-xl border-2 border-[#08265b]/25 bg-white px-3 py-2 text-[11px] font-extrabold text-[#08265b] sm:text-xs">
              {ob.section5.triviaReminder}
            </div>
          </div>
        )}

        {/* SHORT INTERACTIVE PRACTICE (5 guided mini-steps, isolated from mission) */}
        {step === 5 && (
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h1 className="text-base leading-tight font-black text-[#08265b] sm:text-lg">
                  {pr.title}
                </h1>
                <p className="mt-0.5 text-[11px] font-semibold text-[#52708b]">
                  {pr.subtitle}
                </p>
              </div>
              <span className="tabular-nums rounded-full bg-[#08265b] px-2.5 py-0.5 text-[11px] font-black text-[#fde047]">
                {t.formatPracticeProgressChip(donePracticeCount)}
              </span>
            </div>

            {practiceFeedback && (
              <div
                role="status"
                className={`rounded-xl border-2 px-3 py-1.5 text-xs font-extrabold ${
                  practiceFeedback.tone === 'ok'
                    ? 'border-[#22c55e] bg-[#dcfce7] text-[#14532d]'
                    : 'border-[#facc15] bg-[#fef9c3] text-[#713f12]'
                }`}
              >
                {practiceFeedback.text}
              </div>
            )}

            {/* Mini-step 1: Identify resource indicator */}
            <div
              className={`rounded-xl border-2 p-2.5 transition ${
                practiceStage > 1
                  ? 'border-[#4ade80] bg-[#f0fdf4]'
                  : 'border-[#00d2e0] bg-white'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-black text-[#08265b]">{pr.step1Prompt}</p>
                {practiceStage > 1 && (
                  <CheckCircle2 className="h-4 w-4 flex-none text-[#16a34a]" aria-hidden="true" />
                )}
              </div>
              {practiceStage === 1 && (
                <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                  {[
                    { key: 'energy' as const, label: t.hudEnergy, Icon: EnergiaStickerIcon },
                    { key: 'water' as const, label: t.hudWater, Icon: AguaStickerIcon },
                    { key: 'health' as const, label: t.hudHealth, Icon: SaludStickerIcon },
                    { key: 'research' as const, label: t.researchFullLabel, Icon: Radio },
                  ].map(({ key, label, Icon }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handlePracticeIdentifyIndicator(key)}
                      className="flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl border-2 border-[#bae6fd] bg-[#f8fcfe] px-2.5 py-1.5 text-xs font-black text-[#08265b] transition hover:border-[#00d2e0] hover:bg-[#e0f7ff] active:scale-95"
                    >
                      <Icon className="h-4 w-4 flex-none" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mini-step 2: Select a sample decision */}
            {practiceStage >= 2 && (
              <div
                className={`rounded-xl border-2 p-2.5 transition ${
                  practiceStage > 2
                    ? 'border-[#4ade80] bg-[#f0fdf4]'
                    : 'border-[#00d2e0] bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-black text-[#08265b]">{pr.step2Prompt}</p>
                  {practiceStage > 2 && (
                    <CheckCircle2 className="h-4 w-4 flex-none text-[#16a34a]" aria-hidden="true" />
                  )}
                </div>
                <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
                  {pr.step2Options.map((opt, idx) => {
                    const selected = chosenSampleIdx === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handlePracticeSelectOption(idx)}
                        className={`rounded-xl border-2 p-2 text-left transition ${
                          selected
                            ? 'border-[#08265b] bg-[#d9f8fc] text-[#08265b]'
                            : 'border-[#bae6fd] bg-[#f8fcfe] text-[#15385e] hover:border-[#00d2e0]'
                        }`}
                      >
                        <span className="block text-xs font-black">
                          {'AB'[idx]}. {opt.title}
                        </span>
                        <span className="mt-0.5 block text-[11px] leading-snug font-semibold">
                          {opt.summary}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mini-step 3: Observe MODELAR demonstration */}
            {practiceStage >= 3 && chosenSampleIdx !== null && (
              <div
                className={`rounded-xl border-2 p-2.5 transition ${
                  practiceStage > 3
                    ? 'border-[#4ade80] bg-[#f0fdf4]'
                    : 'border-[#facc15] bg-[#fefce8]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-black text-[#08265b]">{pr.step3Prompt}</p>
                  {practiceStage > 3 && (
                    <CheckCircle2 className="h-4 w-4 flex-none text-[#16a34a]" aria-hidden="true" />
                  )}
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePracticeModel}
                    className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-[#facc15] px-3.5 py-1.5 text-xs font-black text-[#08265b] shadow-[0_2px_0_#b45309] transition hover:bg-[#fde047]"
                  >
                    <FlaskConical className="h-4 w-4" aria-hidden="true" />
                    <span>{pr.step3Btn}</span>
                  </button>
                </div>
                {practiceModelShown && (
                  <p className="mt-1.5 rounded-lg border border-[#eab308] bg-white px-2.5 py-1.5 text-[11px] font-bold text-[#713f12]">
                    {pr.step2Options[chosenSampleIdx]?.forecast}
                  </p>
                )}
              </div>
            )}

            {/* Mini-step 4: Identify confirm button */}
            {practiceStage >= 4 && (
              <div
                className={`rounded-xl border-2 p-2.5 transition ${
                  practiceStage > 4
                    ? 'border-[#4ade80] bg-[#f0fdf4]'
                    : 'border-[#00d2e0] bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-black text-[#08265b]">{pr.step4Prompt}</p>
                  {practiceStage > 4 && (
                    <CheckCircle2 className="h-4 w-4 flex-none text-[#16a34a]" aria-hidden="true" />
                  )}
                </div>
                {practiceStage === 4 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handlePracticeConfirmButton('help')}
                      className="min-h-[40px] rounded-xl bg-[#00d2e0] px-3 py-1.5 text-xs font-black text-[#08265b]"
                    >
                      {pr.step4Buttons.help}
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePracticeConfirmButton('model')}
                      className="min-h-[40px] rounded-xl border-2 border-[#08265b]/25 bg-white px-3 py-1.5 text-xs font-black text-[#08265b]"
                    >
                      {pr.step4Buttons.model}
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePracticeConfirmButton('confirm')}
                      className="min-h-[40px] rounded-xl bg-[#facc15] px-4 py-1.5 text-xs font-black text-[#08265b] shadow-[0_2px_0_#b45309]"
                    >
                      {pr.step4Buttons.confirm}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mini-step 5: Recognize consequence */}
            {practiceStage >= 5 && (
              <div
                className={`rounded-xl border-2 p-2.5 transition ${
                  practiceCompleted
                    ? 'border-[#22c55e] bg-[#dcfce7]'
                    : 'border-[#00d2e0] bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-black text-[#08265b]">{pr.step5Prompt}</p>
                  {practiceCompleted && (
                    <CheckCircle2 className="h-4 w-4 flex-none text-[#16a34a]" aria-hidden="true" />
                  )}
                </div>
                <p className="mt-1 text-[11px] font-bold text-[#15385e]">
                  {pr.step5Question}
                </p>
                {!practiceCompleted ? (
                  <div className="mt-1.5 grid gap-1.5">
                    {pr.step5Choices.map((choice, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handlePracticeConsequence(idx)}
                        className="min-h-[40px] rounded-xl border-2 border-[#bae6fd] bg-[#f8fcfe] px-3 py-1.5 text-left text-[11px] font-extrabold text-[#08265b] hover:border-[#00d2e0] hover:bg-[#e0f7ff]"
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="mt-1.5 text-xs font-black text-[#14532d]">
                    {pr.completedBanner}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* COMPLETION SCREEN */}
        {step === 6 && (
          <div className="flex h-full flex-col justify-center">
            <div className="rounded-2xl border-2 border-[#facc15] bg-white p-4 shadow-[0_4px_0_#eab308]/60 sm:p-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl bg-[#08265b] text-[#facc15]">
                  <Rocket className="h-5 w-5" aria-hidden="true" />
                </div>
                <h1 className="text-lg font-black text-[#08265b] sm:text-2xl">
                  {ob.completion.title}
                </h1>
              </div>

              <div className="mt-3 space-y-2 text-xs leading-relaxed font-semibold text-[#15385e] sm:text-sm">
                {ob.completion.paragraphs.map((p, idx) => (
                  <p
                    key={idx}
                    className={
                      idx === ob.completion.paragraphs.length - 1
                        ? 'pt-1 font-black text-[#08265b]'
                        : undefined
                    }
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sticky Navigation Footer */}
      <div className="mt-2 flex flex-none items-center justify-between gap-2 border-t border-[#d6eef7] pt-2">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => {
              playUiTone('tap', sfxEnabled, false);
              onHighlightStat(null);
              onStepChange(step - 1);
            }}
            className="flex min-h-[42px] items-center gap-1.5 rounded-xl bg-[#dff2f8] px-4 py-2 text-xs font-extrabold text-[#08265b] shadow-[0_2px_0_#b6dceb] hover:bg-[#cbe7f2] active:translate-y-[1px]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>{t.prev}</span>
          </button>
        ) : (
          <span className="text-[11px] font-bold text-[#52708b]">
            {t.stepProgressLabel(1, TOTAL_TUTORIAL_STEPS)}
          </span>
        )}

        {step < 6 ? (
          <button
            type="button"
            disabled={!canAdvance}
            onClick={() => {
              if (!canAdvance) return;
              playUiTone('confirm', sfxEnabled, false);
              onHighlightStat(null);
              onStepChange(step + 1);
            }}
            className="flex min-h-[42px] items-center gap-2 rounded-xl bg-[#facc15] px-5 py-2 text-xs font-black text-[#08265b] shadow-[0_3px_0_#b45309] transition hover:bg-[#fde047] active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-45 sm:text-sm"
          >
            <span>{step === 5 ? pr.finishPracticeBtn : t.continueBtn}</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              playUiTone('success', sfxEnabled, false);
              onCompleteAndExplore();
            }}
            className="flex min-h-[44px] items-center gap-2 rounded-xl bg-[#facc15] px-5 py-2 text-xs font-black text-[#08265b] shadow-[0_3px_0_#b45309] transition hover:bg-[#fde047] active:translate-y-[1px] sm:text-sm"
          >
            <span>{ob.completion.primaryBtn}</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
};
