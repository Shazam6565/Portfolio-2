import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import styled, { ThemeProvider } from 'styled-components';
import { Head, Footer, ThemeToggle } from '@components';
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
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }

  .home-link {
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

  .chrome-right {
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

  .spacer {
    width: 1px;
  }
`;

const Layout = ({ children, location }) => {
  const isHome = location.pathname === '/';

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
            {isHome ? (
              <span className="spacer" />
            ) : (
              <Link className="home-link" to="/">
                ← shaurya tiwari
              </Link>
            )}
            <div className="chrome-right">
              <Link className="resume-link" to="/resume">
                Résumé
              </Link>
              <ThemeToggle />
            </div>
          </StyledChrome>

          {isHome ? (
            <main id="content">
              {children}
              <Footer />
            </main>
          ) : (
            <StyledContent>
              <div id="content">
                {children}
                <Footer />
              </div>
            </StyledContent>
          )}
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
