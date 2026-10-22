'use client';

import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from 'react';
import Brand from './Brand';
import LanguageSwitcher from './LanguageSwitcher';
import ItalianLesson from './ItalianLesson';
import AnnouncementMarquee from './AnnouncementMarquee';
import PremiumFooter from './PremiumFooter';
import { translator, type Locale, type TranslationKey } from '@/lib/i18n';

type Category = 'beginner' | 'intermediate' | 'speaking';
type Course = 'a1' | 'a2' | 'speaking' | 'trial' | 'help';
const courseLabels: Record<Course, TranslationKey> = {
  a1: 'A1 — ইতালিয়ান ভাষার হাতেখড়ি', a2: 'A2 — দৈনন্দিন জীবনের ইতালিয়ান',
  speaking: 'ইতালিয়ান স্পিকিং প্র্যাকটিস', trial: 'ফ্রি ট্রায়াল ক্লাস', help: 'কোর্স বাছাইয়ে সাহায্য চাই',
};
const levelToCourse: Record<Category, Course> = { beginner: 'a1', intermediate: 'a2', speaking: 'speaking' };

export default function HomePage({ locale, year }: { locale: Locale; year: number }) {
  const t = translator(locale);
  const ui = (bn: string, en: string) => locale === 'bn' ? bn : en;
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const [level, setLevel] = useState<Category | null>(null);
  const [course, setCourse] = useState<Course>('a1');
  const [draft, setDraft] = useState<{ name: string; message: string; course: Course } | null>(null);
  const [copyStatus, setCopyStatus] = useState<'success' | 'error' | null>(null);
  const [audioError, setAudioError] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') { setMenuOpen(false); menuRef.current?.focus(); } };
    const closeOutside = (event: globalThis.MouseEvent) => { if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false); };
    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('click', closeOutside);
    return () => { document.removeEventListener('keydown', closeOnEscape); document.removeEventListener('click', closeOutside); };
  }, [menuOpen]);
  useEffect(() => {
    if (!audioError) return;
    const timer = setTimeout(() => setAudioError(false), 6000);
    return () => clearTimeout(timer);
  }, [audioError]);
  useEffect(() => () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }, []);

  function handleCourseClick(event: MouseEvent<HTMLElement>) {
    const target = (event.target as HTMLElement).closest<HTMLElement>('[data-course]');
    const selected = target?.dataset.course;
    if (selected && selected in courseLabels) setCourse(selected as Course);
  }
  function createDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    for (const key of ['name', 'message']) {
      const input = form.elements.namedItem(key) as HTMLInputElement | HTMLTextAreaElement;
      if (!String(data.get(key) ?? '').trim()) {
        input.setCustomValidity(ui('অনুগ্রহ করে তথ্য লিখুন।', 'Please enter a value.'));
        input.reportValidity();
        input.addEventListener('input', () => input.setCustomValidity(''), { once: true });
        return;
      }
    }
    setDraft({ name: String(data.get('name')).trim(), message: String(data.get('message')).trim(), course });
    setCopyStatus(null);
  }
  const draftText = draft ? ui('আমার নাম ', 'My name is ') + draft.name + '.\n' + ui('আগ্রহের কোর্স: ', 'Course of interest: ') + t(courseLabels[draft.course]) + '\n\n' + draft.message : '';
  async function copyDraft() {
    try { await navigator.clipboard.writeText(draftText); setCopyStatus('success'); }
    catch { setCopyStatus('error'); }
  }
  function pronounce() {
    setAudioError(false);
    if (!('speechSynthesis' in window)) { setAudioError(true); return; }
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance('Ciao, come stai?'); speech.lang = 'it-IT'; speech.rate = 0.8;
    const voice = window.speechSynthesis.getVoices().find(item => item.lang.startsWith('it'));
    if (voice) speech.voice = voice;
    speech.onerror = event => { if (event.error !== 'canceled' && event.error !== 'interrupted') setAudioError(true); };
    window.speechSynthesis.speak(speech);
  }

  return <>
<a className="skip-link" href="#main-content">{ui("মূল বিষয়বস্তুতে যান", "Skip to main content")}</a>
<AnnouncementMarquee locale={locale} />
  <header className="header" ref={headerRef}><div className="container nav">
    <Brand locale={locale} />
    <LanguageSwitcher locale={locale} /><button ref={menuRef} onClick={() => setMenuOpen(!menuOpen)} className="menu-toggle" aria-label={menuOpen ? ui("মেনু বন্ধ করুন", "Close menu") : t("মেনু খুলুন")} aria-expanded={menuOpen} aria-controls="navigation">☰</button>
    <nav id="navigation" className={menuOpen ? "open" : ""} onClick={() => setMenuOpen(false)} aria-label={t("প্রধান নেভিগেশন")}><a href="#courses">{t("আমাদের কোর্স")}</a><a href="#why">{t("কেন OFIB")}</a><a href="#experience">{t("শেখার অভিজ্ঞতা")}</a><a href="#faq">{t("জিজ্ঞাসা")}</a></nav>
    <a href="#contact" className="button small nav-cta">{t("শুরু করুন")}{" "}<span>↗</span></a>
  </div></header>
  <main id="main-content" onClick={handleCourseClick}>
    <section className="hero"><div className="container hero-grid">
      <div className="hero-copy"><div className="eyebrow"><span className="italian-flag"></span>{" "}{t("বাংলা থেকে ইতালিয়ান, সহজেই")}</div>
        {locale === "en" ? <h1 className="english-hero-title">A new language.<br />A world of <span className="accent">possibilities.</span></h1> : <h1>{t("নতুন ভাষায়")}<br />{t("খুলুক")}{" "}<span className="accent">{t("নতুন")}<br className="desktop-break" />{" "}{t("সম্ভাবনার")}</span>{" "}{t("দুয়ার।")}</h1>}
        <p>{t("নিজের ভাষায় বুঝুন, আত্মবিশ্বাসের সাথে ইতালিয়ান বলুন। একদম শুরু থেকে বাস্তব জীবনের কথোপকথন—আপনার শেখার সঙ্গী OFIB।")}</p>
        <div className="actions"><a className="button" href="#courses">{t("আপনার কোর্স খুঁজুন")}{" "}<span>↗</span></a><a className="text-link" href="#lesson"><span className="play">▶</span>{" "}{t("শেখার অভিজ্ঞতা দেখুন")}</a></div>
        <div className="hero-note"><span className="mini-icon">✓</span>{" "}{t("বাংলায় ব্যাখ্যা")}{" "}<span className="dot">·</span>{" "}{t("নিজের গতিতে শেখা")}{" "}<span className="dot">·</span>{" "}{t("বাস্তব কথোপকথন")}</div>
      </div>
      <div className="hero-art"><div className="photo-frame"><img className="hero-photo" src="/media/student-campus-v3.jpg" alt={ui("ক্যাম্পাসের সিঁড়িতে হলুদ জামা পরা একজন প্রাপ্তবয়স্ক শিক্ষার্থী, হাতে বই — প্রতীকী ছবি", "An adult female student in a yellow shirt holding books outdoors on campus ? illustrative photography")} width={5760} height={3840} fetchPriority="high" decoding="async" /><div className="photo-shade"></div><div className="photo-caption"><span>YOUR NEXT CHAPTER</span><strong>{t("শুরু হোক একটি “Ciao!” দিয়ে।")}</strong></div></div>
        <div className="greeting"><span>🇮🇹</span><div><strong>Ciao, come stai?</strong><small>{t("হ্যালো, কেমন আছো?")}</small></div><button type="button" onClick={pronounce} id="pronounce" aria-label={t("ইতালিয়ান উচ্চারণ শুনুন")}>◖))</button></div>
        <div className="floating-note"><span className="spark">✦</span><strong>{t("ভাষার দূরত্ব কমুক।")}<br />{t("স্বপ্নের পথ সহজ হোক।")}</strong></div><span className="art-scribble" aria-hidden="true">✳</span>
      </div>
    </div><div className="container hero-bottom"><span>LEARN A LANGUAGE. LIVE A LITTLE MORE.</span><div>{t("বাংলায় বুঝি")}{" "}<i>↗</i>{" "}{t("ইতালিয়ান বলি")}{" "}<i>↗</i>{" "}{t("এগিয়ে যাই")}</div></div></section>

    <ItalianLesson locale={locale} />
    <section id="opportunities" className="section"><div className="container"><div className="section-heading"><div><span className="eyebrow">A LANGUAGE. A WORLD OF POSSIBILITIES.</span><h2>{t("শুধু একটি ভাষা নয়,")}<br />{t("একটি নতুন পৃথিবী।")}</h2></div><p>{t("ইতালির রাস্তায়, বিশ্ববিদ্যালয়ে কিংবা কর্মক্ষেত্রে—ভাষা জানা মানে আরও স্বাধীনভাবে এগিয়ে চলা।")}</p></div>
      <div className="opportunity-grid"><article className="image-card"><img src="/media/italy-coast.jpg" alt={t("ইতালির রঙিন সমুদ্রতীরের শহর")} loading="lazy" decoding="async" /><div><span>01 / EVERYDAY LIFE</span><h3>{t("ইতালির জীবন হোক সহজ")}</h3><p>{t("প্রতিদিনের কথা, নিজের ভাষার মতোই।")}</p></div><span className="card-arrow">↗</span></article><article className="image-card"><img src="/media/students-together.jpg" alt={t("স্নাতক সমাবর্তনে শিক্ষার্থীরা")} loading="lazy" decoding="async" /><div><span>02 / STUDY & GROW</span><h3>{t("শিক্ষার নতুন দিগন্ত")}</h3><p>{t("ক্লাসরুমের বাইরেও আত্মবিশ্বাসী থাকুন।")}</p></div><span className="card-arrow">↗</span></article><article className="image-card"><img src="/media/workplace-team.jpg" alt={t("একসঙ্গে কাজ করছেন তরুণ পেশাজীবীরা")} loading="lazy" decoding="async" /><div><span>03 / WORK & CONNECT</span><h3>{t("কাজে আসুক আত্মবিশ্বাস")}</h3><p>{t("মানুষের সাথে গড়ে উঠুক সহজ সংযোগ।")}</p></div><span className="card-arrow">↗</span></article></div>
    </div></section>

    <section id="courses" className="section courses-section"><div className="container"><div className="section-heading"><div><span className="eyebrow">FIND YOUR NEXT STEP</span><h2>{t("আপনার শুরুটা হোক")}<br /><span className="accent">{t("সঠিক কোর্সের সাথে।")}</span></h2></div><p>{t("প্রথম শব্দ থেকে সাবলীল কথোপকথন। আপনার লক্ষ্য অনুযায়ী বেছে নিন শেখার পথ।")}</p></div>
      <div className="filters" role="group" aria-label={t("কোর্সের ধরন")}><button type="button" className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")} data-filter="all" aria-pressed={filter === "all"}>{t("সকল কোর্স")}</button><button type="button" className={filter === "beginner" ? "active" : ""} onClick={() => setFilter("beginner")} data-filter="beginner" aria-pressed={filter === "beginner"}>{t("একদম শুরু")}</button><button type="button" className={filter === "intermediate" ? "active" : ""} onClick={() => setFilter("intermediate")} data-filter="intermediate" aria-pressed={filter === "intermediate"}>{t("পরবর্তী ধাপ")}</button><button type="button" className={filter === "speaking" ? "active" : ""} onClick={() => setFilter("speaking")} data-filter="speaking" aria-pressed={filter === "speaking"}>{t("কথোপকথন")}</button></div>
      <div className="course-grid"><article className="course-card" data-category="beginner" hidden={filter !== "all" && filter !== "beginner"}><div className="course-visual peach"><span className="course-tag">BEGINNER</span><span className="course-level">A1<span>{t("ইতালিয়ান")}</span></span><img src="/media/italy-rome.jpg" alt={t("রোমের কলোসিয়াম")} loading="lazy" decoding="async" /><span className="visual-word">Ciao!</span></div><div className="course-body"><span className="course-kicker">{t("আপনার প্রথম পদক্ষেপ")}</span><h3>{t("ইতালিয়ান ভাষার হাতেখড়ি")}</h3><p>{t("বর্ণমালা, পরিচয় আর ছোট ছোট বাক্যে শুরু হোক নতুন ভাষার সাথে বন্ধুত্ব।")}</p><div className="course-meta"><span>{t("◷ ভিত্তি গড়ার কোর্স")}</span><span>{t("বাংলায় ব্যাখ্যা")}</span></div><a href="#contact" className="course-link" data-course="a1">{t("কোর্স সম্পর্কে জানুন")}{" "}<span>↗</span></a></div></article>
      <article className="course-card" data-category="intermediate" hidden={filter !== "all" && filter !== "intermediate"}><div className="course-visual mint"><span className="course-tag">ELEMENTARY</span><span className="course-level">A2<span>{t("ইতালিয়ান")}</span></span><img src="/media/italy-coast.jpg" alt={t("ভেনিসের খাল এবং ঐতিহাসিক ভবন")} loading="lazy" decoding="async" /><span className="visual-word">Andiamo!</span></div><div className="course-body"><span className="course-kicker">{t("আরও এক ধাপ এগিয়ে")}</span><h3>{t("দৈনন্দিন জীবনের ইতালিয়ান")}</h3><p>{t("কেনাকাটা, যাতায়াত আর কাজের কথায় আরও স্বচ্ছন্দ হয়ে উঠুন।")}</p><div className="course-meta"><span>{t("◷ ভিত্তি থেকে এগিয়ে")}</span><span>{t("বাংলায় ব্যাখ্যা")}</span></div><a href="#contact" className="course-link" data-course="a2">{t("কোর্স সম্পর্কে জানুন")}{" "}<span>↗</span></a></div></article>
      <article className="course-card" data-category="speaking" hidden={filter !== "all" && filter !== "speaking"}><div className="course-visual lavender"><span className="course-tag">CONVERSATION</span><span className="course-level speaking-title">Parliamo!<span>{t("চলুন, কথা বলি")}</span></span><img src="/media/workplace-team.jpg" alt={t("আলোচনায় অংশ নিচ্ছেন কয়েকজন শিক্ষার্থী — প্রতীকী ছবি")} loading="lazy" decoding="async" /></div><div className="course-body"><span className="course-kicker">{t("জড়তা কাটুক, কথা হোক")}</span><h3>{t("ইতালিয়ান স্পিকিং প্র্যাকটিস")}</h3><p>{t("চেনা পরিস্থিতি আর নিয়মিত অনুশীলনে নিজের কথাগুলো সহজে বলুন।")}</p><div className="course-meta"><span>{t("◷ কথোপকথনে জোর")}</span><span>{t("প্র্যাকটিসভিত্তিক")}</span></div><a href="#contact" className="course-link" data-course="speaking">{t("কোর্স সম্পর্কে জানুন")}{" "}<span>↗</span></a></div></article></div><p className="section-footnote">{t("প্রস্তাবিত কোর্সের পরিচিতি। চূড়ান্ত সিলেবাস, সময়সূচি ও ফি জানতে যোগাযোগ করুন।")}</p>
    </div></section>

    <section id="why" className="section"><div className="container why-grid"><div className="why-intro"><span className="eyebrow">MADE FOR THE WAY YOU LEARN</span><h2>{t("কঠিন ভাষাও সহজ,")}<br />{t("যখন বুঝি")}{" "}<span className="accent">{t("বাংলায়।")}</span></h2><p>{t("শেখা শুধু মুখস্থ করা নয়। বুঝে শেখা, ভুল করা, আবার চেষ্টা করা—এই ছোট ছোট ধাপেই আসে আত্মবিশ্বাস।")}</p><a href="#how" className="text-link">{t("আমাদের শেখার পদ্ধতি")}{" "}<span>↗</span></a><div className="language-note"><span>{t("“আমি পারব।”")}</span><i>↓</i><strong>“Posso farcela.”</strong></div></div><div className="benefits"><article><span className="feature-icon">{t("অ")}</span><h3>{t("নিজের ভাষায় পরিষ্কার ধারণা")}</h3><p>{t("ইতালিয়ান ব্যাকরণ বুঝুন পরিচিত বাংলা উদাহরণ দিয়ে।")}</p></article><article><span className="feature-icon">↔</span><h3>{t("বাস্তব জীবনের কথোপকথন")}</h3><p>{t("বইয়ের বাইরের পরিস্থিতিতে ব্যবহার করতে শিখুন নতুন শব্দ।")}</p></article><article><span className="feature-icon">◎</span><h3>{t("ছোট ধাপে নিয়মিত অনুশীলন")}</h3><p>{t("প্রতিদিন একটু একটু করে গড়ে তুলুন শেখার অভ্যাস।")}</p></article><article><span className="feature-icon">✦</span><h3>{t("বোঝা থেকে বলা পর্যন্ত")}</h3><p>{t("শোনা, পড়া, লেখা আর বলায় সমান গুরুত্ব দিয়ে এগিয়ে যান।")}</p></article></div></div></section>

    <section id="how" className="section steps-section"><div className="container"><div className="center-heading"><span className="eyebrow">SMALL STEPS. REAL PROGRESS.</span><h2>{t("শুরুটা যত সহজ, পথটাও তত সুন্দর।")}</h2></div><div className="steps"><article><span>01</span><h3>{t("নিজের লক্ষ্য ঠিক করুন")}</h3><p>{t("কেন শিখতে চান, কোথা থেকে শুরু করবেন—সেটি বুঝে নিন।")}</p></article><article><span>02</span><h3>{t("সঠিক কোর্সটি বেছে নিন")}</h3><p>{t("আপনার বর্তমান দক্ষতার সাথে মিলে যায় এমন কোর্স খুঁজুন।")}</p></article><article><span>03</span><h3>{t("শিখুন, বলুন, এগিয়ে যান")}</h3><p>{t("নিয়মিত অনুশীলনে নতুন ভাষা হয়ে উঠুক প্রতিদিনের সঙ্গী।")}</p></article></div></div></section>

    <section id="classroom" className="section"><div className="container classroom-grid"><div className="classroom-image"><img src="/media/students-together.jpg" alt={t("একসাথে পড়াশোনা করছেন শিক্ষার্থীরা — শেখার পরিবেশের প্রতীকী ছবি")} loading="lazy" decoding="async" /><span className="image-label">{t("একসাথে শেখার আনন্দ")}{" "}<span>✦</span></span></div><div><span className="eyebrow">MORE THAN A CLASSROOM</span><h2>{t("যেখানে ভুল করাও")}<br /><span className="accent">{t("শেখার একটা অংশ।")}</span></h2><p>{t("প্রথমবার ইতালিয়ান বলতে গিয়ে থেমে যাওয়া স্বাভাবিক। একটি স্বচ্ছন্দ পরিবেশেই আসে আবার বলার সাহস।")}</p><ul className="check-list"><li>{t("পরিচিত পরিস্থিতি নিয়ে কথা বলা")}</li><li>{t("মন দিয়ে শোনা, বুঝে উত্তর দেওয়া")}</li><li>{t("নতুন শব্দকে নিজের বাক্যে ব্যবহার করা")}</li></ul><a className="button" href="#trial">{t("আপনার প্রথম ক্লাস")}{" "}<span>↗</span></a></div></div></section>

    <section id="skills" className="section skills-section"><div className="container"><div className="section-heading"><div><span className="eyebrow">ONE LANGUAGE. FOUR ESSENTIAL SKILLS.</span><h2>{t("শুধু জানবেন না।")}<br />{t("ব্যবহারও করতে শিখবেন।")}</h2></div><p>{t("একটি ভাষাকে নিজের করে নিতে চারটি দক্ষতায় এগিয়ে চলুন একসাথে।")}</p></div><div className="skills-grid"><article><span>01 / ASCOLTARE</span><div>◖))</div><h3>{t("শুনে বুঝুন")}</h3><p>{t("ইতালিয়ান শব্দের সুর আর উচ্চারণের সাথে পরিচিত হোন।")}</p></article><article><span>02 / PARLARE</span><div>“ ”</div><h3>{t("মন খুলে বলুন")}</h3><p>{t("ছোট বাক্য দিয়ে শুরু করে নিজের ভাবনা প্রকাশ করুন।")}</p></article><article><span>03 / LEGGERE</span><div>▤</div><h3>{t("পড়ে জানুন")}</h3><p>{t("সাইনবোর্ড থেকে ছোট গল্প—লেখার অর্থ বুঝতে শিখুন।")}</p></article><article><span>04 / SCRIVERE</span><div>✎</div><h3>{t("গুছিয়ে লিখুন")}</h3><p>{t("মেসেজ, পরিচয় আর দৈনন্দিন প্রয়োজনের লেখা লিখুন।")}</p></article></div></div></section>

    <section id="level" className="section"><div className="container level-box"><div><span className="eyebrow">LET’S FIND YOUR STARTING POINT</span><h2>{t("কোথা থেকে শুরু করবেন?")}</h2><p>{t("আপনার সাথে সবচেয়ে বেশি মিলে যায় কোনটি?")}</p></div><div className="level-options"><button type="button" className={level === "beginner" ? "selected" : ""} aria-pressed={level === "beginner"} onClick={() => setLevel("beginner")} data-level="beginner">{t("একদম নতুন, শুরু করতে চাই")}{" "}<span>↗</span></button><button type="button" className={level === "intermediate" ? "selected" : ""} aria-pressed={level === "intermediate"} onClick={() => setLevel("intermediate")} data-level="intermediate">{t("কিছুটা জানি, আরও শিখতে চাই")}{" "}<span>↗</span></button><button type="button" className={level === "speaking" ? "selected" : ""} aria-pressed={level === "speaking"} onClick={() => setLevel("speaking")} data-level="speaking">{t("বুঝতে পারি, বলতে জড়তা লাগে")}{" "}<span>↗</span></button><div id="level-result" role="status" hidden={!level}>{level && <>{ui("আপনার জন্য প্রাথমিক পরামর্শ: ", "Your suggested starting point: ")}{t(courseLabels[levelToCourse[level]])}. {ui("এটি আনুষ্ঠানিক মূল্যায়ন নয়।", "This is not a formal assessment.")} <a href="#courses" onClick={() => setFilter(level)}>{ui("কোর্সটি দেখুন ↗", "Explore the course ↗")}</a></>}</div></div></div></section>

    <section id="trial" className="trial-section"><div className="container trial-grid"><div><span className="eyebrow">YOUR FIRST CIAO STARTS HERE</span><h2>{t("একটি ক্লাস।")}<br />{t("একটি নতুন শুরু।")}</h2><p>{t("শেখার পদ্ধতিটি আপনার জন্য কেমন হবে, আগে পরিচিত হয়ে নিন। ট্রায়াল ক্লাসের তথ্য জানতে আগ্রহ জানান।")}</p><a className="button coral" href="#contact" data-course="trial">{t("ট্রায়াল ক্লাসে আগ্রহী")}{" "}<span>↗</span></a></div><div className="trial-art"><img src="/media/study-notes.jpg" alt={t("খাতায় লিখে অনুশীলন করছেন একজন শিক্ষার্থী")} loading="lazy" decoding="async" /><div className="trial-sticker">Ciao!<span>{t("নতুন শুরুকে স্বাগত।")}</span></div></div></div></section>

    <section id="experience" className="section"><div className="container experience-grid"><div><span className="eyebrow">EVERY LEARNER HAS A STORY</span><h2>{t("আপনার গল্পের")}<br />{t("পরের অধ্যায়")}{" "}<span className="accent">{t("কী হবে?")}</span></h2><p>{t("প্রথমবার নিজের পরিচয় দেওয়া। দোকানে নিজেই কথা বলা। নতুন বন্ধুর সাথে গল্প করা। ছোট ছোট মুহূর্তেই ধরা দেয় ভাষা শেখার আনন্দ।")}</p><a className="text-link" href="#contact">{t("আপনার লক্ষ্য আমাদের জানান")}{" "}<span>↗</span></a></div><div className="story-placeholder"><span className="quote-mark">“</span><h3>{t("আজকের প্রথম শব্দ,")}<br />{t("আগামীকালের আত্মবিশ্বাস।")}</h3><p>{t("এখানেই থাকবে OFIB শিক্ষার্থীদের নিজস্ব অভিজ্ঞতা।")}</p><span className="pending-label">{t("যাচাইকৃত শিক্ষার্থীর গল্প শীঘ্রই যুক্ত হবে")}</span></div></div></section>

    <section id="faq" className="section faq-section"><div className="container faq-grid"><div><span className="eyebrow">A LITTLE CLARITY GOES A LONG WAY</span><h2>{t("মনে প্রশ্ন?")}<br />{t("চলুন, জেনে নিই।")}</h2><p>{t("আরও কিছু জানতে চাইলে আপনার প্রশ্ন লিখে রাখুন।")}</p><a className="text-link" href="#contact">{t("প্রশ্ন জানান")}{" "}<span>↗</span></a></div><div className="faq-list"><details open><summary>{t("একদম নতুন হলে কোথা থেকে শুরু করব?")}</summary><p>{t("শুরুর জন্য A1 স্তরের কোর্সটি দেখতে পারেন। এতে বর্ণমালা, নিজের পরিচয় এবং দৈনন্দিন সহজ বাক্যের ভিত্তি তৈরি হয়। ভর্তি হওয়ার আগে কোর্সের বিস্তারিত নিশ্চিত করে নিন।")}</p></details><details><summary>{t("বাংলায় কি ব্যাখ্যা পাওয়া যাবে?")}</summary><p>{t("OFIB-এর মূল উদ্দেশ্য বাংলাভাষী শিক্ষার্থীদের ইতালিয়ান শেখা সহজ করা। বাংলা ব্যাখ্যার সাথে ইতালিয়ান শব্দ ও বাক্য অনুশীলনের ওপর জোর দেওয়া হয়।")}</p></details><details><summary>{t("ক্লাসের সময়সূচি ও ফি কীভাবে জানব?")}</summary><p>{t("নিচের ফর্মে আপনার আগ্রহের কোর্স নির্বাচন করে প্রশ্নের খসড়া তৈরি করুন। চূড়ান্ত সময়সূচি, ফি এবং ভর্তির তথ্য OFIB-এর কাছ থেকে নিশ্চিত করতে হবে।")}</p></details><details><summary>{t("কোন স্তরটি আমার জন্য উপযুক্ত?")}</summary><p>{t("উপরের “কোথা থেকে শুরু করবেন” অংশ থেকে একটি প্রাথমিক ধারণা পাবেন। এটি আনুষ্ঠানিক মূল্যায়ন নয়; কোর্স বাছাইয়ের আগে আপনার বর্তমান দক্ষতা নিয়ে আলোচনা করুন।")}</p></details><details><summary>{t("এই পেজ থেকে কি এখনই ভর্তি হওয়া যাবে?")}</summary><p>{t("এই সংস্করণে কোর্সের পরিচিতি দেখা ও প্রশ্নের খসড়া তৈরি করা যায়। অনলাইন ভর্তি, অর্থপ্রদান এবং ফর্ম জমা দেওয়ার সুবিধা এখনো সংযুক্ত হয়নি।")}</p></details></div></div></section>

    <section id="contact" className="section"><div className="container contact-grid"><div><span className="eyebrow">LET’S BEGIN SOMETHING GOOD</span><h2>{t("আপনার স্বপ্নের পথে,")}<br />{t("প্রথম কথাটি হোক")}{" "}<span className="accent">{t("আজই।")}</span></h2><p>{t("কোর্স সম্পর্কে জানতে বা শেখার লক্ষ্য জানাতে আপনার প্রশ্নের খসড়া তৈরি করুন।")}</p><div className="contact-note"><span className="italian-flag"></span><span>{t("বাংলায় শুরু। ইতালিয়ানে সম্ভাবনা।")}</span></div></div><form id="inquiry-form" onSubmit={createDraft}><label htmlFor="name">{t("আপনার নাম")}</label><input onInvalid={event => event.currentTarget.setCustomValidity(ui("??????? ??? ???? ??????", "Please fill out this field."))} onInput={event => event.currentTarget.setCustomValidity("")} id="name" name="name" autoComplete="name" placeholder={t("আপনার নাম লিখুন")} required maxLength={100} /><label htmlFor="course">{t("কোন কোর্সে আগ্রহী?")}</label><select id="course" name="course" value={course} onChange={event => setCourse(event.target.value as Course)}><option value="a1">{t("A1 — ইতালিয়ান ভাষার হাতেখড়ি")}</option><option value="a2">{t("A2 — দৈনন্দিন জীবনের ইতালিয়ান")}</option><option value="speaking">{t("ইতালিয়ান স্পিকিং প্র্যাকটিস")}</option><option value="trial">{t("ফ্রি ট্রায়াল ক্লাস")}</option><option value="help">{t("কোর্স বাছাইয়ে সাহায্য চাই")}</option></select><label htmlFor="message">{t("আপনার প্রশ্ন বা শেখার লক্ষ্য")}</label><textarea onInvalid={event => event.currentTarget.setCustomValidity(ui("??????? ??? ???? ??????", "Please fill out this field."))} onInput={event => event.currentTarget.setCustomValidity("")} id="message" name="message" rows={3} placeholder={t("কী জানতে চান লিখুন…")} required maxLength={1500}></textarea><button className="button" type="submit">{t("প্রশ্নের খসড়া তৈরি করুন")}{" "}<span>↗</span></button><p className="form-note">{t("এটি ডিজাইন প্রিভিউ। তথ্য পাঠানো বা সংরক্ষণ করা হবে না।")}</p><div id="draft-result" hidden={!draft} aria-live="polite"><strong>{t("আপনার প্রশ্নের খসড়া")}</strong><p id="draft-text">{draftText}</p><button type="button" onClick={copyDraft} id="copy-draft" className="text-link">{t("খসড়া কপি করুন ↗")}</button><span id="copy-status" role="status">{copyStatus === "success" ? ui("খসড়া কপি হয়েছে। এটি কোথাও পাঠানো হয়নি।", "Draft copied. It has not been sent anywhere.") : copyStatus === "error" ? ui("লেখাটি নির্বাচন করে কপি করুন।", "Please select the text and copy it manually.") : ""}</span></div></form></div></section>
  </main>
  <PremiumFooter locale={locale} year={year} />
  <div id="audio-status" className="toast" role="status" hidden={!audioError}>{audioError && ui("উচ্চারণ চালানো যায়নি। ডিভাইসে ইতালিয়ান ভয়েস প্রয়োজন হতে পারে।", "Audio is unavailable. Your device may need an Italian voice installed.")}</div>
</>;
}
