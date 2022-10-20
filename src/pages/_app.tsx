import React from 'react';
import { RecoilRoot } from 'recoil';
import { GeistProvider, CssBaseline } from '@geist-ui/core';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { trpc } from '~/utils/trpc';
// import { ModalProvider } from '../components/modal/Modal';
// import Colors from '../styles/Colors';
// import Flex from '../elements/Flex';
// import DefaultSEO from '../components/DefaultSeo';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  /* Hooks */
  const router = useRouter();

  /* Render */
  return (
    <RecoilRoot>
      <GeistProvider themeType="dark">
        <CssBaseline />

        {/* <ModalProvider /> */}
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
