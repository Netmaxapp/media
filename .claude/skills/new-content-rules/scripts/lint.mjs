#!/usr/bin/env node
// new-content-rules checker: text-level checks for NET-MAX social copy. No dependencies, no network.
//
//   node lint.mjs <file-or-folder> [--format ig|tt|story|slide|carousel]
//   node lint.mjs --text "caption text" --format ig
//   node lint.mjs --manifest tools/carousels/manifest.json
//   node lint.mjs slides.md --format carousel   (splits on '## Slide' headings; checks each slide
//                                              and that the CTA is on the last slide only)
//
// Formats: ig = Instagram caption, tt = TikTok caption, slide = on-screen slide text
// (first line = headline), story = story frame. Default for files: guessed from the name
// (*_ig*, *_tt*, *story*, *slide*), else ig.
// Exit code 1 if anything FAILs.
import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const flag = (k) => { const i = argv.indexOf(`--${k}`); return i >= 0 ? argv[i + 1] : undefined; };

const BANNED = [
  [/\bsave this\b/i, 'stock phrase "save this"'], [/\bswipe\b/i, 'stock phrase "swipe"'], [/\bnow what\b/i, 'stock phrase "now what"'],
  [/\bhere['’]s (how|the thing|why|what)\b/i, 'stock phrase "here’s how/why"'], [/\bactually\b/i, '"actually"'],
  [/game.?changer|\bunlock(s|ed|ing)?\b|level up|\bhacks?\b|the secret/i, 'stock creator phrase'],
  [/\b(elevate|seamless(ly)?|leverage|journey|delve|navigate|supercharge|empower|unleash|revolutioni[sz]e|elevating|transformative|game plan)\b/i, 'AI vocabulary'],
  [/\bmost people\b|\balmost always\b|\bstudies show\b|\bresearch shows\b/i, 'unbacked generalization'],
  [/\b(stop scrolling|follow for more|tag someone|link in comments|you won['’]t believe|in today['’]s (video|post)|let['’]s dive in|buckle up)\b/i, 'creator cliché'],
  [/\bisn['’]t [^.!?\n]{1,40}, it['’]s\b|\bnot just\b|\bit['’]s not (about|just|only)\b/i, 'contrast formula'],
  [/\bbeats?\b(?!\s*\d)/i, 'contrast formula "X beats Y" (allowed only for a computed finding)'],
];
const ALLOW = [/sydney beats tokyo/gi];
const EMOJI = /\p{Extended_Pictographic}/gu;
const CAPS_OK = new Set(['EST', 'EDT', 'CST', 'PST', 'GMT', 'BST', 'UTC', 'JST', 'KST', 'NET-MAX', 'AI', 'US', 'UK', 'LA', 'NYC', 'iOS', 'TV', 'CS', 'MBA', 'PM', 'AM', 'QR', 'CTA', 'OK', 'D1']);

function check(text, format) {
  const out = [];
  const fail = (m) => out.push(['FAIL', m]);
  const warn = (m) => out.push(['WARN', m]);
  let body = text; for (const a of ALLOW) body = body.replace(a, '');

  for (const [re, why] of BANNED) { const m = body.match(re); if (m) fail(`${why}: "${m[0]}"`); }
  if (/—/.test(text)) fail('em dash (use a period, comma or colon)');
  if (/ · |·/.test(text)) fail('middle dot (use a comma or a line break)');
  const caps = (text.match(/\b[A-Z][A-Z-]{2,}\b/g) || []).filter((w) => !CAPS_OK.has(w));
  if (caps.length) (format === 'slide' || format === 'story' ? fail : warn)(`ALL CAPS: ${[...new Set(caps)].slice(0, 5).join(', ')}`);

  const emoji = (text.match(EMOJI) || []).length;
  const tags = (text.match(/(^|\s)#\w+/g) || []).length;
  const words = text.replace(/(^|\s)#\w+/g, ' ').split(/\s+/).filter(Boolean).length;

  if (format === 'ig' || format === 'tt') {
    if (emoji > 1) fail(`${emoji} emoji (one at most, usually none)`);
    if (tags < 3 || tags > 5) fail(`${tags} hashtags (use 3 to 5 specific ones)`);
    if (/#(travel|networking|motivation|explore|viral|fyp|foryou|instagood)\b/i.test(text)) warn('generic hashtag');
    const qs = (text.match(/\?/g) || []).length; if (qs > 2) warn(`${qs} questions; only ask one if we'd read the answers`);
  }
  if (format === 'ig') {
    const first = text.split('\n')[0];
    if (first.length > 125) fail(`first line is ${first.length} chars; the feed cuts at ~125, so it lands mid-thought`);
  }
  if (format === 'tt') {
    if (/^[A-Z]/.test(text.trim()) && !/^NET-MAX/.test(text.trim())) warn('TikTok captions start lowercase, with the search words');
    if (!/instagram bio/i.test(text)) warn('say the waitlist link is in our Instagram bio');
  }
  if (format === 'slide' || format === 'story') {
    if (emoji) fail(`${emoji} emoji on screen`);
    if (tags) fail('hashtags on screen');
    const budget = format === 'slide' ? 80 : 20;
    if (words > budget) fail(`${words} words on one ${format} (about ${budget} at most)`);
    const head = text.trim().split('\n')[0].trim();
    if (format === 'slide' && /[^.]\.$/.test(head)) fail(`headline ends with a period: "${head.slice(0, 60)}"`);
    if (format === 'slide' && /^(\d{1,2}|\d\.\d)\s*$/.test(head)) fail('section number as a heading');
  }
  return out;
}

const CTA = /waitlist|link in (our )?bio|NET-MAX (launches|is launching)|join (us|the)/i;
function carousel(text) {
  const slides = text.split(/^##\s+Slide\b.*$/m).slice(1).map((x) => x.split(/^#{1,3}\s/m)[0].replace(/\*\*(Headline|Body|Mock text):\*\*\s*/g, '').replace(/^---\s*$/gm, '').trim());
  if (!slides.length) return [{ where: 'carousel', res: [['FAIL', 'no "## Slide" headings found']] }];
  return slides.map((t, i) => {
    const res = check(t, 'slide');
    if (i < slides.length - 1 && CTA.test(t)) res.push(['FAIL', `call to action before the last slide: "${t.match(CTA)[0]}"`]);
    if (i === slides.length - 1 && !CTA.test(t)) res.push(['WARN', 'last slide has no clear call to action']);
    return { where: `slide ${i + 1}`, res };
  });
}

const guess = (f) => /_tt|tiktok/i.test(f) ? 'tt' : /story/i.test(f) ? 'story' : /slide/i.test(f) ? 'slide' : 'ig';
const items = [];
if (flag('text') !== undefined) items.push({ where: '--text', text: flag('text'), format: flag('format') || 'ig' });
if (flag('manifest')) {
  for (const c of JSON.parse(fs.readFileSync(flag('manifest'), 'utf8'))) {
    items.push({ where: `${c.slug} ig caption`, text: c.ig, format: 'ig' });
    items.push({ where: `${c.slug} tt caption`, text: c.tt, format: 'tt' });
  }
}
for (const a of argv.filter((x, i) => !x.startsWith('--') && !argv[i - 1]?.startsWith('--'))) {
  const files = fs.statSync(a).isDirectory() ? fs.readdirSync(a).filter((f) => /\.(txt|md)$/.test(f)).map((f) => path.join(a, f)) : [a];
  for (const f of files) items.push({ where: f, text: fs.readFileSync(f, 'utf8'), format: flag('format') || guess(f) });
}
if (!items.length) { console.error('usage: lint.mjs <file-or-folder> [--format ig|tt|story|slide|carousel] | --text "..." | --manifest manifest.json'); process.exit(2); }

let fails = 0, warns = 0;
const expanded = items.flatMap((it) => it.format === 'carousel'
  ? carousel(it.text).map((c) => ({ ...it, where: `${it.where} ${c.where}`, format: 'slide', res: c.res }))
  : [it]);
for (const it of expanded) {
  const res = it.res || check(it.text, it.format);
  if (!res.length) { console.log(`PASS  ${it.where} [${it.format}]`); continue; }
  console.log(`${it.where} [${it.format}]`);
  for (const [lvl, m] of res) { console.log(`  ${lvl}  ${m}`); lvl === 'FAIL' ? fails++ : warns++; }
}
console.log(`\nnew-content-rules: ${fails} FAIL, ${warns} WARN across ${expanded.length} item(s).`);
process.exit(fails ? 1 : 0);
