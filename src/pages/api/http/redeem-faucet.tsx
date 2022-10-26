import { NextApiRequest, NextApiResponse } from 'next';
import { redeemFaucet } from '~/server/services/faucet/faucet.http';

export default async function redeemFaucetRoute(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return redeemFaucet(req, res);
}
