import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [],
  images: {
    formats: ["image/avif", "image/webp"]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb"
    }
  }
};

export default nextConfig;
