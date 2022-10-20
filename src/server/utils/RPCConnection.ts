import { Connection } from '@solana/web3.js';

const RPCConnection = new Connection(
  process.env.SOLANA_RPC_ENDPOINT ?? '',
  'confirmed',
);

export default RPCConnection;
