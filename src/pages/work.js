import React from 'react';
import { graphql } from 'gatsby';
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
  }
`;

const StyledProjectList = styled.ul`
  ${({ theme }) => theme.mixins.resetList};
  max-width: 720px;

  li {
    padding: 28px 0;
    border-bottom: 1px solid var(--line);

    &:first-child {
      padding-top: 0;
    }
  }

  .project__title {
    margin: 0 0 12px;
    font-size: var(--fz-lg);
    font-weight: 600;
    line-height: 1.3;
    color: var(--text);
  }

  .project__body {
    color: var(--text-secondary);

    p {
      margin: 0 0 1em;
      line-height: 1.6;
    }
  }

  .project__tech {
    margin: 10px 0 0;
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    color: var(--text-muted);

    span:not(:last-child):after {
      content: '·';
      margin: 0 8px;
    }
  }

  .project__links {
    display: flex;
    flex-wrap: wrap;
    gap: 18px;
    margin-top: 12px;
    font-size: var(--fz-sm);

    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }
  }
`;

const WorkPage = ({ location, data }) => {
  const projects = data.allMarkdownRemark.edges.map(({ node }) => node);

  return (
    <Layout location={location}>
      <Helmet title="Work" />

      <StyledMainContainer>
        <header>
          <p className="page-label">Work</p>
          <h1>Recent Work</h1>
        </header>

        <StyledProjectList>
          {projects.map(({ frontmatter, html }, i) => {
            const { title, tech, github, external } = frontmatter;

            return (
              <li key={i}>
                <h2 className="project__title">{title}</h2>
                <div className="project__body" dangerouslySetInnerHTML={{ __html: html }} />
                {tech && tech.length > 0 && (
                  <p className="project__tech">
                    {tech.map(t => (
                      <span key={t}>{t}</span>
                    ))}
                  </p>
                )}
                {(external || github) && (
                  <div className="project__links">
                    {external && (
                      <a href={external} target="_blank" rel="noopener noreferrer">
                        Live &#8599;
                      </a>
                    )}
                    {github && (
                      <a href={github} target="_blank" rel="noopener noreferrer">
                        Code &#8599;
                      </a>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </StyledProjectList>
      </StyledMainContainer>
    </Layout>
  );
};

WorkPage.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default WorkPage;

export const pageQuery = graphql`
  {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/content/featured/" } }
      sort: { fields: [frontmatter___date], order: ASC }
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
`;
