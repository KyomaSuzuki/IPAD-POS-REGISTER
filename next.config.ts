import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // 開発中は無効
});

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    reactCompiler: true,
  },
  // キャッシュ更新を強制的に認識
  output: 'standalone',
};

export default withPWA(nextConfig);
