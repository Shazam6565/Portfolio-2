# Design System Specification — "Ink on Paper"

This document defines the compulsory color scheme, typography, and core global styles for the application. Any new frontend development **MUST** strictly adhere to these specifications to maintain visual consistency.

The identity is **plain, minimal, monochrome**: black ink on white paper, hairline rules instead of shadows, system fonts, compact spacing, and almost no animation. Information density and readability come first; decoration is removed, not restyled.

## 1. Color Scheme

The entire palette is grayscale. There is **no accent color** — emphasis is achieved with contrast (black), weight, and underlines.

### Semantic Tokens (use these in new code)

| Variable           | Hex       | Description                                           |
| :----------------- | :-------- | :---------------------------------------------------- |
| `--bg`             | `#ffffff` | **Main background.** The page is white, always.       |
| `--surface`        | `#f6f6f6` | Subtle surface for code blocks, chips, table stripes. |
| `--line`           | `#e6e6e6` | Hairline borders and dividers (1px, never thicker).   |
| `--text`           | `#111111` | **Headings, links, emphasis.** Near-black ink.        |
| `--text-secondary` | `#4d4d4d` | Body text.                                            |
| `--text-muted`     | `#8a8a8a` | Meta text: dates, labels, tech tags.                  |
| `--accent`         | `#000000` | Interactive emphasis (hover, active). Pure black.     |

### Legacy Aliases

The old navy/green variable names are kept as aliases so existing components keep working. They map onto the grayscale palette:

| Legacy variable         | Now maps to                |
| :---------------------- | :------------------------- |
| `--navy`, `--dark-navy` | `#ffffff` (background)     |
| `--light-navy`          | `#f6f6f6` (surface)        |
| `--lightest-navy`       | `#e6e6e6` (lines)          |
| `--lightest-slate`      | `#111111` (headings)       |
| `--light-slate`         | `#333333`                  |
| `--slate`               | `#4d4d4d` (body)           |
| `--dark-slate`          | `#8a8a8a` (muted)          |
| `--white`               | `#000000` (max contrast)   |
| `--green`               | `#000000` (accent → black) |
| `--green-tint`          | `rgba(0, 0, 0, 0.04)`      |

**Do not introduce any new colors.** No green, no navy, no gradients, no shadows.

### Usage Rules

- **Backgrounds**: White everywhere. Use `--surface` only for code blocks and small chips — never for large card panels.
- **Separation**: Use 1px `--line` borders, generous-enough whitespace, or both. Never box-shadows.
- **Body text**: `--text-secondary` for paragraphs; `--text` for headings and strong emphasis.
- **Interactions**: Links are `--text` with an underline (`text-decoration-color: var(--line)` at rest, `var(--text)` on hover). Buttons are 1px black outlines that invert (black background, white text) on hover. No transforms, no glows, no lift effects.

---

## 2. Typography

### Font Families

| Variable      | Value                                                                                | Description                                                 |
| :------------ | :----------------------------------------------------------------------------------- | :---------------------------------------------------------- |
| `--font-sans` | `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif` | **Primary UI font.** System stack — no webfonts are loaded. |
| `--font-mono` | `ui-monospace, 'SF Mono', 'Fira Code', 'Roboto Mono', Menlo, monospace`              | Meta text, section labels, tech tags, code.                 |

### Font Sizes

| Variable       | Value  | Usage                              |
| :------------- | :----- | :--------------------------------- |
| `--fz-xxs`     | `12px` | Fine print                         |
| `--fz-xs`      | `13px` | Section labels, buttons, tech tags |
| `--fz-sm`      | `14px` | Meta text, dates, code             |
| `--fz-md`      | `16px` | **Base body size**                 |
| `--fz-lg`      | `18px` | Intro paragraphs                   |
| `--fz-xl`      | `20px` | Subheadings                        |
| `--fz-xxl`     | `22px` | Page titles (secondary pages)      |
| `--fz-heading` | `28px` | Main headings                      |

### Global Typography Rules

- **Body**: 16px, `line-height: 1.6`, color `--text-secondary`.
- **Headings**: `font-weight: 600`, color `--text`, `letter-spacing: -0.01em`. The hero name caps at `clamp(28px, 5vw, 44px)` — nothing on the site is larger.
- **Section labels** (`.numbered-heading`): small uppercase mono labels — `13px`, `letter-spacing: 0.15em`, color `--text-muted`. No counters, no decorative rules.
- **Links**: underlined with `text-underline-offset: 3px`; never color-only.

---

## 3. Layout & Spacing

Compact and narrow. The site is a single readable column.

- **Content measure**: `section { max-width: 720px }`; `main { max-width: 800px; padding: 120px 24px }`. Wide tables (archive) may locally widen.
- **Section rhythm**: `padding: 48px 0` (36px on mobile). No 100px+ gaps.
- **Nav height**: `64px` (56px after scroll).
- **Border radius**: `0` — everything is square.
- **Transitions**: `all 0.15s ease`, color/opacity only. No movement.

## 4. Motion

Almost none, deliberately:

- **No loader** — the page renders immediately.
- **No ScrollReveal** — `src/utils/sr.js` is a no-op; content is visible without scrolling tricks.
- **No hover transforms** — hover states change color/underline/background only.
- Mount fades (`fadeup`/`fadedown`) are opacity-only, 200ms.

## 5. Imagery & Iconography

- Photos render **grayscale at all times** (`filter: grayscale(100%)`), framed by a 1px `--line` border. No green frames, no blend modes, no hover reveals.
- Project cover images are not shown on the home page — projects are presented as text entries.
- Icons are minimal line icons inheriting `currentColor`. The logo is a plain text wordmark, not a graphic.

## 6. UI Elements

- **Buttons**: transparent background, `1px solid var(--text)` border, black text, mono font, square corners. Hover: solid black background, white text.
- **Tables**: hairline row separators (`border-bottom: 1px solid var(--line)`), no zebra panels, generous-but-tight cell padding.
- **Scrollbar**: thin, `--line` thumb on white.
- **Selection**: black background, white text.

---

## 7. CSS Variables Root

The canonical definition lives in `src/styles/variables.js`. Summary:

```css
:root {
  --bg: #ffffff;
  --surface: #f6f6f6;
  --line: #e6e6e6;
  --text: #111111;
  --text-secondary: #4d4d4d;
  --text-muted: #8a8a8a;
  --accent: #000000;

  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  --font-mono: ui-monospace, 'SF Mono', 'Fira Code', 'Roboto Mono', Menlo, monospace;

  --fz-xxs: 12px;
  --fz-xs: 13px;
  --fz-sm: 14px;
  --fz-md: 16px;
  --fz-lg: 18px;
  --fz-xl: 20px;
  --fz-xxl: 22px;
  --fz-heading: 28px;

  --border-radius: 0px;
  --nav-height: 64px;
  --transition: all 0.15s ease;
}
```
