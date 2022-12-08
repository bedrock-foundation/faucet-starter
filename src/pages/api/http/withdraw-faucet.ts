import { NextApiRequest, NextApiResponse } from 'next';
import { withdrawFaucet } from '../../..//server/services/faucet/faucet.http';

export default async function withdrawFaucetRoute(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return withdrawFaucet(req, res);
}
