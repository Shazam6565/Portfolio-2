import React from 'react';
import styled from 'styled-components';

const CARDS = [
  {
    title: 'Force-Aware Peg Insertion',
    sentence:
      '4 PPO policy variants, 3 seeds each: force observation roughly doubled task success, from 7.3% to 14.2%.',
    tech: ['Isaac Lab', 'PPO', 'RL-Games'],
    link: 'https://github.com/Shazam6565/Policy-RL-Peg_insertion',
    linkLabel: 'Code',
  },
  {
    title: 'OpenUSD Digital-Twin Pipeline',
    sentence:
      'Git-versioned Isaac Sim workspace, scenes as diffable USD text, driven from a local agent.',
    tech: ['Isaac Sim', 'OpenUSD', 'Docker'],
    link: 'https://github.com/Shazam6565/isaac-sim-workspace',
    linkLabel: 'Code',
  },
  {
    title: 'InstruX',
    sentence:
      'Orchestrates across 6 tools (Isaac Sim, Isaac Lab, Cosmos, Omniverse, OpenUSD, and ROS2) into one robot-policy decision layer.',
    tech: ['Isaac Sim', 'Isaac Lab', 'OpenUSD'],
    link: 'https://instrux.world/',
    linkLabel: 'Live',
  },
];

const StyledEvidence = styled.section`
  padding: 40px 0;
  border-bottom: 1px solid var(--line);

  .section-label {
    margin: 0 0 20px;
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-muted);
  }
`;

const StyledCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--line);
  border: 1px solid var(--line);

  @media (${({ theme }) => theme.bp.tabletL}) {
    grid-template-columns: 1fr;
  }
`;

const StyledCard = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  background: var(--bg);

  h3 {
    margin: 0 0 10px;
    font-size: var(--fz-md);
  }

  .card__sentence {
    flex: 1;
    margin: 0 0 16px;
    color: var(--text-secondary);
    font-size: var(--fz-sm);
    line-height: 1.6;
  }

  .card__tech {
    margin: 0 0 16px;
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    color: var(--text-muted);

    span:not(:last-child)::after {
      content: '\\00B7';
      margin: 0 6px;
    }
  }

  a {
    ${({ theme }) => theme.mixins.inlineLink};
    font-size: var(--fz-sm);
    align-self: flex-start;
  }
`;

const Evidence = () => (
  <StyledEvidence>
    <p className="section-label">Explore some recent work</p>

    <StyledCardGrid>
      {CARDS.map(card => (
        <StyledCard key={card.title}>
          <h3>{card.title}</h3>
          <p className="card__sentence">{card.sentence}</p>
          <p className="card__tech">
            {card.tech.map(t => (
              <span key={t}>{t}</span>
            ))}
          </p>
          <a href={card.link} target="_blank" rel="noopener noreferrer">
            {card.linkLabel} &#8599;
          </a>
        </StyledCard>
      ))}
    </StyledCardGrid>
  </StyledEvidence>
);

export default Evidence;
