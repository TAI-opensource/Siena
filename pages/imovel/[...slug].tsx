import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function PropertyDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const ref = Array.isArray(slug) ? slug[0] : slug || '';

  useEffect(() => {
    if (!ref) return;
    fetch(`/api/property?id=${ref}`)
      .then(r => r.json())
      .then(data => { setProperty(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [ref]);

  if (loading) {
    return (
      <>
        <Head><title>Carregando... - Siena</title></Head>
        <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <p style={{ color: '#666', fontSize: '16px' }}>Carregando imóvel...</p>
        </div>
      </>
    );
  }

  if (!property || property.error) {
    return (
      <>
        <Head><title>Imóvel não encontrado - Siena</title></Head>
        <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <header style={{ background: '#fff', borderBottom: '1px solid #e0e0e0', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/" style={{ textDecoration: 'none', color: '#00897b', fontWeight: 700, fontSize: '20px' }}>Siena</Link>
          </header>
          <main style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 16px' }}>
            <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
              <h1 style={{ fontSize: '20px', color: '#333', marginBottom: '16px' }}>Imóvel não encontrado</h1>
              <Link href="/" style={{ color: '#00897b', textDecoration: 'none', fontWeight: 500 }}>← Voltar para o início</Link>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{property.cat} - {property.bairro}, {property.cidade} - Siena</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <header style={{ background: '#fff', borderBottom: '1px solid #e0e0e0', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#00897b', fontWeight: 700, fontSize: '20px' }}>Siena</Link>
          <span style={{ color: '#666', fontSize: '14px' }}>Imóvel Caixa</span>
        </header>

        <main style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 16px' }}>
          {property.foto && (
            <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '24px', background: '#e0e0e0' }}>
              <img
                src={property.foto}
                alt={`${property.cat} em ${property.bairro}`}
                style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '400px', objectFit: 'cover' }}
              />
            </div>
          )}

          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <span style={{ background: '#00897b', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                {property.cat}
              </span>
              <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                {property.mod}
              </span>
            </div>

            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#333', marginBottom: '8px', lineHeight: 1.3 }}>
              {property.cat} para venda em {property.bairro}
            </h1>

            <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>
              {property.end} {property.num}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
                <p style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Preço</p>
                <p style={{ fontSize: '20px', fontWeight: 700, color: '#00897b' }}>{property.preco}</p>
              </div>
              <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
                <p style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Avaliação</p>
                <p style={{ fontSize: '18px', fontWeight: 600, color: '#333' }}>{property.aval}</p>
              </div>
              <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
                <p style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Área</p>
                <p style={{ fontSize: '18px', fontWeight: 600, color: '#333' }}>{property.area} m²</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '24px' }}>
              <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
                <p style={{ fontSize: '12px', color: '#888' }}>Cidade</p>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>{property.cidade}</p>
              </div>
              <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
                <p style={{ fontSize: '12px', color: '#888' }}>Bairro</p>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>{property.bairro}</p>
              </div>
              {property.qtd && (
                <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
                  <p style={{ fontSize: '12px', color: '#888' }}>Quartos</p>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>{property.qtd}</p>
                </div>
              )}
              <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
                <p style={{ fontSize: '12px', color: '#888' }}>Descrição</p>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>{property.desc}</p>
              </div>
            </div>

            <div style={{ padding: '16px', background: '#e8f5e9', borderRadius: '8px', border: '1px solid #c8e6c9', marginBottom: '24px' }}>
              <p style={{ fontSize: '12px', color: '#2e7d32', marginBottom: '4px' }}>Referência Caixa</p>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#1b5e20' }}>{property.ref}</p>
            </div>

            <Link href="/" style={{ display: 'inline-block', color: '#00897b', textDecoration: 'none', fontWeight: 500, fontSize: '14px' }}>
              ← Voltar para listagem
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
