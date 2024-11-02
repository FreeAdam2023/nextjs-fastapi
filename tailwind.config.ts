import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)", // 自定义背景颜色
        foreground: "var(--foreground)", // 自定义前景颜色
      },
    },
  },
  plugins: [],
};

export default config;
