import { LOCALE_BUNDLES, SUPPORTED_LANGS, type AppLang } from '../locales';

export type NautiReactionType =
  | 'welcome'
  | 'launch'
  | 'tutorial'
  | 'sceneIdle'
  | 'sceneDanger'
  | 'help'
  | 'model'
  | 'goodDecision'
  | 'riskDecision'
  | 'triviaRight'
  | 'triviaWrong'
  | 'victory'
  | 'partial'
  | 'evacuation';

export const TICKLE_LINES: Record<AppLang, string[]> = SUPPORTED_LANGS.reduce(
  (acc, lang) => {
    acc[lang] = LOCALE_BUNDLES[lang].nauti.tickleLines;
    return acc;
  },
  {} as Record<AppLang, string[]>,
);

export function pickTickleLine(
  lang: AppLang = 'es',
  prevLine?: string | null,
): string {
  const pool = TICKLE_LINES[lang] ?? TICKLE_LINES.es;
  const candidates = prevLine ? pool.filter((line) => line !== prevLine) : pool;
  const source = candidates.length > 0 ? candidates : pool;
  return source[Math.floor(Math.random() * source.length)];
}

export function pickNautiLine(
  type: NautiReactionType,
  seed = 0,
  lang: AppLang = 'es',
): string {
  const dict = (LOCALE_BUNDLES[lang] ?? LOCALE_BUNDLES.es).nauti.lines;
  const pool = dict[type];
  return pool[Math.abs(seed) % pool.length];
}

export function getNautiSpecialLines(lang: AppLang = 'es') {
  const nauti = (LOCALE_BUNDLES[lang] ?? LOCALE_BUNDLES.es).nauti;
  return {
    day5DelayedPenaltyNauti: nauti.day5DelayedPenaltyNauti,
    day5DelayedSafeNauti: nauti.day5DelayedSafeNauti,
    confirmStepNauti: nauti.confirmStepNauti,
  };
}
