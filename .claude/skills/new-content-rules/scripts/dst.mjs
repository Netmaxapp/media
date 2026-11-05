#!/usr/bin/env node
// Next clock changes for the zones in a post, so "this holds until <date>" notes are right.
//   node dst.mjs [from YYYY-MM-DD] [zone ...]
// Defaults: from today; zones = Indianapolis plus the cities NET-MAX posts about most.
const args = process.argv.slice(2);
const from = /^\d{4}-\d{2}-\d{2}$/.test(args[0] || '') ? new Date(args.shift() + 'T12:00:00Z') : new Date();
const zones = args.length ? args : ['America/Indiana/Indianapolis', 'Europe/London', 'Europe/Madrid', 'Europe/Lisbon', 'Asia/Seoul', 'Asia/Tokyo', 'Australia/Sydney'];
const off = (t, tz) => {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).formatToParts(new Date(t)).map((x) => [x.type, x.value]));
  return (Date.UTC(+p.year, p.month - 1, +p.day, +p.hour, +p.minute) - t) / 60000;
};
const fmt = (t, tz) => new Intl.DateTimeFormat('en-US', { timeZone: tz, dateStyle: 'medium' }).format(new Date(t));
for (const tz of zones) {
  let t = Math.floor(from.getTime() / 3600000) * 3600000, o = off(t, tz), hit = null;
  for (let h = 0; h < 24 * 400; h++) { t += 3600000; const n = off(t, tz); if (n !== o) { hit = `${fmt(t, tz)} (UTC${n >= 0 ? '+' : ''}${n / 60} from UTC${o >= 0 ? '+' : ''}${o / 60})`; break; } }
  console.log(`${tz.padEnd(30)} ${hit || 'no clock change in the next 400 days'}`);
}
