import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { StaticImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { Layout } from '@components';

const StyledMainContainer = styled.main`
  max-width: 720px;

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
      margin: 0;
      font-size: var(--fz-heading);
    }
  }
`;

const ProfilePhoto = styled.div`
  width: 168px;
  border: 1px solid var(--line);
  line-height: 0;
  margin: 0 0 24px;

  img {
    filter: grayscale(100%);
  }
`;

const StyledSection = styled.section`
  margin-bottom: 48px;

  h2 {
    margin: 0 0 16px;
    font-size: var(--fz-xl);
  }

  p {
    margin: 0 0 16px;
    color: var(--text-secondary);
    line-height: 1.6;

    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }
  }
`;

const SkillGroups = styled.div`
  display: flex;
  flex-direction: column;
  gap: 13px;

  .grp__label {
    display: block;
    margin-bottom: 3px;
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: var(--text-muted);
  }
  .grp__items {
    font-size: var(--fz-md);
    color: var(--text-secondary);
  }
`;

const SKILL_GROUPS = [
  { label: 'Languages', items: ['Python', 'TypeScript', 'C++'] },
  { label: 'AI & agents', items: ['LangChain', 'LangGraph', 'RAG', 'PyTorch', 'TensorFlow'] },
  { label: 'Backend & data', items: ['Django', 'FastAPI', 'PostgreSQL', 'OpenSearch', 'FAISS'] },
  { label: 'Infrastructure', items: ['AWS', 'Docker', 'Jenkins', 'New Relic'] },
  {
    label: 'Physical AI & simulation',
    items: ['OpenUSD', 'NVIDIA Omniverse', 'Isaac Sim', 'ROS2'],
  },
];

const AboutPage = ({ location }) => (
  <Layout location={location}>
    <Helmet title="About" />

    <StyledMainContainer>
      <header>
        <p className="page-label">About</p>
        <h1>Profile</h1>
      </header>

      <StyledSection>
        <ProfilePhoto>
          <StaticImage
            src="../images/hero.png"
            alt="Shaurya Tiwari"
            width={336}
            placeholder="blurred"
            formats={['auto', 'webp', 'avif']}
          />
        </ProfilePhoto>
        <p>
          I&apos;m Shaurya Tiwari, an AI Software Engineer with a Master&apos;s in Computer Science
          from Florida State University.
        </p>
        <p>
          At{' '}
          <a href="https://www.usnews.com/" target="_blank" rel="noopener noreferrer">
            U.S. News &amp; World Report
          </a>{' '}
          I build production AI infrastructure: agentic RAG systems, backend platforms, vector
          retrieval, streaming APIs, guardrails, and observability for AI products used across
          several business verticals.
        </p>
        <p>
          My focus now is Physical AI. I&apos;m taking that same backend and systems experience into
          simulation workflows, OpenUSD scene and data pipelines, robot-policy evaluation, and
          closed-loop retraining, through{' '}
          <a href="https://instrux.world/" target="_blank" rel="noopener noreferrer">
            InstruX
          </a>
          .
        </p>
        <p>
          Before this I worked across data engineering, research, DevOps, and web platforms, which
          is where I picked up the backend, ML, and infrastructure judgment I lean on today.
        </p>
      </StyledSection>

      <StyledSection>
        <h2>Toolbox</h2>
        <p>The stack I reach for, by area:</p>
        <SkillGroups>
          {SKILL_GROUPS.map(g => (
            <div key={g.label}>
              <span className="grp__label">{g.label}</span>
              <span className="grp__items">{g.items.join(' · ')}</span>
            </div>
          ))}
        </SkillGroups>
      </StyledSection>

      <StyledSection>
        <h2>Beyond Work</h2>
        <p>
          Off the clock I&apos;m occasionally corny on{' '}
          <a
            href="https://www.youtube.com/channel/UC1sfE7YdmxsUdJaOo4vhqVQ"
            target="_blank"
            rel="noopener noreferrer"
          >
            my YouTube livestream
          </a>
          , figuring life out with LLMs.
        </p>
      </StyledSection>
    </StyledMainContainer>
  </Layout>
);

AboutPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default AboutPage;
