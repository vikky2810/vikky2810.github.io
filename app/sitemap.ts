import type { MetadataRoute } from 'next';
import { getPosts } from '@/lib/posts';
import { SITE_URL } from '@/lib/seo';

export const dynamic = 'force-static';

// lastModified is the date of the last SIGNIFICANT change to the page's content.
// Technical edits (favicon tags, preloads, og:image) deliberately do not bump it:
// Google discounts lastmod on sites where it can't be trusted.
// changefreq and priority are omitted - Google ignores both.
const HOME_UPDATED = '2026-09-08'; // About section expanded and projects/blogs pre-rendered
const BLOG_INDEX_UPDATED = '2026-09-12'; // gained the linked footnote into the projects

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, lastModified: HOME_UPDATED },
    { url: `${SITE_URL}/blog/`, lastModified: BLOG_INDEX_UPDATED },
    ...getPosts().map(post => ({ url: `${SITE_URL}/blog/${post.slug}/`, lastModified: post.modifiedDate })),
  ];
}
