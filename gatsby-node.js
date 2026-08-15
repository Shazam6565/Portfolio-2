/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require('path');

// `videos` on physical-ai-projects entries is `[]` in every current file, so
// Gatsby's type inference can't sample its shape. Declare it explicitly so
// `videos { label url }` queries don't break as soon as inference guesses wrong.
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
    type MarkdownRemarkFrontmatter {
      videos: [PhysicalAiVideoLog]
    }
    type PhysicalAiVideoLog {
      label: String
      url: String
    }
  `);
};

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions;
  const researchTemplate = path.resolve('src/templates/research.js');

  const result = await graphql(`
    {
      researchRemark: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/research/" } }
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
              slug
            }
          }
        }
      }
    }
  `);

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }

  // Create research entry detail pages
  const researchEntries = result.data.researchRemark.edges;

  researchEntries.forEach(({ node }) => {
    createPage({
      path: node.frontmatter.slug,
      component: researchTemplate,
      context: { slug: node.frontmatter.slug },
    });
  });
};

// https://www.gatsbyjs.org/docs/node-apis/#onCreateWebpackConfig
exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  // https://www.gatsbyjs.org/docs/debugging-html-builds/#fixing-third-party-modules
  if (stage === 'build-html' || stage === 'develop-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /scrollreveal/,
            use: loaders.null(),
          },
          {
            test: /animejs/,
            use: loaders.null(),
          },
          {
            test: /miniraf/,
            use: loaders.null(),
          },
        ],
      },
    });
  }

  actions.setWebpackConfig({
    resolve: {
      alias: {
        '@components': path.resolve(__dirname, 'src/components'),
        '@config': path.resolve(__dirname, 'src/config'),
        '@fonts': path.resolve(__dirname, 'src/fonts'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@images': path.resolve(__dirname, 'src/images'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@styles': path.resolve(__dirname, 'src/styles'),
        '@utils': path.resolve(__dirname, 'src/utils'),
      },
    },
  });
};
