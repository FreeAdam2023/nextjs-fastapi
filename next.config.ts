/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.API_URL || "http://127.0.0.1:8000/api/:path*",
      },
    ];
  },
  // 其他配置项
};

module.exports = nextConfig;
