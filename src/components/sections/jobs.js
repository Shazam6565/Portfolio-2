import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';

const StyledJobsList = styled.ul`
  ${({ theme }) => theme.mixins.resetList};

  .job {
    &:not(:first-of-type) {
      margin-top: 28px;
    }

    .job-title {
      margin: 0 0 2px;
      font-size: var(--fz-md);
      font-weight: 600;
      color: var(--text);
      line-height: 1.4;

      .company a {
        ${({ theme }) => theme.mixins.inlineLink};
        font-weight: 600;
      }
    }

    .range {
      margin: 0 0 10px;
      color: var(--text-muted);
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
    }

    .job-description ul {
      ${({ theme }) => theme.mixins.fancyList};
    }
  }
`;

const Jobs = () => {
  const data = useStaticQuery(graphql`
    query {
      jobs: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/jobs/" } }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            frontmatter {
              title
              company
              location
              range
              url
            }
            html
          }
        }
      }
    }
  `);

  const jobsData = data.jobs.edges;

  return (
    <section id="jobs">
      <h2 className="numbered-heading">Where I’ve Worked</h2>

      <StyledJobsList>
        {jobsData &&
          jobsData.map(({ node }, i) => {
            const { frontmatter, html } = node;
            const { title, url, company, range } = frontmatter;

            return (
              <li className="job" key={i}>
                <h3 className="job-title">
                  <span>{title}</span>
                  <span className="company">
                    &nbsp;@&nbsp;
                    <a href={url} className="inline-link">
                      {company}
                    </a>
                  </span>
                </h3>

                <p className="range">{range}</p>

                <div className="job-description" dangerouslySetInnerHTML={{ __html: html }} />
              </li>
            );
          })}
      </StyledJobsList>
    </section>
  );
};

export default Jobs;
