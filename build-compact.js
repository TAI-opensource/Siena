const fs = require('fs');
const path = require('path');

const RAW = path.join(__dirname, 'data', 'caixa', 'imoveis_caixa_raw.json');
const COMPACT = path.join(__dirname, 'data', 'caixa', 'imoveis_compact.json');

const raw = JSON.parse(fs.readFileSync(RAW, 'utf8'));

function strip(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, '').trim();
}

function extractQuartos(html) {
  if (!html) return '';
  const m = html.match(/>(\d+)</);
  return m ? m[1] : '';
}

function extractArea(html) {
  if (!html) return '';
  const m = html.match(/([\d,.]+)\s*M/i);
  return m ? m[1] : '';
}

const compact = raw.items.map(item => ({
  id: item.referencia_plain || '',
  cat: item.categoria || '',
  cidade: item.cidade || '',
  uf: item.estado || '',
  bairro: item.bairro || '',
  preco: item.valor_venda1 || '',
  aval: item.valor_avaliacao_txt || '',
  desc: item.desconto_pct || '',
  qtd: extractQuartos(item.quartos),
  area: item.area_m2 || '',
  end: strip(item.enderecoPermissao),
  num: strip(item.numeroPermissao).replace(/^[\s|]*/, ''),
  foto: item.foto || '',
  mod: item.estado_imovel_txt || '',
  ref: item.ref_caixa || '',
  link: item.link_detalhes || '',
}));

fs.writeFileSync(COMPACT, JSON.stringify(compact));
const stats = {
  total: compact.length,
  byCat: {},
  byUf: {},
  byCidade: {},
};
compact.forEach(i => {
  if (i.cat) stats.byCat[i.cat] = (stats.byCat[i.cat] || 0) + 1;
  if (i.uf) stats.byUf[i.uf] = (stats.byUf[i.uf] || 0) + 1;
  if (i.cidade) stats.byCidade[i.cidade] = (stats.byCidade[i.cidade] || 0) + 1;
});
fs.writeFileSync(path.join(__dirname, 'data', 'caixa', 'compact_stats.json'), JSON.stringify(stats));

const origSize = fs.statSync(RAW).size;
const compSize = fs.statSync(COMPACT).size;
console.log(`Original: ${(origSize/1024/1024).toFixed(1)}MB`);
console.log(`Compact:  ${(compSize/1024/1024).toFixed(1)}MB`);
console.log(`Reduction: ${((1 - compSize/origSize)*100).toFixed(0)}%`);
console.log(`Items: ${compact.length}`);
