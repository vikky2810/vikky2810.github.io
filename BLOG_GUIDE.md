# Blog Management Guide

Every blog post is its own static HTML page in `blog/`. There is no JSON file and no JavaScript rendering: the full post (title, meta tags, content) is written directly in the HTML, so search engines see everything on the first load.

Current posts:

| Post | File | URL |
|------|------|-----|
| SQL vs NoSQL | `blog/sql-vs-nosql/` | https://vikky2810.github.io/blog/sql-vs-nosql/ |
| Library vs Framework | `blog/library-vs-framework/` | https://vikky2810.github.io/blog/library-vs-framework/ |

## ➕ Adding a New Blog Post

### 1. Create the page
1. Copy an existing post, e.g. `blog/sql-vs-nosql/`.
2. Name the copy after the post using lowercase words and hyphens, e.g. `blog/react-hooks-explained.html`. The file name becomes the URL, so keep it short and descriptive.

### 2. Update the `<head>`
Replace these with the new post's details:
- `<title>`: the post title followed by ` - Vikram Kamble`. This is the heading Google shows in search results.
- `<meta name="description">`: a 1–2 sentence summary.
- `<link rel="canonical">`, `og:url`, `twitter:url`: the new page's full URL, e.g. `https://vikky2810.github.io/blog/react-hooks-explained.html`.
- `og:title`, `og:description`, `og:image`, `twitter:*`: the same title, summary and image.
- `article:published_time`: the publish date (`YYYY-MM-DD`).
- The `application/ld+json` block: `headline`, `description`, `image`, `datePublished`, `dateModified`, `articleSection` and `@id`.

### 3. Update the page body
- `.blog-category`, `<h1>`, the date (`<time datetime="YYYY-MM-DD">`), read time and category.
- The cover image: put it in `src/assets/` and set `src`, `alt`, `width` and `height`.
- Write the post inside `<div class="blog-content">`.

### 4. Link to it
1. `blog/index.html`: add a `.blog-row` card (copy an existing one) at the top of the list.
2. `index.html`: add the same card to the Blog section on the home page.
3. `sitemap.xml`: add a `<url>` entry with the new URL and a `<lastmod>` of the
   publish date. Only bump an existing `<lastmod>` when the page's *content*
   really changed - not for a favicon, meta tag or styling edit. Google discounts
   `lastmod` entirely on sites where the dates turn out to be unreliable, and a
   post's `lastmod` should match its `dateModified` in the JSON-LD.
4. `llms.txt`: add the post under "Blog posts".
5. `feed.xml`: add an `<item>` at the top of the list and update `<lastBuildDate>`.
   The feed is hand-maintained, so a post that is missing here never reaches
   subscribers. `pubDate` is RFC-822 (`Sat, 20 Jun 2026 00:00:00 +0000`), not the
   ISO-8601 format the sitemap and JSON-LD use.

### 5. Link out of it (don't skip this)
A post with no outgoing links is a dead end: it passes no authority to the rest of the
site and gives Google nothing to connect it to. Every post needs all four:

1. **Breadcrumb** at the top of `<main>` (Home / Blog / this post) plus the matching
   `BreadcrumbList` block in the `<head>`. Copy both from an existing post and change
   the last crumb.
2. **Contextual links in the body.** Wherever the post names one of the projects, link
   it: `<a href="../../#ai-explains-repo">AI Explains Repo</a>`. The anchor
   ids are the project title, lowercased and hyphenated — `src/script.js` generates the
   same slug when it re-renders the cards, so keep the two in sync.
3. **`.post-related` section** after `.blog-content`, with a card for the most closely
   related post and one for the projects page.
4. **`.post-author` box** at the end, linking home, projects, the blog index and contact.

Use real anchor text ("SQL vs NoSQL: how I actually decide"), never "click here" or a
bare URL, and only link where the connection is genuine.

**Always link to the canonical URL.** A page's canonical is the one in its
`<link rel="canonical">` tag, and for the two index pages that URL ends in a slash, not
in `index.html`. From inside `blog/`, write `../../` for the home page (canonical
`https://vikky2810.github.io/`), `../../#projects` for a home page section, and `./` for
the blog listing (canonical `https://vikky2810.github.io/blog/`). Linking to
`index.html` instead points at a duplicate of the canonical URL and splits its signals.

### 6. After publishing
In Google Search Console, open **URL Inspection**, paste the new URL and click **Request Indexing**.

### 7. Analytics
Nothing to do. Copying an existing post carries the
`<script defer src="/src/analytics.js">` tag over with it, and read-depth tracking
keys off the `.blog-content` wrapper, so a new post is measured the moment it ships.
Just don't delete either one.

To see how the post lands, open Plausible and filter by its page: `Read 50%` and
`Read 90%` tell you whether people finished it, which the view count on its own
cannot.

## 🎨 Available Styling

Styles live in `blog/post.css` and are shared by every post.

- `<h2>` for main sections, `<h3>` for subsections
- **Code blocks**: `<pre class="code-block"><code class="language-js">...</code></pre>` (also `language-jsx`, `language-sql`). Escape `<` as `&lt;` and `>` as `&gt;` inside code.
- **Diagrams / plain text blocks**: `<pre class="code-block"><code>...</code></pre>` with no language class
- **Tables**: wrap in `<div class="table-scroll">...</div>` so they scroll on mobile
- **Callout boxes**: `<div class="warning">`, `<div class="info">`, `<div class="success">`, each with a `<p>` inside
- **Quotes**: `<blockquote><p>...</p></blockquote>`

`blog/post.js` adds a "Copy" button to code blocks; the post content does not depend on it.

## 💡 Tips

- Keep the summary under ~160 characters so Google doesn't cut it off.
- Never rename a published post's file: its URL would change and Google would have to start over.
- Test locally with `python -m http.server 8000` and open `http://localhost:8000/blog/`.
