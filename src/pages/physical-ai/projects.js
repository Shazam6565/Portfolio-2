import React from 'react';
import { graphql, Link } from 'gatsby';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Layout } from '@components';

const CATEGORIES = ['Learning', 'Research', 'Implementation'];

const StyledMainContainer = styled.main`
  & > header {
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
      margin: 0 0 8px;
      font-size: var(--fz-heading);
    }

    .subtitle {
      margin: 0;
    }
  }
`;

const StyledCategory = styled.section`
  margin-bottom: 48px;

  h2 {
    margin: 0 0 4px;
    font-size: var(--fz-xl);
  }

  .category__count {
    margin: 0 0 20px;
    color: var(--text-muted);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
  }
`;

const StyledProjectList = styled.ul`
  ${({ theme }) => theme.mixins.resetList};

  li {
    padding: 20px 0;
    border-bottom: 1px solid var(--line);

    &:first-child {
      padding-top: 0;
    }
  }

  .project__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }

  .project__title {
    margin: 0;
    font-size: var(--fz-lg);
    font-weight: 600;
    line-height: 1.3;
    color: var(--text);
  }

  .project__status {
    flex-shrink: 0;
    color: var(--text-muted);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .project__desc {
    margin: 8px 0 0;
    color: var(--text-secondary);
    font-size: var(--fz-sm);
    white-space: pre-line;
  }

  .project__links {
    display: flex;
    flex-wrap: wrap;
    gap: 18px;
    margin-top: 10px;
    font-size: var(--fz-sm);

    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }
  }
`;

const PhysicalAiProjectsPage = ({ location, data }) => {
  const projects = data.allMarkdownRemark.edges.map(({ node }) => node.frontmatter);

  return (
    <Layout location={location}>
      <Helmet title="Physical AI — Projects" />

      <StyledMainContainer>
        <header>
          <span className="breadcrumb">
            <span className="arrow">&larr;</span>
            <Link to="/">Home</Link>
          </span>

          <p className="page-label">Physical AI</p>
          <h1>Projects</h1>
          <p className="subtitle">Learning, research, and implementation work in Physical AI.</p>
        </header>

        {CATEGORIES.map(category => {
          const entries = projects
            .filter(p => p.category === category)
            .sort((a, b) => (a.order || 0) - (b.order || 0));

          return (
            <StyledCategory key={category}>
              <h2>{category}</h2>
              <p className="category__count">
                {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
              </p>

              {entries.length > 0 ? (
                <StyledProjectList>
                  {entries.map((p, i) => (
                    <li key={i}>
                      <div className="project__head">
                        <h3 className="project__title">{p.title}</h3>
                        {p.status && <span className="project__status">{p.status}</span>}
                      </div>
                      {p.description && <p className="project__desc">{p.description}</p>}
                      {(p.github || p.docs || (p.videos && p.videos.length > 0)) && (
                        <div className="project__links">
                          {p.github && (
                            <a href={p.github} target="_blank" rel="noopener noreferrer">
                              Code &#8599;
                            </a>
                          )}
                          {p.docs && (
                            <a href={p.docs} target="_blank" rel="noopener noreferrer">
                              Docs &#8599;
                            </a>
                          )}
                          {p.videos &&
                            p.videos.map((v, vi) => (
                              <a key={vi} href={v.url} target="_blank" rel="noopener noreferrer">
                                {v.label || 'Video log'} &#8599;
                              </a>
                            ))}
                        </div>
                      )}
                    </li>
                  ))}
                </StyledProjectList>
              ) : (
                <p className="category__count">Nothing here yet.</p>
              )}
            </StyledCategory>
          );
        })}
      </StyledMainContainer>
    </Layout>
  );
};

PhysicalAiProjectsPage.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default PhysicalAiProjectsPage;

export const pageQuery = graphql`
  {
    allMarkdownRemark(filter: { fileAbsolutePath: { regex: "/content/physical-ai-projects/" } }) {
      edges {
        node {
          frontmatter {
            title
            category
            status
            description
            github
            docs
            order
            videos {
              label
              url
            }
          }
        }
      }
    }
  }
`;
