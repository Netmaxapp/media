# Instagram skills (ig-*)

The 13 `ig-*` folders are copied from
[Jakeschincariol/instagram-agent-skill](https://github.com/Jakeschincariol/instagram-agent-skill)
at commit `d03c56b` (MIT license, copied into each folder).

**One local change:** the skills originally read and write
`~/.claude/instagram/` (voice, swipe file, plan, log). Cloud sessions wipe the
home folder, so every SKILL.md here points at `.claude/instagram/` in this
repo instead. Update by re-copying from upstream and re-applying that path change.

**Our rules still win.** `CONTENT_RULES.md` and `VIDEO_STYLE.md` override
anything these skills suggest. For example, carousels are still rendered by
`tools/carousels/render.mjs`, not by `ig-carousel`.

Most useful here:
- `/ig-reel`: hook options, scored (`hookscore.py`), plus a timed beat sheet (`beats.py`).
- `/ig-caption`: shows what the feed displays before "... more" (`caption.py`).
- `/ig-human`: humanizer and a 5-check score (`humanize.py`, `detect.py`).
- `/ig-viral`, `/ig-audit`, `/ig-profile`, `/ig-plan`.
