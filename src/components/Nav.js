import React from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { navLinks } from '@config';

const StyledNav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 18px;

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

const Nav = ({ location }) => {
  const pathname = location ? location.pathname : '';

  return (
    <StyledNav aria-label="Primary">
      {navLinks.map(({ name, url }) => (
        <Link key={url} to={url} className={pathname.startsWith(url) ? 'active' : ''}>
          {name}
        </Link>
      ))}
    </StyledNav>
  );
};

Nav.propTypes = {
  location: PropTypes.object,
};

export default Nav;
