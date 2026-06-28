import React from 'react';
import { graphql, Link } from 'gatsby';
import kebabCase from 'lodash/kebabCase';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Layout } from '@components';

const StyledMainContainer = styled.main`
  & > header {
    margin-bottom: 40px;

    h1 {
      margin: 0 0 8px;
      font-size: var(--fz-heading);
    }

    .subtitle {
      margin: 0;
    }
  }
`;

const StyledPostList = styled.ul`
  ${({ theme }) => theme.mixins.resetList};

  li {
    padding: 20px 0;
    border-bottom: 1px solid var(--line);

    &:first-child {
      padding-top: 0;
    }
  }

  .post__title {
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

  .post__date {
    color: var(--text-muted);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
  }

  .post__desc {
    margin: 6px 0 0;
    color: var(--text-secondary);
    font-size: var(--fz-sm);
  }

  ul.post__tags {
    ${({ theme }) => theme.mixins.resetList};
    display: flex;
    flex-wrap: wrap;
    margin-top: 6px;

    li {
      padding: 0;
      border: 0;

      &:not(:last-of-type) {
        margin-right: 12px;
      }

      a {
        color: var(--text-muted);
        font-family: var(--font-mono);
        font-size: var(--fz-xs);

        &:hover,
        &:focus {
          color: var(--text);
          text-decoration: underline;
          text-underline-offset: 3px;
        }
      }
    }
  }
`;

const PensievePage = ({ location, data }) => {
  const posts = data.allMarkdownRemark.edges;

  return (
    <Layout location={location}>
      <Helmet title="Pensieve" />

      <StyledMainContainer>
        <header>
          <h1>Pensieve</h1>
          <p className="subtitle">
            <a href="https://www.wizardingworld.com/writing-by-jk-rowling/pensieve">
              a collection of memories
            </a>
          </p>
        </header>

        <StyledPostList>
          {posts.length > 0 &&
            posts.map(({ node }, i) => {
              const { frontmatter } = node;
              const { title, description, slug, date, tags } = frontmatter;
              const formattedDate = new Date(date).toLocaleDateString();

              return (
                <li key={i}>
                  <h2 className="post__title">
                    <Link to={slug}>{title}</Link>
                  </h2>
                  <time className="post__date">{formattedDate}</time>
                  {description && <p className="post__desc">{description}</p>}
                  {tags && tags.length > 0 && (
                    <ul className="post__tags">
                      {tags.map((tag, i) => (
                        <li key={i}>
                          <Link to={`/pensieve/tags/${kebabCase(tag)}/`}>#{tag}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
        </StyledPostList>
      </StyledMainContainer>
    </Layout>
  );
};

PensievePage.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default PensievePage;

export const pageQuery = graphql`
  {
    allMarkdownRemark(
      filter: {
        fileAbsolutePath: { regex: "/content/posts/" }
        frontmatter: { draft: { ne: true } }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          frontmatter {
            title
            description
            slug
            date
            tags
            draft
          }
          html
        }
      }
    }
  }
`;
