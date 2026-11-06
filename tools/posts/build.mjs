// Two single-image Instagram posts (1080x1350), built to the new-content-rules Floor.
//   node tools/posts/build.mjs
// Every time on the images is computed with tools/carousels/time.mjs and checked before render.
// Output: tools/posts/out/*.png, plus captions.md and alt text.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import { HOME, wall, time, day, awake, overlap, hourLabel, expect, checkCopy } from '../carousels/time.mjs';
import { styleGuard } from '../carousels/guard.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const fonts = pathToFileURL(path.join(here, '../carousels/fonts/')).href;
const out = path.join(here, 'out');
fs.mkdirSync(out, { recursive: true });

// ---------- Tokyo: the math ----------
const TOKYO = 'Asia/Tokyo', DAY = '2026-11-10';
const ov = overlap(TOKYO, DAY);
expect('Tokyo long window', ov.blocks.map((b) => `${hourLabel(b.start)}-${hourLabel(b.end)}`).join(', '), '8 AM-9 AM, 6 PM-11 PM');
expect('6 PM Indy in Tokyo', `${day(wall(`${DAY} 18:00`), TOKYO)} ${time(wall(`${DAY} 18:00`), TOKYO)}`, 'Wed 8:00 AM');
expect('11 PM Indy in Tokyo', time(wall(`${DAY} 23:00`), TOKYO), '1:00 PM');
expect('8 AM Indy in Tokyo', time(wall(`${DAY} 08:00`), TOKYO), '10:00 PM');
expect('9 AM Indy in Tokyo', time(wall(`${DAY} 09:00`), TOKYO), '11:00 PM');

// 24 one-hour cells across the Indianapolis day, two rows: who is awake at that moment.
const cells = Array.from({ length: 24 }, (_, h) => {
  const t = wall(`${DAY} ${String(h).padStart(2, '0')}:30`);
  const a = awake(t, HOME), b = awake(t, TOKYO);
  return { a, b, both: a && b };
});
const row = (key) => cells.map((c) => `<span class="c ${c.both ? 'both' : c[key] ? 'on' : ''}"></span>`).join('');
const ticks = [0, 6, 12, 18].map((h) => `<span style="left:${(h / 24) * 100}%">${hourLabel(h).replace(' ', '&nbsp;')}</span>`).join('');

// ---------- Madrid birthday: the math ----------
const MADRID = 'Europe/Madrid';
const send = wall('2026-11-19 18:00');
expect('Madrid at send', `${day(send, MADRID)} ${time(send, MADRID)}`, 'Fri 12:00 AM');
expect('Indy send day', day(send, HOME), 'Thu');
checkCopy();

const base = `
@import url(${fonts}bricolage.css); @import url(${fonts}inter.css); @import url(${fonts}fraunces.css);
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 1080px; height: 1350px; }
body { -webkit-font-smoothing: antialiased; background: var(--bg); color: var(--ink); font-family: 'Inter', sans-serif; }
.canvas { width: 1080px; height: 1350px; padding: 84px 88px 76px; display: flex; flex-direction: column; background: var(--bg); }
.logo { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 34px; display: inline-flex; align-items: center; line-height: 1; color: var(--ink); }
.logo i { display: inline-block; width: 26px; height: 6px; background: #39FF88; margin: 0 6px; }
.handle { font-size: 24px; color: var(--muted); }
.foot { margin-top: auto; display: flex; justify-content: space-between; align-items: flex-end; font-size: 24px; color: var(--muted); line-height: 1.35; }
`;

const tokyo = `<!doctype html><html><head><meta charset="utf-8"><style>${base}
:root { --bg: #0D0F0E; --ink: #F1F0EA; --muted: #8C908B; --off: #1E2220; --on: #3A403D; }
h1 { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 100px; line-height: 1.0; margin-top: 92px; text-wrap: balance; }
.chart { margin-top: 96px; }
.r { display: grid; grid-template-columns: 220px 1fr; align-items: center; margin-bottom: 14px; }
.r b { font-weight: 600; font-size: 28px; }
.cells { display: grid; grid-template-columns: repeat(24, 1fr); gap: 3px; height: 56px; }
.c { background: var(--off); }
.c.on { background: var(--on); }
.c.both { background: #39FF88; }
.ticks { position: relative; margin-left: 220px; height: 30px; font-size: 21px; color: var(--muted); }
.ticks span { position: absolute; top: 4px; }
.key { margin: 22px 0 0 220px; font-size: 23px; color: var(--muted); }
.key i { display: inline-block; width: 18px; height: 18px; background: #39FF88; vertical-align: -2px; margin-right: 10px; }
.key i.g { background: var(--on); margin-left: 28px; }
.times { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 72px; }
.times p { font-size: 26px; color: var(--muted); margin-bottom: 10px; }
.times strong { display: block; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 650; font-size: 64px; line-height: 1; }
.also { font-size: 30px; line-height: 1.4; margin-top: 64px; max-width: 820px; text-wrap: balance; }
</style></head><body><div class="canvas">
<div class="logo">NET<i></i>MAX</div>
<h1>Call Tokyo from Indianapolis between 6 and 11 PM</h1>
<div class="chart">
  <div class="r"><b>Indianapolis</b><div class="cells">${row('a')}</div></div>
  <div class="r"><b>Tokyo</b><div class="cells">${row('b')}</div></div>
  <div class="ticks">${ticks}</div>
  <p class="key"><i></i>You're both awake<i class="g"></i>Awake</p>
</div>
<div class="times">
  <div><p>Indianapolis, Tuesday</p><strong>6 to 11 PM</strong></div>
  <div><p>Tokyo, Wednesday</p><strong>8 AM to 1 PM</strong></div>
</div>
<p class="also">Mornings work too: 8 to 9 AM your time is 10 to 11 PM in Tokyo.</p>
<div class="foot"><span>@networkingmaxxing</span><span style="text-align:right">Awake hours 8 AM to 11 PM.<br>Holds until US clocks change Mar 14.</span></div>
</div></body></html>`;

const madrid = `<!doctype html><html><head><meta charset="utf-8"><style>${base}
:root { --bg: #F2EEE5; --ink: #1B1A17; --muted: #77726A; }
h1 { font-family: 'Fraunces', serif; font-weight: 560; font-size: 96px; line-height: 1.02; margin-top: 92px; text-wrap: balance; font-variation-settings: 'opsz' 144, 'SOFT' 0, 'WONK' 0; }
.thread { margin-top: 104px; display: flex; flex-direction: column; align-items: flex-end; }
.bubble { background: #1B1A17; color: #F2EEE5; font-size: 34px; line-height: 1.32; padding: 26px 34px 28px; border-radius: 40px; max-width: 720px; text-wrap: balance; }
.meta { font-size: 23px; color: var(--muted); margin-top: 14px; margin-right: 12px; }
.body { font-size: 32px; line-height: 1.42; margin-top: 88px; max-width: 820px; text-wrap: balance; }
</style></head><body><div class="canvas">
<div class="logo">NET<i></i>MAX</div>
<h1>Their birthday in Madrid starts Thursday at 6 PM your time</h1>
<div class="thread">
  <div class="bubble">happy birthday!! it's already the 20th over there. hope madrid is ready for you</div>
  <div class="meta">Sent Thursday 6:00 PM in Indianapolis, midnight in Madrid</div>
</div>
<p class="body">Madrid is 6 hours ahead. Send the first text at their midnight and it's waiting when they wake up on their birthday.</p>
<div class="foot"><span>@networkingmaxxing</span><span style="text-align:right">Example: a birthday on Friday, Nov 20.<br>Holds until US clocks change Mar 14.</span></div>
</div></body></html>`;

const posts = [
  { slug: '01-tokyo-call-window', html: tokyo, alt: "NET-MAX. Call Tokyo from Indianapolis between 6 and 11 PM. A chart of one Tuesday in Indianapolis, hour by hour, with a row for Indianapolis and a row for Tokyo. Both rows are green, meaning you're both awake, at 8 AM and from 6 to 11 PM Indianapolis time. Indianapolis, Tuesday: 6 to 11 PM. Tokyo, Wednesday: 8 AM to 1 PM. Mornings work too: 8 to 9 AM your time is 10 to 11 PM in Tokyo. Awake hours 8 AM to 11 PM. Holds until US clocks change Mar 14. @networkingmaxxing" },
  { slug: '02-madrid-birthday-text', html: madrid, alt: "NET-MAX. Their birthday in Madrid starts Thursday at 6 PM your time. A text message bubble reads: happy birthday!! it's already the 20th over there. hope madrid is ready for you. Sent Thursday 6:00 PM in Indianapolis, midnight in Madrid. Madrid is 6 hours ahead. Send the first text at their midnight and it's waiting when they wake up on their birthday. Example: a birthday on Friday, Nov 20. Holds until US clocks change Mar 14. @networkingmaxxing" },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
let bad = 0;
for (const p of posts) {
  fs.writeFileSync(path.join(out, `${p.slug}.html`), p.html);
  await page.goto(pathToFileURL(path.join(out, `${p.slug}.html`)).href);
  await page.evaluate(() => document.fonts.ready);
  const problems = await page.evaluate(styleGuard, '.canvas');
  const overflow = await page.evaluate(() => { const c = document.querySelector('.canvas'); return c.scrollHeight > 1350 || c.scrollWidth > 1080; });
  const families = await page.evaluate(() => [...new Set([...document.querySelectorAll('.canvas *')].map((e) => getComputedStyle(e).fontFamily.split(',')[0].replace(/"/g, '').trim()))]);
  if (overflow) problems.push('content overflows the 1080x1350 canvas');
  if (families.length > 3) problems.push(`too many font families: ${families.join(', ')}`);
  if (problems.length) { bad++; console.log(`${p.slug}:\n  ${problems.join('\n  ')}`); }
  await page.screenshot({ path: path.join(out, `${p.slug}.png`), clip: { x: 0, y: 0, width: 1080, height: 1350 } });
  console.log(`rendered ${p.slug}.png  fonts: ${families.join(', ')}`);
}
await browser.close();
fs.writeFileSync(path.join(out, 'alt-text.md'), posts.map((p) => `## ${p.slug}\n\n${p.alt}\n`).join('\n'));
if (bad) process.exit(1);
