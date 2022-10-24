import React from 'react';
import {
  Card,
  Grid,
  useTheme,
  Text,
  Spacer,
  Loading,
  Image,
  useToasts,
  useClipboard,
} from '@geist-ui/core';
import styled from '@emotion/styled';
import Flex from '../elements/Flex';
import FaucetStatusView from './FaucetStatus';
import FaucetUtil from '~/shared/utils/FaucetUtil';
import TokenUtil, { TokenBalance } from '~/shared/utils/TokenUtil';
import type { Faucet } from '~/server/services/faucet/faucet.service';
import { trpc } from '~/shared/trpc';
import AccountUtil from '~/shared/utils/AccountUtil';

const Container = styled.div`
  position: relative;
  height: 100%;
  box-sizing: border-box;
`;

type FaucetDetailsCardProps = {
  faucet: Faucet;
};

const convert = (balance: TokenBalance) => {
  return (
    TokenUtil.formatQuantity(
      balance.amount ?? '0',
      balance?.mint,
      balance?.info ?? undefined,
    ) ?? '0'
  );
};

const TokenBalanceView = ({ balance }: { balance: TokenBalance }) => (
  <Flex align="center">
    <Image
      src={balance?.info?.logoURI ?? ''}
      height="16px"
      marginRight="4px"
      style={{ borderRadius: '50%' }}
    />
    <Text font="14px" b>
      {convert(balance)}
    </Text>
    <Spacer />
  </Flex>
);

const FaucetDetailsCardInner: React.FC<FaucetDetailsCardProps> = ({
  faucet,
}) => {
  const { data } = trpc.faucet.analytics.useQuery({});
  const { setToast } = useToasts();
  const { copy } = useClipboard();

  const fields = [
    {
      key: 'Status',
      value: (
        <Flex>
          <FaucetStatusView faucet={faucet} />
        </Flex>
      ),
    },
    {
      key: 'Balance',
      value: (
        <Flex>
          {(() => {
            const filteredBalances =
              data?.balances?.filter(
                (balance) => BigInt(balance.amount) > BigInt(0),
              ) ?? [];

            if (filteredBalances.length) {
              return filteredBalances.map((balance, index) => (
                <TokenBalanceView key={index} balance={balance} />
              ));
            }

            return (
              <Text span type="error">
                Empty
              </Text>
            );
          })()}
        </Flex>
      ),
    },
    {
      key: 'Faucet Address',
      value: (
        <Text
          font="14px"
          onClick={() => {
            copy(faucet.address);
            setToast({ text: 'Address Copied.', delay: 3000 });
          }}
          b
        >
          {AccountUtil.truncate(faucet.address)}
        </Text>
      ),
    },
    {
      key: 'Tokens Per Redemption',
      value: (
        <Flex>
          <TokenBalanceView
            balance={FaucetUtil.faucetRedemptionBalance(faucet)}
          />
        </Flex>
      ),
    },
    {
      key: 'Total Tokens Redeemed',
      value: (
        <Flex>
          {data?.tokensRedeemed?.length ?? 0 > 0
            ? data?.tokensRedeemed.map((balance, index) => (
                <TokenBalanceView key={index} balance={balance} />
              ))
            : 'None'}
        </Flex>
      ),
    },
    {
      key: 'Total Redemptions',
      value: BigInt(data?.redemptions ?? 0).toLocaleString(),
    },
    {
      key: 'Unique Accounts',
      value: data?.uniqueAccounts ?? 0,
    },
  ];

  return (
    <Container>
      <Card height="fit-content">
        <Grid.Container gap={2}>
          {fields.map(({ key, value }, index: number) => {
            return (
              <Grid xs={6} key={index}>
                <Flex direction="column">
                  <Text font="12px" type="secondary" span b>
                    {key}
                  </Text>
                  <Flex align="center">
                    <Text font="14px" b>
                      {value}
                    </Text>
                  </Flex>
                </Flex>
              </Grid>
            );
          })}
        </Grid.Container>
      </Card>
    </Container>
  );
};

const FaucetDetailsCard = (props: FaucetDetailsCardProps) => {
  const theme = useTheme();

  return (
    <React.Suspense
      fallback={
        <Container theme={theme}>
          <Card width="100%" padding="0">
            <Flex align="center" justify="center" height="400px">
              <Loading />
            </Flex>
          </Card>
        </Container>
      }
    >
      <FaucetDetailsCardInner {...props} />
    </React.Suspense>
  );
};

export default FaucetDetailsCard;
