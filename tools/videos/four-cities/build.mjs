// "Same minute, four cities": 1 filmed shot + 3 AI-generated shots + computed time overlays.
// See ../BRIEFS.md (video 5) for the brief and the per-shot prompts.
//
//   node build.mjs [--date 2026-11-03] [--music ../audio/music-bed.m4a]
//
// 1. Always renders the overlays + end card for the given date (times computed from tz data).
// 2. If clips/indianapolis.mp4, clips/madrid.mp4, clips/tokyo.mp4, clips/sydney.mp4 exist,
//    assembles NET-MAX_video_four-cities.mp4 (9:16, 15 s). Any aspect ratio in, cropped to 9:16.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { HOME, wall, time, awake, checkCopy, expect } from '../../carousels/time.mjs';
import { logo } from '../../carousels/components.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, all) => (x.startsWith('--') ? [...a, [x.slice(2), all[i + 1]?.startsWith('--') ? true : all[i + 1] ?? true]] : a), []));
const clipsDir = path.resolve(args.clips || path.join(here, 'clips'));
const outDir = path.join(here, 'build');
fs.mkdirSync(outDir, { recursive: true });

// ---- the moment: 7 p.m. in Indianapolis on the posting date ----
const date = args.date || '2026-11-03';
const at = wall(`${date} 19:00`);
const ymd = (z) => new Intl.DateTimeFormat('en-CA', { timeZone: z }).format(at);
const SHOTS = [
  { file: 'indianapolis', city: 'Indianapolis', tz: HOME, you: true, ai: false },
  { file: 'madrid', city: 'Madrid', tz: 'Europe/Madrid', ai: true },
  { file: 'tokyo', city: 'Tokyo', tz: 'Asia/Tokyo', ai: true },
  { file: 'sydney', city: 'Sydney', tz: 'Australia/Sydney', ai: true },
].map((s) => ({ ...s, t: time(at, s.tz), awake: awake(at, s.tz), tomorrow: ymd(s.tz) > ymd(HOME) }));
const friends = SHOTS.filter((s) => !s.you);
const up = friends.filter((s) => s.awake).length;
if (date === '2026-11-03') {
  expect('four-cities Madrid', SHOTS[1].t, '1:00 AM');
  expect('four-cities Tokyo', SHOTS[2].t, '9:00 AM');
  expect('four-cities Sydney', SHOTS[3].t, '11:00 AM');
  expect('four-cities awake friends', up, 2);
}
checkCopy();
const SEG = 3; // seconds per shot; 4 shots + end card = 15 s

// ---- overlays (transparent PNGs) ----
const css = `file://${path.resolve(here, '../video.css')}`;
const overlay = (s) => `<div class="stage" style="background:transparent;--noise-opacity:0">
  <div style="position:absolute;inset:0 0 auto 0;height:760px;background:linear-gradient(rgba(0,0,0,.62),rgba(0,0,0,0))"></div>
  <div class="zone">
    <div style="display:flex;gap:14px;align-items:center">
      <span class="vlabel" style="color:#fff;opacity:.85">${s.you ? 'You are here' : 'Your friend is here'}</span>
    </div>
    <div class="vh1" style="color:#fff;font-size:110px;margin-top:14px;text-shadow:0 2px 24px rgba(0,0,0,.35)">${s.city}</div>
    <div style="display:flex;gap:22px;align-items:baseline;margin-top:18px">
      <span style="font-family:var(--f-mono);font-size:72px;font-weight:600;color:#39ff88">${s.t}</span>
      ${s.tomorrow ? '<span style="font-family:var(--f-mono);font-size:30px;color:#fff;opacity:.8">TOMORROW</span>' : ''}
    </div>
    <div style="margin-top:22px;display:inline-flex;align-items:center;gap:14px;font-family:var(--f-mono);font-size:30px;text-transform:uppercase;letter-spacing:.06em;color:${s.awake ? '#03140a' : '#fff'};background:${s.awake ? '#39ff88' : 'rgba(255,255,255,.18)'};padding:10px 22px;border-radius:999px">${s.awake ? 'awake' : 'asleep'}</div>
    ${s.ai ? '<div style="position:absolute;left:0;bottom:0;font-family:var(--f-mono);font-size:24px;color:#fff;background:rgba(0,0,0,.45);padding:8px 16px;border-radius:10px;letter-spacing:.04em">AI-GENERATED FOOTAGE</div>' : ''}
  </div></div>`;
const endcard = `<div class="stage"><div class="zone"><div class="endcard">
  ${logo(true)}
  <div class="vh1"><em>${up} of your ${friends.length}</em> friends can reply right now.</div>
  <div class="vsub">NET-MAX shows everyone’s local time next to their name. Coming to iOS in January.</div>
  <div class="handle">@networkingmaxxing · @netmaxapp</div>
</div></div></div>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
const shoot = async (body, file, transparent) => {
  // load from disk (not setContent) so the file:// stylesheet and fonts resolve
  const htmlFile = path.join(outDir, file.replace('.png', '.html'));
  fs.writeFileSync(htmlFile, `<!doctype html><html style="${transparent ? 'background:transparent' : ''}"><head><meta charset="utf-8"><link rel="stylesheet" href="${css}"></head>
    <body class="theme-night" style="${transparent ? 'background:transparent' : ''}">${body}</body></html>`);
  await page.goto('file://' + htmlFile);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(outDir, file), omitBackground: transparent });
};
for (const s of SHOTS) await shoot(overlay(s), `overlay_${s.file}.png`, true);
await shoot(endcard, 'endcard.png', false);
await browser.close();
console.log(`overlays for ${date}: ` + SHOTS.map((s) => `${s.city} ${s.t}${s.tomorrow ? ' (tomorrow)' : ''} ${s.awake ? 'awake' : 'asleep'}`).join(', '));

// ---- assembly ----
const missing = SHOTS.filter((s) => !fs.existsSync(path.join(clipsDir, `${s.file}.mp4`)));
if (missing.length) {
  console.log(`no assembly yet: add ${missing.map((s) => `clips/${s.file}.mp4`).join(', ')}`);
  process.exit(0);
}
const hasAudio = (f) => execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'a', '-show_entries', 'stream=index', '-of', 'csv=p=0', f]).toString().trim() !== '';
const enc = ['-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', '30', '-c:a', 'aac', '-b:a', '192k', '-ar', '44100', '-ac', '2'];
const segs = [];
for (const [i, s] of SHOTS.entries()) {
  const clip = path.join(clipsDir, `${s.file}.mp4`);
  const seg = path.join(outDir, `seg${i}.mp4`);
  const audio = hasAudio(clip)
    ? `[0:a]atrim=0:${SEG},asetpts=PTS-STARTPTS,aresample=44100,afade=t=in:d=0.15,afade=t=out:st=${SEG - 0.2}:d=0.2[a]`
    : `anullsrc=r=44100:cl=stereo,atrim=0:${SEG}[a]`;
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', clip, '-loop', '1', '-t', String(SEG), '-i', path.join(outDir, `overlay_${s.file}.png`),
    '-filter_complex', `[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1,fps=30,trim=0:${SEG},setpts=PTS-STARTPTS[v0];` +
    `[1:v]format=rgba,fade=t=in:st=0.2:d=0.35:alpha=1[ov];[v0][ov]overlay=0:0,format=yuv420p[v];${audio}`,
    '-map', '[v]', '-map', '[a]', '-t', String(SEG), ...enc, seg]);
  segs.push(seg);
}
const endSeg = path.join(outDir, 'seg_end.mp4');
execFileSync('ffmpeg', ['-v', 'error', '-y', '-loop', '1', '-t', String(SEG), '-i', path.join(outDir, 'endcard.png'), '-f', 'lavfi', '-t', String(SEG), '-i', 'anullsrc=r=44100:cl=stereo',
  '-filter_complex', '[0:v]fps=30,format=yuv420p,fade=t=in:st=0:d=0.3[v]', '-map', '[v]', '-map', '1:a', '-t', String(SEG), ...enc, endSeg]);
segs.push(endSeg);
const list = path.join(outDir, 'concat.txt');
fs.writeFileSync(list, segs.map((s) => `file '${s}'`).join('\n'));
const joined = path.join(outDir, 'joined.mp4');
execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', joined]);
const final = path.join(here, 'NET-MAX_video_four-cities.mp4');
if (args.music) {
  // native ambience stays on top; the music bed sits underneath
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', joined, '-i', path.resolve(args.music), '-filter_complex',
    `[1:a]volume=0.35,atrim=0:15,afade=t=out:st=14.2:d=0.8[m];[0:a][m]amix=inputs=2:duration=first:normalize=0[a]`,
    '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', final]);
} else {
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', joined, '-c', 'copy', '-movflags', '+faststart', final]);
}
console.log(`assembled ${path.relative(process.cwd(), final)}`);
