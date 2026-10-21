import translations from './translations.json';

export type Locale = 'bn' | 'en';
export type TranslationKey = keyof typeof translations;
export function isLocale(value: string): value is Locale { return value === 'bn' || value === 'en'; }
export function translator(locale: Locale) {
  return (key: TranslationKey): string => locale === 'en' ? translations[key] : key;
}
