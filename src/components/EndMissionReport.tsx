import React from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Download,
  FlaskConical,
  History,
  Home,
  MessageSquare,
  Radio,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import {
  formatSigned,
  getDecisionTitleById,
  getDelayedConsequenceContent,
  getMissionContent,
  type AppLang,
  type OutcomeSpec,
} from '../data/missionData';
import { UI_STRINGS } from '../data/uiStrings';
import {
  THRESHOLDS,
  type DecisionHistoryRecord,
  type DelayedEffectCardRecord,
  type OutcomeId,
  type ResourceSnapshot,
  type Resources,
} from '../utils/missionEngine';
import {
  AguaStickerIcon,
  EnergiaStickerIcon,
  SaludStickerIcon,
} from './ResourceStickers';
import { FilomatasLogo } from './FilomatasLogo';
import { NautiLogo } from './NautiLogo';
import { ResourceEvolutionChart } from './ResourceEvolutionChart';

export type EndReportTab = 'outcome' | 'chart' | 'history' | 'reflection';

interface EndMissionReportProps {
  lang: AppLang;
  activeTab: EndReportTab;
  onChangeTab: (tab: EndReportTab) => void;
  outcomeId: OutcomeId;
  outcomeSpec: OutcomeSpec;
  resources: Resources;
  science: number;
  snapshots: ResourceSnapshot[];
  history: DecisionHistoryRecord[];
  delayedApplied: DelayedEffectCardRecord[];
  reflectionQuestions: [string, string, string];
  onDownloadLog: () => void;
  onReplayMission: () => void;
  onMainMenu: () => void;
}

const TAB_ORDER: EndReportTab[] = ['outcome', 'chart', 'history', 'reflection'];

export const EndMissionReport: React.FC<EndMissionReportProps> = ({
  lang,
  activeTab,
  onChangeTab,
  outcomeId,
  outcomeSpec,
  resources,
  science,
  snapshots,
  history,
  delayedApplied,
  reflectionQuestions,
  onDownloadLog,
  onReplayMission,
  onMainMenu,
}) => {
  const t = UI_STRINGS[lang];
  const currentTabIdx = TAB_ORDER.indexOf(activeTab);

  const isVictory = outcomeId === 'SUSTAINABLE_MISSION';
  const isDead = outcomeId === 'CRITICAL_FAILURE';

  const { causality } = getMissionContent(lang);

  const getCausalityDescription = (entry: DecisionHistoryRecord): string | null => {
    if (entry.decisionId === 'SCHEDULE_SCIENCE') {
      const usedInDay5 = history.some(
        (h) => h.day === 5 && h.decisionId === 'FINAL_RESEARCH',
      );
      return usedInDay5
        ? causality.scheduleScienceUsed
        : causality.scheduleScienceUnused;
    }

    if (entry.decisionId === 'CONSERVE_ENERGY') {
      return causality.conserveEnergy;
    }

    const matchingDelayed = delayedApplied.find(
      (d) => d.key === entry.decisionId,
    );
    if (matchingDelayed) {
      const content = getDelayedConsequenceContent(lang, matchingDelayed.key);
      if (content) return content.text;
    }

    if (entry.day === 5 && entry.specialRuleApplied) {
      return causality.finalResearchBonus;
    }

    return null;
  };

  return (
    <div className="flex h-full flex-col justify-between p-2.5 sm:p-4">
      {/* Top Tab Navigation Bar (Steps 10–15) */}
      <div className="mb-2 flex flex-none flex-wrap items-center justify-between gap-1.5 border-b border-[#d6eef7] pb-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#facc15] px-2.5 py-0.5 text-[10px] font-black tracking-wide text-[#08265b] uppercase">
          {isDead ? (
            <AlertTriangle className="h-3.5 w-3.5 text-[#be123c]" />
          ) : (
            <ShieldCheck className="h-3.5 w-3.5" />
          )}
          <span>{t.endBadge}</span>
        </div>

        <nav className="flex flex-wrap items-center gap-1" aria-label={t.endBadge}>
          {[
            { id: 'outcome' as const, label: t.endTabOutcome, Icon: ShieldCheck },
            { id: 'chart' as const, label: t.endTabChart, Icon: BarChart3 },
            { id: 'history' as const, label: t.endTabHistory, Icon: History },
            { id: 'reflection' as const, label: t.endTabReflection, Icon: MessageSquare },
          ].map(({ id, label, Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onChangeTab(id)}
                className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-black transition ${
                  active
                    ? 'border-[#08265b] bg-[#08265b] text-[#facc15] shadow-sm'
                    : 'border-[#bae6fd] bg-white text-[#15385e] hover:border-[#00d2e0] hover:bg-[#e6f7fc]'
                }`}
              >
                <Icon className="h-3 w-3" />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Scrollable Body */}
      <div className="cockpit-scroll min-h-0 flex-1 overflow-y-auto pr-1">
        {/* VIEW 1: OUTCOME & EVALUATION (Steps 10–11) */}
        {activeTab === 'outcome' && (
          <div className="space-y-2.5">
            <div
              className={`rounded-xl border-2 p-3 shadow-[0_2px_0_#d7ebf5] ${
                isVictory
                  ? 'border-[#22c55e] bg-[#f0fdf4]'
                  : isDead
                    ? 'border-[#ff5c6c] bg-[#fff1f2]'
                    : 'border-[#facc15] bg-white'
              }`}
            >
              <h1 className="text-lg leading-tight font-black text-[#08265b] sm:text-2xl">
                {outcomeSpec.title}
              </h1>
              <p className="mt-1 text-xs leading-relaxed font-semibold text-[#15385e] sm:text-sm">
                {outcomeSpec.story}
              </p>
            </div>

            {/* Final 5 Meter Cards */}
            <div className="grid grid-cols-5 gap-1.5">
              <div
                className={`rounded-xl border-2 p-2 text-center ${
                  resources.energy >= THRESHOLDS.sustainability
                    ? 'border-[#facc15] bg-[#fefce8]'
                    : 'border-[#ff5c6c] bg-[#fff1f2]'
                }`}
              >
                <EnergiaStickerIcon className="mx-auto h-4.5 w-4.5" />
                <span className="block text-[10px] font-extrabold text-[#52708b]">
                  {t.hudEnergy}
                </span>
                <span className="tabular-nums text-base font-black text-[#08265b]">
                  {resources.energy}
                </span>
              </div>

              <div
                className={`rounded-xl border-2 p-2 text-center ${
                  resources.health >= THRESHOLDS.sustainability
                    ? 'border-[#4ade80] bg-[#f0fdf4]'
                    : 'border-[#ff5c6c] bg-[#fff1f2]'
                }`}
              >
                <SaludStickerIcon className="mx-auto h-4.5 w-4.5" />
                <span className="block text-[10px] font-extrabold text-[#52708b]">
                  {t.hudHealth}
                </span>
                <span className="tabular-nums text-base font-black text-[#08265b]">
                  {resources.health}
                </span>
              </div>

              <div
                className={`rounded-xl border-2 p-2 text-center ${
                  resources.water >= THRESHOLDS.sustainability
                    ? 'border-[#38bdf8] bg-[#f0f9ff]'
                    : 'border-[#ff5c6c] bg-[#fff1f2]'
                }`}
              >
                <AguaStickerIcon className="mx-auto h-4.5 w-4.5" />
                <span className="block text-[10px] font-extrabold text-[#52708b]">
                  {t.hudWater}
                </span>
                <span className="tabular-nums text-base font-black text-[#08265b]">
                  {resources.water}
                </span>
              </div>

              <div
                className={`rounded-xl border-2 p-2 text-center ${
                  resources.research >= THRESHOLDS.researchGoal
                    ? 'border-[#00d2e0] bg-[#ecfeff]'
                    : 'border-[#facc15] bg-white'
                }`}
              >
                <Radio className="mx-auto h-4.5 w-4.5 text-[#007e99]" />
                <span className="block text-[10px] font-extrabold text-[#52708b]">
                  {t.researchFullLabel}
                </span>
                <span className="tabular-nums text-base font-black text-[#08265b]">
                  {resources.research}/60
                </span>
              </div>

              <div className="rounded-xl border-2 border-[#facc15]/60 bg-white p-2 text-center">
                <FlaskConical className="mx-auto h-4.5 w-4.5 text-[#d97706]" />
                <span className="block text-[10px] font-extrabold text-[#52708b]">
                  {t.hudScience}
                </span>
                <span className="tabular-nums text-base font-black text-[#08265b]">
                  {science}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#cdeaf4] bg-[#e6f9fd] px-3 py-2 text-[11px] font-bold text-[#08265b]">
              <span>
                {resources.energy >= THRESHOLDS.sustainability &&
                resources.water >= THRESHOLDS.sustainability &&
                resources.health >= THRESHOLDS.sustainability
                  ? '✅ '
                  : '⚠️ '}
                {t.endSustThresholdNote}
              </span>
              <span>
                {resources.research >= THRESHOLDS.researchGoal ? '✅ ' : '🔬 '}
                {t.endResGoalNote}
              </span>
            </div>

            <div className="rounded-xl border-2 border-[#00d2e0]/65 bg-white px-3 py-2 shadow-[0_2px_0_#bae6fd]">
              <p className="m-0 text-xs leading-snug font-bold text-[#08265b]">
                <strong className="font-black text-[#007e99]">NAUTI:</strong>{' '}
                {outcomeSpec.nauti}
              </p>
            </div>
          </div>
        )}

        {/* VIEW 2: RESOURCE EVOLUTION CHART (Step 12) */}
        {activeTab === 'chart' && (
          <ResourceEvolutionChart lang={lang} snapshots={snapshots} />
        )}

        {/* VIEW 3: DECISION & CAUSALITY HISTORY (Step 13) */}
        {activeTab === 'history' && (
          <div className="space-y-2">
            <div>
              <h2 className="text-sm font-black text-[#08265b] sm:text-base">
                {t.historyTitle}
              </h2>
              <p className="text-[11px] font-semibold text-[#52708b]">
                {t.historySubtitle}
              </p>
            </div>

            {history.length === 0 ? (
              <div className="rounded-xl border-2 border-[#cdeaf4] bg-white p-3 text-xs font-bold text-[#52708b]">
                {t.historyEmpty}
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((item) => {
                  const causalNote = getCausalityDescription(item);
                  return (
                    <div
                      key={`${item.day}-${item.decisionId}`}
                      className="rounded-xl border-2 border-[#bce8f5] bg-white p-2.5 shadow-[0_2px_0_#d7ebf5]"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="rounded-lg bg-[#08265b] px-2 py-0.5 text-[10px] font-black text-[#facc15]">
                            {t.dayLabelShort(item.day)}
                          </span>
                          <span className="text-xs font-black text-[#08265b] sm:text-[13px]">
                            {getDecisionTitleById(lang, item.day, item.decisionId)}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-black tabular-nums">
                          <span className="rounded bg-[#fefce8] px-1.5 py-0.5 text-[#854d0e]">
                            ⚡ {formatSigned(item.appliedEffects.energy)}
                          </span>
                          <span className="rounded bg-[#f0fdf4] px-1.5 py-0.5 text-[#166534]">
                            💚 {formatSigned(item.appliedEffects.health)}
                          </span>
                          <span className="rounded bg-[#f0f9ff] px-1.5 py-0.5 text-[#075985]">
                            💧 {formatSigned(item.appliedEffects.water)}
                          </span>
                          <span className="rounded bg-[#ecfeff] px-1.5 py-0.5 text-[#0e7490]">
                            🔬 {formatSigned(item.appliedEffects.research)}
                          </span>
                        </div>
                      </div>

                      {causalNote && (
                        <p className="mt-1.5 rounded-lg border border-[#fde047] bg-[#fefce8] px-2.5 py-1 text-[11px] leading-snug font-semibold text-[#713f12]">
                          <strong className="font-black">{t.historyCausalityLabel}</strong>{' '}
                          {causalNote}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: REFLECTION QUESTIONS & COMPLETED SCREEN ACTIONS (Steps 14–15) */}
        {activeTab === 'reflection' && (
          <div className="space-y-2.5">
            <div>
              <h2 className="text-sm font-black text-[#08265b] sm:text-base">
                {t.reflectionTitle}
              </h2>
              <p className="text-[11px] font-semibold text-[#52708b]">
                {t.reflectionSubtitle}
              </p>
            </div>

            <div className="space-y-1.5">
              {reflectionQuestions.map((question, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 rounded-xl border-2 border-[#bce8f5] bg-white px-3 py-2 shadow-[0_2px_0_#d7ebf5]"
                >
                  <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-lg bg-[#08265b] text-xs font-black text-[#facc15]">
                    {idx + 1}
                  </span>
                  <p className="text-xs leading-snug font-bold text-[#08265b] sm:text-[13px]">
                    {question}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border-2 border-[#22c55e]/60 bg-[#f0fdf4] p-2.5">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#14532d]">
                <CheckCircle2 className="h-4 w-4 text-[#16a34a]" />
                <span>{t.missionCompleteTitle}</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={onReplayMission}
                  className="flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#facc15] px-4 py-1.5 text-xs font-black text-[#08265b] shadow-[0_3px_0_#b45309] transition hover:bg-[#fde047] active:translate-y-[1px]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{t.replayMissionBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={onMainMenu}
                  className="flex min-h-[40px] items-center gap-1.5 rounded-xl border-2 border-[#08265b]/20 bg-white px-3.5 py-1.5 text-xs font-black text-[#08265b] shadow-[0_2px_0_#cbd5e1] transition hover:bg-[#e6f7fc] active:translate-y-[1px]"
                >
                  <Home className="h-3.5 w-3.5" />
                  <span>{t.mainMenuBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onChangeTab('history')}
                  className="flex min-h-[40px] items-center gap-1.5 rounded-xl border-2 border-[#00d2e0] bg-[#e6f9fd] px-3.5 py-1.5 text-xs font-black text-[#08265b] shadow-[0_2px_0_#bae6fd] transition hover:bg-[#cff4fc] active:translate-y-[1px]"
                >
                  <History className="h-3.5 w-3.5 text-[#007e99]" />
                  <span>{t.reviewDecisionsBtn}</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#cdeaf4] bg-white px-3 py-2">
              <div className="flex items-center gap-2.5">
                <NautiLogo className="h-7 sm:h-8" alt={t.platformName} />
                <span
                  className="h-5 w-px bg-[#cdeaf4]"
                  aria-hidden="true"
                />
                <FilomatasLogo className="h-7 sm:h-8" />
              </div>
              <span className="text-[11px] font-bold text-[#15385e]">
                {t.createdBy}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Footer Bar */}
      <div className="mt-2 flex flex-none flex-wrap items-center justify-between gap-2 border-t border-[#d6eef7] pt-2">
        <div className="flex items-center gap-1.5">
          {currentTabIdx > 0 && (
            <button
              type="button"
              onClick={() => onChangeTab(TAB_ORDER[currentTabIdx - 1])}
              className="flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#dff2f8] px-3.5 py-1.5 text-xs font-extrabold text-[#08265b] shadow-[0_2px_0_#b6dceb] hover:bg-[#cbe7f2] active:translate-y-[1px]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{t.endPrevStepBtn}</span>
            </button>
          )}
          <button
            type="button"
            onClick={onDownloadLog}
            className="flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#08265b] px-3.5 py-1.5 text-xs font-black text-white shadow-[0_2px_0_#041029] transition hover:bg-[#0e3c8d] active:translate-y-[1px]"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{t.downloadLog}</span>
          </button>
        </div>

        {currentTabIdx < TAB_ORDER.length - 1 ? (
          <button
            type="button"
            onClick={() => onChangeTab(TAB_ORDER[currentTabIdx + 1])}
            className="flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#facc15] px-4 py-1.5 text-xs font-black text-[#08265b] shadow-[0_3px_0_#b45309] transition hover:bg-[#fde047] active:translate-y-[1px] sm:text-sm"
          >
            <span>{t.endNextStepBtn}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onReplayMission}
            className="flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#facc15] px-4 py-1.5 text-xs font-black text-[#08265b] shadow-[0_3px_0_#b45309] transition hover:bg-[#fde047] active:translate-y-[1px] sm:text-sm"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{t.playAgain}</span>
          </button>
        )}
      </div>
    </div>
  );
};
