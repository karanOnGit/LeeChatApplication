const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Proxy API and upload traffic to the Go backend (LeeBackend). beforeFiles
  // makes these win over the mock routes in src/pages/api and keeps browser
  // requests same-origin, so the backend needs no CORS setup.
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/api/:path*', destination: `${BACKEND_URL}/api/:path*` },
        { source: '/uploads/:path*', destination: `${BACKEND_URL}/uploads/:path*` },
      ],
    };
  },
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
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
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
