# EYFI Challenge — Leaderboard Design

A working interactive prototype for the leaderboard page: ranks EYFI Challenge participants by how much they've earned.

## How to view it

Open `eyfi-leaderboard.html` directly in any browser — double-click the file, or drag it into a browser tab. No install, no build step, no server needed. Everything (data, styling, interactivity) is self-contained in that one file.

## Design grounding

Before designing, I looked at eyfichallenge.com and the ambassador site to pull real brand cues rather than inventing a new look:

- **Palette** — near-black background (`#0A0A0A`, matching their site's own theme color), a lime-green accent (used across their trophy icon and challenge art), and a warm orange secondary (from the ambassador-program logo).
- **Motif** — the ₹ symbol shows up as background texture on EYFI's homepage; I reused that as a faint watermark field here.
- **Voice** — their testimonials are casual, first-person, hustle-specific ("sold homemade jewellery," "tutored kids"). That's why the leaderboard surfaces each person's hustle category as a tag rather than just a number.

## Why it's built this way

The target audience checks payment-app feeds (PhonePe, GPay) daily, so the leaderboard borrows that visual grammar instead of looking like a generic ranked table:

- **Live ticker** at the top — a scrolling "X just earned ₹Y" strip, so the page feels active even before scrolling.
- **Podium spotlight** for the top 3, with #1 getting the only extra visual weight (bigger avatar, subtle glow) — deliberately restrained so it doesn't turn into a cluttered trophy shelf.
- **Category chips** (Freelance, Reselling, Tutoring, Content, Handmade, Services) — since EYFI explicitly celebrates any kind of hustle, filtering by category makes the board feel personal, not just a money ranking.
- **Rank-delta arrows (▲/▼) and streak flames (🔥)** — small, low-effort feedback that rewards checking back.
- **Search bar** — the obvious "find yourself" moment. A "You" entry is seeded mid-pack in the mock data to make that moment work in a demo/recording.
- **Time-range tabs** (Today / This week / All-time) — rescale the numbers so switching between them feels meaningfully different.

## Known placeholders

- Student names and colleges are placeholders (drawn from names featured on EYFI's own ambassador page) — swap in real or better mock data if useful.
- "Day 18/30" in the header is a stand-in for wherever a live cohort would actually be in the challenge.
- All earnings figures are randomly seeded mock data, not real numbers.
