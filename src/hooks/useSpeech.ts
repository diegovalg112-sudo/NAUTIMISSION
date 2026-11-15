import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { AppLang } from '../locales';
import { normalizeTtsText } from '../utils/ttsPronunciation';
import {
  hasAnyRecordedClips,
  resolveRecordedAudioClip,
} from '../utils/recordedAudioRegistry';

export type GuaraniAudioFallbackMode = 'none' | 'es' | 'en';

export interface SpeechSpeakOptions {
  force?: boolean;
  isAuto?: boolean;
  pitchBoost?: number;
  rateBoost?: number;
  suppressBlockedPrompt?: boolean;
  /** Optional key for future pre-recorded native audio clips (e.g. 'welcome_0') */
  clipKey?: string;
  /** Explicit Spanish/English narration equivalents if user chooses explicit fallback in gn-PY */
  fallbackTexts?: Partial<Record<'es' | 'en', string>>;
  /** Optional callback fired when the utterance/clip ends naturally without being interrupted */
  onEnd?: () => void;
}

export interface SpeechControlsState {
  voices: SpeechSynthesisVoice[];
  selectedVoice: string;
  setSelectedVoice: (uri: string) => void;
  rate: number;
  setRate: (r: number) => void;
  pitch: number;
  setPitch: (p: number) => void;
  volume: number;
  setVolume: (v: number) => void;
  voiceOn: boolean;
  setVoiceOn: (on: boolean) => void;
  autoNarrate: boolean;
  setAutoNarrate: (on: boolean) => void;
  phoneticOverride: boolean;
  setPhoneticOverride: (on: boolean) => void;
  guaraniFallbackMode: GuaraniAudioFallbackMode;
  setGuaraniFallbackMode: (mode: GuaraniAudioFallbackMode) => void;
  isSpeaking: boolean;
  mouthPulse: number;
  narrationBlocked: boolean;
  audioUnlocked: boolean;
  markUserUnlocked: () => void;
  supported: boolean;
  hasLatinAmericanVoice: boolean;
  hasGuaraniVoice: boolean;
  hasRecordedGuaraniAudio: boolean;
  isGuaraniVoiceSupported: boolean;
  activeVoiceLabel: string;
  limitationNote: string | null;
  speak: (text: string, options?: boolean | SpeechSpeakOptions) => void;
  stop: () => void;
}

const LATAM_LANG_REGEX =
  /^es-(mx|419|us|co|ar|cl|pe|ve|ec|cr|pa|uy|py|bo|do|gt|hn|ni|sv)/i;
const FRIENDLY_LATAM_NAMES =
  /paulina|dalia|sabina|salome|camila|mia|lupe|andrea|elena|valeria|google español de estados unidos|google spanish|mexico|latam/i;
const FALLBACK_FRIENDLY_NAMES =
  /google español|monica|lucia|laura|marisol|jorge|pablo/i;

const FRIENDLY_ENGLISH_NAMES =
  /google us english|samantha|ava|allison|aria|jenny|zoe|victoria|google uk english|daniel|karen|natural/i;

const GUARANI_LANG_REGEX = /^(gn|gug)([-_]|$)/i;
const GUARANI_NAME_REGEX = /guaran[ií]|ava[ñn]e/i;

export function isGuaraniSpeechVoice(voice: SpeechSynthesisVoice): boolean {
  return (
    GUARANI_LANG_REGEX.test(voice.lang.trim()) ||
    GUARANI_NAME_REGEX.test(voice.name)
  );
}

function voiceMatchesTargetLang(
  voice: SpeechSynthesisVoice,
  targetLang: AppLang,
): boolean {
  if (targetLang === 'gn-PY') {
    return isGuaraniSpeechVoice(voice);
  }
  return voice.lang.toLowerCase().startsWith(targetLang);
}

function pickBestVoice(
  available: SpeechSynthesisVoice[],
  targetLang: AppLang,
): SpeechSynthesisVoice | undefined {
  if (!available.length) return undefined;

  if (targetLang === 'gn-PY') {
    const guarani = available.filter(isGuaraniSpeechVoice);
    if (guarani.length === 0) {
      // Honest handling: do NOT secretly substitute a Spanish voice for Guaraní
      return undefined;
    }
    return (
      guarani.find((v) => /^gn[-_]py/i.test(v.lang)) ||
      guarani.find((v) => /^gug/i.test(v.lang)) ||
      guarani[0]
    );
  }

  if (targetLang === 'en') {
    const english = available.filter((v) =>
      v.lang.toLowerCase().startsWith('en'),
    );
    const pool = english.length > 0 ? english : available;
    return (
      pool.find(
        (v) => /^en-us/i.test(v.lang) && FRIENDLY_ENGLISH_NAMES.test(v.name),
      ) ||
      pool.find((v) => FRIENDLY_ENGLISH_NAMES.test(v.name)) ||
      pool.find((v) => /^en-us/i.test(v.lang)) ||
      pool[0]
    );
  }

  const spanish = available.filter((v) =>
    v.lang.toLowerCase().startsWith('es'),
  );
  const pool = spanish.length > 0 ? spanish : available;
  return (
    pool.find(
      (v) => LATAM_LANG_REGEX.test(v.lang) && FRIENDLY_LATAM_NAMES.test(v.name),
    ) ||
    pool.find((v) => LATAM_LANG_REGEX.test(v.lang)) ||
    pool.find((v) => FRIENDLY_LATAM_NAMES.test(v.name)) ||
    pool.find((v) => FALLBACK_FRIENDLY_NAMES.test(v.name)) ||
    pool[0]
  );
}

const VOICE_VOL_STORAGE_KEY = 'nauti_voice_volume_v1';
const PHONETIC_STORAGE_KEY = 'nauti_tts_phonetic_v1';
const AUTO_NARRATE_STORAGE_KEY = 'nauti_auto_narrate_v1';
const GN_FALLBACK_STORAGE_KEY = 'nauti_gn_audio_fallback_v1';

function readStoredVoiceVolume(): number {
  if (typeof window === 'undefined') return 0.92;
  try {
    const raw = window.localStorage.getItem(VOICE_VOL_STORAGE_KEY);
    if (!raw) return 0.92;
    const val = Number(raw);
    return Number.isNaN(val) ? 0.92 : Math.max(0, Math.min(1, val));
  } catch {
    return 0.92;
  }
}

function readStoredPhonetic(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(PHONETIC_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function readStoredAutoNarrate(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const raw = window.localStorage.getItem(AUTO_NARRATE_STORAGE_KEY);
    return raw === null ? true : raw === '1';
  } catch {
    return true;
  }
}

function readStoredGuaraniFallback(): GuaraniAudioFallbackMode {
  if (typeof window === 'undefined') return 'none';
  try {
    const raw = window.localStorage.getItem(GN_FALLBACK_STORAGE_KEY);
    if (raw === 'es' || raw === 'en') return raw;
    return 'none';
  } catch {
    return 'none';
  }
}

export function useSpeech(lang: AppLang = 'es'): SpeechControlsState {
  const supported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoiceState] = useState<string>('');
  const [rate, setRate] = useState<number>(1.02);
  const [pitch, setPitch] = useState<number>(1.28);
  const [volume, setVolumeState] = useState<number>(readStoredVoiceVolume);
  const [voiceOn, setVoiceOn] = useState<boolean>(true);
  const [autoNarrate, setAutoNarrateState] = useState<boolean>(
    readStoredAutoNarrate,
  );
  const [phoneticOverride, setPhoneticOverrideState] =
    useState<boolean>(readStoredPhonetic);
  const [guaraniFallbackMode, setGuaraniFallbackModeState] =
    useState<GuaraniAudioFallbackMode>(readStoredGuaraniFallback);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [mouthPulse, setMouthPulse] = useState<number>(0);
  const [narrationBlocked, setNarrationBlocked] = useState<boolean>(false);
  const [audioUnlocked, setAudioUnlocked] = useState<boolean>(false);

  const langRef = useRef<AppLang>(lang);
  langRef.current = lang;

  const guaraniFallbackRef =
    useRef<GuaraniAudioFallbackMode>(guaraniFallbackMode);
  guaraniFallbackRef.current = guaraniFallbackMode;

  const audioUnlockedRef = useRef<boolean>(false);
  const selectedVoiceRef = useRef<string>(selectedVoice);
  selectedVoiceRef.current = selectedVoice;

  const manualVoiceByLangRef = useRef<Partial<Record<AppLang, string>>>({});
  const utteranceTokenRef = useRef<number>(0);
  const startWatchdogRef = useRef<number | null>(null);
  const activeClipAudioRef = useRef<HTMLAudioElement | null>(null);
  const clipPulseIntervalRef = useRef<number | null>(null);

  const clearWatchdog = useCallback(() => {
    if (startWatchdogRef.current !== null) {
      window.clearTimeout(startWatchdogRef.current);
      startWatchdogRef.current = null;
    }
  }, []);

  const stopActiveClip = useCallback(() => {
    if (clipPulseIntervalRef.current !== null) {
      window.clearInterval(clipPulseIntervalRef.current);
      clipPulseIntervalRef.current = null;
    }
    if (activeClipAudioRef.current) {
      activeClipAudioRef.current.pause();
      activeClipAudioRef.current.src = '';
      activeClipAudioRef.current = null;
    }
  }, []);

  const markUserUnlocked = useCallback(() => {
    audioUnlockedRef.current = true;
    setAudioUnlocked(true);
    setNarrationBlocked(false);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onGesture = () => {
      audioUnlockedRef.current = true;
      setAudioUnlocked(true);
      window.removeEventListener('pointerdown', onGesture);
      window.removeEventListener('keydown', onGesture);
    };
    window.addEventListener('pointerdown', onGesture, { passive: true });
    window.addEventListener('keydown', onGesture, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', onGesture);
      window.removeEventListener('keydown', onGesture);
    };
  }, []);

  const setSelectedVoice = useCallback((uri: string) => {
    manualVoiceByLangRef.current[langRef.current] = uri;
    setSelectedVoiceState(uri);
  }, []);

  const setVolume = useCallback(
    (v: number) => {
      const clamped = Math.max(0, Math.min(1, v));
      setVolumeState(clamped);
      if (clamped === 0) {
        utteranceTokenRef.current += 1;
        clearWatchdog();
        stopActiveClip();
        if (supported) {
          window.speechSynthesis.cancel();
        }
        setIsSpeaking(false);
      }
      try {
        window.localStorage.setItem(VOICE_VOL_STORAGE_KEY, String(clamped));
      } catch {
        // Ignore storage errors
      }
    },
    [clearWatchdog, stopActiveClip, supported],
  );

  const setAutoNarrate = useCallback(
    (on: boolean) => {
      setAutoNarrateState(on);
      if (!on) {
        utteranceTokenRef.current += 1;
        clearWatchdog();
        stopActiveClip();
        if (supported) {
          window.speechSynthesis.cancel();
        }
        setIsSpeaking(false);
      }
      try {
        window.localStorage.setItem(AUTO_NARRATE_STORAGE_KEY, on ? '1' : '0');
      } catch {
        // Ignore storage errors
      }
    },
    [clearWatchdog, stopActiveClip, supported],
  );

  const setPhoneticOverride = useCallback((on: boolean) => {
    setPhoneticOverrideState(on);
    try {
      window.localStorage.setItem(PHONETIC_STORAGE_KEY, on ? '1' : '0');
    } catch {
      // Ignore storage errors
    }
  }, []);

  const setGuaraniFallbackMode = useCallback(
    (mode: GuaraniAudioFallbackMode) => {
      setGuaraniFallbackModeState(mode);
      try {
        window.localStorage.setItem(GN_FALLBACK_STORAGE_KEY, mode);
      } catch {
        // Ignore storage errors
      }
    },
    [],
  );

  const effectiveTtsLang: AppLang = useMemo(() => {
    if (lang === 'gn-PY') {
      const hasGn = voices.some(isGuaraniSpeechVoice);
      if (!hasGn && (guaraniFallbackMode === 'es' || guaraniFallbackMode === 'en')) {
        return guaraniFallbackMode;
      }
    }
    return lang;
  }, [lang, voices, guaraniFallbackMode]);

  const refreshVoices = useCallback(() => {
    if (!supported) return;
    const raw = window.speechSynthesis.getVoices();
    const guarani = raw.filter(isGuaraniSpeechVoice);
    const spanish = raw.filter((v) => v.lang.toLowerCase().startsWith('es'));
    const english = raw.filter((v) => v.lang.toLowerCase().startsWith('en'));

    const activeLang = langRef.current;
    const combined =
      activeLang === 'gn-PY'
        ? [...guarani, ...spanish, ...english]
        : activeLang === 'en'
          ? [...english, ...spanish, ...guarani]
          : [...spanish, ...english, ...guarani];
    setVoices(combined);

    if (combined.length > 0) {
      const manualUri = manualVoiceByLangRef.current[activeLang];
      const manualValid =
        manualUri && combined.some((v) => v.voiceURI === manualUri);
      if (manualValid && manualUri) {
        setSelectedVoiceState(manualUri);
        return;
      }
      const targetLang =
        activeLang === 'gn-PY' &&
        guarani.length === 0 &&
        (guaraniFallbackRef.current === 'es' ||
          guaraniFallbackRef.current === 'en')
          ? guaraniFallbackRef.current
          : activeLang;
      const best = pickBestVoice(combined, targetLang);
      setSelectedVoiceState(best ? best.voiceURI : '');
    }
  }, [supported]);

  useEffect(() => {
    if (!supported) return;
    refreshVoices();
    window.speechSynthesis.addEventListener('voiceschanged', refreshVoices);
    return () => {
      utteranceTokenRef.current += 1;
      clearWatchdog();
      stopActiveClip();
      window.speechSynthesis.removeEventListener('voiceschanged', refreshVoices);
      window.speechSynthesis.cancel();
    };
  }, [supported, refreshVoices, clearWatchdog, stopActiveClip]);

  useEffect(() => {
    if (!supported) return;
    refreshVoices();
  }, [lang, guaraniFallbackMode, supported, refreshVoices]);

  const stop = useCallback(() => {
    utteranceTokenRef.current += 1;
    clearWatchdog();
    stopActiveClip();
    if (supported) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, [supported, clearWatchdog, stopActiveClip]);

  const hasLatinAmericanVoice = Boolean(
    voices.some((v) => LATAM_LANG_REGEX.test(v.lang)),
  );
  const hasGuaraniVoice = Boolean(voices.some(isGuaraniSpeechVoice));
  const hasRecordedGuaraniAudio = hasAnyRecordedClips('gn-PY');
  const isGuaraniVoiceSupported = hasGuaraniVoice || hasRecordedGuaraniAudio;

  const activeVoice = useMemo(() => {
    const found = voices.find((v) => v.voiceURI === selectedVoice);
    if (found && voiceMatchesTargetLang(found, effectiveTtsLang)) {
      return found;
    }
    return pickBestVoice(voices, effectiveTtsLang);
  }, [voices, selectedVoice, effectiveTtsLang]);

  const spanishVoicesCount = voices.filter((v) =>
    v.lang.toLowerCase().startsWith('es'),
  ).length;
  const englishVoicesCount = voices.filter((v) =>
    v.lang.toLowerCase().startsWith('en'),
  ).length;

  const limitationNote = useMemo(() => {
    if (lang === 'gn-PY') {
      if (!supported && !hasRecordedGuaraniAudio) {
        return 'Ko kundahára ndoguerekói ñe’ẽ apoha; opaite marandu Avañe’ẽme ojekuaa porã ta’ãngarupápe.';
      }
      if (!hasGuaraniVoice && !hasRecordedGuaraniAudio) {
        if (guaraniFallbackMode === 'es') {
          return 'Ndaipóri voz Avañe’ẽ (gn-PY) ko tembiporúpe; oñehenduhína ñemombe’u Español-pe eiporavóvaicha, ha ta’ãngarupa opyta Avañe’ẽme.';
        }
        if (guaraniFallbackMode === 'en') {
          return 'Ndaipóri voz Avañe’ẽ (gn-PY) ko tembiporúpe; oñehenduhína ñemombe’u English-pe eiporavóvaicha, ha ta’ãngarupa opyta Avañe’ẽme.';
        }
        return 'Ndaipóri voz automática Avañe’ẽ (gn-PY) ko kundahára térã tembiporúpe. Opaite moñe’ẽrã opyta ta’ãngarupápe, ha tyapu ha purahei oiko porã. Reipotáramo, ikatu reiporavo ñemombe’u Español térã English-pe ko’ápe.';
      }
      return null;
    }

    if (!supported) {
      return lang === 'en'
        ? 'This browser does not support speech synthesis; all dialogues remain visible on screen.'
        : 'Este navegador no admite síntesis de voz; los diálogos se muestran en pantalla.';
    }
    if (lang === 'en') {
      if (englishVoicesCount === 0) {
        return 'No English voice was reported by this device; using system default voice while all text stays readable.';
      }
      return null;
    }
    if (spanishVoicesCount === 0) {
      return 'El dispositivo no reporta voces en español instaladas; se usará la voz predeterminada del sistema y todos los textos siguen legibles en pantalla.';
    }
    if (!hasLatinAmericanVoice) {
      return 'No se detectó una voz latinoamericana dedicada en este dispositivo; se usa la voz en español más compatible disponible.';
    }
    return null;
  }, [
    supported,
    lang,
    englishVoicesCount,
    spanishVoicesCount,
    hasLatinAmericanVoice,
    hasGuaraniVoice,
    hasRecordedGuaraniAudio,
    guaraniFallbackMode,
  ]);

  const speak = useCallback(
    (text: string, options: boolean | SpeechSpeakOptions = true) => {
      const normalizedOpts: SpeechSpeakOptions =
        typeof options === 'boolean' ? { force: options } : options;
      const force = normalizedOpts.force ?? true;
      const isAuto = normalizedOpts.isAuto ?? false;
      const pitchBoost = normalizedOpts.pitchBoost ?? 0;
      const rateBoost = normalizedOpts.rateBoost ?? 0;
      const suppressBlockedPrompt =
        normalizedOpts.suppressBlockedPrompt ?? false;
      const clipKey = normalizedOpts.clipKey;
      const fallbackTexts = normalizedOpts.fallbackTexts;
      const onEndCallback = normalizedOpts.onEnd;

      if (isAuto && !autoNarrate) return;
      if (!force && !voiceOn) return;

      // Cancel any previous speech or recorded clip cleanly
      utteranceTokenRef.current += 1;
      const token = utteranceTokenRef.current;
      clearWatchdog();
      stopActiveClip();
      if (supported) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);

      if (force) {
        audioUnlockedRef.current = true;
        setAudioUnlocked(true);
        setNarrationBlocked(false);
        setVoiceOn(true);
      }

      let effectiveVolume = volume;
      if (effectiveVolume <= 0) {
        if (!force) return;
        effectiveVolume = 0.92;
        setVolume(0.92);
      }

      // 1. Prioritize real human pre-recorded audio clip if registered for the active language
      const recordedClip = resolveRecordedAudioClip(langRef.current, clipKey);
      if (recordedClip && typeof Audio !== 'undefined') {
        try {
          const clipAudio = new Audio(recordedClip.url);
          clipAudio.volume = effectiveVolume;
          activeClipAudioRef.current = clipAudio;

          clipAudio.onplay = () => {
            if (utteranceTokenRef.current !== token) return;
            audioUnlockedRef.current = true;
            setAudioUnlocked(true);
            setNarrationBlocked(false);
            setIsSpeaking(true);
            setMouthPulse((n) => n + 1);
            clipPulseIntervalRef.current = window.setInterval(() => {
              setMouthPulse((n) => n + 1);
            }, 190);
          };

          clipAudio.onended = () => {
            if (utteranceTokenRef.current !== token) return;
            stopActiveClip();
            setIsSpeaking(false);
            onEndCallback?.();
          };

          clipAudio.onerror = () => {
            if (utteranceTokenRef.current !== token) return;
            stopActiveClip();
            setIsSpeaking(false);
          };

          void clipAudio.play().catch(() => {
            if (utteranceTokenRef.current !== token) return;
            stopActiveClip();
            setIsSpeaking(false);
            if (!suppressBlockedPrompt) {
              setNarrationBlocked(true);
            }
          });
          return;
        } catch {
          stopActiveClip();
        }
      }

      if (!supported) return;

      // 2. Honest Guaraní TTS check: never silently speak Guaraní text via a Spanish/English voice
      let speechLangTarget: AppLang = langRef.current;
      let textToSpeak = text.trim();

      if (langRef.current === 'gn-PY' && !hasGuaraniVoice) {
        const fbMode = guaraniFallbackRef.current;
        if (fbMode === 'es' || fbMode === 'en') {
          const explicitText = fallbackTexts?.[fbMode]?.trim();
          if (!explicitText) return;
          speechLangTarget = fbMode;
          textToSpeak = explicitText;
        } else {
          // Honest behavior: no Guaraní TTS voice on this device; keep UI silent & clear
          return;
        }
      }

      if (!textToSpeak) return;

      const defaultLangTag =
        speechLangTarget === 'en'
          ? 'en-US'
          : speechLangTarget === 'gn-PY'
            ? 'gn-PY'
            : 'es-MX';
      const voiceMatchesAppLang =
        activeVoice && voiceMatchesTargetLang(activeVoice, speechLangTarget);
      const chosenVoice = voiceMatchesAppLang
        ? activeVoice
        : pickBestVoice(voices, speechLangTarget);

      if (speechLangTarget === 'gn-PY' && !chosenVoice) {
        return;
      }

      const targetLang = chosenVoice?.lang || defaultLangTag;

      const spokenText = normalizeTtsText(textToSpeak, {
        lang: targetLang,
        phoneticOverride,
      });

      const utterance = new SpeechSynthesisUtterance(spokenText);
      utterance.lang = targetLang;
      utterance.rate = Math.max(0.7, Math.min(1.4, rate + rateBoost));
      utterance.pitch = Math.max(0.8, Math.min(1.5, pitch + pitchBoost));
      utterance.volume = effectiveVolume;

      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }

      utterance.onstart = () => {
        if (utteranceTokenRef.current !== token) return;
        clearWatchdog();
        audioUnlockedRef.current = true;
        setAudioUnlocked(true);
        setNarrationBlocked(false);
        setIsSpeaking(true);
        setMouthPulse((n) => n + 1);
      };

      utterance.onboundary = () => {
        if (utteranceTokenRef.current !== token) return;
        setMouthPulse((n) => n + 1);
      };

      utterance.onend = () => {
        if (utteranceTokenRef.current !== token) return;
        clearWatchdog();
        setIsSpeaking(false);
        onEndCallback?.();
      };

      utterance.onerror = (event) => {
        if (utteranceTokenRef.current !== token) return;
        clearWatchdog();
        setIsSpeaking(false);
        const err = (event as SpeechSynthesisErrorEvent | undefined)?.error;
        if (
          !suppressBlockedPrompt &&
          (err === 'not-allowed' || err === 'audio-busy')
        ) {
          setNarrationBlocked(true);
        }
      };

      try {
        window.speechSynthesis.speak(utterance);

        const timeoutMs = audioUnlockedRef.current ? 900 : 480;
        startWatchdogRef.current = window.setTimeout(() => {
          if (utteranceTokenRef.current !== token) return;
          if (
            !window.speechSynthesis.speaking &&
            !window.speechSynthesis.pending
          ) {
            setIsSpeaking(false);
            if (!suppressBlockedPrompt && (isAuto || !audioUnlockedRef.current)) {
              setNarrationBlocked(true);
            }
          }
        }, timeoutMs);
      } catch {
        setIsSpeaking(false);
        if (!suppressBlockedPrompt) {
          setNarrationBlocked(true);
        }
      }
    },
    [
      supported,
      autoNarrate,
      voiceOn,
      volume,
      setVolume,
      rate,
      pitch,
      activeVoice,
      voices,
      phoneticOverride,
      hasGuaraniVoice,
      clearWatchdog,
      stopActiveClip,
    ],
  );

  const defaultVoiceLabel =
    lang === 'en'
      ? 'Default device voice'
      : lang === 'gn-PY'
        ? 'Tembiporu ñe’ẽ ypykue'
        : 'Voz predeterminada del dispositivo';

  return {
    voices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate,
    pitch,
    setPitch,
    volume,
    setVolume,
    voiceOn,
    setVoiceOn,
    autoNarrate,
    setAutoNarrate,
    phoneticOverride,
    setPhoneticOverride,
    guaraniFallbackMode,
    setGuaraniFallbackMode,
    isSpeaking,
    mouthPulse,
    narrationBlocked,
    audioUnlocked,
    markUserUnlocked,
    supported,
    hasLatinAmericanVoice,
    hasGuaraniVoice,
    hasRecordedGuaraniAudio,
    isGuaraniVoiceSupported,
    activeVoiceLabel: activeVoice
      ? `${activeVoice.name} (${activeVoice.lang})`
      : lang === 'gn-PY' && !isGuaraniVoiceSupported && guaraniFallbackMode === 'none'
        ? 'Avañe’ẽ: moñe’ẽrã ta’ãngarupápe (sin TTS gn-PY)'
        : defaultVoiceLabel,
    limitationNote,
    speak,
    stop,
  };
}
