import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Copy strings may contain *emphasis* (green) and **bold** markup; everything else is escaped.
export const md = (s) => esc(s).replace(/(\d) (a\.m\.|p\.m\.|AM|PM|hours|hrs)/g, '$1\u00a0$2').replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, (_, x) => `<em>${x.length <= 14 ? x.replace(/ /g, '\u00a0') : x}</em>`);
// Plain text version of a copy string, for alt text.
export const plain = (s) => String(s).replace(/\*\*?(.+?)\*\*?/g, '$1');

export const logo = (big = false) => `<span class="logo${big ? ' big' : ''}">NET<i></i>MAX</span>`;
export const label = (text, cls = '') => `<span class="label ${cls}">${md(text)}</span>`;

export const clock = (rows, compact = false) => `<div class="clock${compact ? ' compact' : ''}">${rows.map((r) => `
  <div class="r ${r.awake ? 'on' : 'off'}${r.you ? ' you' : ''}">
    <div class="city">${esc(r.city)}<small>${esc(r.sub)}</small></div>
    <div class="t">${esc(r.t)}</div>
    <div class="st">${r.awake ? 'awake' : 'asleep'}</div>
  </div>`).join('')}</div>`;

const isBubble = (it) => !it.tag && !it.meta && !it.stamp && !it.receipt;
export const thread = (items) => `<div class="thread${items.filter(isBubble).length === 1 && !items.some((i) => i.photo) ? ' hero' : ''}">${items.map((it) => {
  if (it.stamp) return `<div class="stamp">${md(it.stamp)}</div>`;
  if (it.receipt) return `<div class="receipt">${esc(it.receipt)}</div>`;
  if (it.tag) return `<div class="tag${it.g ? ' g' : ''} ${it.side === 'l' ? 'l' : 'r'}">${md(it.tag)}</div>`;
  if (it.meta) return `<div class="meta ${it.side || 'r'}">${md(it.meta)}</div>`;
  if (it.photo) return `<div class="bubble out photo"><div class="ph">${esc(it.photo)}</div><div class="cap">${md(it.text)}</div></div>`;
  return `<div class="bubble ${it.in ? 'in' : 'out'}${it.ghost ? ' ghost' : ''}">${md(it.text)}</div>`;
}).join('')}</div>`;

export const voice = (dur, seed = 7) => {
  let x = seed; const rnd = () => ((x = (x * 9301 + 49297) % 233280) / 233280);
  const bars = Array.from({ length: 34 }, (_, i) => 10 + Math.round((0.35 + 0.65 * Math.sin(i / 3.2) ** 2) * rnd() * 46));
  return `<div class="voice"><div class="play"></div><div class="wave">${bars.map((h) => `<span style="height:${h}px"></span>`).join('')}</div><div class="dur">${esc(dur)}</div></div>`;
};

export const settingsPath = (rows) => `<div class="path">${rows.map((r) => `
  <div class="p"><span class="os">${esc(r.os)}</span>${r.steps.map((s, i) => `${i ? '<span class="sep">›</span>' : ''}<span class="chip${i === r.steps.length - 1 ? ' g' : ''}">${esc(s)}</span>`).join('')}</div>`).join('')}</div>`;

export const event = (e) => `<div class="event">
  <div class="date"><div class="mo">${esc(e.mo)}</div><div class="dd${String(e.dd).length > 2 ? ' word' : ''}">${esc(e.dd)}</div></div>
  <div class="info"><div class="ti">${esc(e.title)}</div><div class="wh">${esc(e.when)}</div><div class="sub">${md(e.sub)}</div></div>
</div>`;

export const conv = (blocks) => blocks.map((b) => `<div class="card conv tight">
  <div class="head"><span class="k">${esc(b.k)}</span><span class="v">${esc(b.v)}</span></div>
  ${clock(b.rows, true)}
</div>`).join('');

export const msg = (m) => `<div class="card"><div class="msg${m.focus != null ? ' focus' : ''}">
  <div class="to">${esc(m.to)}</div>
  ${m.lines.map((l, i) => `<span class="ln${m.focus === i ? ' on' : ''}">${md(l)}</span>`).join('')}
  <span class="sig">${esc(m.sig)}</span>
</div></div>`;

export const contact = (c) => `<div class="card contact">
  <div class="name">${esc(c.name)}</div>
  <div class="fields">${c.fields.map((f) => `<div class="f${f.new ? ' new' : ''}"><span class="k">${esc(f.k)}</span><span class="v">${md(f.v)}</span></div>`).join('')}</div>
</div>`;

export const timeline = (steps, active = -1, opts = {}) => `<div class="tl">${steps.map((s, i) => {
  const st = i === active ? 'on' : (opts.doneBefore && i < active ? 'done' : (active >= 0 && opts.dimOthers ? 'dimmed' : ''));
  return `<div class="st ${st}"><div class="dot">${esc(s.dot ?? i + 1)}</div><div><div class="when">${esc(s.when)}</div><div class="what">${md(s.what)}</div></div></div>`;
}).join('')}</div>`;

export const checklist = (items) => `<div class="check">${items.map((it) => `<div class="i"><span class="box"></span><span>${md(it.text)}${it.sub ? `<small>${esc(it.sub)}</small>` : ''}</span></div>`).join('')}</div>`;

const TIER_BG = Object.fromEntries(['S', 'A', 'B', 'C', 'D', 'F'].map((k) => [k, k === 'S' ? 'var(--tier-S, var(--green))' : `var(--tier-${k})`]));
export const tierChart = (tiers, { hl = null, compact = false } = {}) => `<div class="tiers">${tiers.map((t) => `
  <div class="t${hl && hl !== t.k ? ' mute' : ''}${hl === t.k ? ' hl' : ''}">
    <div class="k" style="background:${TIER_BG[t.k]};${t.k === 'F' ? 'color:var(--tier-F-ink, var(--text))' : ''}">${t.k}<small>${esc(t.hrs)}</small></div>
    <div class="cs">${t.cities.map((c) => `<span class="c">${esc(c)}</span>`).join('')}</div>
  </div>`).join('')}</div>`;

// 24h bars on the home clock. rows: {city, hours, blocks:[{start,end}]}
export const dayBars = (rows, { awakeFrom = 8, awakeTo = 23 } = {}) => {
  const pct = (h) => `${(h / 24) * 100}%`;
  const fmt = (h) => { const hh = Math.floor(h) % 24, mm = Math.round((h % 1) * 60); const ap = hh < 12 ? 'a' : 'p'; const h12 = hh % 12 || 12; return mm ? `${h12}:${String(mm).padStart(2, '0')}${ap}` : `${h12}${ap}`; };
  return `<div class="bars">${rows.map((r) => `
    <div class="bar">
      <div class="lab"><span class="c">${esc(r.city)}</span><span class="h">${esc(r.hours)}</span></div>
      <div class="track">
        <div class="awake" style="left:${pct(awakeFrom)};width:${pct(awakeTo - awakeFrom)}"></div>
        ${r.blocks.map((b) => `<div class="seg" style="left:${pct(b.start)};width:${pct(b.end - b.start)}">${b.end - b.start >= 2.5 ? `<span>${fmt(b.start)}–${fmt(b.end)}</span>` : ''}</div>`).join('')}
      </div>
    </div>`).join('')}
    <div class="axis">${[0, 6, 12, 18, 24].map((h) => `<span style="left:${pct(h)}">${['12a', '6a', '12p', '6p', '12a'][h / 6]}</span>`).join('')}</div>
  </div>
  <div class="legend"><span><i style="background:var(--green)"></i>both awake</span><span><i style="background:var(--awake-bg);border:1.5px solid var(--line)"></i>you're awake (8a–11p)</span></div>`;
};

export const week = (days) => `<div class="week">
  ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => `<div class="dn">${d}</div>`).join('')}
  ${days.map((d) => `<div class="d ${d.cls || ''}"><span class="num">${d.n}</span><span class="ev">${esc(d.ev || '')}</span></div>`).join('')}
</div>`;

export const plan = (blocks, active = -1) => `<div class="plan">${blocks.map((b, i) => `
  <div class="b${i === active ? ' on' : (active >= 0 ? ' fade' : '')}"><span class="w">${esc(b.w)}</span><span class="x">${esc(b.x)}${b.sub ? `<small>${esc(b.sub)}</small>` : ''}</span></div>`).join('')}</div>`;

export const paper = (lines) => `<div class="paper">${lines.map((l) => `<p class="hand">${esc(l)}</p>`).join('')}</div>`;

export const roles = (list) => `<div class="roles">${list.map((r, i) => `<div class="ro"><span class="n">${String(i + 1).padStart(2, '0')}</span><span class="x">${esc(r)}</span></div>`).join('')}</div>`;

// ---------- map ----------
const land = JSON.parse(fs.readFileSync(path.join(here, 'data/ne_110m_land.geojson'), 'utf8'));
const proj = ([lon, lat]) => [lon, -lat];
const landPath = land.features.map((f) => {
  const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
  return polys.map((poly) => poly.map((ring) => 'M' + ring.map((c) => proj(c).map((v) => v.toFixed(1)).join(',')).join('L') + 'Z').join('')).join('');
}).join('');

// pins: {name, lon, lat, t, dx, dy, anchor}; crop: [lonMin, lonMax, latMax, latMin]; fs in map units
export const map = (pins, { crop = [-170, 182, 76, -56], fs = 6, bleed = true } = {}) => {
  const [x0, x1, yTop, yBot] = crop;
  const r = fs * 0.32;
  return `<div class="map${bleed ? ' bleed' : ''}"><svg viewBox="${x0} ${-yTop} ${x1 - x0} ${yTop - yBot}" xmlns="http://www.w3.org/2000/svg">
  <path class="land" d="${landPath}"/>
  ${pins.map((p) => {
    const [x, y] = proj([p.lon, p.lat]);
    const a = p.anchor || 'start';
    const tx = x + (p.dx ?? fs * 0.7), ty = y + (p.dy ?? 0);
    return `<circle class="ring" cx="${x}" cy="${y}" r="${r * 2}" style="stroke-width:${fs * 0.08}"/><circle class="pin" cx="${x}" cy="${y}" r="${r}"/>
      <text x="${tx}" y="${ty - fs * 0.15}" font-size="${fs}" font-weight="600" text-anchor="${a}" style="stroke-width:${fs * 0.3}">${esc(p.name)}</text>
      <text class="t" x="${tx}" y="${ty + fs * 0.95}" font-size="${fs * 0.9}" text-anchor="${a}" style="stroke-width:${fs * 0.3}">${esc(p.t)}</text>`;
  }).join('')}
</svg></div>`;
};

export const people = (items) => `<div class="people">${items.map((it) => `<div class="i"><span class="av">${esc(it.text[0])}</span><span class="nm">${esc(it.text)}${it.sub ? `<small>${esc(it.sub)}</small>` : ''}</span></div>`).join('')}</div>`;
