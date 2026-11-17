import { networkInterfaces } from 'node:os';
import type { NextConfig } from 'next';

// Dev only: lets a phone on the same network load the dev server through this machine's LAN address.
const lanAddresses = Object.values(networkInterfaces())
  .flat()
  .flatMap(net => (net && net.family === 'IPv4' && !net.internal ? [net.address] : []));

const nextConfig: NextConfig = {
  // GitHub Pages serves plain files, so the whole site is prerendered to out/.
  output: 'export',
  // Keeps every URL as a directory with an index.html (/blog/sql-vs-nosql/), as before the migration.
  trailingSlash: true,
  // A standalone 404 page, so its font and styles are not preloaded by every other page.
  experimental: { globalNotFound: true },
  allowedDevOrigins: lanAddresses,
};

export default nextConfig;
