/**
 * Centralized Text-to-Speech (TTS) pronunciation preprocessor for NAUTI.
 * Ensures the UI always displays "NAUTI", while every speechSynthesis request
 * pronounces the name smoothly as a single two-syllable word ("NOW-tee" / "NAU-ti"),
 * never spelled out letter by letter ("N-A-U-T-I") across supported voices.
 */

export interface NormalizeTtsOptions {
  /** BCP-47 language tag of the active TTS voice (e.g. 'es-MX', 'en-US', 'gn-PY') */
  lang?: string;
  /** Optional phonetic override when a device voice needs stronger stress/spelling cues */
  phoneticOverride?: boolean;
}

const SPACED_NAUTI_REGEX = /\bN[\s.-]+A[\s.-]+U[\s.-]+T[\s.-]+I\b/g;
const WORD_NAUTI_REGEX = /\bNAUTI\b/gi;
const CAPS_UI_WORDS_REGEX = /\b(AYUDA|MODELAR|HELP|MODEL)\b/g;

export function normalizeTtsText(
  text: string,
  options: NormalizeTtsOptions = {},
): string {
  const { lang = 'es-MX', phoneticOverride = false } = options;
  const cleaned = text
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\uFE0F]/gu, '')
    .replace(/\.\.\./g, '… ')
    .replace(/\s{2,}/g, ' ')
    .trim();
  const isEnglish = /^en\b/i.test(lang);

  const spokenName = isEnglish
    ? 'Nowtee'
    : phoneticOverride
      ? 'Náuti'
      : 'Nauti';

  return cleaned
    .replace(SPACED_NAUTI_REGEX, spokenName)
    .replace(WORD_NAUTI_REGEX, spokenName)
    .replace(CAPS_UI_WORDS_REGEX, (word) =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    );
}

export const PRONUNCIATION_TEST_PHRASE = {
  es: '¡Hola, exploradores! Soy NAUTI, su compañero de aventuras espaciales.',
  en: 'Hello, explorers! I am NAUTI, your space adventure companion.',
  'gn-PY':
    '¡Mba’éichapa, arapy rechahára! Che ha’e NAUTI, pene irũ arapy ñeha’ãme.',
} as const;
