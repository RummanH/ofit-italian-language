# OFIB â€” bilingual Next.js website

The original twelve-section design, rebuilt with the Next.js App Router, React, and TypeScript. Warm ivory, forest green, coral accents, photography, and responsive layouts are retained.

## Run locally

```sh
npm install
npm run dev
```

Open `http://localhost:3000`. Bengali is the default; the header switches between `/bn` and `/en`. The language preference is stored in a cookie and respected when returning to `/`. Both pages render their translated content on the server, with the correct document language and page metadata.

```sh
npm run typecheck
npm run build
npm start
```

## Fonts and branding

- DM Sans handles English body text, Manrope handles English headings and the wordmark, and Hind Siliguri handles Bengali text. All three are bundled locally via Fontsource; the site does not depend on Google Fonts requests.
- **The official OFIB logo has not been obtained.** The existing text wordmark remains a temporary fallback, not a verified logo. Add the official asset under `public/brand/` and set `logoSrc` in `lib/brand.ts`. Header and footer share the same brand component.
- Images are illustrative Unsplash photographs; they do not depict OFIB's actual staff or students. External image delivery requires an internet connection.

## Content and interactions

`components/HomePage.tsx` contains the preserved design and React interactions. `lib/translations.json` holds the page translations, and `app/refinements.css` contains typography and language-control refinements.

Course filtering, course suggestions, accessible mobile navigation, FAQ expansion, Italian speech playback, and the inquiry draft builder work in both languages. Pronunciation depends on browser speech support and available voices. Clipboard support depends on browser permissions.

The contact form only creates a local draft: it does not send or store information. Course details remain proposed content; genuine testimonials, official contact details, and enrollment services still need to be supplied before a public launch.

The original vanilla files are kept in `design-reference/` for comparison.

The production build and TypeScript checks passed locally. Vercel logs shared so far show the build environment and repository checkout only; share later output if the deployment fails.

