import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // Cuando tu frontend llame a /api/...
        source: '/api/:path*',
        // Next.js interceptará la llamada y la redirigirá al backend en Render sin que el navegador se entere
        destination: 'https://mangavault-48cb.onrender.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;