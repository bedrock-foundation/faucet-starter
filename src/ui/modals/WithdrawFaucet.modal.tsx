import React from 'react';
import styled from '@emotion/styled';
import { Button, Card, Divider, Text } from '@geist-ui/core';
import useModal from '../hooks/useModal.hook';
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

export type WithdrawFaucetModalProps = {
  faucetId: Faucet['id'];
};

const WithdrawFaucetModal: React.FC<WithdrawFaucetModalProps> = () => {
  /** Hooks */
  const { pop } = useModal();
  const fundFaucetURL = String(
    encodeURL({
      link: new URL(
        `${process.env.NEXT_PUBLIC_SOLANA_PAY_TLS_SERVER_ADDRESS}/api/http/withdraw-faucet`,
      ),
    }),
  );

  /* Render */
  return (
    <Card width="400px">
      <ModalHeader title="Withdraw Tokens" />
      <Divider h="1px" my={0} />
      <Card.Content>
        <Content>
          <Text marginTop="0px">
            Scan the QR code below with a Solana Pay enabled mobile wallet to
            withdraw all the remaining tokens from this faucet.
          </Text>
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

export default WithdrawFaucetModal;
