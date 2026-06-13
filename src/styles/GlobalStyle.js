import { createGlobalStyle } from 'styled-components';
import variables from './variables';
import TransitionStyles from './TransitionStyles';
import PrismStyles from './PrismStyles';

const GlobalStyle = createGlobalStyle`
  ${variables};

  html {
    box-sizing: border-box;
    width: 100%;
    scroll-behavior: smooth;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  ::selection {
    background-color: var(--text);
    color: var(--bg);
  }

  /* Provide basic, default focus styles.*/
  :focus {
    outline: 2px solid var(--text);
    outline-offset: 2px;
  }

  /*
    Remove default focus styles for mouse users ONLY if
    :focus-visible is supported on this platform.
  */
  :focus:not(:focus-visible) {
    outline: none;
    outline-offset: 0px;
  }

  /*
    Optionally: If :focus-visible is supported on this
    platform, provide enhanced focus styles for keyboard
    focus.
  */
  :focus-visible {
    outline: 2px solid var(--text);
    outline-offset: 2px;
  }

  /* Scrollbar Styles */
  html {
    scrollbar-width: thin;
    scrollbar-color: var(--line) var(--bg);
  }
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: var(--bg);
  }
  ::-webkit-scrollbar-thumb {
    background-color: var(--line);
    border-radius: 0;
  }

  body {
    margin: 0;
    width: 100%;
    min-height: 100%;
    overflow-x: hidden;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    background-color: var(--bg);
    color: var(--text-secondary);
    font-family: var(--font-sans);
    font-size: var(--fz-md);
    line-height: 1.6;

    &.hidden {
      overflow: hidden;
    }

    &.blur {
      overflow: hidden;

      header {
        background-color: transparent;
      }

      #content > * {
        filter: blur(4px);
        transition: var(--transition);
        pointer-events: none;
        user-select: none;
      }
    }
  }

  #root {
    min-height: 100vh;
    display: grid;
    grid-template-rows: 1fr auto;
    grid-template-columns: 100%;
  }

  main {
    margin: 0 auto;
    width: 100%;
    max-width: 800px;
    min-height: 100vh;
    padding: 120px 24px;

    @media (max-width: 480px) {
      padding: 100px 20px;
    }

    &.fillHeight {
      padding: 0 24px;

      @media (max-width: 480px) {
        padding: 0 20px;
      }
    }
  }

  section {
    margin: 0 auto;
    padding: 48px 0;
    max-width: 720px;

    @media (max-width: 480px) {
      padding: 36px 0;
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0 0 10px 0;
    font-weight: 600;
    color: var(--text);
    line-height: 1.2;
    letter-spacing: -0.01em;
  }

  .big-heading {
    margin: 0;
    font-size: clamp(28px, 5vw, 44px);
    letter-spacing: -0.02em;
  }

  .medium-heading {
    margin: 0;
    font-size: clamp(22px, 4vw, 30px);
  }

  .numbered-heading {
    margin: 0 0 28px;
    width: 100%;
    color: var(--text-muted);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  img,
  svg,
  .gatsby-image-wrapper {
    width: 100%;
    max-width: 100%;
    vertical-align: middle;
  }

  img[alt=""],
  img:not([alt]) {
    filter: blur(5px);
  }

  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
    vertical-align: middle;

    &.feather {
      fill: none;
    }
  }

  a {
    display: inline-block;
    text-decoration: none;
    text-decoration-skip-ink: auto;
    color: inherit;
    position: relative;
    transition: var(--transition);

    &:hover,
    &:focus {
      color: var(--text);
    }

    &.inline-link {
      ${({ theme }) => theme.mixins.inlineLink};
    }
  }

  button {
    cursor: pointer;
    border: 0;
    border-radius: 0;
  }

  input, textarea {
    border-radius: 0;
    outline: 0;

    &:focus {
      outline: 0;
    }
    &:focus,
    &:active {
      &::placeholder {
        opacity: 0.5;
      }
    }
  }

  p {
    margin: 0 0 15px 0;

    &:last-child,
    &:last-of-type {
      margin: 0;
    }

    & > a {
      ${({ theme }) => theme.mixins.inlineLink};
    }

    & > code {
      background-color: var(--surface);
      color: var(--text);
      font-size: var(--fz-sm);
      border-radius: var(--border-radius);
      padding: 0.2em 0.4em;
    }
  }

  ul {
    &.fancy-list {
      padding: 0;
      margin: 0;
      list-style: none;
      font-size: var(--fz-md);
      li {
        position: relative;
        padding-left: 20px;
        margin-bottom: 6px;
        &:before {
          content: '–';
          position: absolute;
          left: 0;
          color: var(--text-muted);
        }
      }
    }
  }

  blockquote {
    border-left-color: var(--line);
    border-left-style: solid;
    border-left-width: 2px;
    margin-left: 0px;
    margin-right: 0px;
    padding-left: 1.5rem;

    p {
      font-style: italic;
      font-size: var(--fz-lg);
    }
  }

  hr {
    background-color: var(--line);
    height: 1px;
    border-width: 0px;
    border-style: initial;
    border-color: initial;
    border-image: initial;
    margin: 2rem 0;
  }

  code {
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
  }

  .skip-to-content {
    ${({ theme }) => theme.mixins.button};
    position: absolute;
    top: auto;
    left: -999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
    z-index: -99;

    &:hover,
    &:focus {
      background-color: var(--text);
      color: var(--bg);
      top: 0;
      left: 0;
      width: auto;
      height: auto;
      overflow: auto;
      z-index: 99;
      box-shadow: none;
      transform: none;
    }
  }

  #logo {
    color: var(--text);
  }

  .overline {
    color: var(--text-muted);
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    font-weight: 400;
  }

  .subtitle {
    color: var(--text-muted);
    margin: 0 0 20px 0;
    font-size: var(--fz-sm);
    font-family: var(--font-mono);
    font-weight: 400;
    line-height: 1.5;
    @media (max-width: 768px) {
      font-size: var(--fz-xs);
    }

    a {
      ${({ theme }) => theme.mixins.inlineLink};
      line-height: 1.5;
    }
  }

  .breadcrumb {
    display: flex;
    align-items: center;
    margin-bottom: 50px;
    color: var(--text);

    .arrow {
      display: block;
      margin-right: 10px;
      padding-top: 4px;
    }

    a {
      ${({ theme }) => theme.mixins.inlineLink};
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      font-weight: 500;
      line-height: 1.5;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
  }

  .gatsby-image-outer-wrapper {
    height: 100%;
  }

  ${TransitionStyles};

  ${PrismStyles};
`;

export default GlobalStyle;
