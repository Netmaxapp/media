---
name: new-content-rules
description: "NET-MAX's social media marketing rules for Instagram (@networkingmaxxing) and TikTok (@netmaxapp): how to plan, write, design, check and schedule carousels, Reels and TikToks, captions, hooks, stories, comments, replies and DMs so they grow the waitlist and never read as AI-generated. Includes a checker script for copy and a clock-change script for time-zone posts. Use this whenever you write, design, edit, review, repurpose or schedule any NET-MAX social post, slide, caption, hook, script, video, story or reply, or audit one before it goes out, even if the user doesn't mention rules, slop or marketing. Not for websites or landing pages."
---

# New content rules

These rules are for NET-MAX's social media marketing: Instagram and TikTok posts, and the comments, replies and DMs around them. They are not for websites, landing pages or app UI.

Every post has one job: get the right person to stop, get something useful, and join the waitlist. Content made with AI tools fails that job in a familiar way. It has an eyebrow over every headline, one green word in the title, pills, bordered cards, words popping in one at a time, "Save this 👇". People spot these in half a second and scroll past. These rules keep NET-MAX content looking like a person with taste made it, so the marketing works.

There are four layers:

1. **The marketing job.** Who the post is for, what it gives them, and the one thing it asks.
2. **The Floor.** Never broken, in any format.
3. **Format rules** for carousels, videos, captions, stories and engagement.
4. **The check.** Run `scripts/lint.mjs` on every piece of copy before it ships, then do the by-eye checklist.

Where something here conflicts with an older note in the repo, this skill wins. The detailed source docs are `references/no-slop-list.md` (the 20 banned design patterns, with what to do instead) and `references/video-style.md` (exact video specs).

## The marketing job

**Who we're talking to:** students and young people with friends, family or partners spread across time zones. That includes study abroad students, international students, people who moved for school or work, and their friends back home. The home city in our examples is New York City (Eastern time). Label it "New York" in tight spots like clocks and map pins, and "New York City" in sentences.

**What we're selling:** NET-MAX, an iOS app launching in January that puts everyone you know on a map with their local time. For now, the only ask is the waitlist. Its link lives in the Instagram bio.

For every post:
- **One audience, one problem, one payoff.** Name the moment people recognise, like texting a friend at 3 a.m. their time or missing a birthday that started yesterday. Then give something they can use today.
- **The value comes first, the product comes last.** The post has to be worth saving even for someone who never downloads the app. The product shows up once, at the end, as the obvious next step from what the post just taught.
- **The hook is the first frame or the first line.** It names the situation or the payoff in plain words, like "Their birthday in Seoul starts Wednesday at 10 AM your time". No tease, no "wait for it", no "you won't believe", no POV formula.
- **One ask, and it's the waitlist.** Don't stack "save, share, follow, comment". Ask for a comment only if someone will answer every reply.
- **Write for search.** Put the words people type (time zones, study abroad, long distance friends, texting abroad) in the first caption line, the on-screen text and the hashtags.
- **Make every claim real.** No invented users, results, testimonials or "most people" numbers. Trust is the brand, and we don't have users yet, so don't imply we do.
- **Repurpose, don't copy.** On TikTok we post videos, not carousels or photo mode: they do better there. An Instagram carousel or image becomes a 12–20 s 1080×1920 motion video of the same idea, with a TikTok-style caption.

## The Floor

These apply to everything: slides, videos, captions, stories, replies and alt text.

**Words**
1. **No invented facts.** No made-up numbers, users, testimonials, stories about us, or "most people" claims. Every time and number is computed (`tools/carousels/time.mjs`) or sourced. If a real number is missing, ask for it rather than writing one.
2. **Time-zone math holds for the week it posts.** Compute it for the posting date. If you write "this holds until…", get the date from `node scripts/dst.mjs <post-date>`, never from memory. US clocks change on the second Sunday of March and the first Sunday of November. The UK and EU change on the last Sunday of March and of October.
3. **No stock creator phrases or AI vocabulary.** Examples: "save this", "swipe", "now what?", "here's how/what/why", "actually", "game-changer", "unlock", "level up", "hack", "the secret", "elevate", "seamless", "leverage", "journey", "delve", "empower". The checker has the full list.
4. **No contrast formulas** ("X isn't Y, it's Z", "not just X", "X beats Y") and no slogans as closing lines. End on the instruction or the example.
5. **No em dashes.** Use a period, comma or colon.
6. **Say it once, in the fewest words.** About 80 words per slide or screen at most. Cut anything that repeats the headline.
7. **Show the example, don't describe it.** Write the actual text message, the settings path, the time.
8. **Be honest about AI.** Claude helps with code and drafts, and we say so. Generated footage is labelled on screen, in the caption and with the platform's AI flag.

**Type**
9. **Headlines are one colour, one face and upright.** Never one coloured, highlighted or italic word inside a headline. To give something weight, use better words or split the line in two.
10. **No period at the end of a headline.** Body sentences keep their periods.
11. **No eyebrows** (small labels above a headline), **no ALL CAPS, no tracked capitals, no small caps.** Labels are in sentence case, in the body font, a step smaller.
12. **Normal letter spacing.** Never set tighter than default.
13. **Three font families at most:** Bricolage Grotesque, Inter and Fraunces. No monospace for labels. No Instrument Serif, script or handwriting fonts.

**Shapes and colour**
14. **No tags, pills or chips.** Plain text instead.
15. **No bordered containers and no divider lines.** Use space to separate things. Draw a box only when the real thing is a box: a phone, a note, a calendar.
16. **Square corners by default.** Round only what's round in real life: message bubbles, voice notes, avatars, status dots.
17. **Solid colours only.** No gradient backgrounds, no transparent overlays, no glow, no grain, dither or texture. A few colours per design: background, text, one muted tone, and brand green `#39FF88`.
18. **No middle-dot strings** ("Chicago · 6:00 PM") and no decorative dots. Use a comma or a line break.
19. **No emojis or stock icons on screen,** and none inside example texts shown on a slide. Use real screenshots (Clock, Messages, Maps, the real NET-MAX build) or the data itself. Never generate a fake app screen.
20. **No section numbering** (01, 1.1, Step 1) and **no breadcrumbs** (`a / b / c`). Headlines say what the section is.
21. **No over-detailed UI, diagrams or ASCII art.** Show the fewest parts that make the point.

## Format rules

### Carousels (Instagram 1080×1350; on TikTok, make a video instead)
- The cover's headline is the hook. Slide 2 delivers on it straight away, with no "here's what you need to know" slide.
- Each slide makes one point. Where a slide needs context like a time or a tier, put it in the headline ("This week: high school friends"), not in an eyebrow above it.
- The logo goes on the cover and the last slide only. The handle is small on every slide. No page counters.
- One call to action, on the last slide only. NET-MAX and the waitlist appear nowhere else. The CTA's first line ties back to what the carousel covered.
- Give each carousel its own theme (palette, headline face, one signature detail) so two in a row never look alike in the grid. All themes stay inside the Floor.
- On TikTok, keep text out of the right-side buttons and the bottom 480 px.
- Alt text is the full slide text, not a summary.
- Draft slide copy as `## Slide N` sections with `**Headline:**` and `**Body:**`, then run the checker with `--format carousel`.
- In this repo, copy goes in `tools/carousels/content.mjs`, and `node tools/carousels/render.mjs` renders and checks it.

### Videos (Reels and TikTok, 9:16)
- **Text on the first frame,** because frame 1 is both the hook and the cover. Keep videos to 12–20 s, with the payoff before the two-thirds mark. Everything must read with the sound off.
- **Captions show 3 words at a time,** timed to speech and broken where people pause. No word-by-word pop, no karaoke highlight.
- **Keep natural pauses.** Shorten long silences to about 0.3 s, but don't strip every breath. Cut between sentences, never mid-phrase.
- **No pop on everything.** Use cut, fade, wipe, or (once per video) rise. At most 3 kinds of entrance animation per video. No scale, bounce, shake or zoom punch.
- **End card** for about 3 s with the one ask. Match it to the first frame so the video loops.
- **Film it if you can.** Generate only places you can't film, and label it as AI-generated.
- **Stock footage:** check the licence on every clip's own page before using it. From Mixkit, use only clips under the Stock Video Free License, never the Restricted one. When one person stands for "me" across beats, use the same actor in every beat (pick clips from one shoot). Don't reuse the same actor across different videos.
- **Audio:** use the platform's licensed library or our own music. Never use an unlicensed track.
- For a script, write the hook line, then the beats with their on-screen text and timing, then the end card. Exact specs are in `references/video-style.md`. In this repo, motion videos come from `node tools/videos/render.mjs`, which checks the moves and styles.

### Captions
- **Instagram:** the first line has to fit the roughly 125 characters the feed shows before "... more". It has to land as a whole thought and carry the search words.
- **TikTok:** start with the words people search for, in lowercase. Say the waitlist link is in our Instagram bio.
- **Content:** add something the slides don't say. One emoji at most (usually none). 3–5 specific hashtags, never generic ones like #travel, #networking or #fyp. One ask. Only ask a question if we'd read the answers.

### Stories
- One idea per frame, at most about 20 words.
- Use a native sticker (poll, question, slider) only when we'll actually use the answers.
- Use the link sticker for the waitlist on the last frame only.
- Show real screenshots or real footage. The Floor's type and shape rules apply to anything we draw on top.

### Comments, replies and DMs
- Write like a person on the team. Keep it short, use sentence case, and use no emoji strings.
- Answer the question that was asked. Mention the waitlist only when someone asks about the app.
- Never copy-paste the same reply, never claim features the app doesn't have, and never promise launch dates beyond "January".

### Scheduling
- Check every time and date in a post against the day it goes out. Rerun the math if it moves.
- Alternate formats and themes across the week so the grid never shows two look-alike posts in a row.
- Run the check before a post goes into Buffer, not after.

## The check

Run the checker on every piece of copy before it ships: captions, slide text, scripts, story text and replies.

```bash
node .claude/skills/new-content-rules/scripts/lint.mjs <file-or-folder> [--format ig|tt|story|slide|carousel]
node .claude/skills/new-content-rules/scripts/lint.mjs slides.md --format carousel
node .claude/skills/new-content-rules/scripts/lint.mjs --text "the caption here" --format ig
node .claude/skills/new-content-rules/scripts/lint.mjs --manifest tools/carousels/manifest.json
node .claude/skills/new-content-rules/scripts/dst.mjs 2026-11-10 Europe/London   # next clock changes
```

It flags:
- banned phrases and AI vocabulary, contrast formulas, em dashes
- ALL CAPS runs and middle dots
- emoji on screen, or more than one in a caption
- hashtag count, and generic hashtags
- an Instagram first line that won't fit the feed preview
- slides over the word budget
- headlines that end in a period
- in carousel mode, a call to action before the last slide

Fix every `FAIL`. Fix each `WARN`, or keep it and say why.

The checker reads text only. For images and video, also run the repo's renderers, which enforce corners, italics, emoji and animation moves, and check these by eye:

- [ ] Does the hook name the situation or the payoff in the first frame or line?
- [ ] Is there exactly one ask, and is it the waitlist?
- [ ] Is every headline one colour, with no eyebrow and no period?
- [ ] Are there any pills, bordered boxes, divider lines, gradients or see-through colours?
- [ ] Are there 3 fonts or fewer, with no monospace labels?
- [ ] Is every number, time and clock-change date real and computed?
- [ ] Does it read at phone size, and with the sound off?
- [ ] Is the TikTok version clear of the right-side buttons and the bottom caption area?
- [ ] Is generated footage labelled?

When you report back, say which rules you checked and whether anything was waived, with the reason.
