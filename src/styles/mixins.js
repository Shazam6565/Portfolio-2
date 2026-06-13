import { css } from 'styled-components';

const button = css`
  color: var(--text);
  background-color: transparent;
  border: 1px solid var(--text);
  border-radius: var(--border-radius);
  font-size: var(--fz-xs);
  font-family: var(--font-mono);
  line-height: 1;
  text-decoration: none;
  padding: 0.9rem 1.25rem;
  transition: var(--transition);

  &:hover,
  &:focus-visible {
    outline: none;
    background-color: var(--text);
    color: var(--bg);
  }
  &:after {
    display: none !important;
  }
`;

const mixins = {
  flexCenter: css`
    display: flex;
    justify-content: center;
    align-items: center;
  `,

  flexBetween: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,

  link: css`
    display: inline-block;
    text-decoration: none;
    text-decoration-skip-ink: auto;
    color: inherit;
    position: relative;
    transition: var(--transition);

    &:hover,
    &:focus-visible {
      color: var(--text);
      outline: 0;
    }
  `,

  inlineLink: css`
    display: inline;
    position: relative;
    color: var(--text);
    text-decoration: underline;
    text-decoration-color: var(--line);
    text-underline-offset: 3px;
    transition: var(--transition);

    &:hover,
    &:focus-visible {
      color: var(--text);
      text-decoration-color: var(--text);
      outline: 0;
      & > * {
        color: var(--text) !important;
        transition: var(--transition);
      }
    }
  `,

  button,

  smallButton: css`
    color: var(--text);
    background-color: transparent;
    border: 1px solid var(--text);
    border-radius: var(--border-radius);
    padding: 0.6rem 0.9rem;
    font-size: var(--fz-xs);
    font-family: var(--font-mono);
    line-height: 1;
    text-decoration: none;
    transition: var(--transition);

    &:hover,
    &:focus-visible {
      outline: none;
      background-color: var(--text);
      color: var(--bg);
    }
    &:after {
      display: none !important;
    }
  `,

  bigButton: css`
    color: var(--text);
    background-color: transparent;
    border: 1px solid var(--text);
    border-radius: var(--border-radius);
    padding: 0.9rem 1.25rem;
    font-size: var(--fz-sm);
    font-family: var(--font-mono);
    line-height: 1;
    text-decoration: none;
    transition: var(--transition);

    &:hover,
    &:focus-visible {
      outline: none;
      background-color: var(--text);
      color: var(--bg);
    }
    &:after {
      display: none !important;
    }
  `,

  boxShadow: css`
    box-shadow: none;
  `,

  fancyList: css`
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
  `,

  resetList: css`
    list-style: none;
    padding: 0;
    margin: 0;
  `,
};

export default mixins;
