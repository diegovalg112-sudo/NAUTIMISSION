import React from 'react';
import {
  X,
  RotateCcw,
  Square,
  Music,
  Volume2,
  Sparkles,
  Info,
  MessageCircle,
  Radio,
} from 'lucide-react';
import type {
  GuaraniAudioFallbackMode,
  SpeechControlsState,
} from '../hooks/useSpeech';
import type { MusicAudioControls } from '../hooks/useMusicAudio';
import { PRONUNCIATION_TEST_PHRASE } from '../utils/ttsPronunciation';
import { AUDIO_STRINGS } from '../data/uiStrings';
import { LanguageSelector } from './LanguageSelector';

interface AudioModalProps {
  open: boolean;
  onClose: () => void;
  speech: SpeechControlsState;
  audio: MusicAudioControls;
  onReadCurrent: () => void;
}

export const AudioModal: React.FC<AudioModalProps> = ({
  open,
  onClose,
  speech,
  audio,
  onReadCurrent,
}) => {
  if (!open) return null;

  const t = AUDIO_STRINGS[audio.audioLang];
  const isGn = audio.audioLang === 'gn-PY';
  const testPhrase = PRONUNCIATION_TEST_PHRASE[audio.audioLang];

  const voiceBadge = isGn
    ? speech.isGuaraniVoiceSupported
      ? t.guaraniVoiceReady
      : t.guaraniTextOnlyBadge
    : speech.hasLatinAmericanVoice
      ? t.latamVoiceReady
      : t.compatibleVoice;

  const fallbackChoices: { mode: GuaraniAudioFallbackMode; label: string }[] = [
    { mode: 'none', label: t.guaraniFallbackNone },
    { mode: 'es', label: t.guaraniFallbackEs },
    { mode: 'en', label: t.guaraniFallbackEn },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#040f26]/80 p-3 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={t.modalAriaLabel}
    >
      <div className="cockpit-scroll max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-2xl border-2 border-white bg-[#08265b] p-4 text-white shadow-[0_8px_0_#041029]">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#00d2e0]/25 pb-2">
          <div className="flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-[#34f0fa]" />
            <h2 className="text-base font-black text-white">{t.modalTitle}</h2>
          </div>
          <div className="flex items-center gap-1.5">
            <LanguageSelector
              value={audio.audioLang}
              onChange={audio.setAudioLang}
              variant="compact"
            />
            <button
              type="button"
              onClick={onClose}
              aria-label={t.closeAria}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0b3c8a] text-white hover:bg-[#134fb0]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Honest device voice status notice */}
        {speech.limitationNote && (
          <div className="mb-3 flex items-start gap-2 rounded-xl border border-[#fde047]/60 bg-[#061634] px-3 py-2 text-[11px] font-semibold text-[#fef08a]">
            <Info className="mt-0.5 h-3.5 w-3.5 flex-none text-[#facc15]" />
            <span>{speech.limitationNote}</span>
          </div>
        )}

        {/* Explicit alternative narration selector when Avañe’ẽ TTS voice is missing */}
        {isGn && !speech.isGuaraniVoiceSupported && (
          <div className="mb-3 rounded-xl border border-[#00d2e0]/45 bg-[#061634]/90 p-2.5">
            <span className="block text-[11px] font-black text-[#9df8ff]">
              {t.guaraniFallbackLabel}
            </span>
            <p className="mt-0.5 text-[10px] leading-snug font-semibold text-[#d9f7ff]/80">
              {t.guaraniFallbackHint}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {fallbackChoices.map(({ mode, label }) => {
                const active = speech.guaraniFallbackMode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => speech.setGuaraniFallbackMode(mode)}
                    className={`min-h-[30px] rounded-lg px-2.5 py-1 text-[11px] font-black transition ${
                      active
                        ? 'bg-[#facc15] text-[#08265b]'
                        : 'border border-[#00d2e0]/35 bg-[#0c2e70] text-[#9df8ff] hover:bg-[#13429b]'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid gap-2.5 sm:grid-cols-2">
          {/* Voice selector */}
          <div className="sm:col-span-2">
            <label
              htmlFor="voiceChoice"
              className="mb-1 flex items-center justify-between text-xs font-extrabold tracking-wide text-[#9df8ff] uppercase"
            >
              <span>{t.voiceSelectLabel}</span>
              <span className="text-[10px] font-bold text-[#fde047] normal-case">
                {voiceBadge}
              </span>
            </label>
            <select
              id="voiceChoice"
              aria-label={t.chooseVoiceAria}
              value={speech.selectedVoice}
              disabled={isGn && !speech.hasGuaraniVoice && speech.guaraniFallbackMode === 'none'}
              onChange={(e) => {
                speech.setSelectedVoice(e.target.value);
                onReadCurrent();
              }}
              className="w-full min-h-[40px] rounded-xl border border-[#00d2e0]/60 bg-[#061634] px-3 py-1.5 text-sm font-semibold text-white focus:border-[#facc15] focus:outline-none disabled:opacity-55"
            >
              {speech.voices.length === 0 ? (
                <option value="">{t.defaultDeviceVoice}</option>
              ) : (
                speech.voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Auto-narration toggle */}
          <div className="flex items-center justify-between rounded-xl bg-[#061634]/75 p-2.5 sm:col-span-2">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-[#34f0fa]" />
              <div className="leading-tight">
                <span className="block text-xs font-bold text-[#d9f7ff]">
                  {t.autoNarrateLong}
                </span>
                <span className="block text-[10px] font-semibold text-[#9df8ff]/75">
                  {t.autoNarrateSub}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => speech.setAutoNarrate(!speech.autoNarrate)}
              className={`min-h-[32px] rounded-lg px-3 text-xs font-black transition ${
                speech.autoNarrate
                  ? 'bg-[#00d2e0] text-[#08265b]'
                  : 'bg-[#12326b] text-[#98d9e8]'
              }`}
            >
              {speech.autoNarrate ? t.on : t.off}
            </button>
          </div>

          {/* Music volume + toggle */}
          <div className="flex flex-col gap-1 rounded-xl bg-[#061634]/75 p-2.5 text-xs font-bold text-[#d9f7ff]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Music className="h-3.5 w-3.5 text-[#34f0fa]" />
                <span>{t.music}</span>
              </span>
              <div className="flex items-center gap-1.5">
                <span className="tabular-nums text-[#facc15]">
                  {audio.musicEnabled
                    ? `${Math.round(audio.musicVolume * 100)} %`
                    : '0 %'}
                </span>
                <button
                  type="button"
                  onClick={audio.toggleMusic}
                  className={`rounded-md px-2 py-0.5 text-[10px] font-black ${
                    audio.musicEnabled
                      ? 'bg-[#00d2e0] text-[#08265b]'
                      : 'bg-[#12326b] text-[#98d9e8]'
                  }`}
                >
                  {audio.musicEnabled ? t.on : t.mute}
                </button>
              </div>
            </div>
            <input
              aria-label={t.musicVolumeAria}
              type="range"
              min="0"
              max="100"
              step="1"
              value={
                audio.musicEnabled ? Math.round(audio.musicVolume * 100) : 0
              }
              onChange={(e) => {
                const pct = Number(e.target.value);
                audio.unlockAndStart();
                if (pct > 0 && !audio.musicEnabled) audio.setMusicEnabled(true);
                audio.setMusicVolume(pct / 100);
              }}
              className="accent-[#00d2e0]"
            />
          </div>

          {/* Voice volume */}
          <label className="flex flex-col gap-1 rounded-xl bg-[#061634]/75 p-2.5 text-xs font-bold text-[#d9f7ff]">
            <div className="flex justify-between">
              <span>{t.voiceVolume}</span>
              <span className="tabular-nums text-[#facc15]">
                {Math.round(speech.volume * 100)} %
              </span>
            </div>
            <input
              aria-label={t.voiceVolumeAria}
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={speech.volume}
              onChange={(e) => speech.setVolume(Number(e.target.value))}
              className="accent-[#facc15]"
            />
          </label>

          {/* Speed & Pitch */}
          <label className="flex flex-col gap-1 rounded-xl bg-[#061634]/75 p-2.5 text-xs font-bold text-[#d9f7ff]">
            <div className="flex justify-between">
              <span>{t.speed}</span>
              <span className="tabular-nums text-[#facc15]">
                {speech.rate.toFixed(2)}×
              </span>
            </div>
            <input
              aria-label={t.speedAria}
              type="range"
              min="0.7"
              max="1.25"
              step="0.05"
              value={speech.rate}
              onChange={(e) => speech.setRate(Number(e.target.value))}
              className="accent-[#00d2e0]"
            />
          </label>

          <label className="flex flex-col gap-1 rounded-xl bg-[#061634]/75 p-2.5 text-xs font-bold text-[#d9f7ff]">
            <div className="flex justify-between">
              <span>{t.pitch}</span>
              <span className="tabular-nums text-[#facc15]">
                {speech.pitch.toFixed(2)}
              </span>
            </div>
            <input
              aria-label={t.pitchAria}
              type="range"
              min="0.8"
              max="1.45"
              step="0.05"
              value={speech.pitch}
              onChange={(e) => speech.setPitch(Number(e.target.value))}
              className="accent-[#00d2e0]"
            />
          </label>

          {/* Sound effects + Phonetic Pronunciation Boost */}
          <div className="flex items-center justify-between rounded-xl bg-[#061634]/75 p-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#d9f7ff]">
              <Sparkles className="h-4 w-4 text-[#facc15]" />
              <span>{t.effects}</span>
            </div>
            <button
              type="button"
              onClick={audio.toggleSfx}
              className={`min-h-[32px] rounded-lg px-2.5 text-xs font-black transition ${
                audio.sfxEnabled
                  ? 'bg-[#00d2e0] text-[#08265b]'
                  : 'bg-[#12326b] text-[#98d9e8]'
              }`}
            >
              {audio.sfxEnabled ? t.onPlural : t.mute}
            </button>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-[#061634]/75 p-2.5">
            <div className="leading-tight">
              <span className="block text-xs font-bold text-[#d9f7ff]">
                {t.pronunciationTitle}
              </span>
              <span className="block text-[10px] font-semibold text-[#9df8ff]/75">
                {t.pronunciationSub}
              </span>
            </div>
            <button
              type="button"
              onClick={() => speech.setPhoneticOverride(!speech.phoneticOverride)}
              className={`min-h-[32px] rounded-lg px-2.5 text-xs font-black transition ${
                speech.phoneticOverride
                  ? 'bg-[#facc15] text-[#08265b]'
                  : 'bg-[#12326b] text-[#98d9e8]'
              }`}
            >
              {speech.phoneticOverride
                ? t.pronunciationActive
                : t.pronunciationNatural}
            </button>
          </div>
        </div>

        {/* Playback Action Buttons */}
        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onReadCurrent}
              className="flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#00d2e0] px-3 py-2 text-xs font-black text-[#08265b] transition hover:bg-[#34f0fa] active:scale-95"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{t.replay}</span>
            </button>
            <button
              type="button"
              onClick={() =>
                speech.speak(testPhrase, {
                  force: true,
                  fallbackTexts: {
                    es: PRONUNCIATION_TEST_PHRASE.es,
                    en: PRONUNCIATION_TEST_PHRASE.en,
                  },
                })
              }
              className="flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#facc15] px-3 py-2 text-xs font-black text-[#08265b] transition hover:bg-[#fde047] active:scale-95"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>{t.testNautiBtn}</span>
            </button>
            <button
              type="button"
              onClick={speech.stop}
              className="flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#10387a] px-3 py-2 text-xs font-extrabold text-white transition hover:bg-[#174aa0] active:scale-95"
            >
              <Square className="h-3.5 w-3.5 fill-current" />
              <span>{t.stop}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] rounded-xl border border-[#00d2e0]/50 px-4 py-2 text-xs font-extrabold text-[#9df8ff] hover:bg-[#0e387a]"
          >
            {t.doneBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
