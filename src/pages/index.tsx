import React from 'react';
import {
  Button,
  Card,
  GeistUIThemes,
  Grid,
  Link,
  Loading,
  Spacer,
  Text,
  useTheme,
} from '@geist-ui/core';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { useRecoilValue } from 'recoil';
import { trpc } from '~/shared/trpc';
import { Droplet } from '@geist-ui/icons';
import { NextPageContext } from 'next';
import PageHeader from '~/ui/components/PageHeader';
import Flex from '~/ui/elements/Flex';
// import useModal from '../../hooks/useModal.hook';
// import { ModalTypes } from '../../components/modal/Modal';
import PageLayout from '~/ui/components/PageLayout';

type ContainerProps = {
  theme: GeistUIThemes;
};

const Container = styled.div<ContainerProps>`
  position: relative;
  min-height: calc(100vh - 198px);
  background-color: ${(props) => props.theme.palette.accents_1};
`;

type FaucetListProps = any;

const List = () => {
  // const { push } = useModal();
  const router = useRouter();
  const initFaucet = trpc.faucet.initialize.useMutation();

  if (true) {
    return (
      <div>
        <Spacer />
        <Card width="1000px" height="500px">
          <Flex
            align="center"
            justify="center"
            height="450px"
            flex="1"
            direction="column"
          >
            <Flex
              align="center"
              justify="center"
              flex="1"
              direction="column"
              width="470px"
            >
              <Droplet size={60} />
              <Spacer h={0.5} />
              <Text style={{ textAlign: 'center' }} font="16px">
                <Text b span>
                  Drip
                </Text>
                &nbsp;is a new way to airdrop tokens to your web3 audience
                using&nbsp;
                <Link href="https://solanapay.com" target="_blank">
                  <Text b span type="success">
                    Solana Pay
                  </Text>
                </Link>
                . It takes about{' '}
                <Text b span>
                  2 minutes
                </Text>{' '}
                to create a Drip QR code. Create a Campaign below to get
                started, or{' '}
                <Link href="https://google.com">
                  <Text b span type="success">
                    learn more
                  </Text>
                  .
                </Link>
              </Text>
              <Spacer h={0.5} />
              <Flex width="80%">
                <Button
                  width="100%"
                  scale={1.25}
                  onClick={async () => await initFaucet.mutateAsync({})}
                >
                  Initialize Faucet
                </Button>
                {/* <Button onClick={() => router.push("/dashboard/create-drip")}>
                  View Documentation
                </Button>
                <Spacer /> */}
              </Flex>
            </Flex>
          </Flex>
        </Card>
      </div>
    );
  }

  // return (
  //   <Grid.Container direction="row" width="1024px" margin="8px" gap={2}>
  //     {faucetList?.map((faucet: Faucet, index: number) => {
  //       return (
  //         <Grid xs={8} key={index}>
  //           <FaucetCard faucet={faucet} />
  //         </Grid>
  //       );
  //     })}
  //   </Grid.Container>
  // );
};

const FaucetList: React.FC<FaucetListProps> = () => {
  const router = useRouter();
  const theme = useTheme();
  // const { push } = useModal();

  return (
    <PageLayout>
      <PageHeader title="Overview">
        <Flex>
          <Button auto onClick={() => router.push('/PageLayout/create-drip')}>
            Withdraw Tokens
          </Button>
          <Spacer w={1} />
          <Button auto onClick={() => router.push('/PageLayout/create-drip')}>
            Add Tokens
          </Button>
          <Spacer />
          <Button auto onClick={() => router.push('/PageLayout/create-drip')}>
            Configure
          </Button>
          <Spacer />
          <Button
            type="secondary"
            auto
            onClick={() => router.push('/PageLayout/create-drip')}
          >
            View QR Code
          </Button>
        </Flex>
      </PageHeader>
      <Container theme={theme}>
        <React.Suspense
          fallback={
            <Grid.Container
              height="calc(100vh - 198px)"
              justify="center"
              style={{ background: theme.palette.accents_1 }}
            >
              <Loading />
            </Grid.Container>
          }
        >
          <Grid.Container
            height="fit-content"
            justify="center"
            style={{ background: theme.palette.accents_1 }}
          >
            <List />
          </Grid.Container>
        </React.Suspense>
      </Container>
    </PageLayout>
  );
};

export default FaucetList;

export async function getStaticProps(context: NextPageContext) {
  console.log(`Building slug: ${context.pathname}`);
  return {
    props: {},
  };
}
