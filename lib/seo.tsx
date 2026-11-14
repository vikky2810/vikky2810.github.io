import type { Metadata } from 'next';

export const SITE_URL = 'https://vikky2810.github.io';
export const OG_IMAGE = `${SITE_URL}/src/assets/og-image.png`;
const FEED = { 'application/rss+xml': [{ url: '/feed.xml', title: "Vikram Kamble's Blog" }] };

export const ICONS: Metadata['icons'] = {
  icon: [
    { url: '/favicon.ico', sizes: '32x32' },
    { url: '/src/assets/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
  ],
  apple: [{ url: '/src/assets/apple-touch-icon.png', sizes: '180x180' }],
};

type PageSeo = {
  title: string;
  description: string;
  socialTitle: string;
  socialDescription: string;
  url: string;
  type: 'website' | 'article';
  image: { url: string; width: number; height: number; alt: string };
  publishedTime?: string;
  /** og:site_name and og:locale; the blog index never had them */
  siteTags?: boolean;
};

/** Head tags shared by the indexable pages: canonical, RSS link, Open Graph and Twitter cards. */
export function pageMetadata(seo: PageSeo): Metadata {
  return {
    title: seo.title,
    description: seo.description,
    authors: [{ name: 'Vikram Kamble' }],
    robots: { index: true, follow: true },
    alternates: { canonical: seo.url, types: FEED },
    icons: ICONS,
    openGraph: {
      type: seo.type,
      url: seo.url,
      title: seo.socialTitle,
      description: seo.socialDescription,
      images: [{ ...seo.image, type: 'image/png' }],
      ...(seo.siteTags === false ? {} : { siteName: 'Vikram Kamble Portfolio', locale: 'en_US' }),
      ...(seo.publishedTime ? { publishedTime: seo.publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.socialTitle,
      description: seo.socialDescription,
      images: [{ url: seo.image.url, alt: seo.image.alt }],
    },
    other: { 'twitter:url': seo.url },
  };
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
