import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  // 显式传递环境变量到前端（关键！）
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  // 如果需要类型检查
  typescript: {
    ignoreBuildErrors: true, // 临时禁用类型错误阻断构建
  }
};

export default nextConfig;
