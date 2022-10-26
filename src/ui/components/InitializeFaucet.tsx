import React from 'react';
import { Button, Card, Link, Spacer, Text } from '@geist-ui/core';
import { trpc } from '~/shared/trpc';
import { Droplet } from '@geist-ui/icons';
import Flex from '~/ui/elements/Flex';

const InitializeFaucet: React.FC = () => {
  const initFaucet = trpc.faucet.initialize.useMutation();

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
              to create a Drip QR code. Create a Campaign below to get started,
              or{' '}
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
            </Flex>
          </Flex>
        </Flex>
      </Card>
    </div>
  );
};

export default InitializeFaucet;
