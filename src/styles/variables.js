import { css } from 'styled-components';

const variables = css`
  :root {
    /* ---- Semantic tokens (source of truth) — light / "day" ---- */
    --bg: #ffffff;
    --surface: #f4f4f2;
    --line: #e2e2de;
    --text: #14130f;
    --text-secondary: #4a4843;
    --text-muted: #8a877f;
    --accent: #14130f;

    /* ---- Legacy aliases — resolve through the semantic tokens so a
       single dark override below re-themes the entire site. ---- */
    --dark-navy: var(--bg);
    --navy: var(--bg);
    --light-navy: var(--surface);
    --lightest-navy: var(--line);
    --navy-shadow: rgba(0, 0, 0, 0.06);
    --dark-slate: var(--text-muted);
    --slate: var(--text-secondary);
    --light-slate: var(--text-secondary);
    --lightest-slate: var(--text);
    --white: var(--text);
    --green: var(--accent);
    --green-tint: rgba(20, 19, 15, 0.05);
    --pink: var(--text);
    --blue: var(--text);

    /* ---- Type ---- */
    --font-serif: 'EB Garamond', Georgia, 'Times New Roman', Times, serif;
    --font-sans: var(--font-serif);
    --font-mono: ui-monospace, 'SF Mono', 'Fira Code', 'Roboto Mono', Menlo, monospace;

    --fz-xxs: 12px;
    --fz-xs: 13px;
    --fz-sm: 15px;
    --fz-md: 17px;
    --fz-lg: 19px;
    --fz-xl: 21px;
    --fz-xxl: 24px;
    --fz-heading: 30px;

    --border-radius: 0px;
    --nav-height: 64px;
    --nav-scroll-height: 56px;

    --tab-height: 42px;
    --tab-width: 120px;

    --easing: ease;
    --transition: all 0.18s ease;

    --hamburger-width: 24px;

    --ham-before: top 0.1s ease-in 0.25s, opacity 0.1s ease-in;
    --ham-before-active: top 0.1s ease-out, opacity 0.1s ease-out 0.12s;
    --ham-after: bottom 0.1s ease-in 0.25s, transform 0.22s cubic-bezier(0.55, 0.055, 0.675, 0.19);
    --ham-after-active: bottom 0.1s ease-out,
      transform 0.22s cubic-bezier(0.215, 0.61, 0.355, 1) 0.12s;
  }

  /* ---- Dark / "night" — inverted monochrome ---- */
  html[data-theme='dark'] {
    --bg: #0d0d0c;
    --surface: #1a1a18;
    --line: #2c2b28;
    --text: #f3f2ee;
    --text-secondary: #b9b6ad;
    --text-muted: #7c7a72;
    --accent: #f3f2ee;
    --navy-shadow: rgba(0, 0, 0, 0.5);
    --green-tint: rgba(243, 242, 238, 0.07);
  }
`;

export default variables;
