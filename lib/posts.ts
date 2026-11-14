import fs from 'node:fs';
import path from 'node:path';
import { parseFragment, type DefaultTreeAdapterMap } from 'parse5';
import { renderCodeBlocks } from './code-blocks';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');
const WORDS_PER_MINUTE = 200;

type IsoDate = `${number}-${number}-${number}`;

export type RelatedLink = { href: string; label: string; title: string; desc: string };

export type Post = {
  slug: string;
  title: string;
  seoTitle?: string;
  description: string;
  category: string;
  publishedDate: IsoDate;
  modifiedDate: IsoDate;
  breadcrumbLabel: string;
  readTimeMinutes: number;
  includeReadingSchema: boolean;
  noCoverImage: boolean;
  image: {
    ogFile: string;
    pageFile: string;
    width: number;
    height: number;
    ogAlt: string;
    pageAlt: string;
  };
  authorBio: string;
  related: RelatedLink[];
  /** Post body HTML with code blocks already highlighted and wrapped for the copy button. */
  bodyHtml: string;
  wordCount: number;
};

type ElementNode = DefaultTreeAdapterMap['element'];

/** post.json strings are HTML text (they used to be pasted into the page verbatim), so decode entities once here. */
function decodeEntities(value: string): string {
  if (!value.includes('&')) return value;
  const node = parseFragment(`<b>${value}</b>`).childNodes[0] as ElementNode;
  return node.childNodes.map(n => ('value' in n ? n.value : '')).join('');
}

function decodeStrings<T>(value: T): T {
  if (typeof value === 'string') return decodeEntities(value) as T;
  if (Array.isArray(value)) return value.map(decodeStrings) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, decodeStrings(v)])) as T;
  }
  return value;
}

function isIsoDate(value: unknown): value is IsoDate {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function parsePost(slug: string, raw: Record<string, unknown>, body: string): Post {
  const required = ['title', 'description', 'category', 'breadcrumbLabel', 'authorBio'] as const;
  for (const key of required) {
    if (typeof raw[key] !== 'string') throw new Error(`content/blog/${slug}/post.json: "${key}" must be a string`);
  }
  if (!isIsoDate(raw.publishedDate) || !isIsoDate(raw.modifiedDate)) {
    throw new Error(`content/blog/${slug}/post.json: publishedDate and modifiedDate must be YYYY-MM-DD`);
  }
  if (typeof raw.readTimeMinutes !== 'number') throw new Error(`content/blog/${slug}/post.json: readTimeMinutes must be a number`);
  if (!raw.image || typeof raw.image !== 'object') throw new Error(`content/blog/${slug}/post.json: image is required`);
  if (!Array.isArray(raw.related)) throw new Error(`content/blog/${slug}/post.json: related must be an array`);

  const text = body.replace(/<[^>]+>/g, ' ').replace(/&[a-zA-Z]+;/g, ' ');
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const estimated = Math.ceil(wordCount / WORDS_PER_MINUTE);
  if (estimated !== raw.readTimeMinutes) {
    console.log(`[read-time] ${slug}: ${wordCount} words / ${WORDS_PER_MINUTE} wpm rounds up to ${estimated} min; ` +
      `stored override is ${raw.readTimeMinutes} min. Keeping the override.`);
  }
  const post = decodeStrings({
    ...(raw as Omit<Post, 'slug' | 'bodyHtml' | 'wordCount' | 'noCoverImage' | 'includeReadingSchema'>),
    includeReadingSchema: raw.includeReadingSchema === true,
    noCoverImage: raw.noCoverImage === true,
  });
  return {
    ...post,
    slug,
    bodyHtml: renderCodeBlocks(body),
    wordCount,
  };
}

let cache: Post[] | undefined;

/** Every post, newest first. */
export function getPosts(): Post[] {
  cache ??= fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(({ name: slug }) => {
      const dir = path.join(CONTENT_DIR, slug);
      const raw = JSON.parse(fs.readFileSync(path.join(dir, 'post.json'), 'utf8'));
      return parsePost(slug, raw, fs.readFileSync(path.join(dir, 'body.html'), 'utf8'));
    })
    .sort((a, b) => b.publishedDate.localeCompare(a.publishedDate));
  return cache;
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find(post => post.slug === slug);
}

export function formatDisplayDate(iso: IsoDate): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
