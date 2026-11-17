# Vikram Kamble's Portfolio

The source for https://vikky2810.github.io: a portfolio and blog built with Next.js
(App Router) and exported as a static site to GitHub Pages.

## Local development

Requires Node.js 22.

```bash
npm install
npm run dev        # http://localhost:3000, reloads as you edit
npm run build      # static export to out/
npm start          # serve out/ locally (close to GitHub Pages, not identical)
npm run typecheck
npm run check:html # validate the HTML in out/ (run after a build)
```

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`. It builds the site and
publishes `out/` to GitHub Pages, so the domain stays https://vikky2810.github.io.
The repository's Pages source must be set to **GitHub Actions** (Settings > Pages >
Build and deployment > Source).

`next.config.ts` sets `output: 'export'`, so there is no server: every page is
prerendered at build time. It also sets `trailingSlash: true`, which keeps every URL a
directory with its own `index.html` (`/blog/sql-vs-nosql/`), matching the URLs search
engines already know.

`wrangler.jsonc` deploys the same `out/` directory to Cloudflare. Its `build.command`
runs `npm run build` first.

`.github/workflows/checks.yml` builds the site and then checks links (lychee), HTML
validity (html-validate) and Lighthouse scores against `out/` on every pull request.

## Project structure

```
app/
  layout.tsx              Root layout: fonts, analytics
  page.tsx                Home page
  blog/page.tsx           Blog listing
  blog/[slug]/page.tsx    One page per post in content/blog/
  global-not-found.tsx    404 page (exported as out/404.html)
  feed.xml/route.ts       RSS feed, generated from the posts
  sitemap.ts              sitemap.xml, generated from the posts
components/               Client components: mobile menu, email copy control,
                          link previews, code copy buttons, scroll effects
lib/
  posts.ts                Loads and validates content/blog/<slug>/post.json + body.html
  code-blocks.ts          Build-time Prism highlighting and Copy-button markup
  seo.tsx                 Shared head metadata and JSON-LD helper
styles/                   Global CSS, imported by the page that uses it
content/blog/<slug>/      Blog post sources (see BLOG_GUIDE.md)
public/                   Served as-is: images, fonts, resume, robots.txt, llms.txt,
                          analytics.js and the old-URL bridge pages under src/
crosspost/                Post copies for dev.to and Medium (not deployed)
```

Asset URLs did not change in the migration. Files under `public/src/assets/` are
still served at `/src/assets/`.

Pages link to each other with plain `<a>` tags, not `next/link`. Each page imports
its own global stylesheet (`styles/style.css`, `styles/blog-index.css`,
`styles/post.css`), and a full page load keeps those stylesheets from stacking up
across pages.

## Old URL redirects (keep these files)
The blog used to live under `src/blog/`. It moved to `/blog/`, but GitHub Pages
cannot send real 301 redirects, so the old URLs are kept alive with small bridge
pages instead:

- `public/src/blog/index.html`, `public/src/blog/library-vs-framework.html` and
  `public/src/blog/sql-vs-nosql.html` each carry a `rel="canonical"` pointing at the new
  URL plus a `meta http-equiv="refresh"` that sends visitors there. The canonical
  moves the search ranking over, the refresh moves people. They are deliberately
  not `noindex`, since that would stop the canonical from doing its job.
- `public/src/blog/blog.html` handles the older `blog.html?id=N` links with a tiny
  script that maps the id to the right post.

They are plain HTML files, copied into the build as they are. They look like dead files but they are not. Deleting them breaks every old link
and bookmark that still points at `src/blog/`.

`public/src/Projects/index.html` is not a redirect - it is a placeholder page marked
`noindex`.

## Analytics
Plausible, configured in `public/src/analytics.js`. The root layout (`app/layout.tsx`)
loads it on every page, and the static bridge pages in `public/src/` load it with their
own `<script>` tag. It is cookieless, so the site needs
no consent banner, and it ignores localhost so local testing does not skew the
numbers.

Page views, resume downloads and outbound clicks are tracked automatically. Three
more goals are fired from `public/src/analytics.js`: `Contact Click` for `mailto:` links,
which Plausible does not count as outbound, and `Read 50%` / `Read 90%` for how far
visitors actually get through a blog post. Views alone cannot tell a read from a
bounce, so those two are what answer "which post is working" - filter either goal
by page to compare posts.

All five have to be added once under **Site Settings > Goals** in Plausible,
otherwise they are collected but never charted:

| Goal | Type |
|------|------|
| `File Download` | Special |
| `Outbound Link: Click` | Special |
| `Contact Click` | Custom event |
| `Read 50%` | Custom event |
| `Read 90%` | Custom event |

Swapping providers, or pasting in a newer Plausible snippet, is an edit to
`public/src/analytics.js` alone - no page markup changes.

## License

This project is open source and available under the [MIT License](LICENSE).
