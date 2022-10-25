import { TokenListProvider, TokenInfo, ENV } from '@solana/spl-token-registry';
import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import * as spl from '@solana/spl-token';
import RPCConnection from '~/server/utils/RPCConnection';

export type { TokenInfo } from '@solana/spl-token-registry';

export type TokenBalance = {
  mint: string;
  amount: string;
  info: TokenInfo | null;
};

export interface TransferSplTokenParams {
  fromAccountPublicKey: PublicKey;
  toAccountPublicKey: PublicKey;
  splTokenPublicKey: PublicKey;
  amount: string;
  feePayerPublicKey: PublicKey;
  refs: PublicKey[];
}

const tokenInfoMap = new Map<string, TokenInfo>();

(async () => {
  new TokenListProvider().resolve().then((provider) => {
    const tokenList = provider.filterByChainId(ENV.MainnetBeta).getList();

    tokenList.forEach((tokenInfo: TokenInfo) => {
      tokenInfoMap.set(tokenInfo.address, tokenInfo);
    });
  });
})();

const isTokenBalanceValid = (
  requiredTokenBalance: TokenBalance,
  availableTokenBalance: TokenBalance[],
): boolean => {
  const userTokenBalance = availableTokenBalance.find(
    (userTokenBalance) => userTokenBalance.mint === requiredTokenBalance.mint,
  );
  if (!userTokenBalance) {
    return false;
  }
  return BigInt(userTokenBalance.amount) >= BigInt(requiredTokenBalance.amount);
};

const convertSizeToQuantity = (
  size: string,
  address: string,
  tokenInfo?: TokenInfo,
): string | null => {
  tokenInfo = tokenInfo ?? TokenUtil.tokenInfoMap.get(address);

  if (!tokenInfo) return null;

  return String(BigInt(Number(size)) * BigInt(10 ** tokenInfo.decimals));
};

const convertQuantityToSize = (
  quantity: string,
  address: string,
  tokenInfo?: TokenInfo,
): string | null => {
  if (quantity === 'Infinity') return '∞';

  tokenInfo = tokenInfo ?? TokenUtil.tokenInfoMap.get(address);

  if (!tokenInfo) return null;

  return String(BigInt(quantity) / BigInt(10 ** tokenInfo.decimals));
};

const formatQuantity = (
  quantity: string,
  address: string,
  tokenInfo?: TokenInfo,
): string | null => {
  tokenInfo = tokenInfo ?? TokenUtil.tokenInfoMap.get(address);

  if (!tokenInfo) return null;

  if (tokenInfo.decimals === 0) return quantity;

  const length = quantity.length;
  let value = '';

  if (length <= tokenInfo.decimals) {
    value = `0.${quantity.slice(-tokenInfo.decimals)}`;
  }

  value = `${quantity.slice(0, length - tokenInfo.decimals)}.${quantity.slice(
    -tokenInfo.decimals,
  )}`;

  return (+value).toFixed(3).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1');
};

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

const TokenUtil = {
  tokenInfoMap,
  isTokenBalanceValid,
  convertSizeToQuantity,
  convertQuantityToSize,
  formatQuantity,
  transferSPLToken,
};

export default TokenUtil;
