import React, { useEffect, useRef, useState } from 'react';
import {
  Music,
  Volume2,
  VolumeX,
  Sparkles,
  Mic,
  SlidersHorizontal,
  X,
  RotateCcw,
  Square,
  Info,
} from 'lucide-react';
import type { MusicAudioControls } from '../hooks/useMusicAudio';
import type { SpeechControlsState } from '../hooks/useSpeech';
import { playUiTone } from '../utils/soundFx';
import { EduTooltip } from './EduTooltip';
import { LanguageSelector } from './LanguageSelector';
import { AUDIO_STRINGS, UI_STRINGS } from '../data/uiStrings';

interface SoundControlButtonProps {
  audio: MusicAudioControls;
  speech: SpeechControlsState;
  onReplayCurrent?: () => void;
  onOpenVoiceModal: () => void;
}

export const SoundControlButton: React.FC<SoundControlButtonProps> = ({
  audio,
  speech,
  onReplayCurrent,
  onOpenVoiceModal,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const t = AUDIO_STRINGS[audio.audioLang];
  const ui = UI_STRINGS[audio.audioLang];
  const isMusicActive = audio.musicEnabled && audio.musicVolume > 0;
  const allMuted = !isMusicActive && !audio.sfxEnabled && speech.volume === 0;
  const showGuaraniSilentNotice =
    audio.audioLang === 'gn-PY' &&
    !speech.isGuaraniVoiceSupported &&
    speech.guaraniFallbackMode === 'none';

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('pointerdown', handleOutside);
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('pointerdown', handleOutside);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [open]);

  const handleToggleMasterMute = () => {
    if (allMuted || isMusicActive || audio.sfxEnabled) {
      if (isMusicActive || audio.sfxEnabled) {
        audio.setMusicEnabled(false);
        audio.setSfxEnabled(false);
        speech.stop();
      } else {
        audio.setMusicEnabled(true);
        if (audio.musicVolume === 0) audio.setMusicVolume(0.45);
        audio.setSfxEnabled(true);
        if (speech.volume === 0) speech.setVolume(0.92);
        playUiTone('tap', true, speech.isSpeaking);
      }
    } else {
      audio.setMusicEnabled(true);
      if (audio.musicVolume === 0) audio.setMusicVolume(0.45);
      audio.setSfxEnabled(true);
      if (speech.volume === 0) speech.setVolume(0.92);
      playUiTone('tap', true, speech.isSpeaking);
    }
  };

  const anySoundActive = isMusicActive || audio.sfxEnabled || speech.volume > 0;

  return (
    <div ref={containerRef} className="relative flex-none">
      {/* Persistent Top-Right Corner Sound Button */}
      <EduTooltip
        content={ui.tooltipSound}
        preferredSide="bottom"
        className="relative inline-flex"
      >
        <button
          type="button"
          onClick={() => {
            audio.unlockAndStart();
            speech.markUserUnlocked();
            playUiTone('tap', audio.sfxEnabled, speech.isSpeaking);
            setOpen((v) => !v);
          }}
          aria-expanded={open}
          aria-label={t.panelTitle}
          className={`flex min-h-[36px] items-center gap-1.5 rounded-xl border-2 px-2.5 py-1 text-xs font-black shadow-[0_2px_0_#041029] transition active:scale-95 ${
            open
              ? 'border-[#fde047] bg-[#facc15] text-[#08265b]'
              : anySoundActive
                ? 'border-[#00d2e0] bg-[#0c2e70]/95 text-[#9df8ff] hover:bg-[#13429b]'
                : 'border-[#64748b] bg-[#0f172a]/95 text-[#cbd5e1] hover:bg-[#1e293b]'
          }`}
        >
          {anySoundActive ? (
            <Music
              className={`h-3.5 w-3.5 ${open ? 'text-[#08265b]' : 'text-[#34f0fa]'}`}
            />
          ) : (
            <VolumeX className="h-3.5 w-3.5 text-[#94a3b8]" />
          )}
          <span className="hidden sm:inline">{t.buttonLabel}</span>
        </button>
      </EduTooltip>

      {/* Kawaii Space Audio Popover Panel */}
      {open && (
        <div
          role="dialog"
          aria-label={t.panelTitle}
          className="cockpit-scroll fixed top-12 right-2.5 z-50 max-h-[82dvh] w-[308px] overflow-y-auto rounded-2xl border-2 border-white bg-[#08265b]/98 p-3 text-white shadow-[0_8px_24px_rgba(4,16,41,0.75)] backdrop-blur-md sm:right-4 sm:w-[348px]"
        >
          {/* Header + Trilingual Selector */}
          <div className="mb-2.5 flex flex-col gap-2 border-b border-[#00d2e0]/25 pb-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#00d2e0] text-[#08265b]">
                  <Volume2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs leading-none font-black text-white">
                    {t.panelTitle}
                  </h3>
                  <span className="mt-0.5 block text-[10px] font-bold text-[#fde047]">
                    ♫ {t.themes[audio.currentTheme]}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t.closeAria}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0c2e70] text-[#9df8ff] hover:bg-[#13429b]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <LanguageSelector
              value={audio.audioLang}
              onChange={audio.setAudioLang}
              variant="compact"
              className="w-fit"
            />
          </div>

          <div className="space-y-2">
            {/* 1. Music Toggle + 0-100% Volume Slider */}
            <div className="rounded-xl border border-[#00d2e0]/30 bg-[#061634]/85 p-2.5">
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#e6faff]">
                  <Music className="h-3.5 w-3.5 text-[#34f0fa]" />
                  <span>{t.music}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="tabular-nums text-[11px] font-black text-[#fde047]">
                    {audio.musicEnabled
                      ? `${Math.round(audio.musicVolume * 100)} %`
                      : '0 %'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      playUiTone('tap', audio.sfxEnabled, speech.isSpeaking);
                      audio.toggleMusic();
                    }}
                    className={`min-h-[28px] rounded-lg px-2.5 text-[11px] font-black transition ${
                      audio.musicEnabled
                        ? 'bg-[#00d2e0] text-[#08265b]'
                        : 'bg-[#12326b] text-[#98d9e8]'
                    }`}
                  >
                    {audio.musicEnabled ? t.on : t.off}
                  </button>
                </div>
              </div>
              <input
                type="range"
                aria-label={t.music}
                min={0}
                max={100}
                step={1}
                value={
                  audio.musicEnabled ? Math.round(audio.musicVolume * 100) : 0
                }
                onChange={(e) => {
                  const pct = Number(e.target.value);
                  audio.unlockAndStart();
                  if (pct > 0 && !audio.musicEnabled) {
                    audio.setMusicEnabled(true);
                  }
                  audio.setMusicVolume(pct / 100);
                }}
                className="w-full accent-[#00d2e0]"
              />
            </div>

            {/* 2. NAUTI Voice Volume + Auto-Narration Toggle + Honest gn-PY status */}
            <div className="rounded-xl border border-[#00d2e0]/30 bg-[#061634]/85 p-2.5">
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#e6faff]">
                  <Mic className="h-3.5 w-3.5 text-[#fde047]" />
                  <span>{t.voice}</span>
                </div>
                <span className="tabular-nums text-[11px] font-black text-[#fde047]">
                  {Math.round(speech.volume * 100)} %
                </span>
              </div>
              <input
                type="range"
                aria-label={t.voice}
                min={0}
                max={100}
                step={5}
                value={Math.round(speech.volume * 100)}
                onChange={(e) => speech.setVolume(Number(e.target.value) / 100)}
                className="w-full accent-[#facc15]"
              />

              {showGuaraniSilentNotice && speech.limitationNote && (
                <div className="mt-2 flex items-start gap-1.5 rounded-lg border border-[#fde047]/45 bg-[#0c2454] px-2 py-1.5 text-[10px] leading-snug font-semibold text-[#fef08a]">
                  <Info className="mt-0.5 h-3 w-3 flex-none text-[#facc15]" />
                  <span>{speech.limitationNote}</span>
                </div>
              )}

              {/* Auto-narration switch */}
              <div className="mt-2 flex items-center justify-between gap-2 border-t border-[#00d2e0]/20 pt-2">
                <span className="text-[11px] font-bold text-[#d9f7ff]">
                  {t.autoNarrate}
                </span>
                <button
                  type="button"
                  onClick={() => speech.setAutoNarrate(!speech.autoNarrate)}
                  className={`min-h-[28px] rounded-lg px-2.5 text-[11px] font-black transition ${
                    speech.autoNarrate
                      ? 'bg-[#00d2e0] text-[#08265b]'
                      : 'bg-[#12326b] text-[#98d9e8]'
                  }`}
                >
                  {speech.autoNarrate ? t.on : t.off}
                </button>
              </div>

              {/* Replay & Stop inline actions */}
              {onReplayCurrent && (
                <div className="mt-2 flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      speech.markUserUnlocked();
                      onReplayCurrent();
                    }}
                    className="flex min-h-[32px] flex-1 items-center justify-center gap-1 rounded-lg bg-[#0c2e70] px-2 text-[11px] font-black text-[#9df8ff] hover:bg-[#13429b]"
                  >
                    <RotateCcw className="h-3 w-3 text-[#34f0fa]" />
                    <span>{t.replay}</span>
                  </button>
                  {speech.isSpeaking && (
                    <button
                      type="button"
                      onClick={speech.stop}
                      className="flex min-h-[32px] items-center justify-center gap-1 rounded-lg bg-[#ff5c6c] px-2.5 text-[11px] font-black text-white"
                    >
                      <Square className="h-3 w-3 fill-current" />
                      <span>{t.stop}</span>
                    </button>
                  )}
                </div>
              )}

              <p className="mt-1.5 text-[10px] font-semibold text-[#9df8ff]/80">
                {t.duckHint}
              </p>
            </div>

            {/* 3. Sound Effects Toggle */}
            <div className="flex items-center justify-between rounded-xl border border-[#00d2e0]/30 bg-[#061634]/85 px-2.5 py-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#e6faff]">
                <Sparkles className="h-3.5 w-3.5 text-[#facc15]" />
                <span>{t.effects}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const next = !audio.sfxEnabled;
                  audio.setSfxEnabled(next);
                  if (next) playUiTone('science', true, speech.isSpeaking);
                }}
                className={`min-h-[30px] rounded-lg px-3 text-[11px] font-black transition ${
                  audio.sfxEnabled
                    ? 'bg-[#00d2e0] text-[#08265b]'
                    : 'bg-[#12326b] text-[#98d9e8]'
                }`}
              >
                {audio.sfxEnabled ? t.on : t.off}
              </button>
            </div>

            {/* 4. Master Mute / Unmute + Advanced Voice Button */}
            <div className="grid grid-cols-2 gap-1.5 pt-0.5">
              <button
                type="button"
                onClick={handleToggleMasterMute}
                className={`flex min-h-[36px] items-center justify-center gap-1.5 rounded-xl border px-2 py-1 text-[11px] font-black transition active:scale-95 ${
                  anySoundActive
                    ? 'border-[#ff5c6c]/70 bg-[#4c1024]/90 text-[#fecdd3] hover:bg-[#6e1633]'
                    : 'border-[#4ade80]/70 bg-[#0f3d2e] text-[#bbf7d0] hover:bg-[#14533e]'
                }`}
              >
                {anySoundActive ? (
                  <>
                    <VolumeX className="h-3.5 w-3.5" />
                    <span>{t.mute}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-3.5 w-3.5" />
                    <span>{t.unmute}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onOpenVoiceModal();
                }}
                className="flex min-h-[36px] items-center justify-center gap-1.5 rounded-xl border border-[#00d2e0]/60 bg-[#0c2e70] px-2 py-1 text-[11px] font-black text-[#e6faff] transition hover:bg-[#13429b] active:scale-95"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-[#facc15]" />
                <span>{t.voiceSettings}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
