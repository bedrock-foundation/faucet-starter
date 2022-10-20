import { TokenListProvider, TokenInfo, ENV } from '@solana/spl-token-registry';

export type { TokenInfo } from '@solana/spl-token-registry';

export type TokenBalance = {
  mint: string;
  amount: string;
  info: TokenInfo | null;
};

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
  tokenType: string,
  tokenInfo?: TokenInfo,
): string | null => {
  tokenInfo = tokenInfo ?? TokenUtil.tokenInfoMap.get(tokenType);

  if (!tokenInfo) return null;

  return String(BigInt(Number(size)) * BigInt(10 ** tokenInfo.decimals));
};

const convertQuantityToSize = (
  quantity: string,
  tokenType: string,
  tokenInfo?: TokenInfo,
): string | null => {
  if (quantity === 'Infinity') return '∞';

  tokenInfo = tokenInfo ?? TokenUtil.tokenInfoMap.get(tokenType);

  if (!tokenInfo) return null;

  return String(BigInt(quantity) / BigInt(10 ** tokenInfo.decimals));
};

const formatQuantity = (
  quantity: string,
  tokenType: string,
  tokenInfo?: TokenInfo,
): string | null => {
  tokenInfo = tokenInfo ?? TokenUtil.tokenInfoMap.get(tokenType);

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
  tokenInfoMap,
  isTokenBalanceValid,
  convertSizeToQuantity,
  convertQuantityToSize,
  formatQuantity,
};

export default TokenUtil;
