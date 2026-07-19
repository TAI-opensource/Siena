/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: '/quintoandar/:path*',
        destination: '/quintoandar/:path*',
      },
    ];
  },
};
module.exports = nextConfig;
