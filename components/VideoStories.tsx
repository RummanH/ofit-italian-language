'use client';

import { useState } from 'react';
import type { Locale } from '@/lib/i18n';

export default function VideoStories({ locale }: { locale: Locale }) {
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const bn = locale === 'bn';
  const clips = [
    { file: 'students-library', poster: 'students-together', number: '01', title: bn ? 'একসাথে শেখার আনন্দ' : 'Good company. Better learning.', description: bn ? 'লাইব্রেরিতে একসাথে পড়াশোনার একটি মুহূর্ত।' : 'A quiet moment of discovery in the library.' },
    { file: 'study-session', poster: 'collaboration', number: '02', title: bn ? 'ছোট ধাপে, নতুন আত্মবিশ্বাস' : 'Small steps. A little more confidence.', description: bn ? 'নোট নেওয়া, ভাবনা ভাগ করা আর এগিয়ে চলা।' : 'Taking notes, sharing ideas, moving forward.' },
  ];
  return <section id="films" className="section films-section" aria-labelledby="films-title">
    <div className="container">
      <div className="section-heading"><div><span className="eyebrow">THE JOY OF LEARNING · IN MOTION</span><h2 id="films-title">{bn ? 'শেখার মুহূর্তগুলো' : 'A little inspiration.'}<br /><span className="accent">{bn ? 'দেখুন নতুন চোখে।' : 'A world ahead.'}</span></h2></div><p>{bn ? 'একসাথে শেখা আর নতুন কিছু আবিষ্কারের আনন্দের এক ঝলক।' : 'A glimpse of the curiosity, connection, and possibility that make learning worthwhile.'}</p></div>
      <div className="films-grid">{clips.map(clip => <article className="film-card" key={clip.file}>
        <div className="film-player"><video controls playsInline preload="none" poster={`/media/${clip.poster}.jpg`} aria-label={clip.title} aria-describedby={`${clip.file}-description`} onError={() => setFailed(previous => ({ ...previous, [clip.file]: true }))}>
          <source src={`/media/${clip.file}.mp4`} type="video/mp4" />
          <a href={`/media/${clip.file}.mp4`}>{bn ? 'ভিডিও খুলুন' : 'Open video'}</a>
        </video></div>
        <div className="film-description"><span className="film-number">{clip.number}</span><div><h3>{clip.title}</h3><p id={`${clip.file}-description`}>{clip.description}</p>{failed[clip.file] && <a className="text-link" href={`/media/${clip.file}.mp4`}>{bn ? 'ভিডিওটি সরাসরি খুলুন ↗' : 'Open the video directly ↗'}</a>}</div><span className="film-quality">4K</span></div>
      </article>)}</div>
      <p className="film-disclosure">{bn ? 'শেখার পরিবেশের প্রতীকী ভিডিও। এটি OFIB-এর নিজস্ব ক্লাসের দৃশ্য নয়। ভিডিওগুলোতে কথোপকথন নেই।' : 'Illustrative study films, rather than footage of OFIB classes. These films contain no dialogue.'}</p>
    </div>
  </section>;
}
