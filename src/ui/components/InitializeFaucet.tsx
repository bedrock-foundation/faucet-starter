import React from 'react';
import { Button, Card, Link, Spacer, Text } from '@geist-ui/core';
import { trpc } from '~/shared/trpc';
import { Droplet } from '@geist-ui/icons';
import Flex from '~/ui/elements/Flex';

const InitializeFaucet: React.FC = () => {
  const utils = trpc.useContext();
  const initFaucet = trpc.faucet.initialize.useMutation({
    onSuccess: () => {
      utils.invalidate();
    },
  });

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
              <Link href="https://solanapay.com" target="_blank">
                <Text b span type="success">
                  Solana Pay
                </Text>
              </Link>
              &nbsp;is a new way to interact with your web3 audience using&nbsp;
              <Text b span>
                QR codes
              </Text>
              . Click the button below to initialize your faucet or checkout
              the&nbsp;
              <Link href="https://learn.bedrocklabs.xyz/solana-pay/introduction">
                <Text b span type="success">
                  tutorial
                </Text>
              </Link>
              &nbsp;to learn more.
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
            </Flex>
          </Flex>
        </Flex>
      </Card>
    </div>
  );
};

export default InitializeFaucet;
