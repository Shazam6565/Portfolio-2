import React from 'react';
import { Link } from 'gatsby';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout } from '@components';

const StyledMainContainer = styled.main`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
`;
const StyledTitle = styled.h1`
  margin: 0 0 10px;
  color: var(--text);
  font-family: var(--font-mono);
  font-size: clamp(40px, 8vw, 64px);
  font-weight: 600;
  line-height: 1;
`;
const StyledSubtitle = styled.p`
  margin: 0;
  color: var(--text-muted);
  font-size: var(--fz-lg);
`;
const StyledHomeButton = styled(Link)`
  ${({ theme }) => theme.mixins.button};
  margin-top: 30px;
`;

const NotFoundPage = ({ location }) => (
  <Layout location={location}>
    <Helmet title="Page Not Found" />

    <StyledMainContainer className="fillHeight">
      <StyledTitle>404</StyledTitle>
      <StyledSubtitle>Page Not Found</StyledSubtitle>
      <StyledHomeButton to="/">Go Home</StyledHomeButton>
    </StyledMainContainer>
  </Layout>
);

NotFoundPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default NotFoundPage;
