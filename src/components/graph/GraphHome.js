import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link, navigate, useStaticQuery, graphql } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { email, socialMedia } from '@config';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const ext = url => ({ href: url, target: '_blank', rel: 'noopener noreferrer' });
const rad = deg => (deg * Math.PI) / 180;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const shortCompany = c => c.split(' & ')[0].split(' at ')[0].split(',')[0].trim();

/* Concise but fully-readable labels for the featured projects — the raw
   titles were getting truncated into "…" around the graph. */
const PROJECT_LABELS = {
  'Academic Insights AI Assistant': 'Academic Insights AI',
  'Personalized Portfolio AI Assistant': 'Portfolio Assistant',
  'Transformer -Text Completion Model': 'Transformer Text Model',
  'POView — Autonomous Urban Intelligence': 'POView',
};
const projectLabel = t => PROJECT_LABELS[t] || t;

/* ------------------------------------------------------------------ */
/* Styled                                                              */
/* ------------------------------------------------------------------ */
const Wrap = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 580px;
  overflow: hidden;

  @media (max-width: 760px) {
    height: auto;
    min-height: 0;
    overflow: visible;
    padding: 92px 22px 64px;
  }
`;

const Edges = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;

  line {
    stroke: var(--line);
    stroke-width: 1;
    transition: x1 0.4s ease, y1 0.4s ease, x2 0.4s ease, y2 0.4s ease, stroke 0.25s ease,
      opacity 0.25s ease;
  }
  line.lit {
    stroke: var(--text);
  }
  line.dim {
    opacity: 0.28;
  }
  line.sub {
    stroke: var(--text-muted);
    animation: edgeIn 0.35s ease both;
  }
  circle {
    fill: var(--text-muted);
    transition: cx 0.4s ease, cy 0.4s ease, opacity 0.25s ease;
  }

  @keyframes edgeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const nodeBase = `
  position: absolute;
  transform: translate(-50%, -50%);
  transition: left 0.4s ease, top 0.4s ease, opacity 0.3s ease;
  background: var(--bg);
  border: 0;
  color: var(--text);
  cursor: pointer;
  text-align: center;
  text-decoration: none;
`;

const Hub = styled.button`
  ${nodeBase};
  z-index: 4;
  padding: 8px 16px;
  /* No opaque box — the rays are trimmed to stop just outside the text. */
  background: transparent;

  .name {
    margin: 0;
    font-weight: 500;
    font-size: clamp(28px, 3.6vw, 46px);
    line-height: 1.04;
    color: var(--text);
  }
  .rule {
    width: 40px;
    height: 1px;
    margin: 12px auto;
    background: var(--text-muted);
  }
  .role {
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-muted);
  }
`;

const Primary = styled.button`
  ${nodeBase};
  z-index: 3;
  padding: 7px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  white-space: nowrap;

  &.dim {
    opacity: 0.32;
  }

  .num {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.12em;
    color: var(--text-muted);
  }
  .label {
    font-size: var(--fz-lg);
    font-style: italic;
    transition: var(--transition);
  }

  &:hover .label,
  &:focus-visible .label,
  &.open .label {
    text-decoration: underline;
    text-underline-offset: 4px;
  }
`;

const Sub = styled.button`
  ${nodeBase};
  z-index: 3;
  padding: 6px 10px;
  max-width: 138px;
  animation: rayOut 0.42s cubic-bezier(0.2, 0.7, 0.3, 1) both;

  .sub-label {
    font-size: var(--fz-sm);
    line-height: 1.2;
    color: var(--text);
    transition: var(--transition);
  }
  .sub-meta {
    margin-top: 2px;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.06em;
    color: var(--text-muted);
  }

  &:hover .sub-label,
  &:focus-visible .sub-label,
  &.active .sub-label {
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  &.active .sub-label {
    font-weight: 600;
  }

  /* Each ray flies out from the sun (centre) to its endpoint. */
  @keyframes rayOut {
    from {
      opacity: 0;
      transform: translate(calc(-50% + var(--dx, 0px)), calc(-50% + var(--dy, 0px))) scale(0.7);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
`;

/* Experience is shown as an ordered timeline rather than radial rays, so the
   career reads as a clear sequence (most recent first). */
const Timeline = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  /* Re-centres in the space left of the detail pane instead of being clipped. */
  transition: right 0.42s cubic-bezier(0.2, 0.7, 0.3, 1);

  .tl-inner {
    width: min(540px, 86vw);
    pointer-events: auto;
  }

  @keyframes tlIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes tlItemIn {
    from {
      opacity: 0;
      transform: translateY(7px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .tl-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 14px;
    animation: tlIn 0.4s cubic-bezier(0.2, 0.7, 0.3, 1) both;
  }
  .tl-title {
    font-size: var(--fz-xxl);
    font-style: italic;
    color: var(--text);
  }
  .tl-close {
    background: none;
    border: 0;
    cursor: pointer;
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);

    &:hover,
    &:focus-visible {
      color: var(--text);
    }
  }

  .tl-list {
    position: relative;
    max-height: 72vh;
    overflow-y: auto;

    &:before {
      content: '';
      position: absolute;
      left: 5px;
      top: 10px;
      bottom: 14px;
      width: 1px;
      background: var(--line);
    }
  }

  .tl-item {
    position: relative;
    display: block;
    width: 100%;
    text-align: left;
    background: none;
    border: 0;
    cursor: pointer;
    padding: 5px 0 11px 26px;
    animation: tlItemIn 0.4s cubic-bezier(0.2, 0.7, 0.3, 1) both;

    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 11px;
      width: 11px;
      height: 11px;
      border: 1px solid var(--text-muted);
      border-radius: 50%;
      background: var(--bg);
      transition: var(--transition);
    }
    &.current:before {
      background: var(--text);
      border-color: var(--text);
    }
  }

  .tl-date {
    display: flex;
    align-items: center;
    gap: 9px;
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    color: var(--text-muted);
  }
  .tl-now {
    padding: 1px 7px;
    border: 1px solid var(--text);
    color: var(--text);
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .tl-role {
    margin: 3px 0 1px;
    font-size: var(--fz-lg);
    line-height: 1.2;
    color: var(--text);
  }
  .tl-company {
    font-size: var(--fz-md);
    line-height: 1.2;
    color: var(--text-secondary);
  }

  .tl-item:hover .tl-role,
  .tl-item:focus-visible .tl-role,
  .tl-item.active .tl-role {
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .tl-item.active .tl-role {
    font-weight: 600;
  }
`;

const Pane = styled.aside`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 25;
  width: clamp(340px, 38vw, 560px);
  display: flex;
  flex-direction: column;
  background: var(--bg);
  border-left: 1px solid var(--text);
  transform: translateX(100%);
  transition: transform 0.38s cubic-bezier(0.2, 0.7, 0.3, 1);

  &.open {
    transform: translateX(0);
  }

  .pane__head {
    flex: none;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding: 26px 30px 18px;
    border-bottom: 1px solid var(--line);
  }
  .pane__chapter {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-muted);
  }
  .pane__title {
    margin: 6px 0 0;
    font-size: var(--fz-xxl);
    font-weight: 500;
    color: var(--text);
  }
  .pane__close {
    flex: none;
    margin-top: 2px;
    background: transparent;
    border: 0;
    color: var(--text-muted);
    font-size: 24px;
    line-height: 1;
    cursor: pointer;
    transition: var(--transition);

    &:hover,
    &:focus-visible {
      color: var(--text);
    }
  }
  .pane__body {
    overflow-y: auto;
    padding: 22px 30px 32px;
    font-size: var(--fz-md);
    color: var(--text-secondary);

    p {
      margin: 0 0 14px;
    }
    .rich ul,
    .rich ol {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .rich li {
      position: relative;
      list-style: none;
      padding-left: 18px;
      margin-bottom: 7px;
    }
    .rich li:before {
      content: '–';
      position: absolute;
      left: 0;
      color: var(--text-muted);
    }
    a {
      color: var(--text);
      text-decoration: underline;
      text-decoration-color: var(--line);
      text-underline-offset: 3px;
    }
    a:hover,
    a:focus-visible {
      text-decoration-color: var(--text);
    }
  }

  @media (max-width: 760px) {
    width: 100%;
    border-left: 0;
  }
`;

const Meta = styled.p`
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  color: var(--text-muted) !important;
  margin: 0 0 14px !important;
`;

const Tech = styled.p`
  margin: 10px 0 0 !important;
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  color: var(--text-muted) !important;

  span:not(:last-child):after {
    content: '·';
    margin: 0 8px;
  }
`;

const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  margin-top: 14px;
  font-size: var(--fz-sm);
`;

const ProfilePhoto = styled.div`
  width: 168px;
  border: 1px solid var(--line);
  line-height: 0;
  margin: 0 0 18px;
`;

/* ---- mobile fallback ---- */
const MobileNav = styled.div`
  display: none;

  @media (max-width: 760px) {
    display: block;
  }

  .m-hub h1 {
    margin: 0;
    font-weight: 500;
    font-size: clamp(40px, 11vw, 56px);
    line-height: 1.02;
  }
  .m-role {
    margin: 12px 0 28px;
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-muted);
  }
  details {
    border-top: 1px solid var(--line);
    &:last-of-type {
      border-bottom: 1px solid var(--line);
    }
  }
  .m-link {
    display: flex;
    align-items: baseline;
    gap: 12px;
    border-top: 1px solid var(--line);
    padding: 16px 2px;
    font-size: var(--fz-xl);
    font-style: italic;
    color: var(--text);
    text-decoration: none;
  }
  summary {
    list-style: none;
    cursor: pointer;
    display: flex;
    align-items: baseline;
    gap: 12px;
    padding: 16px 2px;
    font-size: var(--fz-xl);
    font-style: italic;
    color: var(--text);
  }
  summary::-webkit-details-marker {
    display: none;
  }
  summary .num {
    font-family: var(--font-mono);
    font-size: 11px;
    font-style: normal;
    letter-spacing: 0.12em;
    color: var(--text-muted);
  }
  .m-subs {
    padding: 0 0 14px 2px;
  }
  .m-sub {
    display: block;
    background: none;
    border: 0;
    text-align: left;
    padding: 7px 0;
    color: var(--text);
    font-size: var(--fz-md);
    text-decoration: none;
    cursor: pointer;
  }
`;

const DesktopGraph = styled.div`
  position: absolute;
  inset: 0;

  @media (max-width: 760px) {
    display: none;
  }
`;

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
const GraphHome = () => {
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
              range
              url
            }
            html
          }
        }
      }
      featured: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/featured/" } }
        sort: { fields: [frontmatter___date], order: ASC }
      ) {
        edges {
          node {
            frontmatter {
              title
              tech
              github
              external
            }
            html
          }
        }
      }
    }
  `);

  const jobs = data.jobs.edges.map(e => e.node);
  const featured = data.featured.edges.map(e => e.node);
  const social = name => socialMedia.find(s => s.name.toLowerCase() === name.toLowerCase());

  /* ---- content builders ---- */
  const profilePhoto = (
    <ProfilePhoto>
      <StaticImage
        src="../../images/hero.png"
        alt="Shaurya Tiwari"
        width={336}
        placeholder="blurred"
        formats={['auto', 'webp', 'avif']}
      />
    </ProfilePhoto>
  );

  const groups = useMemo(() => {
    const jobSubs = jobs.map((n, i) => {
      const current = /current|present/i.test(n.frontmatter.range || '');
      return {
        id: `job-${i}`,
        label: `${n.frontmatter.company}${current ? ' · Now' : ''}`,
        company: n.frontmatter.company,
        role: n.frontmatter.title,
        range: n.frontmatter.range,
        current,
        title: n.frontmatter.title,
        body: (
          <>
            <Meta>
              {n.frontmatter.company} · {n.frontmatter.range}
            </Meta>
            <div className="rich" dangerouslySetInnerHTML={{ __html: n.html }} />
            {n.frontmatter.url && (
              <Links>
                <a {...ext(n.frontmatter.url)}>{shortCompany(n.frontmatter.company)} ↗</a>
              </Links>
            )}
          </>
        ),
      };
    });

    const projSubs = featured.map((n, i) => ({
      id: `proj-${i}`,
      label: projectLabel(n.frontmatter.title),
      title: n.frontmatter.title,
      body: (
        <>
          <div className="rich" dangerouslySetInnerHTML={{ __html: n.html }} />
          {n.frontmatter.tech && n.frontmatter.tech.length > 0 && (
            <Tech>
              {n.frontmatter.tech.map(t => (
                <span key={t}>{t}</span>
              ))}
            </Tech>
          )}
          <Links>
            {n.frontmatter.external && <a {...ext(n.frontmatter.external)}>Live ↗</a>}
            {n.frontmatter.github && <a {...ext(n.frontmatter.github)}>Code ↗</a>}
          </Links>
        </>
      ),
    }));
    const base = [
      {
        id: 'about',
        label: 'About',
        num: 'I',
        angle: -90,
        subs: [
          {
            id: 'profile',
            label: 'Profile',
            title: 'Profile',
            body: (
              <>
                {profilePhoto}
                <p>
                  I&apos;m Shaurya Tiwari, an AI Software Engineer with a Master&apos;s in Computer
                  Science from Florida State University.
                </p>
                <p>
                  I build production AI infrastructure at{' '}
                  <a {...ext('https://www.usnews.com/')}>U.S. News &amp; World Report</a> — agentic
                  RAG systems, backend platforms, vector retrieval, streaming APIs, guardrails, and
                  observability for AI products used across multiple business verticals.
                </p>
                <p>
                  My current technical direction is Physical AI. I&apos;m applying that same
                  production-engineering background to simulation workflows, OpenUSD-based scene and
                  data pipelines, robot-policy evaluation, and closed-loop retraining systems
                  through <a {...ext('https://instrux.world/')}>InstruX</a>.
                </p>
                <p>
                  Earlier I worked across data engineering, research, DevOps, and web platforms —
                  which gave me the backend, ML, infrastructure, and product judgment I bring into
                  AI systems today.
                </p>
              </>
            ),
          },
          {
            id: 'toolbox',
            label: 'Toolbox',
            title: 'Toolbox',
            body: (
              <>
                <p>The stack I use to build AI systems that ship:</p>
                <Tech>
                  {[
                    'Python',
                    'Django',
                    'FastAPI',
                    'LangChain',
                    'LangGraph',
                    'RAG',
                    'OpenSearch',
                    'FAISS',
                    'PostgreSQL',
                    'AWS',
                    'Docker',
                    'New Relic',
                    'PyTorch',
                    'OpenUSD',
                    'NVIDIA Omniverse',
                  ].map(t => (
                    <span key={t}>{t}</span>
                  ))}
                </Tech>
              </>
            ),
          },
          {
            id: 'beyond',
            label: 'Beyond work',
            title: 'Beyond work',
            body: (
              <p>
                Off the clock I&apos;m occasionally corny on{' '}
                <a {...ext('https://www.youtube.com/channel/UC1sfE7YdmxsUdJaOo4vhqVQ')}>
                  my YouTube livestream
                </a>
                , figuring life out with LLMs.
              </p>
            ),
          },
        ],
      },
      { id: 'experience', label: 'Experience', num: 'II', angle: -30, subs: jobSubs },
      { id: 'projects', label: 'Recent Work', num: 'III', angle: 30, subs: projSubs },
      { id: 'archive', label: 'Project Archive', num: 'IV', angle: 64, to: '/archive' },
      {
        id: 'physical-ai',
        label: 'Physical AI',
        num: 'V',
        angle: 90,
        subs: [
          {
            id: 'physical-ai-overview',
            label: 'Overview',
            title: 'Physical AI',
            body: (
              <>
                <p>
                  Physical AI is the next technical direction I&apos;m building toward. Through{' '}
                  <a {...ext('https://instrux.world/')}>InstruX</a>, I&apos;m exploring how
                  production AI systems, agent orchestration, simulation tooling, and robot-policy
                  evaluation come together into closed-loop workflows for real-world robotics.
                </p>
                <p>
                  The focus isn&apos;t hardware or generic AI demos — it&apos;s the infrastructure
                  for diagnosing policy failures, generating targeted simulation scenarios,
                  validating deployment readiness, and triggering retraining when deployed systems
                  drift.
                </p>
                <Tech>
                  {[
                    'OpenUSD',
                    'NVIDIA Omniverse',
                    'Isaac Sim',
                    'Isaac Lab',
                    'Cosmos',
                    'ROS2',
                    'Simulation Workflows',
                    'Agentic Orchestration',
                  ].map(t => (
                    <span key={t}>{t}</span>
                  ))}
                </Tech>
                <Links>
                  <a {...ext('https://instrux.world/')}>Visit InstruX ↗</a>
                </Links>
              </>
            ),
          },
          { id: 'instrux', label: 'instrux.world', href: 'https://instrux.world/' },
        ],
      },
      {
        id: 'contact',
        label: 'Contact',
        num: 'VI',
        angle: 150,
        subs: [
          {
            id: 'email',
            label: 'Email',
            title: 'Email',
            body: (
              <>
                <p>The fastest way to reach me.</p>
                <Links>
                  <a href={`mailto:${email}`}>{email}</a>
                </Links>
              </>
            ),
          },
          {
            id: 'calendar',
            label: 'Calendar',
            title: 'Schedule a call',
            body: (
              <>
                <p>Prefer to talk? Grab a time that works for you.</p>
                <Links>
                  <a {...ext('https://calendly.com/vaasutiwari')}>Open my calendar ↗</a>
                </Links>
              </>
            ),
          },
          { id: 'linkedin', label: 'LinkedIn', href: social('Linkedin') && social('Linkedin').url },
          { id: 'github', label: 'GitHub', href: social('GitHub') && social('GitHub').url },
          { id: 'resume', label: 'Résumé', to: '/resume' },
        ],
      },
      {
        id: 'assistant',
        label: 'AI Assistant',
        num: 'VII',
        angle: 210,
        subs: [
          { id: 'open-chat', label: 'Open chat →', to: '/chat' },
          {
            id: 'ai-about',
            label: 'What it knows',
            title: 'AI Assistant',
            body: (
              <>
                <p>
                  I built this assistant so recruiters and engineers can explore my background
                  conversationally — from production AI infrastructure and LangGraph systems to my
                  current work in Physical AI and simulation workflows.
                </p>
                <Links>
                  <Link to="/chat">Open the assistant →</Link>
                </Links>
              </>
            ),
          },
        ],
      },
    ];
    // Evenly distribute every node around the hub (sun-ray spacing).
    return base.map((g, i) => ({ ...g, angle: -90 + (360 / base.length) * i }));
  }, [data]);

  /* ---- state ---- */
  const [openId, setOpenId] = useState(null);
  const [activeSub, setActiveSub] = useState(null); // { groupId, sub }
  const wrapRef = useRef(null);
  const [size, setSize] = useState({ w: 1280, h: 720 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) {
      return undefined;
    }
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const reset = useCallback(() => {
    setOpenId(null);
    setActiveSub(null);
  }, []);

  const closeSub = useCallback(() => setActiveSub(null), []);

  useEffect(() => {
    const onKey = e => {
      if (e.key !== 'Escape') {
        return;
      }
      if (activeSub) {
        closeSub();
      } else if (openId) {
        setOpenId(null);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [activeSub, openId, closeSub]);

  const handlePrimary = id => {
    const g = groups.find(x => x.id === id);
    if (g && g.to) {
      navigate(g.to);
      return;
    }
    setActiveSub(null);
    setOpenId(prev => (prev === id ? null : id));
  };

  const handleSub = (groupId, sub) => {
    if (sub.to) {
      navigate(sub.to);
      return;
    }
    if (sub.href) {
      window.open(sub.href, '_blank', 'noopener,noreferrer');
      return;
    }
    setActiveSub({ groupId, sub });
  };

  /* ---- geometry ---- */
  const { w, h } = size;
  const focused = !!openId;
  const paneOpen = !!activeSub;
  const paneW = clamp(w * 0.38, 340, 560);

  // Nudge the whole composition slightly above the exact middle so it reads
  // as optically centred rather than sitting a touch low.
  const centerY = h / 2 - Math.min(h * 0.05, 44);

  // Idle: hub at centre, primaries evenly spaced on a ring around it.
  const hubX = w / 2;
  const hubY = centerY;
  const ringRx = Math.min(w * 0.38, 480);
  const ringRy = Math.min(h * 0.36, 300);
  const ringPos = g => ({
    x: hubX + ringRx * Math.cos(rad(g.angle)),
    y: hubY + ringRy * Math.sin(rad(g.angle)),
  });

  // A ring line, trimmed so it stops just outside the hub and the node label
  // (elliptical gaps) — this keeps the rays from being masked into rectangular
  // "boxes" by the opaque label backgrounds.
  const ringLine = g => {
    const p = ringPos(g);
    const dx = p.x - hubX;
    const dy = p.y - hubY;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const tHub = 6 + 1 / Math.sqrt((ux / 150) ** 2 + (uy / 92) ** 2);
    const nrx = g.label.length * 5.2 + 16;
    const tNode = 8 + 1 / Math.sqrt((ux / nrx) ** 2 + (uy / 30) ** 2);
    return {
      x1: hubX + ux * tHub,
      y1: hubY + uy * tHub,
      x2: p.x - ux * tNode,
      y2: p.y - uy * tNode,
    };
  };

  // Focus: the opened node becomes the "sun" at the centre of the open area
  // and its sub-nodes radiate out as evenly spaced rays of equal length.
  const sunX = paneOpen ? (w - paneW) / 2 : w / 2;
  const sunY = centerY;
  // Horizontal room a ray can use: the full half-width when the pane is
  // closed, or only the space left of the pane when it is open. (Reserving
  // the pane width while it's closed pulled the side rays in too tight.)
  const horizHalf = paneOpen ? (w - paneW) / 2 : w / 2;
  const rayR = Math.max(170, Math.min(horizHalf - 120, h / 2 - 90));

  const openGroup = groups.find(g => g.id === openId);
  const rayPositions = useMemo(() => {
    if (!openGroup || !openGroup.subs) {
      return [];
    }
    const n = openGroup.subs.length;
    return openGroup.subs.map((sub, i) => {
      const ang = -90 + (360 / n) * i;
      return { sub, x: sunX + rayR * Math.cos(rad(ang)), y: sunY + rayR * Math.sin(rad(ang)) };
    });
  }, [openGroup, sunX, sunY, rayR]);

  const activeGroup = activeSub && groups.find(g => g.id === activeSub.groupId);

  // Experience renders as a sequential timeline instead of radial rays.
  const timelineMode = focused && openId === 'experience';

  const primaryState = g => {
    if (!focused) {
      return { ...ringPos(g), opacity: 1, on: true };
    }
    if (g.id === openId) {
      return { x: sunX, y: sunY, opacity: 1, on: true };
    }
    return { ...ringPos(g), opacity: 0, on: false };
  };

  return (
    <Wrap ref={wrapRef}>
      {/* ---------- Desktop graph ---------- */}
      <DesktopGraph>
        <Edges aria-hidden="true">
          {!focused &&
            groups.map(g => {
              const l = ringLine(g);
              return <line key={g.id} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />;
            })}
          {focused &&
            !timelineMode &&
            rayPositions.map(({ sub, x, y }) => (
              <line key={sub.id} className="sub" x1={sunX} y1={sunY} x2={x} y2={y} />
            ))}
          {focused && !timelineMode && <circle cx={sunX} cy={sunY} r="3" />}
          {focused &&
            !timelineMode &&
            rayPositions.map(({ sub, x, y }) => (
              <circle key={`dot-${sub.id}`} className="sub" cx={x} cy={y} r="2.5" />
            ))}
        </Edges>

        <Hub
          style={{
            left: hubX,
            top: hubY,
            opacity: focused ? 0 : 1,
            pointerEvents: focused ? 'none' : 'auto',
          }}
          onClick={reset}
          aria-label="Shaurya Tiwari — home"
        >
          <h1 className="name">
            Shaurya
            <br />
            Tiwari
          </h1>
          <div className="rule" />
          <div className="role">Production AI → Physical AI</div>
        </Hub>

        {groups.map(g => {
          const st = primaryState(g);
          const cls = openId === g.id ? 'open' : '';
          return (
            <Primary
              key={g.id}
              className={cls}
              style={{
                left: st.x,
                top: st.y,
                opacity: timelineMode ? 0 : st.opacity,
                pointerEvents: st.on && !timelineMode ? 'auto' : 'none',
              }}
              onClick={() => handlePrimary(g.id)}
              aria-expanded={openId === g.id}
            >
              <span className="num">{g.num}</span>
              <span className="label">{g.label}</span>
            </Primary>
          );
        })}

        {focused &&
          !timelineMode &&
          rayPositions.map(({ sub, x, y }, i) => {
            const isActive = activeSub && activeSub.sub.id === sub.id;
            return (
              <Sub
                key={sub.id}
                className={isActive ? 'active' : ''}
                style={{
                  left: x,
                  top: y,
                  '--dx': `${sunX - x}px`,
                  '--dy': `${sunY - y}px`,
                  animationDelay: `${i * 0.03}s`,
                }}
                onClick={() => handleSub(openGroup.id, sub)}
              >
                <span className="sub-label">{sub.label}</span>
              </Sub>
            );
          })}

        {timelineMode && (
          <Timeline>
            <div className="tl-inner">
              <div className="tl-head">
                <span className="tl-title">Experience</span>
                <button className="tl-close" type="button" onClick={reset}>
                  Close ✕
                </button>
              </div>
              <div className="tl-list">
                {openGroup.subs.map((sub, i) => {
                  const isActive = activeSub && activeSub.sub.id === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      className={`tl-item${sub.current ? ' current' : ''}${
                        isActive ? ' active' : ''
                      }`}
                      style={{ animationDelay: `${0.1 + i * 0.05}s` }}
                      onClick={() => handleSub(openGroup.id, sub)}
                    >
                      <span className="tl-date">
                        {sub.range}
                        {sub.current && <span className="tl-now">Now</span>}
                      </span>
                      <div className="tl-role">{sub.role}</div>
                      <div className="tl-company">{sub.company}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </Timeline>
        )}
      </DesktopGraph>

      {/* ---------- Mobile fallback ---------- */}
      <MobileNav>
        <div className="m-hub">
          <h1>
            Shaurya
            <br />
            Tiwari
          </h1>
        </div>
        <div className="m-role">Production AI → Physical AI</div>
        {groups.map(g =>
          g.to ? (
            <Link key={g.id} className="m-link" to={g.to}>
              <span className="num">{g.num}</span>
              {g.label} →
            </Link>
          ) : (
            <details key={g.id}>
              <summary>
                <span className="num">{g.num}</span>
                {g.label}
              </summary>
              <div className="m-subs">
                {g.subs.map(sub =>
                  sub.to ? (
                    <Link key={sub.id} className="m-sub" to={sub.to}>
                      {sub.label}
                    </Link>
                  ) : sub.href ? (
                    <a key={sub.id} className="m-sub" {...ext(sub.href)}>
                      {sub.label} ↗
                    </a>
                  ) : (
                    <button
                      key={sub.id}
                      className="m-sub"
                      type="button"
                      onClick={() => setActiveSub({ groupId: g.id, sub })}
                    >
                      {sub.label}
                    </button>
                  ),
                )}
              </div>
            </details>
          ),
        )}
      </MobileNav>

      {/* ---------- Right pane ---------- */}
      <Pane className={paneOpen ? 'open' : ''} aria-hidden={!paneOpen}>
        {activeSub && (
          <>
            <div className="pane__head">
              <div>
                <div className="pane__chapter">{activeGroup ? activeGroup.label : ''}</div>
                <h2 className="pane__title">{activeSub.sub.title}</h2>
              </div>
              <button className="pane__close" onClick={closeSub} aria-label="Close" type="button">
                ×
              </button>
            </div>
            <div className="pane__body">{activeSub.sub.body}</div>
          </>
        )}
      </Pane>
    </Wrap>
  );
};

export default GraphHome;
