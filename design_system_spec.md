# Design System Specification

This document defines the compulsory color scheme, typography, and core global styles for the application. Any new frontend development **MUST** strictly adhere to these specifications to maintain visual consistency.

## 1. Color Scheme

### Primary Backgrounds

| Variable          | Hex                    | Description                                                                   |
| :---------------- | :--------------------- | :---------------------------------------------------------------------------- |
| `--navy`          | `#0a192f`              | **Main Background Color**. Used for the `body` and primary containers.        |
| `--light-navy`    | `#112240`              | Lighter background for cards, headers, or secondary sections.                 |
| `--lightest-navy` | `#233554`              | Even lighter background, often used for hover states or tertiary backgrounds. |
| `--dark-navy`     | `#020c1b`              | Deep background, can be used for footers or high-contrast areas.              |
| `--navy-shadow`   | `rgba(2, 12, 27, 0.7)` | Shadow color for depth.                                                       |

### Text & Content

| Variable           | Hex       | Description                                                              |
| :----------------- | :-------- | :----------------------------------------------------------------------- |
| `--slate`          | `#8892b0` | **Primary Body Text**. Used for standard paragraphs and generic content. |
| `--light-slate`    | `#a8b2d1` | Lighter text, often used for secondary info or inactive states.          |
| `--lightest-slate` | `#ccd6f6` | **Headings & Highlights**. Used for `h1`-`h6` and emphasized text.       |
| `--dark-slate`     | `#495670` | Darker text, used for subtitles or lower-contrast elements.              |
| `--white`          | `#e6f1ff` | Purest white used for extremely high contrast text or accents.           |

### Accents

| Variable       | Hex                        | Description                                                                 |
| :------------- | :------------------------- | :-------------------------------------------------------------------------- |
| `--green`      | `#64ffda`                  | **Primary Accent**. Used for links, buttons, active states, and highlights. |
| `--green-tint` | `rgba(100, 255, 218, 0.1)` | Tint for hover backgrounds on green interaction elements.                   |
| `--pink`       | `#f57dff`                  | Secondary accent.                                                           |
| `--blue`       | `#57cbff`                  | Tertiary accent.                                                            |

### Usage Rules

- **Backgrounds**: Always use `--navy` as the default canvas. Use `--light-navy` to elevate card-like elements.
- **Reading Text**: Use `--slate` for long-form text to reduce eye strain.
- **Headings**: Use `--lightest-slate` to make titles pop against the dark background.
- **Interactions**: All interactive elements (links, buttons) should utilize `--green` for their primary state and `--green-tint` for hover backgrounds.

---

## 2. Typography

### Font Families

| Variable      | Value                                                                                      | Description                                                                                     |
| :------------ | :----------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------- |
| `--font-sans` | `'Calibre', 'Inter', 'San Francisco', 'SF Pro Text', -apple-system, system-ui, sans-serif` | **Primary UI Font**. Used for headings, body text, and general interface elements.              |
| `--font-mono` | `'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace`                            | **Code & Data Font**. Used for code blocks, number counters in headings, and technical details. |

### Font Sizes

| Variable       | Value  | Usage                             |
| :------------- | :----- | :-------------------------------- |
| `--fz-xxs`     | `12px` | Meta text, breadcrumbs            |
| `--fz-xs`      | `13px` | Small labels                      |
| `--fz-sm`      | `14px` | Secondary text, code snippets     |
| `--fz-md`      | `16px` | **Base Body Size**                |
| `--fz-lg`      | `18px` | Large body text, Intro paragraphs |
| `--fz-xl`      | `20px` | Subtitles                         |
| `--fz-xxl`     | `22px` | Section headers                   |
| `--fz-heading` | `32px` | Main Page Titles                  |

### Global Typography Rules

- **Line Height**: Default is `1.3`.
- **Headings**: `h1` through `h6` use `font-weight: 600` and `color: var(--lightest-slate)`.
- **Links**: `text-decoration: none`. Color inherits from parent. Hover state turns `color: var(--green)`.

---

## 3. Global Styles & UI Elements

### Layout & Spacing

- **Border Radius**: `--border-radius: 4px` standard on buttons and cards.
- **Transitions**: `--transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1)`. Use this for all hover effects to maintain the "smooth" feel.

### Buttons & Links

- **Primary Button**: Transparent background, `--green` border, `--green` text.
- **Hover State**: `--green-tint` background.
- **Inline Links**: Standard text color with a `--green` hover state.

### Scrollbars

Custom scrollbars are enforced to match the dark theme:

```css
html {
  scrollbar-width: thin;
  scrollbar-color: var(--dark-slate) var(--navy);
}
::-webkit-scrollbar {
  width: 12px;
}
::-webkit-scrollbar-track {
  background: var(--navy);
}
::-webkit-scrollbar-thumb {
  background-color: var(--dark-slate);
  border: 3px solid var(--navy);
  border-radius: 10px;
}
```

### Selection Style

- **Background**: `--lightest-navy`
- **Text Color**: `--lightest-slate`

---

## 4. Implementation Snippets

### CSS Variables Root

Copy this into your CSS variables definition file:

```css
:root {
  --dark-navy: #020c1b;
  --navy: #0a192f;
  --light-navy: #112240;
  --lightest-navy: #233554;
  --navy-shadow: rgba(2, 12, 27, 0.7);
  --dark-slate: #495670;
  --slate: #8892b0;
  --light-slate: #a8b2d1;
  --lightest-slate: #ccd6f6;
  --white: #e6f1ff;
  --green: #64ffda;
  --green-tint: rgba(100, 255, 218, 0.1);
  --pink: #f57dff;
  --blue: #57cbff;

  --font-sans: 'Calibre', 'Inter', 'San Francisco', 'SF Pro Text', -apple-system, system-ui, sans-serif;
  --font-mono: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;

  --fz-xxs: 12px;
  --fz-xs: 13px;
  --fz-sm: 14px;
  --fz-md: 16px;
  --fz-lg: 18px;
  --fz-xl: 20px;
  --fz-xxl: 22px;
  --fz-heading: 32px;

  --border-radius: 4px;
  --transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
}
```
