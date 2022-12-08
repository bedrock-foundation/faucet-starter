import { NextApiRequest, NextApiResponse } from 'next';
import { fundFaucet } from '../../../server/services/faucet/faucet.http';

export default async function fundFaucetRoute(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return fundFaucet(req, res);
}
