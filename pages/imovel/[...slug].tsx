import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function PropertyDetail() {
  const router = useRouter();
  const { slug } = router.query;

  if (!slug || !Array.isArray(slug)) return null;

  const id = slug[0] || '';
  const rest = slug.slice(1).join('/');

  const title = rest
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c: string) => c.toUpperCase());

  return (
    <>
      <Head>
        <title>{title || 'Imóvel'} - Siena</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <header style={{
          background: '#fff',
          borderBottom: '1px solid #e0e0e0',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#00897b', fontWeight: 700, fontSize: '20px' }}>
            Siena
          </Link>
          <span style={{ color: '#666', fontSize: '14px' }}>Imóvel</span>
        </header>

        <main style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 16px' }}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{
                background: '#00897b',
                color: '#fff',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600
              }}>
                ID: {id}
              </span>
            </div>

            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#333', marginBottom: '8px', lineHeight: 1.3 }}>
              {title}
            </h1>

            <div style={{
              marginTop: '24px',
              padding: '24px',
              background: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }}>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>
                Este imóvel faz parte do catálogo do QuintoAndar. Para ver os detalhes completos, fotos e agendar uma visita, acesse o anúncio original.
              </p>
              <a
                href={`https://www.quintoandar.com.br/imovel/${rest}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  background: '#00897b',
                  color: '#fff',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '14px'
                }}
              >
                Ver no QuintoAndar
              </a>
            </div>

            <div style={{ marginTop: '24px' }}>
              <Link href="/profiling/alugar/sao-paulo-sp-brasil/" style={{
                display: 'inline-block',
                color: '#00897b',
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: '14px'
              }}>
                ← Voltar para listagem
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
