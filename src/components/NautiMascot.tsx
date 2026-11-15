import React, { useState } from 'react';
import { Volume2, Square, Sparkles, AlertTriangle, Hand, Camera } from 'lucide-react';
import artemisSolarPhoto from '../assets/artemis1-orion-solar.jpg';
import {
  NautiCharacterRig,
  type NautiExpression,
  type NautiGaze,
  type NautiHandPose,
  type TickleIntensity,
} from './NautiCharacterRig';
import { UI_STRINGS } from '../data/uiStrings';
import type { AppLang } from '../data/missionData';
import { EduTooltip } from './EduTooltip';

export type NautiMood = NautiExpression;

interface NautiMascotProps {
  lang: AppLang;
  message: string;
  mood: NautiExpression;
  gaze: NautiGaze;
  handPose: NautiHandPose;
  isSpeaking: boolean;
  narrationBlocked?: boolean;
  mouthPulse: number;
  onListen: () => void;
  onStop: () => void;
  chapterBadge?: string;
  showRealPhotoButton?: boolean;
  onOpenRealPhoto?: () => void;
  tickleCaption?: string | null;
  onTickleSound?: (intensity: TickleIntensity) => void;
}

export const NautiMascot: React.FC<NautiMascotProps> = ({
  lang,
  message,
  mood,
  gaze,
  handPose,
  isSpeaking,
  narrationBlocked = false,
  mouthPulse,
  onListen,
  onStop,
  chapterBadge,
  showRealPhotoButton = false,
  onOpenRealPhoto,
  tickleCaption = null,
  onTickleSound,
}) => {
  const [hoverPreview, setHoverPreview] = useState<boolean>(false);
  const isDanger = mood === 'danger';
  const t = UI_STRINGS[lang];

  return (
    <div className="relative flex h-full flex-col justify-between gap-1.5 rounded-2xl border-2 border-[#00d2e0]/40 bg-[#07183d]/75 p-2.5 backdrop-blur-md sm:p-3">
      {/* Top Status Strip + Visible Replay / Stop Controls */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-1.5">
        <div
          className={`flex min-w-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black tracking-wide uppercase shadow-sm ${
            isDanger
              ? 'bg-[#ff5c6c] text-white'
              : 'bg-[#facc15] text-[#08265b]'
          }`}
        >
          {isDanger ? (
            <AlertTriangle className="h-3 w-3 flex-none" />
          ) : (
            <Sparkles className="h-3 w-3 flex-none" />
          )}
          <span className="truncate">{chapterBadge || 'NAUTI'}</span>
        </div>

        <div className="flex items-center gap-1">
          {narrationBlocked && !isSpeaking ? (
            <button
              type="button"
              onClick={onListen}
              aria-label={t.tapToListen}
              className="flex min-h-[34px] items-center gap-1 rounded-xl border-2 border-white bg-[#fde047] px-2.5 py-1 text-[11px] font-black text-[#08265b] shadow-sm transition hover:bg-[#fef08a] active:scale-95"
            >
              <Hand className="h-3.5 w-3.5" />
              <span>{t.tapToListen}</span>
            </button>
          ) : (
            <EduTooltip
              content={t.tooltipListenAgain}
              preferredSide="bottom"
              showInfoButton
              infoAriaLabel={t.tooltipInfoAria(t.listenAgain)}
              infoButtonClassName="h-5 w-5"
              className="inline-flex items-center gap-1"
            >
              <button
                type="button"
                onClick={onListen}
                aria-label={t.listenAgainAria}
                className="flex min-h-[34px] items-center gap-1 rounded-xl border border-[#00d2e0] bg-[#0c2e70] px-2.5 py-1 text-[11px] font-black text-[#9df8ff] transition hover:bg-[#13429b] active:scale-95"
              >
                <Volume2 className="h-3.5 w-3.5 text-[#34f0fa]" />
                <span>{t.listenAgain}</span>
              </button>
            </EduTooltip>
          )}

          {isSpeaking && (
            <EduTooltip
              content={t.tooltipStopVoice}
              preferredSide="bottom"
              className="inline-flex items-center"
            >
              <button
                type="button"
                onClick={onStop}
                aria-label={t.stopVoiceAria}
                className="flex min-h-[34px] items-center gap-1 rounded-xl border border-white bg-[#ff5c6c] px-2.5 py-1 text-[11px] font-black text-white shadow-sm transition active:scale-95"
              >
                <Square className="h-3 w-3 fill-current" />
                <span>{t.stopShort}</span>
              </button>
            </EduTooltip>
          )}
        </div>
      </div>

      {/* Live Floating NAUTI integrated directly into the starry space scene */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-visible">
        {/* Soft space glow behind NAUTI */}
        <div
          className={`pointer-events-none absolute h-28 w-28 rounded-full blur-2xl transition-colors duration-300 sm:h-36 sm:w-36 ${
            isDanger
              ? 'bg-[#ff5c6c]/30'
              : mood === 'celebrate' || mood === 'happy'
                ? 'bg-[#facc15]/30'
                : 'bg-[#00d2e0]/25'
          }`}
          aria-hidden="true"
        />

        <NautiCharacterRig
          expression={mood}
          gaze={gaze}
          handPose={handPose}
          isSpeaking={isSpeaking}
          mouthPulse={mouthPulse}
          className={
            showRealPhotoButton
              ? 'w-[74%] max-w-[195px]'
              : 'w-[82%] max-w-[235px]'
          }
          stickerRim
          onTickleSound={onTickleSound}
        />
      </div>

      {/* Speech Bubble integrated with scene */}
      <div
        className={`relative z-10 rounded-xl border-2 px-3 py-1.5 text-xs leading-snug font-bold shadow-[0_3px_0_#041029] sm:text-[13px] ${
          isDanger
            ? 'border-[#ff5c6c] bg-[#fff1f2] text-[#7f1d1d]'
            : 'border-white bg-[#f4fcff] text-[#08265b]'
        }`}
      >
        <div className="mb-0.5 flex items-center justify-between gap-2">
          <span className="text-[10px] font-black tracking-wider text-[#007e99] uppercase">
            {t.nautiSays}
          </span>
          {isSpeaking && (
            <span className="text-[10px] font-extrabold text-[#0284c7]">
              {t.speakingStatus}
            </span>
          )}
        </div>
        <p className="m-0">{tickleCaption || message}</p>
      </div>

      {/* Jornada 1 Educational NASA Artemis I Photo Button directly below NAUTI's dialogue */}
      {showRealPhotoButton && onOpenRealPhoto && (
        <div className="relative z-20">
          {hoverPreview && (
            <div
              role="tooltip"
              className="pointer-events-none absolute bottom-full left-1/2 z-40 mb-2 w-[235px] -translate-x-1/2 rounded-2xl border-2 border-[#fde047] bg-[#061634]/98 p-2 text-white shadow-[0_10px_24px_rgba(4,16,41,0.9)]"
            >
              <span className="mb-1 block text-[9px] font-black tracking-wider text-[#34f0fa] uppercase">
                {t.nasaPhotoBadge}
              </span>
              <div className="overflow-hidden rounded-lg border border-[#00d2e0]/40 bg-black">
                <img
                  src={artemisSolarPhoto}
                  alt={t.nasaPhotoTitle}
                  className="h-28 w-full object-contain"
                />
              </div>
              <p className="mt-1 text-[10px] leading-tight font-extrabold text-white">
                {t.nasaPhotoTitle}
              </p>
              <span className="mt-0.5 block text-[9px] font-bold text-[#fde047]">
                {t.nasaPhotoHoverHint}
              </span>
            </div>
          )}

          <EduTooltip
            content={t.tooltipNasaPhoto}
            preferredSide="right"
            showInfoButton
            infoAriaLabel={t.tooltipInfoAria(t.nasaPhotoBtn)}
            className="flex w-full items-center gap-1"
          >
            <button
              type="button"
              onPointerEnter={(e) => {
                if (e.pointerType === 'mouse') setHoverPreview(true);
              }}
              onPointerLeave={() => setHoverPreview(false)}
              onBlur={() => setHoverPreview(false)}
              onClick={() => {
                setHoverPreview(false);
                onOpenRealPhoto();
              }}
              className="flex min-h-[34px] min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-[#fde047]/90 bg-[#0c2e70]/95 px-2.5 py-1 text-[11px] font-black text-[#fef08a] shadow-[0_2px_0_#041029] transition hover:border-white hover:bg-[#14439c] hover:text-white active:translate-y-[1px]"
            >
              <Camera className="h-3.5 w-3.5 flex-none text-[#34f0fa]" />
              <span className="truncate">{t.nasaPhotoBtn}</span>
            </button>
          </EduTooltip>
        </div>
      )}
    </div>
  );
};
