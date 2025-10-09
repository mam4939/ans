/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Новый способ для Next.js 14
  output: 'export',

  // ✅ Отключаем оптимизацию изображений (Cloudinary сам справится)
  images: {
    unoptimized: true,
  },

  // ✅ Включаем строгий режим React
  reactStrictMode: true,

  // ✅ Если будут API-роуты — пусть билдятся корректно
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

module.exports = nextConfig;
