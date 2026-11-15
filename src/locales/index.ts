import esLocale from './es.json';
import enLocale from './en.json';
import gnPyLocale from './gn-PY.json';

export type AppLang = 'es' | 'en' | 'gn-PY';

export const SUPPORTED_LANGS: readonly AppLang[] = ['es', 'en', 'gn-PY'] as const;

export type LocaleBundle = typeof esLocale;

export const LOCALE_BUNDLES: Record<AppLang, LocaleBundle> = {
  es: esLocale,
  en: enLocale as LocaleBundle,
  'gn-PY': gnPyLocale as LocaleBundle,
};

export const LANGUAGE_OPTIONS: ReadonlyArray<{
  code: AppLang;
  label: string;
  shortLabel: string;
  accessibleLabel: string;
  htmlLang: string;
}> = [
  {
    code: 'es',
    label: 'Español',
    shortLabel: 'ES',
    accessibleLabel: 'Español — Spanish',
    htmlLang: 'es',
  },
  {
    code: 'en',
    label: 'English',
    shortLabel: 'EN',
    accessibleLabel: 'English',
    htmlLang: 'en',
  },
  {
    code: 'gn-PY',
    label: 'Avañe’ẽ',
    shortLabel: 'GN',
    accessibleLabel: 'Avañe’ẽ — Paraguayan Guaraní',
    htmlLang: 'gn-PY',
  },
];

export function isAppLang(value: unknown): value is AppLang {
  return value === 'es' || value === 'en' || value === 'gn-PY';
}

export function interpolateTemplate(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) =>
    Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : '',
  );
}
