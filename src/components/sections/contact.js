import React from 'react';
import styled from 'styled-components';
import { email } from '@config';

const StyledContactSection = styled.section`
  .title {
    margin: 0 0 16px;
    font-size: var(--fz-xxl);
  }

  p {
    max-width: 540px;
    color: var(--text-secondary);
  }

  .contact-links {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 20px;
    margin-top: 24px;

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

const Contact = () => (
  <StyledContactSection id="contact">
    <h2 className="numbered-heading">What’s Next?</h2>

    <h3 className="title">Get In Touch</h3>

    <p>
      Looking forward to discussing potential opportunities or answering any inquiries. Whether you
      have a question or just want to say hi, I’ll try my best to get back to you.
    </p>

    <div className="contact-links">
      <a href={`mailto:${email}`}>{email}</a>
      <a href="https://calendly.com/vaasutiwari" target="_blank" rel="noopener noreferrer">
        Schedule a meeting
      </a>
    </div>
  </StyledContactSection>
);

export default Contact;
