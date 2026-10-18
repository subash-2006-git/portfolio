import type { NextConfig } from "next";

// Allow next/image to load uploads from the Supabase storage bucket.
const supabase = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://127.0.0.1:56321");
const isLocal = ["127.0.0.1", "localhost"].includes(supabase.hostname);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: supabase.protocol.replace(":", "") as "http" | "https",
        hostname: supabase.hostname,
        port: supabase.port,
        pathname: "/storage/v1/object/public/**",
      },
    ],
    // Local Supabase runs on 127.0.0.1, which Next 16 blocks by default. Never enabled for a hosted project.
    dangerouslyAllowLocalIP: isLocal,
  },
  experimental: {
    // Admin uploads are capped at 10 MB; leave headroom for the rest of the form.
    serverActions: { bodySizeLimit: "11mb" },
    proxyClientMaxBodySize: "11mb",
  },
};

export default nextConfig;
