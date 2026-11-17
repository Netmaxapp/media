// TikTok video versions of the two single-image posts: 1080x1920, 15 s, 30 fps.
//   node tools/posts/tiktok.mjs [--stills 0.5,4,9,13]
// Same look as the Instagram images. Moves: cut, fade, wipe (3 kinds, no rise, no pop).
// Text stays in the TikTok safe zone: 220 px top, 480 px bottom, 76 px left, 150 px right.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { HOME, wall, time, day, awake, expect, checkCopy } from '../carousels/time.mjs';
import { styleGuard } from '../carousels/guard.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const fonts = pathToFileURL(path.join(here, '../carousels/fonts/')).href;
const timeline = pathToFileURL(path.join(here, '../videos/timeline.js')).href;
const out = path.join(here, 'out');
const work = path.join(process.env.BUILD_DIR || '/tmp', 'netmax-tiktok');
const FPS = 30, DUR = 15;
const stills = (process.argv.find((a, i, all) => all[i - 1] === '--stills') || '').split(',').filter(Boolean).map(Number);

// ---------- the math ----------
const TOKYO = 'Asia/Tokyo', DAY = '2026-11-10';
expect('6 PM NYC in Tokyo', `${day(wall(`${DAY} 18:00`), TOKYO)} ${time(wall(`${DAY} 18:00`), TOKYO)}`, 'Wed 8:00 AM');
expect('11 PM NYC in Tokyo', time(wall(`${DAY} 23:00`), TOKYO), '1:00 PM');
expect('8 AM NYC in Tokyo', time(wall(`${DAY} 08:00`), TOKYO), '10:00 PM');
const MADRID = 'Europe/Madrid', send = wall('2026-11-19 18:00');
expect('Madrid at send', `${day(send, MADRID)} ${time(send, MADRID)}`, 'Fri 12:00 AM');
expect('NYC send day', day(send, HOME), 'Thu');
checkCopy();

const cells = Array.from({ length: 24 }, (_, h) => {
  const t = wall(`${DAY} ${String(h).padStart(2, '0')}:30`);
  return { a: awake(t, HOME), b: awake(t, TOKYO) };
});
// Grey layer first (who is awake), then the green "both awake" layer fades in on top.
const row = (key) => `<div class="cells">${cells.map((c) => `<span class="c ${c[key] ? 'on' : ''}"></span>`).join('')}</div>`;
const both = `<div class="cells over">${cells.map((c) => `<span class="c ${c.a && c.b ? 'both' : 'none'}"></span>`).join('')}</div>`;

const base = (vars) => `
@import url(${fonts}bricolage.css); @import url(${fonts}inter.css); @import url(${fonts}fraunces.css);
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 1080px; height: 1920px; }
body { -webkit-font-smoothing: antialiased; font-family: 'Inter', sans-serif; ${vars} background: var(--bg); color: var(--ink); }
.stage { position: relative; width: 1080px; height: 1920px; overflow: hidden; background: var(--bg); }
.zone { position: absolute; top: 220px; left: 76px; right: 150px; bottom: 480px; }
.logo { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 34px; display: inline-flex; align-items: center; line-height: 1; color: var(--ink); }
.logo i { display: inline-block; width: 26px; height: 6px; background: #39FF88; margin: 0 6px; }
.muted { color: var(--muted); }
.end { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; gap: 40px; }
.end .logo { font-size: 64px; } .end .logo i { width: 48px; height: 11px; margin: 0 11px; }
.end p { font-size: 34px; line-height: 1.4; color: var(--muted); }
`;

const endCard = (headline, cls) => `
<div class="end" data-in="12" data-dur="0">
  <div class="logo">NET<i></i>MAX</div>
  <div class="${cls}">${headline}</div>
  <p data-in="12.4" data-fx="fade">NET-MAX launches on iOS in January.<br>Waitlist link in our Instagram bio.</p>
</div>`;

const tokyo = `<!doctype html><html><head><meta charset="utf-8"><style>${base('--bg: #0D0F0E; --ink: #F1F0EA; --muted: #8C908B; --off: #1E2220; --on: #3A403D;')}
.h { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 92px; line-height: 1.0; text-wrap: balance; }
.main { position: absolute; inset: 0; }
.sub { font-size: 40px; margin-top: 56px; }
.chart { margin-top: 64px; }
.lbl { font-size: 28px; font-weight: 600; margin: 22px 0 12px; }
.cw { position: relative; }
.cells { display: grid; grid-template-columns: repeat(24, 1fr); gap: 3px; height: 64px; }
.cells.over { position: absolute; inset: 0; }
.c { background: var(--off); } .c.on { background: var(--on); } .c.both { background: #39FF88; } .c.none { background: transparent; }
.key { font-size: 24px; color: var(--muted); margin-top: 22px; }
.key i { display: inline-block; width: 18px; height: 18px; background: #39FF88; vertical-align: -2px; margin-right: 10px; }
.times { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-top: 64px; }
.times p { font-size: 28px; color: var(--muted); margin-bottom: 10px; }
.times strong { display: block; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 650; font-size: 60px; line-height: 1; }
.also { font-size: 34px; line-height: 1.4; margin-top: 56px; text-wrap: balance; }
</style></head><body><div class="stage"><div class="zone">
<div class="main" data-in="0" data-out="12">
  <div class="logo">NET<i></i>MAX</div>
  <div class="h" style="margin-top:64px">Call Tokyo from New York City between 6 and 11 PM</div>
  <p class="sub muted" data-in="2.6" data-fx="fade">Tokyo is 14 hours ahead.</p>
  <div class="chart">
    <div data-in="3.6" data-fx="wipe"><p class="lbl">New York</p><div class="cw">${row('a')}<div data-in="6" data-fx="fade" data-dur="0.4">${both}</div></div></div>
    <div data-in="4.3" data-fx="wipe"><p class="lbl">Tokyo</p><div class="cw">${row('b')}<div data-in="6" data-fx="fade" data-dur="0.4">${both}</div></div></div>
    <p class="key" data-in="6" data-fx="fade"><i></i>You're both awake</p>
  </div>
  <div class="times" data-in="7.6">
    <div><p>New York, Tuesday</p><strong>6 to 11 PM</strong></div>
    <div><p>Tokyo, Wednesday</p><strong>8 AM to 1 PM</strong></div>
  </div>
  <p class="also" data-in="9.8" data-fx="fade">Mornings work too: 8 to 9 AM your time is 10 to 11 PM in Tokyo.</p>
</div>
${endCard('See who\'s awake before you call', 'h')}
</div></div><script src="${timeline}"></script></body></html>`;

const madrid = `<!doctype html><html><head><meta charset="utf-8"><style>${base('--bg: #F2EEE5; --ink: #1B1A17; --muted: #77726A;')}
.h { font-family: 'Fraunces', serif; font-weight: 560; font-size: 88px; line-height: 1.04; text-wrap: balance; font-variation-settings: 'opsz' 144, 'SOFT' 0, 'WONK' 0; }
.main { position: absolute; inset: 0; }
.clocks { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-top: 72px; }
.clocks p { font-size: 28px; color: var(--muted); margin-bottom: 10px; }
.clocks strong { display: block; font-family: 'Fraunces', serif; font-weight: 560; font-size: 64px; line-height: 1; font-variation-settings: 'opsz' 144; }
.thread { margin-top: 80px; display: flex; flex-direction: column; align-items: flex-end; }
.bubble { background: #1B1A17; color: #F2EEE5; font-size: 36px; line-height: 1.32; padding: 26px 34px 28px; border-radius: 40px; width: 640px; min-height: 104px; }
.meta { font-size: 26px; color: var(--muted); margin-top: 14px; margin-right: 12px; }
.body { font-size: 34px; line-height: 1.42; margin-top: 64px; text-wrap: balance; }
</style></head><body><div class="stage"><div class="zone">
<div class="main" data-in="0" data-out="12">
  <div class="logo">NET<i></i>MAX</div>
  <div class="h" style="margin-top:64px">Their birthday in Madrid starts Thursday at 6 PM your time</div>
  <div class="clocks" data-in="2.8" data-fx="wipe">
    <div><p>New York, Thursday</p><strong>6:00 PM</strong></div>
    <div><p>Madrid, Friday</p><strong>12:00 AM</strong></div>
  </div>
  <div class="thread">
    <div class="bubble" data-in="5" data-fx="fade"><span data-type="5.3" data-tdur="2.4" data-text="happy birthday!! it's already the 20th over there. hope madrid is ready for you"></span></div>
    <div class="meta" data-in="8" data-fx="fade">Delivered at midnight in Madrid</div>
  </div>
  <p class="body" data-in="9" data-fx="fade">Busy at 6? Schedule it in Messages: tap the plus button, Send Later, 6:00 PM.</p>
</div>
${endCard('Know when their birthday starts', 'h')}
</div></div><script src="${timeline}"></script></body></html>`;

const videos = [
  // Music: Kevin MacLeod (incompetech.com), CC BY 4.0. Credit goes in each caption (audio/CREDITS.md).
  { slug: 'tokyo-call-window', html: tokyo, music: 'Space_Jazz.mp3', from: 30 },
  { slug: 'madrid-birthday-text', html: madrid, music: 'Pleasant_Porridge.mp3', from: 20 },
];

// Rule 5: at most 3 kinds of entrance move, rise at most once, no pop.
for (const v of videos) {
  const kinds = new Set([...v.html.matchAll(/<[^>]*data-in=[^>]*>/g)].map((m) => (m[0].match(/data-fx="(\w+)"/) || [])[1] || 'cut'));
  if (kinds.size > 3) throw new Error(`${v.slug}: ${kinds.size} entrance moves`);
  if (/data-scale/.test(v.html)) throw new Error(`${v.slug}: pop is banned`);
}

fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
for (const v of videos) {
  const dir = path.join(work, v.slug);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'scene.html'), v.html);
  await page.goto(pathToFileURL(path.join(dir, 'scene.html')).href);
  await page.evaluate(() => document.fonts.ready);
  const problems = await page.evaluate(styleGuard, '.stage');
  // Every frame's text must sit inside the safe zone.
  for (const t of [0, 7, 11, 13]) {
    await page.evaluate((x) => window.renderAt(x), t);
    const off = await page.evaluate(() => [...document.querySelectorAll('.zone *')].filter((e) => getComputedStyle(e).opacity !== '0' && e.textContent.trim()).map((e) => e.getBoundingClientRect()).some((r) => r.width && (r.top < 220 || r.bottom > 1440 || r.left < 76 || r.right > 930)));
    if (off) problems.push(`text outside the safe zone at ${t}s`);
  }
  if (problems.length) throw new Error(`${v.slug}:\n  ${problems.join('\n  ')}`);
  if (stills.length) {
    for (const t of stills) {
      await page.evaluate((x) => window.renderAt(x), t);
      await page.screenshot({ path: path.join(dir, `still_${String(t).replace('.', '_')}.jpg`), type: 'jpeg', quality: 88 });
    }
    console.log(`stills ${v.slug} -> ${dir}`);
    continue;
  }
  for (let i = 0; i < DUR * FPS; i++) {
    await page.evaluate((x) => window.renderAt(x), i / FPS);
    await page.screenshot({ path: path.join(dir, `f${String(i).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 94 });
  }
  const file = path.join(out, `tiktok-${v.slug}.mp4`);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', String(FPS), '-i', path.join(dir, 'f%04d.jpg'), '-ss', String(v.from), '-i', path.join(here, 'audio', v.music),
    '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-profile:v', 'high',
    '-r', String(FPS), '-af', `loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=in:st=0:d=0.3,afade=t=out:st=${DUR - 1.2}:d=1.2`, '-c:a', 'aac', '-b:a', '192k', '-t', String(DUR),
    '-movflags', '+faststart', file]);
  console.log(`rendered ${path.relative(process.cwd(), file)}`);
}
await browser.close();
