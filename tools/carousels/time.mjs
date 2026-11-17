// Time helpers. Every time shown on a slide is computed here from the tz database,
// never typed by hand. checkCopy() throws if copy text disagrees with the math.

export const HOME = 'America/New_York'; // New York City. Same Eastern clock as Indianapolis, so every time is unchanged.
export const WAKE_START = 8;  // 8 a.m.
export const WAKE_END = 23;   // 11 p.m.

const parts = (date, tz) => {
  const p = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', weekday: 'short',
  }).formatToParts(date);
  const o = Object.fromEntries(p.map((x) => [x.type, x.value]));
  return { y: +o.year, mo: +o.month, d: +o.day, h: +o.hour, mi: +o.minute, wd: o.weekday };
};

// Date for a wall-clock time in a zone, e.g. wall('2026-11-26 16:00').
export function wall(str, tz = HOME) {
  const [d, t = '00:00'] = str.split(' ');
  const [y, mo, da] = d.split('-').map(Number);
  const [h, mi] = t.split(':').map(Number);
  let guess = Date.UTC(y, mo - 1, da, h, mi);
  for (let i = 0; i < 3; i++) {
    const p = parts(new Date(guess), tz);
    const asUTC = Date.UTC(p.y, p.mo - 1, p.d, p.h, p.mi);
    guess += Date.UTC(y, mo - 1, da, h, mi) - asUTC;
  }
  return new Date(guess);
}

export function time(date, tz) {
  return new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit' }).format(date);
}
export function day(date, tz) { return parts(date, tz).wd; }
export function dateLabel(date, tz) {
  return new Intl.DateTimeFormat('en-US', { timeZone: tz, month: 'short', day: 'numeric' }).format(date);
}
export function awake(date, tz) {
  const { h } = parts(date, tz);
  return h >= WAKE_START && h < WAKE_END;
}

// Shared waking windows over one home-day, in 30-minute steps.
// Returns { total, longest, blocks: [{start, end}] } with start/end as home-clock decimal hours.
export function overlap(tz, homeDay = '2026-11-10') {
  const start = wall(`${homeDay} 00:00`);
  const slots = [];
  for (let i = 0; i < 48; i++) {
    const t = new Date(start.getTime() + i * 30 * 60000);
    slots.push(awake(t, HOME) && awake(t, tz));
  }
  const blocks = [];
  slots.forEach((on, i) => {
    if (!on) return;
    const last = blocks[blocks.length - 1];
    if (last && last.end === i / 2) last.end = (i + 1) / 2;
    else blocks.push({ start: i / 2, end: (i + 1) / 2 });
  });
  const lens = blocks.map((b) => b.end - b.start);
  return { total: lens.reduce((a, b) => a + b, 0), longest: Math.max(0, ...lens), blocks };
}

export function hourLabel(h) {
  const hh = Math.floor(h) % 24, mm = Math.round((h % 1) * 60);
  const ap = hh < 12 ? 'AM' : 'PM';
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return mm ? `${h12}:${String(mm).padStart(2, '0')} ${ap}` : `${h12} ${ap}`;
}

const failures = [];
export function expect(label, actual, wanted) {
  if (String(actual) !== String(wanted)) failures.push(`${label}: copy says "${wanted}", tz math says "${actual}"`);
}
export function checkCopy() {
  if (failures.length) throw new Error('Copy does not match the math:\n' + failures.join('\n'));
}
