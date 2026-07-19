import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';

interface Property {
  id: string; cat: string; cidade: string; uf: string; bairro: string;
  preco: string; aval: string; desc: string; qtd: string; area: string;
  end: string; num: string; foto: string; mod: string; ref: string; link: string;
}

export default function Profiling() {
  const router = useRouter();
  const { slug } = router.query;
  const [items, setItems] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Property | null>(null);
  const [sortBy, setSortBy] = useState('');

  const slugArr = Array.isArray(slug) ? slug : [];
  const operation = slugArr[0] || '';
  const cityName = slugArr.slice(1).join('-') || '';

  const cityDisplay = cityName
    .replace(/-/g, ' ')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  useEffect(() => {
    if (!router.isReady) return;
    setLoading(true);
    const params = new URLSearchParams();
    if (cityName) params.set('cidade', cityName.replace(/-/g, ' ').toUpperCase());
    params.set('page', String(page));
    params.set('limit', '24');
    fetch('/api/search?' + params.toString())
      .then(r => r.json())
      .then(d => { setItems(d.items); setTotal(d.total); setLoading(false); });
  }, [router.isReady, cityName, page]);

  const sorted = [...items].sort((a, b) => {
    if (sortBy === 'preco-asc') return parsePrice(a.preco) - parsePrice(b.preco);
    if (sortBy === 'preco-desc') return parsePrice(b.preco) - parsePrice(a.preco);
    if (sortBy === 'desc') return (parseInt(b.desc) || 0) - (parseInt(a.desc) || 0);
    if (sortBy === 'area') return parseArea(b.area) - parseArea(a.area);
    return 0;
  });

  const totalPages = Math.ceil(total / 24);

  return (
    <>
      <Head>
        <title>Imóveis para {operation} em {cityDisplay} - Siena</title>
      </Head>

      <header style={{background:'linear-gradient(135deg,#1a237e,#0d47a1)',color:'white',padding:'16px 30px',display:'flex',alignItems:'center',gap:15}}>
        <a href="/quintoandar/index.html" style={{color:'white',textDecoration:'none',fontWeight:600,fontSize:20}}>← QuintoAndar</a>
        <span style={{fontSize:14,opacity:0.8}}>|</span>
        <span style={{fontSize:14}}>Imóveis Caixa Econômica Federal</span>
      </header>

      <div style={{background:'#fafafa',padding:'12px 30px',borderBottom:'1px solid #eee',fontSize:14,color:'#666'}}>
        <strong style={{color:'#1a237e'}}>{total.toLocaleString('pt-BR')}</strong> imóveis encontrados para{' '}
        <strong>{operation}</strong> em <strong>{cityDisplay}</strong>
      </div>

      <div style={{background:'white',padding:'12px 30px',display:'flex',gap:12,alignItems:'center',borderBottom:'1px solid #eee',flexWrap:'wrap'}}>
        <label style={{fontSize:13,color:'#666'}}>Ordenar por:</label>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{padding:'8px 12px',border:'1px solid #ddd',borderRadius:6,fontSize:13}}>
          <option value="">Relevância</option>
          <option value="preco-asc">Menor preço</option>
          <option value="preco-desc">Maior preço</option>
          <option value="desc">Maior desconto</option>
          <option value="area">Maior área</option>
        </select>
      </div>

      {loading ? (
        <div style={{textAlign:'center',padding:60,color:'#999'}}>Carregando imóveis...</div>
      ) : items.length === 0 ? (
        <div style={{textAlign:'center',padding:60,color:'#999'}}>Nenhum imóvel encontrado para essa busca.</div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:16,padding:'20px 30px'}}>
          {sorted.map((item, idx) => (
            <div key={idx} onClick={() => setModal(item)} style={{background:'white',borderRadius:12,overflow:'hidden',boxShadow:'0 1px 4px rgba(0,0,0,0.1)',cursor:'pointer',transition:'transform 0.2s,box-shadow 0.2s'}}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 1px 4px rgba(0,0,0,0.1)'; }}>
              {item.foto ? (
                <img src={item.foto} alt="" loading="lazy" style={{width:'100%',height:180,objectFit:'cover',background:'#e0e0e0'}} />
              ) : (
                <div style={{width:'100%',height:180,background:'#e0e0e0',display:'flex',alignItems:'center',justifyContent:'center',color:'#bbb'}}>Sem foto</div>
              )}
              <div style={{padding:14}}>
                <div style={{display:'flex',gap:6,marginBottom:8}}>
                  <span style={{display:'inline-block',background:'#e8eaf6',color:'#1a237e',padding:'2px 10px',borderRadius:12,fontSize:12,fontWeight:500}}>{item.cat}</span>
                  {item.mod && <span style={{display:'inline-block',background:'#fff3e0',color:'#e65100',padding:'2px 10px',borderRadius:12,fontSize:12,fontWeight:500}}>{item.mod}</span>}
                </div>
                <div style={{fontSize:14,fontWeight:600,color:'#333',marginBottom:4,lineHeight:1.3}}>{item.end?.replace('Endereço:', '').trim() || item.bairro || item.cidade}</div>
                <div style={{fontSize:13,color:'#666',marginBottom:10}}>{item.bairro} · {item.cidade}</div>
                <div style={{display:'flex',gap:12,fontSize:12,color:'#888',marginBottom:10}}>
                  {item.qtd && <span>🛏 {item.qtd} quartos</span>}
                  {item.area && <span>📐 {item.area} m²</span>}
                </div>
                <div>
                  <span style={{fontSize:20,fontWeight:700,color:'#1b5e20'}}>{item.preco || 'Consultar'}</span>
                  {item.desc && <span style={{display:'inline-block',background:'#e53935',color:'white',padding:'2px 8px',borderRadius:4,fontSize:11,fontWeight:600,marginLeft:6}}>-{item.desc}%</span>}
                </div>
                {item.aval && <div style={{fontSize:12,color:'#999',textDecoration:'line-through'}}>Avaliação: {item.aval}</div>}
                <div style={{fontSize:11,color:'#aaa',marginTop:6}}>REF: {item.id}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div style={{display:'flex',justifyContent:'center',gap:8,padding:'20px 30px'}}>
          <button disabled={page===1} onClick={()=>setPage(1)} style={{padding:'8px 16px',border:'1px solid #ddd',background:'white',borderRadius:6,cursor:'pointer',fontSize:13,opacity:page===1?0.4:1}}>«</button>
          <button disabled={page===1} onClick={()=>setPage(page-1)} style={{padding:'8px 16px',border:'1px solid #ddd',background:'white',borderRadius:6,cursor:'pointer',fontSize:13,opacity:page===1?0.4:1}}>‹</button>
          {Array.from({length:Math.min(7,totalPages)},(_,i)=>{
            const start=Math.max(1,page-3);
            const p=start+i;
            if(p>totalPages)return null;
            return <button key={p} onClick={()=>setPage(p)} style={{padding:'8px 16px',border:'1px solid #ddd',borderRadius:6,cursor:'pointer',fontSize:13,background:p===page?'#1a237e':'white',color:p===page?'white':'#333',borderColor:p===page?'#1a237e':'#ddd'}}>{p}</button>;
          })}
          <button disabled={page===totalPages} onClick={()=>setPage(page+1)} style={{padding:'8px 16px',border:'1px solid #ddd',background:'white',borderRadius:6,cursor:'pointer',fontSize:13,opacity:page===totalPages?0.4:1}}>›</button>
          <button disabled={page===totalPages} onClick={()=>setPage(totalPages)} style={{padding:'8px 16px',border:'1px solid #ddd',background:'white',borderRadius:6,cursor:'pointer',fontSize:13,opacity:page===totalPages?0.4:1}}>»</button>
        </div>
      )}

      {modal && (
        <div style={{display:'flex',position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'rgba(0,0,0,0.6)',zIndex:1000,justifyContent:'center',alignItems:'center'}} onClick={()=>setModal(null)}>
          <div style={{background:'white',borderRadius:12,maxWidth:600,width:'90%',maxHeight:'80vh',overflowY:'auto',padding:24,position:'relative'}} onClick={e=>e.stopPropagation()}>
            <button onClick={()=>setModal(null)} style={{position:'absolute',top:12,right:16,background:'none',border:'none',fontSize:24,cursor:'pointer',color:'#999'}}>&times;</button>
            {modal.foto && <img src={modal.foto} alt="" style={{width:'100%',borderRadius:8,margin:'10px 0'}} />}
            <h2 style={{fontSize:18,marginBottom:12,marginTop:8}}>{modal.cat} · {modal.bairro}</h2>
            <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #eee',fontSize:14}}><span style={{color:'#666'}}>Cidade</span><span>{modal.cidade}</span></div>
            <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #eee',fontSize:14}}><span style={{color:'#666'}}>Endereço</span><span>{modal.end?.replace('Endereço:','').trim() || '—'}</span></div>
            {modal.num && <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #eee',fontSize:14}}><span style={{color:'#666'}}>Número</span><span>{modal.num.replace('Número:','').trim()}</span></div>}
            <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #eee',fontSize:14}}><span style={{color:'#666'}}>Categoria</span><span>{modal.cat}</span></div>
            <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #eee',fontSize:14}}><span style={{color:'#666'}}>Modalidade</span><span>{modal.mod || '—'}</span></div>
            <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #eee',fontSize:14}}><span style={{color:'#666'}}>Valor Venda</span><span style={{color:'#1b5e20',fontSize:18,fontWeight:700}}>{modal.preco || 'Consultar'}</span></div>
            {modal.aval && <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #eee',fontSize:14}}><span style={{color:'#666'}}>Avaliação</span><span style={{textDecoration:'line-through',color:'#999'}}>{modal.aval}</span></div>}
            {modal.desc && <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #eee',fontSize:14}}><span style={{color:'#666'}}>Desconto</span><span style={{color:'#e53935',fontWeight:700}}>{modal.desc}%</span></div>}
            {modal.qtd && <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #eee',fontSize:14}}><span style={{color:'#666'}}>Quartos</span><span>{modal.qtd}</span></div>}
            {modal.area && <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #eee',fontSize:14}}><span style={{color:'#666'}}>Área</span><span>{modal.area} m²</span></div>}
            <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #eee',fontSize:14}}><span style={{color:'#666'}}>Referência</span><span>{modal.id}</span></div>
          </div>
        </div>
      )}
    </>
  );
}

function parsePrice(s: string): number {
  if (!s) return 0;
  return parseFloat(s.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
}

function parseArea(s: string): number {
  if (!s) return 0;
  return parseFloat(s.replace(',', '.')) || 0;
}
