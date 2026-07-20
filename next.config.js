/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: '/imovel/:slug*',
        destination: 'https://www.quintoandar.com.br/imovel/:slug*',
      },
      {
        source: '/profiling/:operation/:city',
        destination: '/quintoandar/alugar_imovel_:city.html',
      },
      {
        source: '/profiling/:operation/:city/:extra*',
        destination: '/quintoandar/alugar_imovel_:city.html',
      },
      {
        source: '/img/:path*',
        destination: '/quintoandar/img/:path*',
      },
    ];
  },
};
module.exports = nextConfig;
