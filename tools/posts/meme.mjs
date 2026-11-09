// Meme-format TikTok: two beats, each a caption over a clip on black, cut on the bar.
//   node tools/posts/meme.mjs
// Footage: Mixkit, Stock Video Free License (commercial use, no credit needed). See meme/CREDITS.md.
// Music: "Aerosol of my Love" by Kevin MacLeod (incompetech.com), CC BY 4.0. Credit goes in the caption.
// Layout follows the format of the reference, inside our Floor: square clip frame (no rounded corners),
// one-colour sentence-case captions with no bolded words, no period, Inter only.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const fonts = pathToFileURL(path.join(here, '../carousels/fonts/')).href;
const work = path.join(process.env.BUILD_DIR || '/tmp', 'netmax-meme');
fs.rmSync(work, { recursive: true, force: true });
fs.mkdirSync(work, { recursive: true });

// 100 BPM: one bar = 2.4 s. Beat A is 2 bars, beat B is 3 bars, so the cut lands on a downbeat.
const BAR = 2.4;
const CLIP = { w: 1080, h: 810, y: 470 };            // 4:3 frame, inside the TikTok safe area
const beats = [
  // Same actor in both beats (Mixkit's coffee-shop series): alone in beat 1, with her friend in beat 2.
  { caption: 'Me and my best friend living 14 hours apart', clip: 'mixkit-41234-girl-drinking-coffee.mp4', from: 1, crop: [960, 720, 160, 0], len: 2 * BAR },
  { caption: "Us when we're both finally awake", clip: 'mixkit-41225-friends-laughing-cafe.mp4', from: 1, crop: [960, 720, 320, 0], len: 3 * BAR },
];
const DUR = beats.reduce((a, b) => a + b.len, 0);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
for (const [i, b] of beats.entries()) {
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
    @import url(${fonts}inter.css);
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: 1080px; height: 1920px; background: #000; color: #fff; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
    .cap { position: absolute; left: 76px; right: 150px; bottom: ${1920 - CLIP.y + 36}px; font-size: 50px; font-weight: 600; line-height: 1.25; text-align: center; text-wrap: balance; }
    .handle { position: absolute; left: 0; right: 0; top: ${CLIP.y + CLIP.h + 28}px; text-align: center; font-size: 26px; color: #8C908B; }
  </style></head><body><p class="cap">${b.caption}</p><p class="handle">@netmaxapp</p></body></html>`);
  await page.evaluate(() => document.fonts.ready);
  const capTop = await page.evaluate(() => document.querySelector('.cap').getBoundingClientRect().top);
  if (capTop < 220) throw new Error(`beat ${i + 1}: caption starts above the safe zone (${capTop}px)`);
  await page.screenshot({ path: path.join(work, `bg${i}.png`) });
}
await browser.close();

// One segment per beat: clip cropped to 4:3, scaled to 1080x810, laid on the caption frame. Hard cuts between beats.
const parts = beats.map((b, i) => {
  const out = path.join(work, `part${i}.mp4`);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-loop', '1', '-i', path.join(work, `bg${i}.png`),
    '-ss', String(b.from), '-i', path.join(here, 'meme', b.clip),
    '-filter_complex', `[1:v]crop=${b.crop.join(':')},scale=${CLIP.w}:${CLIP.h},setsar=1,fps=30[c];[0:v][c]overlay=0:${CLIP.y}:shortest=1,format=yuv420p[v]`,
    '-map', '[v]', '-t', String(b.len), '-r', '30', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-an', out]);
  return out;
});
fs.writeFileSync(path.join(work, 'list.txt'), parts.map((p) => `file '${p}'`).join('\n'));
const file = path.join(here, 'out', 'tiktok-meme-14-hours-apart.mp4');
execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', path.join(work, 'list.txt'),
  '-i', path.join(here, 'audio', 'Aerosol_of_my_Love.mp3'), '-map', '0:v', '-map', '1:a', '-c:v', 'copy',
  '-af', `loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=out:st=${DUR - 1}:d=1`, '-c:a', 'aac', '-b:a', '192k',
  '-t', String(DUR), '-movflags', '+faststart', file]);
console.log(`rendered ${path.relative(process.cwd(), file)} (${DUR.toFixed(1)} s)`);
