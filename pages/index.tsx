import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

interface Property {
  id: string; cat: string; cidade: string; uf: string; bairro: string;
  preco: string; aval: string; desc: string; qtd: string; area: string;
  end: string; num: string; foto: string; mod: string; ref: string; link: string;
}

interface Stats {
  total: number;
  byCat: Record<string, number>;
  byUf: Record<string, number>;
  byCidade: Record<string, number>;
}

export default function Home() {
  const [items, setItems] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [cities, setCities] = useState<[string, number][]>([]);
  const [categories, setCategories] = useState<[string, number][]>([]);
  const [filters, setFilters] = useState({ q: '', uf: '', cat: '', cidade: '' });
  const [modal, setModal] = useState<Property | null>(null);

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setStats);
    fetch('/api/cities').then(r => r.json()).then(setCities);
    fetch('/api/categories').then(r => r.json()).then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (filters.uf) params.set('uf', filters.uf);
    if (filters.cat) params.set('cat', filters.cat);
    if (filters.cidade) params.set('cidade', filters.cidade);
    params.set('page', String(page));
    params.set('limit', '24');
    fetch('/api/search?' + params.toString())
      .then(r => r.json())
      .then(d => { setItems(d.items); setTotal(d.total); setLoading(false); });
  }, [filters, page]);

  const totalPages = Math.ceil(total / 24);

  const applyFilter = (key: string, value: string) => {
    setFilters(f => ({ ...f, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ q: '', uf: '', cat: '', cidade: '' });
    setPage(1);
  };

  const filteredCities = filters.uf
    ? cities.filter(([c]) => c.endsWith(filters.uf))
    : cities;

  return (
    <>
      <Head>
        <title>Siena - Imóveis Caixa Econômica Federal</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header className={styles.header}>
        <h1>Siena</h1>
        {stats && <span className={styles.badge}>{stats.total.toLocaleString('pt-BR')} imóveis</span>}
        <span className={styles.subtitle}>Imóveis Caixa Econômica Federal</span>
      </header>

      {stats && (
        <div className={styles.statsBar}>
          <span><strong>{stats.total.toLocaleString('pt-BR')}</strong> imóveis</span>
          <span><strong>{Object.keys(stats.byCidade).length}</strong> cidades</span>
          <span><strong>{Object.keys(stats.byCat).length}</strong> categorias</span>
        </div>
      )}

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Buscar por endereço, bairro, cidade..."
          value={filters.q}
          onChange={e => applyFilter('q', e.target.value)}
          onKeyDown={e => e.key === 'Enter' && setPage(1)}
        />
        <select value={filters.uf} onChange={e => applyFilter('uf', e.target.value)}>
          <option value="">Todos os estados</option>
          <option value="RJ">Rio de Janeiro (RJ)</option>
          <option value="SP">São Paulo (SP)</option>
          <option value="PR">Paraná (PR)</option>
          <option value="SC">Santa Catarina (SC)</option>
        </select>
        <select value={filters.cat} onChange={e => applyFilter('cat', e.target.value)}>
          <option value="">Todas as categorias</option>
          {categories.map(([cat, count]) => (
            <option key={cat} value={cat}>{cat} ({count.toLocaleString('pt-BR')})</option>
          ))}
        </select>
        <select value={filters.cidade} onChange={e => applyFilter('cidade', e.target.value)}>
          <option value="">Todas as cidades</option>
          {filteredCities.slice(0, 100).map(([city, count]) => (
            <option key={city} value={city}>{city} ({count.toLocaleString('pt-BR')})</option>
          ))}
        </select>
        <button className={styles.btn} onClick={() => setPage(1)}>Buscar</button>
        <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={clearFilters}>Limpar</button>
      </div>

      <div className={styles.resultsBar}>
        <strong>{total.toLocaleString('pt-BR')}</strong> imóveis encontrados
      </div>

      {loading ? (
        <div className={styles.loading}>Carregando...</div>
      ) : items.length === 0 ? (
        <div className={styles.noResults}>Nenhum imóvel encontrado.</div>
      ) : (
        <div className={styles.grid}>
          {items.map((item, idx) => (
            <div key={idx} className={styles.card} onClick={() => setModal(item)}>
              {item.foto ? (
                <img className={styles.cardImg} src={item.foto} alt="" loading="lazy" />
              ) : (
                <div className={`${styles.cardImg} ${styles.noImg}`}>Sem foto</div>
              )}
              <div className={styles.cardBody}>
                <span className={styles.cardCategoria}>{item.cat}</span>
                {item.mod && <span className={`${styles.cardCategoria} ${styles.cardMod}`}>{item.mod}</span>}
                <div className={styles.cardTitulo}>{item.end || item.bairro || item.cidade}</div>
                <div className={styles.cardLocal}>{item.bairro} · {item.cidade}</div>
                <div className={styles.cardDetails}>
                  {item.qtd && <span>🛏 {item.qtd} quartos</span>}
                  {item.area && <span>📐 {item.area} m²</span>}
                </div>
                <div>
                  <span className={styles.cardPreco}>{item.preco || 'Consultar'}</span>
                  {item.desc && <span className={styles.cardDesconto}>-{item.desc}%</span>}
                </div>
                {item.aval && <div className={styles.cardAval}>Avaliação: {item.aval}</div>}
                <div className={styles.cardRef}>REF: {item.id}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button disabled={page === 1} onClick={() => setPage(1)}>«</button>
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>‹</button>
          {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
            const start = Math.max(1, page - 3);
            const p = start + i;
            if (p > totalPages) return null;
            return (
              <button key={p} className={p === page ? styles.active : ''} onClick={() => setPage(p)}>{p}</button>
            );
          })}
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>›</button>
          <button disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</button>
        </div>
      )}

      {modal && (
        <div className={styles.modalOverlay} onClick={() => setModal(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.close} onClick={() => setModal(null)}>&times;</button>
            {modal.foto && <img src={modal.foto} alt="" className={styles.modalImg} />}
            <h2>{modal.cat} · {modal.bairro}</h2>
            <div className={styles.detailRow}><span className={styles.detailLabel}>Cidade</span><span>{modal.cidade}</span></div>
            <div className={styles.detailRow}><span className={styles.detailLabel}>Endereço</span><span>{modal.end || '—'}</span></div>
            {modal.num && <div className={styles.detailRow}><span className={styles.detailLabel}>Número</span><span>{modal.num}</span></div>}
            <div className={styles.detailRow}><span className={styles.detailLabel}>Categoria</span><span>{modal.cat}</span></div>
            <div className={styles.detailRow}><span className={styles.detailLabel}>Modalidade</span><span>{modal.mod || '—'}</span></div>
            <div className={styles.detailRow}><span className={styles.detailLabel}>Valor Venda</span><span className={styles.detailPreco}>{modal.preco || 'Consultar'}</span></div>
            {modal.aval && <div className={styles.detailRow}><span className={styles.detailLabel}>Avaliação</span><span className={styles.detailAval}>{modal.aval}</span></div>}
            {modal.desc && <div className={styles.detailRow}><span className={styles.detailLabel}>Desconto</span><span className={styles.detailDesc}>{modal.desc}%</span></div>}
            {modal.qtd && <div className={styles.detailRow}><span className={styles.detailLabel}>Quartos</span><span>{modal.qtd}</span></div>}
            {modal.area && <div className={styles.detailRow}><span className={styles.detailLabel}>Área</span><span>{modal.area} m²</span></div>}
            <div className={styles.detailRow}><span className={styles.detailLabel}>Referência</span><span>{modal.id}</span></div>
            {modal.link && (
              <div className={styles.detailLink}>
                <a href={modal.link} target="_blank" rel="noopener noreferrer">Ver no site da Caixa →</a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
