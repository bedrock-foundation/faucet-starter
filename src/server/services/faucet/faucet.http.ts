import { NextApiRequest, NextApiResponse } from 'next';
import { appCaller } from '../../appRouter';

const isGetRequest = (req: NextApiRequest) => req.method === 'GET';

const metadata = (res: NextApiResponse, label: string) => {
  res.status(200).json({
    label,
    icon: 'https://storage.googleapis.com/bedrock-platform-assets-production-mainnet/brand/bedrock-logo.png',
  });

  return null;
};

export async function fundFaucet(req: NextApiRequest, res: NextApiResponse) {
  if (isGetRequest(req)) {
    return metadata(res, 'Fund Faucet');
  }

  const { transaction, message } = await appCaller.faucet.fund({
    account: req.body.account as string,
    redemptions: req.query.redemptions as string,
  });

  res.status(200).json({
    transaction: transaction.toString('base64'),
    message,
  });
}

export async function redeemFaucet(req: NextApiRequest, res: NextApiResponse) {
  if (isGetRequest(req)) {
    return metadata(res, 'Redeem Faucet');
  }

  const { transaction, message } = await appCaller.faucet.redeem({
    account: req.body.account as string,
  });

  res.status(200).json({
    transaction: transaction.toString('base64'),
    message,
  });
}

export async function withdrawFaucet(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (isGetRequest(req)) {
    return metadata(res, 'Withdraw Faucet');
  }

  const { transaction, message } = await appCaller.faucet.withdraw({
    account: req.body.account as string,
  });

  res.status(200).json({
    transaction: transaction.toString('base64'),
    message,
  });
}
