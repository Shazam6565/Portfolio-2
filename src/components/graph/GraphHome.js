import React, { useState, useEffect, useCallback } from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import { email, socialMedia } from '@config';

/* ------------------------------------------------------------------ */
/* Layout of the node-link graph (percent coordinates of the stage)    */
/* ------------------------------------------------------------------ */
const CENTER = { x: 50, y: 50 };
const NODES = [
  { id: 'about', label: 'About', num: 'I', x: 50, y: 15 },
  { id: 'experience', label: 'Experience', num: 'II', x: 82, y: 33 },
  { id: 'projects', label: 'Work', num: 'III', x: 82, y: 67 },
  { id: 'writing', label: 'Writing', num: 'IV', x: 50, y: 85 },
  { id: 'contact', label: 'Contact', num: 'V', x: 18, y: 67 },
  { id: 'assistant', label: 'AI Assistant', num: 'VI', x: 18, y: 33 },
];

/* ------------------------------------------------------------------ */
/* Styled                                                              */
/* ------------------------------------------------------------------ */
const Stage = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 580px;
  overflow: hidden;

  @media (max-width: 760px) {
    height: auto;
    min-height: 0;
    overflow: visible;
    padding: 92px 22px 56px;
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
    transition: stroke 0.18s ease, opacity 0.18s ease;
  }
  line.active {
    stroke: var(--text);
  }
  line.dim {
    opacity: 0.4;
  }
  circle {
    fill: var(--text-muted);
  }

  @media (max-width: 760px) {
    display: none;
  }
`;

const Center = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  text-align: center;
  background: var(--bg);
  padding: 10px 18px;

  .name {
    margin: 0;
    font-size: clamp(32px, 4.6vw, 52px);
    font-weight: 500;
    line-height: 1.04;
    color: var(--text);
  }
  .rule {
    width: 44px;
    height: 1px;
    margin: 13px auto;
    background: var(--text-muted);
  }
  .role {
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-muted);
  }
  .hint {
    margin-top: 10px;
    font-style: italic;
    font-size: var(--fz-sm);
    color: var(--text-muted);
  }

  @media (max-width: 760px) {
    position: static;
    transform: none;
    text-align: left;
    padding: 0;
    margin-bottom: 26px;

    .rule {
      margin: 13px 0;
    }
    .hint {
      display: none;
    }
  }
`;

const NodeButton = styled.button`
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 8px 12px;
  background: var(--bg);
  border: 0;
  color: var(--text);
  cursor: pointer;
  white-space: nowrap;

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
  &[aria-expanded='true'] .label {
    text-decoration: underline;
    text-underline-offset: 4px;
  }

  @media (max-width: 760px) {
    position: static !important;
    transform: none;
    flex-direction: row;
    justify-content: flex-start;
    align-items: baseline;
    gap: 12px;
    width: 100%;
    padding: 16px 2px;
    border-bottom: 1px solid var(--line);

    &:first-of-type {
      border-top: 1px solid var(--line);
    }
    .label {
      font-size: var(--fz-xl);
    }
  }
`;

const Caption = styled.p`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 18px;
  margin: 0;
  text-align: center;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  z-index: 2;

  @media (max-width: 760px) {
    position: static;
    margin-top: 36px;
  }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 30;
  background: var(--bg);
  opacity: 0.72;
  backdrop-filter: blur(2px);
  animation: fade 0.18s ease;

  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 0.72;
    }
  }
`;

const Sheet = styled.div`
  position: fixed;
  z-index: 31;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: min(660px, 92vw);
  max-height: 82vh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  border: 1px solid var(--text);

  .sheet__head {
    flex: none;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding: 22px 28px 16px;
    border-bottom: 1px solid var(--line);
  }
  .sheet__chapter {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-muted);
  }
  .sheet__title {
    margin: 5px 0 0;
    font-size: var(--fz-xxl);
    font-weight: 500;
    color: var(--text);
  }
  .sheet__close {
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
  .sheet__body {
    overflow-y: auto;
    padding: 20px 28px 28px;
    font-size: var(--fz-md);
    color: var(--text-secondary);

    p {
      margin: 0 0 14px;
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
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    transform: none;
    width: auto;
    max-height: none;
    border: 0;
  }
`;

const InlineLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  margin-top: 6px;
  font-size: var(--fz-sm);
`;

const TechLine = styled.p`
  margin: 8px 0 0 !important;
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  color: var(--text-muted) !important;

  span:not(:last-child):after {
    content: '·';
    margin: 0 8px;
  }
`;

const Acc = styled.details`
  border-top: 1px solid var(--line);

  &:last-of-type {
    border-bottom: 1px solid var(--line);
  }

  summary {
    list-style: none;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 14px;
    padding: 13px 0;
  }
  summary::-webkit-details-marker {
    display: none;
  }
  summary::after {
    content: '+';
    flex: none;
    font-family: var(--font-mono);
    color: var(--text-muted);
  }
  &[open] summary::after {
    content: '–';
  }
  .acc__title {
    color: var(--text);
    font-size: var(--fz-md);
  }
  .acc__meta {
    flex: none;
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    color: var(--text-muted);
    white-space: nowrap;
  }
  .acc__body {
    padding: 0 0 16px;
    font-size: var(--fz-sm);

    ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    li {
      position: relative;
      padding-left: 18px;
      margin-bottom: 6px;
    }
    li:before {
      content: '–';
      position: absolute;
      left: 0;
      color: var(--text-muted);
    }
  }
`;

const ChapterLink = styled(Link)`
  display: inline-block;
  margin-top: 18px;
  font-style: italic;
  color: var(--text) !important;
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
      posts: allMarkdownRemark(
        filter: {
          fileAbsolutePath: { regex: "/content/posts/" }
          frontmatter: { draft: { ne: true } }
        }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            frontmatter {
              title
              slug
              date
              tags
            }
          }
        }
      }
    }
  `);

  const [active, setActive] = useState(null);
  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    if (!active) {
      return undefined;
    }
    const onKey = e => {
      if (e.key === 'Escape') {
        close();
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [active, close]);

  const ext = url => ({ href: url, target: '_blank', rel: 'noopener noreferrer' });
  const social = name => socialMedia.find(s => s.name.toLowerCase() === name.toLowerCase());

  const jobs = data.jobs.edges;
  const featured = data.featured.edges;
  const posts = data.posts.edges;

  /* ---- Panel content ---- */
  const PANELS = {
    about: {
      chapter: 'Chapter I',
      title: 'About',
      body: (
        <>
          <p>
            I&apos;m Shaurya Tiwari, an AI software engineer with a Master&apos;s in Computer
            Science from Florida State University. I build production AI infrastructure across 9+
            verticals at <a {...ext('https://www.usnews.com/')}>U.S. News &amp; World Report</a> —
            reliable backends, data-driven AI applications, and systems where correctness and
            performance actually matter.
          </p>
          <p>
            Earlier I worked at a data-product organization, a research department at FSU, a
            software consultancy, and a UI/UX studio. Off the clock I&apos;m occasionally corny on{' '}
            <a {...ext('https://www.youtube.com/channel/UC1sfE7YdmxsUdJaOo4vhqVQ')}>
              my YouTube livestream
            </a>
            , figuring life out with LLMs.
          </p>
          <TechLine>
            {[
              'Python',
              'Django',
              'LangChain/LangGraph',
              'AWS',
              'Docker',
              'New Relic',
              'Jenkins',
            ].map(t => (
              <span key={t}>{t}</span>
            ))}
          </TechLine>
        </>
      ),
    },
    experience: {
      chapter: 'Chapter II',
      title: 'Experience',
      body: (
        <>
          {jobs.map(({ node }, i) => {
            const { title, company, range, url } = node.frontmatter;
            return (
              <Acc key={i} open={i === 0 || undefined}>
                <summary>
                  <span className="acc__title">
                    {title} · {company}
                  </span>
                  <span className="acc__meta">{range}</span>
                </summary>
                <div className="acc__body">
                  <div dangerouslySetInnerHTML={{ __html: node.html }} />
                  {url && (
                    <p style={{ margin: '8px 0 0' }}>
                      <a {...ext(url)}>{company} ↗</a>
                    </p>
                  )}
                </div>
              </Acc>
            );
          })}
        </>
      ),
    },
    projects: {
      chapter: 'Chapter III',
      title: 'Selected Work',
      body: (
        <>
          {featured.map(({ node }, i) => {
            const { title, tech, github, external } = node.frontmatter;
            return (
              <Acc key={i} open={i === 0 || undefined}>
                <summary>
                  <span className="acc__title">{title}</span>
                  <span className="acc__meta">
                    {external ? 'live' : ''}
                    {external && github ? ' · ' : ''}
                    {github ? 'code' : ''}
                  </span>
                </summary>
                <div className="acc__body">
                  <div dangerouslySetInnerHTML={{ __html: node.html }} />
                  {tech && tech.length > 0 && (
                    <TechLine>
                      {tech.map(t => (
                        <span key={t}>{t}</span>
                      ))}
                    </TechLine>
                  )}
                  <InlineLinks>
                    {external && <a {...ext(external)}>Live ↗</a>}
                    {github && <a {...ext(github)}>Code ↗</a>}
                  </InlineLinks>
                </div>
              </Acc>
            );
          })}
          <ChapterLink to="/archive">View the full archive →</ChapterLink>
        </>
      ),
    },
    writing: {
      chapter: 'Chapter IV',
      title: 'Writing',
      body: (
        <>
          {posts.length > 0 ? (
            posts.map(({ node }, i) => {
              const { title, slug, date, tags } = node.frontmatter;
              const d = new Date(date).toLocaleDateString();
              return (
                <Acc as="div" key={i} style={{ paddingBottom: 0 }}>
                  <div style={{ padding: '13px 0' }}>
                    <Link to={slug} style={{ color: 'var(--text)', fontSize: 'var(--fz-md)' }}>
                      {title}
                    </Link>
                    <p
                      style={{
                        margin: '4px 0 0',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'var(--fz-xs)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {d}
                      {tags && tags.length ? ` · ${tags.map(t => `#${t}`).join(' ')}` : ''}
                    </p>
                  </div>
                </Acc>
              );
            })
          ) : (
            <p>Notes and write-ups, coming soon.</p>
          )}
          <ChapterLink to="/pensieve">All writing →</ChapterLink>
        </>
      ),
    },
    contact: {
      chapter: 'Chapter V',
      title: 'Contact',
      body: (
        <>
          <p>
            Open to discussing opportunities, ideas, or just saying hi. The fastest way to reach me
            is email.
          </p>
          <InlineLinks>
            <a href={`mailto:${email}`}>{email}</a>
            <a {...ext('https://calendly.com/vaasutiwari')}>Schedule a call ↗</a>
          </InlineLinks>
          <InlineLinks>
            {['Linkedin', 'GitHub', 'Twitter', 'Instagram'].map(name => {
              const s = social(name);
              return s ? (
                <a key={name} {...ext(s.url)}>
                  {name === 'Linkedin' ? 'LinkedIn' : name} ↗
                </a>
              ) : null;
            })}
          </InlineLinks>
          <p style={{ marginTop: 18 }}>
            <Link to="/resume" style={{ fontStyle: 'italic' }}>
              Read the résumé →
            </Link>
          </p>
        </>
      ),
    },
    assistant: {
      chapter: 'Chapter VI',
      title: 'AI Assistant',
      body: (
        <>
          <p>
            Rather ask than read? I trained a small assistant on my résumé, projects, and career so
            you can interview me in natural language — ask about a role, a technology, or how
            I&apos;d approach a problem.
          </p>
          <ChapterLink to="/chat">Open the assistant →</ChapterLink>
        </>
      ),
    },
  };

  return (
    <Stage>
      <Edges aria-hidden="true">
        {NODES.map(n => (
          <line
            key={n.id}
            x1={`${CENTER.x}%`}
            y1={`${CENTER.y}%`}
            x2={`${n.x}%`}
            y2={`${n.y}%`}
            className={active ? (active === n.id ? 'active' : 'dim') : ''}
          />
        ))}
        <circle cx={`${CENTER.x}%`} cy={`${CENTER.y}%`} r="3" />
        {NODES.map(n => (
          <circle key={n.id} cx={`${n.x}%`} cy={`${n.y}%`} r="2.5" />
        ))}
      </Edges>

      <Center>
        <h1 className="name big-heading">
          Shaurya
          <br />
          Tiwari
        </h1>
        <div className="rule" />
        <div className="role">AI Software Engineer</div>
        <p className="hint">a portfolio in six chapters — open one</p>
      </Center>

      {NODES.map(n => (
        <NodeButton
          key={n.id}
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
          onClick={() => setActive(n.id)}
          aria-expanded={active === n.id}
          aria-haspopup="dialog"
        >
          <span className="num">{n.num}</span>
          <span className="label">{n.label}</span>
        </NodeButton>
      ))}

      <Caption>© {new Date().getFullYear()} Shaurya Tiwari</Caption>

      {active && (
        <>
          <Backdrop onClick={close} />
          <Sheet role="dialog" aria-modal="true" aria-label={PANELS[active].title}>
            <div className="sheet__head">
              <div>
                <div className="sheet__chapter">{PANELS[active].chapter}</div>
                <h2 className="sheet__title">{PANELS[active].title}</h2>
              </div>
              <button className="sheet__close" onClick={close} aria-label="Close">
                ×
              </button>
            </div>
            <div className="sheet__body">{PANELS[active].body}</div>
          </Sheet>
        </>
      )}
    </Stage>
  );
};

export default GraphHome;
