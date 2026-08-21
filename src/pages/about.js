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
  margin: 0 auto 24px;

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

    strong {
      color: var(--text);
      font-weight: 600;
    }

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
          I&apos;m <strong>Shaurya Tiwari</strong>, an AI Software Engineer with a{' '}
          <strong>Master&apos;s in Computer Science</strong> from{' '}
          <strong>Florida State University</strong>.
        </p>
        <p>
          My direction is <strong>robot learning through simulation</strong>: building manipulation
          environments, training policies, and studying how learned skills can{' '}
          <strong>retain, transfer, and reuse</strong> across tasks, objects, and domains instead of
          being relearned from scratch. That work runs through{' '}
          <a href="https://instrux.world/" target="_blank" rel="noopener noreferrer">
            InstruX
          </a>
          , a decision layer I&apos;m building over Isaac Sim, Isaac Lab, and OpenUSD for the
          robot-policy lifecycle: diagnosing failures, generating simulation scenarios, and
          triggering retraining when deployed systems drift.
        </p>
        <p>
          Day to day, at{' '}
          <a href="https://www.usnews.com/" target="_blank" rel="noopener noreferrer">
            U.S. News &amp; World Report
          </a>{' '}
          I build <strong>production AI infrastructure</strong> (agentic RAG systems, backend
          platforms, vector retrieval, and streaming APIs) with the{' '}
          <strong>guardrails and observability</strong> that keep AI products reliable across
          several business verticals. That systems discipline is what I&apos;m now applying to
          simulation and robot-policy evaluation.
        </p>
        <p>
          Before this I worked across <strong>data engineering</strong>, <strong>research</strong>,{' '}
          <strong>DevOps</strong>, and <strong>web platforms</strong>, which is where I picked up
          the backend, ML, and infrastructure judgment I lean on today.
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
