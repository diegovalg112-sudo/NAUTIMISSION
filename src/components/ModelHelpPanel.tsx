import React, { useEffect } from 'react';
import { FlaskConical, Lightbulb, Settings, Sparkles, X } from 'lucide-react';
import type { AppLang } from '../data/missionData';
import { UI_STRINGS } from '../data/uiStrings';

interface ModelHelpPanelProps {
  open: boolean;
  lang: AppLang;
  onClose: () => void;
}

/**
 * Compact, non-blocking contextual explanation panel for MODELAR.
 * Docked over the left bay so decision cards and action buttons remain visible
 * and unobstructed, without deducting Science Points or triggering MODELAR.
 */
export const ModelHelpPanel: React.FC<ModelHelpPanelProps> = ({
  open,
  lang,
  onClose,
}) => {
  useEffect(() => {
    if (!open || typeof window === 'undefined') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const t = UI_STRINGS[lang];
  const copy = t.modelHelpPanel;

  return (
    <aside
      role="dialog"
      aria-modal="false"
      aria-label={copy.exploreHeading}
      className="fixed bottom-2.5 left-2.5 z-[185] flex max-h-[calc(100dvh-74px)] w-[min(395px,44vw)] min-w-[270px] max-w-[calc(100vw-20px)] flex-col rounded-2xl border-2 border-[#48C5B5] bg-[#101D35]/98 p-3 text-[#EAF4F2] shadow-[0_10px_28px_rgba(4,16,41,0.85)] sm:bottom-4 sm:left-4 sm:p-4"
    >
      <div className="mb-2 flex flex-none items-center justify-between gap-2 border-b border-[#48C5B5]/35 pb-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-7 w-7 flex-none items-center justify-center rounded-xl bg-[#48C5B5] text-[#101D35]">
            <FlaskConical className="h-4 w-4" aria-hidden="true" />
          </div>
          <h3 className="truncate text-xs font-black text-[#F2C66D] sm:text-sm">
            {copy.exploreHeading}
          </h3>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label={t.closeWindow}
          className="flex h-8 w-8 flex-none items-center justify-center rounded-xl border border-[#48C5B5]/50 bg-[#162747] text-[#EAF4F2] transition hover:bg-[#1e355f]"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="cockpit-scroll min-h-0 flex-1 space-y-2.5 overflow-y-auto pr-1 text-[11px] leading-snug sm:text-xs">
        <section className="space-y-1.5 rounded-xl border border-[#48C5B5]/40 bg-[#162747]/90 p-2.5">
          {copy.exploreParagraphs.map((paragraph, idx) => (
            <p key={idx} className="font-semibold text-[#EAF4F2]">
              {paragraph}
            </p>
          ))}
        </section>

        <section className="space-y-1.5 rounded-xl border border-[#48C5B5]/35 bg-[#162747]/70 p-2.5">
          <h4 className="flex items-center gap-1.5 font-black text-[#48C5B5]">
            <Settings className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
            <span>{copy.howHeading}</span>
          </h4>
          {copy.howParagraphs.map((paragraph, idx) => (
            <p key={idx} className="font-semibold text-[#EAF4F2]/95">
              {paragraph}
            </p>
          ))}
        </section>

        <section className="rounded-xl border border-[#F2C66D]/60 bg-[#2a2416]/90 p-2.5">
          <h4 className="flex items-center gap-1.5 font-black text-[#F2C66D]">
            <Lightbulb className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
            <span>{copy.rememberHeading}</span>
          </h4>
          <p className="mt-1 font-bold text-[#EAF4F2]">{copy.rememberBody}</p>
        </section>

        <p className="flex items-start gap-1.5 rounded-xl border border-[#48C5B5]/30 bg-[#0c172b] px-2.5 py-2 text-[10px] font-semibold text-[#EAF4F2]/85 sm:text-[11px]">
          <Sparkles
            className="mt-0.5 h-3.5 w-3.5 flex-none text-[#48C5B5]"
            aria-hidden="true"
          />
          <span>{copy.nasaConnectionNote}</span>
        </p>
      </div>

      <div className="mt-2.5 flex flex-none justify-end border-t border-[#48C5B5]/30 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="min-h-[34px] rounded-xl bg-[#48C5B5] px-4 py-1 text-xs font-black text-[#101D35] transition hover:brightness-105 active:translate-y-[1px]"
        >
          {t.nasaPhotoClose}
        </button>
      </div>
    </aside>
  );
};
