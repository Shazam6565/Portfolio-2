import { css } from 'styled-components';

const variables = css`
  :root {
    /* Monochrome palette — ink on paper.
       Legacy names are kept so existing components keep working:
       navy family = surfaces, slate family = text, green = accent. */
    --dark-navy: #ffffff;
    --navy: #ffffff;
    --light-navy: #f6f6f6;
    --lightest-navy: #e6e6e6;
    --navy-shadow: rgba(0, 0, 0, 0.06);
    --dark-slate: #8a8a8a;
    --slate: #4d4d4d;
    --light-slate: #333333;
    --lightest-slate: #111111;
    --white: #000000;
    --green: #000000;
    --green-tint: rgba(0, 0, 0, 0.04);
    --pink: #111111;
    --blue: #111111;

    /* Semantic aliases — prefer these in new code */
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
    --nav-scroll-height: 56px;

    --tab-height: 42px;
    --tab-width: 120px;

    --easing: ease;
    --transition: all 0.15s ease;

    --hamburger-width: 24px;

    --ham-before: top 0.1s ease-in 0.25s, opacity 0.1s ease-in;
    --ham-before-active: top 0.1s ease-out, opacity 0.1s ease-out 0.12s;
    --ham-after: bottom 0.1s ease-in 0.25s, transform 0.22s cubic-bezier(0.55, 0.055, 0.675, 0.19);
    --ham-after-active: bottom 0.1s ease-out,
      transform 0.22s cubic-bezier(0.215, 0.61, 0.355, 1) 0.12s;
  }
`;

export default variables;
