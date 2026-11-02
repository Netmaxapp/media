// Renders the motion-graphic videos frame by frame (deterministic), then encodes H.264 + AAC.
// Usage: node render.mjs [--only slug] [--stills 0.5,3,6] (stills = review frames, no video)
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { videos } from './scenes.mjs';
import { checkCopy } from '../carousels/time.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../..');
const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, all) => (x.startsWith('--') ? [...a, [x.slice(2), all[i + 1]?.startsWith('--') ? true : all[i + 1] ?? true]] : a), []));
const FPS = 30;
const work = path.join(process.env.BUILD_DIR || '/tmp', 'netmax-video');
const MUSIC = path.join(here, 'audio/music-bed.m4a');

checkCopy();

const page = await (await chromium.launch()).newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
for (const v of videos) {
  if (args.only && args.only !== v.slug) continue;
  const html = `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="file://${here}/video.css"></head>
    <body class="theme-${v.theme}"><div class="stage"><div class="zone">${v.html}</div></div>
    <script src="file://${here}/timeline.js"></script></body></html>`;
  const dir = path.join(work, v.slug);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'scene.html'), html);
  await page.goto('file://' + path.join(dir, 'scene.html'));
  await page.evaluate(() => document.fonts.ready);

  if (args.stills) {
    for (const t of String(args.stills).split(',').map(Number)) {
      await page.evaluate((x) => window.renderAt(x), t);
      await page.screenshot({ path: path.join(dir, `still_${String(t).replace('.', '_')}.jpg`), type: 'jpeg', quality: 90 });
    }
    console.log(`stills ${v.slug} -> ${dir}`);
    continue;
  }

  const frames = Math.round(v.duration * FPS);
  for (let i = 0; i < frames; i++) {
    await page.evaluate((x) => window.renderAt(x), i / FPS);
    await page.screenshot({ path: path.join(dir, `f${String(i).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 94 });
  }
  const out = path.join(repo, v.date, `NET-MAX_video_${v.slug}.mp4`);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', String(FPS), '-i', path.join(dir, 'f%04d.jpg'),
    '-i', MUSIC, '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p',
    '-profile:v', 'high', '-r', String(FPS), '-af', `afade=t=out:st=${v.duration - 0.8}:d=0.8`, '-c:a', 'aac', '-b:a', '192k',
    '-t', String(v.duration), '-movflags', '+faststart', out]);
  console.log(`rendered ${v.slug}: ${frames} frames -> ${path.relative(repo, out)}`);
}
process.exit(0);
