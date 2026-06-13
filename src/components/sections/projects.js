import React, { useState } from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';

const StyledProjectsSection = styled.section`
  .archive-link {
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
  }

  .projects-list {
    ${({ theme }) => theme.mixins.resetList};
    margin-top: 12px;
  }

  .more-button {
    ${({ theme }) => theme.mixins.button};
    margin: 32px 0 0;
  }
`;

const StyledProject = styled.li`
  padding: 16px 0;

  &:not(:last-of-type) {
    border-bottom: 1px solid var(--line);
  }

  .project-title {
    margin: 0 0 4px;
    font-size: var(--fz-md);
    font-weight: 600;
    color: var(--text);

    a {
      color: var(--text);
      text-decoration: none;

      &:hover,
      &:focus-visible {
        text-decoration: underline;
        text-decoration-color: var(--text);
        text-underline-offset: 3px;
      }
    }
  }

  .project-description {
    color: var(--text-secondary);
    font-size: var(--fz-sm);
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;

    p {
      margin: 0;
    }
  }

  .project-tech-list {
    ${({ theme }) => theme.mixins.resetList};
    display: flex;
    flex-wrap: wrap;
    margin-top: 6px;
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    color: var(--text-muted);

    li:not(:last-of-type):after {
      content: '·';
      margin: 0 8px;
    }
  }
`;

const Projects = () => {
  const data = useStaticQuery(graphql`
    query {
      projects: allMarkdownRemark(
        filter: {
          fileAbsolutePath: { regex: "/content/projects/" }
          frontmatter: { showInProjects: { ne: false } }
        }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            frontmatter {
              title
              tech
              github
              external
            }
            html
          }
        }
      }
    }
  `);

  const [showMore, setShowMore] = useState(false);

  const GRID_LIMIT = 6;
  const projects = data.projects.edges.filter(({ node }) => node);
  const firstSix = projects.slice(0, GRID_LIMIT);
  const projectsToShow = showMore ? projects : firstSix;

  return (
    <StyledProjectsSection>
      <h2 className="numbered-heading">Other Noteworthy Projects</h2>

      <Link className="inline-link archive-link" to="/archive">
        view the archive
      </Link>

      <ul className="projects-list">
        {projectsToShow &&
          projectsToShow.map(({ node }, i) => {
            const { frontmatter, html } = node;
            const { github, external, title, tech } = frontmatter;
            const titleLink = external || github;

            return (
              <StyledProject key={i}>
                <h3 className="project-title">
                  {titleLink ? (
                    <a href={titleLink} target="_blank" rel="noreferrer">
                      {title}
                    </a>
                  ) : (
                    title
                  )}
                </h3>

                <div className="project-description" dangerouslySetInnerHTML={{ __html: html }} />

                {tech && tech.length > 0 && (
                  <ul className="project-tech-list">
                    {tech.map((techItem, j) => (
                      <li key={j}>{techItem}</li>
                    ))}
                  </ul>
                )}
              </StyledProject>
            );
          })}
      </ul>

      <button className="more-button" onClick={() => setShowMore(!showMore)}>
        Show {showMore ? 'Less' : 'More'}
      </button>
    </StyledProjectsSection>
  );
};

export default Projects;
