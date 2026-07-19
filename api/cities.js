const { getData } = require('./_lib');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 's-maxage=86400');
  const data = getData();
  const cities = {};
  data.forEach(i => { if (i.cidade) cities[i.cidade] = (cities[i.cidade] || 0) + 1; });
  res.json(Object.entries(cities).sort((a, b) => b[1] - a[1]));
};
