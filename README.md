# NET-MAX media

Finished post images for @networkingmaxxing (Instagram) and @netmaxapp (TikTok). Buffer schedules them from raw GitHub URLs.

## Layout

- `YYYY-MM-DD/` holds everything that posts on that date.
  - `NET-MAX_carousel_<slug>_ig_NN.jpg`: Instagram, 1080×1350
  - `NET-MAX_carousel_<slug>_tt_NN.jpg`: TikTok photo mode, 1080×1920, with text kept clear of TikTok's buttons and caption area
  - `NET-MAX_video_<slug>.mp4`: 9:16 video for Reels and TikTok
- `CONTENT_RULES.md` is the checklist every post goes through before it ships. Its six editing rules come first.
- `VIDEO_STYLE.md` is the video editing style guide: captions, fonts, the set of animation moves, corners, pacing and engagement.
- `tools/carousels/` is the source for the carousels:
  - `content.mjs`: all slide copy, captions, alt text and each carousel's `theme`. Every time and date is computed from the tz database and checked.
  - `styles.css`: the shared layout plus one theme per carousel (night, paper, airmail, chat, tier, green, notebook, harvest).
  - `render.mjs`: lints the copy against the rules, renders both formats with Playwright, and writes `manifest.json` (paths, alt text, captions).
- `tools/videos/` is the source for the motion-graphic videos (9:16, 15 s):
  - `BRIEFS.md`: a brief and routing decision for every video (motion graphics, film it, or generative B-roll), plus the prompts for the new "same minute, four cities" video.
  - `scenes.mjs` + `render.mjs`: frame-by-frame renderer that encodes H.264 with the music bed. Times are computed and checked like the carousels.
  - `four-cities/build.mjs`: overlays and assembly for the generative-B-roll video. Drop the clips in `four-cities/clips/` and run it.

## Re-rendering

```sh
cd tools/carousels
node render.mjs                         # everything
node render.mjs --only 5-texts --fmt ig # one carousel, one format
```

The build fails if a time in the copy disagrees with the tz math, or if the copy breaks a rule in `CONTENT_RULES.md`.

Map data: Natural Earth (public domain). Fonts (all SIL OFL, licenses in `tools/carousels/fonts`): Bricolage Grotesque, Inter and Fraunces. Three families, per Hallmark.
