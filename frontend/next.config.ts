import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // No global rewrites: frontend app router handles /api/* and proxies to backend as needed
  // (This prevents accidental overriding of local /api routes.)
};

export default nextConfig;
