import { Connection } from '@solana/web3.js';

const RPCConnection = process.env.SOLANA_RPC_ENDPOINT
  ? new Connection(process.env.SOLANA_RPC_ENDPOINT ?? '', 'confirmed')
  : null;

export default RPCConnection;
