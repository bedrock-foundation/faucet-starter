import { TokenInfo } from '@solana/spl-token-registry';

export type { TokenInfo } from '@solana/spl-token-registry';

export type TokenBalance = {
  mint: string;
  amount: string;
  info: TokenInfo | null;
};

export const tokenInfoList: TokenInfo[] = [
  {
    chainId: 101,
    address: '3BRtC2VUpFdcw5QdhBSjXGVtGjac43bpDCeszK3H8mk7',
    symbol: 'BTT',
    name: 'Bedrock Tutorial Token',
    decimals: 0,
    logoURI:
      'https://storage.googleapis.com/bedrock-platform-uploads-production-mainnet/bedrock-logo-T2OR_WXX_.png',
    extensions: {
      website: 'https://learn.bedrocklabs.xyz',
    },
  },
];

export const tokenInfoMap = new Map<string, TokenInfo>(
  tokenInfoList.map((token) => [token.address, token]),
);

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

const TokenUtil = {
  tokenInfoList,
  tokenInfoMap,
  isTokenBalanceValid,
  convertSizeToQuantity,
  convertQuantityToSize,
  formatQuantity,
};

export default TokenUtil;
