const fs = require('fs');
const path = require('path');

let cached = null;

function getData() {
  if (cached) return cached;
  const file = path.join(__dirname, '..', 'data', 'caixa', 'imoveis_compact.json');
  cached = JSON.parse(fs.readFileSync(file, 'utf8'));
  return cached;
}

function getStats() {
  const file = path.join(__dirname, '..', 'data', 'caixa', 'compact_stats.json');
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

module.exports = { getData, getStats };
