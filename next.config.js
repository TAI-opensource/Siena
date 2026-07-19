/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: '/profiling/:operation/:city',
        destination: '/quintoandar/alugar_imovel_:city.html',
      },
      {
        source: '/profiling/:operation/:city/:extra*',
        destination: '/quintoandar/alugar_imovel_:city.html',
      },
    ];
  },
};
module.exports = nextConfig;
