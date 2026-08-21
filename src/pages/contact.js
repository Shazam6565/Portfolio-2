import React from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Layout } from '@components';
import { email, socialMedia } from '@config';

const social = name => socialMedia.find(s => s.name.toLowerCase() === name.toLowerCase());

const StyledMainContainer = styled.main`
  max-width: 600px;

  & > header {
    margin-bottom: 40px;

    .page-label {
      margin: 0 0 12px;
      color: var(--text-muted);
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      font-weight: 500;
      letter-spacing: 0.15em;
      text-transform: uppercase;
    }

    h1 {
      margin: 0;
      font-size: var(--fz-heading);
    }
  }
`;

const StyledContactList = styled.ul`
  ${({ theme }) => theme.mixins.resetList};

  li {
    padding: 20px 0;
    border-bottom: 1px solid var(--line);

    &:first-child {
      padding-top: 0;
    }

    &:last-child {
      border-bottom: 0;
    }
  }

  .contact__label {
    margin: 0 0 4px;
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .contact__value a {
    ${({ theme }) => theme.mixins.inlineLink};
    font-size: var(--fz-md);
  }
`;

const ContactPage = ({ location }) => (
  <Layout location={location}>
    <Helmet title="Contact" />

    <StyledMainContainer>
      <header>
        <p className="page-label">Contact</p>
        <h1>Get in Touch</h1>
      </header>

      <StyledContactList>
        <li>
          <p className="contact__label">Email</p>
          <p className="contact__value">
            <a href={`mailto:${email}`}>{email}</a>
          </p>
        </li>
        <li>
          <p className="contact__label">Calendar</p>
          <p className="contact__value">
            <a href="https://calendly.com/vaasutiwari" target="_blank" rel="noopener noreferrer">
              Open my calendar &#8599;
            </a>
          </p>
        </li>
        {social('Linkedin') && (
          <li>
            <p className="contact__label">LinkedIn</p>
            <p className="contact__value">
              <a href={social('Linkedin').url} target="_blank" rel="noopener noreferrer">
                {social('Linkedin').url.replace('https://www.', '')}
              </a>
            </p>
          </li>
        )}
        {social('GitHub') && (
          <li>
            <p className="contact__label">GitHub</p>
            <p className="contact__value">
              <a href={social('GitHub').url} target="_blank" rel="noopener noreferrer">
                {social('GitHub').url.replace('https://', '')}
              </a>
            </p>
          </li>
        )}
        <li>
          <p className="contact__label">Résumé</p>
          <p className="contact__value">
            <Link to="/resume">View résumé</Link>
          </p>
        </li>
      </StyledContactList>
    </StyledMainContainer>
  </Layout>
);

ContactPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default ContactPage;
