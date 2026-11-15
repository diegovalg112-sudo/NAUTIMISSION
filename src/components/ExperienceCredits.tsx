import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  GitBranch,
  Lightbulb,
  User,
} from 'lucide-react';
import {
  getExperienceCreditsLabels,
  type ExperienceCreditsData,
} from '../data/experienceCredits';
import type { AppLang } from '../locales';

interface ExperienceCreditsProps {
  credits: ExperienceCreditsData;
  lang: AppLang;
  defaultExpanded?: boolean;
  className?: string;
}

/**
 * Reusable creator recognition and inspiration component rendered on each
 * NAUTI educational experience's introduction screen.
 * Designed as a compact horizontal card for landscape smartphones with
 * a "Leer más" toggle when multi-paragraph inspiration text is supplied.
 */
export const ExperienceCredits: React.FC<ExperienceCreditsProps> = ({
  credits,
  lang,
  defaultExpanded = true,
  className = '',
}) => {
  const [sectionOpen, setSectionOpen] = useState<boolean>(defaultExpanded);
  const [textExpanded, setTextExpanded] = useState<boolean>(false);

  const labels = getExperienceCreditsLabels(lang);
  const { contributors, inspiration, teamUrl } = credits;

  const paragraphs = inspiration.description
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const hasMultipleParagraphs = paragraphs.length > 1;
  const isLongSingleParagraph =
    !hasMultipleParagraphs && inspiration.description.length > 210;
  const needsReadMore = hasMultipleParagraphs || isLongSingleParagraph;

  const InspirationIcon =
    inspiration.icon === 'branch' ? GitBranch : Lightbulb;

  return (
    <section
      aria-labelledby="experience-credits-heading"
      className={`rounded-2xl border border-[#48C5B5]/45 bg-[#101D35]/90 px-3.5 py-2.5 text-[#EAF4F2] shadow-[0_4px_0_#070e1c] ${className}`}
    >
      {/* Compact Header Strip */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setSectionOpen((prev) => !prev)}
          aria-expanded={sectionOpen}
          className="flex min-w-0 flex-1 items-center justify-between gap-2 text-left"
        >
          <span
            id="experience-credits-heading"
            className="text-[11px] font-black tracking-wider text-[#F2C66D] uppercase sm:text-xs"
          >
            {labels.sectionTitle}
          </span>

          <span className="inline-flex h-6 w-6 flex-none items-center justify-center rounded-lg border border-[#48C5B5]/35 bg-[#162747] text-[#48C5B5] transition hover:bg-[#1e355f]">
            {sectionOpen ? (
              <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </span>
        </button>
      </div>

      {/* Horizontal Compact Recognition + Inspiration Block */}
      {sectionOpen && (
        <div className="mt-2 grid grid-cols-1 gap-2.5 border-t border-[#48C5B5]/25 pt-2.5 md:grid-cols-12 md:items-start md:gap-4">
          {/* LEFT: Circular Portrait Photo + Contributor Details */}
          <div className="flex flex-col gap-2 md:col-span-5">
            {contributors.map((person) => (
              <div key={person.id} className="flex items-center gap-2.5">
                {person.photo ? (
                  <img
                    src={person.photo}
                    alt={person.photoAlt || person.name || labels.photoPlaceholderAlt}
                    className="h-12 w-12 flex-none rounded-full border-2 border-[#48C5B5] bg-[#162747] object-cover object-top shadow-sm sm:h-14 sm:w-14"
                    draggable={false}
                  />
                ) : (
                  <div
                    role="img"
                    aria-label={person.photoAlt || labels.photoPlaceholderAlt}
                    className="flex h-12 w-12 flex-none items-center justify-center rounded-full border-2 border-[#48C5B5]/60 bg-[#162747] text-[#48C5B5] sm:h-14 sm:w-14"
                  >
                    <User className="h-6 w-6" aria-hidden="true" />
                  </div>
                )}

                <div className="min-w-0 leading-tight">
                  <p className="text-[10px] font-black tracking-wide text-[#48C5B5] uppercase">
                    {person.role}
                  </p>
                  <p className="mt-0.5 text-xs font-black text-[#EAF4F2] sm:text-sm">
                    {person.name}
                  </p>
                  {person.affiliation && (
                    <p className="mt-0.5 text-[11px] font-bold text-[#F2C66D]">
                      {person.affiliation}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: Inspiration Heading, Icon & Verbatim Story with "Leer más" */}
          <div className="min-w-0 border-t border-[#48C5B5]/20 pt-2 md:col-span-7 md:border-t-0 md:border-l md:border-[#48C5B5]/25 md:pt-0 md:pl-3.5">
            <div className="flex items-center gap-1.5 text-[10px] font-black tracking-wide text-[#F2C66D] uppercase sm:text-[11px]">
              <InspirationIcon
                className="h-3.5 w-3.5 flex-none text-[#48C5B5]"
                aria-hidden="true"
              />
              <span>{inspiration.title || labels.inspiredByTitle}</span>
            </div>

            {hasMultipleParagraphs ? (
              <div className="mt-1 space-y-1.5 text-[11px] leading-snug font-semibold text-[#EAF4F2]/90 sm:text-xs">
                <p>{paragraphs[0]}</p>
                {textExpanded &&
                  paragraphs.slice(1).map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
              </div>
            ) : (
              <p
                className={`mt-1 whitespace-pre-line text-[11px] leading-snug font-semibold text-[#EAF4F2]/90 sm:text-xs ${
                  isLongSingleParagraph && !textExpanded ? 'line-clamp-3' : ''
                }`}
              >
                {inspiration.description}
              </p>
            )}

            {needsReadMore && (
              <button
                type="button"
                onClick={() => setTextExpanded((prev) => !prev)}
                aria-expanded={textExpanded}
                className="mt-1.5 inline-flex items-center gap-1 rounded-lg bg-[#48C5B5]/15 px-2 py-0.5 text-[10px] font-black text-[#48C5B5] transition hover:bg-[#48C5B5]/25 sm:text-[11px]"
              >
                <span>
                  {textExpanded ? labels.readLessLabel : labels.readMoreLabel}
                </span>
                {textExpanded ? (
                  <ChevronUp className="h-3 w-3" aria-hidden="true" />
                ) : (
                  <ChevronDown className="h-3 w-3" aria-hidden="true" />
                )}
              </button>
            )}

            {inspiration.references && inspiration.references.length > 0 && (
              <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                {inspiration.references.map((ref, idx) => (
                  <li key={idx} className="text-[11px] font-bold text-[#48C5B5]">
                    {ref.url ? (
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 underline hover:text-[#F2C66D]"
                      >
                        <span>{ref.title}</span>
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </a>
                    ) : (
                      <span>{ref.title}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {teamUrl && (
              <div className="mt-1.5">
                <a
                  href={teamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-black text-[#48C5B5] underline hover:text-[#F2C66D]"
                >
                  <span>{labels.teamLinkLabel}</span>
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
