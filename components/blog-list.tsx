import type { Post } from '@/lib/posts';
import '@/styles/blog-list.css';

// Short blurbs written for readers rather than search. A post without one falls back to its SEO description.
const BLURBS: Record<string, string> = {
  'dont-use-boolean-in-database': 'isPaid works until a payment is pending, refunded or half paid. Why one status column with a CHECK constraint beats a pile of boolean flags.',
  'local-large-file-upload-tracker': "Sending a 1-2 GB file in one request fails at 98% with no resume. Here's how I split it into 5MB chunks with Express, multer, and retry logic.",
  'cpp-vs-node': 'Crow gave me 5k req/sec. Node gave me 12k. Then uWebSockets gave me 57k. A benchmark story about C++, Node.js, and picking the right library.',
  'building-with-gemini-api': 'The quickstart gets you a working call in ten lines. Everything that actually broke happened somewhere else: what to send, reading real error bodies, and a response that came back empty.',
  'sql-vs-nosql': 'Most SQL vs NoSQL posts are a comparison chart copied from the docs. This one is a decision process, built from shipping real projects on both MySQL and MongoDB.',
  'library-vs-framework': 'A library waits for you to call it. A framework calls you. The difference, shown with React and Next.js code from my own projects.',
};

function formatDate(iso: string, withYear: boolean): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(withYear && { year: 'numeric' }),
    timeZone: 'UTC',
  });
}

type Props = {
  posts: Post[];
  /** h3 under the homepage's h2, h2 under the blog page's h1 */
  titleTag: 'h2' | 'h3';
  /** Split the list under year headings (the full /blog/ list) */
  byYear?: boolean;
  /** Adds a link to the full list below */
  more?: { href: string; total: number };
};

function Rows({ posts, titleTag: Title, withYear }: { posts: Post[]; titleTag: 'h2' | 'h3'; withYear: boolean }) {
  return (
    <ol className="blog-index">
      {posts.map((post) => (
        <li key={post.slug}>
          <a className="blog-entry" href={`/blog/${post.slug}/`} title={BLURBS[post.slug] ?? post.description}>
            <Title className="blog-entry-title">{post.title}</Title>
            <span className="blog-entry-meta">
              <span className="blog-entry-read">{post.readTimeMinutes} min</span>
              <time dateTime={post.publishedDate}>{formatDate(post.publishedDate, withYear)}</time>
            </span>
          </a>
        </li>
      ))}
    </ol>
  );
}

export function BlogList({ posts, titleTag, byYear = false, more }: Props) {
  const years = byYear ? [...new Set(posts.map((p) => p.publishedDate.slice(0, 4)))] : [];
  return (
    <div className="blog-list">
      {byYear ? (
        years.map((year) => (
          <section className="blog-year" key={year} aria-label={`Posts from ${year}`}>
            <span className="blog-year-label" aria-hidden="true">{year}</span>
            <Rows posts={posts.filter((p) => p.publishedDate.startsWith(year))} titleTag={titleTag} withYear={false} />
          </section>
        ))
      ) : (
        <Rows posts={posts} titleTag={titleTag} withYear />
      )}
      {more && (
        <a href={more.href} className="blog-index-all">
          Read all {more.total} posts →
        </a>
      )}
    </div>
  );
}
