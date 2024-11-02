/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // 添加其他配置项
  async rewrites() {
    return [
{
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/api/:path*"
            : "/api/",
      },
    ];
  },
  // 其他配置项
};

module.exports = nextConfig;
