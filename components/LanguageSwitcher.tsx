'use client';

import Link from 'next/link';
import type { Locale } from '@/lib/i18n';

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  return <div className="language-switcher" role="group" aria-label={locale === 'bn' ? 'ভাষা নির্বাচন করুন' : 'Choose language'}>
    {(['bn', 'en'] as const).map(language => <Link
      key={language} href={`/${language}`} hrefLang={language} lang={language}
      aria-current={locale === language ? 'page' : undefined}
      onClick={() => { document.cookie = `ofib-language=${language}; Path=/; Max-Age=31536000; SameSite=Lax`; }}
    >{language === 'bn' ? 'বাংলা' : 'EN'}</Link>)}
  </div>;
}
