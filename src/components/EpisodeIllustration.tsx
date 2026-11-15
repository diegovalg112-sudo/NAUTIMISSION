import React from 'react';
import type { EpisodeIllustrationKey } from '../data/episodesCatalog';

interface EpisodeIllustrationProps {
  kind: EpisodeIllustrationKey;
  muted?: boolean;
  className?: string;
}

export const EpisodeIllustration: React.FC<EpisodeIllustrationProps> = ({
  kind,
  muted = false,
  className = '',
}) => {
  return (
    <div
      className={`relative overflow-hidden bg-[#07173b] ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 320 120"
        className={`h-full w-full ${muted ? 'opacity-85 saturate-75' : ''}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id={`sky-${kind}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#051130" />
            <stop offset="65%" stopColor="#0c265a" />
            <stop offset="100%" stopColor="#163c80" />
          </linearGradient>
          <linearGradient id={`ground-${kind}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d7e4f7" />
            <stop offset="100%" stopColor="#94add2" />
          </linearGradient>
        </defs>

        {/* Cosmic sky & stars */}
        <rect width="320" height="120" fill={`url(#sky-${kind})`} />
        <circle cx="32" cy="22" r="1.4" fill="#fef08a" opacity="0.9" />
        <circle cx="88" cy="15" r="1.2" fill="#ffffff" opacity="0.75" />
        <circle cx="146" cy="26" r="1.6" fill="#9df8ff" opacity="0.85" />
        <circle cx="212" cy="18" r="1.3" fill="#fef08a" opacity="0.8" />
        <circle cx="278" cy="28" r="1.5" fill="#ffffff" opacity="0.75" />
        <circle cx="250" cy="44" r="1" fill="#9df8ff" opacity="0.6" />

        {/* Distant Earth */}
        <circle cx="282" cy="24" r="12" fill="#38bdf8" opacity="0.28" />
        <circle cx="282" cy="24" r="8.5" fill="#0ea5e9" />
        <path
          d="M277 20 C281 18, 286 21, 284 26 C282 29, 278 28, 276 24 Z"
          fill="#4ade80"
          opacity="0.85"
        />

        {/* Lunar Horizon */}
        <path
          d="M0 88 Q75 74 160 85 T320 82 L320 120 L0 120 Z"
          fill={`url(#ground-${kind})`}
        />
        <ellipse cx="46" cy="105" rx="18" ry="5" fill="#819bc3" opacity="0.55" />
        <ellipse cx="268" cy="108" rx="22" ry="5.5" fill="#819bc3" opacity="0.5" />

        {/* Episode 01: ¿Y si nos quedamos sin energía? — Solar Array, Power Gauge & Aurora Dome */}
        {kind === 'energy_shortage' && (
          <g>
            {/* Left solar array with subtle power link */}
            <g transform="translate(30, 56)">
              <rect x="20" y="18" width="4" height="14" rx="2" fill="#08265b" />
              <polygon
                points="2,14 42,6 46,20 6,28"
                fill="#0284c7"
                stroke="#e0f7ff"
                strokeWidth="2"
              />
              <line x1="14" y1="11" x2="18" y2="25" stroke="#9df8ff" strokeWidth="1.2" />
              <line x1="28" y1="9" x2="32" y2="23" stroke="#9df8ff" strokeWidth="1.2" />
              <path
                d="M48 20 L76 20"
                stroke="#facc15"
                strokeWidth="2"
                strokeDasharray="4 3"
              />
            </g>

            {/* Central Aurora Habitat Dome */}
            <g transform="translate(106, 36)">
              <path
                d="M12 52 C12 22, 96 22, 96 52 Z"
                fill="#e0f7ff"
                stroke="#ffffff"
                strokeWidth="3"
              />
              <path
                d="M22 50 C22 30, 86 30, 86 50 Z"
                fill="#34f0fa"
                opacity="0.45"
              />
              <rect x="8" y="48" width="92" height="10" rx="5" fill="#0c2d6e" />
              <rect x="24" y="41" width="14" height="7" rx="2" fill="#fde047" />
              <rect x="47" y="41" width="14" height="7" rx="2" fill="#fde047" />
              <rect x="70" y="41" width="14" height="7" rx="2" fill="#fde047" />
              <line x1="54" y1="22" x2="54" y2="10" stroke="#ffffff" strokeWidth="2.5" />
              <circle cx="54" cy="9" r="3.5" fill="#facc15" />
            </g>

            {/* Connected Water + Battery Reserve Module */}
            <g transform="translate(226, 54)">
              <path d="M-24 22 L4 22" stroke="#34f0fa" strokeWidth="2" strokeDasharray="4 3" />
              <rect
                x="4"
                y="8"
                width="38"
                height="26"
                rx="8"
                fill="#f4fcff"
                stroke="#08265b"
                strokeWidth="2"
              />
              <rect x="11" y="14" width="10" height="14" rx="2.5" fill="#38bdf8" />
              <rect x="25" y="14" width="10" height="14" rx="2.5" fill="#facc15" />
              <path d="M30 16 L28 21 L31 21 L29 26" stroke="#08265b" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </g>
        )}

        {/* Episode 02: ¿Y si algo falla en Base Aurora? — Base System Diagnostic & Repair Beacon */}
        {kind === 'system_malfunction' && (
          <g>
            {/* Connected power/water conduit line */}
            <path
              d="M72 78 L112 78 M208 78 L244 78"
              stroke="#9df8ff"
              strokeWidth="2.5"
              strokeDasharray="5 3"
            />

            {/* Left Auxiliary Tank */}
            <g transform="translate(36, 58)">
              <rect
                x="0"
                y="8"
                width="36"
                height="24"
                rx="7"
                fill="#e0f7ff"
                stroke="#08265b"
                strokeWidth="2"
              />
              <rect x="8" y="14" width="20" height="10" rx="3" fill="#38bdf8" />
            </g>

            {/* Central Aurora Dome with Diagnostic Alert Beacon */}
            <g transform="translate(106, 36)">
              <path
                d="M12 52 C12 22, 96 22, 96 52 Z"
                fill="#dbeafe"
                stroke="#ffffff"
                strokeWidth="3"
              />
              <rect x="8" y="48" width="92" height="10" rx="5" fill="#0c2d6e" />
              <rect x="24" y="41" width="14" height="7" rx="2" fill="#facc15" />
              <rect x="47" y="41" width="14" height="7" rx="2" fill="#fb923c" />
              <rect x="70" y="41" width="14" height="7" rx="2" fill="#fde047" />
              {/* Alert Triangle Badge on Dome */}
              <polygon
                points="54,18 65,37 43,37"
                fill="#facc15"
                stroke="#08265b"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <line x1="54" y1="24" x2="54" y2="30" stroke="#08265b" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="54" cy="33.5" r="1.3" fill="#08265b" />
            </g>

            {/* Right Engineering Control Panel */}
            <g transform="translate(242, 54)">
              <rect
                x="0"
                y="8"
                width="36"
                height="26"
                rx="6"
                fill="#f4fcff"
                stroke="#08265b"
                strokeWidth="2"
              />
              <circle cx="12" cy="18" r="4" fill="#fb923c" />
              <circle cx="24" cy="18" r="4" fill="#34f0fa" />
              <rect x="8" y="25" width="20" height="4" rx="2" fill="#0c2d6e" />
            </g>
          </g>
        )}

        {/* Episode 03: ¿Y si debemos producir nuestros alimentos? — Connected Lunar Greenhouse */}
        {kind === 'food_production' && (
          <g>
            {/* Outer greenhouse glass dome */}
            <g transform="translate(96, 28)">
              <path
                d="M10 62 C10 18, 126 18, 126 62 Z"
                fill="#0ea5e9"
                fillOpacity="0.22"
                stroke="#9df8ff"
                strokeWidth="3"
              />
              <path
                d="M30 58 C30 30, 106 30, 106 58"
                fill="none"
                stroke="#fde047"
                strokeWidth="2"
                strokeDasharray="4 3"
              />
              <circle cx="68" cy="28" r="4" fill="#fde047" />
              <rect x="16" y="54" width="104" height="10" rx="5" fill="#0c2d6e" />

              {/* Lunar sprouts */}
              <g transform="translate(32, 39)">
                <line x1="8" y1="15" x2="8" y2="5" stroke="#22c55e" strokeWidth="2.5" />
                <ellipse cx="4" cy="6" rx="5" ry="3" fill="#4ade80" transform="rotate(-25 4 6)" />
                <ellipse cx="12" cy="6" rx="5" ry="3" fill="#4ade80" transform="rotate(25 12 6)" />
              </g>
              <g transform="translate(60, 35)">
                <line x1="8" y1="19" x2="8" y2="6" stroke="#16a34a" strokeWidth="2.8" />
                <ellipse cx="3" cy="8" rx="6" ry="3.5" fill="#4ade80" transform="rotate(-28 3 8)" />
                <ellipse cx="13" cy="8" rx="6" ry="3.5" fill="#86efac" transform="rotate(28 13 8)" />
                <circle cx="8" cy="4" r="3" fill="#ff5c6c" />
              </g>
              <g transform="translate(88, 39)">
                <line x1="8" y1="15" x2="8" y2="5" stroke="#22c55e" strokeWidth="2.5" />
                <ellipse cx="4" cy="6" rx="5" ry="3" fill="#4ade80" transform="rotate(-25 4 6)" />
                <ellipse cx="12" cy="6" rx="5" ry="3" fill="#4ade80" transform="rotate(25 12 6)" />
              </g>
            </g>

            {/* Water recovery canister connected to greenhouse */}
            <path d="M74 78 L106 78" stroke="#38bdf8" strokeWidth="2.2" strokeDasharray="4 3" />
            <rect
              x="40"
              y="66"
              width="34"
              height="22"
              rx="6"
              fill="#e0f7ff"
              stroke="#08265b"
              strokeWidth="2"
            />
            <rect x="48" y="72" width="18" height="9" rx="3" fill="#38bdf8" />

            {/* Solar feed panel on right */}
            <g transform="translate(244, 58)">
              <rect x="16" y="16" width="4" height="12" rx="2" fill="#08265b" />
              <polygon
                points="0,12 34,5 38,17 4,24"
                fill="#0284c7"
                stroke="#e0f7ff"
                strokeWidth="1.8"
              />
            </g>
          </g>
        )}

        {/* Episode 04: ¿Y si una tormenta solar nos sorprende? — Solar Storm & Shielded Base */}
        {kind === 'solar_storm' && (
          <g>
            {/* Glowing solar storm corona on upper left */}
            <circle cx="38" cy="22" r="28" fill="#facc15" opacity="0.18" />
            <circle cx="38" cy="22" r="18" fill="#f59e0b" opacity="0.35" />
            <circle cx="38" cy="22" r="11" fill="#fde047" />
            <path
              d="M54 34 Q82 44 108 58"
              fill="none"
              stroke="#fde047"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.7"
            />
            <path
              d="M62 24 Q96 30 128 44"
              fill="none"
              stroke="#fb923c"
              strokeWidth="2"
              strokeDasharray="3 4"
              opacity="0.6"
            />

            {/* Aurora Base Relay Dish */}
            <g transform="translate(132, 34)">
              <rect x="28" y="34" width="12" height="22" rx="3" fill="#0c2d6e" />
              <path
                d="M14 26 Q34 46 56 18 Z"
                fill="#e0f7ff"
                stroke="#ffffff"
                strokeWidth="2.5"
              />
              <line x1="36" y1="28" x2="48" y2="12" stroke="#08265b" strokeWidth="2.5" />
              <circle cx="49" cy="11" r="3.5" fill="#facc15" />

              <path
                d="M58 6 Q68 12 64 22"
                fill="none"
                stroke="#34f0fa"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <path
                d="M66 2 Q78 12 72 26"
                fill="none"
                stroke="#9df8ff"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.8"
              />
            </g>

            {/* Radiation-shielded dome */}
            <g transform="translate(216, 56)">
              <path
                d="M6 34 C6 12, 62 12, 62 34 Z"
                fill="#0c2d6e"
                stroke="#34f0fa"
                strokeWidth="2.5"
              />
              <rect x="20" y="24" width="10" height="5" rx="1.5" fill="#fde047" />
              <rect x="38" y="24" width="10" height="5" rx="1.5" fill="#fde047" />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
