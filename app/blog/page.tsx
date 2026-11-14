import type { Metadata } from 'next';
import { preload } from 'react-dom';
import { JsonLd, OG_IMAGE, SITE_URL, pageMetadata } from '@/lib/seo';
import { BlogList } from '@/components/blog-list';
import { getPosts } from '@/lib/posts';
import '@/styles/blog-index.css';

const TITLE = 'Node.js, C++ & Gemini API Dev Blog - Vikram Kamble';
const DESCRIPTION =
  'Hands-on posts with real numbers and code: Node.js vs C++ benchmarks, chunked uploads in Express, Gemini API error handling, SQL vs NoSQL.';

export const metadata: Metadata = {
  ...pageMetadata({
    title: TITLE,
    description: DESCRIPTION,
    socialTitle: TITLE,
    socialDescription: DESCRIPTION,
    url: `${SITE_URL}/blog/`,
    type: 'website',
    image: { url: OG_IMAGE, width: 1200, height: 630, alt: 'Vikram Kamble - Full Stack Developer' },
    siteTags: false,
  }),
  keywords: 'Node.js, C++, Express, Gemini API, SQL vs NoSQL, React, Next.js, JavaScript, benchmarks',
  other: { title: TITLE, 'twitter:url': `${SITE_URL}/blog/` },
};

const BLOG = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: "Vikram Kamble's Blog",
  description: 'Blog posts about web development, programming, and technology',
  url: `${SITE_URL}/blog/`,
  author: { '@type': 'Person', name: 'Vikram Kamble', url: `${SITE_URL}/` },
};

export default function BlogIndexPage() {
  preload('/src/fonts/inter-latin.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' });
  return (
    <>
      <JsonLd data={BLOG} />
      {/* Navigation Header */}
      <header className="blog-header">
        <div className="header-container">
          <a href="/" className="back-btn">
            <span className="back-icon">←</span>
            {' '}
            <span className="back-text">Back to Portfolio</span>
          </a>
        </div>
      </header>
      {/* Blog Cards Section */}
      <main>
        <section id="blog-cards">
          <h1 className="blog-page-title">Blog</h1>
          <p className="blog-page-intro">
            Notes from things I've built: what I measured, what broke, and what I'd do differently.
          </p>
          <BlogList posts={getPosts()} titleTag="h2" byYear />
          <p className="blog-index-footnote">
            {"These posts come out of real projects. See "}
            <a href="/#ai-explains-repo">AI Explains Repo</a>
            {" and the "}
            <a href="/#online-python-code-editor">Online Python Code Editor</a>
            {" on the "}
            <a href="/#projects">projects page</a>
            {", or "}
            <a href="/#contact">get in touch</a>
            {". New posts land in the "}
            <a href="/feed.xml">RSS feed</a>
            .
          </p>
        </section>
      </main>
    </>
  );
}
