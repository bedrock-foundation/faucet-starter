import React from 'react';
import styled from '@emotion/styled';
import Navigation from './Navigation';

const Container = styled.div`
  position: relative;
  height: 100vh;
  width: 100vw;
`;

const Content = styled.div`
  position: relative;
  height: calc(100vh - 90px);
`;

type PageLayoutProps = {
  children: React.ReactNode;
};

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <Container>
      <Navigation />
      <Content>{children}</Content>
    </Container>
  );
};

export default PageLayout;
