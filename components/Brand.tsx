'use client';

import { useState } from 'react';
import { brand } from '@/lib/brand';

export default function Brand({ locale }: { locale: 'bn' | 'en' }) {
  const [failed, setFailed] = useState(false);
  return <a className="brand" href="#" aria-label={locale === 'bn' ? 'OFIB হোম' : 'OFIB home'}>
    {brand.logoSrc && !failed
      ? <img className="official-logo" src={brand.logoSrc} alt="OFIB" width={140} height={64} onError={() => setFailed(true)} />
      : <><span className="wordmark">ofib<span>.</span></span><span className="brand-caption">ITALIAN, IN BANGLA.</span></>}
  </a>;
}
