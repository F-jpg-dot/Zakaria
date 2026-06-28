/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three"],
  // Allow loading the dev server from LAN IPs (phone / other devices on the
  // same Wi-Fi). Without this, Next blocks cross-origin dev requests from any
  // non-localhost origin and the page renders blank. Add your machine's LAN IP
  // here (see `ipconfig` → IPv4 Address) if it differs.
  allowedDevOrigins: ["192.168.0.149"],
  // Pin the Turbopack workspace root to this project so it doesn't mis-infer
  // it from a parent directory.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
