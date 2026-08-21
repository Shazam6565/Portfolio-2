/**
 * The chat assistant's generative-UI component library (OpenUI Lang).
 *
 * Written with React.createElement (no JSX) on purpose: this module is
 * imported both by the Gatsby frontend (ChatSection.js, for <Renderer>)
 * and by a plain `node` script (scripts/generate-genui-prompt.mjs, to
 * generate the system-prompt fragment) — no bundler/JSX transform runs
 * for the latter. Keep it framework-plumbing only: no `@components`/
 * `@config` aliases, nothing Gatsby-specific.
 */
const React = require('react');
const { defineComponent, createLibrary } = require('@openuidev/react-lang');
const { z } = require('zod/v4');

const h = React.createElement;

const TextBlock = defineComponent({
  name: 'TextBlock',
  description:
    'A short block of plain conversational text. Use this for ordinary answers — it is the common case.',
  props: z.object({
    text: z.string(),
  }),
  component: ({ props }) =>
    h('p', { style: { margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 } }, props.text),
});

const ProjectCard = defineComponent({
  name: 'ProjectCard',
  description:
    'A card describing one of Shaurya\'s projects: title, description, tech stack, and links. Only use this when the user asks about a specific named project or clearly wants project details.',
  props: z.object({
    title: z.string(),
    description: z.string(),
    tech: z.array(z.string()).optional(),
    liveUrl: z
      .string()
      .optional()
      .describe('A deployed/live demo URL. Never put a GitHub link here.'),
    codeUrl: z.string().optional().describe('The GitHub repository URL, if there is one.'),
  }),
  component: ({ props }) =>
    h(
      'div',
      {
        style: {
          border: '1px solid var(--line)',
          padding: '14px 16px',
          background: 'var(--bg)',
        },
      },
      h(
        'strong',
        { style: { display: 'block', color: 'var(--text)', fontSize: 'var(--fz-md)' } },
        props.title,
      ),
      h(
        'p',
        {
          style: {
            margin: '6px 0 0',
            color: 'var(--text-secondary)',
            fontSize: 'var(--fz-sm)',
            lineHeight: 1.6,
          },
        },
        props.description,
      ),
      props.tech && props.tech.length > 0
        ? h(
          'p',
          {
            style: {
              margin: '10px 0 0',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--fz-xs)',
              color: 'var(--text-muted)',
            },
          },
          props.tech.join(' · '),
        )
        : null,
      props.liveUrl || props.codeUrl
        ? h(
          'div',
          {
            style: { display: 'flex', gap: '16px', marginTop: '10px', fontSize: 'var(--fz-sm)' },
          },
          props.liveUrl
            ? h(
              'a',
              {
                href: props.liveUrl,
                target: '_blank',
                rel: 'noopener noreferrer',
                style: { color: 'var(--text)' },
              },
              'Live ↗',
            )
            : null,
          props.codeUrl
            ? h(
              'a',
              {
                href: props.codeUrl,
                target: '_blank',
                rel: 'noopener noreferrer',
                style: { color: 'var(--text)' },
              },
              'Code ↗',
            )
            : null,
        )
        : null,
    ),
});

const ResearchCard = defineComponent({
  name: 'ResearchCard',
  description:
    'A card describing a research paper Shaurya has studied or implemented: title, citation, a one-line summary, and links to the paper and his write-up. Only use this when the user asks about a specific paper, publication, or research topic.',
  props: z.object({
    title: z.string(),
    citation: z.string(),
    summary: z.string(),
    paperUrl: z.string().optional(),
    pageUrl: z.string().optional(),
  }),
  component: ({ props }) =>
    h(
      'div',
      {
        style: {
          border: '1px solid var(--line)',
          padding: '14px 16px',
          background: 'var(--bg)',
        },
      },
      h(
        'strong',
        { style: { display: 'block', color: 'var(--text)', fontSize: 'var(--fz-md)' } },
        props.title,
      ),
      h(
        'p',
        {
          style: {
            margin: '4px 0 0',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--fz-xs)',
            color: 'var(--text-muted)',
          },
        },
        props.citation,
      ),
      h(
        'p',
        {
          style: {
            margin: '10px 0 0',
            color: 'var(--text-secondary)',
            fontSize: 'var(--fz-sm)',
            lineHeight: 1.6,
          },
        },
        props.summary,
      ),
      props.paperUrl || props.pageUrl
        ? h(
          'div',
          {
            style: { display: 'flex', gap: '16px', marginTop: '10px', fontSize: 'var(--fz-sm)' },
          },
          props.pageUrl
            ? h(
              'a',
              {
                href: props.pageUrl,
                style: { color: 'var(--text)' },
              },
              'My write-up ↗',
            )
            : null,
          props.paperUrl
            ? h(
              'a',
              {
                href: props.paperUrl,
                target: '_blank',
                rel: 'noopener noreferrer',
                style: { color: 'var(--text)' },
              },
              'Paper ↗',
            )
            : null,
        )
        : null,
    ),
});

const LinkList = defineComponent({
  name: 'LinkList',
  description:
    'A short list of outbound links (contact info, résumé, socials). Only use this when the user asks how to reach Shaurya or asks for links/resources.',
  props: z.object({
    links: z.array(
      z.object({
        label: z.string(),
        url: z.string(),
      }),
    ),
    heading: z.string().optional(),
  }),
  component: ({ props }) =>
    h(
      'div',
      null,
      props.heading
        ? h(
          'p',
          {
            style: {
              margin: '0 0 6px',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--fz-xs)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
            },
          },
          props.heading,
        )
        : null,
      h(
        'ul',
        { style: { margin: 0, padding: 0, listStyle: 'none' } },
        props.links.map((link, i) =>
          h(
            'li',
            { key: i, style: { marginTop: i > 0 ? '4px' : 0 } },
            h(
              'a',
              {
                href: link.url,
                target: '_blank',
                rel: 'noopener noreferrer',
                style: {
                  color: 'var(--text)',
                  textDecoration: 'underline',
                  textDecorationColor: 'var(--line)',
                  textUnderlineOffset: '3px',
                },
              },
              link.label,
            ),
          ),
        ),
      ),
    ),
});

const Answer = defineComponent({
  name: 'Answer',
  description: 'The root of every response: an ordered sequence of blocks.',
  props: z.object({
    blocks: z.array(z.union([TextBlock.ref, ProjectCard.ref, ResearchCard.ref, LinkList.ref])),
  }),
  component: ({ props, renderNode }) =>
    h(
      'div',
      { style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
      renderNode(props.blocks),
    ),
});

const library = createLibrary({
  root: 'Answer',
  components: [Answer, TextBlock, ProjectCard, ResearchCard, LinkList],
});

const promptOptions = {
  preamble:
    'You generate OpenUI Lang responses for the AI assistant on Shaurya Tiwari\'s portfolio site.',
  additionalRules: [
    'The root is always Answer, containing an ordered array of blocks.',
    'For ordinary conversational answers, respond with a single TextBlock — this is the common case. Keep it concise, usually 1-4 sentences, matching a terse conversational tone.',
    'Only include a ProjectCard when the user asks about a specific named project or clearly wants project details (tech stack, links). When asked for "recent" or "latest" work, show only the top 2-3 projects from the order given in the background context (that order IS recency) — don\'t dump the full list unless the user asks for "all" or "everything".',
    'Only include a ResearchCard when the user asks about a specific paper, publication, or research topic. When asked for "research" or "papers" in general, prefer the completed/reviewed papers over the in-progress reading list unless asked specifically about what\'s in progress.',
    'Only include a LinkList when the user asks how to reach Shaurya, or asks for links/resources (résumé, email, socials).',
    'Never fabricate project titles, paper titles, links, or tech stacks that are not present in the assistant\'s background context.',
    'When a ProjectCard or ResearchCard has a relevant internal page link available in the background context, include it — don\'t just describe the item in prose without a way to click through to it.',
    'On ProjectCard, a GitHub link always goes in codeUrl, never liveUrl. liveUrl is only for a deployed/demo site (e.g. instrux.world, ai.usnews.com, /chat).',
    'A single answer may combine a short TextBlock with one or two cards when that adds real value — do not pad simple answers with unnecessary cards.',
  ],
};

module.exports = { library, promptOptions };
