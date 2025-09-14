import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xd82avdr5u.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
