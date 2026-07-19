import type { NextApiRequest, NextApiResponse } from 'next';
import { getStats } from './lib';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
  res.status(200).json(getStats());
}
