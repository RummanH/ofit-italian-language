# OFIB — bilingual Next.js website

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

- Noto Sans Bengali, including Latin glyphs and weights 400–700, is bundled locally via Fontsource. The site does not depend on Google Fonts requests.
- **The official OFIB logo has not been obtained.** The existing text wordmark remains a temporary fallback, not a verified logo. Add the official asset under `public/brand/` and set `logoSrc` in `lib/brand.ts`. Header and footer share the same brand component.
- Images are illustrative Unsplash photographs; they do not depict OFIB's actual staff or students. External image delivery requires an internet connection.

## Content and interactions

`components/HomePage.tsx` contains the preserved design and React interactions. `lib/translations.json` holds the page translations, and `app/refinements.css` contains typography and language-control refinements.

Course filtering, course suggestions, accessible mobile navigation, FAQ expansion, Italian speech playback, and the inquiry draft builder work in both languages. Pronunciation depends on browser speech support and available voices. Clipboard support depends on browser permissions.

The contact form only creates a local draft: it does not send or store information. Course details remain proposed content; genuine testimonials, official contact details, and enrollment services still need to be supplied before a public launch.

The original vanilla files are kept in `design-reference/` for comparison.

## Browser checks

With the app running on port 3000:

```sh
npm test
```

The Playwright test checks both languages, remembered preferences, course filtering, course recommendations, inquiry drafts, FAQs, mobile navigation, and overflow at five viewport widths. Screenshots are saved in `test-results/`. A Playwright Chromium installation is required (`npx playwright install chromium` if not already present). Set `TEST_BASE_URL` to test another local port.
