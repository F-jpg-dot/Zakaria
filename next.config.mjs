/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three"],
  // Pin the Turbopack workspace root to this project so it doesn't mis-infer
  // it from a parent directory.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
