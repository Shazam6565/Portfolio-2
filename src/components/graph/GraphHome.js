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
const shortText = (t, n) => (t.length > n ? `${t.slice(0, n).trim()}…` : t);

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
  padding: 6px 9px;
  max-width: 150px;
  animation: subIn 0.32s cubic-bezier(0.2, 0.7, 0.3, 1) both;

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

  @keyframes subIn {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.6);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
`;

const Portrait = styled.div`
  position: absolute;
  left: 36px;
  bottom: 34px;
  width: 132px;
  z-index: 2;
  transition: opacity 0.3s ease;

  &.hidden {
    opacity: 0;
    pointer-events: none;
  }

  .frame {
    border: 1px solid var(--line);
    line-height: 0;
  }
  img {
    /* photo is already black & white — leave it untouched */
  }
  figcaption {
    margin-top: 8px;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
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
  .m-portrait {
    width: 140px;
    border: 1px solid var(--line);
    line-height: 0;
    margin: 0 0 28px;
  }
  details {
    border-top: 1px solid var(--line);
    &:last-of-type {
      border-bottom: 1px solid var(--line);
    }
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

  const jobs = data.jobs.edges.map(e => e.node);
  const featured = data.featured.edges.map(e => e.node);
  const posts = data.posts.edges.map(e => e.node);
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
    const jobSubs = jobs.map((n, i) => ({
      id: `job-${i}`,
      label: shortCompany(n.frontmatter.company),
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
    }));

    const projSubs = featured.map((n, i) => ({
      id: `proj-${i}`,
      label: shortText(n.frontmatter.title, 16),
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
    projSubs.push({ id: 'archive', label: 'Archive →', to: '/archive' });

    const postSubs = posts.map((n, i) => ({
      id: `post-${i}`,
      label: shortText(n.frontmatter.title, 20),
      title: n.frontmatter.title,
      body: (
        <>
          <Meta>
            {new Date(n.frontmatter.date).toLocaleDateString()}
            {n.frontmatter.tags && n.frontmatter.tags.length
              ? ` · ${n.frontmatter.tags.map(t => `#${t}`).join(' ')}`
              : ''}
          </Meta>
          <p>
            <Link to={n.frontmatter.slug}>Read the full piece →</Link>
          </p>
        </>
      ),
    }));
    if (postSubs.length === 0) {
      postSubs.push({
        id: 'soon',
        label: 'Notes',
        title: 'Writing',
        body: <p>Notes and write-ups, coming soon.</p>,
      });
    }
    postSubs.push({ id: 'all-writing', label: 'All writing →', to: '/pensieve' });

    return [
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
                  I&apos;m Shaurya Tiwari, an AI software engineer with a Master&apos;s in Computer
                  Science from Florida State University. I build production AI infrastructure across
                  9+ verticals at{' '}
                  <a {...ext('https://www.usnews.com/')}>U.S. News &amp; World Report</a> — reliable
                  backends, data-driven AI applications, and systems where correctness and
                  performance actually matter.
                </p>
                <p>
                  Earlier I worked at a data-product organization, a research department at FSU, a
                  software consultancy, and a UI/UX studio.
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
                <p>The tools I reach for most often:</p>
                <Tech>
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
      { id: 'projects', label: 'Work / Projects', num: 'III', angle: 30, subs: projSubs },
      { id: 'writing', label: 'Writing', num: 'IV', angle: 90, subs: postSubs },
      {
        id: 'contact',
        label: 'Contact',
        num: 'V',
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
        num: 'VI',
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
                  I trained a small assistant on my résumé, projects, and career so you can
                  interview me in natural language — ask about a role, a technology, or how I&apos;d
                  approach a problem.
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
  const cx = focused ? Math.max(w * 0.3, 240) : w * 0.5;
  const cy = h * 0.5;
  const rx = focused ? Math.min(w * 0.2, 230) : Math.min(w * 0.3, 320);
  const ry = focused ? Math.min(h * 0.28, 210) : Math.min(h * 0.33, 260);

  const primaryPos = g => ({
    x: cx + rx * Math.cos(rad(g.angle)),
    y: cy + ry * Math.sin(rad(g.angle)),
  });

  const openGroup = groups.find(g => g.id === openId);
  const subPositions = useMemo(() => {
    if (!openGroup) {
      return [];
    }
    const a = rad(openGroup.angle);
    const p = { x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) };
    // Push subs slightly outward (radial) and spread them along the tangent.
    // A small outward push keeps edge nodes (top/bottom) on-screen, while a
    // fixed tangential gap prevents long labels from overlapping.
    const ux = Math.cos(a);
    const uy = Math.sin(a);
    const tx = -Math.sin(a);
    const ty = Math.cos(a);
    const push = Math.min(w, h) * 0.08;
    const gap = clamp(Math.min(w, h) * 0.1, 84, 120);
    const n = openGroup.subs.length;
    // Reserve the right edge for the content pane so sub-nodes never sit under it.
    const paneW = clamp(w * 0.38, 340, 560);
    const maxX = w - paneW - 36;
    return openGroup.subs.map((sub, i) => {
      const b = (i - (n - 1) / 2) * gap;
      return {
        sub,
        x: clamp(p.x + push * ux + b * tx, 84, maxX),
        y: clamp(p.y + push * uy + b * ty, 64, h - 64),
      };
    });
  }, [openGroup, w, h, cx, cy, rx, ry]);

  const paneOpen = !!activeSub;
  const activeGroup = activeSub && groups.find(g => g.id === activeSub.groupId);

  return (
    <Wrap ref={wrapRef}>
      {/* ---------- Desktop graph ---------- */}
      <DesktopGraph>
        <Edges aria-hidden="true">
          {groups.map(g => {
            const p = primaryPos(g);
            return (
              <line
                key={g.id}
                x1={cx}
                y1={cy}
                x2={p.x}
                y2={p.y}
                className={openId ? (openId === g.id ? 'lit' : 'dim') : ''}
              />
            );
          })}
          {openGroup &&
            subPositions.map(({ sub, x, y }) => {
              const p = primaryPos(openGroup);
              return <line key={sub.id} className="sub" x1={p.x} y1={p.y} x2={x} y2={y} />;
            })}
          <circle cx={cx} cy={cy} r="3" />
          {groups.map(g => {
            const p = primaryPos(g);
            return (
              <circle
                key={g.id}
                cx={p.x}
                cy={p.y}
                r="2.5"
                opacity={openId && openId !== g.id ? 0.3 : 1}
              />
            );
          })}
        </Edges>

        <Hub style={{ left: cx, top: cy }} onClick={reset} aria-label="Shaurya Tiwari — reset view">
          <h1 className="name">
            Shaurya
            <br />
            Tiwari
          </h1>
          <div className="rule" />
          <div className="role">AI Software Engineer</div>
        </Hub>

        {groups.map(g => {
          const p = primaryPos(g);
          const cls = openId === g.id ? 'open' : openId ? 'dim' : '';
          return (
            <Primary
              key={g.id}
              className={cls}
              style={{ left: p.x, top: p.y }}
              onClick={() => handlePrimary(g.id)}
              aria-expanded={openId === g.id}
            >
              <span className="num">{g.num}</span>
              <span className="label">{g.label}</span>
            </Primary>
          );
        })}

        {openGroup &&
          subPositions.map(({ sub, x, y }, i) => {
            const isActive = activeSub && activeSub.sub.id === sub.id;
            return (
              <Sub
                key={sub.id}
                className={isActive ? 'active' : ''}
                style={{ left: x, top: y, animationDelay: `${i * 0.035}s` }}
                onClick={() => handleSub(openGroup.id, sub)}
              >
                <span className="sub-label">{sub.label}</span>
              </Sub>
            );
          })}

        <Portrait className={focused ? 'hidden' : ''}>
          <figure style={{ margin: 0 }}>
            <div className="frame">
              <StaticImage
                src="../../images/hero.png"
                alt="Shaurya Tiwari"
                width={264}
                placeholder="blurred"
                formats={['auto', 'webp', 'avif']}
              />
            </div>
            <figcaption>Shaurya Tiwari</figcaption>
          </figure>
        </Portrait>
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
        <div className="m-role">AI Software Engineer</div>
        <div className="m-portrait">
          <StaticImage
            src="../../images/hero.png"
            alt="Shaurya Tiwari"
            width={280}
            placeholder="blurred"
            formats={['auto', 'webp', 'avif']}
          />
        </div>
        {groups.map(g => (
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
        ))}
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
