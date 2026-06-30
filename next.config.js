/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  experimental: {
    optimizePackageImports: ['@emotion/react', '@emotion/styled'],
  },
};

module.exports = nextConfig;
