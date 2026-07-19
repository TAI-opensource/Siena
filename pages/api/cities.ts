import type { NextApiRequest, NextApiResponse } from 'next';
import { getData } from './lib';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
  const data = getData();
  const cities: Record<string, number> = {};
  data.forEach((i: any) => { if (i.cidade) cities[i.cidade] = (cities[i.cidade] || 0) + 1; });
  res.status(200).json(Object.entries(cities).sort((a, b) => (b[1] as number) - (a[1] as number)));
}
