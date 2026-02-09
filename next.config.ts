import type { NextConfig } from "next";


const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*", 
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/:path*`, // The actual backend
      },
    ];
  },
};

export default nextConfig;
