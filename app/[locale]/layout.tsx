import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import '@fontsource-variable/dm-sans';
import '@fontsource-variable/manrope';
import '@fontsource/hind-siliguri/400.css';
import '@fontsource/hind-siliguri/500.css';
import '@fontsource/hind-siliguri/600.css';
import '@fontsource/hind-siliguri/700.css';
import '../globals.css';
import '../refinements.css';
import '../premium.css';
import '../golden.css';
import '../lesson.css';
import '../marquee.css';
import '../footer.css';
import '../typography.css';
import { isLocale } from '@/lib/i18n';

export const dynamicParams = false;
export function generateStaticParams() { return [{ locale: 'bn' }, { locale: 'en' }]; }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const english = locale === 'en';
  return {
    title: english ? 'OFIB — Learn Italian in Bangla' : 'OFIB — বাংলায় শিখুন, ইতালিয়ান বলুন',
    description: english ? 'Begin your Italian learning journey with OFIB. Explore courses explained in Bangla, from your first words to everyday conversations.' : 'OFIB — বাংলায় ইতালিয়ান শেখার একটি নতুন অভিজ্ঞতা। আপনার জন্য সঠিক কোর্স খুঁজে নিন।',
    alternates: { languages: { bn: '/bn', en: '/en' } },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <html lang={locale}><body>{children}</body></html>;
}
