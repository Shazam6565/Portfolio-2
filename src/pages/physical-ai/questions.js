import React from 'react';
import { graphql, Link } from 'gatsby';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Layout } from '@components';

const StyledContainer = styled.main`
  max-width: 720px;
`;

const StyledHeader = styled.header`
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
    margin: 0;
    font-size: var(--fz-heading);
  }
`;

const StyledContent = styled.div`
  margin-bottom: 60px;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 2em 0 1em;
  }

  p {
    margin: 1em 0;
    line-height: 1.6;
    color: var(--text-secondary);
  }

  li {
    line-height: 1.6;
    color: var(--text-secondary);
  }

  a {
    ${({ theme }) => theme.mixins.inlineLink};
  }
`;

const PhysicalAiQuestionsPage = ({ location, data }) => {
  const { frontmatter, html } = data.markdownRemark;

  return (
    <Layout location={location}>
      <Helmet title="Physical AI — Questions to Ask" />

      <StyledContainer>
        <StyledHeader>
          <span className="breadcrumb">
            <span className="arrow">&larr;</span>
            <Link to="/">Home</Link>
          </span>

          <p className="page-label">Physical AI</p>
          <h1>{frontmatter.title}</h1>
        </StyledHeader>

        <StyledContent dangerouslySetInnerHTML={{ __html: html }} />
      </StyledContainer>
    </Layout>
  );
};

PhysicalAiQuestionsPage.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default PhysicalAiQuestionsPage;

export const pageQuery = graphql`
  {
    markdownRemark(fileAbsolutePath: { regex: "/content/physical-ai/questions-to-ask/" }) {
      html
      frontmatter {
        title
      }
    }
  }
`;
