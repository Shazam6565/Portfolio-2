import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { navLinks } from '@config';

const linkClass = (pathname, url) => (pathname.startsWith(url) ? 'active' : '');

const DesktopNav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 18px;

  @media (${({ theme }) => theme.bp.tabletL}) {
    display: none;
  }

  a {
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    letter-spacing: 0.05em;
    color: var(--text-muted);
    text-decoration: none;
    white-space: nowrap;

    &:hover,
    &:focus-visible {
      color: var(--text);
    }

    &.active {
      color: var(--text);
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }
`;

const MobileNavWrap = styled.div`
  display: none;

  @media (${({ theme }) => theme.bp.tabletL}) {
    display: block;
  }
`;

const ToggleButton = styled.button`
  position: relative;
  z-index: 22;
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text);
  background: var(--bg);
  border: 1px solid var(--text);
  padding: 6px 12px;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background: var(--text);
    color: var(--bg);
  }
`;

// position: fixed here (not absolute) so it always covers the full viewport
// below the chrome bar, however tall that bar ends up being — the chrome
// bar itself outranks <main> in stacking order, so this never has to know
// the bar's exact height to stay visually correct.
const Backdrop = styled.button`
  position: fixed;
  inset: 0;
  background: transparent;
  border: 0;
  padding: 0;
  cursor: default;
  z-index: 19;
`;

// position: absolute (not fixed) anchored to the nearest positioned
// ancestor — StyledChrome, which is position: fixed — so this starts
// exactly at the bar's real rendered bottom edge (top: 100%) rather than
// a hardcoded --nav-height. The bar can wrap to 2 rows on narrow phones;
// a fixed offset would then start too early and cover the wrapped row.
const Dropdown = styled.nav`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 21;
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  overflow-y: auto;
  background: var(--bg);
  border-bottom: 1px solid var(--line);
  padding: 4px 22px 12px;

  a {
    padding: 12px 0;
    border-top: 1px solid var(--line);
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    letter-spacing: 0.04em;
    color: var(--text-muted);
    text-decoration: none;

    &.active {
      color: var(--text);
    }
  }
`;

const Nav = ({ location }) => {
  const pathname = location ? location.pathname : '';
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  // Close automatically if the viewport grows past the mobile breakpoint,
  // e.g. rotating a tablet or resizing a browser window.
  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const mq = window.matchMedia('(max-width: 768px)');
    const onChange = e => {
      if (!e.matches) {
        setOpen(false);
      }
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [open]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const onKey = e => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <DesktopNav aria-label="Primary">
        {navLinks.map(({ name, url }) => (
          <Link key={url} to={url} className={linkClass(pathname, url)}>
            {name}
          </Link>
        ))}
      </DesktopNav>

      <MobileNavWrap ref={wrapRef}>
        <ToggleButton
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav-dropdown"
          onClick={() => setOpen(prev => !prev)}
        >
          {open ? 'Close' : 'Menu'}
        </ToggleButton>

        {open && (
          <>
            <Backdrop type="button" aria-label="Close menu" onClick={() => setOpen(false)} />
            <Dropdown id="mobile-nav-dropdown" aria-label="Primary">
              {navLinks.map(({ name, url }) => (
                <Link
                  key={url}
                  to={url}
                  className={linkClass(pathname, url)}
                  onClick={() => setOpen(false)}
                >
                  {name}
                </Link>
              ))}
            </Dropdown>
          </>
        )}
      </MobileNavWrap>
    </>
  );
};

Nav.propTypes = {
  location: PropTypes.object,
};

export default Nav;
