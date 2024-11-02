/** @type {import('next').NextConfig} */
const nextConfig = {
  // 开启 React 严格模式
  reactStrictMode: true,

  // 配置 API 路由重写
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination: process.env.API_URL || "http://127.0.0.1:8000/api/:path*",
      },
    ];
  },

  // 配置图像优化，指定允许的图像域名
  images: {
    domains: ["example.com", "your-cdn.com"],
  },

  // 国际化配置
  i18n: {
    locales: ["en", "es", "fr"], // 支持的语言
    defaultLocale: "en",         // 默认语言
  },

  // 设置构建输出目录（可选）
  distDir: ".next",

  // 启用 Webpack 5 并自定义配置
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      config.resolve = config.resolve || {};
      (config.resolve.fallback as Record<string, any>).fs = false;
    }
    return config;
  },

  // 环境变量配置
  env: {
    CUSTOM_VAR: process.env.CUSTOM_VAR || "default_value",
  },
};

module.exports = nextConfig;
