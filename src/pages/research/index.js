import React from 'react';
import { graphql, Link } from 'gatsby';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Layout } from '@components';

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

    .subtitle {
      margin: 0;
    }
  }
`;

const StyledSectionHeading = styled.h2`
  margin: 48px 0 20px;
  padding-top: 40px;
  border-top: 1px solid var(--line);
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-muted);
`;

const StyledResearchList = styled.ul`
  ${({ theme }) => theme.mixins.resetList};

  li {
    padding: 20px 0;
    border-bottom: 1px solid var(--line);

    &:first-child {
      padding-top: 0;
    }
  }

  .entry__title {
    margin: 0 0 4px;
    font-size: var(--fz-lg);
    font-weight: 600;
    line-height: 1.3;

    a {
      color: var(--text);

      &:hover,
      &:focus {
        text-decoration: underline;
        text-underline-offset: 3px;
      }
    }
  }

  .entry__tag {
    color: var(--text-muted);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .entry__citation {
    margin: 6px 0 0;
    color: var(--text-secondary);
    font-size: var(--fz-sm);
  }
`;

const ResearchEntry = ({ frontmatter }) => {
  const { title, paper, citation, slug } = frontmatter;

  return (
    <li>
      {paper && <span className="entry__tag">{paper}</span>}
      <h3 className="entry__title">
        <Link to={slug}>{title}</Link>
      </h3>
      {citation && <p className="entry__citation">{citation}</p>}
    </li>
  );
};

ResearchEntry.propTypes = {
  frontmatter: PropTypes.object.isRequired,
};

const ResearchIndexPage = ({ location, data }) => {
  const entries = data.allMarkdownRemark.edges.map(({ node }) => node.frontmatter);
  const completed = entries.filter(e => e.status !== 'placeholder');
  const inProgress = entries.filter(e => e.status === 'placeholder');

  return (
    <Layout location={location}>
      <Helmet title="Research" />

      <StyledMainContainer>
        <header>
          <p className="page-label">Research</p>
          <h1>Paper Implementation with a Project</h1>
          <p className="subtitle">
            My implementations of seminal papers, built to understand the research behind frontier
            robotics and Physical AI.
          </p>
        </header>

        {completed.length > 0 && (
          <StyledResearchList>
            {completed.map(frontmatter => (
              <ResearchEntry key={frontmatter.slug} frontmatter={frontmatter} />
            ))}
          </StyledResearchList>
        )}

        {inProgress.length > 0 && (
          <>
            <StyledSectionHeading>Work in Progress</StyledSectionHeading>
            <StyledResearchList>
              {inProgress.map(frontmatter => (
                <ResearchEntry key={frontmatter.slug} frontmatter={frontmatter} />
              ))}
            </StyledResearchList>
          </>
        )}
      </StyledMainContainer>
    </Layout>
  );
};

ResearchIndexPage.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default ResearchIndexPage;

export const pageQuery = graphql`
  {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/content/research/" } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          frontmatter {
            title
            paper
            citation
            slug
            status
          }
        }
      }
    }
  }
`;
