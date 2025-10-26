// next.config.js
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  turbopack: {}, // ✅ Turbopack対応（Next.js 16向け）
  // 他の設定があればここに追加
};

module.exports = withPWA(nextConfig);
