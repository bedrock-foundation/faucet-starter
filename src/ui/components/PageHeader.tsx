import React from 'react';
import styled from '@emotion/styled';
import { Grid, useTheme, GeistUIThemes, Text } from '@geist-ui/core';

const Container = styled<{ theme: GeistUIThemes } & any>(Grid.Container)`
  border-bottom: ${(props) => `1px solid ${props.theme.palette.accents_2}`};
`;

type PageHeaderProps = {
  title: string;
  children?: React.ReactNode;
};

const PageHeader: React.FC<PageHeaderProps> = ({ title, children }) => {
  const theme = useTheme();
  /** Render */
  return (
    <Container justify="center" theme={theme}>
      <Grid.Container
        direction="row"
        justify="space-between"
        alignItems="center"
        height="103px"
        width="1000px"
      >
        <Text font="24px" b>
          {title}
        </Text>
        {children}
      </Grid.Container>
    </Container>
  );
};

export default PageHeader;
