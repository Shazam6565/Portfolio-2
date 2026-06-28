import React from 'react';
import PropTypes from 'prop-types';
import { Layout, GraphHome } from '@components';

const IndexPage = ({ location }) => (
  <Layout location={location}>
    <GraphHome />
  </Layout>
);

IndexPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default IndexPage;
