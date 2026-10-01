import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // GitHub avatars are the one remote image source we know ahead of
    // time, so they go through next/image optimization. Project images are
    // user-supplied (local files in /public/images in most cases) and are
    // rendered as plain <img> tags since their origin isn't known upfront.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
