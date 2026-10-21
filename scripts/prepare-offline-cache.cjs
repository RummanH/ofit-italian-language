// Copy only this app's dependencies into a writable cache; the source cache is read-only.
const cacache = require('C:/Program Files/nodejs/node_modules/npm/node_modules/cacache');
const path = require('node:path');
const source = path.join(process.env.LOCALAPPDATA, 'npm-cache/_cacache');
const target = path.resolve('.npm-cache/_cacache');
const wanted = /registry\.npmjs\.org\/(?:next(?:\/|$)|react(?:-dom)?(?:\/|$)|scheduler(?:\/|$)|typescript(?:\/|$)|playwright(?:-core)?(?:\/|$)|styled-jsx(?:\/|$)|postcss(?:\/|$)|nanoid(?:\/|$)|source-map-js(?:\/|$)|caniuse-lite(?:\/|$)|detect-libc(?:\/|$)|sharp(?:\/|$)|semver(?:\/|$)|tslib(?:\/|$)|undici-types(?:\/|$)|csstype(?:\/|$)|client-only(?:\/|$)|busboy(?:\/|$)|streamsearch(?:\/|$)|@(?:next|swc|types|fontsource|img|emnapi)(?:\/|%2f))/i;
(async () => {
  const entries = await cacache.ls(source);
  let count = 0;
  for (const [key, info] of Object.entries(entries)) {
    if (!wanted.test(key) && !/registry\.npmjs\.org\/(baseline-browser-mapping|browserslist|electron-to-chromium|node-releases|update-browserslist-db|picocolors|escalade|color|color-string|color-name|color-convert|simple-swizzle|is-arrayish|node-addon-api|fsevents)(\/|$)/.test(key)) continue;
    if (await cacache.get.info(target, key)) continue;
    const entry = await cacache.get(source, key);
    await cacache.put(target, key, entry.data, { metadata: info.metadata });
    count++;
  }
  console.log('Copied', count, 'dependency cache entries into the workspace.');
})().catch(error => { console.error(error); process.exitCode = 1; });
