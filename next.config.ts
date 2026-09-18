import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "s4.anilist.co" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "img1.ak.crunchyroll.com" },
      { protocol: "https", hostname: "**.crunchyroll.com" },
    ],
  },
};

export default nextConfig;
