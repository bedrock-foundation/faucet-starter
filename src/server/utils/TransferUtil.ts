import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import * as spl from '@solana/spl-token';
import RPCConnection from '~/server/utils/RPCConnection';

export interface TransferSplTokenParams {
  fromAccountPublicKey: PublicKey;
  toAccountPublicKey: PublicKey;
  splTokenPublicKey: PublicKey;
  amount: string;
  feePayerPublicKey: PublicKey;
  refs: PublicKey[];
}

const transferSPLToken = async (
  params: TransferSplTokenParams,
): Promise<TransactionInstruction[]> => {
  const {
    fromAccountPublicKey,
    toAccountPublicKey,
    splTokenPublicKey,
    amount,
    feePayerPublicKey,
    refs,
  } = params;
  const transferIxs = [];

  const toAccountAtaPublicKey = spl.getAssociatedTokenAddressSync(
    splTokenPublicKey,
    toAccountPublicKey,
    false,
    spl.TOKEN_PROGRAM_ID,
    spl.ASSOCIATED_TOKEN_PROGRAM_ID,
  );

  const account = await RPCConnection.getAccountInfo(toAccountAtaPublicKey);

  if (account === null) {
    const createAtaIx = spl.createAssociatedTokenAccountInstruction(
      feePayerPublicKey,
      toAccountAtaPublicKey,
      toAccountPublicKey,
      splTokenPublicKey,
      spl.TOKEN_PROGRAM_ID,
      spl.ASSOCIATED_TOKEN_PROGRAM_ID,
    );

    transferIxs.push(createAtaIx);
  }

  const fromAccountAtaPublicKey = await spl.getAssociatedTokenAddress(
    splTokenPublicKey,
    fromAccountPublicKey,
    false,
    spl.TOKEN_PROGRAM_ID,
    spl.ASSOCIATED_TOKEN_PROGRAM_ID,
  );

  const transferIx = spl.createTransferInstruction(
    fromAccountAtaPublicKey,
    toAccountAtaPublicKey,
    fromAccountPublicKey,
    BigInt(amount),
  );

  refs.forEach((ref) => {
    transferIx.keys.push({ pubkey: ref, isWritable: false, isSigner: false });
  });

  transferIxs.push(transferIx);

  return transferIxs;
};

const TransferUtil = {
  transferSPLToken,
};

export default TransferUtil;
