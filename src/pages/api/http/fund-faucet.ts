import { NextApiRequest, NextApiResponse } from 'next';
import { fundFaucet } from '~/server/services/faucet/faucet.http';

export default async function fundFaucetRoute(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  return fundFaucet(req, res);
}
