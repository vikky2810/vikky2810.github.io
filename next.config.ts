import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // GitHub Pages serves plain files, so the whole site is prerendered to out/.
  output: 'export',
  // Keeps every URL as a directory with an index.html (/blog/sql-vs-nosql/), as before the migration.
  trailingSlash: true,
  // A standalone 404 page, so its font and styles are not preloaded by every other page.
  experimental: { globalNotFound: true },
};

export default nextConfig;
