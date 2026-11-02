// Renders every carousel for Instagram (1080x1350) and TikTok (1080x1920).
// Usage: node render.mjs [--only slug,slug] [--fmt ig|tt] [--out dir]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { carousels } from './content.mjs';
import { checkCopy } from './time.mjs';
import { md, plain, logo, label } from './components.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
// Playwright is installed globally in the build environment (NODE_PATH); ESM ignores NODE_PATH, so use require.
const { chromium } = createRequire(import.meta.url)('playwright');
const repo = path.resolve(here, '../..');
const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, all) => (x.startsWith('--') ? [...a, [x.slice(2), all[i + 1]?.startsWith('--') ? true : all[i + 1] ?? true]] : a), []));
const only = args.only ? String(args.only).split(',') : null;
const fmts = args.fmt ? [args.fmt] : ['ig', 'tt'];
const outRoot = args.out ? path.resolve(args.out) : repo;
const buildDir = path.join(process.env.BUILD_DIR || '/tmp', 'netmax-build');
fs.mkdirSync(buildDir, { recursive: true });

export const HANDLE = { ig: '@networkingmaxxing', tt: '@netmaxapp' };
export const CTA = { ig: 'Waitlist: link in bio', tt: 'Waitlist: link in our Instagram bio, @networkingmaxxing' };

// ---------- 1. every number in the copy must match the tz math ----------
checkCopy();

// ---------- 2. copy lint (CONTENT_RULES.md) ----------
const BANNED = [
  [/—/, 'em dash'], [/\bactually\b/i, '"actually"'], [/save this/i, '"save this"'], [/\bswipe\b/i, '"swipe"'],
  [/now what/i, '"now what"'], [/\bbeats?\b/i, '"X beats Y"'], [/game.?changer|\bunlock|level up|\bhacks?\b|the secret/i, 'stock creator phrase'],
  [/isn['’]t [^.]{1,40}, it['’]s|\bnot just\b/i, 'contrast formula'], [/here['’]s (how|the thing|why)/i, '"here’s how/why"'],
  [/\b(elevate|seamless|leverage|journey|delve|navigate|game plan|supercharge|empower)\b/i, 'AI-flavored word'],
  [/\bmost people\b|\balmost always\b|\bstudies show\b/i, 'unbacked generalization'],
];
const ALLOW = [/Sydney beats Tokyo/gi]; // a data finding (7h vs 5h), not a slogan
const strip = (h) => String(h).replace(/<style[\s\S]*?<\/style>|<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&');
const lintErrors = [];
const lint = (where, text) => {
  let t = strip(text);
  for (const a of ALLOW) t = t.replace(a, '');
  for (const [re, why] of BANNED) if (re.test(t)) lintErrors.push(`${where}: ${why} in "${t.trim().slice(0, 90)}"`);
};
for (const c of carousels) {
  c.slides.forEach((s, i) => ['label', 'h', 'body', 'visual', 'alt', 'foot'].forEach((k) => s[k] && lint(`${c.slug} #${i + 1} ${k}`, s[k])));
  for (const k of ['ig', 'tt', 'ttTitle']) lint(`${c.slug} ${k}`, c[k]);
  for (const k of ['ig', 'tt']) {
    const emoji = (c[k].match(/\p{Extended_Pictographic}/gu) || []).length;
    if (emoji > 1) lintErrors.push(`${c.slug} ${k}: ${emoji} emoji`);
    const tags = (c[k].match(/#\w+/g) || []).length;
    if (tags < 3 || tags > 5) lintErrors.push(`${c.slug} ${k}: ${tags} hashtags`);
  }
  if (c.ttTitle.length > 90) lintErrors.push(`${c.slug} ttTitle over 90 chars`);
}
if (lintErrors.length) { console.error('Copy lint failed:\n' + lintErrors.join('\n')); process.exit(1); }

// ---------- 3. html ----------
function slideHtml(s, fmt, theme = 'night') {
  const top = s.cover || s.cta
    ? `<div class="row-top">${logo(s.cta)}${s.cover && s.label ? label(s.label, 'muted') : ''}</div>`
    : `<div class="row-top">${label(s.label || '')}${s.right || ''}</div>`;
  const H = s.hTag || (s.cover || s.cta ? 'h1' : 'h2');
  const hCls = s.hCls || '';
  const text = `<div class="text">
      <${H} class="${hCls}">${md(s.h)}</${H}>
      ${s.body && s.order !== 'sandwich' ? `<p class="body ${s.bodyCls || ''}">${md(s.body)}</p>` : ''}
      ${s.cta ? `<div class="cta-line">${CTA[fmt]}</div>` : ''}
      ${s.foot ? `<p class="small-print">${md(s.foot)}</p>` : ''}
    </div>`;
  // sandwich: the explanation sits directly under the visual, centered with it
  const under = s.order === 'sandwich' && s.body ? `<p class="body under">${md(s.body)}</p>` : '';
  const visual = s.visual ? `<div class="visual ${s.visualCls || ''}">${s.visual}${under}</div>` : '<div class="visual"></div>';
  return `<!doctype html><html><head><meta charset="utf-8">
  <link rel="stylesheet" href="file://${here}/styles.css"></head>
  <body class="fmt-${fmt} theme-${theme}"><div class="canvas"${s.accent ? ` style="--green:${s.accent};--green-ink:#111"` : ''}><div class="safe ${s.order === 'visual-first' ? 'order-visual-first' : ''} ${s.cta ? 'is-cta' : ''} ${s.cover ? 'is-cover' : ''} ${s.visual ? '' : 'no-visual'}">
    ${top}${text}${visual}
    <div class="foot"><span>${HANDLE[fmt]}</span></div>
  </div></div></body></html>`;
}

// ---------- 4. alt text = the full slide text ----------
const sentence = (x) => { x = String(x).trim(); return /[.?!”"]$/.test(x) ? x : x + '.'; };
export const altText = (s, fmt) => [s.label, s.h, s.body, s.alt, s.cta ? CTA[fmt] : '', s.foot]
  .filter(Boolean).map((x) => sentence(plain(x))).join(' ');

// ---------- 5. render ----------
const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
const report = [];
for (const c of carousels) {
  if (only && !only.includes(c.slug)) continue;
  const dir = path.join(outRoot, c.date);
  fs.mkdirSync(dir, { recursive: true });
  for (const fmt of fmts) {
    await page.setViewportSize({ width: 1080, height: fmt === 'ig' ? 1350 : 1920 });
    for (const [i, s] of c.slides.entries()) {
      const nn = String(i + 1).padStart(2, '0');
      const file = path.join(buildDir, `${c.slug}_${fmt}_${nn}.html`);
      fs.writeFileSync(file, slideHtml(s, fmt, c.theme));
      await page.goto('file://' + file);
      await page.evaluate(() => document.fonts.ready);
      const overflow = await page.evaluate(() => {
        const safe = document.querySelector('.safe');
        const r = safe.getBoundingClientRect();
        const bad = [];
        for (const el of safe.querySelectorAll('*')) {
          if (el.closest('svg') && el.tagName.toLowerCase() !== 'svg') continue; // svg internals are clipped by the svg
          const b = el.getBoundingClientRect();
          const bleed = !!el.closest('.bleed');
          const horiz = !bleed && (b.right > r.right + 1 || b.left < r.left - 1);
          if (b.width && (b.bottom > r.bottom + 1 || b.top < r.top - 1 || horiz)) bad.push(`${typeof el.className === 'string' ? el.className : el.tagName} (bottom ${Math.round(b.bottom - r.bottom)}px, right ${Math.round(b.right - r.right)}px)`);
        }
        // headline/body must not sit under the visual
        const t = safe.querySelector('.text')?.getBoundingClientRect(), v = safe.querySelector('.visual')?.getBoundingClientRect();
        if (t && v && v.height > 5 && !safe.classList.contains('order-visual-first') && t.bottom > v.top + 1) bad.push('text overlaps visual');
        const vis = safe.querySelector('.visual');
        const headFont = getComputedStyle(document.querySelector('h1, h2')).fontFamily.split(',')[0].replace(/['"]/g, '').trim();
        return { bad: bad.slice(0, 4), visualH: vis ? Math.round(vis.getBoundingClientRect().height) : 0, headFont, fonts: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/['"]/g, '')) };
      });
      if (!overflow.fonts.includes(overflow.headFont)) throw new Error(`${c.slug} ${fmt} ${nn}: headline font ${overflow.headFont} did not load`);
      if (overflow.bad.length) report.push(`OVERFLOW ${c.slug} ${fmt} ${nn}: ${overflow.bad.join(', ')}`);
      const out = path.join(dir, `NET-MAX_carousel_${c.slug}_${fmt}_${nn}.jpg`);
      await page.screenshot({ path: out, type: 'jpeg', quality: 93, clip: { x: 0, y: 0, width: 1080, height: fmt === 'ig' ? 1350 : 1920 } });
    }
    console.log(`rendered ${c.slug} ${fmt} (${c.slides.length})`);
  }
}
await browser.close();

// manifest for scheduling (paths relative to repo root)
if (!only && fmts.length === 2) {
  const manifest = carousels.map((c) => ({
    slug: c.slug, date: c.date, due: c.due, ig: c.ig, tt: c.tt, ttTitle: c.ttTitle,
    slides: c.slides.map((s, i) => {
      const nn = String(i + 1).padStart(2, '0');
      return Object.fromEntries(['ig', 'tt'].map((f) => [f, { path: `${c.date}/NET-MAX_carousel_${c.slug}_${f}_${nn}.jpg`, alt: altText(s, f) }]));
    }),
  }));
  fs.writeFileSync(path.join(here, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  console.log('wrote manifest.json');
}
if (report.length) { console.log(report.join('\n')); process.exitCode = 2; }
