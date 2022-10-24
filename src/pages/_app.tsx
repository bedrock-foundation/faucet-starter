import React from 'react';
import { RecoilRoot } from 'recoil';
import { GeistProvider, CssBaseline } from '@geist-ui/core';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { trpc } from '~/shared/trpc';
import ReactTooltip from 'react-tooltip';
import Colors from '~/ui/Colors';
import styled from '@emotion/styled';
import { ModalProvider } from '../ui/modals/Modal';
// import Colors from '../styles/Colors';
// import Flex from '../elements/Flex';
// import DefaultSEO from '../components/DefaultSeo';

const Tooltip = styled(ReactTooltip)`
  color: ${Colors.White};
  border-radius: 4px;
  max-width: 250px;
  padding: 12px !important;
  background-color: rgba(0, 0, 0, 0.8) !important;
`;

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  /* Hooks */
  const router = useRouter();

  /* Render */
  return (
    <RecoilRoot>
      <GeistProvider themeType="dark">
        <CssBaseline />
        <Tooltip />
        <ModalProvider />
        <Component
          {...pageProps}
          key={router.asPath}
          suppressHydrationWarning
        />
      </GeistProvider>
    </RecoilRoot>
  );
};

export default trpc.withTRPC(App);
