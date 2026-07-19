import type { NextApiRequest, NextApiResponse } from 'next';
import { getData } from './lib';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'id required' });

  const data = getData();
  const prop = data.find((i: any) => i.ref === id || i.id === id);
  if (!prop) return res.status(404).json({ error: 'not found' });

  res.status(200).json(prop);
}
