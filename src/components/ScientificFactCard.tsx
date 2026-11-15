import React from 'react';
import {
  CheckCircle2,
  ExternalLink,
  Info,
  Microscope,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react';
import { getScientificLibraryStrings } from '../data/scientificLibraryStrings';
import type { AppLang } from '../locales';
import type { LibraryCategory, ScientificRecord } from '../types/scientificLibrary';
import { getLocalizedRecordField } from '../utils/scientificLibraryStore';

interface ScientificFactCardProps {
  record: ScientificRecord;
  category?: LibraryCategory;
  lang: AppLang;
  onOpenDetail?: (record: ScientificRecord) => void;
}

export const ScientificFactCard: React.FC<ScientificFactCardProps> = ({
  record,
  category,
  lang,
  onOpenDetail,
}) => {
  const s = getScientificLibraryStrings(lang);
  const topic = getLocalizedRecordField(record, lang, 'topic');
  const studentExplanation = getLocalizedRecordField(
    record,
    lang,
    'student_explanation',
  );
  const organism = getLocalizedRecordField(
    record,
    lang,
    'organism_or_population',
  );
  const catLabel = category?.labels[lang] ?? record.category;

  return (
    <article className="flex h-full flex-col justify-between rounded-2xl border-2 border-[#bce8f5] bg-white p-3.5 shadow-[0_3px_0_#d7ebf5] transition hover:border-[#48C5B5]">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-lg bg-[#EAF4F2] px-2 py-0.5 text-[10px] font-black text-[#101D35]">
            <span>{category?.icon ?? '🔬'}</span>
            <span>{catLabel}</span>
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-[#dcfce7] px-2 py-0.5 text-[10px] font-black text-[#166534]">
            <CheckCircle2 className="h-3 w-3" />
            <span>{s.verifiedBadgeLabel}</span>
          </span>
        </div>

        <h3 className="mt-2 text-sm leading-snug font-black text-[#101D35] sm:text-[15px]">
          {topic}
        </h3>

        <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed font-semibold text-[#15385e]">
          {studentExplanation}
        </p>

        {record.numerical_values.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {record.numerical_values.map((val, i) => (
              <span
                key={`${val}-${i}`}
                className="tabular-nums rounded-lg border border-[#F2C66D] bg-[#fefce8] px-2 py-0.5 text-[11px] font-black text-[#854d0e]"
              >
                {val}
                {record.units[i] ? ` ${record.units[i]}` : ''}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#e5f3f8] pt-2.5">
        <span className="truncate text-[10px] font-bold text-[#52708b]">
          🧬 {organism}
        </span>
        {onOpenDetail && (
          <button
            type="button"
            onClick={() => onOpenDetail(record)}
            className="flex-none rounded-xl bg-[#48C5B5] px-3 py-1.5 text-xs font-black text-[#101D35] shadow-[0_2px_0_#1e7a70] transition hover:bg-[#5cd8c8] active:translate-y-[1px]"
          >
            {s.openCardBtn}
          </button>
        )}
      </div>
    </article>
  );
};

interface ScientificFactDetailModalProps {
  record: ScientificRecord;
  category?: LibraryCategory;
  lang: AppLang;
  onClose: () => void;
  onListenText?: (text: string) => void;
}

export const ScientificFactDetailModal: React.FC<
  ScientificFactDetailModalProps
> = ({ record, category, lang, onClose, onListenText }) => {
  const s = getScientificLibraryStrings(lang);
  const topic = getLocalizedRecordField(record, lang, 'topic');
  const claim = getLocalizedRecordField(record, lang, 'scientific_claim');
  const didYouKnow = getLocalizedRecordField(
    record,
    lang,
    'student_explanation',
  );
  const whyItMatters =
    getLocalizedRecordField(record, lang, 'why_it_matters') || claim;
  const whereToUse =
    getLocalizedRecordField(record, lang, 'where_to_use') ||
    record.related_experiences
      .map((expId) => s.experienceNames[expId] ?? expId)
      .join(', ');
  const organism = getLocalizedRecordField(
    record,
    lang,
    'organism_or_population',
  );
  const researchContext = getLocalizedRecordField(
    record,
    lang,
    'research_context',
  );
  const limitations = getLocalizedRecordField(record, lang, 'limitations');
  const catLabel = category?.labels[lang] ?? record.category;

  const fullSpokenSummary = `${topic}. ${s.factCardSections.didYouKnow}: ${didYouKnow} ${s.factCardSections.whyItMatters}: ${whyItMatters} ${s.factCardSections.whereToUse}: ${whereToUse}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#061229]/75 p-2.5 backdrop-blur-sm sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={topic}
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border-2 border-[#48C5B5] bg-[#f4fcff] text-[#101D35] shadow-[0_12px_40px_rgba(4,12,28,0.65)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-none items-start justify-between gap-3 bg-[#101D35] px-4 py-3 text-white sm:px-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-lg bg-[#EAF4F2] px-2 py-0.5 text-[10px] font-black text-[#101D35]">
                <span>{category?.icon ?? '🔬'}</span>
                <span>{catLabel}</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg bg-[#dcfce7] px-2 py-0.5 text-[10px] font-black text-[#166534]">
                <CheckCircle2 className="h-3 w-3" />
                <span>{s.verifiedBadgeLabel}</span>
              </span>
              {record.source_identifier && (
                <span className="rounded-lg bg-white/15 px-2 py-0.5 text-[10px] font-extrabold text-[#F2C66D]">
                  {record.source_identifier}
                </span>
              )}
            </div>
            <h2 className="mt-1.5 text-base leading-snug font-black sm:text-xl">
              {topic}
            </h2>
          </div>

          <div className="flex flex-none items-center gap-1.5">
            {onListenText && (
              <button
                type="button"
                onClick={() => onListenText(fullSpokenSummary)}
                className="flex items-center gap-1 rounded-xl bg-[#48C5B5] px-2.5 py-1.5 text-xs font-black text-[#101D35] transition hover:bg-[#5cd8c8]"
                title={s.openCardBtn}
              >
                <Volume2 className="h-4 w-4" />
                <span className="hidden sm:inline">NAUTI</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label={s.closeCardBtn}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white transition hover:bg-white/25"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Student Scientific Fact Card body */}
        <div className="cockpit-scroll min-h-0 flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
          {/* 1. ¿Sabías que...? */}
          <section className="rounded-2xl border-2 border-[#48C5B5] bg-white p-3.5 shadow-[0_2px_0_#d7ebf5]">
            <h3 className="text-xs font-black tracking-wide text-[#0f766e] uppercase sm:text-sm">
              {s.factCardSections.didYouKnow}
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed font-semibold text-[#101D35] sm:text-sm">
              {didYouKnow}
            </p>
            {record.numerical_values.length > 0 && (
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-black text-[#52708b] uppercase">
                  {s.numericalDataLabel}:
                </span>
                {record.numerical_values.map((val, i) => (
                  <span
                    key={`${val}-${i}`}
                    className="tabular-nums rounded-lg border border-[#F2C66D] bg-[#fefce8] px-2 py-0.5 text-xs font-black text-[#854d0e]"
                  >
                    {val}
                    {record.units[i] ? ` ${record.units[i]}` : ''}
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* 2. ¿Por qué importa? */}
          <section className="rounded-2xl border-2 border-[#bce8f5] bg-[#EAF4F2]/70 p-3.5">
            <h3 className="text-xs font-black tracking-wide text-[#101D35] uppercase sm:text-sm">
              {s.factCardSections.whyItMatters}
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed font-semibold text-[#15385e] sm:text-sm">
              {whyItMatters}
            </p>
          </section>

          {/* 3. ¿Dónde podríamos utilizarlo? */}
          <section className="rounded-2xl border-2 border-[#F2C66D] bg-[#fefce8] p-3.5">
            <h3 className="text-xs font-black tracking-wide text-[#854d0e] uppercase sm:text-sm">
              {s.factCardSections.whereToUse}
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed font-semibold text-[#713f12] sm:text-sm">
              {whereToUse || s.linkedExperiencesLabel}
            </p>
            {record.related_experiences.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {record.related_experiences.map((exp) => (
                  <span
                    key={exp}
                    className="inline-flex items-center gap-1 rounded-lg bg-white px-2 py-0.5 text-[11px] font-black text-[#101D35] ring-1 ring-[#F2C66D]"
                  >
                    <Sparkles className="h-3 w-3 text-[#d97706]" />
                    <span>{s.experienceNames[exp] ?? exp}</span>
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Study Context Clarity & Limitations */}
          <section className="rounded-2xl border-2 border-[#c7d2fe] bg-[#eef2ff] p-3.5">
            <div className="flex items-start gap-2">
              <Microscope className="mt-0.5 h-4 w-4 flex-none text-[#4338ca]" />
              <div className="min-w-0 space-y-1 text-xs">
                <p className="font-black text-[#1e1b4b]">
                  {s.organismLabel}:{' '}
                  <span className="font-bold text-[#312e81]">{organism}</span>
                </p>
                <p className="font-semibold text-[#312e81]">
                  <span className="font-black">{s.studyContextLabel}:</span>{' '}
                  {researchContext}
                </p>
                {limitations && (
                  <p className="font-semibold text-[#3730a3]">
                    <span className="font-black">{s.limitationsLabel}:</span>{' '}
                    {limitations}
                  </p>
                )}
                <p className="flex items-center gap-1 pt-0.5 text-[11px] font-bold text-[#4338ca]">
                  <Info className="h-3.5 w-3.5 flex-none" />
                  <span>{s.studyContextWarning}</span>
                </p>
              </div>
            </div>
          </section>

          {/* 4. Fuente NASA */}
          <section className="rounded-2xl border-2 border-[#101D35]/20 bg-white p-3.5">
            <h3 className="text-xs font-black tracking-wide text-[#101D35] uppercase sm:text-sm">
              {s.factCardSections.nasaSource}
            </h3>
            <p className="mt-1 text-xs font-black text-[#101D35] sm:text-sm">
              {record.source_title}
            </p>
            <p className="mt-0.5 text-[11px] font-bold text-[#52708b]">
              {record.source_organization}
              {record.publication_date ? ` · ${record.publication_date}` : ''}
              {record.authors.length > 0
                ? ` · ${record.authors.join(', ')}`
                : ''}
            </p>
            <p className="mt-1 text-[11px] font-semibold text-[#334155]">
              {claim}
            </p>
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-[#e2e8f0] pt-2">
              <span className="text-[11px] font-bold text-[#166534]">
                ✓ {s.verifiedByLabel}: {record.verified_by || 'Filómatas LAB'}
                {record.verification_date ? ` (${record.verification_date})` : ''}
              </span>
              <a
                href={record.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#101D35] px-3 py-1.5 text-xs font-black text-white transition hover:bg-[#1d3258]"
              >
                <span>{s.openOriginalSource}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
