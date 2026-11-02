# NET-MAX video style guide

How we edit every Reel and TikTok for @networkingmaxxing and @netmaxapp. The goal is a video that looks edited by a person with taste, not assembled by an AI tool on default settings, and that still holds attention.

**Core principle:** skip the editing habits AI tools repeat on every video. Pick classic, brand-consistent choices, and make each one on purpose.

The six editing rules in [`CONTENT_RULES.md`](CONTENT_RULES.md) are the law. This guide turns them into specs for our formats. Wherever the build can check a rule, it does, and a video or carousel that breaks one won't render.

---

## 1. What we make

| Format | Used for | Made with |
|---|---|---|
| Motion graphics, 15 s | Diagrams, contact lists, time zone math, counters | `tools/videos/` (code, frame by frame) |
| Filmed on a phone | Skits, us on camera, real screens, campus at night | iPhone, edited by hand |
| Generative B-roll | Cities we can't film (Madrid at 1 a.m.) | Generative video tools, short cutaways only, always labelled |

All video is 1080×1920, 30 fps. Keep text inside the safe zone: 220 px from the top, 480 px from the bottom, 76 px from the left and 150 px from the right, so TikTok's buttons and caption never cover it.

---

## 2. The six rules, applied to us

### Rule 1. Captions: 3 words at a time
AI tools animate captions one word at a time, each word popping in. It's tiring to read and it's the first thing that gives a video away.

- **Speech captions** (skits, us on camera): show **3 words per caption**, timed to the voice, changing on a hard cut. Break chunks where people pause ("I texted her / at 2 a.m. / by accident"), not mechanically every 3 words. Stay in sentence case. No karaoke highlight on the current word, no bounce and no per-word color.
- **Typed messages** (like the conference-math text): the message fills in 3 words at a time. Never letter by letter, and no blinking cursor.
- **Headlines:** they appear whole, all at once.
- **Size and place:** Inter SemiBold, 54–60 px on the 1080 canvas, white text in a square black box at 75% opacity, centred, with the baseline between y 1150 and y 1350. That's low enough to stay clear of faces and above TikTok's caption.

*Checked by the build:* the typing runtime only reveals 3 words at a time and can't animate single letters or words.

### Rule 2. No italic fonts
The slanted display serif AI tools love is the most recognizable "AI video" font there is.

- **Our fonts:** Bricolage Grotesque for headlines, Inter for body and captions, JetBrains Mono only for times, dates and labels. Some carousel themes swap the headline face (Fraunces, DM Serif Display, Kalam), always upright.
- **Emphasis:** brand green `#39FF88` on dark backgrounds, or a green highlighter stripe on light ones. Never italic, never bold-italic.
- **Text added in the TikTok or Instagram editor:** use the **Classic** font. Don't use the script, neon or typewriter styles.

*Checked by the build:* any italic or oblique text on a frame fails the render.

### Rule 3. No stock emojis or generic icons
On-screen emojis and clip-art icons (🔥 💡 📍 ✈️ a globe, a lightbulb) say "template" instantly.

- **Use the real thing:**
  - A screenshot of the iPhone Clock app, a real Messages thread (with names changed), Google Maps, or a calendar.
  - Once it exists, the real NET-MAX app from TestFlight.
  - In motion graphics, the information itself: times, cities, names, numbers.
- **Never generate a fake app screen.** NET-MAX's UI only appears when it's the real build.
- **Our only "icon" is the logo bar.** Status dots (awake or asleep) are data, not decoration.
- **Captions** may use at most one emoji (see Captions in `CONTENT_RULES.md`). On screen, use none.

*Checked by the build:* any emoji in on-screen text fails the render.

### Rule 4. Keep natural pauses
Aggressive silence removal makes people sound like robots reading a teleprompter at 1.5×.

- **Keep breaths between sentences.** Shorten silences longer than about 0.6 s down to about 0.3 s, but don't go below about 0.15 s between sentences.
- **Cut only at the end of a sentence or a thought, never mid-phrase.** A jump cut should land on a new idea.
- **Leave a beat before a punchline.** Half a second of nothing before "still no idea who Daniel is" is what makes it land.
- **In CapCut or Descript, don't run automatic "remove pauses" on the default setting.** Cut by hand, or set the minimum kept pause to about 0.3 s, then listen once at normal speed.
- **Music sits under the voice at about 30–35% volume** (that's what our build uses). In motion-graphics videos with no voice, the text timing is the pause: hold each beat long enough to read.

### Rule 5. No "pop" on everything
AI editors give every element the same scale-up pop. When everything bounces, nothing stands out.

**Our set of moves** (`data-fx` in `tools/videos/timeline.js`):

| Move | What it does | Use it for |
|---|---|---|
| **Cut** | On instantly, no tween | Headlines, scene changes, the joke, the end card. Our default. |
| **Fade** | 0.25 s opacity | Secondary details: axis labels, "Delivered", the handle |
| **Wipe** | Revealed left to right, 0.45 s | A column or line of data changing all at once |
| **Rise** | Fade plus a 12 px rise | One moment per video at most |
| Draw on | A line grows | Axes and connectors |
| Count up | A number counts | Numbers that are the point (47 contacts) |

- **Use at most 3 entrance moves per video**, and **rise** at most once.
- **No scale, bounce, shake, spin, zoom punch or whoosh transitions.**
- **Exits are cuts.** Something leaves when the next thing needs the space.
- **Lists appear as one block, not row by row.** A 2×2 can reveal quadrants one at a time, because each quadrant is a beat of the joke.

*Checked by the build:* the renderer fails on any scale or pop, on more than 3 entrance moves, or on rise used twice.

### Rule 6. Square corners by default
AI templates round every box, image and label.

- **Square:** cards, panels, lists, tags, labels, charts, bars, calendars, screenshots and photo frames.
- **Round only what's round in real life:** message bubbles, voice notes, avatars, status dots and data-point dots.
- **When you crop a screenshot, keep its edges square.** Don't add rounded corners or drop shadows to a crop.

*Checked by the build:* any rounded element that isn't on that list fails the render (`tools/carousels/guard.mjs`).

---

## 3. Engagement, without the tropes

- **Text on the first frame.** Frame 1 is the hook and the cover, so the headline is a cut at 0.0 s, never a fade from black.
- **One idea per video, 12–20 s long.** Deliver the payoff (the joke, the number, the answer) before the two-thirds mark.
- **Readable with the sound off.** Every point is on screen, and no meaning depends on the audio alone.
- **Hold text long enough to read it:** about 3 words per second plus half a second, and never under 1.5 s for a full line.
- **Every number is computed.** Times come from the tz database, and the build fails if a number on screen is wrong.
- **End card for about 3 s with one call to action.** Logo and line cut in together on the beat, details fade in under them. End on what the viewer should do, not on a slogan.
- **Make it loop.** The end card's background matches the first frame's, so a replay feels like a restart.
- **Use real moments over generated ones.** Film it if we can. Generate only places we can't reach, and label them "AI-generated footage".

---

## 4. Before it ships

The build checks the following automatically. Run `node render.mjs` in `tools/videos` or `tools/carousels` and it fails if any of these break:
- No italic type.
- No emoji on screen.
- Square corners except on real-world round things.
- No pop or scale animation.
- At most 3 entrance moves per video.
- Text reveals 3 words at a time.
- Every time and number matches the tz math.

Check these by eye:
- [ ] Watch it once at normal speed with sound, then once muted.
- [ ] Are the pauses natural? Does anything feel rushed?
- [ ] Does frame 1 work as the cover in the grid?
- [ ] Is anything on screen a stock icon, a stock photo or a fake app screen?
- [ ] Is generated footage labelled on screen, in the caption and with the platform's AI label?
- [ ] Is the TikTok version clear of the right-side buttons and the bottom caption?
