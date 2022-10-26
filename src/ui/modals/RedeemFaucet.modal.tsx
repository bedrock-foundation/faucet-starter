import React from 'react';
import styled from '@emotion/styled';
import { Button, Card, Divider, Spacer, Text } from '@geist-ui/core';
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

export type RedeemFaucetModalProps = {
  faucetId: Faucet['id'];
};

const RedeemFaucetModal: React.FC<RedeemFaucetModalProps> = () => {
  /** Hooks */

  const { pop } = useModal();
  const printRef = React.useRef<any>(null);
  const redeemFaucetUrl = String(
    encodeURL({
      link: new URL(
        `https://bedrock-platform-production.ngrok.io/api/http/redeem-faucet`,
      ),
    }),
  );

  /** Actions */
  const download = async () => {
    const element = printRef?.current ?? null;
    if (!element) return;
    const canvas = element.canvas.current;

    const data = canvas.toDataURL();
    const link = document.createElement('a');

    if (typeof link.download === 'string') {
      link.href = data;
      link.download = `faucet-qr-code.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(data);
    }
  };

  /* Render */
  return (
    <Card width="400px">
      <ModalHeader title="Redemption QR Code" />
      <Divider h="1px" my={0} />
      <Card.Content>
        <Content>
          <Text marginTop="0px">
            Download the QR code below and distribute it to your audience IRL,
            on Twitter, Discord, or wherever else you&apos;d like.
          </Text>
          <QRCode ref={printRef} value={redeemFaucetUrl} />
        </Content>
      </Card.Content>
      <Divider h="1px" my={0} />
      <Card.Content>
        <Flex justify="flex-end">
          <Button onClick={pop} auto>
            Close
          </Button>
          <Spacer />
          <Button auto type="secondary" onClick={() => download()}>
            Download
          </Button>
        </Flex>
      </Card.Content>
    </Card>
  );
};

export default RedeemFaucetModal;
