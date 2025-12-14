import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout, ChatSection } from '@components';

const StyledMainContainer = styled.main`
  counter-reset: section;
  padding: 200px 150px;

  @media (max-width: 1080px) {
    padding: 200px 100px;
  }
  @media (max-width: 768px) {
    padding: 150px 50px;
  }
  @media (max-width: 480px) {
    padding: 125px 25px;
  }
`;

const ChatPage = ({ location }) => (
  <Layout location={location}>
    <StyledMainContainer>
      <ChatSection />
    </StyledMainContainer>
  </Layout>
);

ChatPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default ChatPage;
