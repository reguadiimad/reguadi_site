import os from 'os';

const PORT = 3000;

function getLocalNetworkOrigins() {
  const interfaces = os.networkInterfaces();

  const origins = new Set([
    'localhost',
    `localhost:${PORT}`,
    '127.0.0.1',
    `127.0.0.1:${PORT}`,

    // Mac Bonjour / .local names
    'macbook-pro-2.local',
    `macbook-pro-2.local:${PORT}`,
    'MacBook-Pro-2.local',
    `MacBook-Pro-2.local:${PORT}`,

    // Allow local Bonjour style names
    '*.local',
    `*.local:${PORT}`,

    // 🚀 Allow all Ngrok tunnels globally
    '*.ngrok-free.app',
  ]);

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      const isIPv4 = iface.family === 'IPv4' || iface.family === 4;

      if (isIPv4 && !iface.internal) {
        origins.add(iface.address);
        origins.add(`${iface.address}:${PORT}`);
      }
    }
  }

  return [...origins];
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: getLocalNetworkOrigins(),

  async headers() {
    return [
      {
        source: '/abltys/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }

    return config;
  },
};

export default nextConfig;