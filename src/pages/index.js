import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Hero, Evidence, Direction } from '@components';

const IndexPage = ({ location }) => (
  <Layout location={location}>
    <main>
      <Hero />
      <Evidence />
      <Direction />
    </main>
  </Layout>
);

IndexPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default IndexPage;
