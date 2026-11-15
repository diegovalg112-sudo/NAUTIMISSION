import React from 'react';
import type { DetectiveEvidenceVisualId } from '../types/detectivesNasa';

interface EvidenceVisualProps {
  visualId: DetectiveEvidenceVisualId;
  className?: string;
}

export const DetectiveEvidenceVisual: React.FC<EvidenceVisualProps> = ({
  visualId,
  className = 'h-16 w-24',
}) => {
  if (visualId === 'water_needs') {
    return (
      <svg
        viewBox="0 0 120 72"
        className={className}
        role="img"
        aria-hidden="true"
      >
        <rect
          x="2"
          y="2"
          width="116"
          height="68"
          rx="12"
          fill="#101D35"
          stroke="#48C5B5"
          strokeWidth="2"
        />
        {/* Water drop */}
        <path
          d="M32 16 C32 16, 20 31, 20 39 C20 46, 25.5 52, 32 52 C38.5 52, 44 46, 44 39 C44 31, 32 16, 32 16 Z"
          fill="#48C5B5"
        />
        <path
          d="M27 36 C26.5 40, 28 44, 31 46"
          stroke="#EAF4F2"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Drink pouch + food tray */}
        <rect
          x="56"
          y="18"
          width="22"
          height="30"
          rx="4"
          fill="#162747"
          stroke="#EAF4F2"
          strokeWidth="2"
        />
        <line
          x1="67"
          y1="18"
          x2="73"
          y2="11"
          stroke="#F2C66D"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="67" cy="33" r="5" fill="#48C5B5" />
        {/* Crew / Lab node */}
        <circle
          cx="97"
          cy="28"
          r="9"
          fill="#162747"
          stroke="#F2C66D"
          strokeWidth="2"
        />
        <path
          d="M86 52 C86 44, 108 44, 108 52"
          fill="#162747"
          stroke="#F2C66D"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (visualId === 'water_recovery_loop') {
    return (
      <svg
        viewBox="0 0 120 72"
        className={className}
        role="img"
        aria-hidden="true"
      >
        <rect
          x="2"
          y="2"
          width="116"
          height="68"
          rx="12"
          fill="#101D35"
          stroke="#48C5B5"
          strokeWidth="2"
        />
        {/* Circular recovery arrows */}
        <path
          d="M34 26 A22 22 0 0 1 82 24"
          fill="none"
          stroke="#48C5B5"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <polygon points="86,28 84,18 75,24" fill="#48C5B5" />
        <path
          d="M86 46 A22 22 0 0 1 38 48"
          fill="none"
          stroke="#F2C66D"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <polygon points="34,44 36,54 45,48" fill="#F2C66D" />
        {/* Center filter chamber */}
        <rect
          x="48"
          y="25"
          width="24"
          height="22"
          rx="5"
          fill="#162747"
          stroke="#EAF4F2"
          strokeWidth="2"
        />
        <path
          d="M60 29 C60 29, 55 36, 55 39 C55 42, 57.2 44, 60 44 C62.8 44, 65 42, 65 39 C65 36, 60 29, 60 29 Z"
          fill="#48C5B5"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 120 72"
      className={className}
      role="img"
      aria-hidden="true"
    >
      <rect
        x="2"
        y="2"
        width="116"
        height="68"
        rx="12"
        fill="#101D35"
        stroke="#48C5B5"
        strokeWidth="2"
      />
      {/* 98% gauge bar */}
      <rect
        x="14"
        y="22"
        width="92"
        height="18"
        rx="9"
        fill="#162747"
        stroke="#314975"
        strokeWidth="1.5"
      />
      <rect x="16" y="24" width="86" height="14" rx="7" fill="#48C5B5" />
      <rect x="103" y="24" width="2" height="14" rx="1" fill="#F2C66D" />
      <text
        x="60"
        y="56"
        textAnchor="middle"
        fill="#F2C66D"
        fontSize="13"
        fontWeight="900"
        fontFamily="monospace"
      >
        ~98%
      </text>
    </svg>
  );
};

export const CaseWaterFallbackDiagram: React.FC<{ className?: string }> = ({
  className = 'h-full w-full',
}) => (
  <svg
    viewBox="0 0 400 300"
    className={className}
    role="img"
    aria-hidden="true"
  >
    <rect width="400" height="300" rx="16" fill="#101D35" />
    <circle
      cx="96"
      cy="92"
      r="48"
      fill="#162747"
      stroke="#EAF4F2"
      strokeWidth="5"
    />
    <circle cx="96" cy="92" r="34" fill="#2c7be5" />
    <path
      d="M78 82 Q96 68 112 85 Q102 104 82 98 Z"
      fill="#48C5B5"
      opacity="0.85"
    />
    <rect
      x="166"
      y="96"
      width="82"
      height="104"
      rx="14"
      fill="#162747"
      stroke="#48C5B5"
      strokeWidth="4"
    />
    <rect
      x="276"
      y="110"
      width="68"
      height="90"
      rx="12"
      fill="#162747"
      stroke="#F2C66D"
      strokeWidth="4"
    />
    <path
      d="M207 96 L207 66 L310 66 L310 110"
      fill="none"
      stroke="#48C5B5"
      strokeWidth="8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M276 176 L248 176"
      fill="none"
      stroke="#F2C66D"
      strokeWidth="8"
      strokeLinecap="round"
    />
    <path
      d="M207 125 C207 125, 189 148, 189 161 C189 172, 197 180, 207 180 C217 180, 225 172, 225 161 C225 148, 207 125, 207 125 Z"
      fill="#48C5B5"
    />
  </svg>
);
