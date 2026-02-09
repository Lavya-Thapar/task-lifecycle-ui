import type { NextConfig } from "next";

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*", 
        destination: "https://task-lifecycle.onrender.com/api/:path*", // The actual backend
      },
    ];
  },
};

export default nextConfig;
