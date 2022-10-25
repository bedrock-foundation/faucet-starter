import React from 'react';
import { RecoilRoot } from 'recoil';
import { GeistProvider, CssBaseline, Loading } from '@geist-ui/core';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { trpc } from '~/shared/trpc';
import ReactTooltip from 'react-tooltip';
import Colors from '~/ui/Colors';
import styled from '@emotion/styled';
import { ModalProvider } from '../ui/modals/Modal';
import Flex from '~/ui/elements/Flex';

const Tooltip = styled(ReactTooltip)`
  color: ${Colors.White};
  border-radius: 4px;
  max-width: 250px;
  padding: 12px !important;
  background-color: ${Colors.accents_2} !important;
`;

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  /* Hooks */
  const router = useRouter();

  /* State */
  const [isMounted, setIsMounted] = React.useState(false);
  /* Effects */
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  /* Render */
  return (
    <RecoilRoot>
      <GeistProvider themeType="dark">
        <CssBaseline />
        {isMounted && <Tooltip />}
        <ModalProvider />
        {isMounted ? (
          <Component
            {...pageProps}
            key={router.asPath}
            suppressHydrationWarning
          />
        ) : (
          <Flex height="100vh" width="100vw" justify="center" align="center">
            <Loading />
          </Flex>
        )}
      </GeistProvider>
    </RecoilRoot>
  );
};

export default trpc.withTRPC(App);
