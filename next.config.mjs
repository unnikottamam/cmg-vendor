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
        hostname: "coastmachinery.com",
      },
      {
        protocol: "https",
        hostname: "**.smushcdn.com",
      },
      {
        protocol: "https",
        hostname: "stag.coastmachinery.com",
      },
    ],
  },
};

export default nextConfig;
