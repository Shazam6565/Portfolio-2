import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';

const StyledFeaturedList = styled.ul`
  ${({ theme }) => theme.mixins.resetList};

  .featured-project {
    padding: 32px 0;
    border-top: 1px solid var(--line);

    &:last-of-type {
      padding-bottom: 0;
    }

    .project-title {
      margin: 0 0 10px;
      font-size: var(--fz-xl);

      a {
        ${({ theme }) => theme.mixins.inlineLink};
      }
    }

    .project-description {
      color: var(--text-secondary);
      font-size: var(--fz-md);

      a {
        ${({ theme }) => theme.mixins.inlineLink};
      }
    }

    .project-tech-list {
      ${({ theme }) => theme.mixins.resetList};
      display: flex;
      flex-wrap: wrap;
      margin-top: 12px;
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      color: var(--text-muted);

      li:not(:last-of-type):after {
        content: '·';
        margin: 0 8px;
      }
    }

    .project-links {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-top: 12px;

      a {
        color: var(--text);
        font-family: var(--font-mono);
        font-size: var(--fz-xs);
        text-decoration: underline;
        text-decoration-color: var(--line);
        text-underline-offset: 3px;

        &:hover,
        &:focus-visible {
          text-decoration-color: var(--text);
        }
      }
    }
  }
`;

const Featured = () => {
  const data = useStaticQuery(graphql`
    {
      featured: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/featured/" } }
        sort: { fields: [frontmatter___date], order: ASC }
      ) {
        edges {
          node {
            frontmatter {
              title
              cover {
                childImageSharp {
                  gatsbyImageData(width: 700, placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
                }
              }
              tech
              github
              external
              cta
            }
            html
          }
        }
      }
    }
  `);

  const featuredProjects = data.featured.edges.filter(({ node }) => node);

  return (
    <section id="projects">
      <h2 className="numbered-heading">Some Things I’ve Built</h2>

      <StyledFeaturedList>
        {featuredProjects &&
          featuredProjects.map(({ node }, i) => {
            const { frontmatter, html } = node;
            const { external, title, tech, github, cta } = frontmatter;
            const titleLink = external || github;

            return (
              <li className="featured-project" key={i}>
                <h3 className="project-title">
                  {titleLink ? <a href={titleLink}>{title}</a> : title}
                </h3>

                <div className="project-description" dangerouslySetInnerHTML={{ __html: html }} />

                {tech && tech.length > 0 && (
                  <ul className="project-tech-list">
                    {tech.map((techItem, j) => (
                      <li key={j}>{techItem}</li>
                    ))}
                  </ul>
                )}

                <div className="project-links">
                  {github && (
                    <a href={github} aria-label="GitHub Link" target="_blank" rel="noreferrer">
                      GitHub
                    </a>
                  )}
                  {external && (
                    <a href={external} aria-label="Live Link" target="_blank" rel="noreferrer">
                      Live
                    </a>
                  )}
                  {cta && (
                    <a href={cta} aria-label="Course Link" target="_blank" rel="noreferrer">
                      Learn More
                    </a>
                  )}
                </div>
              </li>
            );
          })}
      </StyledFeaturedList>
    </section>
  );
};

export default Featured;
