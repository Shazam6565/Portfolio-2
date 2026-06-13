import React from 'react';
import styled from 'styled-components';
import { socialMedia } from '@config';

const StyledFooter = styled.footer`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  padding: 24px;
  border-top: 1px solid var(--line);
  text-align: center;
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  color: var(--text-muted);

  .social-links {
    margin-bottom: 8px;

    a {
      color: var(--text-secondary);
      text-decoration: none;
      transition: var(--transition);

      &:hover,
      &:focus-visible {
        color: var(--text);
        text-decoration: underline;
        text-underline-offset: 3px;
      }
    }

    .separator {
      margin: 0 6px;
      color: var(--text-muted);
    }
  }

  .credit {
    line-height: 1.6;
    color: var(--text-muted);

    a {
      color: inherit;
      text-decoration: none;
      transition: var(--transition);

      &:hover,
      &:focus-visible {
        color: var(--text);
        text-decoration: underline;
        text-underline-offset: 3px;
      }
    }
  }
`;

const Footer = () => (
  <StyledFooter>
    <div className="social-links">
      {socialMedia &&
        socialMedia.map(({ name, url }, i) => (
          <React.Fragment key={name}>
            {i > 0 && (
              <span className="separator" aria-hidden="true">
                ·
              </span>
            )}
            <a href={url} target="_blank" rel="noreferrer">
              {name}
            </a>
          </React.Fragment>
        ))}
    </div>

    <div className="credit">
      © Shaurya Tiwari · Design adapted from{' '}
      <a href="https://github.com/bchiang7/v4" target="_blank" rel="noreferrer">
        Brittany Chiang
      </a>
    </div>
  </StyledFooter>
);

export default Footer;
