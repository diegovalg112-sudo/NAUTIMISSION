import type { AppLang } from '../locales';

/**
 * Adapter registry for future pre-recorded native-speaker voice clips
 * (especially Paraguayan Guaraní / Avañe’ẽ studio or teacher recordings).
 *
 * When native-speaker `.mp3` / `.ogg` / `.wav` recordings are added under
 * `public/audio/gn-PY/<clipKey>.mp3`, register their clip keys here (or load
 * from a manifest) and `useSpeech` will automatically prioritize real human
 * audio over browser speech synthesis with full music ducking.
 */
export interface RecordedClipEntry {
  url: string;
  speakerCredit?: string;
}

const RECORDED_CLIPS: Partial<Record<AppLang, Record<string, RecordedClipEntry>>> = {
  'gn-PY': {
    // Future native-speaker recordings plug in here cleanly without engine changes, e.g.:
    // welcome_0: { url: '/audio/gn-PY/welcome_0.mp3', speakerCredit: 'Native speaker' },
  },
};

export function resolveRecordedAudioClip(
  lang: AppLang,
  clipKey?: string,
): RecordedClipEntry | null {
  if (!clipKey) return null;
  return RECORDED_CLIPS[lang]?.[clipKey] ?? null;
}

export function hasAnyRecordedClips(lang: AppLang): boolean {
  const map = RECORDED_CLIPS[lang];
  return Boolean(map && Object.keys(map).length > 0);
}
