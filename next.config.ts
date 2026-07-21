import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "kaiateycrea.com" }],
        destination: "https://lapared.xyz/kaiateycrea",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.kaiateycrea.com" }],
        destination: "https://lapared.xyz/kaiateycrea",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
