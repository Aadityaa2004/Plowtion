import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Suppress hydration warnings
  suppressHydrationWarning: true
};

export default nextConfig;
