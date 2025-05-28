/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["api.malalshammobel.com"],
    // If you need to allow all subdomains:
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: '**.malalshammobel.com',
    //   },
    // ],
  },
  // ... other config options
};

module.exports = nextConfig;
