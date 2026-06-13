import { css } from 'styled-components';

// https://reactcommunity.org/react-transition-group/css-transition

const TransitionStyles = css`
  /* Fade up */
  .fadeup-enter {
    opacity: 0.01;
    transition: opacity 200ms var(--easing);
  }

  .fadeup-enter-active {
    opacity: 1;
    transition: opacity 200ms var(--easing);
  }

  /* Fade down */
  .fadedown-enter {
    opacity: 0.01;
    transition: opacity 200ms var(--easing);
  }

  .fadedown-enter-active {
    opacity: 1;
    transition: opacity 200ms var(--easing);
  }

  /* Fade */
  .fade-enter {
    opacity: 0;
  }
  .fade-enter-active {
    opacity: 1;
    transition: opacity 200ms var(--easing);
  }
  .fade-exit {
    opacity: 1;
  }
  .fade-exit-active {
    opacity: 0;
    transition: opacity 200ms var(--easing);
  }
`;

export default TransitionStyles;
