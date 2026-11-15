import { useCallback, useEffect, useState } from 'react';
import { musicEngine, type MusicTheme } from '../utils/musicEngine';
import { isAppLang, type AppLang } from '../locales';

export type AudioUiLang = AppLang;

interface StoredAudioPrefs {
  musicEnabled: boolean;
  musicVolume: number;
  sfxEnabled: boolean;
  audioLang: AudioUiLang;
}

const STORAGE_KEY = 'nauti_audio_prefs_v1';

const DEFAULT_PREFS: StoredAudioPrefs = {
  musicEnabled: true,
  musicVolume: 0.45,
  sfxEnabled: true,
  audioLang: 'es',
};

function readStoredPrefs(): StoredAudioPrefs {
  if (typeof window === 'undefined') return DEFAULT_PREFS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw) as Partial<StoredAudioPrefs>;
    return {
      musicEnabled:
        typeof parsed.musicEnabled === 'boolean'
          ? parsed.musicEnabled
          : DEFAULT_PREFS.musicEnabled,
      musicVolume:
        typeof parsed.musicVolume === 'number' &&
        !Number.isNaN(parsed.musicVolume)
          ? Math.max(0, Math.min(1, parsed.musicVolume))
          : DEFAULT_PREFS.musicVolume,
      sfxEnabled:
        typeof parsed.sfxEnabled === 'boolean'
          ? parsed.sfxEnabled
          : DEFAULT_PREFS.sfxEnabled,
      audioLang: isAppLang(parsed.audioLang) ? parsed.audioLang : 'es',
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

export interface MusicAudioControls {
  musicEnabled: boolean;
  setMusicEnabled: (enabled: boolean) => void;
  toggleMusic: () => void;
  musicVolume: number;
  setMusicVolume: (volume: number) => void;
  sfxEnabled: boolean;
  setSfxEnabled: (enabled: boolean) => void;
  toggleSfx: () => void;
  audioLang: AudioUiLang;
  setAudioLang: (lang: AudioUiLang) => void;
  currentTheme: MusicTheme;
  isUnlocked: boolean;
  unlockAndStart: () => void;
}

export function useMusicAudio(
  theme: MusicTheme,
  isSpeaking: boolean,
): MusicAudioControls {
  const [prefs, setPrefs] = useState<StoredAudioPrefs>(readStoredPrefs);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  // Persist audio & language preferences in localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // Ignore storage quota / privacy mode failures
    }
  }, [prefs]);

  // Sync music engine enabled & volume
  useEffect(() => {
    musicEngine.setEnabled(prefs.musicEnabled);
    musicEngine.setVolume(prefs.musicVolume);
  }, [prefs.musicEnabled, prefs.musicVolume]);

  // Sync adaptive theme smoothly
  useEffect(() => {
    musicEngine.setTheme(theme);
  }, [theme]);

  // Priority of narration: duck background music smoothly when NAUTI speaks
  useEffect(() => {
    musicEngine.setDucking(isSpeaking);
  }, [isSpeaking]);

  const unlockAndStart = useCallback(() => {
    setIsUnlocked(true);
    if (prefs.musicEnabled) {
      void musicEngine.startOrResume();
    }
  }, [prefs.musicEnabled]);

  // Respect browser autoplay restrictions: start only after first user interaction
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleFirstGesture = () => {
      setIsUnlocked(true);
      if (prefs.musicEnabled) {
        void musicEngine.startOrResume();
      }
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };

    window.addEventListener('pointerdown', handleFirstGesture, { passive: true });
    window.addEventListener('keydown', handleFirstGesture, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, [prefs.musicEnabled]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      musicEngine.stop();
    };
  }, []);

  const setMusicEnabled = useCallback((musicEnabled: boolean) => {
    setPrefs((p) => ({ ...p, musicEnabled }));
    if (musicEnabled) {
      setIsUnlocked(true);
      void musicEngine.startOrResume();
    }
  }, []);

  const toggleMusic = useCallback(() => {
    setPrefs((p) => {
      const next = !p.musicEnabled;
      if (next) {
        setIsUnlocked(true);
        void musicEngine.startOrResume();
      }
      return { ...p, musicEnabled: next };
    });
  }, []);

  const setMusicVolume = useCallback((volume: number) => {
    const clamped = Math.max(0, Math.min(1, volume));
    setPrefs((p) => ({
      ...p,
      musicVolume: clamped,
      musicEnabled: clamped > 0 ? p.musicEnabled : p.musicEnabled,
    }));
  }, []);

  const setSfxEnabled = useCallback((sfxEnabled: boolean) => {
    setPrefs((p) => ({ ...p, sfxEnabled }));
  }, []);

  const toggleSfx = useCallback(() => {
    setPrefs((p) => ({ ...p, sfxEnabled: !p.sfxEnabled }));
  }, []);

  const setAudioLang = useCallback((audioLang: AudioUiLang) => {
    setPrefs((p) => ({ ...p, audioLang }));
  }, []);

  return {
    musicEnabled: prefs.musicEnabled,
    setMusicEnabled,
    toggleMusic,
    musicVolume: prefs.musicVolume,
    setMusicVolume,
    sfxEnabled: prefs.sfxEnabled,
    setSfxEnabled,
    toggleSfx,
    audioLang: prefs.audioLang,
    setAudioLang,
    currentTheme: theme,
    isUnlocked,
    unlockAndStart,
  };
}
