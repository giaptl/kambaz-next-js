import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) return [];
    return [
      { source: "/api/:path*", destination: `${backendUrl}/api/:path*` },
      { source: "/lab5/:path*", destination: `${backendUrl}/lab5/:path*` },
      { source: "/hello", destination: `${backendUrl}/hello` },
    ];
  },
};

export default nextConfig;
