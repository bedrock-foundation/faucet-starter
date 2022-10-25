import TokenUtil from './TokenUtil';
import type { TokenBalance } from './TokenUtil';
import type {
  Faucet,
  FaucetStatus,
} from '~/server/services/faucet/faucet.service';

const faucetRedemptionBalance = (faucet: Faucet): TokenBalance => {
  const info = TokenUtil.tokenInfoMap.get(faucet.tokenMint);
  const qty = TokenUtil.convertSizeToQuantity(
    faucet.tokenMintAmount,
    faucet.tokenMint,
    info,
  );

  return {
    mint: faucet.tokenMint,
    amount: qty ?? '0',
    info: info ?? null,
  };
};

const faucetStatus = (
  faucet: Faucet,
  faucetBalance: TokenBalance[],
): FaucetStatus => {
  const redemptionBalance = faucetRedemptionBalance(faucet);

  if (!TokenUtil.isTokenBalanceValid(redemptionBalance, faucetBalance)) {
    return 'Unfunded' as FaucetStatus;
  }

  return 'Active' as FaucetStatus;
};

const FaucetUtil = {
  faucetRedemptionBalance,
  faucetStatus,
};

export default FaucetUtil;
