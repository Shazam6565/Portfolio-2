import React from 'react';
import styled from 'styled-components';

const StyledAboutSection = styled.section``;
const StyledText = styled.div`
  ul.skills-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(140px, 200px));
    grid-gap: 0 10px;
    margin: 20px 0 0;
    overflow: hidden;
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    color: var(--text-muted);

    li {
      margin-bottom: 6px;
    }
  }
`;
const About = () => {
  const skills = [
    'Python',
    'Django',
    'LangChain/LangGraph',
    'AWS Cloud Services',
    'Gitlab',
    'New Relic',
    'Jenkins',
    'Docker',
  ];

  return (
    <StyledAboutSection id="about">
      <h2 className="numbered-heading">About Me</h2>

      <div className="inner">
        <StyledText>
          <div>
            <p>
              Hello! I'm Shaurya Tiwari, an AI software engineer with a Master's degree in Computer
              Science from Florida State University, currently working on production AI
              infrastructure to support 9+ verticals at{' '}
              <a href="https://www.usnews.com/">U.S. News &amp; World Report</a>. I specialize in
              building reliable backend platforms, data-driven AI applications, and intelligent
              systems that bridge AI with real-world software products. In my work, I focus on
              designing scalable architectures, integrating AI safely into production systems, and
              solving problems where correctness and performance truly matter.
            </p>

            <p>
              Prior to this, I’ve had the privilege of working at a{' '}
              <a href="https://www.coaps.fsu.edu/about-us">Data product Organization</a>,{' '}
              <a href="https://www.sc.fsu.edu/">Research department at Florida State University</a>,{' '}
              <a href="https://www.itsabacus.com/">Software consultancy</a>, and{' '}
              <a href="https://cart-geek.com/">UI/UX designing studio</a>. Feel free to explore my
              portfolio to learn more about my projects and experience. Also, don't forget to check
              out my <a href="https://www.shauryatiwari.com/chat"> AI Assistant here</a> in case you
              want to learn more about me or ask specific questions related to my come up.
            </p>

            <p>
              If you really made it till here, then you must check out me being corny on{' '}
              <a href="https://www.youtube.com/channel/UC1sfE7YdmxsUdJaOo4vhqVQ">
                my YouTube Livestream channel
              </a>{' '}
              that features me trying to figure my life out with LLMs.
            </p>

            <p>Here are a few technologies I’ve been working with recently:</p>
          </div>

          <ul className="skills-list fancy-list">
            {skills && skills.map((skill, i) => <li key={i}>{skill}</li>)}
          </ul>
        </StyledText>
      </div>
    </StyledAboutSection>
  );
};

export default About;
