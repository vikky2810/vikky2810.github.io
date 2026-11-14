import type { Metadata } from 'next';
import { preload } from 'react-dom';
import { JsonLd, OG_IMAGE, SITE_URL, pageMetadata } from '@/lib/seo';
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
          <h1 style={{ textAlign: "center" }}>Blog — Vikram Kamble</h1>
          <p style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto 2rem" }}>
            Practical guides on web development: SQL vs NoSQL decisions from real MySQL and MongoDB projects, and library vs framework differences with React and Next.js examples.
          </p>
          <div className="blog-cards-container" id="blog-cards-container">
            <a className="blog-row" data-category="backend" href="/blog/dont-use-boolean-in-database/">
              <div className="blog-row-main">
                <h2 className="blog-row-title">Don't Use Boolean Values in Your Database</h2>
                <p className="blog-row-desc">
                  isPaid works until a payment is pending, refunded or half paid. Why one status column with a CHECK constraint beats a pile of boolean flags.
                </p>
                <span className="blog-row-date">Oct 19, 2026 · Backend · 2 min read</span>
              </div>
              <span className="blog-row-more">Read more</span>
            </a>
            {' '}
            <a className="blog-row" data-category="backend" href="/blog/local-large-file-upload-tracker/">
              <div className="blog-row-main">
                <h2 className="blog-row-title">Trying to Build a Local Large File Upload Tracker</h2>
                <p className="blog-row-desc">
                  Sending a 1-2 GB file in one request fails at 98% with no resume. Here's how I split it into 5MB chunks with Express, multer, and retry logic.
                </p>
                <span className="blog-row-date">Sep 18, 2026 · Backend · 5 min read</span>
              </div>
              <span className="blog-row-more">Read more</span>
            </a>
            {' '}
            <a className="blog-row" data-category="backend" href="/blog/cpp-vs-node/">
              <div className="blog-row-main">
                <h2 className="blog-row-title">I Tried to Beat Node.js with C++. It Didn't Go as Expected.</h2>
                <p className="blog-row-desc">
                  Crow gave me 5k req/sec. Node gave me 12k. Then uWebSockets gave me 57k. A benchmark story about C++, Node.js, and picking the right library.
                </p>
                <span className="blog-row-date">Sep 15, 2026 · Backend · 5 min read</span>
              </div>
              <span className="blog-row-more">Read more</span>
            </a>
            {' '}
            <a className="blog-row" data-category="ai" href="/blog/building-with-gemini-api/">
              <div className="blog-row-main">
                <h2 className="blog-row-title">Building With the Gemini API: The Part the Docs Don't Cover</h2>
                <p className="blog-row-desc">
                  The Gemini quickstart gets you a working call in ten lines. Everything that actually broke in my repo-analysis app happened somewhere else: choosing what to send, reading real error bodies, and handling a response that came back empty.
                </p>
                <span className="blog-row-date">Sep 12, 2026 · AI · 8 min read</span>
              </div>
              <span className="blog-row-more">Read more</span>
            </a>
            {' '}
            <a className="blog-row" data-category="backend" href="/blog/sql-vs-nosql/">
              <div className="blog-row-main">
                <h2 className="blog-row-title">SQL vs NoSQL: I've Shipped Both, Here's How I Actually Decide</h2>
                <p className="blog-row-desc">
                  Most SQL vs NoSQL posts are a comparison chart someone copied from the docs. This one is a decision process, built from shipping real projects on both MySQL and MongoDB, with code, trade-offs, and a flowchart you can actually follow.
                </p>
                <span className="blog-row-date">Jun 20, 2026 · Backend · 10 min read</span>
              </div>
              <span className="blog-row-more">Read more</span>
            </a>
            {' '}
            <a className="blog-row" data-category="web development" href="/blog/library-vs-framework/">
              <div className="blog-row-main">
                <h2 className="blog-row-title">
                  Library vs Framework: The Real Difference Every Developer Should Know
                </h2>
                <p className="blog-row-desc">
                  Understanding the difference between a library and a framework is crucial for developers. This guide breaks it down with beginner-friendly explanations, real-world analogies, and practical React and Next.js examples.
                </p>
                <span className="blog-row-date">Oct 18, 2025 · Web Development · 8 min read</span>
              </div>
              <span className="blog-row-more">Read more</span>
            </a>
          </div>
          <p className="blog-index-footnote">
            {"Both posts come out of real projects — see "}
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
