import React from 'react';
import styled from 'styled-components';
import { email, socialMedia } from '@config';

const StyledHeroSection = styled.section`
  padding-top: calc(var(--nav-height) + 48px);

  @media (max-width: 480px) {
    padding-top: calc(var(--nav-height) + 36px);
  }

  h1 {
    margin: 0 0 12px;
  }

  .hero-subtitle {
    margin: 0 0 20px;
    color: var(--text-muted);
    font-size: var(--fz-lg);
    line-height: 1.5;
  }

  .hero-description {
    margin: 0 0 28px;
    max-width: 540px;
    color: var(--text-secondary);
  }

  .hero-links {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 20px;

    a {
      color: var(--text);
      font-size: var(--fz-sm);
      text-decoration: underline;
      text-decoration-color: var(--line);
      text-underline-offset: 3px;

      &:hover,
      &:focus-visible {
        text-decoration-color: var(--text);
      }
    }
  }
`;

const Hero = () => {
  const github = socialMedia.find(({ name }) => name === 'GitHub');
  const linkedin = socialMedia.find(({ name }) => name === 'Linkedin');

  return (
    <StyledHeroSection>
      <h1 className="big-heading">Shaurya Tiwari.</h1>

      <p className="hero-subtitle">
        AI Software Engineer
        <br />
        Fundamental truths to production systems.
      </p>

      <p className="hero-description">Forward-deployed AI • Backend systems • Data platforms</p>

      <div className="hero-links">
        <a href={`mailto:${email}`}>Email</a>
        {github && (
          <a href={github.url} target="_blank" rel="noreferrer">
            GitHub
          </a>
        )}
        {linkedin && (
          <a href={linkedin.url} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        )}
        <a href="/chat">Ask my AI assistant →</a>
      </div>
    </StyledHeroSection>
  );
};

export default Hero;
