import React from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Layout } from '@components';
import { Icon } from '@components/icons';

const StyledHeader = styled.header`
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
`;

const StyledTableContainer = styled.div`
  margin: 40px 0 0;

  table {
    width: 100%;
    border-collapse: collapse;

    .hide-on-mobile {
      @media (max-width: 768px) {
        display: none;
      }
    }

    th {
      padding: 8px 10px;
      text-align: left;
      color: var(--text-muted);
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      font-weight: 500;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      border-bottom: 1px solid var(--line);
    }

    td {
      padding: 10px;
      text-align: left;
      vertical-align: top;
      border-bottom: 1px solid var(--line);
    }

    th:first-child,
    td:first-child {
      padding-left: 0;
    }

    th:last-child,
    td:last-child {
      padding-right: 0;
    }

    tbody tr {
      &:hover,
      &:focus-within {
        background-color: var(--surface);
      }
    }

    td {
      &.year {
        color: var(--text-muted);
        font-family: var(--font-mono);
        font-size: var(--fz-sm);
        white-space: nowrap;
      }

      &.title {
        color: var(--text);
        font-size: var(--fz-md);
        font-weight: 600;
        line-height: 1.4;
      }

      &.company {
        color: var(--text-secondary);
        font-size: var(--fz-sm);
        white-space: nowrap;
      }

      &.tech {
        color: var(--text-muted);
        font-family: var(--font-mono);
        font-size: var(--fz-xs);
        line-height: 1.5;

        .separator {
          margin: 0 5px;
        }
        span {
          display: inline-block;
        }
      }

      &.links {
        min-width: 80px;

        div {
          display: flex;
          align-items: center;
        }

        a {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          color: var(--text-secondary);

          &:hover,
          &:focus {
            color: var(--text);
          }
        }

        a + a {
          margin-left: 10px;
        }

        svg {
          width: 18px;
          height: 18px;
        }
      }
    }
  }
`;

const ArchivePage = ({ location, data }) => {
  const projects = data.allMarkdownRemark.edges;

  return (
    <Layout location={location}>
      <Helmet title="Archive" />

      <main>
        <StyledHeader>
          <p className="page-label">Archive</p>
          <h1>All Projects</h1>
          <p className="subtitle">A list of things I’ve worked on</p>
        </StyledHeader>

        <StyledTableContainer>
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Title</th>
                <th className="hide-on-mobile">Made at</th>
                <th className="hide-on-mobile">Built with</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {projects.length > 0 &&
                projects.map(({ node }, i) => {
                  const { date, github, external, title, tech, company } = node.frontmatter;
                  return (
                    <tr key={i}>
                      <td className="year">{`${new Date(date).getFullYear()}`}</td>

                      <td className="title">{title}</td>

                      <td className="company hide-on-mobile">
                        {company ? <span>{company}</span> : <span>—</span>}
                      </td>

                      <td className="tech hide-on-mobile">
                        {tech?.length > 0 &&
                          tech.map((item, i) => (
                            <span key={i}>
                              {item}
                              {i !== tech.length - 1 && <span className="separator">&middot;</span>}
                            </span>
                          ))}
                      </td>

                      <td className="links">
                        <div>
                          {external && (
                            <a href={external} aria-label="External Link">
                              <Icon name="External" />
                            </a>
                          )}
                          {github && (
                            <a href={github} aria-label="GitHub Link">
                              <Icon name="GitHub" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </StyledTableContainer>
      </main>
    </Layout>
  );
};
ArchivePage.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default ArchivePage;

export const pageQuery = graphql`
  {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/content/projects/" } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          frontmatter {
            date
            title
            tech
            github
            external
            ios
            android
            company
          }
          html
        }
      }
    }
  }
`;
