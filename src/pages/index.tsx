import React from 'react';
import {
  Button,
  GeistUIThemes,
  Grid,
  Loading,
  Spacer,
  useTheme,
} from '@geist-ui/core';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { trpc } from '~/shared/trpc';
import PageHeader from '~/ui/components/PageHeader';
import Flex from '~/ui/elements/Flex';
// import useModal from '../../hooks/useModal.hook';
// import { ModalTypes } from '../../components/modal/Modal';
import PageLayout from '~/ui/components/PageLayout';
import InitializeFaucet from '~/ui/components/InitializeFaucet';
import FaucetDetailsCard from '~/ui/components/FaucetDetailsCard';

type ContainerProps = {
  theme: GeistUIThemes;
};

const Container = styled.div<ContainerProps>`
  position: relative;
  min-height: calc(100vh - 198px);
  background-color: ${(props) => props.theme.palette.accents_1};
`;

const Content = styled.div`
  position: relative;
  width: 1000px;
  height: 100%;
  box-sizing: border-box;
`;

type FaucetPageProps = any;

const FaucetPage: React.FC<FaucetPageProps> = () => {
  const router = useRouter();
  const theme = useTheme();
  // const { push } = useModal();
  const { data: faucet, isLoading } = trpc.faucet.get.useQuery({});

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
        <Grid.Container
          height="fit-content"
          justify="center"
          direction="column"
          alignItems="center"
          style={{ background: theme.palette.accents_1 }}
        >
          {(() => {
            if (isLoading) {
              return (
                <Grid.Container
                  height="calc(100vh - 198px)"
                  justify="center"
                  style={{ background: theme.palette.accents_1 }}
                >
                  <Loading />
                </Grid.Container>
              );
            }

            if (!faucet) {
              return <InitializeFaucet />;
            }

            return (
              <Grid.Container
                direction="row"
                width="1000px"
                margin="8px"
                gap={2}
              >
                <Content>
                  <FaucetDetailsCard faucet={faucet} />
                </Content>
              </Grid.Container>
            );
          })()}
        </Grid.Container>
      </Container>
    </PageLayout>
  );
};

export default FaucetPage;
