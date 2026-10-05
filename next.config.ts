import type { NextConfig } from "next";

const storeApiUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  (process.env.NODE_ENV === "production"
    ? "https://storebackend-ivb3.onrender.com"
    : "");

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: storeApiUrl,
  },
};

export default nextConfig;
