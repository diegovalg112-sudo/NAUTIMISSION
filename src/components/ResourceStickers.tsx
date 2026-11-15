import React from 'react';

interface StickerProps {
  className?: string;
}

/** Glossy water-drop icon matching the Agua card deck in the NAUTI kit */
export const AguaStickerIcon: React.FC<StickerProps> = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 36 36" className={className} aria-hidden="true">
    <circle cx="18" cy="18" r="16" fill="#0ea5e9" stroke="#ffffff" strokeWidth="2.2" />
    <path
      d="M18 7 C18 7 10.5 16.2 10.5 21.2 A7.5 7.5 0 0 0 25.5 21.2 C25.5 16.2 18 7 18 7 Z"
      fill="#7dd3fc"
      stroke="#08265b"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M14.5 20.5 A3.5 3.5 0 0 0 17 24.5"
      fill="none"
      stroke="#ffffff"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <circle cx="26.5" cy="11.5" r="1.6" fill="#fde047" />
  </svg>
);

/** Sunny lightning + solar icon matching the Energía card deck in the NAUTI kit */
export const EnergiaStickerIcon: React.FC<StickerProps> = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 36 36" className={className} aria-hidden="true">
    <circle cx="18" cy="18" r="16" fill="#facc15" stroke="#ffffff" strokeWidth="2.2" />
    <path
      d="M20 7.5 L11.5 19 H17.5 L15.5 28.5 L24.5 16.5 H18.5 Z"
      fill="#fef08a"
      stroke="#08265b"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

/** Emerald heart + ECG pulse icon matching the Salud card deck in the NAUTI kit */
export const SaludStickerIcon: React.FC<StickerProps> = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 36 36" className={className} aria-hidden="true">
    <circle cx="18" cy="18" r="16" fill="#22c55e" stroke="#ffffff" strokeWidth="2.2" />
    <path
      d="M18 26.8 C18 26.8 9.2 21.3 9.2 15.1 C9.2 12 11.6 9.8 14.3 9.8 C16.1 9.8 17.3 10.7 18 12 C18.7 10.7 19.9 9.8 21.7 9.8 C24.4 9.8 26.8 12 26.8 15.1 C26.8 21.3 18 26.8 18 26.8 Z"
      fill="#86efac"
      stroke="#08265b"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <polyline
      points="11.5,17.2 14.6,17.2 16.2,14.2 18.2,20.2 20,16.5 21.4,17.2 24.5,17.2"
      fill="none"
      stroke="#08265b"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Circular telemetry radar dial inspired by the NAUTI cardboard control stand */
export const RadarDialBadge: React.FC<{ isDanger?: boolean }> = ({ isDanger = false }) => (
  <svg viewBox="0 0 36 36" className="h-7 w-7 flex-none" aria-hidden="true">
    <circle
      cx="18"
      cy="18"
      r="16"
      fill="#071a3e"
      stroke={isDanger ? '#ff5c6c' : '#00d2e0'}
      strokeWidth="2"
    />
    <circle
      cx="18"
      cy="18"
      r="10"
      fill="none"
      stroke={isDanger ? '#ff5c6c' : '#00d2e0'}
      strokeWidth="1"
      strokeOpacity="0.45"
    />
    <circle
      cx="18"
      cy="18"
      r="4.5"
      fill="none"
      stroke={isDanger ? '#ff5c6c' : '#00d2e0'}
      strokeWidth="1"
      strokeOpacity="0.45"
    />
    <line
      x1="18"
      y1="3"
      x2="18"
      y2="33"
      stroke="#00d2e0"
      strokeWidth="0.9"
      strokeOpacity="0.35"
    />
    <line
      x1="3"
      y1="18"
      x2="33"
      y2="18"
      stroke="#00d2e0"
      strokeWidth="0.9"
      strokeOpacity="0.35"
    />
    <path
      d="M18 18 L28 9 A14 14 0 0 1 31 18 Z"
      fill={isDanger ? 'rgba(255, 92, 108, 0.35)' : 'rgba(0, 210, 224, 0.35)'}
    />
    <circle cx="24" cy="13" r="2" fill="#facc15" />
  </svg>
);
