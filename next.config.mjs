/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals = [...config.externals, "bcrypt"];
    return config;
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "stag.coastmachinery.com",
        hostname: "coastmachinery.com",
      },
    ],
  },
};

export default nextConfig;
