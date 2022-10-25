import React from 'react';
import styled from '@emotion/styled';
import { Button, Card, Divider, Input, Spacer, Text } from '@geist-ui/core';
import useModal from '../hooks/useModal.hook';
import Label from '../elements/Label';
import ModalHeader from './ModalHeader';
import Flex from '../elements/Flex';
import { Faucet } from '~/server/services/faucet/faucet.service';
import QRCode from '../elements/QRCode';
import { encodeURL } from '@solana/pay';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export type FundFaucetModalProps = {
  faucetId: Faucet['id'];
};

const FundFaucetModal: React.FC<FundFaucetModalProps> = ({ faucetId }) => {
  /** Hooks */
  const { pop } = useModal();
  const [redemptions, setRedemptions] = React.useState(100);
  const fundFaucetURL = String(
    encodeURL({
      link: new URL(
        `https://bedrock-platform-production.ngrok.io/api/http/fund-faucet?redemptions=${redemptions}&faucetId=${faucetId}`,
      ),
    }),
  );

  console.log(fundFaucetURL);

  /* Render */
  return (
    <Card width="400px">
      <ModalHeader title="Add Tokens" />
      <Divider h="1px" my={0} />
      <Card.Content>
        <Content>
          <Text marginTop="0px">
            Enter the number of redemptions you would like to add to this
            faucet, then scan the QR code below with a Solana Pay enabled mobile
            wallet.
          </Text>
          <Flex direction="column" width="100%">
            <Label tip="Enter the number of redemptions you would like to add to this Campaign.">
              Number of Redemptions
            </Label>
            <Input
              value={String(redemptions)}
              onChange={(e) => setRedemptions(Number(e.target.value))}
              inputMode="numeric"
              htmlType="number"
              placeholder="Number of Redemptions"
              scale={1.25}
              width="100%"
            />
          </Flex>
          <Spacer />
          <QRCode value={fundFaucetURL} />
        </Content>
      </Card.Content>
      <Divider h="1px" my={0} />
      <Card.Content>
        <Flex justify="flex-end">
          <Button onClick={pop} auto>
            Close
          </Button>
        </Flex>
      </Card.Content>
    </Card>
  );
};

export default FundFaucetModal;
