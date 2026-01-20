import React, { useState, useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import { srConfig } from '@config';
import { KEY_CODES } from '@utils';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledJobsSection = styled.section`
  max-width: 700px;

  .inner {
    display: block;

    @media (min-width: 700px) {
      min-height: 340px;
    }
  }
`;

const StyledTabList = styled.div`
  position: relative;
  z-index: 3;
  width: max-content;
  padding: 0;
  margin: 0;
  list-style: none;

  display: flex;
  overflow-x: auto;
  width: 100%;
  margin-bottom: 30px;

  /* Hide scrollbar */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 600px) {
    width: calc(100% + 50px);
    margin-left: -25px;
    padding-left: 25px;
  }

  li {
    &:first-of-type {
      @media (max-width: 600px) {
        margin-left: 25px;
      }
    }
    &:last-of-type {
      @media (max-width: 600px) {
        padding-right: 25px;
      }
    }
  }
`;

const StyledTabButton = styled.button`
  ${({ theme }) => theme.mixins.link};
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--tab-height);
  padding: 0 15px;
  border: 0;
  border-bottom: 2px solid var(--lightest-navy);
  background-color: transparent;
  color: ${({ isActive }) => (isActive ? 'var(--green)' : 'var(--slate)')};
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  text-align: center;
  white-space: nowrap;
  min-width: 120px;

  @media (max-width: 768px) {
    padding: 0 15px;
  }
  @media (max-width: 600px) {
    ${({ theme }) => theme.mixins.flexCenter};
    min-width: 120px;
    padding: 0 15px;
    border-bottom: 2px solid var(--lightest-navy);
  }

  &:hover,
  &:focus {
    background-color: var(--light-navy);
  }
`;

const StyledHighlight = styled.div`
  position: absolute;
  top: auto;
  bottom: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 2px;
  border-radius: var(--border-radius);
  background: var(--green);
  opacity: 0.5;
  transition: transform 0.25s cubic-bezier(0.645, 0.045, 0.355, 1),
    width 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition-delay: 0.1s;

  /* Dynamic styles injected via props/attrs in component */
  width: ${({ tabWidth }) => (tabWidth ? `${tabWidth}px` : '0px')};
  transform: translateX(${({ tabOffset }) => (tabOffset ? `${tabOffset}px` : '0px')});

  @media (max-width: 600px) {
    transform: translateX(calc(${({ activeTabId }) => activeTabId} * var(--tab-width)));
    /* Fallback for smaller screens matching previous mobile behavior if essential, 
       but the new JS calculation should work universally. 
       Removing media query reliance for positioning to keep it consistent. */
    transform: translateX(${({ tabOffset }) => (tabOffset ? `${tabOffset}px` : '0px')});
  }
`;

const StyledTabPanels = styled.div`
  position: relative;
  width: 100%;
  margin-left: 0;
`;

const StyledTabPanel = styled.div`
  width: 100%;
  height: auto;
  padding: 10px 5px;

  ul {
    ${({ theme }) => theme.mixins.fancyList};
  }

  h3 {
    margin-bottom: 2px;
    font-size: var(--fz-xxl);
    font-weight: 500;
    line-height: 1.3;

    .company {
      color: var(--green);
    }
  }

  .range {
    margin-bottom: 25px;
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
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

  const [activeTabId, setActiveTabId] = useState(0);
  const [tabFocus, setTabFocus] = useState(null);
  const tabs = useRef([]);
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // State for tab highlight
  const [tabWidth, setTabWidth] = useState(0);
  const [tabOffset, setTabOffset] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  // Update highlight position when active tab changes
  useEffect(() => {
    const activeTab = tabs.current[activeTabId];
    if (activeTab) {
      setTabWidth(activeTab.offsetWidth);
      setTabOffset(activeTab.offsetLeft);
    }
  }, [activeTabId]);

  const focusTab = () => {
    if (tabs.current[tabFocus]) {
      tabs.current[tabFocus].focus();
      return;
    }
    // If we're at the end, go to the start
    if (tabFocus >= tabs.current.length) {
      setTabFocus(0);
    }
    // If we're at the start, move to the end
    if (tabFocus < 0) {
      setTabFocus(tabs.current.length - 1);
    }
  };

  // Only re-run the effect if tabFocus changes
  useEffect(() => focusTab(), [tabFocus]);

  // Focus on tabs when using up & down arrow keys
  const onKeyDown = e => {
    switch (e.key) {
      case KEY_CODES.ARROW_UP:
      case KEY_CODES.ARROW_LEFT: {
        e.preventDefault();
        setTabFocus(tabFocus - 1);
        break;
      }

      case KEY_CODES.ARROW_DOWN:
      case KEY_CODES.ARROW_RIGHT: {
        e.preventDefault();
        setTabFocus(tabFocus + 1);
        break;
      }

      default: {
        break;
      }
    }
  };

  return (
    <StyledJobsSection id="jobs" ref={revealContainer}>
      <h2 className="numbered-heading">Where I’ve Worked</h2>

      <div className="inner">
        <StyledTabList role="tablist" aria-label="Job tabs" onKeyDown={e => onKeyDown(e)}>
          {jobsData &&
            jobsData.map(({ node }, i) => {
              const { company } = node.frontmatter;
              return (
                <StyledTabButton
                  key={i}
                  isActive={activeTabId === i}
                  onClick={() => setActiveTabId(i)}
                  ref={el => (tabs.current[i] = el)}
                  id={`tab-${i}`}
                  role="tab"
                  tabIndex={activeTabId === i ? '0' : '-1'}
                  aria-selected={activeTabId === i ? true : false}
                  aria-controls={`panel-${i}`}
                >
                  <span>{company}</span>
                </StyledTabButton>
              );
            })}
          <StyledHighlight tabWidth={tabWidth} tabOffset={tabOffset} />
        </StyledTabList>

        <StyledTabPanels>
          {jobsData &&
            jobsData.map(({ node }, i) => {
              const { frontmatter, html } = node;
              const { title, url, company, range } = frontmatter;

              return (
                <CSSTransition key={i} in={activeTabId === i} timeout={250} classNames="fade">
                  <StyledTabPanel
                    id={`panel-${i}`}
                    role="tabpanel"
                    tabIndex={activeTabId === i ? '0' : '-1'}
                    aria-labelledby={`tab-${i}`}
                    aria-hidden={activeTabId !== i}
                    hidden={activeTabId !== i}
                  >
                    <h3>
                      <span>{title}</span>
                      <span className="company">
                        &nbsp;@&nbsp;
                        <a href={url} className="inline-link">
                          {company}
                        </a>
                      </span>
                    </h3>

                    <p className="range">{range}</p>

                    <div dangerouslySetInnerHTML={{ __html: html }} />
                  </StyledTabPanel>
                </CSSTransition>
              );
            })}
        </StyledTabPanels>
      </div>
    </StyledJobsSection>
  );
};

export default Jobs;
