# Blog Management Guide

Every blog post is its own static HTML page in `src/blog/`. There is no JSON file and no JavaScript rendering: the full post (title, meta tags, content) is written directly in the HTML, so search engines see everything on the first load.

Current posts:

| Post | File | URL |
|------|------|-----|
| SQL vs NoSQL | `src/blog/sql-vs-nosql.html` | https://vikky2810.github.io/src/blog/sql-vs-nosql.html |
| Library vs Framework | `src/blog/library-vs-framework.html` | https://vikky2810.github.io/src/blog/library-vs-framework.html |

## ➕ Adding a New Blog Post

### 1. Create the page
1. Copy an existing post, e.g. `src/blog/sql-vs-nosql.html`.
2. Name the copy after the post using lowercase words and hyphens, e.g. `src/blog/react-hooks-explained.html`. The file name becomes the URL, so keep it short and descriptive.

### 2. Update the `<head>`
Replace these with the new post's details:
- `<title>`: the post title followed by ` - Vikram Kamble`. This is the heading Google shows in search results.
- `<meta name="description">`: a 1–2 sentence summary.
- `<link rel="canonical">`, `og:url`, `twitter:url`: the new page's full URL, e.g. `https://vikky2810.github.io/src/blog/react-hooks-explained.html`.
- `og:title`, `og:description`, `og:image`, `twitter:*`: the same title, summary and image.
- `article:published_time`: the publish date (`YYYY-MM-DD`).
- The `application/ld+json` block: `headline`, `description`, `image`, `datePublished`, `dateModified`, `articleSection` and `@id`.

### 3. Update the page body
- `.blog-category`, `<h1>`, the date (`<time datetime="YYYY-MM-DD">`), read time and category.
- The cover image: put it in `src/assets/` and set `src`, `alt`, `width` and `height`.
- Write the post inside `<div class="blog-content">`.

### 4. Link to it
1. `src/blog/index.html`: add a `.blog-row` card (copy an existing one) at the top of the list.
2. `index.html`: add the same card to the Blog section on the home page.
3. `sitemap.xml`: add a `<url>` entry with the new URL.
4. `llm.txt`: add the post under "Blog posts".

### 5. Link out of it (don't skip this)
A post with no outgoing links is a dead end: it passes no authority to the rest of the
site and gives Google nothing to connect it to. Every post needs all four:

1. **Breadcrumb** at the top of `<main>` (Home / Blog / this post) plus the matching
   `BreadcrumbList` block in the `<head>`. Copy both from an existing post and change
   the last crumb.
2. **Contextual links in the body.** Wherever the post names one of the projects, link
   it: `<a href="../../index.html#ai-explains-repo">AI Explains Repo</a>`. The anchor
   ids are the project title, lowercased and hyphenated — `src/script.js` generates the
   same slug when it re-renders the cards, so keep the two in sync.
3. **`.post-related` section** after `.blog-content`, with a card for the most closely
   related post and one for the projects page.
4. **`.post-author` box** at the end, linking home, projects, the blog index and contact.

Use real anchor text ("SQL vs NoSQL: how I actually decide"), never "click here" or a
bare URL, and only link where the connection is genuine.

### 6. After publishing
In Google Search Console, open **URL Inspection**, paste the new URL and click **Request Indexing**.

## 🎨 Available Styling

Styles live in `src/blog/post.css` and are shared by every post.

- `<h2>` for main sections, `<h3>` for subsections
- **Code blocks**: `<pre class="code-block"><code class="language-js">...</code></pre>` (also `language-jsx`, `language-sql`). Escape `<` as `&lt;` and `>` as `&gt;` inside code.
- **Diagrams / plain text blocks**: `<pre class="code-block"><code>...</code></pre>` with no language class
- **Tables**: wrap in `<div class="table-scroll">...</div>` so they scroll on mobile
- **Callout boxes**: `<div class="warning">`, `<div class="info">`, `<div class="success">`, each with a `<p>` inside
- **Quotes**: `<blockquote><p>...</p></blockquote>`

`src/blog/post.js` adds a "Copy" button to code blocks; the post content does not depend on it.

## 💡 Tips

- Keep the summary under ~160 characters so Google doesn't cut it off.
- Never rename a published post's file: its URL would change and Google would have to start over.
- Test locally with `python -m http.server 8000` and open `http://localhost:8000/src/blog/`.
