import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const StyledToggle = styled.button`
  ${({ theme }) => theme.mixins.flexCenter};
  width: 38px;
  height: 38px;
  padding: 0;
  background: transparent;
  border: 1px solid var(--line);
  border-radius: 50%;
  color: var(--text);
  cursor: pointer;
  transition: var(--transition);

  &:hover,
  &:focus-visible {
    border-color: var(--text);
  }

  svg {
    width: 17px;
    height: 17px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.4;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`;

const SunIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="4.5" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8z" />
  </svg>
);

const ThemeToggle = () => {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const current =
      document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    setTheme(current);
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch (e) {
      /* ignore */
    }
  };

  // Avoid an icon flash before we know the active theme.
  const isDark = theme === 'dark';

  return (
    <StyledToggle
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to day theme' : 'Switch to night theme'}
      title={isDark ? 'Day' : 'Night'}
    >
      {theme === null ? (
        <span style={{ width: 17, height: 17 }} />
      ) : isDark ? (
        <SunIcon />
      ) : (
        <MoonIcon />
      )}
    </StyledToggle>
  );
};

export default ThemeToggle;
