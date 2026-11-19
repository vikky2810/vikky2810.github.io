# Blog Management Guide

Each blog post's page is generated, not hand-written. The source lives in
`content/blog/<slug>/` as a `post.json` (title, dates, image, category, related posts —
everything that varies) and a `body.html` (the article content). `npm run build` reads
every folder there (`lib/posts.ts`), renders each post with `app/blog/[slug]/page.tsx`
into `out/blog/<slug>/index.html`, and generates `feed.xml` (`app/feed.xml/route.ts`) and
`sitemap.xml` (`app/sitemap.ts`) from the same data. The generation happens once, at
build time, not in the browser — search engines still see the full post (title, meta
tags, content) on first load.

Current posts:

| Post | Source | URL |
|------|--------|-----|
| SQL vs NoSQL | `content/blog/sql-vs-nosql/` | https://vikky2810.github.io/blog/sql-vs-nosql/ |
| Library vs Framework | `content/blog/library-vs-framework/` | https://vikky2810.github.io/blog/library-vs-framework/ |
| Building With the Gemini API | `content/blog/building-with-gemini-api/` | https://vikky2810.github.io/blog/building-with-gemini-api/ |
| I Tried to Beat Node.js with C++ | `content/blog/cpp-vs-node/` | https://vikky2810.github.io/blog/cpp-vs-node/ |
| Local Large File Upload Tracker | `content/blog/local-large-file-upload-tracker/` | https://vikky2810.github.io/blog/local-large-file-upload-tracker/ |
| Don't Use Boolean Values in Your Database | `content/blog/dont-use-boolean-in-database/` | https://vikky2810.github.io/blog/dont-use-boolean-in-database/ |
| navigator.clipboard Is Undefined Over HTTP | `content/blog/navigator-clipboard-undefined-http/` | https://vikky2810.github.io/blog/navigator-clipboard-undefined-http/ |

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
   - `seoTitle` (optional but do it): the `<title>` searchers see in Google, written
     around what people actually type — the stack, the error message, the numbers.
     Keep it under ~60 characters. `title` stays the catchy headline for the H1,
     `og:title` and the feed. Without it the `<title>` falls back to
     `<title> - Vikram Kamble`. Example: title "I Tried to Beat Node.js with C++. It
     Didn't Go as Expected." → seoTitle "Node.js vs C++ Benchmark: Crow vs uWebSockets
     (57k req/s)"
   - `publishedDate` / `modifiedDate` (`YYYY-MM-DD`) — only bump `modifiedDate` when the
     page's content genuinely changed, the same rule as before
   - `readTimeMinutes`, shown as "N min read" and, when `includeReadingSchema` is
     `true`, also written into the JSON-LD as `wordCount`/`timeRequired`. The build
     estimates a read time from the body's word count (~200 wpm, rounded up)
     and logs a note when its estimate disagrees with this value — that's expected,
     not a bug; either keep the value you set or update it to match the note
   - `image`: `ogFile` and `pageFile` (filenames already in `src/assets/`, usually a
     `.png` for `og:image` and a `.webp` for the on-page cover), `width`/`height`,
     `ogAlt`, `pageAlt`. Set `"noCoverImage": true` to leave the cover out of the page.
     Images live in `public/src/assets/` and are served at `/src/assets/`
   - `authorBio` (copy the wording from the post it's closest to)
   - `related`: two cards — the most relevant other post, then a card pointing at
     `/#projects`

### 2. Preview and build
```
npm run dev      # http://localhost:3000/blog/<slug>/, reloads as you edit
npm run build    # writes the whole site to out/
```
Posts are sorted newest first by `publishedDate`; each post's sitemap `lastmod` is its
`modifiedDate`. Nothing generated is committed: `out/` is rebuilt by the deploy
workflow on every push to `main`. The build does not touch `public/llms.txt`, the blog
listing, or the home page.

### 3. What's still manual
1. `app/blog/page.tsx`: add a `.blog-row` card (copy an existing one) at the top of the
   list.
2. `app/page.tsx`: add the same card to the Blog section on the home page.
3. `public/llms.txt`: add the post under "Blog posts".

### 4. After publishing
In Google Search Console, open **URL Inspection**, paste the new URL and click **Request Indexing**.

### 5. Analytics
Nothing to do. The root layout (`app/layout.tsx`) loads `/src/analytics.js` on every
page, and read-depth tracking keys off the `.blog-content`
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
   project title, lowercased and hyphenated, set on each `.project-row` in
   `app/page.tsx`, so keep the two in sync.
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

Styles live in `styles/post.css` and are shared by every post.

- `<h2>` for main sections, `<h3>` for subsections
- **Code blocks**: `<pre class="code-block"><code class="language-js">...</code></pre>` (also `language-jsx`, `language-sql`). Highlighting happens at build time with Prism (`lib/code-blocks.ts`), which knows Prism's defaults plus `jsx` and `sql`; any other language, such as `language-cpp`, renders as plain text. Escape `<` as `&lt;` and `>` as `&gt;` inside code.
- **Diagrams / plain text blocks**: `<pre class="code-block"><code>...</code></pre>` with no language class
- **Tables**: wrap in `<div class="table-scroll">...</div>` so they scroll on mobile
- **Callout boxes**: `<div class="warning">`, `<div class="info">`, `<div class="success">`, each with a `<p>` inside
- **Quotes**: `<blockquote><p>...</p></blockquote>`

Every `<pre><code>` block gets a "Copy" button. `lib/code-blocks.ts` adds the button at build time and `components/code-copy.tsx` makes it copy; the post content does not depend on either.

## 💡 Tips

- Keep the summary under ~160 characters so Google doesn't cut it off.
- Never rename a published post's folder: its URL would change and Google would have to start over.
- Test locally with `npm run dev` and open `http://localhost:3000/blog/`.
- Post pages, `feed.xml` and `sitemap.xml` only exist in `out/` after a build. Edit the
  source in `content/blog/`, never the build output.
