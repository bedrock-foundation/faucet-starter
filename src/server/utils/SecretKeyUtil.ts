import { Keypair } from '@solana/web3.js';
import fs from 'fs-extra';

const SecretKeyMap = new Map<string, Keypair>();

const keyPairFromFile = async (filePath: string): Promise<Keypair | null> => {
  if (SecretKeyMap.has(filePath)) {
    return SecretKeyMap?.get(filePath) ?? null;
  }

  const file = await fs.readFile(filePath, 'utf8');
  const json = JSON.parse(file);
  const pair = Keypair.fromSecretKey(new Uint8Array(json));
  SecretKeyMap.set(filePath, pair);
  return pair;
};

const faucetSecretKey = async (): Promise<Keypair | null> => {
  const path = process.env.FAUCET_SECRET_KEY_PATH;

  if (!path) {
    console.error('FAUCET_SECRET_KEY_PATH is not set');
    process.exit(1);
  }
  return await keyPairFromFile(process.env.FAUCET_SECRET_KEY_PATH ?? '');
};

const SecretKeyUtil = {
  faucetSecretKey,
};

export default SecretKeyUtil;
