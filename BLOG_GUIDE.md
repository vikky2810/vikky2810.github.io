# Blog Management Guide

Each blog post's page in `blog/` is generated, not hand-written. The source lives in
`content/blog/<slug>/` as a `post.json` (title, dates, image, category, related posts —
everything that varies) and a `body.html` (the article content). Running
`node scripts/build-blog.mjs` combines those with `content/blog/template.html` and writes
`blog/<slug>/index.html`, and also regenerates the post entries in `feed.xml` and
`sitemap.xml`. The generation happens once, ahead of time, not in the browser — search
engines still see the full post (title, meta tags, content) on first load, exactly as
before.

Current posts:

| Post | Source | URL |
|------|--------|-----|
| SQL vs NoSQL | `content/blog/sql-vs-nosql/` | https://vikky2810.github.io/blog/sql-vs-nosql/ |
| Library vs Framework | `content/blog/library-vs-framework/` | https://vikky2810.github.io/blog/library-vs-framework/ |
| Building With the Gemini API | `content/blog/building-with-gemini-api/` | https://vikky2810.github.io/blog/building-with-gemini-api/ |

## ➕ Adding a New Blog Post

### 1. Create the source files
1. Make a folder under `content/blog/<slug>/`, e.g. `content/blog/react-hooks-explained/`.
   Use lowercase words and hyphens — this becomes the URL, so keep it short and
   descriptive, and never rename it once published (the URL would change and Google
   would have to start over).
2. Add `body.html`: the article content exactly as it should render inside
   `.blog-content`, using the elements under "Available Styling" below. Write real
   contextual links wherever the post names a project or another post — see "Link out
   of it", which still applies.
3. Add `post.json`. Copy an existing one, e.g. `content/blog/sql-vs-nosql/post.json`,
   and fill in:
   - `title`, `description` (keep it under ~160 characters so Google doesn't cut it
     off), `category`, `breadcrumbLabel`
   - `publishedDate` / `modifiedDate` (`YYYY-MM-DD`) — only bump `modifiedDate` when the
     page's content genuinely changed, the same rule as before
   - `readTimeMinutes`, shown as "N min read" and, when `includeReadingSchema` is
     `true`, also written into the JSON-LD as `wordCount`/`timeRequired`. The build
     script estimates a read time from the body's word count (~200 wpm, rounded up)
     and logs a note when its estimate disagrees with this value — that's expected,
     not a bug; either keep the value you set or update it to match the note
   - `image`: `ogFile` and `pageFile` (filenames already in `src/assets/`, usually a
     `.png` for `og:image` and a `.webp` for the on-page cover), `width`/`height`,
     `ogAlt`, `pageAlt`
   - `authorBio` (copy the wording from the post it's closest to)
   - `related`: two cards — the most relevant other post, then a card pointing at
     `/#projects`

### 2. Build the page
```
node scripts/build-blog.mjs
```
This writes `blog/<slug>/index.html` from the template and regenerates the post
`<item>` entries in `feed.xml` and the post `<url>` entries in `sitemap.xml` (newest
post first by `publishedDate`; `lastmod` is each post's `modifiedDate`). It's safe to
re-run — with no source changes, running it again produces byte-identical output. It
does not touch `llms.txt`, `blog/index.html`, or `index.html`.

Asset `?v=<hash>` query strings (`style.css`, `post.css`, `analytics.js`, `post.js`)
are copied verbatim from `content/blog/template.html`; if one of those files changed,
re-run whatever stamps the new hash into the template, then rebuild.

### 3. What's still manual
1. `blog/index.html`: add a `.blog-row` card (copy an existing one) at the top of the
   list.
2. `index.html`: add the same card to the Blog section on the home page.
3. `llms.txt`: add the post under "Blog posts".

### 4. After publishing
In Google Search Console, open **URL Inspection**, paste the new URL and click **Request Indexing**.

### 5. Analytics
Nothing to do. The template carries the `<script defer src="/src/analytics.js">` tag
into every generated post, and read-depth tracking keys off the `.blog-content`
wrapper, so a new post is measured the moment it ships.

To see how the post lands, open Plausible and filter by its page: `Read 50%` and
`Read 90%` tell you whether people finished it, which the view count on its own
cannot.

## Link out of it (don't skip this)

A post with no outgoing links is a dead end: it passes no authority to the rest of the
site and gives Google nothing to connect it to. Every post needs all four:

1. **Breadcrumb**, generated from `breadcrumbLabel` in `post.json` — no HTML to write.
2. **Contextual links in the body**, still your responsibility in `body.html`. Wherever
   the post names one of the projects, link it:
   `<a href="../../#ai-explains-repo">AI Explains Repo</a>`. The anchor ids are the
   project title, lowercased and hyphenated — `src/script.js` generates the same slug
   when it re-renders the cards, so keep the two in sync.
3. **Related-posts cards**, generated from the `related` array in `post.json`.
4. **Author box**, generated from `authorBio` in `post.json`.

Use real anchor text ("SQL vs NoSQL: how I actually decide"), never "click here" or a
bare URL, and only link where the connection is genuine.

**Always link to the canonical URL.** A page's canonical is the one in its
`<link rel="canonical">` tag, and for the two index pages that URL ends in a slash, not
in `index.html`. From inside a post's `body.html`, write `../../` for the home page
(canonical `https://vikky2810.github.io/`), `../../#projects` for a home page section,
and `./` for the blog listing (canonical `https://vikky2810.github.io/blog/`). Linking
to `index.html` instead points at a duplicate of the canonical URL and splits its
signals.

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
- Never rename a published post's folder: its URL would change and Google would have to start over.
- Test locally with `python -m http.server 8000` and open `http://localhost:8000/blog/`.
- Don't hand-edit `blog/<slug>/index.html`, `feed.xml`'s `<item>`s, or `sitemap.xml`'s
  post `<url>`s directly — they're overwritten the next time `build-blog.mjs` runs.
  Edit the source in `content/blog/` instead.
