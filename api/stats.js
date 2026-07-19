const { getStats } = require('./_lib');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 's-maxage=86400');
  res.json(getStats());
};
