// Emotional TikTok: "How it feels to text someone 7 hours ahead of you".
//   node tools/posts/emotion.mjs [--stills 1,5,10,13.5]
// Story: a text sent at night in New York City crosses the dark ocean and lands with their sunrise in Athens.
// Footage: Mixkit, Stock Video Free License (no credit required). Music: "Late Night Radio" by Kevin MacLeod
// (incompetech.com), CC BY 4.0, credited in the caption. Times computed with tools/carousels/time.mjs.
// Overlays use timeline.js moves (cut, fade, wipe). Captions sit on a solid black band, never on the footage.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { wall, time, day, expect, checkCopy } from '../carousels/time.mjs';
import { styleGuard } from '../carousels/guard.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const fonts = pathToFileURL(path.join(here, '../carousels/fonts/')).href;
const timeline = pathToFileURL(path.join(here, '../videos/timeline.js')).href;
const work = path.join(process.env.BUILD_DIR || '/tmp', 'netmax-emotion');
const stills = (process.argv.find((a, i, all) => all[i - 1] === '--stills') || '').split(',').filter(Boolean).map(Number);
const FPS = 30;

// ---------- the math (posting week: Nov 2026, holds until US clocks change Mar 14, 2027) ----------
const sent = wall('2026-11-17 23:42');
expect('Athens at send', `${day(sent, 'Europe/Athens')} ${time(sent, 'Europe/Athens')}`, 'Wed 6:42 AM');
checkCopy();

// ---------- footage: each segment cropped 4:5 and scaled to 1080x1350, under a black caption band ----------
const FRAME = { y: 430, w: 1080, h: 1350 };
const segs = [
  { clip: 'mixkit-31413-man-in-bed-phone.mp4', from: 0.5, x: 330, len: 3.6 },
  { clip: 'mixkit-2164-dusk-ocean-palms.mp4', from: 4, x: 500, len: 2.4 },
  { clip: 'mixkit-2091-ocean-foaming-waves.mp4', from: 2, x: 350, len: 2.4 },
  { clip: 'mixkit-44482-waves-arriving-at-beach.mp4', from: 2, x: 350, len: 3.6 },
];
const END = 2.8;                                       // end card
const DUR = segs.reduce((a, s) => a + s.len, 0) + END;  // 14.8 s
const t1 = segs[0].len, t2 = t1 + segs[1].len, t3 = t2 + segs[2].len, t4 = t3 + segs[3].len;

// ---------- overlay: transparent page rendered frame by frame ----------
const overlay = `<!doctype html><html><head><meta charset="utf-8"><style>
@import url(${fonts}bricolage.css); @import url(${fonts}inter.css);
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 1080px; height: 1920px; background: transparent; }
body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; color: #fff; }
.stage { position: relative; width: 1080px; height: 1920px; }
.band { position: absolute; left: 0; right: 0; top: 0; height: ${FRAME.y}px; background: #000; }
.cap { position: absolute; left: 76px; right: 150px; bottom: 40px; font-size: 58px; font-weight: 600; line-height: 1.25; text-align: center; text-wrap: balance; }
.row { position: absolute; left: 76px; right: 150px; display: flex; flex-direction: column; }
.bubble { font-size: 54px; font-weight: 500; line-height: 1.25; padding: 28px 38px 30px; border-radius: 48px; max-width: 720px; text-wrap: balance; }
.out { align-self: flex-end; background: #39FF88; color: #0B0B0F; }
.in { align-self: flex-start; background: #0B0B0F; color: #fff; }
.stamp { display: inline-block; background: #000; color: #fff; font-size: 42px; font-weight: 600; padding: 14px 22px; margin-top: 18px; }
.out + .stamp, .row.r .stamp { align-self: flex-end; }
.row.l .stamp { align-self: flex-start; }
.end { position: absolute; inset: 0; background: #000; display: flex; flex-direction: column; justify-content: center; padding: 0 150px 0 76px; gap: 36px; }
.logo { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 64px; display: inline-flex; align-items: center; line-height: 1; }
.logo i { display: inline-block; width: 48px; height: 11px; background: #39FF88; margin: 0 11px; }
.end h2 { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 88px; line-height: 1.02; text-wrap: balance; }
.end p { font-size: 34px; line-height: 1.4; color: #8C908B; }
</style></head><body><div class="stage">
  <div class="band" data-in="0" data-out="${t4}"><p class="cap">How it feels to text someone 7 hours ahead of you</p></div>

  <div class="row r" style="top:${FRAME.y + 620}px" data-in="1" data-out="${t1}">
    <div class="bubble out" data-in="1" data-fx="fade">thinking about you. call this week?</div>
    <span class="stamp" data-in="1.4" data-fx="fade">11:42 PM in New York</span>
  </div>

  <div class="row l" style="top:${FRAME.y + 120}px" data-in="${t1}" data-out="${t3}">
    <span class="stamp" data-in="${t1 + 0.3}" data-fx="fade">Still on its way</span>
  </div>

  <div class="row r" style="top:${FRAME.y + 120}px" data-in="${t3}" data-out="${t4}">
    <span class="stamp" data-in="${t3 + 0.2}" data-fx="wipe">Delivered 6:42 AM in Athens</span>
  </div>
  <div class="row l" style="top:${FRAME.y + 620}px" data-in="${t3 + 1.2}" data-out="${t4}">
    <div class="bubble in" data-in="${t3 + 1.2}" data-fx="fade">just woke up to this. sunday?</div>
  </div>

  <div class="end" data-in="${t4}">
    <div class="logo">NET<i></i>MAX</div>
    <h2>Know when they're awake</h2>
    <p data-in="${t4 + 0.4}" data-fx="fade">NET-MAX launches on iOS in January.<br>Waitlist link in our Instagram bio.</p>
  </div>
</div><script src="${timeline}"></script></body></html>`;

fs.rmSync(work, { recursive: true, force: true });
fs.mkdirSync(path.join(work, 'ov'), { recursive: true });
const ovFile = path.join(work, 'overlay.html');
fs.writeFileSync(ovFile, overlay);

// Rule 5: at most 3 kinds of entrance move.
const kinds = new Set([...overlay.matchAll(/<[^>]*data-in=[^>]*>/g)].map((m) => (m[0].match(/data-fx="(\w+)"/) || [])[1] || 'cut'));
if (kinds.size > 3) throw new Error(`${kinds.size} entrance moves`);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(ovFile).href);
await page.evaluate(() => document.fonts.ready);
const problems = await page.evaluate(styleGuard, '.stage');
for (const t of [1.6, t1 + 0.5, t3 + 1.5, t4 + 0.6]) {
  await page.evaluate((x) => window.renderAt(x), t);
  const off = await page.evaluate(() => [...document.querySelectorAll('.cap, .bubble, .stamp, .end h2, .end p, .logo')]
    .filter((e) => getComputedStyle(e).opacity !== '0' && getComputedStyle(e.closest('[data-in]') || e).opacity !== '0')
    .map((e) => e.getBoundingClientRect()).some((r) => r.width && (r.top < 220 || r.bottom > 1440 || r.left < 76 || r.right > 930)));
  if (off) problems.push(`text outside the safe zone at ${t.toFixed(1)}s`);
}
if (problems.length) throw new Error(problems.join('\n'));

const frames = Math.round(DUR * FPS);
const times = stills.length ? stills : Array.from({ length: frames }, (_, i) => i / FPS);
for (const [i, t] of times.entries()) {
  await page.evaluate((x) => window.renderAt(x), t);
  await page.screenshot({ path: path.join(work, 'ov', `o${String(i).padStart(4, '0')}.png`), omitBackground: true });
}
await browser.close();

// Base footage: each segment on black at FRAME.y, then a black end card.
const parts = segs.map((s, i) => {
  const out = path.join(work, `seg${i}.mp4`);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', String(s.from), '-i', path.join(here, 'emotion', s.clip),
    '-vf', `crop=576:720:${s.x}:0,scale=${FRAME.w}:${FRAME.h},pad=1080:1920:0:${FRAME.y}:black,fps=${FPS},format=yuv420p`,
    '-t', String(s.len), '-an', '-c:v', 'libx264', '-crf', '16', '-preset', 'fast', out]);
  return out;
});
const endSeg = path.join(work, 'end.mp4');
execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'lavfi', '-i', `color=black:s=1080x1920:r=${FPS}`, '-t', String(END), '-c:v', 'libx264', '-crf', '16', '-pix_fmt', 'yuv420p', endSeg]);
fs.writeFileSync(path.join(work, 'list.txt'), [...parts, endSeg].map((p) => `file '${p}'`).join('\n'));
const base = path.join(work, 'base.mp4');
execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', path.join(work, 'list.txt'), '-c', 'copy', base]);

if (stills.length) {
  for (const [i, t] of stills.entries()) {
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', String(t), '-i', base, '-i', path.join(work, 'ov', `o${String(i).padStart(4, '0')}.png`),
      '-filter_complex', 'overlay', '-frames:v', '1', path.join(work, `still_${i}.jpg`)]);
  }
  console.log(`stills -> ${work}`);
  process.exit(0);
}

const file = path.join(here, 'out', 'tiktok-7-hours-ahead.mp4');
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', base, '-framerate', String(FPS), '-i', path.join(work, 'ov', 'o%04d.png'),
  '-ss', '0', '-i', path.join(here, 'audio', 'Late_Night_Radio.mp3'),
  '-filter_complex', '[0:v][1:v]overlay=0:0,format=yuv420p[v]', '-map', '[v]', '-map', '2:a',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-profile:v', 'high', '-r', String(FPS),
  '-af', `loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=in:st=0:d=0.4,afade=t=out:st=${DUR - 1.2}:d=1.2`, '-c:a', 'aac', '-b:a', '192k',
  '-t', String(DUR), '-movflags', '+faststart', file]);
console.log(`rendered ${path.relative(process.cwd(), file)} (${DUR.toFixed(1)} s)`);
