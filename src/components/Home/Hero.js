import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { socialMedia } from '@config';

const StyledHero = styled.section`
  padding-bottom: 40px;
  border-bottom: 1px solid var(--line);

  .eyebrow {
    margin: 0 0 16px;
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  h1 {
    max-width: 800px;
    margin: 0 0 28px;
    font-size: clamp(28px, 4vw, var(--fz-heading));
    line-height: 1.25;
  }
`;

const StyledCtas = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;

  a {
    display: inline-block;
    padding: 10px 18px;
    border: 1px solid var(--text);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--text);
    text-decoration: none;

    &:hover,
    &:focus-visible {
      background: var(--text);
      color: var(--bg);
    }
  }
`;

const Hero = () => {
  const github = socialMedia.find(s => s.name.toLowerCase() === 'github');

  return (
    <StyledHero>
      <p className="eyebrow">AI Software Engineer · Robotics Simulation · Robot Learning</p>

      <h1>
        Building simulation environments and training robot policies for manipulation, then studying
        what they can retain, transfer, and reuse when the task or domain changes.
      </h1>

      <StyledCtas>
        <Link to="/about">About</Link>
        <Link to="/work">See the work</Link>
        {github && (
          <a href={github.url} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        )}
        <Link to="/chat">AI Chat</Link>
      </StyledCtas>
    </StyledHero>
  );
};

export default Hero;
