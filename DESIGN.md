# Design

The design system behind vikky2810.github.io, written from the current UI. Use it when adding or changing a page so new work matches what is already there.

Source of truth: `styles/style.css` (homepage), `styles/blog-list.css` (shared post list), `styles/blog-index.css` (`/blog/`), `styles/post.css` (post pages), `styles/not-found.css` (404), `styles/fonts.css`. If this file and the CSS disagree, the CSS wins; update this file.

## Character

A dark, quiet, single-column portfolio that reads like a drafting sheet. Black background, white and grey type, hairline rules instead of cards, and one dashed frame around the content column. Colour is rare and means something:

- **Teal** is the interactive colour: links, hover states, focus on controls.
- **Amber** marks "now" and "selected": the current job, text selection, blog titles on hover.
- **Brand colours** of each technology appear only on hover in the Skills grid.

Rules of thumb:

- Lists and rows, not cards. Separate items with 1px rules.
- One column, 760px wide, left-aligned. Nothing centred except the 404 page and post headers.
- Motion is small and slow, and every animation has a `prefers-reduced-motion` fallback.
- Hover-only details (read time, link previews, brand colours) degrade on touch screens via `@media (hover: none)`.

## Colour

All tokens live on `:root` in `styles/style.css`. `styles/blog-index.css` repeats the same values; keep them in sync.

### Surfaces

| Token | Value | Use |
|---|---|---|
| `--bg-primary` | `#000000` | Page background, skill cells, timeline nodes |
| `--bg-secondary` | `#0a0a0a` | Code blocks |
| `--bg-tertiary` | `#171717` | Raised controls (show-all button, link preview card, image placeholders) |
| `--bg-nav` | `rgba(0,0,0,0.72)` | Sticky nav, under a `blur(12px) saturate(140%)` backdrop |

### Text

| Token | Value | Use |
|---|---|---|
| `--text-primary` | `#ffffff` | Headings, names, titles, active nav link |
| `--text-secondary` | `#a3a3a3` | Body copy, `<p>`, links at rest |
| `--text-muted` | `#7a7a7a` | Dates, counts, captions, locations. 4.9:1 on black, the lowest contrast allowed |

### Lines

| Token | Value | Use |
|---|---|---|
| `--border-color` | `rgba(64,64,64,0.5)` | Row separators, pills, avatar ring |
| `--border-hover` | `rgba(115,115,115,0.8)` | Timeline nodes at rest, link preview card, underline colour |
| `--dash` / `--rule` | `rgba(255,255,255,0.14)` | Drafting frame, timeline rail, skills grid, blog list rules |

### Colour accents

| Token | Value | Meaning |
|---|---|---|
| `--primary-color` | `#14b8a6` teal | Hover and interactive state |
| `--secondary-color` | `#06b6d4` cyan | Second hover step (email link hover only) |
| `--accent-color` | `#f59e0b` amber | Current, selected, highlighted |
| `--gradient-brand` | teal → cyan, 135° | Nav link underline |
| `--brand` (per skill) | each tech's logo colour | Skills grid hover only |

Tints are built from the accent at low alpha, for example `rgba(20,184,166,0.1)` behind the copy-email button on hover, or amber at `0.12` fill with a `0.3` border for the "Current" badge (badge text `#fbbf24`). Use `color-mix(in srgb, var(--brand) 7%, var(--bg-primary))` for brand-tinted backgrounds.

Text selection is amber with black text (`::selection`), including on the gradient-clipped name.

The only light surface on the site is the 404 page: amber background, black text, Hanken Grotesk.

## Typography

| Family | Where | Notes |
|---|---|---|
| Inter (variable, 300–800) | Everything | Self-hosted in `/src/fonts`, `font-display: swap`. Stack: `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` |
| Hanken Grotesk | 404 page only | |
| Caveat | The handwritten "follow me" note only | Rotated -8° |
| `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` | Code blocks in posts | |

Body line-height is 1.6; long-form copy (About, contact lead, posts) uses 1.7.

### Scale

| Role | Size | Weight | Extra |
|---|---|---|---|
| Profile name | 2rem (1.6rem ≤768px) | 800 | `letter-spacing: -0.02em`, line-height 1.15, silver shimmer |
| Post title (h1) | 2.25rem (1.75rem ≤600px) | — | `letter-spacing: -0.02em`, line-height 1.2 |
| Section heading `.section-heading` | 1.5rem | 700 | `letter-spacing: -0.01em`, 1.5rem below |
| Row title (role, project) | 1.05rem | 700 | |
| Body | 1rem | 400 | `--text-secondary` |
| Subtitle | 0.95rem (0.85rem ≤768px) | 500 | |
| Blog entry title | 0.975rem | 500 | |
| Secondary row text | 0.9rem | 400 | descriptions, bullets, links |
| Meta | 0.8–0.85rem | 400–600 | dates, counts, locations; `--text-muted` |
| Tag / badge | 0.7–0.72rem | 600 | pill shape |
| Nav links | 0.65rem | 500 | |

Use `font-variant-numeric: tabular-nums` on anything with numbers in a column (dates, counts, years). Cap prose at 62ch (`.exp-points`) or 620–640px (bio, contact lead).

## Layout

- **Column:** 760px max, `margin: 0 auto`. Side padding 2rem, 1.5rem at ≤768px. The nav content aligns to the same column.
- **Post pages** use an 800px column with 2rem padding.
- **Drafting frame** (`main.framed`): dashed vertical rules (6px dash, 6px gap) on both edges of the 760px column, a dashed horizontal rule between sections, and a 15px plus mark where they cross. A hatched patch (`repeating-linear-gradient(315deg, …)` at 10px) fills the nav bar to the left of the column. The frame hides at ≤840px and leaves only a plain divider.
- **Section rhythm:** each section after the first gets a 2.5rem spacer above it (1.5rem at ≤768px) and no top padding of its own. Sections end with about 3rem of bottom padding, so the gap is even everywhere.
- **Nav:** sticky, 56px tall, translucent black with blur, 1px bottom border. Horizontal links on every screen size; the hamburger menu is disabled.
- **Bottom scroll fade:** a fixed 80px strip of stacked backdrop blurs (0.5px doubling to 8px+) that fades content into the bottom edge. Hidden once the footer scrolls into view.

### Breakpoints

| Width | Change |
|---|---|
| ≥1000px | Follow note hangs in the left gutter beside the social icons |
| ≤840px | Drafting frame and nav hatching hidden |
| ≤768px | Tighter padding, smaller avatar (72px) and name, blog rows stack |
| ≤600px | Timeline dates move above the role; skills grid goes to 2 columns with the label on top; post titles shrink; blog read time hidden |

## Shape and depth

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 0.5rem | |
| `--radius-md` | 0.75rem | Buttons, thumbnails, link preview card |
| `--radius-lg` | 1rem | Code blocks |
| `--radius-xl` | 1.5rem | |
| `--radius-full` | 9999px | Avatar, pills, tags, badges |

The layout is flat. Shadows (`--shadow-sm` to `--shadow-xl`) are used only on floating elements: the link preview card uses `--shadow-xl`. Do not add shadows or glows to rows or sections.

## Motion

| Token | Value |
|---|---|
| `--transition-fast` | `0.2s cubic-bezier(0.4, 0, 0.2, 1)` — colour and background changes |
| `--transition-normal` | `0.4s cubic-bezier(0.4, 0, 0.2, 1)` — underlines, bars drawing in |

Named motion:

- **Name shimmer:** a silver glint sweeps across the profile name over 2.4s, then rests 4s (6.4s cycle).
- **Current-role pulse:** the amber timeline node pulses a ring every 2s.
- **Scroll reveal:** `.reveal` elements rise 16px and fade in over 0.6s, staggered 70ms by `--i`. JS adds `.reveal` only when motion is allowed, so content is never hidden without it.
- **Link preview:** the card scales from 0.6 with a slight overshoot (`cubic-bezier(0.34, 1.56, 0.64, 1)`, 0.45s).
- **Small nudges:** social icons lift 2px on hover; blog arrow shifts 3px; contact rows indent 0.5rem.

Every one of these is turned off or reduced to a plain fade under `prefers-reduced-motion: reduce`.

## Components

### Profile header (`#profile`)
96px round avatar with a 2px border, name with shimmer, subtitle items separated by muted dots, email in teal with a copy button, bio, then the social row: icons in `--text-secondary` turning teal on hover, plus a "Resume" pill (1px border, full radius, teal border and text on hover).

### Section heading (`.section-heading`)
Plain `h2`, 1.5rem/700, white. No eyebrow, no underline, no icon.

### Experience timeline (`.exp-list`)
Three-column grid: dates (right-aligned, start in white 0.9rem/600, end muted), a dashed rail with an 11px ring node, and the role body. The node turns teal on row hover. The current role gets a filled amber node with the pulse, an amber "Current" pill next to the title, and amber bullet dashes. Bullets are 0.45rem horizontal lines, not dots. The organisation is underlined in `--border-hover`, turning teal on hover.

### Skills sheet (`.skills-sheet`)
A ruled spec sheet. Each group is a row: label and count on the left (10rem, right border), a grid of cells on the right (`auto-fill, minmax(8.25rem, 1fr)`). Cells are 3rem tall with a monochrome logo and name. On hover the logo takes its brand colour, a 2px brand bar draws in along the top, and the background tints 7% toward the brand. Empty space at the end of a row shows the hatch pattern. On touch screens logos show their brand colour at rest.

### Project row (`.project-row`)
Title (1.05rem/700) with Code and Live links on the right, optional 16:10 screenshot thumbnail (1px border, `--radius-md`), description, then tag pills (0.72rem/600, 1px border). Rows split by `--border-color` rules, the last row has none.

### Blog list (`.blog-list`, shared by homepage and `/blog/`)
One line per post: title left, read time and date right, `--rule` hairlines between. Dates sit in a fixed 3.25rem column so they line up. On hover the title turns amber and the read time fades in. Focus shows a 1px amber outline at 4px offset. On `/blog/` the posts are grouped under a muted year label. "All posts" is an underlined text link that turns amber.

### Contact rows (`.contact-link-row`)
Label with icon (0.95rem/600, white) left, value right. Hover indents the row 0.5rem and turns the value teal.

### Buttons
- **Pill** (`.resume-pill`): transparent, 1px border, full radius, 0.85rem/600.
- **Block** (`.showall-btn`): `--bg-tertiary` fill, 1px border, `--radius-md`, 0.9rem/600.
- Both switch border and text to teal on hover. There is no filled teal button.

### Inline link preview (`.link-preview`)
Tech names in the bio are white with a translucent teal underline. Hovering floats a 248px card with a 240×150 site screenshot above the word. Hidden on touch screens.

### Code blocks (posts)
`--bg-secondary` fill, 1px border, `--radius-lg`, 1.5rem padding, monospace 0.9rem at 1.65 line-height. A small "Copy" button sits top right and turns green (`#22c55e`) after copying.

### Footer
1px top border, 760px inner row: name in bold white on the left, muted 0.85rem copyright on the right.

## Accessibility

- Skip link, hidden until focused, with a teal border.
- `--text-muted` is the contrast floor (4.9:1); don't go dimmer for real text.
- Visible focus on every interactive element; hover styles are mirrored on `:focus-visible`.
- Hover-only information is never the only way to reach content.
- Fallbacks for missing `backdrop-filter` (opaque nav) and `mask-image` (simpler scroll fade).

## Adding something new

1. Put it in the 760px column and start it with a `.section-heading`.
2. Build it from rows and 1px rules, not cards.
3. Use existing tokens; don't add a new hex value without adding a token.
4. Teal for hover, amber for "current or selected", nothing else in colour.
5. Add a reduced-motion rule for any animation and a `hover: none` rule for any hover-only detail.
6. Check it at 360px, 600px, 768px and desktop.
