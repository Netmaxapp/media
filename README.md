# NET-MAX media

Finished post images for @networkingmaxxing (Instagram) and @netmaxapp (TikTok). Buffer schedules them from raw GitHub URLs.

## Layout

- `YYYY-MM-DD/` holds everything that posts on that date.
  - `NET-MAX_carousel_<slug>_ig_NN.jpg`: Instagram, 1080×1350
  - `NET-MAX_carousel_<slug>_tt_NN.jpg`: TikTok photo mode, 1080×1920, with text kept clear of TikTok's buttons and caption area
- `CONTENT_RULES.md` is the checklist every post goes through before it ships.
- `tools/carousels/` is the source for the carousels:
  - `content.mjs`: all slide copy, captions and alt text. Every time and date is computed from the tz database and checked.
  - `render.mjs`: lints the copy against the rules, renders both formats with Playwright, and writes `manifest.json` (paths, alt text, captions).

## Re-rendering

```sh
cd tools/carousels
node render.mjs                         # everything
node render.mjs --only 5-texts --fmt ig # one carousel, one format
```

The build fails if a time in the copy disagrees with the tz math, or if the copy breaks a rule in `CONTENT_RULES.md`.

Map data: Natural Earth (public domain). Fonts: Bricolage Grotesque, Poppins (SIL OFL), Inter, JetBrains Mono.
