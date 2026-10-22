'use client';

import { useState } from 'react';
import type { Locale } from '@/lib/i18n';

const lesson = { id: 'j9bWKx_k5A4', title: 'Useful Italian Greetings for Italian Learners', creator: 'Learn Italian with ItalianPod101.com' };

export default function ItalianLesson({ locale }: { locale: Locale }) {
  const [playing, setPlaying] = useState(false);
  const bn = locale === 'bn';
  const url = `https://www.youtube.com/watch?v=${lesson.id}`;
  return <section id="lesson" className="section lesson-section" aria-labelledby="lesson-title"><div className="container lesson-grid">
    <div className="lesson-copy"><span className="eyebrow">YOUR FIRST WORDS IN ITALIAN</span><h2 id="lesson-title">{bn ? 'একটি “Ciao!” দিয়ে' : 'Every conversation'}<br /><span className="accent">{bn ? 'শুরু হোক।' : 'starts with “Ciao!”'}</span></h2><p>{bn ? 'ইতালিয়ান অভিবাদন শিখুন একটি সহজ ভিডিও পাঠে। শুনুন, থামান, আবার বলুন—নিজের গতিতে।' : 'Get a feel for Italian with a lesson on greetings. Listen, pause, and try the words yourself, at your own pace.'}</p><div className="lesson-topics"><span>Ciao</span><span>Buongiorno</span><span>Buonasera</span></div><p className="lesson-credit">{bn ? 'বহিরাগত শিক্ষামূলক ভিডিও' : 'Public learning resource'}<br /><a href={url} target="_blank" rel="noopener noreferrer">{lesson.creator} ↗</a></p><p className="lesson-note">{bn ? 'এটি OFIB-এর নিজস্ব ক্লাস বা অংশীদারিত্বের ভিডিও নয়।' : 'An independently published lesson; this is not an OFIB class or partnership.'}</p></div>
    <div className="lesson-media"><div className="lesson-screen">{playing ? <iframe src={`https://www.youtube-nocookie.com/embed/${lesson.id}?autoplay=1&rel=0`} title={`${lesson.title} — ${lesson.creator}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /> : <button className="lesson-preview" type="button" onClick={() => setPlaying(true)} aria-label={bn ? 'ইতালিয়ান অভিবাদনের ভিডিও পাঠ চালু করুন' : 'Play the Italian greetings lesson'}><span className="lesson-preview-label">ITALIAN · FIRST CONVERSATIONS</span><span className="lesson-preview-word" lang="it">Ciao!</span><span className="lesson-play">▶</span><span className="lesson-preview-footer">{bn ? 'ইতালিয়ান অভিবাদন শিখুন' : 'Learn your first Italian greetings'}<span>↗</span></span></button>}</div><div className="lesson-media-caption"><span>{bn ? 'ইংরেজি ব্যাখ্যাসহ ইতালিয়ান পাঠ' : 'Italian lesson with English explanations'}</span><a href={url} target="_blank" rel="noopener noreferrer">{bn ? 'YouTube-এ দেখুন ↗' : 'Watch on YouTube ↗'}</a></div></div>
  </div></section>;
}
