import React from 'react';
import type { AppLang } from '../locales';

interface CountryFlagIconProps {
  lang: AppLang;
  className?: string;
}

/**
 * Crisp inline SVG country flags so language identifiers render reliably across
 * all browsers/OSes where regional-indicator emojis can fall back to letters.
 * Visual identifier for the language selector only.
 */
export const CountryFlagIcon: React.FC<CountryFlagIconProps> = ({
  lang,
  className = 'h-3.5 w-5',
}) => {
  const baseClass = `inline-block flex-none overflow-hidden rounded-[3px] ring-1 ring-white/40 shadow-[0_1px_2px_rgba(4,16,41,0.45)] ${className}`;

  if (lang === 'es') {
    return (
      <svg
        viewBox="0 0 24 16"
        className={baseClass}
        aria-hidden="true"
        focusable="false"
      >
        <rect width="24" height="16" fill="#AA151B" />
        <rect y="4" width="24" height="8" fill="#F1BF00" />
        {/* Simplified Spanish coat-of-arms mark */}
        <g transform="translate(5.5, 5.2)">
          <rect x="0.8" y="1.4" width="3.2" height="3.6" rx="0.8" fill="#AA151B" stroke="#8A1014" strokeWidth="0.35" />
          <rect x="1.4" y="2" width="2" height="2.2" rx="0.4" fill="#F1BF00" />
          <path d="M1.1 1.3 L2.4 0.3 L3.7 1.3 Z" fill="#D97706" />
          <rect x="0" y="1.8" width="0.55" height="3" rx="0.2" fill="#9CA3AF" />
          <rect x="4.25" y="1.8" width="0.55" height="3" rx="0.2" fill="#9CA3AF" />
        </g>
      </svg>
    );
  }

  if (lang === 'en') {
    const stripeHeight = 16 / 13;
    return (
      <svg
        viewBox="0 0 24 16"
        className={baseClass}
        aria-hidden="true"
        focusable="false"
      >
        <rect width="24" height="16" fill="#FFFFFF" />
        {Array.from({ length: 7 }).map((_, idx) => (
          <rect
            key={idx}
            y={idx * 2 * stripeHeight}
            width="24"
            height={stripeHeight + 0.08}
            fill="#B22234"
          />
        ))}
        <rect width="10.8" height={stripeHeight * 7} fill="#3C3B6E" />
        {/* Crisp star grid */}
        {[1.7, 3.6, 5.5, 7.4].map((cx, i) => (
          <React.Fragment key={`r1-${i}`}>
            <circle cx={cx} cy="1.8" r="0.45" fill="#FFFFFF" />
            <circle cx={cx} cy="4.4" r="0.45" fill="#FFFFFF" />
            <circle cx={cx} cy="7.0" r="0.45" fill="#FFFFFF" />
          </React.Fragment>
        ))}
        {[2.65, 4.55, 6.45, 8.35].map((cx, i) => (
          <React.Fragment key={`r2-${i}`}>
            <circle cx={cx} cy="3.1" r="0.45" fill="#FFFFFF" />
            <circle cx={cx} cy="5.7" r="0.45" fill="#FFFFFF" />
          </React.Fragment>
        ))}
      </svg>
    );
  }

  // gn-PY — Paraguay flag
  return (
    <svg
      viewBox="0 0 24 16"
      className={baseClass}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="24" height="5.4" y="0" fill="#D52B1E" />
      <rect width="24" height="5.4" y="5.3" fill="#FFFFFF" />
      <rect width="24" height="5.4" y="10.6" fill="#0038A8" />
      {/* Center national emblem: green wreath + gold star */}
      <circle
        cx="12"
        cy="8"
        r="1.95"
        fill="none"
        stroke="#007A3D"
        strokeWidth="0.7"
      />
      <polygon
        points="12,6.55 12.42,7.48 13.42,7.58 12.68,8.25 12.88,9.24 12,8.74 11.12,9.24 11.32,8.25 10.58,7.58 11.58,7.48"
        fill="#FACC15"
      />
    </svg>
  );
};
