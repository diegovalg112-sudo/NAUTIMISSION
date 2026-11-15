import React, { useEffect, useState } from 'react';
import {
  Camera,
  Calendar,
  ExternalLink,
  Volume2,
  Square,
  X,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import artemisSolarPhoto from '../assets/artemis1-orion-solar.jpg';
import { UI_STRINGS } from '../data/uiStrings';
import type { AppLang } from '../data/missionData';
import { EduTooltip } from './EduTooltip';

export const ARTEMIS_PHOTO_ORIGINAL_URL =
  'https://www.asc-csa.gc.ca/images/recherche/tiles/0d8d0b49-159f-4773-9717-26ca2a13ca9b.jpg';

interface NasaPhotoModalProps {
  open: boolean;
  lang: AppLang;
  onClose: () => void;
  isSpeaking?: boolean;
  onReplayComment?: () => void;
  onStopVoice?: () => void;
}

export const NasaPhotoModal: React.FC<NasaPhotoModalProps> = ({
  open,
  lang,
  onClose,
  isSpeaking = false,
  onReplayComment,
  onStopVoice,
}) => {
  const [imgStage, setImgStage] = useState<'local' | 'remote' | 'error'>('local');

  useEffect(() => {
    if (!open) return;
    setImgStage('local');
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const t = UI_STRINGS[lang];
  const activeSrc =
    imgStage === 'local' ? artemisSolarPhoto : ARTEMIS_PHOTO_ORIGINAL_URL;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#040f26]/85 p-2.5 backdrop-blur-sm sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t.nasaPhotoTitle}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="cockpit-scroll flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border-2 border-[#00d2e0] bg-[#08204d] text-[#f4fcff] shadow-[0_10px_28px_rgba(4,16,41,0.85)]">
        {/* Top Modal Header */}
        <div className="flex flex-none items-center justify-between gap-2 border-b border-[#00d2e0]/30 bg-[#061634] px-3.5 py-2.5 sm:px-4">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-8 w-8 flex-none items-center justify-center rounded-xl bg-[#facc15] text-[#08265b] shadow-sm">
              <Camera className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1 text-[10px] font-black tracking-wider text-[#34f0fa] uppercase">
                <Sparkles className="h-3 w-3 text-[#fde047]" />
                <span>{t.nasaPhotoBadge}</span>
              </span>
              <h2 className="truncate text-sm font-black text-white sm:text-base">
                {t.nasaPhotoTitle}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.nasaPhotoClose}
            className="flex h-9 w-9 flex-none items-center justify-center rounded-xl border border-[#00d2e0]/50 bg-[#0c2e70] text-white transition hover:bg-[#15459e] active:scale-95"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* 16:9 Side-by-Side Body: Uncropped Photo Left + Explanation & Credits Right */}
        <div className="cockpit-scroll grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-y-auto p-3 sm:grid-cols-12 sm:gap-4 sm:p-4">
          {/* Original Real Photo (zero cropping: object-contain on deep space black) */}
          <div className="flex items-center justify-center rounded-xl border-2 border-[#00d2e0]/45 bg-black p-1.5 sm:col-span-7">
            {imgStage === 'error' ? (
              <div className="flex flex-col items-center justify-center gap-2 p-5 text-center">
                <AlertCircle className="h-8 w-8 text-[#fde047]" />
                <p className="max-w-xs text-xs font-bold text-[#e6faff]">
                  {t.nasaPhotoError}
                </p>
                <a
                  href={ARTEMIS_PHOTO_ORIGINAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#00d2e0] px-3 py-1.5 text-xs font-black text-[#08265b] hover:bg-[#34f0fa]"
                >
                  <span>{t.nasaPhotoViewOriginal}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            ) : (
              <img
                src={activeSrc}
                alt={t.nasaPhotoTitle}
                onError={() => {
                  setImgStage((prev) => (prev === 'local' ? 'remote' : 'error'));
                }}
                className="max-h-[54dvh] w-full rounded-lg object-contain"
              />
            )}
          </div>

          {/* Scientific Info, Attribution & NAUTI Commentary */}
          <div className="flex flex-col justify-between gap-2.5 sm:col-span-5">
            <div className="space-y-2.5">
              <p className="text-xs leading-relaxed font-semibold text-[#e6faff] sm:text-[13px]">
                {t.nasaPhotoDesc}
              </p>

              {/* Metadata & Required Credits */}
              <div className="space-y-1 rounded-xl border border-[#00d2e0]/35 bg-[#061634]/90 p-2.5 text-[11px] text-[#cfeefa]">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 flex-none text-[#fde047]" />
                  <span>
                    <strong className="text-white">{t.nasaPhotoDateLabel}</strong>{' '}
                    {t.nasaPhotoDate}
                  </span>
                </div>
                <div>
                  <strong className="text-white">{t.nasaPhotoCreditLabel}</strong>{' '}
                  {t.nasaPhotoCredit}
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  <strong className="text-white">{t.nasaPhotoSourceLabel}</strong>
                  <span>{t.nasaPhotoSource}</span>
                  <a
                    href={ARTEMIS_PHOTO_ORIGINAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-[#34f0fa] underline hover:text-[#fde047]"
                  >
                    <span>{t.nasaPhotoViewOriginal}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* NAUTI Commentary Card + Replay Controls */}
              <div className="rounded-xl border-2 border-white bg-[#f4fcff] p-2.5 text-[#08265b] shadow-[0_3px_0_#041029]">
                <div className="mb-1 flex items-center justify-between gap-1.5">
                  <span className="text-[10px] font-black tracking-wider text-[#007e99] uppercase">
                    {t.nautiSays}
                  </span>
                  <div className="flex items-center gap-1">
                    {onReplayComment && (
                      <EduTooltip
                        content={t.tooltipListenAgain}
                        preferredSide="top"
                        showInfoButton
                        infoAriaLabel={t.tooltipInfoAria(t.listenAgain)}
                        infoButtonClassName="h-5 w-5"
                      >
                        <button
                          type="button"
                          onClick={onReplayComment}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#08265b] px-2 py-0.5 text-[10px] font-black text-[#9df8ff] hover:bg-[#0e3c8d]"
                        >
                          <Volume2 className="h-3 w-3 text-[#34f0fa]" />
                          <span>{t.listenAgain}</span>
                        </button>
                      </EduTooltip>
                    )}
                    {isSpeaking && onStopVoice && (
                      <button
                        type="button"
                        onClick={onStopVoice}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#ff5c6c] px-2 py-0.5 text-[10px] font-black text-white"
                      >
                        <Square className="h-2.5 w-2.5 fill-current" />
                        <span>{t.stopShort}</span>
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-[11px] leading-snug font-bold">
                  {t.nasaPhotoNautiComment}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[40px] rounded-xl bg-[#facc15] px-5 py-1.5 text-xs font-black text-[#08265b] shadow-[0_3px_0_#b45309] transition hover:bg-[#fde047] active:translate-y-[1px]"
              >
                {t.nasaPhotoClose}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
