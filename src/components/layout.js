import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import styled, { ThemeProvider } from 'styled-components';
import { Head, Footer, Nav, ThemeToggle } from '@components';
import { GlobalStyle, theme } from '@styles';

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const StyledChrome = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 24px;
  padding: 18px 22px;
  background: var(--bg);
  border-bottom: 1px solid var(--line);
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }

  .home-link {
    flex-shrink: 0;
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    letter-spacing: 0.04em;
    color: var(--text);
    text-decoration: none;

    &:hover,
    &:focus-visible {
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }

  nav {
    flex: 1;
    justify-content: center;
  }

  .chrome-right {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 18px;
  }

  .resume-link {
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text);
    text-decoration: none;

    &:hover,
    &:focus-visible {
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }

  /* Below tabletL the mobile menu toggle appears and the bar no longer
     fits on one line. Force chrome-right onto its own full-width row
     (instead of leaving the wrap point to chance) and right-align it so
     it sits flush under the menu toggle above it, keeping both rows
     symmetric. */
  @media (${({ theme }) => theme.bp.tabletL}) {
    .chrome-right {
      flex-basis: 100%;
      justify-content: flex-end;
    }
  }
`;

const Layout = ({ children, location }) => {
  // Sets target="_blank" rel="noopener noreferrer" on external links
  const handleExternalLinks = () => {
    const allLinks = Array.from(document.querySelectorAll('a'));
    if (allLinks.length > 0) {
      allLinks.forEach(link => {
        if (link.host !== window.location.host) {
          link.setAttribute('rel', 'noopener noreferrer');
          link.setAttribute('target', '_blank');
        }
      });
    }
  };

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView();
          el.focus();
        }
      }, 0);
    }

    handleExternalLinks();
  }, []);

  return (
    <>
      <Head />

      <div id="root">
        <ThemeProvider theme={theme}>
          <GlobalStyle />

          <a className="skip-to-content" href="#content">
            Skip to Content
          </a>

          <StyledChrome>
            <Link className="home-link" to="/">
              ← shaurya tiwari
            </Link>
            <Nav location={location} />
            <div className="chrome-right">
              <Link className="resume-link" to="/resume">
                Résumé
              </Link>
              <ThemeToggle />
            </div>
          </StyledChrome>

          <StyledContent>
            <div id="content">
              {children}
              <Footer />
            </div>
          </StyledContent>
        </ThemeProvider>
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
};

export default Layout;
