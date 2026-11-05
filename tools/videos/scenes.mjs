// Motion-graphic videos (9:16, 15 s). Copy follows ../../CONTENT_RULES.md; every time is computed.
import { HOME, wall, time, awake, expect } from '../carousels/time.mjs';
import { logo } from '../carousels/components.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const em = (s) => esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>');
// Moves: cut (default), fade, wipe, rise. See VIDEO_STYLE.md for which element gets which.
const at = (inT, outT, extra = '') => `data-in="${inT}"${outT != null ? ` data-out="${outT}"` : ''} ${extra}`;
const fade = 'data-fx="fade"', wipe = 'data-fx="wipe"';
// End card: logo and line cut in together on the beat, the details fade in under them.
const endcard = (t, headline, sub) => `<div class="endcard">
  <div ${at(t)}>${logo(true)}</div>
  <div class="vh1" ${at(t)}>${em(headline)}</div>
  <div class="vsub" ${at(t + 0.6, null, fade)}>${esc(sub)}</div>
  <div class="handle" ${at(t + 0.9, null, fade)}>@networkingmaxxing · @netmaxapp</div>
</div>`;

// ---------------------------------------------------------------------------
// Nov 2 · Friends you make abroad, as a 2x2
// ---------------------------------------------------------------------------
const quads = [
  { x: 0, y: 56, t: 2.6, nm: 'The one you see every week', sm: 'same table, same order' },
  { x: 454, y: 56, t: 4.6, nm: 'The 4 a.m. voice note friend', sm: 'replies before you hit send' },
  { x: 0, y: 486, t: 6.6, nm: 'Lives 20 minutes away', sm: 'last seen: 2024' },
  { x: 454, y: 486, t: 8.6, nm: '“We should totally visit”', sm: 'said every year since 2021' },
];
const OUT1 = 11.6;
const friends2x2 = {
  slug: 'friends-abroad-2x2', date: '2026-11-02', theme: 'grid', duration: 15,
  html: `
    <div class="vh1 abs" style="top:0;left:0;right:0" ${at(0, OUT1)}>${em('Friends you make abroad, as a *2×2*')}</div>
    <div class="matrix" ${at(0, OUT1)}>
      <div class="ax x" data-grow="1.0" data-gdur="0.8"></div>
      <div class="ax y" data-axis="y" data-grow="1.2" data-gdur="0.8"></div>
      <div class="abs" style="left:0;right:0;top:-58px;text-align:center" ${at(1.7, OUT1, fade)}><span class="al" style="position:static">replies in minutes</span></div>
      <div class="abs" style="left:0;right:0;bottom:-62px;text-align:center" ${at(1.8, OUT1, fade)}><span class="al" style="position:static">replies in months</span></div>
      <div class="abs" style="left:0;top:calc(50% + 18px)" ${at(1.9, OUT1, fade)}><span class="al" style="position:static">lives nearby</span></div>
      <div class="abs" style="right:0;top:calc(50% + 18px)" ${at(2.0, OUT1, fade)}><span class="al" style="position:static">9 time zones away</span></div>
      ${quads.map((q) => `<div class="q" style="left:${q.x}px;top:${q.y}px" ${at(q.t, OUT1)}>
        <div class="dot"></div><div class="nm">${esc(q.nm)}</div><div class="sm">${esc(q.sm)}</div></div>`).join('')}
    </div>
    ${endcard(OUT1, 'Keep all *four*', 'NET-MAX puts everyone you know on one map. Coming to iOS in January.')}`,
  alt: 'A 2×2 matrix of friends you make abroad. Axes: lives nearby to 9 time zones away, replies in minutes to replies in months. The one you see every week. The 4 a.m. voice note friend. Lives 20 minutes away, last seen 2024. “We should totally visit,” said every year since 2021. Keep all four. NET-MAX, coming to iOS in January.',
};

// ---------------------------------------------------------------------------
// Nov 6 · Your contacts app, honestly -> the same people with a city and a clock
// ---------------------------------------------------------------------------
const NOW = wall('2026-11-06 19:00'); // when the post goes out, Indianapolis time
const contacts = [
  ['Alex (conference?)', 'never', 'America/Chicago', 'Chicago'],
  ['Sam NYC', '2023', 'America/New_York', 'New York'],
  ['Maria Madrid?', 'never', 'Europe/Madrid', 'Madrid'],
  ['J. from the hostel', 'never', 'Europe/Lisbon', 'Lisbon'],
  ['Priya work thing', 'Mar 2025', 'Europe/London', 'London'],
  ['Daniel ???', '?', null, null],
  ['Kenji Tokyo', '2024', 'Asia/Tokyo', 'Tokyo'],
  ['Lucía BA', 'never', 'America/Argentina/Buenos_Aires', 'Buenos Aires'],
];
const awakeCount = contacts.filter(([, , tz]) => tz && awake(NOW, tz)).length;
expect('video contacts: awake at 7pm Indy', awakeCount, 4);
expect('video contacts: Madrid', time(NOW, 'Europe/Madrid'), '1:00 AM');
expect('video contacts: Tokyo', time(NOW, 'Asia/Tokyo'), '9:00 AM');
const SWAP = 5.2, OUT2 = 11.8;
const contactsToClocks = {
  slug: 'contacts-to-clocks', date: '2026-11-06', theme: 'night', duration: 15,
  html: `
    <div class="vh1 abs" style="top:0;left:0;right:0" ${at(0, SWAP)}>${em('Your contacts app, *honestly*:')}</div>
    <div class="vh1 abs" style="top:0;left:0;right:0" ${at(SWAP, OUT2)}>${em('Same people, with a *city and a clock*:')}</div>
    <div class="clist" ${at(0.4, OUT2, fade)} style="top:300px">
      <div class="row" style="height:60px">
        <span class="vlabel" style="color:var(--muted)">Name</span>
        <span class="rt vlabel" style="color:var(--muted)" ${at(0, SWAP)}>Last texted</span>
        <span class="rt vlabel" style="color:var(--green)" ${at(SWAP)}>Their time now</span>
      </div>
      ${contacts.map(([nm, last, tz, city], i) => {
        const t1 = SWAP + 0.3; // the whole column sweeps in at once
        const after = tz ? `<span class="rt ${awake(NOW, tz) ? 'on' : 'off'}" ${at(t1, null, wipe + ' data-dur="0.7"')}>${esc(city)} · ${time(NOW, tz)}<i class="st"></i></span>`
          : `<span class="rt off" ${at(t1, null, wipe + ' data-dur="0.7"')}>no idea</span>`;
        return `<div class="row" style="height:80px">
          <span class="nm">${esc(nm)}</span>
          <span class="rt" ${at(0, SWAP)}>${esc(last)}</span>${after}</div>`;
      }).join('')}
    </div>
    <div class="vsub abs" style="top:1090px;left:0;right:0;color:var(--text)" ${at(9.4, OUT2)}><b>${awakeCount} of them are awake right now.</b></div>
    <div class="abs vlabel" style="top:1162px;left:0;color:var(--muted)" ${at(10.6, OUT2, fade)}>Still no idea who Daniel is</div>
    ${endcard(OUT2, 'Everyone you know, with a *city and a clock*', 'NET-MAX is coming to iOS in January.')}`,
  alt: `A contacts list with names like “Alex (conference?)”, “Maria Madrid?” and “Daniel ???”, mostly last texted never. Then the same people with a city and their local time at 7 p.m. in Indianapolis: ${contacts.filter((c) => c[2]).map(([nm, , tz, city]) => `${city} ${time(NOW, tz)}`).join(', ')}. ${awakeCount} of them are awake right now. Still no idea who Daniel is. NET-MAX is coming to iOS in January.`,
};

// ---------------------------------------------------------------------------
// Nov 13 · Conference math
// ---------------------------------------------------------------------------
const msg = 'hi priya! sam from the career fair, the coffee line one. could i buy you a coffee in chicago over break?';
const conferenceMath = {
  slug: 'conference-math', date: '2026-11-13', theme: 'tier', duration: 15,
  html: `
    <div class="vh1 abs" style="top:0;left:0;font-size:72px" ${at(0, 4.9)}>Conference math</div>
    <div class="abs" style="top:90px;left:0" ${at(0, 4.9)}><div class="big">1</div><div class="cap">conference</div></div>
    <div class="abs" style="top:420px;left:0" ${at(1.6, 4.9)}><div class="big" data-count="1.6" data-cdur="1.3" data-from="0" data-to="47">0</div><div class="cap">new contacts</div></div>
    <div class="abs" style="top:750px;left:0" ${at(3.2, 4.9)}><div class="big g">0</div><div class="cap">follow-ups</div></div>
    <div class="vh1 abs" style="top:0;left:0;right:0" ${at(4.9, 11.9)}>${em('Fix the *zero* tonight')}</div>
    <div class="abs" style="top:300px;left:60px;right:0" ${at(5.5, 11.9)}>
      <div class="vbubble"><span data-type="5.8" data-tdur="3.9" data-text="${esc(msg)}"></span></div>
      <div class="receipt" style="text-align:right;font-size:28px;margin-top:12px" ${at(9.9, 11.9, fade)}>Delivered</div>
    </div>
    <div class="vh1 abs" style="top:800px;left:0;right:0;font-size:80px" ${at(10.5, 11.9)}>1 down. <em>46</em> to go.</div>
    ${endcard(11.9, 'Remembers *where you met*', 'Coming to iOS in January.')}`,
  alt: `Conference math: 1 conference, 47 new contacts, 0 follow-ups. Fix the zero tonight. A text being typed: “${msg}” Delivered. 1 down, 46 to go. NET-MAX: remembers where you met. Coming to iOS in January.`,
};

export const videos = [friends2x2, contactsToClocks, conferenceMath];
