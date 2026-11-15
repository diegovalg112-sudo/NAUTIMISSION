import React from 'react';
import {
  Lightbulb,
  FlaskConical,
  ExternalLink,
  X,
  AlertTriangle,
  Radio,
  Volume2,
  Square,
} from 'lucide-react';
import {
  formatSigned,
  RISK_LABELS_BY_LANG,
  type AppLang,
  type DecisionOption,
  type SceneData,
} from '../data/missionData';
import { UI_STRINGS } from '../data/uiStrings';
import {
  AguaStickerIcon,
  EnergiaStickerIcon,
  SaludStickerIcon,
} from './ResourceStickers';
import { EduTooltip } from './EduTooltip';

interface HelpModelModalProps {
  lang: AppLang;
  mode: 'help' | 'model' | null;
  onClose: () => void;
  scene: SceneData;
  chosenIndex: number;
  day5BonusNote?: string | null;
  isSpeaking?: boolean;
  onReplay?: () => void;
  onStop?: () => void;
}

export const HelpModelModal: React.FC<HelpModelModalProps> = ({
  lang,
  mode,
  onClose,
  scene,
  chosenIndex,
  day5BonusNote = null,
  isSpeaking = false,
  onReplay,
  onStop,
}) => {
  if (!mode) return null;

  const t = UI_STRINGS[lang];
  const riskLabels = RISK_LABELS_BY_LANG[lang];
  const option: DecisionOption | null =
    chosenIndex >= 0 ? scene.options[chosenIndex] : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#040f26]/80 p-3 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'help' ? t.helpModalTitle : t.modelModalTitle}
    >
      <div className="flex max-h-[92dvh] w-full max-w-lg flex-col rounded-2xl border-2 border-white bg-[#f4fcff] p-3.5 text-[#08265b] shadow-[0_8px_0_#061a40] sm:p-4">
        <div className="mb-2.5 flex flex-none items-center justify-between border-b border-[#cbeaf4] pb-2">
          <div className="flex items-center gap-2">
            {mode === 'help' ? (
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#00d2e0] text-[#08265b]">
                <Lightbulb className="h-4.5 w-4.5" />
              </div>
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#facc15] text-[#08265b]">
                <FlaskConical className="h-4.5 w-4.5" />
              </div>
            )}
            <div>
              <span className="block text-[10px] font-black tracking-widest text-[#007e99] uppercase">
                {mode === 'help' ? t.helpModalTag : t.modelModalTag}
              </span>
              <h3 className="text-sm font-black text-[#08265b]">
                {mode === 'help' ? t.helpModalTitle : t.modelModalTitle}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeWindow}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#dff3fa] text-[#08265b] hover:bg-[#c5eaf6]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="cockpit-scroll min-h-0 flex-1 overflow-y-auto pr-1">
          {mode === 'help' ? (
            scene.helpSections ? (
              <div className="space-y-2.5">
                {/* Scientific Explanation Card */}
                <div className="rounded-xl border-2 border-[#7dd3fc] bg-white p-3 shadow-[0_2px_0_#d7ebf5]">
                  <h4 className="text-xs font-black tracking-wide text-[#007e99] sm:text-[13px]">
                    {scene.helpSections.hintHeading}
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed font-semibold text-[#15385e] sm:text-sm">
                    {scene.helpSections.hintBody}
                  </p>
                </div>

                {/* Visually Distinct Team Reflection Prompt Card */}
                <div className="rounded-xl border-2 border-[#facc15] bg-[#fef9c3]/85 p-3 shadow-[0_2px_0_#eab308]/50">
                  <h4 className="text-xs font-black tracking-wide text-[#92400e] sm:text-[13px]">
                    {scene.helpSections.reflectHeading}
                  </h4>
                  <div className="mt-1 space-y-1.5 text-xs leading-relaxed text-[#451a03] sm:text-sm">
                    {scene.helpSections.reflectParagraphs.map((paragraph, idx) => (
                      <p
                        key={idx}
                        className={
                          idx === scene.helpSections!.reflectParagraphs.length - 1
                            ? 'font-extrabold text-[#08265b]'
                            : 'font-semibold'
                        }
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Scientific Citation & Clickable NASA PDF Source */}
                <div className="rounded-xl border-2 border-[#cdeaf4] bg-white p-2.5 text-xs text-[#3b5d80]">
                  <span className="block font-black text-[#08265b]">
                    {scene.helpSections.sourceHeading}
                  </span>
                  <p className="mt-0.5 text-[11px] leading-snug font-semibold text-[#15385e] sm:text-xs">
                    {scene.helpSections.sourceCitationPrefix}
                    <em>{scene.helpSections.sourceCitationTitle}</em>
                    {scene.helpSections.sourceCitationSuffix}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
                    <a
                      href={scene.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[32px] items-center gap-1.5 rounded-lg border border-[#0284c7]/35 bg-[#e0f2fe] px-2.5 py-1 text-[11px] font-black text-[#0369a1] transition hover:bg-[#bae6fd] hover:text-[#08265b]"
                    >
                      <span>{t.viewNasaSource}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <span className="text-[10px] font-semibold text-[#58718b]">
                      {t.offlineSourceNote}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm leading-relaxed font-semibold text-[#15385e]">
                  {scene.help}
                </p>
                <div className="rounded-xl border-2 border-[#cdeaf4] bg-white p-2.5 text-xs text-[#3b5d80]">
                  <div className="flex flex-wrap items-center gap-1.5 font-bold text-[#08265b]">
                    <span>{t.sourceLabel}</span>
                    <a
                      href={scene.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#0284c7] underline hover:text-[#0369a1]"
                    >
                      <span>{scene.source}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <p className="mt-1 text-[11px] text-[#58718b]">
                    {t.offlineSourceNote}
                  </p>
                </div>
              </div>
            )
          ) : (
            <div className="space-y-3">
              {!option ? (
                <div className="rounded-xl border-2 border-[#facc15] bg-[#fef9c3] p-3 text-sm font-bold text-[#713f12]">
                  {scene.options.length === 2
                    ? t.modelSelectPromptTwo
                    : t.modelSelectPrompt}
                </div>
              ) : (
                <>
                  <div className="rounded-xl border border-[#bae6fd] bg-[#e6f7fc] px-3 py-2">
                    <span className="text-[11px] font-black tracking-wider text-[#007e99] uppercase">
                      {t.optionPrefix} {'ABC'[chosenIndex]}: {option[0]}
                    </span>
                    <p className="mt-0.5 text-sm font-bold text-[#08265b]">{option[1]}</p>
                  </div>

                  {/* Predicted Indicator Deltas with Kit Card Colors */}
                  <div className="grid grid-cols-4 gap-2">
                    <div className="rounded-xl border-2 border-[#facc15] bg-[#fefce8] p-2 text-center">
                      <EnergiaStickerIcon className="mx-auto h-5 w-5" />
                      <span className="mt-0.5 block text-[10px] font-extrabold text-[#854d0e]">
                        {t.hudEnergy}
                      </span>
                      <span
                        className={`tabular-nums block text-base font-black ${
                          option[2][0] > 0
                            ? 'text-[#15803d]'
                            : option[2][0] < 0
                              ? 'text-[#dc2626]'
                              : 'text-[#64748b]'
                        }`}
                      >
                        {formatSigned(option[2][0])}
                      </span>
                    </div>

                    <div className="rounded-xl border-2 border-[#4ade80] bg-[#f0fdf4] p-2 text-center">
                      <SaludStickerIcon className="mx-auto h-5 w-5" />
                      <span className="mt-0.5 block text-[10px] font-extrabold text-[#166534]">
                        {t.hudHealth}
                      </span>
                      <span
                        className={`tabular-nums block text-base font-black ${
                          option[2][1] > 0
                            ? 'text-[#15803d]'
                            : option[2][1] < 0
                              ? 'text-[#dc2626]'
                              : 'text-[#64748b]'
                        }`}
                      >
                        {formatSigned(option[2][1])}
                      </span>
                    </div>

                    <div className="rounded-xl border-2 border-[#38bdf8] bg-[#f0f9ff] p-2 text-center">
                      <AguaStickerIcon className="mx-auto h-5 w-5" />
                      <span className="mt-0.5 block text-[10px] font-extrabold text-[#075985]">
                        {t.hudWater}
                      </span>
                      <span
                        className={`tabular-nums block text-base font-black ${
                          option[2][2] > 0
                            ? 'text-[#15803d]'
                            : option[2][2] < 0
                              ? 'text-[#dc2626]'
                              : 'text-[#64748b]'
                        }`}
                      >
                        {formatSigned(option[2][2])}
                      </span>
                    </div>

                    <div className="rounded-xl border-2 border-[#00d2e0] bg-[#ecfeff] p-2 text-center">
                      <div className="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-[#08265b] text-[#34f0fa]">
                        <Radio className="h-3 w-3" />
                      </div>
                      <span className="mt-0.5 block text-[10px] font-extrabold text-[#0e7490]">
                        {t.hudResearch}
                      </span>
                      <span
                        className={`tabular-nums block text-base font-black ${
                          option[2][3] > 0
                            ? 'text-[#15803d]'
                            : option[2][3] < 0
                              ? 'text-[#dc2626]'
                              : 'text-[#64748b]'
                        }`}
                      >
                        {formatSigned(option[2][3])}
                      </span>
                    </div>
                  </div>

                  {day5BonusNote && (
                    <div className="rounded-xl border-2 border-[#34f0fa] bg-[#ecfeff] p-2.5 text-xs font-bold text-[#0e7490]">
                      {day5BonusNote}
                    </div>
                  )}

                  {option[4] && (
                    <div className="flex items-start gap-2 rounded-xl border-2 border-[#fdba74] bg-[#fff7ed] p-2.5 text-xs font-bold text-[#9a3412]">
                      <AlertTriangle className="mt-0.5 h-4 w-4 flex-none text-[#ea580c]" />
                      <span>
                        {t.possibleRiskPrefix}{' '}
                        {riskLabels[option[4]] || t.delayedRiskFallback}.
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-none flex-wrap items-center justify-between gap-2 border-t border-[#cbeaf4] pt-2.5">
          <div className="flex items-center gap-1.5">
            {onReplay && (
              <EduTooltip
                content={t.tooltipListenAgain}
                preferredSide="top"
                showInfoButton
                infoAriaLabel={t.tooltipInfoAria(t.listenAgain)}
              >
                <button
                  type="button"
                  onClick={onReplay}
                  className="flex min-h-[42px] items-center gap-1.5 rounded-xl border-2 border-[#00d2e0] bg-white px-3.5 py-2 text-xs font-black text-[#08265b] shadow-[0_2px_0_#bae6fd] transition hover:bg-[#e6f7fc] active:translate-y-[1px]"
                >
                  <Volume2 className="h-4 w-4 text-[#0284c7]" />
                  <span>{t.listenAgain}</span>
                </button>
              </EduTooltip>
            )}
            {isSpeaking && onStop && (
              <button
                type="button"
                onClick={onStop}
                className="flex min-h-[42px] items-center gap-1.5 rounded-xl bg-[#ff5c6c] px-3 py-2 text-xs font-black text-white shadow-[0_2px_0_#9f1239] transition active:translate-y-[1px]"
              >
                <Square className="h-3.5 w-3.5 fill-current" />
                <span>{t.stopShort}</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[42px] rounded-xl bg-[#08265b] px-5 py-2 text-xs font-black text-white shadow-[0_3px_0_#041029] transition hover:bg-[#0d3a88] active:translate-y-[1px]"
          >
            {t.backToDecisions}
          </button>
        </div>
      </div>
    </div>
  );
};
