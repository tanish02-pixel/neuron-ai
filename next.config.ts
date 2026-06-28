import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  webpack: (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...(config.resolve.alias as Record<string, unknown>),
        canvas: false,
      };
    }
    return config;
  },
};

export default nextConfig;