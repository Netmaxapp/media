// All carousel copy. Rules: ../../CONTENT_RULES.md
// Every time or number on a slide is computed below (time.mjs) and checked with expect().

import * as C from './components.mjs';
import { HOME, wall, time, day, awake, overlap, expect, hourLabel } from './time.mjs';

const WEEKDAY = { Sun: 'Sunday', Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday' };

// "tomorrow"/"yesterday" relative to New York City (HOME)
const rel = (at, tz) => {
  const ymd = (z) => new Intl.DateTimeFormat('en-CA', { timeZone: z }).format(at);
  return ymd(tz) > ymd(HOME) ? ', tomorrow' : ymd(tz) < ymd(HOME) ? ', yesterday' : '';
};
const rows = (at, cities, youName) => cities.map(([city, tz]) => ({
  city, sub: WEEKDAY[day(at, tz)] + rel(at, tz), t: time(at, tz), awake: awake(at, tz), you: city === youName,
}));

const CITY = {
  'Los Angeles': ['America/Los_Angeles', -118.24, 34.05],
  'Chicago': ['America/Chicago', -87.63, 41.88],
  'Denver': ['America/Denver', -104.99, 39.74],
  'New York': ['America/New_York', -74.0, 40.71],
  'Toronto': ['America/Toronto', -79.38, 43.65],
  'Atlanta': ['America/New_York', -84.39, 33.75],
  'Bogotá': ['America/Bogota', -74.07, 4.71],
  'Mexico City': ['America/Mexico_City', -99.13, 19.43],
  'Buenos Aires': ['America/Argentina/Buenos_Aires', -58.38, -34.6],
  'Honolulu': ['Pacific/Honolulu', -157.86, 21.31],
  'London': ['Europe/London', -0.13, 51.51],
  'Dublin': ['Europe/Dublin', -6.26, 53.35],
  'Madrid': ['Europe/Madrid', -3.7, 40.42],
  'Paris': ['Europe/Paris', 2.35, 48.86],
  'Berlin': ['Europe/Berlin', 13.4, 52.52],
  'Barcelona': ['Europe/Madrid', 2.17, 41.39],
  'Lagos': ['Africa/Lagos', 3.38, 6.52],
  'Cape Town': ['Africa/Johannesburg', 18.42, -33.92],
  'Nairobi': ['Africa/Nairobi', 36.82, -1.29],
  'Istanbul': ['Europe/Istanbul', 28.98, 41.01],
  'Dubai': ['Asia/Dubai', 55.27, 25.2],
  'Mumbai': ['Asia/Kolkata', 72.88, 19.08],
  'Bangkok': ['Asia/Bangkok', 100.5, 13.76],
  'Jakarta': ['Asia/Jakarta', 106.85, -6.21],
  'Ho Chi Minh City': ['Asia/Ho_Chi_Minh', 106.66, 10.76],
  'Shanghai': ['Asia/Shanghai', 121.47, 31.23],
  'Singapore': ['Asia/Singapore', 103.82, 1.35],
  'Seoul': ['Asia/Seoul', 126.98, 37.57],
  'Tokyo': ['Asia/Tokyo', 139.69, 35.69],
  'Sydney': ['Australia/Sydney', 151.21, -33.87],
  'Auckland': ['Pacific/Auckland', 174.76, -36.85],
};
const tz = (c) => CITY[c][0];
const cities = (...names) => names.map((n) => [n, tz(n)]);
// map with readable labels: spec = [name, dx, dy, anchor] with offsets in label-heights
const mapOf = (at, crop, spec) => {
  const fs = (26 * (crop[1] - crop[0])) / 1080; // ~26px labels on a 1080-wide map
  return C.map(spec.map(([name, dx = 0.7, dy = 0, anchor]) => {
    const z = tz(name);
    return { name, lon: CITY[name][1], lat: CITY[name][2], t: time(at, z) + (day(at, z) !== day(at, HOME) ? ' ' + day(at, z) : ''), dx: dx * fs, dy: dy * fs, anchor };
  }), { crop, fs });
};

// ============================================================================
// 1. Nov 3 · How to keep friends in 7 time zones
// ============================================================================
const c1 = (() => {
  const at = wall('2026-11-03 19:00');
  const seven = cities('Los Angeles', 'New York', 'London', 'Madrid', 'Dubai', 'Tokyo', 'Sydney');
  const coverRows = rows(at, seven, 'New York');
  expect('c1 asleep count at 7pm', coverRows.filter((r) => !r.awake).length, 3);

  const am = wall('2026-11-04 08:00'), pm = wall('2026-11-04 19:00');
  const bday = wall('2027-03-04 00:00', tz('Tokyo'));
  expect('c1 Tokyo birthday starts (NYC)', `${day(bday, HOME)} ${time(bday, HOME)}`, 'Wed 10:00 AM');
  const vn = wall('2026-11-03 23:02');
  expect('c1 voice note Tokyo', time(vn, tz('Tokyo')), '1:02 PM');

  return {
    slug: '7-time-zones', theme: 'night', date: '2026-11-03', due: '2026-11-03T19:00:00-05:00',
    slides: [
      {
        cover: true, h: 'How to keep friends in *7 time zones*',
        body: 'It’s 7 p.m. in New York City. Three of these cities are asleep.',
        visual: `<div class="card tight"><div class="card-title">Tuesday, ${time(at, HOME)} in New York City</div>${C.clock(coverRows, true)}</div>`,
        alt: `World clock at ${time(at, HOME)} Tuesday in New York City: ` + coverRows.map((r) => `${r.city} ${r.t}${r.sub.includes('tomorrow') ? ' Wednesday' : ''}, ${r.awake ? 'awake' : 'asleep'}`).join('; ') + '.',
      },
      {
        h: 'Add their cities to your clock app',
        body: 'Then you can check what time it is for them before you hit send.',
        visual: `<div class="card">${C.settingsPath([{ os: 'iPhone', steps: ['Clock', 'World Clock', '+'] }, { os: 'Android', steps: ['Clock', 'Globe icon'] }])}</div>`,
        alt: 'iPhone: Clock, World Clock, plus. Android: Clock, globe icon.',
      },
      {
        h: 'Text into their morning',
        body: 'Messages that land overnight get buried under everything else they wake up to. Europe is up during your morning. Asia and Australia are up during your evening.',
        visual: C.conv([
          { k: 'If you send at', v: time(am, HOME), rows: rows(am, cities('London', 'Madrid', 'Sydney')) },
          { k: 'If you send at', v: time(pm, HOME), rows: rows(pm, cities('Tokyo', 'Sydney', 'Madrid')) },
        ]),
        alt: `At ${time(am, HOME)} your time: London ${time(am, tz('London'))}, Madrid ${time(am, tz('Madrid'))}, Sydney ${time(am, tz('Sydney'))} (asleep). At ${time(pm, HOME)}: Tokyo ${time(pm, tz('Tokyo'))}, Sydney ${time(pm, tz('Sydney'))}, Madrid ${time(pm, tz('Madrid'))} (asleep).`,
      },
      {
        h: 'Open with something only they’d get',
        body: '“hey how are you” usually gets “good wbu.” A photo, a song or a question about their life gives them something to answer.',
        visual: C.thread([
          { tag: 'Gets “good wbu”' }, { text: 'hey how are you!!', ghost: true },
          { tag: 'Gets a real reply', g: true },
          { text: 'walked past a döner place and thought of you. is the one by your old flat still the best in berlin?' },
        ]),
        alt: 'Example: “hey how are you!!” gets “good wbu.” Better: “walked past a döner place and thought of you. is the one by your old flat still the best in berlin?”',
      },
      {
        h: 'Save their birthday on their clock',
        body: 'If they’re in Tokyo, their birthday starts around 10 a.m. the day before, your time. Set the reminder for then.',
        visual: `<div class="card">${C.event({ mo: 'Mar', dd: '3', title: 'Kenji’s birthday', when: `${time(bday, HOME)}, reminder`, sub: 'It’s already March 4 in Tokyo' })}</div>`,
        alt: `Calendar reminder: Kenji’s birthday, March 3 at ${time(bday, HOME)}. It’s already March 4 in Tokyo.`,
      },
      {
        h: 'Put a month on the visit',
        body: '“We should visit sometime” has no date, so nobody books anything. Name a month and they can answer yes or no.',
        visual: C.thread([
          { text: 'we should visit sometime!!', ghost: true },
          { tag: 'Try this instead', g: true, side: 'r' },
          { text: 'i’m looking at flights to madrid for march. are you around the week of the 15th?' },
        ]),
        alt: 'Instead of “we should visit sometime!!”, try: “i’m looking at flights to madrid for march. are you around the week of the 15th?”',
      },
      {
        h: 'Send voice notes when your hours don’t overlap',
        body: 'Thirty seconds of you talking. They can listen on the way to class and answer when they’re free.',
        visual: `<div class="thread">${C.voice('0:31')}<div class="meta r">sent ${time(vn, HOME)}, it’s ${time(vn, tz('Tokyo'))} in Tokyo</div></div>`,
        alt: `A 31-second voice note sent at ${time(vn, HOME)}, when it’s ${time(vn, tz('Tokyo'))} in Tokyo.`,
      },
      {
        h: 'Check who’s there before you travel',
        body: 'Spring break, a semester abroad, a long layover. Look up who you know in the city before you make plans.',
        visual: `<div class="card"><div class="card-title">People you know in Barcelona</div>${C.people([{ text: 'Marta', sub: 'study abroad, spring 2025' }, { text: 'Theo', sub: 'your roommate’s cousin' }, { text: 'Coach Díaz', sub: 'moved back home in 2023' }])}</div>`,
        alt: 'List: people you know in Barcelona. Marta, study abroad spring 2025. Theo, your roommate’s cousin. Coach Díaz, moved back home in 2023.',
      },
      {
        cta: true, h: 'We’re putting all of this in one app',
        body: 'NET-MAX shows everyone you know on a map, with their local time next to their name. Launching in January.',
        visual: mapOf(at, [-150, 176, 72, -46], [['Los Angeles', -0.3, 2.0], ['New York', 0.7, 0.2], ['London', -0.7, -0.5, 'end'], ['Madrid', 0.7, 0.9], ['Dubai', 0.7, 0.5], ['Tokyo', -0.7, -0.3, 'end'], ['Sydney', -0.7, 0, 'end']]),
        alt: `Map with seven pins and local times at ${time(at, HOME)} in New York City.`,
      },
    ],
    ig: `Most of keeping up with friends in other countries is timing.

Seven habits that help, from adding their cities to your clock app to setting birthday reminders for when the day starts where they are.

What’s the farthest time zone in your group chat?

NET-MAX launches in January. Waitlist link in bio.

#studyabroad #longdistancefriendship #internationalstudents #timezones`,
    tt: `how to keep in touch with friends in different time zones. the clock app one takes 30 seconds. NET-MAX waitlist link is in our Instagram bio #timezones #longdistancefriends #studyabroad #internationalstudent`,
    ttTitle: 'How to keep friends in 7 time zones',
  };
})();

// ============================================================================
// 2. Nov 5 · The follow-up message after a career fair
// ============================================================================
const c2 = (() => {
  expect('c2 Nov 5 2026 weekday', day(wall('2026-11-05 12:00'), HOME), 'Thu');
  const lines = [
    'Hi Priya, it’s Sam from Thursday’s career fair. We talked about your team’s move to Chicago while we were stuck in the coffee line.',
    'I read the warehouse robotics article you mentioned. The part about night shifts was new to me.',
    'I’ll be in Chicago over winter break. Could I buy you a coffee one morning? Twenty minutes is plenty.',
  ];
  const m = (focus) => C.msg({ to: 'To: Priya, LinkedIn message', lines, sig: 'Sam', focus });
  return {
    slug: 'after-the-conference', theme: 'paper', date: '2026-11-05', due: '2026-11-05T19:00:00-05:00',
    slides: [
      {
        cover: true, label: 'Career fair season', h: 'What to send the day after you *meet someone*', hCls: 's',
        body: 'One follow-up message, line by line, and what to do if they don’t reply.',
        visual: m(null),
        alt: 'Example follow-up message to Priya: ' + lines.join(' ') + ' Sam.',
      },
      {
        label: 'Line 1', h: 'Say where you met, plus one detail',
        body: 'They talked to a lot of people that day too. A detail like the coffee line tells them which conversation was yours.',
        visual: m(0), alt: 'Highlighted line: ' + lines[0],
      },
      {
        label: 'Line 2', h: 'Show you listened',
        body: 'Follow up on something they brought up. It shows the conversation stuck, and it gives them something easy to reply to.',
        visual: m(1), alt: 'Highlighted line: ' + lines[1],
      },
      {
        label: 'Line 3', h: 'Ask for one small thing',
        body: 'A place, a rough time and a short length. They can answer with a yes and a day.',
        visual: m(2), alt: 'Highlighted line: ' + lines[2],
      },
      {
        label: 'Same day', h: 'Write down where they live',
        body: 'Add it to their contact with how you met. When you’re in Chicago in January, you’ll know who to text.',
        visual: C.contact({ name: 'Priya', fields: [
          { k: 'Lives in', v: 'Chicago', new: true },
          { k: 'Met', v: 'Career fair, Thu Nov 5', new: true },
          { k: 'Talked about', v: 'Warehouse robots. Team moving to Chicago.', new: true },
          { k: 'Next', v: 'Coffee over winter break', new: true },
        ] }),
        alt: 'Contact card for Priya. Lives in: Chicago. Met: career fair, Thursday Nov 5. Talked about: warehouse robots, team moving to Chicago. Next: coffee over winter break.',
      },
      {
        label: 'After that', h: 'When to follow up',
        visual: `<div class="card">${C.timeline([
          { when: 'Day 1 or 2', what: 'Send the message while they still remember your face.' },
          { when: 'A week later', what: 'No reply? One short bump: **“bumping this in case it got buried. no worries if the timing’s bad!”**' },
          { when: 'After you meet', what: 'Thank them that day. Mention one thing they said.' },
          { when: 'Three months later', what: 'Send something they’d care about: news about their company, or an article on what you talked about.' },
        ])}</div>`,
        alt: 'Timeline. Day 1 or 2: send the message. A week later, if no reply: one short bump, “bumping this in case it got buried. no worries if the timing’s bad!” After you meet: thank them that day and mention one thing they said. Three months later: send something they’d care about.',
      },
      {
        cta: true, h: 'NET-MAX keeps the *“how we met”* part',
        body: 'Who you met, where they live and how you met, all on one map. Launching in January.',
        visual: '',
        alt: '',
      },
    ],
    ig: `Career fair this week? This is the follow-up, line by line, plus what to do if nobody answers.

Change the details to match your conversation. Line one is where you prove you remember them, so make it specific.

NET-MAX launches in January. Waitlist link in bio.

#careerfair #internship #collegestudent #linkedintips`,
    tt: `what to message someone you met at a career fair, line by line (and when to follow up if they don’t answer). NET-MAX waitlist link is in our Instagram bio #careerfair #networkingtips #internship #collegetips`,
    ttTitle: 'The follow-up message after a career fair',
  };
})();

// ============================================================================
// 3. Nov 7 · Before you fly home from a semester abroad
// ============================================================================
const c3 = (() => {
  const call = wall('2026-12-20 11:00');
  expect('c3 Dec 20 is Sunday', day(call, HOME), 'Sun');
  expect('c3 Berlin call time', time(call, tz('Berlin')), '5:00 PM');
  const people = ['The local who showed you around', 'Your weekend-trip person', 'The friend from another program', 'Your host family or professor', 'The 3 a.m. kitchen friend'];
  return {
    slug: 'study-abroad-people', theme: 'airmail', date: '2026-11-07', due: '2026-11-07T11:00:00-05:00',
    slides: [
      {
        cover: true, h: 'Before you fly home, *message these 5 people*', hCls: 'm',
        body: 'For anyone finishing a semester abroad in December. What to send each one is on the next slides.',
        visual: C.roles(people), alt: 'The five people: ' + people.join(', ') + '.',
      },
      {
        h: 'The local who showed you around',
        body: 'Thank them for something specific, and offer to return the favor.',
        visual: C.thread([{ text: 'thank you for taking me to the market my first weekend. if you ever come to the US, i’m giving the tour next' }]),
        alt: 'Message: “thank you for taking me to the market my first weekend. if you ever come to the US, i’m giving the tour next”',
      },
      {
        h: 'Your weekend-trip person',
        body: 'Pick the next trip before you leave, even if it’s a year out. Write it down somewhere you’ll both see it.',
        visual: C.thread([{ text: 'lisbon, summer 2027? putting it in our shared notes so neither of us can pretend we forgot' }]),
        alt: 'Message: “lisbon, summer 2027? putting it in our shared notes so neither of us can pretend we forgot”',
      },
      {
        h: 'The friend from another program',
        body: 'They’re going home to a different country than you. Get their number and their home city before the last week, when everyone’s packing.',
        visual: C.thread([{ text: 'what’s your real number? and where’s home exactly, so i know where i’m visiting' }]),
        alt: 'Message: “what’s your real number? and where’s home exactly, so i know where i’m visiting”',
      },
      {
        h: 'Your host family or professor',
        body: 'Write a real thank-you before you go, by hand if you can. They’re also who you’ll want to ask for a reference later.',
        visual: `<div style="padding:0 18px 18px">${C.paper(['Thank you for every dinner, and for correcting my Spanish without making it weird.', 'I’ll write from New York.', 'Sam'])}</div>`,
        alt: 'Handwritten note: “Thank you for every dinner, and for correcting my Spanish without making it weird. I’ll write from New York. Sam”',
      },
      {
        h: 'The 3 a.m. kitchen friend',
        body: 'Once you’re home you’ll be hours apart. Pick a call time now that works on both clocks.',
        visual: `${C.thread([{ text: 'sunday calls? 11 my time, 5 yours' }])}<div class="card" style="margin-top:26px"><div class="card-title">Sundays</div>${C.clock(rows(call, cities('New York', 'Berlin')).map((r) => ({ ...r, sub: r.city === 'New York' ? 'you' : 'them' })))}</div>`,
        alt: `Message: “sunday calls? 11 my time, 5 yours.” Sundays: New York ${time(call, HOME)}, Berlin ${time(call, tz('Berlin'))}. Both awake.`,
      },
      {
        h: 'Message them one-on-one',
        body: 'The program group chat goes quiet once everyone’s home. Send these yourself, before your flight if you can.',
        visual: `<div class="card"><div class="card-title">Before my flight</div>${C.checklist(people.map((p) => ({ text: p })))}</div>`,
        alt: 'Checklist titled “Before my flight” with the five people.',
      },
      {
        cta: true, h: 'Keep the whole semester on one map',
        body: 'NET-MAX puts everyone you know on a map, with their local time. Launching in January.',
        visual: mapOf(wall('2026-11-07 11:00'), [-100, 36, 62, 22], [['New York', 0.7, 0.3], ['Madrid', -0.7, 0.4, 'end'], ['Berlin', 0.7, 0]]),
        alt: 'Map with pins in New York, Madrid and Berlin and their local times.',
      },
    ],
    ig: `Finishing a semester abroad in December? Message these five people before your flight.

Get real phone numbers while you’re still in the same city.

Who was your 3 a.m. kitchen friend?

NET-MAX launches in January. Waitlist link in bio.

#studyabroad #semesterabroad #studyabroadlife #internationalstudent`,
    tt: `5 people to message before you fly home from study abroad, and what to say to each one. NET-MAX waitlist link is in our Instagram bio #studyabroad #semesterabroad #studyabroadlife #abroad`,
    ttTitle: 'Message these 5 people before you fly home',
  };
})();

// ============================================================================
// 4. Nov 9 · 5 texts for someone you haven't talked to in a year
// ============================================================================
const c4 = (() => {
  const texts = [
    { h: 'The photo', b: 'Send it when something reminds you of them. The question at the end gives them something to answer.', t: [{ stamp: 'Today **7:02 PM**' }, { photo: 'your photo', text: 'this made me think of you. how’s denver treating you?' }, { receipt: 'Delivered' }] },
    { h: 'The callback', b: 'Bring back something they told you about. It shows you were listening back then.', t: [{ stamp: 'Tue **9:14 PM**' }, { text: 'random, but i finally tried the hot sauce you wouldn’t stop talking about. you were right' }, { receipt: 'Delivered' }] },
    { h: 'The maybe-visit', b: 'Only send this one if the trip could really happen.', t: [{ stamp: 'Sat **11:40 AM**' }, { text: 'are you still in chicago? i might be passing through in march' }, { receipt: 'Delivered' }] },
    { h: 'The congrats', b: 'If they posted news, reply with a question they can answer in one text.', t: [{ stamp: 'Today **12:31 PM**' }, { text: 'congrats on the new job!! what’s the best part so far?' }, { receipt: 'Delivered' }] },
    { h: 'The honest one', b: 'Name the specific thing you miss, then suggest a call.', t: [{ stamp: 'Sun **8:05 PM**' }, { text: 'no reason, i just miss our tuesday trivia nights. call this week?' }, { receipt: 'Delivered' }] },
  ];
  return {
    slug: '5-texts', theme: 'chat', date: '2026-11-09', due: '2026-11-09T19:00:00-05:00',
    slides: [
      {
        cover: true, h: '5 texts to send someone you haven’t talked to *in a year*', hCls: 's',
        body: 'None of them start with “hey stranger.” Swap in details that are true for you.',
        visual: C.thread([{ text: 'random, but i finally tried the hot sauce you wouldn’t stop talking about. you were right' }, { text: 'no reason, i just miss our tuesday trivia nights. call this week?' }]),
        alt: 'Two example texts: “random, but i finally tried the hot sauce you wouldn’t stop talking about. you were right” and “no reason, i just miss our tuesday trivia nights. call this week?”',
      },
      ...texts.map((x, i) => ({
        h: x.h, hTag: 'h1', body: x.b, order: 'sandwich',
        visual: C.thread(x.t),
        alt: `Text: “${x.t.find((i) => i.text).text}”`,
      })),
      {
        cta: true, h: 'Then don’t let it be another year',
        body: 'Set a reminder for three months from now. NET-MAX keeps everyone you know on a map with their local time. Launching in January.',
        visual: '',
        alt: '',
      },
    ],
    ig: `Five ways back into a conversation that went quiet a year ago. Change the details so they’re true for you.

The third one only works if you’d really make the trip.

NET-MAX launches in January. Waitlist link in bio.

#reconnecting #friendship #collegelife #textmessages`,
    tt: `5 texts to send someone you haven’t talked to in a year, without “hey stranger.” NET-MAX waitlist link is in our Instagram bio #friendship #reconnecting #textingtips #collegelife`,
    ttTitle: '5 texts for someone you haven’t talked to in a year',
  };
})();

// ============================================================================
// 5. Nov 10 · Time zones ranked (computed)
// ============================================================================
const c5 = (() => {
  const TIERS = [
    { k: 'S', cities: ['Toronto', 'Atlanta', 'Bogotá'] },
    { k: 'A', cities: ['Chicago', 'Mexico City', 'Denver', 'Buenos Aires', 'Los Angeles'] },
    { k: 'B', cities: ['London', 'Dublin', 'Honolulu', 'Madrid', 'Paris', 'Berlin', 'Lagos', 'Auckland'] },
    { k: 'C', cities: ['Cape Town', 'Nairobi', 'Istanbul', 'Sydney', 'Dubai'] },
    { k: 'D', cities: ['Tokyo', 'Seoul', 'Mumbai', 'Shanghai', 'Singapore'] },
    { k: 'F', cities: ['Bangkok', 'Jakarta', 'Ho Chi Minh City'] },
  ];
  const ov = Object.fromEntries(Object.keys(CITY).map((c) => [c, overlap(tz(c))]));
  const fmtH = (h) => (h % 1 ? h.toFixed(1) : String(h));
  for (const t of TIERS) {
    const ls = t.cities.map((c) => ov[c].longest);
    t.hrs = Math.min(...ls) === Math.max(...ls) ? `${fmtH(ls[0])}h` : `${fmtH(Math.min(...ls))}–${fmtH(Math.max(...ls))}h`;
  }
  // tiers must be sorted by longest stretch, with no overlap between tiers
  for (let i = 1; i < TIERS.length; i++) {
    const prevMin = Math.min(...TIERS[i - 1].cities.map((c) => ov[c].longest));
    const curMax = Math.max(...TIERS[i].cities.map((c) => ov[c].longest));
    if (curMax > prevMin) throw new Error(`tier ${TIERS[i].k} has a city better than tier ${TIERS[i - 1].k}`);
  }
  const want = { 'New York': 15, 'Bogotá': 15, 'Chicago': 14, 'Mexico City': 14, 'Denver': 13, 'Buenos Aires': 13, 'Los Angeles': 12, 'London': 10, 'Dublin': 10, 'Madrid': 9, 'Paris': 9, 'Berlin': 9, 'Auckland': 9, 'Nairobi': 7, 'Istanbul': 7, 'Sydney': 7, 'Dubai': 6, 'Tokyo': 5, 'Seoul': 5, 'Mumbai': 4.5, 'Shanghai': 4, 'Singapore': 4, 'Bangkok': 3, 'Jakarta': 3, 'Ho Chi Minh City': 3 };
  for (const [c, h] of Object.entries(want)) expect(`c5 longest ${c}`, ov[c].longest, h);
  expect('c5 Bangkok total', ov['Bangkok'].total, 6);
  expect('c5 LA starts', ov['Los Angeles'].blocks[0].start, 11);
  expect('c5 Madrid ends', ov['Madrid'].blocks[0].end, 17);
  expect('c5 Auckland starts', ov['Auckland'].blocks[0].start, 14);
  expect('c5 Sydney starts', ov['Sydney'].blocks[0].start, 16);
  expect('c5 Tokyo evening', JSON.stringify(ov['Tokyo'].blocks[1]), JSON.stringify({ start: 18, end: 23 }));
  expect('c5 Shanghai evening', JSON.stringify(ov['Shanghai'].blocks[1]), JSON.stringify({ start: 19, end: 23 }));
  expect('c5 Mumbai morning', JSON.stringify(ov['Mumbai'].blocks[0]), JSON.stringify({ start: 8, end: 12.5 }));
  expect('c5 Bangkok blocks', JSON.stringify(ov['Bangkok'].blocks), JSON.stringify([{ start: 8, end: 11 }, { start: 20, end: 23 }]));
  expect('c5 Bogotá offset in Nov', time(wall('2026-11-10 12:00'), tz('Bogotá')), '12:00 PM');
  expect('c5 Bogotá offset in Jul', time(wall('2027-07-10 12:00'), tz('Bogotá')), '11:00 AM');
  expect('c5 Sydney 4pm', `${day(wall('2026-11-10 16:00'), tz('Sydney'))} ${time(wall('2026-11-10 16:00'), tz('Sydney'))}`, 'Wed 8:00 AM');

  const bars = (...names) => C.dayBars(names.map((n) => {
    const o = ov[n];
    const hrs = o.blocks.length > 1 ? o.blocks.map((b) => fmtH(b.end - b.start)).join(' + ') + ' hrs' : `${fmtH(o.longest)} hrs`;
    return { city: n, hours: hrs, blocks: o.blocks };
  }));
  const tierSlide = (k, h, body, barCities) => {
    const t = TIERS.find((x) => x.k === k);
    return {
      h: `${k} tier: ${/^(Same|Your|Exactly)/.test(h) ? h[0].toLowerCase() + h.slice(1) : h}`, body, visual: bars(...barCities), accent: `var(--tier-${k})`,
      alt: `Cities in this tier: ${t.cities.join(', ')}. ` + barCities.map((c) => `${c}: both awake ${ov[c].blocks.map((b) => `${hourLabel(b.start)} to ${hourLabel(b.end)}`).join(' and ')}, New York time`).join('. ') + '.',
    };
  };
  return {
    slug: 'time-zones-ranked', theme: 'tier', date: '2026-11-10', due: '2026-11-10T19:00:00-05:00',
    slides: [
      {
        cover: true, h: 'Time zones, ranked by how hard it is to *text your friends*', hCls: 's',
        body: 'From New York City, in November. We counted the longest stretch you’re both awake, 8 a.m. to 11 p.m.',
        visual: C.tierChart(TIERS),
        alt: 'Tier list. ' + TIERS.map((t) => `${t.k} tier (${t.hrs}): ${t.cities.join(', ')}`).join('. ') + '.',
      },
      tierSlide('S', 'Same clock', 'Toronto, Atlanta and the rest of the East Coast. And Bogotá: Colombia doesn’t change its clocks, so it matches New York from November to March.', ['Toronto', 'Bogotá']),
      tierSlide('A', '1 to 3 hours off', 'Chicago and Mexico City get 14 hours, Denver and Buenos Aires 13, Los Angeles 12. For LA, start after 11 a.m. your time.', ['Chicago', 'Los Angeles']),
      tierSlide('B', 'Europe, plus a surprise', 'London and Dublin get 10 hours. Madrid, Paris and Berlin get 9, so text before 5 p.m. Auckland also gets 9: their morning is your afternoon.', ['London', 'Madrid', 'Auckland']),
      tierSlide('C', 'Sydney beats Tokyo', 'Your 4 p.m. is 8 a.m. tomorrow in Sydney, which gives you 7 hours in a row. Nairobi and Istanbul also get 7. Dubai gets 6.', ['Sydney', 'Dubai']),
      tierSlide('D', 'Your evening, their morning', 'Tokyo and Seoul: 6 to 11 p.m. your time. Shanghai and Singapore: 7 to 11 p.m. Mumbai flips it: 8 a.m. to 12:30 p.m.', ['Tokyo', 'Mumbai']),
      tierSlide('F', 'Exactly 12 hours away', 'Bangkok, Jakarta, Ho Chi Minh City. You get 8 to 11 a.m. and 8 to 11 p.m., and one of you is always just waking up or about to sleep.', ['Bangkok']),
      {
        cta: true, h: 'Your list will look different',
        body: 'NET-MAX shows each friend’s local time next to their name. Launching in January.',
        foot: 'How we counted: both people awake 8 a.m. to 11 p.m., checked in half-hour steps for Nov 10, 2026, New York time. US clocks changed Nov 1. Sydney and Auckland are on summer time. Some of these move by an hour in March.',
        visual: '',
        alt: '',
      },
    ],
    ig: `We ranked time zones by how many waking hours you share with New York City in November.

We counted the longest stretch you’re both awake, 8 a.m. to 11 p.m.

Surprises: Bogotá is on our time right now, Sydney beats Tokyo, and the bottom of the list is Bangkok, Jakarta and Ho Chi Minh City, exactly 12 hours ahead.

Anywhere on the East Coast gets the same list.

Which tier is your best friend in?

NET-MAX waitlist link in bio.

#timezones #longdistancefriends #studyabroad #nyc`,
    tt: `time zones ranked by how many hours you can text your friends (from new york / the east coast, november clocks). sydney beats tokyo. NET-MAX waitlist link is in our Instagram bio #timezones #tierlist #longdistancefriends #studyabroad`,
    ttTitle: 'Time zones ranked by how hard it is to text your friends',
  };
})();

// ============================================================================
// 6. Nov 12 · Moving to a new city
// ============================================================================
const c6 = (() => {
  const rem = wall('2027-01-24 19:00', tz('Madrid'));
  expect('c6 Jan 24 2027 is Sunday', day(rem, tz('Madrid')), 'Sun');
  expect('c6 Madrid 7pm in NYC', time(rem, HOME), '1:00 PM');
  const steps = [
    { when: '4 weeks before', what: 'Make the list' },
    { when: '3 weeks before', what: 'Send each one a question' },
    { when: '2 weeks before', what: 'Ask for one intro' },
    { when: 'Week 1', what: 'Book one coffee' },
    { when: 'Month 1', what: 'Keep up with home too' },
  ];
  const prog = (i) => `<div style="display:flex;gap:8px">${steps.map((_, j) => `<span style="width:46px;height:8px;background:${j <= i ? 'var(--green)' : 'var(--line)'}"></span>`).join('')}</div>`;
  return {
    slug: 'landing-somewhere-new', theme: 'green', date: '2026-11-12', due: '2026-11-12T19:00:00-05:00',
    slides: [
      {
        cover: true, h: 'New city? Start with who you *already know* there', hCls: 's',
        body: 'For an internship, a semester or a first job. From four weeks out to your first month.',
        visual: `<div class="card">${C.timeline(steps)}</div>`,
        alt: 'Timeline: ' + steps.map((s) => `${s.when}: ${s.what}`).join('. ') + '.',
      },
      {
        h: `${steps[0].when}: make the list`,
        body: 'Search your Instagram follows, LinkedIn and old group chats for the city. Ask your parents too. Write down anyone with a tie to it, even a loose one.',
        visual: `<div class="card"><div class="card-title">People I know in Madrid</div>${C.checklist([
          { text: 'Lucía', sub: 'exchange student, freshman year' },
          { text: 'Coach’s former player', sub: 'works there now' },
          { text: 'Ben’s older sister', sub: 'moved there in 2024' },
          { text: 'Mom’s college roommate', sub: 'ask Mom for her number' },
        ])}</div>`,
        alt: 'List titled “People I know in Madrid”: Lucía, exchange student from freshman year. Coach’s former player, works there now. Ben’s older sister, moved there in 2024. Mom’s college roommate.',
      },
      {
        h: `${steps[1].when}: send each one a question`,
        body: 'Ask them something about the city. Anyone who lives there can answer that, even if they barely know you.',
        visual: C.thread([{ text: 'hi! i’m moving to madrid in january for a semester. any tips for the first week?' }]),
        alt: 'Message: “hi! i’m moving to madrid in january for a semester. any tips for the first week?”',
      },
      {
        h: `${steps[2].when}: ask for one intro`,
        body: 'Go back to whoever answered. If they name someone, ask if they’d connect you over text.',
        visual: C.thread([{ text: 'this is so helpful, thank you!! is there one person you think i should meet there?' }]),
        alt: 'Message: “this is so helpful, thank you!! is there one person you think i should meet there?”',
      },
      {
        h: `${steps[3].when}: book one coffee`,
        body: 'Put a day and a place in the first message so there’s nothing left to figure out.',
        visual: C.thread([{ text: 'just landed! free thursday after 4? there’s a café two blocks from my place' }]),
        alt: 'Message: “just landed! free thursday after 4? there’s a café two blocks from my place”',
      },
      {
        h: `${steps[4].when}: keep up with home too`,
        body: `Set a repeating reminder to text two people from home. 7 p.m. on a Sunday in Madrid is ${time(rem, HOME).replace(':00', '').replace(' PM', ' p.m.')} in New York, so they’re awake.`,
        visual: `<div class="card">${C.event({ mo: 'Repeats', dd: 'Sun', title: 'Text 2 people from home', when: `Every other Sunday, ${time(rem, tz('Madrid'))}`, sub: `${time(rem, HOME)} in New York` })}</div>`,
        alt: `Repeating reminder: text 2 people from home, every other Sunday at ${time(rem, tz('Madrid'))} Madrid time, ${time(rem, HOME)} in New York City.`,
      },
      {
        cta: true, h: 'See who you know in any city',
        body: 'NET-MAX shows who you know wherever you’re going. Launching in January.',
        visual: mapOf(wall('2026-11-12 12:00'), [-100, 34, 62, 22], [['New York', 0.7, 0.3], ['Madrid', -0.7, 0.3, 'end']]),
        alt: 'Map with pins in New York and Madrid and their local times.',
      },
    ],
    ig: `Moving somewhere new in January? Start with the people you already know there.

A four-week plan for the people side of an internship or semester move.

NET-MAX launches in January. Waitlist link in bio.

#newcity #internship #studyabroad #movingabroad`,
    tt: `moving to a new city for an internship or semester: what to do 4 weeks before you land. NET-MAX waitlist link is in our Instagram bio #newcity #internship #studyabroad #movingtips`,
    ttTitle: 'Moving to a new city? Start with who you already know',
  };
})();

// ============================================================================
// 7. Nov 14 · Build log (facts only from the original post)
// ============================================================================
const c7 = (() => {
  const blocks = [
    { w: '6:30 AM', x: 'Practice' },
    { w: 'Day', x: 'Class', sub: 'and the notebook margins' },
    { w: 'Night', x: 'Build' },
    { w: 'Sunday', x: 'One meeting' },
  ];
  const sketch = `<svg viewBox="0 0 860 420" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block">
    ${[[250, 215, 140], [520, 180, 95], [700, 280, 70]].map(([cx, cy, r], k) => `
      <g fill="none" stroke="#1f2b44" stroke-width="${3 - k * 0.5}" stroke-linecap="round" transform="rotate(${-8 + k * 9} ${cx} ${cy})">
        <path d="M ${cx - r} ${cy} C ${cx - r} ${cy - r * 0.6}, ${cx - r * 0.55} ${cy - r * 1.02}, ${cx + 4} ${cy - r} S ${cx + r * 1.02} ${cy - r * 0.5}, ${cx + r} ${cy + 3} S ${cx + r * 0.5} ${cy + r * 1.03}, ${cx - 3} ${cy + r} S ${cx - r * 1.01} ${cy + r * 0.45}, ${cx - r + 2} ${cy - 6}"/>
        <ellipse cx="${cx}" cy="${cy}" rx="${r * 0.42}" ry="${r * 0.99}"/>
        <path d="M ${cx - r * 0.97} ${cy - r * 0.3} Q ${cx} ${cy - r * 0.42} ${cx + r * 0.97} ${cy - r * 0.28}"/>
        <path d="M ${cx - r} ${cy + 2} L ${cx + r} ${cy - 2}"/>
        <path d="M ${cx - r * 0.95} ${cy + r * 0.34} Q ${cx} ${cy + r * 0.46} ${cx + r * 0.95} ${cy + r * 0.32}"/>
        ${k === 0 ? `<circle cx="${cx - 40}" cy="${cy - 52}" r="7" fill="#1f2b44"/><circle cx="${cx + 52}" cy="${cy + 10}" r="7" fill="#1f2b44"/><path d="M ${cx - 40} ${cy - 52} Q ${cx + 20} ${cy - 70} ${cx + 52} ${cy + 10}" stroke-dasharray="8 8"/>` : ''}
      </g>`).join('')}
  </svg>`;
  return {
    slug: 'between-practice', theme: 'notebook', date: '2026-11-14', due: '2026-11-14T11:00:00-05:00',
    slides: [
      {
        cover: true, h: 'Building an app between *practice and class*', hCls: 'm',
        body: 'Two student-athletes, one frat house, zero free time. This is how a week works.',
        visual: C.plan(blocks),
        alt: 'Weekly schedule: 6:30 AM practice. Class during the day. Building at night. One meeting on Sunday.',
      },
      {
        h: 'Practice at 6:30 a.m.',
        body: 'Training doesn’t move for a startup. The app gets whatever hours are left.',
        visual: C.plan(blocks, 0), alt: 'Schedule with 6:30 AM practice highlighted.',
      },
      {
        h: 'Class: ideas start in the margins',
        body: 'The notebook is full of globe sketches. Ideas start there and get built at night.',
        visual: sketch, alt: 'A lined notebook page with three hand-drawn globe sketches.',
      },
      {
        h: 'At night, we build',
        body: 'Claude helps us write the code and draft content, including posts like this one. Nothing goes out until we’ve checked it.',
        visual: `<div class="card">${C.timeline([
          { dot: '1', when: 'Us', what: 'Decide what to build' },
          { dot: '2', when: 'Claude', what: 'Helps write the code and first drafts' },
          { dot: '3', when: 'Us', what: 'Check everything before it ships' },
        ])}</div>`,
        alt: 'Steps: Us, decide what to build. Claude, helps write the code and first drafts. Us, check everything before it ships.',
      },
      {
        h: 'One meeting, every Sunday',
        body: 'Same three questions every time. We run it like partners at a real firm.',
        visual: `<div class="card"><div class="card-title">Sunday meeting</div>${C.checklist([{ text: 'What shipped?' }, { text: 'What didn’t?' }, { text: 'What’s next?' }])}</div>`,
        alt: 'Sunday meeting agenda: What shipped? What didn’t? What’s next?',
      },
      {
        h: 'We kept losing people', hTag: 'h1', hCls: 's',
        body: 'Friends from trips, teams and semesters abroad, spread across time zones. NET-MAX is the app we wanted for ourselves.', bodyCls: 'l',
        visual: '', alt: '',
      },
      {
        cta: true, h: 'NET-MAX launches in *January*',
        body: 'Your whole network on one map. Follow along for the rest of the build.',
        visual: '', alt: '',
      },
    ],
    ig: `How a week of building NET-MAX works: practice at 6:30, class, building at night, and one meeting every Sunday.

We use Claude to help with code and drafts. We decide what gets built and check everything before it goes out.

Launching in January. Waitlist link in bio.

#buildinpublic #studentathlete #studentfounder #startup`,
    tt: `how we’re building an app as two student-athletes: practice at 6:30, class, building at night. NET-MAX waitlist link is in our Instagram bio #buildinpublic #studentathlete #studentfounder #startup`,
    ttTitle: 'Building an app between practice and class',
  };
})();

// ============================================================================
// 8. Nov 15 · Thanksgiving
// ============================================================================
const c8 = (() => {
  const dinner = wall('2026-11-26 16:00');
  expect('c8 Thanksgiving is Thu', day(dinner, HOME), 'Thu');
  const abroad = rows(dinner, cities('London', 'Madrid', 'Tokyo', 'Sydney'));
  expect('c8 London', time(dinner, tz('London')), '9:00 PM');
  expect('c8 Tokyo', `${day(dinner, tz('Tokyo'))} ${time(dinner, tz('Tokyo'))}`, 'Fri 6:00 AM');
  expect('c8 Nov 25 is Wed', day(wall('2026-11-25 12:00'), HOME), 'Wed');
  expect('c8 Nov 15 is Sun', day(wall('2026-11-15 12:00'), HOME), 'Sun');
  const cal = (hl = []) => C.week(Array.from({ length: 14 }, (_, i) => {
    const n = 15 + i;
    const ev = { 15: 'today', 25: 'night before', 26: 'thanks-giving' }[n] || '';
    let cls = n === 26 ? 'hol' : '';
    if (hl.includes(n) && n !== 26) cls += ' on';
    if (hl.length && !hl.includes(n) && n !== 26) cls += ' off';
    return { n, ev, cls };
  }));
  return {
    slug: 'before-you-go-home', theme: 'harvest', date: '2026-11-15', due: '2026-11-15T11:00:00-05:00',
    slides: [
      {
        cover: true, h: 'Going home for Thanksgiving? *Text these people*', hCls: 'm',
        body: 'Thanksgiving is Thursday, Nov 26. Who to text, and which day to do it.',
        visual: `<div class="card">${cal()}</div>`,
        alt: 'Calendar from Sunday November 15 to Saturday November 28. Today is the 15th. Wednesday the 25th is the night before. Thursday the 26th is Thanksgiving.',
      },
      {
        h: 'This week: high school friends',
        body: 'Everyone’s home the same few days. Start the group text now and claim a night before the week fills up.',
        visual: C.thread([{ text: 'who’s home wednesday the 25th? pizza at the usual place?' }]),
        alt: 'Group text: “who’s home wednesday the 25th? pizza at the usual place?”',
      },
      {
        h: 'This week: the friend who moved away',
        body: 'Ask if they’re home for break too. If your days overlap, put one on the calendar now. If they don’t, set up a call.',
        visual: C.thread([{ text: 'you home for thanksgiving? i’m back the 24th through the 29th' }]),
        alt: 'Message: “you home for thanksgiving? i’m back the 24th through the 29th”',
      },
      {
        h: 'Over break: your old coach or teacher',
        body: 'Stop by or send a note. Tell them one thing you’re working on and one thing they taught you that you still use.',
        visual: C.thread([{ text: 'coach! i’m home over break. could i stop by one day this week and say hi?' }]),
        alt: 'Message: “coach! i’m home over break. could i stop by one day this week and say hi?”',
      },
      {
        h: 'Thursday: friends abroad',
        body: 'It’s a normal Thursday for them. Send a photo from the table, but check their clock first. For Europe, send it before you sit down.',
        visual: C.conv([{ k: 'If dinner is at', v: time(dinner, HOME), rows: abroad }]),
        alt: `If dinner is at ${time(dinner, HOME)} in New York: ` + abroad.map((r) => `${r.city} ${r.t} ${r.sub.replace(', tomorrow', '')}, ${r.awake ? 'awake' : 'asleep'}`).join('; ') + '.',
      },
      {
        h: 'Thursday: someone you lost touch with',
        body: 'The holiday is the reason, so you don’t need another one.',
        visual: C.thread([{ text: 'happy thanksgiving! was thinking about you today. how’ve you been?' }]),
        alt: 'Message: “happy thanksgiving! was thinking about you today. how’ve you been?”',
      },
      {
        cta: true, h: 'Next break, check who’s home first',
        body: 'NET-MAX shows who you know wherever you are, home included. Launching in January.',
        visual: '', alt: '',
      },
    ],
    ig: `Thanksgiving is Thursday, Nov 26. Who to text over break, and which day to do it.

If you have friends abroad, check the time before you send the table photo. 4 p.m. dinner in New York is 9 p.m. in London and 6 a.m. Friday in Tokyo.

NET-MAX launches in January. Waitlist link in bio.

#thanksgiving #thanksgivingbreak #collegelife #friendsgiving`,
    tt: `who to text when you go home for thanksgiving break, and which day to text them. NET-MAX waitlist link is in our Instagram bio #thanksgivingbreak #thanksgiving #collegelife #homeforthebreak`,
    ttTitle: 'Going home for Thanksgiving? Text these people',
  };
})();

export const carousels = [c1, c2, c3, c4, c5, c6, c7, c8];
