import React from 'react';
import { Link, graphql } from 'gatsby';
import kebabCase from 'lodash/kebabCase';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Layout } from '@components';

const StyledTagContainer = styled.main`
  h1 {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 30px;
    font-size: var(--fz-heading);

    .all-tags-link {
      ${({ theme }) => theme.mixins.inlineLink};
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      font-weight: 400;
    }
  }

  ul {
    ${({ theme }) => theme.mixins.resetList};

    li {
      padding: 20px 0;
      border-bottom: 1px solid var(--line);

      &:first-child {
        padding-top: 0;
      }

      h2 {
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

        .tag {
          margin-right: 10px;
        }
      }
    }
  }
`;

const TagTemplate = ({ pageContext, data, location }) => {
  const { tag } = pageContext;
  const { edges } = data.allMarkdownRemark;

  return (
    <Layout location={location}>
      <Helmet title={`Tagged: #${tag}`} />

      <StyledTagContainer>
        <span className="breadcrumb">
          <span className="arrow">&larr;</span>
          <Link to="/pensieve">All memories</Link>
        </span>

        <h1>
          <span>#{tag}</span>
          <span>
            <Link to="/pensieve/tags" className="all-tags-link">
              View all tags
            </Link>
          </span>
        </h1>

        <ul>
          {edges.map(({ node }) => {
            const { title, slug, date, tags } = node.frontmatter;
            return (
              <li key={slug}>
                <h2>
                  <Link to={slug}>{title}</Link>
                </h2>
                <p className="meta">
                  <time>
                    {new Date(date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <span>&nbsp;&mdash;&nbsp;</span>
                  {tags &&
                    tags.length > 0 &&
                    tags.map((tag, i) => (
                      <Link key={i} to={`/pensieve/tags/${kebabCase(tag)}/`} className="tag">
                        #{tag}
                      </Link>
                    ))}
                </p>
              </li>
            );
          })}
        </ul>
      </StyledTagContainer>
    </Layout>
  );
};

export default TagTemplate;

TagTemplate.propTypes = {
  pageContext: PropTypes.shape({
    tag: PropTypes.string.isRequired,
  }),
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      totalCount: PropTypes.number.isRequired,
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
            }),
          }),
        }).isRequired,
      ),
    }),
  }),
  location: PropTypes.object,
};

export const pageQuery = graphql`
  query ($tag: String!) {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          frontmatter {
            title
            description
            date
            slug
            tags
          }
        }
      }
    }
  }
`;
