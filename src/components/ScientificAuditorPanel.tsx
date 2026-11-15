import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Link2,
  Search,
  ShieldCheck,
  Unlink,
} from 'lucide-react';
import { NAUTI_AUDIT_CONTENT_ITEMS } from '../data/auditorCatalog';
import { getScientificLibraryStrings } from '../data/scientificLibraryStrings';
import type { AppLang } from '../locales';
import type { AuditContentItem, ScientificRecord } from '../types/scientificLibrary';
import {
  getLocalizedRecordField,
  isStudentVisibleStatus,
  useScientificLibrary,
} from '../utils/scientificLibraryStore';

interface ScientificAuditorPanelProps {
  lang: AppLang;
  reviewerName: string;
  onJumpToNasaSearch: (query: string, category: string) => void;
  onEditRecord: (record: ScientificRecord) => void;
}

export const ScientificAuditorPanel: React.FC<ScientificAuditorPanelProps> = ({
  lang,
  onJumpToNasaSearch,
  onEditRecord,
}) => {
  const s = getScientificLibraryStrings(lang);
  const { allRecords, verifiedRecords, updateRecord } = useScientificLibrary();
  const [selectedExp, setSelectedExp] = useState<string>('all');
  const [selectedContentId, setSelectedContentId] = useState<string>(
    NAUTI_AUDIT_CONTENT_ITEMS[0].contentId,
  );
  const [busyRecordId, setBusyRecordId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    if (selectedExp === 'all') return NAUTI_AUDIT_CONTENT_ITEMS;
    return NAUTI_AUDIT_CONTENT_ITEMS.filter(
      (item) => item.experienceId === selectedExp,
    );
  }, [selectedExp]);

  const activeItem: AuditContentItem = useMemo(() => {
    const found = filteredItems.find((i) => i.contentId === selectedContentId);
    return found ?? filteredItems[0] ?? NAUTI_AUDIT_CONTENT_ITEMS[0];
  }, [filteredItems, selectedContentId]);

  const linkedVerified = useMemo(
    () =>
      verifiedRecords.filter((r) =>
        r.related_content_ids.includes(activeItem.contentId),
      ),
    [verifiedRecords, activeItem.contentId],
  );

  const suggestedRecords = useMemo(() => {
    const suggestedIds = new Set(activeItem.suggestedRecordIds);
    return allRecords.filter(
      (r) =>
        suggestedIds.has(r.id) ||
        r.category === activeItem.suggestedCategory ||
        r.related_experiences.includes(activeItem.experienceId),
    );
  }, [allRecords, activeItem]);

  const sufficiencyStatus = useMemo(() => {
    if (activeItem.isDeclaredFictionalDemo) {
      return {
        key: 'fictionalDemo' as const,
        badgeClass: 'bg-[#ede9fe] text-[#5b21b6] border-[#c4b5fd]',
      };
    }
    if (linkedVerified.length > 0 && activeItem.existingSourceUrl) {
      return {
        key: 'sufficient' as const,
        badgeClass: 'bg-[#dcfce7] text-[#166534] border-[#86efac]',
      };
    }
    if (linkedVerified.length > 0 || activeItem.existingSourceUrl) {
      return {
        key: 'partial' as const,
        badgeClass: 'bg-[#fef9c3] text-[#854d0e] border-[#fde047]',
      };
    }
    return {
      key: 'missing' as const,
      badgeClass: 'bg-[#ffe4e6] text-[#be123c] border-[#fda4af]',
    };
  }, [activeItem, linkedVerified]);

  const handleAssociateRecord = async (record: ScientificRecord) => {
    if (!isStudentVisibleStatus(record.verification_status)) {
      setFeedbackMsg(s.auditorUi.notPublishedWarning);
      return;
    }
    setBusyRecordId(record.id);
    setFeedbackMsg(null);
    const nextContentIds = Array.from(
      new Set([...record.related_content_ids, activeItem.contentId]),
    );
    const nextExperiences = Array.from(
      new Set([...record.related_experiences, activeItem.experienceId]),
    );
    const res = await updateRecord(record.id, {
      related_content_ids: nextContentIds,
      related_experiences: nextExperiences,
    });
    setBusyRecordId(null);
    if (!res.ok) {
      setFeedbackMsg(res.error || 'Error');
    }
  };

  const handleUnlinkRecord = async (record: ScientificRecord) => {
    setBusyRecordId(record.id);
    setFeedbackMsg(null);
    const nextContentIds = record.related_content_ids.filter(
      (id) => id !== activeItem.contentId,
    );
    const res = await updateRecord(record.id, {
      related_content_ids: nextContentIds,
    });
    setBusyRecordId(null);
    if (!res.ok) {
      setFeedbackMsg(res.error || 'Error');
    }
  };

  return (
    <div className="space-y-3">
      {/* Safe-mode banner */}
      <div className="rounded-2xl border-2 border-[#48C5B5] bg-[#EAF4F2] p-3 text-xs font-bold text-[#101D35]">
        <div className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-[#0f766e]" />
          <div>
            <p className="font-black">{s.auditorUi.title}</p>
            <p className="mt-0.5 font-semibold text-[#15385e]">
              {s.auditorUi.guardrailBanner}
            </p>
          </div>
        </div>
      </div>

      {/* Filter by experience */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => setSelectedExp('all')}
          className={`rounded-xl px-3 py-1.5 text-xs font-black transition ${
            selectedExp === 'all'
              ? 'bg-[#101D35] text-white'
              : 'border border-[#cbd5e1] bg-white text-[#101D35] hover:bg-[#f1f5f9]'
          }`}
        >
          {s.auditorUi.filterAllExperiences}
        </button>
        {(
          [
            'efecto-domino',
            'detectives-de-la-nasa',
            'escucha-imagina-construye',
            'traduciendo-la-ciencia',
          ] as const
        ).map((expId) => (
          <button
            key={expId}
            type="button"
            onClick={() => {
              setSelectedExp(expId);
              const first = NAUTI_AUDIT_CONTENT_ITEMS.find(
                (i) => i.experienceId === expId,
              );
              if (first) setSelectedContentId(first.contentId);
            }}
            className={`rounded-xl px-3 py-1.5 text-xs font-black transition ${
              selectedExp === expId
                ? 'bg-[#101D35] text-white'
                : 'border border-[#cbd5e1] bg-white text-[#101D35] hover:bg-[#f1f5f9]'
            }`}
          >
            {s.experienceNames[expId]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        {/* Left: Content Items Selector */}
        <div className="space-y-2 lg:col-span-5">
          {filteredItems.map((item) => {
            const isSelected = item.contentId === activeItem.contentId;
            const linkedCount = verifiedRecords.filter((r) =>
              r.related_content_ids.includes(item.contentId),
            ).length;
            const statusPill = item.isDeclaredFictionalDemo
              ? s.auditorUi.sufficiencyLabels.fictionalDemo
              : linkedCount > 0 && item.existingSourceUrl
                ? s.auditorUi.sufficiencyLabels.sufficient
                : linkedCount > 0 || item.existingSourceUrl
                  ? s.auditorUi.sufficiencyLabels.partial
                  : s.auditorUi.sufficiencyLabels.missing;

            return (
              <button
                key={item.contentId}
                type="button"
                onClick={() => {
                  setSelectedContentId(item.contentId);
                  setFeedbackMsg(null);
                }}
                className={`w-full rounded-2xl border-2 p-3 text-left transition ${
                  isSelected
                    ? 'border-[#101D35] bg-[#d9f8fc] shadow-[0_3px_0_#00b2c4]'
                    : 'border-[#bce8f5] bg-white hover:border-[#48C5B5]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span className="text-[10px] font-black tracking-wide text-[#0f766e] uppercase">
                    {item.experienceName[lang]}
                  </span>
                  <span className="rounded-lg bg-[#f1f5f9] px-2 py-0.5 text-[10px] font-black text-[#101D35]">
                    {statusPill}
                  </span>
                </div>
                <p className="mt-1 text-xs font-black text-[#101D35]">
                  {item.title[lang]}
                </p>
                <p className="mt-0.5 text-[10px] font-semibold text-[#52708b]">
                  {item.contentLocation}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right: Detailed Inspection & Manual Association */}
        <div className="space-y-3 rounded-2xl border-2 border-[#bce8f5] bg-white p-4 lg:col-span-7">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-black tracking-wide text-[#0f766e] uppercase">
                {activeItem.experienceName[lang]} · {activeItem.contentId}
              </span>
              <h3 className="mt-0.5 text-sm font-black text-[#101D35] sm:text-base">
                {activeItem.title[lang]}
              </h3>
            </div>
            <span
              className={`rounded-xl border px-2.5 py-1 text-[11px] font-black ${sufficiencyStatus.badgeClass}`}
            >
              {s.auditorUi.sufficiencyLabels[sufficiencyStatus.key]}
            </span>
          </div>

          {activeItem.isDeclaredFictionalDemo && (
            <div className="rounded-xl border border-[#c4b5fd] bg-[#f5f3ff] p-2.5 text-xs font-bold text-[#5b21b6]">
              {s.auditorUi.fictionalDemoNote}
            </div>
          )}

          {feedbackMsg && (
            <div className="flex items-start gap-2 rounded-xl border border-[#fda4af] bg-[#fff1f2] p-2.5 text-xs font-bold text-[#be123c]">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-none" />
              <span>{feedbackMsg}</span>
            </div>
          )}

          {/* Claims & Numerical figures */}
          <div className="space-y-2 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-3">
            <p className="text-[11px] font-black tracking-wide text-[#101D35] uppercase">
              {s.auditorUi.claimsHeading}
            </p>
            <ul className="list-disc space-y-1 pl-4 text-xs font-semibold text-[#15385e]">
              {activeItem.claims.map((c, idx) => (
                <li key={idx}>{c}</li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-black text-[#52708b] uppercase">
                {s.auditorUi.figuresHeading}:
              </span>
              {activeItem.numericalValues.map((num, idx) => (
                <span
                  key={idx}
                  className="tabular-nums rounded-lg bg-[#fefce8] px-2 py-0.5 text-[11px] font-black text-[#854d0e] ring-1 ring-[#F2C66D]"
                >
                  {num}
                </span>
              ))}
            </div>
          </div>

          {/* Current source */}
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-3">
            <p className="text-[11px] font-black tracking-wide text-[#101D35] uppercase">
              {s.auditorUi.currentSourceHeading}
            </p>
            {activeItem.existingSourceUrl ? (
              <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#15385e]">
                  {activeItem.existingSourceTitle}
                </span>
                <a
                  href={activeItem.existingSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-black text-[#0f766e] hover:underline"
                >
                  <span>URL</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            ) : (
              <p className="mt-1 text-xs font-semibold text-[#9f1239]">
                {s.auditorUi.sufficiencyLabels.missing}
              </p>
            )}
          </div>

          {/* Linked verified records */}
          <div className="rounded-xl border border-[#bce8f5] bg-[#f0fdfa] p-3">
            <p className="text-[11px] font-black tracking-wide text-[#0f766e] uppercase">
              {s.auditorUi.linkedVerifiedHeading} ({linkedVerified.length})
            </p>
            {linkedVerified.length === 0 ? (
              <p className="mt-1 text-xs font-semibold text-[#52708b]">
                {s.lookupUi.emptyNotice}
              </p>
            ) : (
              <div className="mt-2 space-y-1.5">
                {linkedVerified.map((rec) => (
                  <div
                    key={rec.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#99f6e4] bg-white px-2.5 py-1.5 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="font-black text-[#101D35]">
                        {getLocalizedRecordField(rec, lang, 'topic')}
                      </span>
                      <span className="ml-2 text-[10px] font-bold text-[#166534]">
                        ✓ {rec.source_identifier}
                      </span>
                    </div>
                    <button
                      type="button"
                      disabled={busyRecordId === rec.id}
                      onClick={() => void handleUnlinkRecord(rec)}
                      className="inline-flex items-center gap-1 rounded-lg border border-[#fecdd3] bg-[#fff1f2] px-2 py-1 text-[10px] font-black text-[#be123c] hover:bg-[#ffe4e6]"
                    >
                      <Unlink className="h-3 w-3" />
                      <span>{s.auditorUi.unlinkBtn}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Suggested matching records + quick NASA search */}
          <div className="space-y-2 border-t border-[#e2e8f0] pt-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[11px] font-black tracking-wide text-[#101D35] uppercase">
                {s.auditorUi.suggestedRecordsHeading}
              </p>
              <button
                type="button"
                onClick={() =>
                  onJumpToNasaSearch(
                    activeItem.recommendedQuery,
                    activeItem.suggestedCategory,
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#101D35] px-3 py-1.5 text-xs font-black text-white hover:bg-[#1e355d]"
              >
                <Search className="h-3.5 w-3.5 text-[#48C5B5]" />
                <span>{s.auditorUi.searchMatchingNasaBtn}</span>
              </button>
            </div>

            <div className="space-y-2">
              {suggestedRecords.map((rec) => {
                const alreadyLinked = rec.related_content_ids.includes(
                  activeItem.contentId,
                );
                const canLink = isStudentVisibleStatus(rec.verification_status);
                return (
                  <div
                    key={rec.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-3 py-2 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="rounded bg-[#e2e8f0] px-1.5 py-0.5 text-[10px] font-black text-[#101D35]">
                          {rec.verification_status}
                        </span>
                        <span className="font-black text-[#101D35]">
                          {getLocalizedRecordField(rec, lang, 'topic')}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] font-semibold text-[#52708b]">
                        {rec.source_identifier} · {rec.organism_or_population}
                      </p>
                    </div>
                    <div className="flex flex-none items-center gap-1.5">
                      {!canLink ? (
                        <button
                          type="button"
                          onClick={() => onEditRecord(rec)}
                          className="rounded-lg border border-[#F2C66D] bg-[#fefce8] px-2.5 py-1 text-[11px] font-black text-[#854d0e] hover:bg-[#fef08a]"
                        >
                          {s.manageUi.editBtn}
                        </button>
                      ) : alreadyLinked ? (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-[#dcfce7] px-2.5 py-1 text-[11px] font-black text-[#166534]">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>{s.auditorUi.alreadyLinkedBadge}</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={busyRecordId === rec.id}
                          onClick={() => void handleAssociateRecord(rec)}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#48C5B5] px-2.5 py-1 text-[11px] font-black text-[#101D35] hover:bg-[#5cd8c8]"
                        >
                          <Link2 className="h-3.5 w-3.5" />
                          <span>{s.auditorUi.approveAndLinkBtn}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
