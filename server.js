const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'caixa', 'imoveis_caixa_raw.json');
const STATS_FILE = path.join(__dirname, 'data', 'caixa', 'imoveis_caixa_stats.json');

let cachedData = null;

function loadData() {
  if (cachedData) return cachedData;
  const raw = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  cachedData = raw.items.map(item => ({
    id: item.referencia_plain || item.id,
    categoria: item.categoria || '',
    transacao: item.transacao || '',
    cidade: item.cidade || '',
    estado: item.estado || '',
    bairro: item.bairro || '',
    valor_venda: item.valor_venda1 || '',
    valor_avaliacao: item.valor_avaliacao_txt || '',
    desconto: item.desconto_pct || '',
    quartos: item.quartos_txt || '',
    area: item.area_m2 || '',
    endereco: (item.enderecoPermissao || '').replace(/<[^>]*>/g, '').trim(),
    numero: (item.numeroPermissao || '').replace(/<[^>]*>/g, '').replace(/[|<b>Numero: </b>]/g, '').trim(),
    foto: item.foto || '',
    modalidade: item.estado_imovel_txt || '',
    link_detalhes: item.link_detalhes || '',
    ref_caixa: item.ref_caixa || '',
    coordenadas: item.coordenadas || '',
  }));
  return cachedData;
}

function parseValue(val) {
  if (!val) return 0;
  const clean = val.replace(/[^\d,]/g, '').replace(',', '.');
  return parseFloat(clean) || 0;
}

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  if (pathname === '/api/search') {
    const data = loadData();
    const cidade = (url.searchParams.get('cidade') || '').toUpperCase();
    const bairro = (url.searchParams.get('bairro') || '').toUpperCase();
    const categoria = (url.searchParams.get('categoria') || '').toUpperCase();
    const estado = (url.searchParams.get('estado') || '').toUpperCase();
    const busca = (url.searchParams.get('q') || '').toUpperCase();
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '24');

    let filtered = data;

    if (cidade) filtered = filtered.filter(i => i.cidade.toUpperCase().includes(cidade));
    if (bairro) filtered = filtered.filter(i => i.bairro.toUpperCase().includes(bairro));
    if (categoria) filtered = filtered.filter(i => i.categoria.toUpperCase() === categoria);
    if (estado) filtered = filtered.filter(i => i.estado.toUpperCase() === estado);
    if (busca) {
      filtered = filtered.filter(i =>
        (i.cidade + i.bairro + i.endereco + i.categoria + i.numero).toUpperCase().includes(busca)
      );
    }

    const total = filtered.length;
    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);

    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ total, page, limit, items }));
    return;
  }

  if (pathname === '/api/stats') {
    const stats = JSON.parse(fs.readFileSync(STATS_FILE, 'utf8'));
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify(stats));
    return;
  }

  if (pathname === '/api/cities') {
    const data = loadData();
    const cities = {};
    data.forEach(i => {
      if (i.cidade) cities[i.cidade] = (cities[i.cidade] || 0) + 1;
    });
    const sorted = Object.entries(cities).sort((a, b) => b[1] - a[1]);
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify(sorted));
    return;
  }

  if (pathname === '/api/categories') {
    const data = loadData();
    const cats = {};
    data.forEach(i => {
      if (i.categoria) cats[i.categoria] = (cats[i.categoria] || 0) + 1;
    });
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify(Object.entries(cats).sort((a, b) => b[1] - a[1])));
    return;
  }

  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const ext = path.extname(filePath);
  const mime = MIME[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': mime });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`Siena server running at http://localhost:${PORT}`);
});
