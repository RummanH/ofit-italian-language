'use client';

import { useState } from 'react';
import type { Locale } from '@/lib/i18n';

export default function AnnouncementMarquee({ locale }: { locale: Locale }) {
  const [paused, setPaused] = useState(false);
  const bn = locale === 'bn';
  function group(duplicate: boolean) {
    return <div className="announcement-group" aria-hidden={duplicate || undefined}>
      <span className="announcement-message">
        <span className="announcement-star" aria-hidden="true">✦</span>
        <strong>{bn ? 'নতুন ভাষা, নতুন আত্মবিশ্বাস, নতুন সম্ভাবনা।' : 'A new language. A new confidence. A world of possibilities.'}</strong>
        <span>{bn ? 'বাংলায় সহজ ব্যাখ্যা আর প্রতিদিনের কথোপকথনের চর্চায় শিখুন ইতালিয়ান—প্রথম “Ciao!” থেকে ইতালিতে আপনার জীবনের পরের অধ্যায়, প্রতিটি পদক্ষেপে পাশে থাকুক OFIB।' : 'Learn Italian with clear explanations in Bangla and everyday conversation practice—from your first “Ciao!” to your next chapter in Italy, take each step with OFIB.'}</span>
        <a href="#trial" tabIndex={duplicate ? -1 : undefined}>{bn ? 'আপনার শেখার যাত্রা শুরু করুন' : 'Begin your Italian journey'} <span aria-hidden="true">↗</span></a>
        <span className="announcement-star" aria-hidden="true">✦</span>
      </span>
    </div>;
  }
  return <div className={`announcement announcement-marquee${paused ? ' is-paused' : ''}`} role="region" aria-label={bn ? 'OFIB ঘোষণা' : 'OFIB announcements'}>
    <div className="announcement-window"><div className="announcement-track">{group(false)}{group(true)}</div></div>
    <button type="button" className="announcement-pause" onClick={() => setPaused(!paused)} aria-pressed={paused} aria-label={paused ? (bn ? 'ঘোষণার চলাচল চালু করুন' : 'Resume announcement scrolling') : (bn ? 'ঘোষণার চলাচল থামান' : 'Pause announcement scrolling')}><span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span></button>
  </div>;
}
