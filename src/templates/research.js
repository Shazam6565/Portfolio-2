import React from 'react';
import { graphql, Link } from 'gatsby';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Layout } from '@components';

const FIELDS = [
  { key: 'input', label: 'Input' },
  { key: 'supervisionRequired', label: 'Supervision Required' },
  { key: 'representationLearned', label: 'Representation Learned' },
  { key: 'robotActionConnection', label: 'How It Connects to Robot Actions' },
  { key: 'realHardwareTest', label: 'Real Hardware Test' },
  { key: 'limitations', label: 'Limitations / Failure Modes' },
  { key: 'proposedExperiment', label: 'Experiment I Would Add' },
];

const StyledResearchContainer = styled.main`
  max-width: 720px;
`;

const StyledResearchHeader = styled.header`
  margin-bottom: 40px;

  .breadcrumb {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 24px;
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    color: var(--text-muted);

    a {
      color: var(--text-muted);

      &:hover,
      &:focus {
        color: var(--text);
        text-decoration: underline;
        text-underline-offset: 3px;
      }
    }
  }

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
    margin: 0 0 10px;
    font-size: clamp(24px, 5vw, 32px);
  }

  .meta {
    margin: 0;
    color: var(--text-muted);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);

    a {
      color: var(--text-muted);

      &:hover,
      &:focus {
        color: var(--text);
        text-decoration: underline;
        text-underline-offset: 3px;
      }
    }
  }
`;

const StyledFieldList = styled.dl`
  margin: 0 0 40px;
`;

const StyledField = styled.div`
  padding: 24px 0;
  border-top: 1px solid var(--line);

  &:last-child {
    border-bottom: 1px solid var(--line);
  }

  dt {
    margin: 0 0 10px;
    color: var(--text-muted);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    font-weight: 500;
    letter-spacing: 0.13em;
    text-transform: uppercase;
  }

  dd {
    margin: 0;
    color: var(--text-secondary);
    font-size: var(--fz-md);
    line-height: 1.6;
    white-space: pre-line;
  }
`;

const StyledLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 60px;
  font-size: var(--fz-sm);

  a {
    ${({ theme }) => theme.mixins.inlineLink};
  }
`;

const ResearchTemplate = ({ data, location }) => {
  if (!data.markdownRemark) {
    return (
      <Layout location={location}>
        <Helmet title="Page Not Found" />
        <StyledResearchContainer>
          <h1>404: Research Entry Not Found</h1>
          <p>The research entry you are looking for does not exist.</p>
          <Link to="/research">Go back to all research</Link>
        </StyledResearchContainer>
      </Layout>
    );
  }

  const { frontmatter } = data.markdownRemark;
  const { title, citation, paperLink, githubRepo, youtubeVideo } = frontmatter;

  return (
    <Layout location={location}>
      <Helmet title={title} />

      <StyledResearchContainer>
        <StyledResearchHeader>
          <span className="breadcrumb">
            <span className="arrow">&larr;</span>
            <Link to="/research">All Research</Link>
          </span>

          <p className="page-label">Research</p>
          <h1>{title}</h1>
          {citation && (
            <p className="meta">
              {paperLink ? (
                <a href={paperLink} target="_blank" rel="noopener noreferrer">
                  {citation}
                </a>
              ) : (
                citation
              )}
            </p>
          )}
        </StyledResearchHeader>

        <StyledFieldList>
          {FIELDS.map(({ key, label }) => (
            <StyledField key={key}>
              <dt>{label}</dt>
              <dd>{frontmatter[key]}</dd>
            </StyledField>
          ))}
        </StyledFieldList>

        {(githubRepo || youtubeVideo) && (
          <StyledLinks>
            {githubRepo && (
              <a href={githubRepo} target="_blank" rel="noopener noreferrer">
                Potential Implementation (GitHub) &#8599;
              </a>
            )}
            {youtubeVideo && (
              <a href={youtubeVideo} target="_blank" rel="noopener noreferrer">
                Video Application (YouTube) &#8599;
              </a>
            )}
          </StyledLinks>
        )}
      </StyledResearchContainer>
    </Layout>
  );
};

ResearchTemplate.propTypes = {
  data: PropTypes.object,
  location: PropTypes.object,
};

export default ResearchTemplate;

export const pageQuery = graphql`
  query ($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      frontmatter {
        title
        paper
        citation
        paperLink
        date
        status
        input
        supervisionRequired
        representationLearned
        robotActionConnection
        realHardwareTest
        limitations
        proposedExperiment
        githubRepo
        youtubeVideo
      }
    }
  }
`;
