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
    padding: 28px 0;
    border-bottom: 1px solid var(--line);

    &:first-child {
      padding-top: 0;
    }
  }

  .job__title {
    margin: 0 0 4px;
    font-size: var(--fz-lg);
    font-weight: 600;
    line-height: 1.3;
    color: var(--text);
  }

  .job__meta {
    margin: 0 0 14px;
    color: var(--text-muted);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
  }

  .job__body {
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
                <h2 className="job__title">
                  {title} · {company}
                  {current ? ' · Now' : ''}
                </h2>
                <p className="job__meta">
                  {company} · {range}
                </p>
                <div className="job__body" dangerouslySetInnerHTML={{ __html: html }} />
                {url && (
                  <p className="job__link">
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {shortCompany(company)} &#8599;
                    </a>
                  </p>
                )}
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
