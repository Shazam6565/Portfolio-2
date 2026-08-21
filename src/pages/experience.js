import React from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Layout } from '@components';

const shortCompany = c => c.split(' & ')[0].split(' at ')[0].split(',')[0].trim();

const StyledMainContainer = styled.main`
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
      margin: 0 0 8px;
      font-size: var(--fz-heading);
    }
  }
`;

const StyledJobList = styled.ul`
  ${({ theme }) => theme.mixins.resetList};
  max-width: 720px;

  li {
    border-bottom: 1px solid var(--line);

    &:first-child details {
      padding-top: 0;
    }
  }

  details {
    padding: 20px 0;
  }

  summary {
    display: flex;
    align-items: baseline;
    gap: 16px;
    cursor: pointer;
    list-style: none;

    &::-webkit-details-marker {
      display: none;
    }

    &:hover .job__title,
    &:focus-visible .job__title {
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }

  .job__title {
    flex: 1;
    min-width: 0;
    font-size: var(--fz-lg);
    font-weight: 600;
    line-height: 1.3;
    color: var(--text);
  }

  .job__range {
    flex-shrink: 0;
    color: var(--text-muted);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    white-space: nowrap;
  }

  .job__toggle {
    flex-shrink: 0;
    width: 1em;
    text-align: center;
    font-family: var(--font-mono);
    color: var(--text-muted);

    &::before {
      content: '+';
    }
  }

  details[open] .job__toggle::before {
    content: '\\2212';
  }

  .job__body {
    margin-top: 14px;
    color: var(--text-secondary);

    p {
      margin: 0 0 1em;
      line-height: 1.6;
    }
  }

  .job__link {
    margin-top: 10px;
    font-size: var(--fz-sm);

    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }
  }
`;

const ExperiencePage = ({ location, data }) => {
  const jobs = data.allMarkdownRemark.edges.map(({ node }) => node);

  return (
    <Layout location={location}>
      <Helmet title="Experience" />

      <StyledMainContainer>
        <header>
          <p className="page-label">Experience</p>
          <h1>Experience</h1>
        </header>

        <StyledJobList>
          {jobs.map(({ frontmatter, html }, i) => {
            const { title, company, range, url } = frontmatter;
            const current = /current|present/i.test(range || '');

            return (
              <li key={i}>
                <details open={current}>
                  <summary>
                    <span className="job__title">
                      {title} · {company}
                      {current ? ' · Now' : ''}
                    </span>
                    <span className="job__range">{range}</span>
                    <span className="job__toggle" aria-hidden="true" />
                  </summary>
                  <div className="job__body" dangerouslySetInnerHTML={{ __html: html }} />
                  {url && (
                    <p className="job__link">
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        {shortCompany(company)} &#8599;
                      </a>
                    </p>
                  )}
                </details>
              </li>
            );
          })}
        </StyledJobList>
      </StyledMainContainer>
    </Layout>
  );
};

ExperiencePage.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default ExperiencePage;

export const pageQuery = graphql`
  {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/content/jobs/" } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          frontmatter {
            title
            company
            range
            url
            date
          }
          html
        }
      }
    }
  }
`;
