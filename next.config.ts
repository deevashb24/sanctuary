import type { NextConfig } from "next";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.tailwindcss.com https://accounts.google.com blob:;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https: blob:;
  worker-src blob: 'self';
  connect-src 'self' https://*.supabase.co https://accounts.google.com https://oauth2.googleapis.com https://openidconnect.googleapis.com https://www.googleapis.com blob:;
  frame-src https://accounts.google.com;
  frame-ancestors 'none';
`;

const nextConfig: NextConfig = {
  transpilePackages: ['@react-three/fiber', '@react-three/drei', '@react-three/postprocessing', 'three'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'cryptologos.cc',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
