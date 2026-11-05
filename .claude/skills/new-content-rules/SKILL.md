---
name: new-content-rules
description: "NET-MAX's rules for every piece of social media content: Instagram and TikTok carousels, Reels and TikTok videos, captions, stories, on-screen text, alt text and post copy. A hard floor against the tells that make content read as AI-generated, plus a checker script. Use this whenever you write, design, edit, review or schedule anything for @networkingmaxxing or @netmaxapp, or any NET-MAX post, slide, caption, script, video or story, even if the user doesn't mention rules or slop. Also use it to audit content that already exists before it goes out."
---

# New content rules

Content made with AI tools tends to repeat the same tells: an eyebrow over every headline, one green word in the title, tracked capitals, pills, bordered cards, words popping in one at a time, "Save this 👇". People spot these in half a second and scroll past. These rules keep NET-MAX content looking like a person with taste made it.

There are three layers, in order of strength:

1. **The Floor.** Never broken, in any format.
2. **Format rules** for carousels, videos, captions and stories.
3. **The check.** Run `scripts/lint.mjs` on every piece of copy before it ships, then do the by-eye checklist.

Where something here conflicts with an older note in the repo, this skill wins. The detailed source docs are `references/no-slop-list.md` (the 20 banned design patterns, with what to do instead) and `references/video-style.md` (exact video specs).

## The Floor

These apply to everything: slides, videos, captions, stories and alt text.

**Words**
1. **No invented facts.** No made-up numbers, users, testimonials, stories about us, or "most people" claims. Every time and number is computed (`tools/carousels/time.mjs`) or sourced. If a real number is missing, ask for it rather than writing one.
2. **No stock creator phrases or AI vocabulary.** Examples: "save this", "swipe", "now what?", "here's how", "actually", "game-changer", "unlock", "level up", "hack", "the secret", "elevate", "seamless", "leverage", "journey", "delve", "empower". The checker has the full list.
3. **No contrast formulas** ("X isn't Y, it's Z", "not X, Y", "X beats Y") and no slogans as closing lines. End on the instruction or the example.
4. **No em dashes.** Use a period, comma or colon.
5. **Say it once, in the fewest words.** About 80 words per slide or screen at most. Cut anything that repeats the headline.
6. **Show the example, don't describe it.** Write the actual text message, the settings path, the time.
7. **Be honest about AI.** Claude helps with code and drafts, and we say so. Generated footage is labelled on screen, in the caption and with the platform's AI flag.

**Type**
8. **Headlines are one colour, one face and upright.** Never one coloured, highlighted or italic word inside a headline. To give something weight, use better words or split the line in two.
9. **No period at the end of a headline.** Body sentences keep their periods.
10. **No eyebrows** (small labels above a headline), **no ALL CAPS, no tracked capitals, no small caps.** Labels are in sentence case, in the body font, a step smaller.
11. **Normal letter spacing.** Never set tighter than default.
12. **Three font families at most:** Bricolage Grotesque, Inter and Fraunces. No monospace for labels. No Instrument Serif, script or handwriting fonts.

**Shapes and colour**
13. **No tags, pills or chips.** Plain text instead.
14. **No bordered containers and no divider lines.** Use space to separate things. Draw a box only when the real thing is a box: a phone, a note, a calendar.
15. **Square corners by default.** Round only what's round in real life: message bubbles, voice notes, avatars, status dots.
16. **Solid colours only.** No gradient backgrounds, no transparent overlays, no glow, no grain, dither or texture. A few colours per design: background, text, one muted tone, and brand green `#39FF88`.
17. **No middle-dot strings** ("Chicago · 6:00 PM") and no decorative dots. Use a comma or a line break.
18. **No emojis or stock icons on screen.** Use real screenshots (Clock, Messages, Maps, the real NET-MAX build) or the data itself. Never generate a fake app screen.
19. **No section numbering** (01, 1.1) and **no breadcrumbs** (`a / b / c`). Headlines say what the section is.
20. **No over-detailed UI, diagrams or ASCII art.** Show the fewest parts that make the point.

## Format rules

### Carousels (Instagram 1080×1350, TikTok 1080×1920)
- The cover's headline is the hook. Slide 2 delivers on it straight away, with no "here's what you need to know" slide.
- Each slide makes one point. Where a slide needs context like a time or a tier, put it in the headline ("This week: high school friends"), not in an eyebrow above it.
- The logo goes on the cover and the last slide only. The handle is small on every slide. No page counters.
- One call to action, on the last slide only. Its first line ties back to what the carousel covered.
- Give each carousel its own theme (palette, headline face, one signature detail) so two in a row never look alike in the grid. All themes stay inside the Floor.
- On TikTok, keep text out of the right-side buttons and the bottom 480 px.
- Alt text is the full slide text, not a summary.
- In this repo: copy goes in `tools/carousels/content.mjs`, and `node tools/carousels/render.mjs` renders and checks it.

### Videos (Reels and TikTok, 9:16)
- **Captions show 3 words at a time,** timed to speech and broken where people pause. No word-by-word pop, no karaoke highlight.
- **Keep natural pauses.** Shorten long silences to about 0.3 s, but don't strip every breath. Cut between sentences, never mid-phrase.
- **No pop on everything.** Use cut, fade, wipe, or (once per video) rise. At most 3 kinds of entrance animation per video. No scale, bounce, shake or zoom punch.
- **Text on the first frame,** because frame 1 is both the hook and the cover. Keep videos to 12–20 s, with the payoff before the two-thirds mark. Everything must read with the sound off.
- **Film it if you can.** Generate only places you can't film, and label it as AI-generated.
- Exact specs are in `references/video-style.md`. In this repo, motion videos come from `node tools/videos/render.mjs`, which checks the moves and styles.

### Captions
- **Instagram:** the first line has to fit the roughly 125 characters the feed shows before "... more", and land as a whole thought.
- **TikTok:** start with the words people search for, in lowercase. Say the waitlist link is in our Instagram bio.
- **Content:** add something the slides don't say. One emoji at most (usually none). 3–5 specific hashtags, never generic ones like #travel. One ask. Only ask a question if we'd read the answers.

### Stories
- One idea per frame, at most about 20 words.
- Use a native sticker (poll, question, slider) only when we'll actually use the answers.
- Show real screenshots or real footage. The Floor's type and shape rules apply to anything we draw on top.

## The check

Run the checker on every piece of copy before it ships: captions, slide text, scripts and story text.

```bash
node .claude/skills/new-content-rules/scripts/lint.mjs <file-or-folder> [--format ig|tt|story|slide]
node .claude/skills/new-content-rules/scripts/lint.mjs --text "the caption here" --format ig
node .claude/skills/new-content-rules/scripts/lint.mjs --manifest tools/carousels/manifest.json
```

It flags:
- banned phrases and AI vocabulary, contrast formulas, em dashes
- ALL CAPS runs and middle dots
- emoji on screen, or more than one in a caption
- hashtag count
- an Instagram first line that won't fit the feed preview
- slides over the word budget
- headlines that end in a period

Fix every `FAIL`. Fix each `WARN`, or keep it and say why.

The checker reads text only. For images and video, also run the repo's renderers, which enforce corners, italics, emoji and animation moves, and check these by eye:

- [ ] Is every headline one colour, with no eyebrow and no period?
- [ ] Are there any pills, bordered boxes, divider lines, gradients or see-through colours?
- [ ] Are there 3 fonts or fewer, with no monospace labels?
- [ ] Is every number and time real and computed?
- [ ] Does it read at phone size, and with the sound off?
- [ ] Is the TikTok version clear of the right-side buttons and the bottom caption area?
- [ ] Is generated footage labelled?

When you report back, say which rules you checked and whether anything was waived, with the reason.
