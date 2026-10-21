import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

const baseURL = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';

test('Both languages, course interactions, inquiry drafts, and mobile navigation', { timeout: 180000 }, async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  try {
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    assert.match(page.url(), /\/bn$/);
    assert.equal(await page.locator('html').getAttribute('lang'), 'bn');
    assert.equal(await page.locator('main section').count(), 12);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.evaluate(() => document.fonts.check('16px "Noto Sans Bengali"')), true);
    fs.mkdirSync('test-results', { recursive: true });
    await page.screenshot({ path: 'test-results/bangla-desktop.png', fullPage: true });
    await page.getByRole('link', { name: 'EN', exact: true }).click();
    await page.waitForURL('**/en');
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    assert.match(await page.title(), /Learn Italian in Bangla/);
    assert.match(await page.locator('h1').innerText(), /A new language/);
    // Only the language control should retain Bengali in the English page.
    assert.equal(await page.locator('main').evaluate(el => /[\u0980-\u09ff]/.test(el.innerText)), false);
    assert.equal(await page.locator('main').evaluate(el => [...el.querySelectorAll('[alt], [placeholder], [aria-label]')].some(n => /[\u0980-\u09ff]/.test([n.getAttribute('alt'), n.getAttribute('placeholder'), n.getAttribute('aria-label')].join('')))), false);
    await page.locator('[data-filter="speaking"]').click();
    assert.equal(await page.locator('.course-card:visible').count(), 1);
    assert.match(await page.locator('.course-card:visible h3').innerText(), /speaking practice/);
    await page.locator('[data-level="intermediate"]').click();
    assert.match(await page.locator('#level-result').innerText(), /A2/);
    await page.locator('#level-result a').click();
    assert.equal(await page.locator('.course-card:visible').getAttribute('data-category'), 'intermediate');
    await page.locator('.course-card:visible .course-link').click();
    assert.equal(await page.locator('#course').inputValue(), 'a2');
    await page.getByLabel('Your name', { exact: true }).fill('Samira');
    await page.getByLabel('Your question or learning goal').fill('When does the next class start?');
    await page.getByRole('button', { name: 'Create your inquiry draft' }).click();
    assert.match(await page.locator('#draft-text').innerText(), /Samira[\s\S]*A2[\s\S]*next class/);
    await page.getByText('Which level is right for me?', { exact: true }).click();
    assert.equal(await page.locator('details').filter({ hasText: 'Which level is right for me?' }).getAttribute('open'), '');
    await page.locator('[data-filter="all"]').click();
    await page.screenshot({ path: 'test-results/english-desktop.png', fullPage: true });
    await page.goto(baseURL);
    await page.waitForURL('**/en');
    await page.reload();
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    for (const locale of ['en', 'bn']) {
      await page.goto(baseURL + '/' + locale);
      for (const width of [360, 390, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
        assert.equal(overflow, false, locale + ' overflows at ' + width + 'px');
      }
      await page.setViewportSize({ width: 390, height: 844 });
      await page.locator('.menu-toggle').click();
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
      await page.locator('.menu-toggle').click();
      await page.locator('#navigation a').first().click();
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: 'test-results/' + locale + '-mobile.png', fullPage: true });
    }
    const response = await page.goto(baseURL + '/fr');
    assert.equal(response.status(), 404);
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});
