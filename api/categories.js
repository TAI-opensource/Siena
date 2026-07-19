const { getData } = require('./_lib');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 's-maxage=86400');
  const data = getData();
  const cats = {};
  data.forEach(i => { if (i.cat) cats[i.cat] = (cats[i.cat] || 0) + 1; });
  res.json(Object.entries(cats).sort((a, b) => b[1] - a[1]));
};
