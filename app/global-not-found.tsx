import type { Metadata, Viewport } from 'next';
import { preload } from 'react-dom';
import { ICONS } from '@/lib/seo';
import '@/styles/fonts.css';
import '@/styles/not-found.css';

export const metadata: Metadata = {
  title: 'Page Not Found - Vikram Kamble',
  description: "That page doesn't exist. Links to the portfolio home page and the blog.",
  robots: { index: false, follow: true },
  icons: ICONS,
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#000000' };

// Rendered outside app/layout.tsx, so its font preload and styles never reach the other pages.
export default function GlobalNotFound() {
  preload('/src/fonts/inter-latin.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' });
  return (
    <html lang="en">
      <head>
        <script defer src="/src/analytics.js"></script>
      </head>
      <body>
        <main>
          <p className="code">404 ERROR</p>
          <h1>Page not found</h1>
          <p>The page you're looking for doesn't exist or has been moved.</p>
          <div className="actions">
            <a className="btn btn-primary" href="/">Back to home</a>
            {' '}
            <a className="btn" href="/blog/">Read the blog</a>
          </div>
        </main>
      </body>
    </html>
  );
}
