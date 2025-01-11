/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com", "picsum.photos"], // Add your image domain here
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
