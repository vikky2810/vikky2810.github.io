import { getPosts } from '@/lib/posts';
import { SITE_URL } from '@/lib/seo';

export const dynamic = 'force-static';

const xml = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const rfc822 = (iso: string) => new Date(`${iso}T00:00:00Z`).toUTCString().replace('GMT', '+0000');

export function GET() {
  const posts = getPosts();
  const items = posts.map(post => {
    const link = `${SITE_URL}/blog/${post.slug}/`;
    return `    <item>
      <title>${xml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${rfc822(post.publishedDate)}</pubDate>
      <category>${xml(post.category)}</category>
      <dc:creator>Vikram Kamble</dc:creator>
      <description>${xml(post.description)}</description>
    </item>`;
  });

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generated at build time by app/feed.xml/route.ts from content/blog/ (see BLOG_GUIDE.md):
     edit the content files instead. -->
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Vikram Kamble's Blog</title>
    <link>${SITE_URL}/blog/</link>
    <description>Posts about web development, backend engineering, and the decisions behind them - written from shipping real projects.</description>
    <language>en-us</language>
    <copyright>Vikram Kamble</copyright>
    <lastBuildDate>${rfc822(posts[0].publishedDate)}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${SITE_URL}/src/assets/og-image.png</url>
      <title>Vikram Kamble's Blog</title>
      <link>${SITE_URL}/blog/</link>
    </image>
${items.join('\n')}
  </channel>
</rss>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
