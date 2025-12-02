/** @type {import('next').NextConfig} */
const nextConfig = {
 images: {
  domains: [
    "localhost",
    "storage.googleapis.com",
    "timewatch2-0-311005204045.europe-west1.run.app",
    "cdn.timewatchindia.com",
    "assets.timewatchindia.com"
  ],
  remotePatterns: [
    {
      protocol: "https",
      hostname: "cdn.timewatchindia.com",
      pathname: "/uploads/**",
    },
  ],
},

};

export default nextConfig;

