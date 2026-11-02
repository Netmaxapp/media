# Content rules

Every carousel goes through this list before it ships. The rules come from the November 2026 audit: the first batch of 8 carousels (59 slides) had all of these problems.

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
2. **Each carousel gets its own theme** that fits its topic. A theme is a palette, a headline face and one signature detail: paper and highlighter for a writing guide, an airmail border for study abroad, a messages-app look for texts. The logo, handle, body font, type scale and margins stay the same everywhere. Two carousels in a row should never look alike in the grid, so alternate dark and light.
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
