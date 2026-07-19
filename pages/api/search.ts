import type { NextApiRequest, NextApiResponse } from 'next';
import { getData } from './lib';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
  const data = getData();
  const q = ((req.query.q as string) || '').toUpperCase();
  const uf = ((req.query.uf as string) || '').toUpperCase();
  const cat = ((req.query.cat as string) || '').toUpperCase();
  const cidade = ((req.query.cidade as string) || '').toUpperCase();
  const page = parseInt(req.query.page as string || '1');
  const limit = Math.min(parseInt(req.query.limit as string || '24'), 100);

  let items = data;

  if (q) items = items.filter((i: any) => (i.bairro + i.cidade + i.end + i.cat + i.num).toUpperCase().includes(q));
  if (uf) items = items.filter((i: any) => i.uf === uf);
  if (cat) items = items.filter((i: any) => i.cat.toUpperCase() === cat);
  if (cidade) items = items.filter((i: any) => i.cidade.toUpperCase().includes(cidade));

  const total = items.length;
  const start = (page - 1) * limit;

  res.status(200).json({ total, page, limit, items: items.slice(start, start + limit) });
}
