import React from 'react';
import PropTypes from 'prop-types';
import { Layout, ChatSection } from '@components';

const ChatPage = ({ location }) => (
  <Layout location={location}>
    <main>
      <ChatSection />
    </main>
  </Layout>
);

ChatPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default ChatPage;
