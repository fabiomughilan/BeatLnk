import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['static.usernames.app-backend.toolsforhumanity.com'],
  },
  allowedDevOrigins: ['*',' https://97b4ca846410.ngrok-free.app'], // Add your dev origin here
  reactStrictMode: false,
};

export default nextConfig;
