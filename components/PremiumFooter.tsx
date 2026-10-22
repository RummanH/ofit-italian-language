import Brand from './Brand';
import type { Locale } from '@/lib/i18n';

export default function PremiumFooter({ locale, year }: { locale: Locale; year: number }) {
  const bn = locale === 'bn';
  const copy = (bangla: string, english: string) => bn ? bangla : english;
  return <footer className="premium-footer">
    <div className="footer-gold-rule" aria-hidden="true" />
    <div className="container">
      <div className="footer-invitation">
        <div><span className="footer-overline"><span aria-hidden="true">✦</span> {copy('এখান থেকেই শুরু হোক নতুন গল্প', 'A NEW CHAPTER IS CALLING')}</span><h2>{copy('শুরু হোক', 'It all starts')}<br />{copy('একটি', 'with a little')} <em lang="it">Ciao.</em></h2><p>{copy('একটি নতুন ভাষা। নতুন মানুষের সাথে পরিচয়। নিজের জন্য আরও বড় একটি পৃথিবী।', 'A new language. A new connection. A bigger world to call your own.')}</p></div>
        <a className="footer-start" href="#courses"><span className="footer-start-circle" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><path d="M12 36 36 12M12 12h24v24" stroke="currentColor" strokeWidth="1.7" /></svg></span><span>{copy('আপনার যাত্রা শুরু করুন', 'Find your beginning')} <span aria-hidden="true">↗</span></span></a>
      </div>
      <div className="footer-directory">
        <div className="footer-brand-story"><Brand locale={locale} /><p>{copy('বাংলায় বুঝুন। আত্মবিশ্বাসে ইতালিয়ান বলুন। আপনার পরের অধ্যায়ের সঙ্গী OFIB।', 'Understand in Bangla. Speak Italian with confidence. Let OFIB be part of your next chapter.')}</p><div className="footer-language-seal"><span className="italian-flag" aria-hidden="true" /><span>ITALIAN, IN BANGLA.</span></div></div>
        <nav className="footer-link-column" aria-label={copy('শেখার পথ', 'Explore learning')}><h3>{copy('শেখার পথ', 'Your learning journey')}</h3><a href="#courses">{copy('আমাদের কোর্স', 'Explore our courses')}</a><a href="#level">{copy('আপনার স্তর খুঁজুন', 'Find your starting point')}</a><a href="#lesson">{copy('ইতালিয়ানের প্রথম পাঠ', 'Your first Italian lesson')}</a><a href="#trial">{copy('ট্রায়াল ক্লাস', 'Discover a trial class')}</a></nav>
        <nav className="footer-link-column" aria-label={copy('OFIB সম্পর্কে', 'Discover OFIB')}><h3>{copy('OFIB-এর জগৎ', 'The world of OFIB')}</h3><a href="#why">{copy('কেন OFIB', 'Why learn with OFIB')}</a><a href="#classroom">{copy('শেখার পরিবেশ', 'The learning experience')}</a><a href="#faq">{copy('আপনার প্রশ্নের উত্তর', 'A little clarity')}</a><a href="#contact">{copy('আপনার লক্ষ্য জানান', 'Tell us your goals')}</a></nav>
        <div className="footer-small-invitation"><span className="footer-orbit" aria-hidden="true">✳</span><h3>{copy('বড় স্বপ্নের', 'Big dreams.')}<br />{copy('ছোট্ট শুরু।', 'Small beginnings.')}</h3><a href="#contact">{copy('চলুন, কথা বলি', 'Let’s talk about yours')} <span aria-hidden="true">↗</span></a></div>
      </div>
      <div className="footer-farewell"><span lang="it">Ci vediamo<span className="footer-farewell-dot">.</span></span><p>{copy('আবার দেখা হবে।', 'Until we meet again.')}<br /><span>{copy('নতুন ভাষায়, নতুন সম্ভাবনায়।', 'In a world of new possibilities.')}</span></p></div>
      <div className="footer-legal"><span>© {year} OFIB. {copy('সর্বস্বত্ব সংরক্ষিত।', 'All rights reserved.')}</span><span>{copy('প্রতীকী ছবি: Pexels ও Unsplash', 'Illustrative photography: Pexels & Unsplash')}</span><a href="#main-content">{copy('আবার উপরে', 'Back to the beginning')} <span aria-hidden="true">↑</span></a></div>
    </div>
  </footer>;
}
