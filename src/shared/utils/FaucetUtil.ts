import TokenUtil from './TokenUtil';
import type { TokenBalance } from './TokenUtil';
import type {
  Faucet,
  FaucetStatus,
} from '~/server/services/faucet/faucet.service';

const faucetRedemptionBalance = (faucet: Faucet): TokenBalance => {
  return {
    mint: faucet.tokenMint,
    amount: faucet.tokenMintAmount,
    info: null,
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
