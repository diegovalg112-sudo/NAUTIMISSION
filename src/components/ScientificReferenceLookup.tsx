import React, { useState } from 'react';
import { BookOpen, CheckCircle2, ExternalLink } from 'lucide-react';
import { getScientificLibraryStrings } from '../data/scientificLibraryStrings';
import type { AppLang } from '../locales';
import type { ScientificRecord } from '../types/scientificLibrary';
import {
  getLocalizedRecordField,
  useScientificLibrary,
} from '../utils/scientificLibraryStore';
import { ScientificFactDetailModal } from './ScientificFactCard';

interface ScientificReferenceLookupProps {
  /** Explicit record IDs to display */
  recordIds?: readonly string[];
  /** Or automatically resolve verified records linked to a specific NAUTI contentId */
  contentId?: string;
  lang: AppLang;
  compact?: boolean;
  onListenText?: (text: string) => void;
}

/**
 * Reusable reference lookup component that exposes ONLY VERIFIED / PUBLISHED
 * scientific records from the Central NASA Scientific Library to any NAUTI
 * educational experience without modifying game mechanics.
 */
export const ScientificReferenceLookup: React.FC<
  ScientificReferenceLookupProps
> = ({ recordIds, contentId, lang, compact = false, onListenText }) => {
  const s = getScientificLibraryStrings(lang);
  const {
    categories,
    lookupVerifiedByIds,
    lookupVerifiedByContentId,
  } = useScientificLibrary();
  const [activeDetail, setActiveDetail] = useState<ScientificRecord | null>(
    null,
  );

  const byIds = recordIds ? lookupVerifiedByIds(recordIds) : [];
  const byContent = contentId ? lookupVerifiedByContentId(contentId) : [];

  const mergedMap = new Map<string, ScientificRecord>();
  for (const r of [...byIds, ...byContent]) {
    mergedMap.set(r.id, r);
  }
  const records = Array.from(mergedMap.values());

  if (records.length === 0) {
    return null;
  }

  return (
    <div
      className={`rounded-2xl border-2 border-[#48C5B5]/60 bg-[#EAF4F2]/75 ${
        compact ? 'p-2.5' : 'p-3.5'
      }`}
    >
      <div className="flex items-center gap-1.5 text-[11px] font-black tracking-wide text-[#101D35] uppercase">
        <BookOpen className="h-3.5 w-3.5 text-[#0f766e]" />
        <span>{s.lookupUi.heading}</span>
      </div>

      <div className="mt-2 space-y-2">
        {records.map((rec) => {
          const topic = getLocalizedRecordField(rec, lang, 'topic');
          const context = getLocalizedRecordField(
            rec,
            lang,
            'organism_or_population',
          );
          return (
            <div
              key={rec.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#bce8f5] bg-white px-3 py-2 text-xs"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 flex-none text-[#16a34a]" />
                  <span className="truncate font-black text-[#101D35]">
                    {topic}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-[11px] font-semibold text-[#52708b]">
                  {s.lookupUi.studyContextPrefix} {context} ·{' '}
                  {rec.source_identifier}
                </p>
              </div>
              <div className="flex flex-none items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveDetail(rec)}
                  className="rounded-lg bg-[#48C5B5] px-2.5 py-1 text-[11px] font-black text-[#101D35] hover:bg-[#5cd8c8]"
                >
                  {s.openCardBtn}
                </button>
                <a
                  href={rec.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-[#cbd5e1] bg-white px-2 py-1 text-[11px] font-bold text-[#101D35] hover:bg-[#f1f5f9]"
                >
                  <span>{s.lookupUi.viewSource}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {activeDetail && (
        <ScientificFactDetailModal
          record={activeDetail}
          category={categories.find((c) => c.id === activeDetail.category)}
          lang={lang}
          onClose={() => setActiveDetail(null)}
          onListenText={onListenText}
        />
      )}
    </div>
  );
};
