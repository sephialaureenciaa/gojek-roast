/** @type {import('next').NextConfig} */
const nextConfig = {
  // https://github.com/wojtekmaj/react-pdf?tab=readme-ov-file#nextjs
  swcMinify: false,
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
