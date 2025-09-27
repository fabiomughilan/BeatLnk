import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['static.usernames.app-backend.toolsforhumanity.com'],
  },
<<<<<<< HEAD
  allowedDevOrigins: ['*',' https://97b4ca846410.ngrok-free.app'], // Add your dev origin here
=======
  allowedDevOrigins: ['*','https://82f141aa390b.ngrok-free.app'], // Add your dev origin here
>>>>>>> parent of a7acd92 (changes)
  reactStrictMode: false,
};

export default nextConfig;
