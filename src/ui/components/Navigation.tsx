import React from 'react';
import styled from '@emotion/styled';
import { Grid, useTheme, GeistUIThemes, Spacer, Text } from '@geist-ui/core';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Flex from '../elements/Flex';
import BedrockLogo from '../../../public/images/bedrock-logo.png';
import Colors from '../Colors';

const Container = styled<{ theme: GeistUIThemes } & any>(Grid.Container)`
  border-bottom: ${(props) => `1px solid ${props.theme.palette.accents_2}`};
  z-index: 100000;
`;

type LogoContainerProps = {
  width: string;
};

const LogoContainer = styled.div<LogoContainerProps>`
  position: relative;
  width: ${(props) => props.width};
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 2px solid ${Colors.Purple};
  border-radius: 4px;
`;

type NavigationProps = unknown;

const Navigation: React.FC<NavigationProps> = () => {
  const theme = useTheme();
  const router = useRouter();

  const appMenuItems: any[] = [
    // {
    //   title: 'Campaigns',
    //   link: '/dashboard/drip-list',
    //   active: [
    //     '/dashboard/drip-list',
    //     '/dashboard/drip/overview',
    //     '/dashboard/create-drip',
    //     '/dashboard/edit-drip',
    //   ],
    // },
    // {
    //   title: 'Tokens',
    //   link: '/dashboard/token-list',
    //   active: [
    //     '/dashboard/token-list',
    //     '/dashboard/token/overview',
    //     '/dashboard/create-token',
    //     '/dashboard/edit-token',
    //   ],
    // },
    // {
    //   title: 'Settings',
    //   link: '/dashboard/settings',
    //   active: ['/dashboard/settings'],
    // },
    // {
    //   title: 'Documentation',
    //   link: '/documentation',
    //   active: ['/documentation'],
    // },
  ];

  const path = router.asPath;
  const paramDelimterIndex = path.indexOf('?');
  const currentPath =
    paramDelimterIndex > -1 ? path.substring(0, paramDelimterIndex) : path;

  /** Render */
  return (
    <Container justify="center" theme={theme}>
      <Grid.Container
        direction="row"
        justify="space-between"
        alignItems="center"
        height="87px"
        width="1000px"
        marginRight="16px"
        marginLeft="16px"
      >
        <Link href="/">
          <div>
            <Flex align="center">
              <LogoContainer width="50px">
                <Image src={BedrockLogo} height="50px" width="50px" />
              </LogoContainer>
              <Spacer />
              <Text color={theme.palette.accents_8} b font="24px">
                Token Faucet
              </Text>
            </Flex>
          </div>
        </Link>
        <Flex align="center" justify="space-between" width="400px">
          {appMenuItems.map(({ title, link, active }, index) => {
            const isActive = active.includes(currentPath);
            return (
              <Flex key={index}>
                <Link href={link} key={index}>
                  <a style={{ color: 'white' }}>
                    <Text
                      span
                      type={isActive ? undefined : 'secondary'}
                      font="14px"
                    >
                      {title}
                    </Text>
                  </a>
                </Link>
              </Flex>
            );
          })}
        </Flex>
      </Grid.Container>
    </Container>
  );
};

export default Navigation;
