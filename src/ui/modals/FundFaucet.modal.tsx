import React from 'react';
import styled from '@emotion/styled';
import { Button, Card, Divider, Input, Spacer, Text } from '@geist-ui/core';
import useModal from '../hooks/useModal.hook';
import Label from '../elements/Label';
import ModalHeader from './ModalHeader';
// import TransactionButton from '../TransactionButton';
import Flex from '../elements/Flex';
import { Faucet } from '~/server/services/faucet/faucet.service';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export type FundFaucetModalProps = {
  faucetId: Faucet['id'];
};

const FundFaucetModal: React.FC<FundFaucetModalProps> = ({ faucetId }) => {
  /** Hooks */
  const { pop } = useModal();
  const [redemptions, setRedemptions] = React.useState(0);
  // const result = DripSDK.fundFaucet({ faucetId, redemptions });

  /* Render */
  return (
    <Card width="500px">
      <ModalHeader title="Add Redemptions" />
      <Divider h="1px" my={0} />
      <Card.Content>
        <Content>
          <Text marginTop="0px">
            Enter the number of redemptions you would like to add to this
            campaign and click Add Funds to approve the transaction.
          </Text>
          <Label tip="Enter the number of redemptions you would like to add to this Campaign.">
            Number of Redemptions
          </Label>
          <Input
            value={String(redemptions)}
            onChange={(e) => setRedemptions(parseInt(e.target.value, 10))}
            placeholder="Number of Redemptions"
            scale={2}
            font="16px"
            width="100%"
          />
        </Content>
      </Card.Content>
      <Divider h="1px" my={0} />
      <Card.Content>
        <Flex justify="flex-end">
          <Button onClick={pop} auto>
            Cancel
          </Button>
          <Spacer />
          {/* <TransactionButton
            auto
            type="secondary"
            link={result}
            onComplete={() => pop()}
          >
            Add Funds
          </TransactionButton> */}
        </Flex>
      </Card.Content>
    </Card>
  );
};

export default FundFaucetModal;
