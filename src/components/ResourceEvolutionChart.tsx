import React, { useState } from 'react';
import type { AppLang } from '../data/missionData';
import { UI_STRINGS } from '../data/uiStrings';
import type {
  ResourceKey,
  ResourceSnapshot,
  SnapshotStage,
} from '../utils/missionEngine';

interface ResourceEvolutionChartProps {
  lang: AppLang;
  snapshots: ResourceSnapshot[];
}

const SERIES_META: {
  key: ResourceKey;
  color: string;
  dotFill: string;
}[] = [
  { key: 'energy', color: '#eab308', dotFill: '#facc15' },
  { key: 'health', color: '#16a34a', dotFill: '#4ade80' },
  { key: 'water', color: '#0284c7', dotFill: '#38bdf8' },
  { key: 'research', color: '#7c3aed', dotFill: '#a78bfa' },
];

export const ResourceEvolutionChart: React.FC<ResourceEvolutionChartProps> = ({
  lang,
  snapshots,
}) => {
  const t = UI_STRINGS[lang];
  const [selectedIdx, setSelectedIdx] = useState<number>(
    Math.max(0, snapshots.length - 1),
  );

  const stageLabel = (stage: SnapshotStage, day: number): string => {
    switch (stage) {
      case 'start':
        return t.chartStageStart;
      case 'day5_delayed':
        return t.chartStageDelayed;
      case 'day5_final':
        return t.chartStageFinal;
      default:
        return t.chartStageDay(day);
    }
  };

  const labelByKey: Record<ResourceKey, string> = {
    energy: t.hudEnergy,
    health: t.hudHealth,
    water: t.hudWater,
    research: t.researchFullLabel,
  };

  // Compute y-scale comfortably from 0 to max(70, maxVal + 5)
  const maxVal = snapshots.reduce((acc, s) => {
    return Math.max(
      acc,
      s.resources.energy,
      s.resources.health,
      s.resources.water,
      s.resources.research,
    );
  }, 65);
  const yMax = Math.max(70, Math.ceil((maxVal + 5) / 10) * 10);

  const width = 560;
  const height = 210;
  const padLeft = 36;
  const padRight = 20;
  const padTop = 18;
  const padBottom = 34;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const xAt = (idx: number) =>
    snapshots.length <= 1
      ? padLeft + plotW / 2
      : padLeft + (idx / (snapshots.length - 1)) * plotW;

  const yAt = (val: number) => {
    const clamped = Math.max(0, Math.min(yMax, val));
    return padTop + plotH - (clamped / yMax) * plotH;
  };

  const activeSnap = snapshots[Math.min(selectedIdx, snapshots.length - 1)];

  return (
    <div className="space-y-2">
      <div className="rounded-xl border-2 border-[#bce8f5] bg-white p-2.5 shadow-[0_2px_0_#d7ebf5]">
        <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xs font-black text-[#08265b] sm:text-sm">
              {t.chartTitle}
            </h2>
            <p className="text-[10px] font-semibold text-[#52708b] sm:text-[11px]">
              {t.chartSubtitle}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-black">
            {SERIES_META.map((s) => (
              <span key={s.key} className="inline-flex items-center gap-1 text-[#08265b]">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full border border-[#08265b]/30"
                  style={{ backgroundColor: s.color }}
                />
                <span>{labelByKey[s.key]}</span>
              </span>
            ))}
          </div>
        </div>

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full select-none"
          role="img"
          aria-label={t.chartTitle}
        >
          {/* Horizontal grid lines */}
          {[0, 25, 50, 60, yMax].map((tick) => {
            const y = yAt(tick);
            const isThreshold25 = tick === 25;
            const isThreshold60 = tick === 60;
            return (
              <g key={tick}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke={
                    isThreshold25
                      ? '#ef4444'
                      : isThreshold60
                        ? '#7c3aed'
                        : '#e2f1f8'
                  }
                  strokeWidth={isThreshold25 || isThreshold60 ? 1.3 : 1}
                  strokeDasharray={isThreshold25 || isThreshold60 ? '4 4' : undefined}
                />
                <text
                  x={padLeft - 6}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="10"
                  fontWeight="800"
                  fill={
                    isThreshold25
                      ? '#dc2656'
                      : isThreshold60
                        ? '#6d28d9'
                        : '#52708b'
                  }
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Threshold annotations */}
          <text
            x={width - padRight}
            y={yAt(25) - 4}
            textAnchor="end"
            fontSize="9"
            fontWeight="800"
            fill="#dc2656"
          >
            {t.chartSustMin}
          </text>
          <text
            x={width - padRight}
            y={yAt(60) - 4}
            textAnchor="end"
            fontSize="9"
            fontWeight="800"
            fill="#6d28d9"
          >
            {t.chartResGoal}
          </text>

          {/* Vertical highlight line on active stage */}
          {activeSnap && (
            <line
              x1={xAt(Math.min(selectedIdx, snapshots.length - 1))}
              y1={padTop}
              x2={xAt(Math.min(selectedIdx, snapshots.length - 1))}
              y2={padTop + plotH}
              stroke="#00d2e0"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
          )}

          {/* Lines & Points */}
          {SERIES_META.map((series) => {
            const points = snapshots.map(
              (s, i) => `${xAt(i)},${yAt(s.resources[series.key])}`,
            );
            return (
              <g key={series.key}>
                {snapshots.length > 1 && (
                  <polyline
                    fill="none"
                    stroke={series.color}
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points.join(' ')}
                  />
                )}
                {snapshots.map((s, idx) => {
                  const cx = xAt(idx);
                  const cy = yAt(s.resources[series.key]);
                  const isActive = idx === selectedIdx;
                  return (
                    <circle
                      key={`${series.key}-${idx}`}
                      cx={cx}
                      cy={cy}
                      r={isActive ? 5.2 : 3.6}
                      fill={series.dotFill}
                      stroke="#08265b"
                      strokeWidth={isActive ? 2 : 1.3}
                      className="cursor-pointer"
                      onClick={() => setSelectedIdx(idx)}
                    />
                  );
                })}
              </g>
            );
          })}

          {/* X-axis stage labels */}
          {snapshots.map((s, idx) => {
            const x = xAt(idx);
            const isActive = idx === selectedIdx;
            return (
              <g
                key={`${s.stage}-${idx}`}
                className="cursor-pointer"
                onClick={() => setSelectedIdx(idx)}
              >
                <rect
                  x={x - 24}
                  y={padTop + plotH + 4}
                  width="48"
                  height="22"
                  rx="6"
                  fill={isActive ? '#08265b' : 'transparent'}
                />
                <text
                  x={x}
                  y={padTop + plotH + 18}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="800"
                  fill={isActive ? '#facc15' : '#15385e'}
                >
                  {stageLabel(s.stage, s.day)}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Active Stage Telemetry Pill Row */}
        {activeSnap && (
          <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#cbeaf4] bg-[#f4fcff] px-2.5 py-1.5 text-[11px] font-bold text-[#08265b]">
            <span className="font-black text-[#007e99]">
              {stageLabel(activeSnap.stage, activeSnap.day)}:
            </span>
            <div className="flex flex-wrap items-center gap-3 tabular-nums">
              <span>⚡ {t.hudEnergy}: {activeSnap.resources.energy}</span>
              <span>💚 {t.hudHealth}: {activeSnap.resources.health}</span>
              <span>💧 {t.hudWater}: {activeSnap.resources.water}</span>
              <span>🔬 {t.researchFullLabel}: {activeSnap.resources.research}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
