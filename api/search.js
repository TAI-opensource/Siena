const { getData } = require('./_lib');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=86400');

  const data = getData();
  const q = (req.query.q || '').toUpperCase();
  const uf = (req.query.uf || '').toUpperCase();
  const cat = (req.query.cat || '').toUpperCase();
  const cidade = (req.query.cidade || '').toUpperCase();
  const page = parseInt(req.query.page || '1');
  const limit = Math.min(parseInt(req.query.limit || '24'), 100);

  let items = data;

  if (q) items = items.filter(i => (i.bairro + i.cidade + i.end + i.cat + i.num).toUpperCase().includes(q));
  if (uf) items = items.filter(i => i.uf === uf);
  if (cat) items = items.filter(i => i.cat.toUpperCase() === cat);
  if (cidade) items = items.filter(i => i.cidade.toUpperCase().includes(cidade));

  const total = items.length;
  const start = (page - 1) * limit;

  res.json({ total, page, limit, items: items.slice(start, start + limit) });
};
