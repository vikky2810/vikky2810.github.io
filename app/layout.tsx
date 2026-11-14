import type { Viewport } from 'next';
import '@/styles/fonts.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* A plain deferred script, shared with the static bridge pages in public/src */}
        <script defer src="/src/analytics.js"></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
