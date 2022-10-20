import React from 'react';
import { useTheme, Text, Badge, Spacer } from '@geist-ui/core';
import type {
  Faucet,
  FaucetStatus,
} from '~/server/services/faucet/faucet.service';
import FaucetUtil from '~/shared/utils/FaucetUtil';
import Flex from '../elements/Flex';
import { trpc } from '~/shared/trpc';

type FaucetStatusProps = {
  faucet: Faucet;
};

const FaucetStatusView: React.FC<FaucetStatusProps> = ({ faucet }) => {
  const theme = useTheme();
  const { data: balances } = trpc.faucet.balance.useQuery({});
  const status: FaucetStatus = FaucetUtil.faucetStatus(faucet, balances ?? []);

  return (
    <Flex align="center">
      <Flex align="flex-start" flex="0">
        <Badge
          dot
          style={{
            background: {
              ['Unfunded']: theme.palette.error,
              ['Active']: theme.palette.cyanDark,
            }[status],
          }}
        />
        <Spacer w={0.5} h={0} />
      </Flex>
      <Flex align="flex-start">
        <Text margin="0px" font="14px" b>
          {status}
        </Text>
      </Flex>
    </Flex>
  );
};

export default FaucetStatusView;
