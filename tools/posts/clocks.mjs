// "It's 7 PM in New York" reel, remade in our style (replaces the uploaded NetMax-2 reel).
//   node tools/posts/clocks.mjs [--stills 1,5,8.5,11.5,13.5]
// One moment, three clocks: New York at 7 PM, London at midnight, Tokyo at 9 AM the next day.
// Footage: Mixkit, Stock Video Free License (each clip's licence checked; no Restricted clips).
// Music: "Screen Saver" by Kevin MacLeod (incompetech.com), CC BY 4.0, credited in the caption.
// Times computed with tools/carousels/time.mjs for the posting date, Wed Nov 11, 2026.
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
const work = path.join(process.env.BUILD_DIR || '/tmp', 'netmax-clocks');
const stills = (process.argv.find((a, i, all) => all[i - 1] === '--stills') || '').split(',').filter(Boolean).map(Number);
const FPS = 30;

// ---------- the math ----------
const at = wall('2026-11-11 19:00');
const C = [
  { city: 'New York', tz: 'America/New_York', status: 'Dinner' },
  { city: 'London', tz: 'Europe/London', status: 'Asleep' },
  { city: 'Tokyo', tz: 'Asia/Tokyo', status: 'Already tomorrow' },
].map((c) => ({ ...c, t: time(at, c.tz), d: { Wed: 'Wednesday', Thu: 'Thursday' }[day(at, c.tz)] }));
expect('NY', `${C[0].d} ${C[0].t}`, 'Wednesday 7:00 PM');
expect('London', `${C[1].d} ${C[1].t}`, 'Thursday 12:00 AM');
expect('Tokyo', `${C[2].d} ${C[2].t}`, 'Thursday 9:00 AM');
checkCopy();

// ---------- footage: 4:5 crops under a black band; cuts land on beats of the 120 BPM track ----------
const BAND = 560;
const segs = [
  { clip: 'mixkit-4334.mp4', from: 2, x: 352, len: 3.5 },   // New York buildings at night
  { clip: 'mixkit-4364.mp4', from: 1, x: 520, len: 3.5 },   // Piccadilly Circus at night
  { clip: 'mixkit-4437.mp4', from: 27, x: 352, len: 3.5 },   // daytime street in Japan
];
const SUMMARY = 2.0, END = 2.5;
const t1 = 3.5, t2 = 7.0, t3 = 10.5, t4 = t3 + SUMMARY, DUR = t4 + END;   // 15.0 s

const beat = (c, tin, tout) => `
  <div class="clock" data-in="${tin}" data-out="${tout}">
    <div class="big">${c.t}</div>
    <p class="sub" data-in="${tin + 0.3}" data-fx="fade">in ${c.city}, ${c.d}. ${c.status}.</p>
  </div>`;

const overlay = `<!doctype html><html><head><meta charset="utf-8"><style>
@import url(${fonts}bricolage.css); @import url(${fonts}inter.css);
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 1080px; height: 1920px; background: transparent; }
body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; color: #fff; }
.stage { position: relative; width: 1080px; height: 1920px; }
.band { position: absolute; left: 0; right: 0; top: 0; height: ${BAND}px; background: #000; }
.clock { position: absolute; left: 76px; right: 150px; bottom: 44px; }
.big { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 168px; line-height: 0.95; }
.sub { font-size: 44px; line-height: 1.3; color: #C9CCC6; margin-top: 18px; }
.full { position: absolute; inset: 0; background: #000; }
.inner { position: absolute; left: 76px; right: 150px; top: 520px; }
h2 { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 88px; line-height: 1.02; text-wrap: balance; }
.rows { margin-top: 64px; }
.r { display: grid; grid-template-columns: 1fr auto; align-items: baseline; padding: 22px 0; }
.r b { font-size: 46px; font-weight: 600; }
.r span { font-family: 'Bricolage Grotesque', sans-serif; font-size: 64px; font-weight: 650; }
.r small { grid-column: 1 / -1; font-size: 32px; color: #8C908B; margin-top: 4px; }
.logo { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 64px; display: inline-flex; align-items: center; line-height: 1; }
.logo i { display: inline-block; width: 48px; height: 11px; background: #39FF88; margin: 0 11px; }
.end p { font-size: 36px; line-height: 1.4; color: #8C908B; margin-top: 36px; }
</style></head><body><div class="stage">
  <div class="band" data-in="0" data-out="${t3}">
    ${beat(C[0], 0, t1)}${beat(C[1], t1, t2)}${beat(C[2], t2, t3)}
  </div>

  <div class="full" data-in="${t3}" data-out="${t4}">
    <div class="inner">
      <h2>Same moment, three clocks</h2>
      <div class="rows" data-in="${t3 + 0.3}" data-fx="wipe">
        ${C.map((c) => `<div class="r"><b>${c.city}</b><span>${c.t}</span><small>${c.d}, ${c.status.toLowerCase()}</small></div>`).join('')}
      </div>
    </div>
  </div>

  <div class="full end" data-in="${t4}">
    <div class="inner">
      <div class="logo">NET<i></i>MAX</div>
      <h2 style="margin-top:40px">Know their time before you text</h2>
      <p data-in="${t4 + 0.4}" data-fx="fade">NET-MAX launches on iOS in January.<br>Waitlist link in our Instagram bio.</p>
    </div>
  </div>
</div><script src="${timeline}"></script></body></html>`;

fs.rmSync(work, { recursive: true, force: true });
fs.mkdirSync(path.join(work, 'ov'), { recursive: true });
const ovFile = path.join(work, 'overlay.html');
fs.writeFileSync(ovFile, overlay);

const kinds = new Set([...overlay.matchAll(/<[^>]*data-in=[^>]*>/g)].map((m) => (m[0].match(/data-fx="(\w+)"/) || [])[1] || 'cut'));
if (kinds.size > 3) throw new Error(`${kinds.size} entrance moves`);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(ovFile).href);
await page.evaluate(() => document.fonts.ready);
const problems = await page.evaluate(styleGuard, '.stage');
for (const t of [0.5, t1 + 0.5, t2 + 0.5, t3 + 0.9, t4 + 0.6]) {
  await page.evaluate((x) => window.renderAt(x), t);
  const off = await page.evaluate(() => [...document.querySelectorAll('.big, .sub, h2, .r, .logo, .end p')]
    .filter((e) => { let n = e; while (n && n !== document.body) { if (getComputedStyle(n).opacity === '0') return false; n = n.parentElement; } return true; })
    .map((e) => e.getBoundingClientRect()).some((r) => r.width && (r.top < 220 || r.bottom > 1440 || r.left < 76 || r.right > 930)));
  if (off) problems.push(`text outside the safe zone at ${t.toFixed(1)}s`);
}
if (problems.length) throw new Error(problems.join('\n'));

const times = stills.length ? stills : Array.from({ length: Math.round(DUR * FPS) }, (_, i) => i / FPS);
for (const [i, t] of times.entries()) {
  await page.evaluate((x) => window.renderAt(x), t);
  await page.screenshot({ path: path.join(work, 'ov', `o${String(i).padStart(4, '0')}.png`), omitBackground: true });
}
await browser.close();

const parts = segs.map((s, i) => {
  const out = path.join(work, `seg${i}.mp4`);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', String(s.from), '-i', path.join(here, 'clocks', s.clip),
    '-vf', `crop=576:720:${s.x}:0,scale=1080:1350,pad=1080:1920:0:${BAND}:black,fps=${FPS},format=yuv420p`,
    '-t', String(s.len), '-an', '-c:v', 'libx264', '-crf', '16', '-preset', 'fast', out]);
  return out;
});
const tail = path.join(work, 'tail.mp4');
execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'lavfi', '-i', `color=black:s=1080x1920:r=${FPS}`, '-t', String(SUMMARY + END), '-c:v', 'libx264', '-crf', '16', '-pix_fmt', 'yuv420p', tail]);
fs.writeFileSync(path.join(work, 'list.txt'), [...parts, tail].map((p) => `file '${p}'`).join('\n'));
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

const file = path.join(here, 'out', 'reel-7pm-in-new-york.mp4');
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', base, '-framerate', String(FPS), '-i', path.join(work, 'ov', 'o%04d.png'),
  '-i', path.join(here, 'audio', 'Screen_Saver.mp3'),
  '-filter_complex', '[0:v][1:v]overlay=0:0,format=yuv420p[v]', '-map', '[v]', '-map', '2:a',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-profile:v', 'high', '-r', String(FPS),
  '-af', `loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=in:st=0:d=0.3,afade=t=out:st=${DUR - 1.2}:d=1.2`, '-c:a', 'aac', '-b:a', '192k',
  '-t', String(DUR), '-movflags', '+faststart', file]);
console.log(`rendered ${path.relative(process.cwd(), file)} (${DUR.toFixed(1)} s)`);
