import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // TypeScript: Ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,  // Ignores TypeScript errors during build
  },

  // ESLint: Ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,  // Ignores ESLint errors during build
  },

  // Webpack: Suppress specific warnings during build (client-side only)
  webpack(config, { isServer }) {
    if (!isServer) {
      config.ignoreWarnings = [
        {
          message: /something-to-ignore/,  // Replace with the warning message or pattern to ignore
        },
      ];
    }
    return config;
  },
};

export default nextConfig;
