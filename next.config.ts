import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        'crispy-journey-4p4r5vp97g7376p9-3000.app.github.dev',
        '*.app.github.dev'
      ]
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
