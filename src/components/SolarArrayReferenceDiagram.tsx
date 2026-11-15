import React from 'react';
import type { EscuchaImaginaStrings } from '../data/escuchaImaginaStrings';

interface SolarArrayReferenceDiagramProps {
  strings: EscuchaImaginaStrings;
  referenceLabel: string;
  showPartLabels?: boolean;
  compact?: boolean;
}

/**
 * Simplified educational schematic of a horizontal spacecraft solar array wing.
 * Matches NAUTI's spoken spatial description element-for-element:
 * - Wide, thin horizontal rectangular solar wing
 * - Organized into 2 rows x 6 columns of equal photovoltaic rectangular panels
 * - Crisp straight separating grid lines between sections
 * - Left structural support arm connecting the array to the cylindrical equipment hub
 */
export const SolarArrayReferenceDiagram: React.FC<
  SolarArrayReferenceDiagramProps
> = ({
  strings,
  referenceLabel,
  showPartLabels = false,
  compact = false,
}) => {
  const rows = 2;
  const cols = 6;

  // Geometry constants inside 720x280 clean schematic canvas
  const arrayX = 166;
  const arrayY = 76;
  const arrayW = 510;
  const arrayH = 128;
  const pad = 6;
  const innerX = arrayX + pad;
  const innerY = arrayY + pad;
  const innerW = arrayW - pad * 2;
  const innerH = arrayH - pad * 2;
  const cellW = innerW / cols;
  const cellH = innerH / rows;

  return (
    <figure className="w-full overflow-hidden rounded-2xl border-2 border-[#48C5B5]/70 bg-[#EAF4F2] text-[#101D35] shadow-[0_5px_0_#070e1c]">
      <div
        className={`flex items-center justify-center bg-gradient-to-b from-[#f6fbfa] to-[#e4f2ef] ${
          compact ? 'px-3 py-2' : 'px-4 py-3 sm:px-6 sm:py-4'
        }`}
      >
        <svg
          viewBox="0 0 720 276"
          role="img"
          aria-label={referenceLabel}
          className={`w-full select-none ${
            compact ? 'max-h-[155px]' : 'max-h-[245px]'
          }`}
        >
          {/* Subtle architectural blueprint dot-grid backdrop */}
          <defs>
            <pattern
              id="nautiBlueprintGrid"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="12" cy="12" r="1" fill="#101D35" opacity="0.1" />
            </pattern>
            <linearGradient id="solarPanelBlue" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#163567" />
              <stop offset="100%" stopColor="#0f2347" />
            </linearGradient>
          </defs>

          <rect
            x="8"
            y="8"
            width="704"
            height="260"
            rx="16"
            fill="url(#nautiBlueprintGrid)"
            stroke="#b9dad5"
            strokeWidth="1.5"
          />

          {/* Left cylindrical equipment / spacecraft connection hub */}
          <g>
            <rect
              x="38"
              y="92"
              width="62"
              height="96"
              rx="12"
              fill="#cbd5e1"
              stroke="#101D35"
              strokeWidth="4"
            />
            <line
              x1="38"
              y1="118"
              x2="100"
              y2="118"
              stroke="#101D35"
              strokeWidth="2.5"
            />
            <line
              x1="38"
              y1="162"
              x2="100"
              y2="162"
              stroke="#101D35"
              strokeWidth="2.5"
            />
            <circle cx="69" cy="140" r="10" fill="#48C5B5" stroke="#101D35" strokeWidth="2.5" />
          </g>

          {/* Left structural support arm connecting equipment hub to solar array */}
          <g>
            <rect
              x="100"
              y="130"
              width="66"
              height="20"
              fill="#F2C66D"
              stroke="#101D35"
              strokeWidth="4"
            />
            {/* Small attachment bracket on hub and on solar wing */}
            <rect
              x="96"
              y="122"
              width="12"
              height="36"
              rx="3"
              fill="#48C5B5"
              stroke="#101D35"
              strokeWidth="3"
            />
            <rect
              x="156"
              y="120"
              width="14"
              height="40"
              rx="3"
              fill="#48C5B5"
              stroke="#101D35"
              strokeWidth="3"
            />
          </g>

          {/* Wide, thin rectangular outer solar array frame */}
          <rect
            x={arrayX}
            y={arrayY}
            width={arrayW}
            height={arrayH}
            rx="6"
            fill="#EAF4F2"
            stroke="#101D35"
            strokeWidth="5"
          />

          {/* Grid of 2 rows x 6 columns of equal photovoltaic rectangular sections */}
          {Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: cols }).map((__, c) => {
              const cx = innerX + c * cellW + 2.5;
              const cy = innerY + r * cellH + 2.5;
              const cw = cellW - 5;
              const ch = cellH - 5;
              return (
                <g key={`${r}-${c}`}>
                  <rect
                    x={cx}
                    y={cy}
                    width={cw}
                    height={ch}
                    rx="2"
                    fill="url(#solarPanelBlue)"
                    stroke="#101D35"
                    strokeWidth="2.5"
                  />
                  {/* Subtle photovoltaic busbar line */}
                  <line
                    x1={cx + cw / 2}
                    y1={cy + 3}
                    x2={cx + cw / 2}
                    y2={cy + ch - 3}
                    stroke="#48C5B5"
                    strokeWidth="1.5"
                    opacity="0.7"
                  />
                  <line
                    x1={cx + 3}
                    y1={cy + ch / 2}
                    x2={cx + cw - 3}
                    y2={cy + ch / 2}
                    stroke="#48C5B5"
                    strokeWidth="1"
                    opacity="0.45"
                  />
                </g>
              );
            }),
          )}

          {/* Crisp straight internal divider lines separating rows and columns */}
          <line
            x1={arrayX}
            y1={arrayY + arrayH / 2}
            x2={arrayX + arrayW}
            y2={arrayY + arrayH / 2}
            stroke="#101D35"
            strokeWidth="4"
          />
          {Array.from({ length: cols - 1 }).map((_, idx) => {
            const lx = innerX + (idx + 1) * cellW;
            return (
              <line
                key={`v-${idx}`}
                x1={lx}
                y1={arrayY}
                x2={lx}
                y2={arrayY + arrayH}
                stroke="#101D35"
                strokeWidth="4"
              />
            );
          })}

          {/* Optional teacher part labels toggled during Stage 4/5 */}
          {showPartLabels && (
            <g className="text-[11px] font-bold">
              {/* Hub callout */}
              <line
                x1="69"
                y1="92"
                x2="69"
                y2="46"
                stroke="#101D35"
                strokeWidth="2"
                strokeDasharray="3 3"
              />
              <rect
                x="18"
                y="20"
                width="174"
                height="26"
                rx="6"
                fill="#101D35"
              />
              <text
                x="105"
                y="37"
                textAnchor="middle"
                fill="#EAF4F2"
                fontSize="11"
                fontWeight="700"
              >
                {strings.diagramPartHub}
              </text>

              {/* Support callout */}
              <line
                x1="133"
                y1="150"
                x2="133"
                y2="226"
                stroke="#101D35"
                strokeWidth="2"
                strokeDasharray="3 3"
              />
              <rect
                x="44"
                y="226"
                width="178"
                height="26"
                rx="6"
                fill="#F2C66D"
                stroke="#101D35"
                strokeWidth="1.5"
              />
              <text
                x="133"
                y="243"
                textAnchor="middle"
                fill="#101D35"
                fontSize="11"
                fontWeight="800"
              >
                {strings.diagramPartSupport}
              </text>

              {/* Grid callout */}
              <line
                x1="421"
                y1="76"
                x2="421"
                y2="46"
                stroke="#101D35"
                strokeWidth="2"
                strokeDasharray="3 3"
              />
              <rect
                x="286"
                y="20"
                width="270"
                height="26"
                rx="6"
                fill="#48C5B5"
                stroke="#101D35"
                strokeWidth="1.5"
              />
              <text
                x="421"
                y="37"
                textAnchor="middle"
                fill="#101D35"
                fontSize="11"
                fontWeight="800"
              >
                {strings.diagramPartGrid}
              </text>

              {/* Photovoltaic cells callout */}
              <line
                x1="548"
                y1="192"
                x2="548"
                y2="226"
                stroke="#101D35"
                strokeWidth="2"
                strokeDasharray="3 3"
              />
              <rect
                x="456"
                y="226"
                width="184"
                height="26"
                rx="6"
                fill="#101D35"
              />
              <text
                x="548"
                y="243"
                textAnchor="middle"
                fill="#EAF4F2"
                fontSize="11"
                fontWeight="700"
              >
                {strings.diagramPartCells}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Explicit required label */}
      <figcaption className="flex items-center justify-between gap-2 border-t border-[#101D35]/15 bg-[#101D35] px-3.5 py-1.5 text-[11px] font-black text-[#EAF4F2]">
        <span>{referenceLabel}</span>
        <span className="text-[#48C5B5]">2 × 6</span>
      </figcaption>
    </figure>
  );
};
