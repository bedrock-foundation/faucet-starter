import React from 'react';
import styled from '@emotion/styled';
import { Button, Card, Divider, Input, Spacer, Text } from '@geist-ui/core';
import useModal from '../hooks/useModal.hook';
import Label from '../elements/Label';
import ModalHeader from './ModalHeader';
import Flex from '../elements/Flex';
import { Faucet } from '~/server/services/faucet/faucet.service';
import TokenDropdown from '../elements/TokenDropdown';
import TokenUtil from '~/shared/utils/TokenUtil';
import { trpc } from '~/shared/trpc';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export type ConfigureFaucetModalProps = {
  faucet: Faucet | null;
};

const ConfigureFaucetModal: React.FC<ConfigureFaucetModalProps> = ({
  faucet,
}) => {
  /** Hooks */
  const { pop } = useModal();

  /** State */
  const [tokenMint, setTokenMint] = React.useState(faucet?.tokenMint ?? '');
  const [tokenMintAmount, setTokenMintAmount] = React.useState(
    faucet?.tokenMintAmount ?? '0',
  );
  const tokens = TokenUtil.tokenInfoList;

  /** Actions */
  const faucetQuery = trpc.faucet.get.useQuery({});
  const updateFaucet = trpc.faucet.update.useMutation({
    onSuccess: async () => {
      faucetQuery.refetch();
      pop();
    },
  });

  /* Render */
  return (
    <Card width="400px">
      <ModalHeader title="Configure Faucet" />
      <Divider h="1px" my={0} />
      <Card.Content>
        <Content>
          <Text marginTop="0px">
            Select a token and enter the number of tokens a user should recieve
            when redeeming from this faucet.
          </Text>
          <Flex direction="column" width="100%">
            <Label tip="Select the token you would like a user to receive upon redemption">
              Select Token
            </Label>
            <TokenDropdown
              value={TokenUtil.tokenInfoMap.get(tokenMint)?.name ?? ''}
              tokens={tokens}
              onSelect={(mint: string) => {
                setTokenMint(mint);
              }}
              scale={1.25}
            />
          </Flex>
          <Spacer />
          <Flex direction="column" width="100%">
            <Label tip="Enter the number of tokens you would like a user to receive upon redemption">
              Tokens Per Redemption
            </Label>
            <Input
              value={tokenMintAmount}
              onChange={(e) => setTokenMintAmount(e.target.value)}
              placeholder="Tokens Per Redemption"
              width="100%"
              scale={1.25}
            />
          </Flex>
        </Content>
      </Card.Content>
      <Divider h="1px" my={0} />
      <Card.Content>
        <Flex justify="flex-end">
          <Button onClick={pop} auto>
            Cancel
          </Button>
          <Spacer />
          <Button
            auto
            type="secondary"
            loading={updateFaucet.isLoading || faucetQuery.isLoading}
            onClick={async () => {
              await updateFaucet.mutateAsync({
                tokenMint,
                tokenMintAmount,
              });
            }}
          >
            Save
          </Button>
        </Flex>
      </Card.Content>
    </Card>
  );
};

export default ConfigureFaucetModal;
