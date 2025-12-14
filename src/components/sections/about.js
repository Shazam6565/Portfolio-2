import React, { useEffect, useRef } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledAboutSection = styled.section`
  max-width: 900px;

  .inner {
    display: grid;
    grid-template-columns: 3fr 2fr;
    grid-gap: 50px;

    @media (max-width: 768px) {
      display: block;
    }
  }
`;
const StyledText = styled.div`
  ul.skills-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(140px, 200px));
    grid-gap: 0 10px;
    padding: 0;
    margin: 20px 0 0 0;
    overflow: hidden;
    list-style: none;

    li {
      position: relative;
      margin-bottom: 10px;
      padding-left: 20px;
      font-family: var(--font-mono);
      font-size: var(--fz-xs);

      &:before {
        content: '▹';
        position: absolute;
        left: 0;
        color: var(--green);
        font-size: var(--fz-sm);
        line-height: 12px;
      }
    }
  }
`;
const StyledPic = styled.div`
  position: relative;
  max-width: 700px;

  @media (max-width: 768px) {
    margin: 50px auto 0;
    width: 70%;
  }

  .wrapper {
    ${({ theme }) => theme.mixins.boxShadow};
    display: block;
    position: relative;
    width: 100%;
    border-radius: var(--border-radius);
    background-color: var(--green);

    &:hover,
    &:focus {
      outline: 0;
      transform: translate(-4px, -4px);

      &:after {
        transform: translate(8px, 8px);
      }

      .img {
        filter: none;
        mix-blend-mode: normal;
      }
    }

    .img {
      position: relative;
      border-radius: var(--border-radius);
      mix-blend-mode: multiply;
      filter: grayscale(100%) contrast(1);
      transition: var(--transition);
    }

    &:before,
    &:after {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: var(--border-radius);
      transition: var(--transition);
    }

    &:before {
      top: 0;
      left: 0;
      background-color: var(--navy);
      mix-blend-mode: screen;
    }

    &:after {
      border: 2px solid var(--green);
      top: 14px;
      left: 14px;
      z-index: -1;
    }
  }
`;

const About = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  const skills = [
    'Python',
    'Django',
    'LangChain/LangGraph',
    'Proprietieary Models',
    'Open-Source LLMs',
    'Airflow [ETL]',
    'React',
  ];

  return (
    <StyledAboutSection id="about" ref={revealContainer}>
      <h2 className="numbered-heading">About Me</h2>

      <div className="inner">
        <StyledText>
          <div>
            <p>
              Hello! I'm Shaurya Tiwari, a software engineer with a Master's degree in Computer
              Science from Florida State University, currently working on production AI systems at{' '}
              <a href="https://www.usnews.com/">U.S. News &amp; World Report</a>. I specialize in
              building reliable backend platforms, data-driven AI applications, and intelligent
              systems that bridge machine learning with real-world software products. In my work, I
              focus on designing scalable architectures, integrating AI safely into production
              systems, and solving problems where correctness and performance truly matter.
            </p>

            <p>
              Prior to this, I’ve had the privilege of working at a{' '}
              <a href="https://www.coaps.fsu.edu/about-us">Data product Company</a>,{' '}
              <a href="https://www.sc.fsu.edu/">Research department</a>, a{' '}
              <a href="https://www.itsabacus.com/">Software consultancy</a>, and a{' '}
              <a href="https://cart-geek.com/">UI development studio</a>. My main focus these days
              is building artificially smart, inclusive products and digital experiences. Feel free
              to explore my portfolio to learn more about my projects and experience. Also, don't
              forget to check out my{' '}
              <a href="https://www.shauryatiwari.com/chat"> AI Assistant here</a> in case you want
              to learn more about me.
            </p>

            <p>
              If you really made it till here, then you must check out me being cringe on{' '}
              <a href="https://www.youtube.com/channel/UC1sfE7YdmxsUdJaOo4vhqVQ">
                my YouTube Livestream channel
              </a>{' '}
              that features me trying to figure my life out with AI as the side character.
            </p>

            <p>Here are a few technologies I’ve been working with recently:</p>
          </div>

          <ul className="skills-list">
            {skills && skills.map((skill, i) => <li key={i}>{skill}</li>)}
          </ul>
        </StyledText>

        <StyledPic>
          <div className="wrapper">
            <StaticImage
              className="img"
              src="../../images/myheadshot.jpg"
              width={500}
              quality={95}
              formats={['AUTO', 'WEBP', 'AVIF']}
              alt="Headshot"
            />
          </div>
        </StyledPic>
      </div>
    </StyledAboutSection>
  );
};

export default About;
