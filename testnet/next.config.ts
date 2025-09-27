import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['static.usernames.app-backend.toolsforhumanity.com'],
  },
  allowedDevOrigins: ['*','https://bok-embowed-season.ngrok-free.dev'], // Add your dev origin here
  reactStrictMode: false,
};

export default nextConfig;
