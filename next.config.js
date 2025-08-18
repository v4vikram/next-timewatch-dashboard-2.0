/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    domains: [
      'http://localhost:3001',
      'storage.googleapis.com'
    ],
    remotePatterns: [
      {
        protocol: 'http', 
        hostname: '*',
      },
    ],
  },
};

export default nextConfig;

