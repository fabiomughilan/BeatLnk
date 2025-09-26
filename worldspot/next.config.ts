import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['static.usernames.app-backend.toolsforhumanity.com'],
  },
  allowedDevOrigins: ['*','https://7793acb68271.ngrok-free.app'], // Add your dev origin here
  reactStrictMode: false,
};

export default nextConfig;
