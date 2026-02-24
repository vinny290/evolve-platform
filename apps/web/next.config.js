/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {},  // больше никаких appDir или turbopack экспериментов
  // turbopack автоматически используется в Next.js 16+
  // все кастомные webpack-настройки убраны
};

export default nextConfig;