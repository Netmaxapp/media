# Content rules

Every video and carousel goes through this list before it ships. The copy and design rules come from the November 2026 audit: the first batch of 8 carousels (59 slides) had all of these problems.

## The new-content-rules skill

All of the rules below are packaged as one skill, `.claude/skills/new-content-rules`. It holds the Floor for every format and a checker: `node .claude/skills/new-content-rules/scripts/lint.mjs`. Use it for every post.

## The no-slop list (this comes first)

[`NO_SLOP_LIST.md`](NO_SLOP_LIST.md) lists 20 patterns we never use. They include pills, italics, Instrument Serif, tight kerning, dividers, bordered boxes, eyebrows, ALL CAPS, heavy mono, gradients, squircles and periods on headlines. Where any rule below conflicts with that list, the list wins.

## Hallmark (design skill)

Every new NET-MAX design goes through [Hallmark](https://github.com/Nutlope/hallmark). It's installed at `.claude/skills/hallmark`, copied from Nutlope/hallmark at commit `407fa68` (MIT).

- **Web pages** (waitlist site, landing pages): run the full Hallmark flow: `/hallmark <prompt>`.
- **Carousels and videos:** follow the Floor in `.claude/skills/hallmark/SKILL.md` wherever it applies to an image:
  - Every colour and font comes from a token.
  - No accented or italic word inside a headline.
  - No eyebrows, tracked capitals or small caps.
  - No middle-dot meta strings and no decorative status dots.
  - No invented numbers.
  - About 80 words per slide at most.
  - Three font families at most.
- **Before shipping,** run `node .claude/skills/hallmark/scripts/sloplint.mjs <file.css>` on any stylesheet you changed and fix what applies. Its web-only gates (focus rings, page stamp, overflow, `<title>`) don't apply to images and can be ignored.

## Editing rules

**Core principle:** skip the editing habits AI tools repeat on every video. Pick classic, brand-consistent choices instead. These six rules beat everything else on this page. [`VIDEO_STYLE.md`](VIDEO_STYLE.md) turns them into exact specs.

1. **Captions show 3 words at a time.** Never animate one word or one letter at a time.
2. **No italic fonts.** Use our brand fonts (Bricolage Grotesque, Inter, Fraunces) or TikTok's Classic font. Headlines are one colour: no highlighted, coloured or italic word, never italic.
3. **No stock emojis or generic icons on screen.** Use real screenshots (Clock, Messages, Maps, Calendar, the real NET-MAX build) or the data itself. Never generate a fake app screen.
4. **Keep natural pauses in speech.** Shorten long silences, but don't strip every pause. Cut between sentences, never mid-phrase.
5. **No "pop" on every element.** Use cut, fade, wipe or (once) rise. Use at most 3 moves per video. No scale, bounce or shake.
6. **Square corners by default.** Round only what's round in real life: message bubbles, voice notes, avatars and status dots.

The build enforces rules 1, 2, 3, 5 and 6. `tools/carousels/guard.mjs` and the video renderer fail on italic type, on-screen emoji, rounded boxes, pop animations, more than 3 moves, or text typed out letter by letter. Rule 4 needs a human ear.

## Copy

1. **No contrast formulas.** Cut "X beats Y", "not X, Y", "X isn't Y, it's Z", "After two days you're A. After two weeks you're B." One is a choice. Ten in a batch is a template.
2. **No slogans as closing lines.** "That's the whole move." "Spread out means forgotten." "Honest beats clever." End on the instruction or the example.
3. **No numbers we can't back up.** No "most people", "almost always", "one coffee leads to two intros". Every number has to be computed or sourced, and the source goes in `tools/carousels/content.mjs` next to the claim.
4. **No stock creator phrases.** Banned: "Save this", "Swipe →", "Now what?", "Here's how it actually works", "actually", "game-changer", "unlock", "level up", "hack", "the secret". Instagram already has a save button.
5. **Every tip needs something to do.** Give the settings path, the exact message, the time, or the date. If someone can't act on it in five minutes, cut it or make it specific.
6. **Show the example.** Don't say "be specific". Write the specific message.
7. **Don't invent stories.** No made-up anecdotes about us or users. Use "we" only for things that are true about NET-MAX (see the build log). Use example names only inside mock messages, where they're obviously examples.
8. **Write like a person texting.** Use sentence case and contractions. Mock texts are lowercase, the way people actually type them. Read every slide out loud, and if it sounds like a LinkedIn post, rewrite it.
9. **No em dashes in copy.** Use a period, comma or colon.
10. **Lists don't need to be even.** Don't pad a list to 7 or trim it to 5 to hit a round number, and don't make every item the same length.
11. **One CTA, on the last slide only.** Tie its first line to what the carousel covered. Don't repeat the tagline on every slide.
12. **Disclose AI use honestly.** Claude helps with code and drafts, and the build log says so. Rule 7 also means not pretending otherwise.

## Captions

- Add something the slides don't already say.
- Use one emoji at most. Most captions don't need any.
- Use 3–5 specific hashtags. Skip generic ones like #travel and #networking.
- Only ask a question if we'd read the answers.
- TikTok: start with the words people search for, in lowercase. Say the waitlist link is in our Instagram bio.

## Design

1. **No glow, no neon gradients, no globe wallpaper.** Every visual has to carry information: clocks, times, messages, calendars, data. If you can delete the image without losing anything, delete it.
2. **Each carousel gets its own theme** that fits its topic. A theme is a palette, a headline face and one signature detail: paper for a writing guide, an airmail border for study abroad, a messages-app look for texts. The logo, handle, body font, type scale and margins stay the same everywhere. Two carousels in a row should never look alike in the grid, so alternate dark and light.
3. **Use sentence-case headlines.** Use the mono font only for times, dates and labels.
4. **Use one flat accent color per carousel.** Brand green `#39FF88` shows up in every theme, at least in the logo bar.
5. **Put the handle small on every slide** so screenshots still credit us. Put the logo on the cover and the last slide only. No page counters, because the platforms already show dots.
6. **Size natively for each platform.** Instagram is 1080×1350. TikTok is 1080×1920, with text kept out of the right-side buttons and the bottom caption area.
7. **Alt text is the full slide text**, not a summary.

## Before you schedule

- [ ] Check every time and date against the tz database for the week it posts.
- [ ] Check every claim against rule 3.
- [ ] Look at each slide at phone size. Body text is at least 30px on a 1080-wide canvas.
- [ ] Look at the TikTok version with the UI overlay in mind.
