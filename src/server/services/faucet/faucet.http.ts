import { NextApiRequest, NextApiResponse } from 'next';
import faucetService from './faucet.service';
import { router } from '~/server/trpc';

type ResponseError = {
  message: string;
};

const caller = router({
  faucet: faucetService.router,
}).createCaller({});

const isGetRequest = (req: NextApiRequest) => req.method === 'GET';

const metadata = (res: NextApiResponse, label: string) => {
  res.status(200).json({
    label,
    icon: 'https://storage.googleapis.com/bedrock-platform-assets-production-mainnet/brand/bedrock-logo.png',
  });

  return null;
};

export async function fundFaucet(
  req: NextApiRequest,
  res: NextApiResponse<any | ResponseError>,
) {
  if (isGetRequest(req)) {
    return metadata(res, 'Fund Faucet');
  }

  console.log(req.body, req.query);

  const { transaction, message } = await caller.faucet.fund({
    account: req.body.account as string,
    redemptions: req.query.redemptions as string,
  });

  res.status(200).json({
    transaction: transaction.toString('base64'),
    message,
  });
}
