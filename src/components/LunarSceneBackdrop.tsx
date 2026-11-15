import React from 'react';
import type { GamePhase } from '../data/missionData';

interface LunarSceneBackdropProps {
  phase: GamePhase;
  step: number;
  isDanger: boolean;
  isVictory: boolean;
}

const SPARKLE_STARS = [
  { x: 68, y: 54, size: 12, delay: '0s', fourPoint: true },
  { x: 165, y: 110, size: 8, delay: '0.7s', fourPoint: false },
  { x: 245, y: 42, size: 14, delay: '1.2s', fourPoint: true },
  { x: 350, y: 86, size: 7, delay: '0.4s', fourPoint: false },
  { x: 470, y: 50, size: 11, delay: '1.8s', fourPoint: true },
  { x: 585, y: 98, size: 7, delay: '0.9s', fourPoint: false },
  { x: 690, y: 52, size: 13, delay: '1.5s', fourPoint: true },
  { x: 810, y: 96, size: 8, delay: '0.3s', fourPoint: false },
  { x: 930, y: 44, size: 12, delay: '1.1s', fourPoint: true },
  { x: 1030, y: 120, size: 9, delay: '0.6s', fourPoint: false },
  { x: 122, y: 185, size: 10, delay: '1.4s', fourPoint: true },
  { x: 520, y: 162, size: 8, delay: '1.9s', fourPoint: false },
  { x: 860, y: 175, size: 11, delay: '0.8s', fourPoint: true },
];

export const LunarSceneBackdrop: React.FC<LunarSceneBackdropProps> = ({
  phase,
  step,
  isDanger,
  isVictory,
}) => {
  const isNightChapter = phase === 'scene' && step === 4;
  const isSunriseChapter = phase === 'scene' && (step === 0 || step === 1);
  const isSignalChapter = phase === 'scene' && step === 3;

  const skyTop = isDanger
    ? '#240b24'
    : isNightChapter
      ? '#040e28'
      : '#07173b';

  const skyBottom = isDanger
    ? '#331232'
    : isNightChapter
      ? '#0a1e4b'
      : '#0d265c';

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Base midnight cosmic gradient matching NAUTI box lid */}
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{
          background: `radial-gradient(circle at 78% 16%, ${
            isDanger
              ? 'rgba(255, 92, 108, 0.24)'
              : isSunriseChapter
                ? 'rgba(250, 204, 21, 0.2)'
                : isVictory
                  ? 'rgba(0, 210, 224, 0.28)'
                  : 'rgba(0, 210, 224, 0.14)'
          }, transparent 52%), linear-gradient(180deg, ${skyTop} 0%, ${skyBottom} 72%, #13316d 100%)`,
        }}
      />

      <svg
        viewBox="0 0 1280 720"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <radialGradient id="kitMoonGrad" cx="35%" cy="32%" r="70%">
            <stop offset="0%" stopColor="#e2ecfb" />
            <stop offset="65%" stopColor="#a7bddf" />
            <stop offset="100%" stopColor="#728db8" />
          </radialGradient>
          <linearGradient id="lunarTerrainBack" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8fa7cc" />
            <stop offset="100%" stopColor="#657fa8" />
          </linearGradient>
          <linearGradient id="lunarTerrainFront" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d7e4f7" />
            <stop offset="100%" stopColor="#9eb5d9" />
          </linearGradient>
        </defs>

        {/* Golden-yellow 4-point sparkles & dots matching the kit artwork */}
        {SPARKLE_STARS.map((s, idx) =>
          s.fourPoint ? (
            <path
              key={idx}
              d={`M ${s.x} ${s.y - s.size} Q ${s.x} ${s.y} ${s.x + s.size} ${s.y} Q ${s.x} ${s.y} ${s.x} ${s.y + s.size} Q ${s.x} ${s.y} ${s.x - s.size} ${s.y} Q ${s.x} ${s.y} ${s.x} ${s.y - s.size} Z`}
              fill="#fde047"
              className="anim-star-twinkle"
              style={{ animationDelay: s.delay }}
            />
          ) : (
            <circle
              key={idx}
              cx={s.x}
              cy={s.y}
              r={s.size * 0.4}
              fill={idx % 2 === 0 ? '#fde047' : '#bae6fd'}
              className="anim-star-twinkle"
              style={{ animationDelay: s.delay }}
            />
          ),
        )}

        {/* Cratered Blue-Silver Moon in upper-right sky (as on NAUTI box lid) */}
        <g transform="translate(1155, 118)">
          <circle
            r="98"
            fill={isDanger ? 'rgba(255,92,108,0.12)' : 'rgba(186,230,253,0.12)'}
          />
          <circle r="76" fill="url(#kitMoonGrad)" stroke="#dbeafe" strokeWidth="2" strokeOpacity="0.4" />
          <ellipse cx="-26" cy="-18" rx="15" ry="12" fill="#7c96bf" opacity="0.7" />
          <circle cx="24" cy="-28" r="9" fill="#7c96bf" opacity="0.6" />
          <ellipse cx="18" cy="24" rx="18" ry="13" fill="#6f89b5" opacity="0.7" />
          <circle cx="-30" cy="26" r="7" fill="#7c96bf" opacity="0.55" />
          <circle cx="-4" cy="4" r="5" fill="#7c96bf" opacity="0.5" />
        </g>

        {/* Sunrise glow for Jornada 1 */}
        {isSunriseChapter && (
          <g transform="translate(260, 500)">
            <circle r="115" fill="rgba(250, 204, 21, 0.16)" />
            <circle r="54" fill="rgba(250, 204, 21, 0.3)" />
          </g>
        )}

        {/* Distant cratered lunar ridge */}
        <path
          d="M 0 545 Q 190 480 380 532 T 760 515 T 1120 530 L 1280 502 L 1280 720 L 0 720 Z"
          fill="url(#lunarTerrainBack)"
        />

        {/* White & Navy Geodesic Observatory Dome (Left, matching box lid & stickers) */}
        <g transform="translate(88, 458)">
          {/* Geodesic dome body */}
          <path
            d="M 16 92 A 64 58 0 0 1 144 92 Z"
            fill="#eef6ff"
            stroke="#08265b"
            strokeWidth="4"
          />
          {/* Dome vertical structural ribs */}
          <path
            d="M 80 34 V 92 M 50 41 Q 44 66 44 92 M 110 41 Q 116 66 116 92"
            fill="none"
            stroke="#7fa1cf"
            strokeWidth="2.5"
          />
          {/* Dome windows */}
          <rect x="30" y="70" width="16" height="14" rx="3" fill={isNightChapter ? '#facc15' : '#08265b'} />
          <rect x="56" y="70" width="18" height="14" rx="3" fill={isNightChapter ? '#facc15' : '#00c7d4'} />
          <rect x="86" y="70" width="18" height="14" rx="3" fill={isNightChapter ? '#facc15' : '#00c7d4'} />
          <rect x="114" y="70" width="16" height="14" rx="3" fill={isNightChapter ? '#facc15' : '#08265b'} />
          {/* Base foundation */}
          <rect x="8" y="90" width="144" height="14" rx="7" fill="#08265b" />
          {/* Beacon antenna */}
          <line x1="80" y1="34" x2="80" y2="16" stroke="#08265b" strokeWidth="3.5" />
          <circle cx="80" cy="14" r="5" fill={isDanger ? '#ff5c6c' : '#facc15'} />
          {/* Water conduit highlight on Jornada 3 (step 2) */}
          {phase === 'scene' && step === 2 && (
            <line
              x1="150"
              y1="94"
              x2="230"
              y2="94"
              stroke="#29b6f6"
              strokeWidth="6"
              strokeDasharray="10 6"
              strokeLinecap="round"
            />
          )}
        </g>

        {/* Satellite Dish (Right, matching box lid & stickers) */}
        <g transform="translate(1080, 446)">
          <rect x="34" y="54" width="14" height="44" rx="4" fill="#d7e4f7" stroke="#08265b" strokeWidth="3.5" />
          <rect x="22" y="94" width="38" height="10" rx="5" fill="#08265b" />
          <path
            d="M 10 26 Q 42 74 78 26 Z"
            fill="#eef6ff"
            stroke="#08265b"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <line x1="43" y1="45" x2="43" y2="12" stroke="#08265b" strokeWidth="3.5" />
          <circle cx="43" cy="10" r="5.5" fill={isDanger ? '#ff5c6c' : '#00d2e0'} stroke="#08265b" strokeWidth="2" />
          {(isSignalChapter || isVictory) && (
            <>
              <circle
                cx="43"
                cy="10"
                r="16"
                fill="none"
                stroke="#00d2e0"
                strokeWidth="2.5"
                className="anim-signal-pulse"
              />
              <circle
                cx="43"
                cy="10"
                r="26"
                fill="none"
                stroke="#facc15"
                strokeWidth="2"
                className="anim-signal-pulse"
                style={{ animationDelay: '0.6s' }}
              />
            </>
          )}
        </g>

        {/* Foreground Pale Lunar Ground with Stylized Craters */}
        <path
          d="M 0 582 Q 310 538 640 572 T 1280 558 L 1280 720 L 0 720 Z"
          fill="url(#lunarTerrainFront)"
        />
        <ellipse cx="185" cy="645" rx="74" ry="18" fill="#8fa7cc" stroke="#7590ba" strokeWidth="2" opacity="0.8" />
        <ellipse cx="565" cy="665" rx="58" ry="13" fill="#8fa7cc" stroke="#7590ba" strokeWidth="2" opacity="0.7" />
        <ellipse cx="975" cy="638" rx="95" ry="20" fill="#8fa7cc" stroke="#7590ba" strokeWidth="2" opacity="0.8" />
        <ellipse cx="1160" cy="676" rx="44" ry="10" fill="#8fa7cc" opacity="0.65" />
      </svg>
    </div>
  );
};
