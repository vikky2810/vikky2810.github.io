#!/usr/bin/env node
// Generates blog/<slug>/index.html from content/blog/<slug>/{post.json,body.html}
// plus content/blog/template.html, and regenerates the post entries in
// feed.xml and sitemap.xml. Zero dependencies — node:fs, node:path, node:url only.
//
// Usage: node scripts/build-blog.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content', 'blog');
const BLOG_DIR = path.join(ROOT, 'blog');
const SITE_URL = 'https://vikky2810.github.io';
const WORDS_PER_MINUTE = 200;

const TEMPLATE = fs.readFileSync(path.join(CONTENT_DIR, 'template.html'), 'utf8');

function loadPosts() {
  const slugs = fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  const posts = slugs.map((slug) => {
    const dir = path.join(CONTENT_DIR, slug);
    const post = JSON.parse(fs.readFileSync(path.join(dir, 'post.json'), 'utf8'));
    const body = fs.readFileSync(path.join(dir, 'body.html'), 'utf8');
    return { ...post, slug, body };
  });

  // Newest first, by publish date.
  posts.sort((a, b) => (a.publishedDate < b.publishedDate ? 1 : a.publishedDate > b.publishedDate ? -1 : 0));
  return posts;
}

function wordCount(bodyHtml) {
  const text = bodyHtml.replace(/<[^>]+>/g, ' ').replace(/&[a-zA-Z]+;/g, ' ');
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function formatDateDisplay(iso) {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

function rfc822(iso) {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toUTCString().replace('GMT', '+0000');
}

function buildRelatedCards(related) {
  return related
    .map(
      (r) => `                <a class="related-card" href="${r.href}">
                    <span class="related-card-label">${r.label}</span>
                    <h3 class="related-card-title">${r.title}</h3>
                    <p class="related-card-desc">${r.desc}</p>
                </a>`
    )
    .join('\n');
}

function buildSchemaExtra(post, words) {
  if (!post.includeReadingSchema) return '';
  return `        "wordCount": ${words},\n        "timeRequired": "PT${post.readTimeMinutes}M",\n`;
}

function renderPost(post) {
  const words = wordCount(post.body);
  const estimatedMinutes = Math.ceil(words / WORDS_PER_MINUTE);
  if (estimatedMinutes !== post.readTimeMinutes) {
    console.log(
      `[read-time] ${post.slug}: ${words} words / ${WORDS_PER_MINUTE} wpm rounds up to ${estimatedMinutes} min; ` +
        `stored override is ${post.readTimeMinutes} min. Keeping the override.`
    );
  }

  const canonicalUrl = `${SITE_URL}/blog/${post.slug}/`;
  const ogImageUrl = `${SITE_URL}/src/assets/${post.image.ogFile}`;
  const pageImageSrc = `/src/assets/${post.image.pageFile}`;

  const replacements = {
    '{{TITLE}}': post.title,
    '{{DESCRIPTION}}': post.description,
    '{{CANONICAL_URL}}': canonicalUrl,
    '{{OG_IMAGE_URL}}': ogImageUrl,
    '{{IMAGE_WIDTH}}': String(post.image.width),
    '{{IMAGE_HEIGHT}}': String(post.image.height),
    '{{OG_IMAGE_ALT}}': post.image.ogAlt,
    '{{PUBLISHED_DATE}}': post.publishedDate,
    '{{PUBLISHED_DATE_DISPLAY}}': formatDateDisplay(post.publishedDate),
    '{{MODIFIED_DATE}}': post.modifiedDate,
    '{{CATEGORY}}': post.category,
    '{{SCHEMA_EXTRA}}': buildSchemaExtra(post, words),
    '{{BREADCRUMB_LABEL}}': post.breadcrumbLabel,
    '{{READ_TIME}}': `${post.readTimeMinutes} min read`,
    '{{PAGE_IMAGE_SRC}}': pageImageSrc,
    '{{PAGE_IMAGE_ALT}}': post.image.pageAlt,
    '{{BODY}}': post.body,
    '{{RELATED_CARDS}}': buildRelatedCards(post.related),
    '{{AUTHOR_BIO}}': post.authorBio,
  };

  let html = TEMPLATE;
  for (const [key, value] of Object.entries(replacements)) {
    html = html.split(key).join(value);
  }
  return html;
}

function writePost(post) {
  const html = renderPost(post);
  const outDir = path.join(BLOG_DIR, post.slug);
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, 'index.html');
  fs.writeFileSync(outFile, html, 'utf8');
  console.log(`Wrote ${path.relative(ROOT, outFile)}`);
}

function buildFeed(posts) {
  const feedPath = path.join(ROOT, 'feed.xml');
  const xml = fs.readFileSync(feedPath, 'utf8');

  const firstIdx = xml.indexOf('    <item>');
  const lastItemEnd = xml.lastIndexOf('</item>');
  if (firstIdx === -1 || lastItemEnd === -1) {
    throw new Error('feed.xml: could not locate an <item> block to replace');
  }
  const afterLastItem = lastItemEnd + '</item>'.length;

  const items = posts
    .map((post) => {
      const link = `${SITE_URL}/blog/${post.slug}/`;
      return `    <item>
      <title>${post.title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${rfc822(post.publishedDate)}</pubDate>
      <category>${post.category}</category>
      <dc:creator>Vikram Kamble</dc:creator>
      <description>${post.description}</description>
    </item>`;
    })
    .join('\n');

  let newXml = xml.slice(0, firstIdx) + items + xml.slice(afterLastItem);

  const newest = posts[0];
  newXml = newXml.replace(
    /<lastBuildDate>.*<\/lastBuildDate>/,
    `<lastBuildDate>${rfc822(newest.publishedDate)}</lastBuildDate>`
  );

  fs.writeFileSync(feedPath, newXml, 'utf8');
  console.log('Wrote feed.xml');
}

function buildSitemap(posts) {
  const sitemapPath = path.join(ROOT, 'sitemap.xml');
  const xml = fs.readFileSync(sitemapPath, 'utf8');

  const marker = '<!-- Posts:';
  const markerIdx = xml.indexOf(marker);
  if (markerIdx === -1) {
    throw new Error('sitemap.xml: could not locate the "<!-- Posts:" marker comment');
  }
  const afterComment = xml.indexOf('-->', markerIdx) + '-->'.length;

  const closingIdx = xml.indexOf('</urlset>');
  if (closingIdx === -1) {
    throw new Error('sitemap.xml: could not locate </urlset>');
  }

  const urls = posts
    .map(
      (post) => `  <url>
    <loc>${SITE_URL}/blog/${post.slug}/</loc>
    <lastmod>${post.modifiedDate}</lastmod>
  </url>`
    )
    .join('\n');

  const newXml = `${xml.slice(0, afterComment)}\n${urls}\n\n${xml.slice(closingIdx)}`;
  fs.writeFileSync(sitemapPath, newXml, 'utf8');
  console.log('Wrote sitemap.xml');
}

function main() {
  const posts = loadPosts();
  for (const post of posts) writePost(post);
  buildFeed(posts);
  buildSitemap(posts);
}

main();
