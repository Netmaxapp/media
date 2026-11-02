# Video briefs

Written with the ai-video skill's BRIEF framework: **B**rief the job, **R**oute by fit, **I**terate cheaply, **E**dit and assemble, **F**inalize and disclose.

Every edit follows the six editing rules in `CONTENT_RULES.md` and the specs in `VIDEO_STYLE.md`. On Nov 2 the three motion videos were re-cut to match them: a cut-first set of moves, no pop, square panels, and the typed text filling in 3 words at a time.

Brand inputs come from `CONTENT_RULES.md` (voice and design) and the carousel themes in `tools/carousels/styles.css`. There is no separate brand profile. Briefs never name a vendor; tools are picked at routing time and can be swapped out.

| # | Video | Job | Route | Status |
|---|---|---|---|---|
| 1 | Nov 2 · Friends you make abroad, as a 2×2 | Kinetic type / diagram | Motion graphics from code | Remade · in Buffer |
| 2 | Nov 6 · Contacts → clocks | Kinetic type / data | Motion graphics from code | Remade · in Buffer |
| 3 | Nov 8 · "Which green" skit | Filmed comedy | **Film it** (already filmed) | Kept as is · not in Buffer yet |
| 4 | Nov 13 · Conference math | Kinetic type / counter | Motion graphics from code | Remade · not in Buffer yet |
| 5 | New · Same minute, four cities | Generative B-roll + 1 filmed shot | Generative video for the places we can't film | Kit ready · needs 3 generated clips + 1 phone clip |

## How we route

- **Exact text, numbers, times or diagrams on screen → motion graphics rendered from code** (`render.mjs`). Generative video models garble on-screen text, and they would invent NET-MAX app screens that don't exist yet. That's misleading, so we don't do it.
- **Us, our laptop, our campus → film it.** Real footage of real things beats a generated version every time (the skit proves it).
- **Places and moments we can't film → generative B-roll.** Keep it to short cutaways and label it.
- **Never:** Sora (discontinued, don't build on it). No avatars or synthetic voices of real people. No generated "screenshots" of the app.

---

## 1. Nov 2 · Friends you make abroad, as a 2×2 · remade

```
JOB:      kinetic type / diagram, 15 s, 9:16
SUBJECT:  a 2×2 drawn on graph paper. Axes: lives nearby → 9 time zones away;
          replies in minutes → replies in months. One friend type drops into each quadrant:
          the one you see every week / the 4 a.m. voice note friend /
          lives 20 minutes away (last seen: 2024) / "we should totally visit" (said every year since 2021)
END CARD: "Keep all four." NET-MAX puts everyone you know on one map. Coming to iOS in January.
LOOK:     graph-paper theme, black ink, green highlighter. No glow, no globe.
AUDIO:    existing music bed (see Music)
ROUTE:    motion graphics → render.mjs (scene: friends-abroad-2x2)
DISCLOSE: no synthetic footage, so no AI label needed
```
**Changed from the original:** removed the glowing-globe wallpaper and the "actually" in "the one you actually see". "4-quadrant matrix" is now "2×2", and the axes draw on so the joke builds one quadrant at a time.

## 2. Nov 6 · Contacts → clocks · remade

```
JOB:      kinetic type / data, 15 s, 9:16
SUBJECT:  "Your contacts app, honestly:" a list of real-feeling contact names
          (Alex (conference?), Maria Madrid?, J. from the hostel, Daniel ???), mostly "last texted: never".
          The right column swaps to each person's city and local time at 7 p.m. Indianapolis,
          with awake/asleep dots. "4 of them are awake right now." "still no idea who Daniel is"
END CARD: "Everyone you know, with a city and a clock." NET-MAX is coming to iOS in January.
LOOK:     night theme, flat, no glow
ROUTE:    motion graphics → render.mjs (scene: contacts-to-clocks). Times computed, build fails if wrong.
DISCLOSE: none needed
```
**Changed from the original:** dropped the "Your network isn't a list. It's a map." contrast formula. It now shows the same people, transformed in place, with times that are true for the moment the post goes out.

## 3. Nov 8 · "Which green" skit · kept

```
JOB:      filmed comedy, 6.7 s
ROUTE:    film it. Real laptop, real color picker, real joke about using Claude.
```
It's already the right route: real, self-aware and honest about using AI. Keep it. It isn't scheduled in Buffer yet. Post `NET-MAX_skit_which-green_music.mp4` on Instagram, or the silent cut on TikTok with a trending sound added in-app.

## 4. Nov 13 · Conference math · remade

```
JOB:      kinetic type / counter, 15 s, 9:16
SUBJECT:  "Conference math": 1 conference, 47 new contacts (counts up), 0 follow-ups.
          "Fix the zero tonight." A text types out: "hi priya! sam from the career fair,
          the coffee line one. could i buy you a coffee in chicago over break?" Delivered.
          "1 down. 46 to go."
END CARD: NET-MAX · "Remembers where you met." Coming to iOS in January.
LOOK:     charcoal + brand green. Pairs with the Nov 5 follow-up carousel.
ROUTE:    motion graphics → render.mjs (scene: conference-math)
```
**Changed from the original:** cut the "One trip. A real network." slogan. The video now ends on the action (sending the text) instead of a tagline.

---

## 5. New · Same minute, four cities

The one job in this batch that needs generative video: showing what 7 p.m. in Indianapolis looks like for friends in cities we can't film.

```
JOB:      generative B-roll (3 × 3 s cutaways) + 1 filmed shot + computed overlays + end card. 15 s, 9:16
SUBJECT:  the same minute in four places.
          Indianapolis 7:00 PM (you) → Madrid 1:00 AM, asleep → Tokyo 9:00 AM tomorrow, awake →
          Sydney 11:00 AM tomorrow, awake → "2 of your 3 friends can reply right now."
AUDIO:    native ambience per shot (night street hum, crosswalk chirp, harbour water),
          music bed underneath at low volume
BRAND:    overlays in the night theme. Footage stays natural: no neon grading, no glow.
ROUTE:    generative → strongest current model with native ambient audio and 9:16 output
          (as of this quarter: Veo 3.1; backup Kling 3.0). Concept-test each prompt on a
          fast/cheap model first. Prompt craft: veo-3 / kling skills. Re-check the tool choice quarterly.
DISCLOSE: "AI-GENERATED FOOTAGE" tag burned into each generated shot (the overlays add it),
          a line in the caption, and the platform AI label (TikTok AI-generated content toggle;
          Instagram AI label; Buffer's "AI generated" flag on the post).
RIGHTS:   generic streets only. No recognizable people, no landmarks, no logos, no readable signs.
```

**Valid dates:** the times hold for posts from **Nov 1, 2026 to Mar 13, 2027**. US clocks change on Mar 14 and the times shift. To post later, run `node build.mjs --date YYYY-MM-DD` and the overlays and end card recompute.

### Shot 1 · Indianapolis, 7:00 PM · film it (don't generate)
Sunset in Indianapolis is around 5:30 p.m. in November, so 7 p.m. is fully dark. Film 4–5 s on a phone, vertical:
your hand holding your phone with the lock screen showing 7:00, with campus or your street at night behind it. Hold steady, let the background stay a little soft, and keep the natural sound.
That's real proof the time is real, and it's the only shot that should be "you".

### Shot 2 · Madrid, 1:00 AM · generate
```
SUBJECT/ACTION/SETTING: a narrow residential street in central Madrid after midnight. Cafés closed
  with metal roll-down shutters, wrought-iron balconies, two or three lit windows, one parked moped,
  a café awning moving slightly in the breeze. No people.
LIGHT/MOOD: warm sodium streetlights against a deep blue night sky. Quiet, still, late.
CAMERA: slow push-in at eye level, smooth and stabilized, single continuous shot.
ASPECT/DURATION: vertical 9:16, 4 seconds (we use 3).
AUDIO: native ambience only: distant traffic hum, faint wind. No music, no voices.
AVOID: readable signs, logos, brand names, faces, any on-screen text.
```

### Shot 3 · Tokyo, 9:00 AM · generate
```
SUBJECT/ACTION/SETTING: a Tokyo side-street crosswalk on a weekday morning. Commuters in work clothes
  cross at mid-distance, seen from behind or side-on; a commuter train passes on an elevated track
  in the background.
LIGHT/MOOD: soft overcast morning light, cool tones, busy but calm.
CAMERA: static wide shot at standing height, locked off.
ASPECT/DURATION: vertical 9:16, 4 seconds.
AUDIO: native ambience: crosswalk signal chirp, footsteps, the train passing. No music, no voices.
AVOID: readable signs, logos, recognizable faces, any on-screen text.
```

### Shot 4 · Sydney, 11:00 AM · generate
```
SUBJECT/ACTION/SETTING: a harbourside walkway on a sunny late morning. A small commuter ferry pulls
  away from a wooden wharf, a jogger far in the background, eucalyptus trees, bright blue water.
LIGHT/MOOD: high sun, crisp and bright, relaxed.
CAMERA: slow pan left following the ferry, smooth.
ASPECT/DURATION: vertical 9:16, 4 seconds.
AUDIO: native ambience: water lapping, gulls, a faint ferry horn. No music, no voices.
AVOID: the Opera House, the Harbour Bridge or any landmark; logos; readable text; recognizable faces.
```

### Iterate, then assemble
1. Run each prompt 3–4 times on a fast/cheap model and keep the best composition. Then do the final take on the quality model. Judge by how many takes are usable, not by the vendor's demo reel.
2. Reject any take with garbled signage, warped faces or a landmark. Re-roll those rather than fixing them in edit.
3. Save the clips as `four-cities/clips/indianapolis.mp4`, `madrid.mp4`, `tokyo.mp4` and `sydney.mp4`. Any aspect ratio or length works; the script crops them to 9:16 and uses the first 3 seconds.
4. Run `cd tools/videos/four-cities && node build.mjs --music ../audio/music-bed.m4a`. That produces `NET-MAX_video_four-cities.mp4` (15 s). Watch it once with sound before scheduling.

### Caption drafts
- **Instagram:** "7 p.m. in Indianapolis is 1 a.m. in Madrid, 9 a.m. tomorrow in Tokyo and 11 a.m. tomorrow in Sydney. The city shots are AI-generated. The times are real. NET-MAX launches in January. Waitlist link in bio. #timezones #studyabroad #longdistancefriends"
- **TikTok:** "what 7 p.m. in indiana looks like for your friends abroad. city shots are AI-generated, times are real. NET-MAX waitlist link is in our Instagram bio #timezones #studyabroad #longdistancefriends"

---

## Music

All three original motion videos used the **same** music bed, and the remakes reuse it (`audio/music-bed.m4a`) so nothing changes legally. Using the same track on every post is a sameness signal, though. Rotate in a few licensed or royalty-free beds, or post natively and pick a trending sound in-app when it matters.

## Re-rendering

```sh
cd tools/videos
node render.mjs                              # all three motion videos -> date folders
node render.mjs --only conference-math       # one video
node render.mjs --stills 0.5,3,6,9,12,14     # review frames only, no encode
```
The build fails if a time in a scene disagrees with the time zone math (the same checks the carousels use).
