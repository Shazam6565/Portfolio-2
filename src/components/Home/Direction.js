import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';

const StyledDirection = styled.section`
  padding: 40px 0;

  .section-label {
    margin: 0 0 20px;
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  p {
    max-width: 640px;
    margin: 0;
    color: var(--text-secondary);
    line-height: 1.6;
  }

  a {
    ${({ theme }) => theme.mixins.inlineLink};
  }
`;

const Direction = () => (
  <StyledDirection>
    <p className="section-label">Direction</p>
    <p>
      My direction is robot learning through simulation: building manipulation environments,
      training policies, and studying how learned skills can transfer across tasks, objects, and
      domains instead of being relearned from scratch. Full background on the{' '}
      <Link to="/resume">CV</Link>.
    </p>
  </StyledDirection>
);

export default Direction;
