import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { preload } from 'react-dom';
import { CodeCopy } from '@/components/code-copy';
import { SiteFooter } from '@/components/site-footer';
import { formatDisplayDate, getPost, getPosts, type Post } from '@/lib/posts';
import { JsonLd, SITE_URL, pageMetadata } from '@/lib/seo';
import '@/styles/style.css';
import 'prismjs/themes/prism-tomorrow.css';
import '@/styles/post.css';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map(({ slug }) => ({ slug }));
}

async function loadPost({ params }: Params): Promise<Post> {
  const post = getPost((await params).slug);
  if (!post) notFound();
  return post;
}

const canonicalUrl = (post: Post) => `${SITE_URL}/blog/${post.slug}/`;
const ogImageUrl = (post: Post) => `${SITE_URL}/src/assets/${post.image.ogFile}`;

export async function generateMetadata(props: Params): Promise<Metadata> {
  const post = await loadPost(props);
  return pageMetadata({
    // <title> is what searchers see in results, so it can be query-led (seoTitle)
    // while the H1 and og:title keep the post's own headline.
    title: post.seoTitle ?? `${post.title} - Vikram Kamble`,
    description: post.description,
    socialTitle: `${post.title} - Vikram Kamble`,
    socialDescription: post.description,
    url: canonicalUrl(post),
    type: 'article',
    image: { url: ogImageUrl(post), width: post.image.width, height: post.image.height, alt: post.image.ogAlt },
    publishedTime: post.publishedDate,
  });
}

function structuredData(post: Post) {
  const author = { '@type': 'Person', name: 'Vikram Kamble', url: `${SITE_URL}/` };
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      image: ogImageUrl(post),
      datePublished: post.publishedDate,
      dateModified: post.modifiedDate,
      articleSection: post.category,
      ...(post.includeReadingSchema ? { wordCount: post.wordCount, timeRequired: `PT${post.readTimeMinutes}M` } : {}),
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl(post) },
      author,
      publisher: author,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog/` },
        { '@type': 'ListItem', position: 3, name: post.breadcrumbLabel, item: canonicalUrl(post) },
      ],
    },
  ];
}

export default async function PostPage(props: Params) {
  const post = await loadPost(props);
  preload('/src/fonts/inter-latin.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' });
  return (
    <>
      {structuredData(post).map(data => <JsonLd key={data['@type']} data={data} />)}
      <main className="blog-post">
        <nav className="post-breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a> <span className="crumb-sep">/</span> <a href="/blog/">Blog</a>{' '}
          <span className="crumb-sep">/</span>{' '}
          <span className="crumb-current" aria-current="page">{post.breadcrumbLabel}</span>
        </nav>
        <header className="blog-header">
          <div className="blog-category">{post.category}</div>
          <h1>{post.title}</h1>
          <div className="blog-meta">
            <span><time dateTime={post.publishedDate}>{formatDisplayDate(post.publishedDate)}</time></span>{' '}
            <span className="meta-sep">·</span> <span>{`${post.readTimeMinutes} min read`}</span>
          </div>
          {!post.noCoverImage && (
            <img
              src={`/src/assets/${post.image.pageFile}`}
              alt={post.image.pageAlt}
              className="blog-image"
              width={post.image.width}
              height={post.image.height}
            />
          )}
        </header>
        <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />
        <section className="post-related">
          <h2>Keep reading</h2>
          <div className="related-grid">
            {post.related.map(card => (
              <a key={card.href} className="related-card" href={card.href}>
                <span className="related-card-label">{card.label}</span>
                <h3 className="related-card-title">{card.title}</h3>
                <p className="related-card-desc">{card.desc}</p>
              </a>
            ))}
          </div>
        </section>
        <aside className="post-author">
          <img src="/src/assets/profile-pic.webp" alt="Vikram Kamble" width={56} height={56} loading="lazy" />
          <div className="post-author-body">
            <h2 className="post-author-name">Vikram Kamble</h2>
            <p className="post-author-bio">{post.authorBio}</p>
            <div className="post-author-links">
              <a href="/">Portfolio home</a> <a href="/#projects">Projects</a> <a href="/blog/">All blog posts</a>{' '}
              <a href="/#contact">Get in touch</a>
            </div>
          </div>
        </aside>
      </main>
      <SiteFooter />
      <CodeCopy />
    </>
  );
}
