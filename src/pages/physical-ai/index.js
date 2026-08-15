import React from 'react';
import { Link } from 'gatsby';
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

const StyledBody = styled.div`
  margin-bottom: 40px;

  p {
    margin: 0 0 16px;
    color: var(--text-secondary);
    line-height: 1.6;

    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }
  }
`;

const Tech = styled.p`
  margin: 0 0 32px !important;
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  color: var(--text-muted) !important;

  span:not(:last-child):after {
    content: '·';
    margin: 0 8px;
  }
`;

const StyledLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 48px;
  font-size: var(--fz-sm);

  a {
    ${({ theme }) => theme.mixins.inlineLink};
  }
`;

const StyledExploreList = styled.ul`
  ${({ theme }) => theme.mixins.resetList};

  li {
    padding: 16px 0;
    border-top: 1px solid var(--line);

    &:last-child {
      border-bottom: 1px solid var(--line);
    }
  }

  a {
    display: block;
    font-size: var(--fz-lg);
    font-weight: 600;
    color: var(--text);

    &:hover,
    &:focus {
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }
`;

const TECH = [
  'OpenUSD',
  'NVIDIA Omniverse',
  'Isaac Sim',
  'Isaac Lab',
  'Cosmos',
  'ROS2',
  'Simulation Workflows',
  'Agentic Orchestration',
];

const PhysicalAiIndexPage = ({ location }) => (
  <Layout location={location}>
    <Helmet title="Physical AI" />

    <StyledContainer>
      <StyledHeader>
        <span className="breadcrumb">
          <span className="arrow">&larr;</span>
          <Link to="/">Home</Link>
        </span>

        <p className="page-label">Physical AI</p>
        <h1>Overview</h1>
      </StyledHeader>

      <StyledBody>
        <p>
          Physical AI is the next technical direction I&apos;m building toward. Through{' '}
          <a href="https://instrux.world/" target="_blank" rel="noopener noreferrer">
            InstruX
          </a>
          , I&apos;m exploring how production AI systems, agent orchestration, simulation tooling,
          and robot-policy evaluation come together into closed-loop workflows for real-world
          robotics.
        </p>
        <p>
          The focus isn&apos;t hardware or flashy demos. It&apos;s the infrastructure that diagnoses
          policy failures, generates targeted simulation scenarios, checks deployment readiness, and
          retrains models when they drift in the field.
        </p>
      </StyledBody>

      <Tech>
        {TECH.map(t => (
          <span key={t}>{t}</span>
        ))}
      </Tech>

      <StyledLinks>
        <a href="https://instrux.world/" target="_blank" rel="noopener noreferrer">
          Visit InstruX &#8599;
        </a>
      </StyledLinks>

      <StyledExploreList>
        <li>
          <Link to="/physical-ai/projects">Projects &rarr;</Link>
        </li>
        <li>
          <Link to="/physical-ai/questions">Questions to Ask &rarr;</Link>
        </li>
      </StyledExploreList>
    </StyledContainer>
  </Layout>
);

PhysicalAiIndexPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default PhysicalAiIndexPage;
