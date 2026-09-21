# Getting more search impressions: the off-site checklist

Everything in the repo is done (query-led `<title>`s, sharper descriptions, sitemap).
What's left happens in other tools. Not deployed (`crosspost` is in `.assetsignore`).

## 1. Google Search Console (15 min, do once)

1. **Sitemaps**: submit `https://vikky2810.github.io/sitemap.xml`. Status should be
   "Success", 7 discovered URLs.
2. **Indexing > Pages**: confirm all 7 are indexed. For any under "Discovered/Crawled
   – currently not indexed", open it in URL Inspection and click **Request Indexing**.
3. **Re-request indexing for the 5 posts now**: their `<title>`s changed, so Google
   picks up the new ones faster:
   - https://vikky2810.github.io/blog/cpp-vs-node/
   - https://vikky2810.github.io/blog/building-with-gemini-api/
   - https://vikky2810.github.io/blog/local-large-file-upload-tracker/
   - https://vikky2810.github.io/blog/sql-vs-nosql/
   - https://vikky2810.github.io/blog/library-vs-framework/
4. **Performance**: tick Impressions + Average position, switch to the **Queries** tab,
   then **Pages**. Write down which queries already show up; those are the follow-up
   post topics that will grow fastest.

## 2. Dev.to cross-posts

Drafts in `crosspost/devto/`. Paste each into https://dev.to/new (Markdown editor).
`canonical_url` is set, so Google credits your site, not Dev.to. `published: false`
keeps each one a draft until you flip it. Post one every few days rather than all at
once. Hashnode and Medium also take a canonical URL (Medium: Import a story).

## 3. GitHub profile README (`vikky2810/vikky2810`)

```markdown
### ✍️ Latest from my blog
- [Node.js vs C++ benchmark: Crow vs uWebSockets (57k req/s)](https://vikky2810.github.io/blog/cpp-vs-node/)
- [Upload large files in chunks with Express and multer](https://vikky2810.github.io/blog/local-large-file-upload-tracker/)
- [Gemini API empty response and error handling](https://vikky2810.github.io/blog/building-with-gemini-api/)

🌐 Portfolio: https://vikky2810.github.io
```

## 4. Project repos + live demos → blog posts

Add a "Write-up" link to each repo README and to each Vercel demo's footer:

| Repo / demo | Link to |
|---|---|
| `ai-explains-repo` (+ ai-explains-repo.vercel.app) | https://vikky2810.github.io/blog/building-with-gemini-api/ |
| `Recipe-Modifier` (+ recipe-modifier-app.vercel.app) | https://vikky2810.github.io/blog/building-with-gemini-api/ |
| `OnlineCodeEditor` (+ viks-online-code-editor.vercel.app) | https://vikky2810.github.io/ |
| `larger_file_upload` | https://vikky2810.github.io/blog/local-large-file-upload-tracker/ |

README line: `📝 Write-up: [How this was built](<post URL>)`
Demo footer: `<a href="<post URL>">How this was built</a> · <a href="https://vikky2810.github.io">Vikram Kamble</a>`

Also set each repo's **Website** field (About ⚙️ on GitHub) to its post URL or
the portfolio.

## 5. LinkedIn

Put `https://vikky2810.github.io` in Contact info > Website and in Featured. Share
each new post with a 3–4 line hook (the numbers, the error) and the link in the post.

## 6. Next posts (1 every 1–2 weeks, long-tail)

Follow-ups on what you've already built, so each links back to an existing post:

- `uWebSockets.js vs Node http benchmark`: does the Node binding keep the 57k?
- `Node.js cluster mode benchmark with wrk`: does 12k scale per core?
- `Why is Crow slow? C++ Crow multithreaded benchmark`
- `Parallel chunk upload in JavaScript with progress` (the tracker's next step)
- `Resume file upload after server restart (Express + SQLite/Redis)`
- `Gemini API 429 rate limit: retry with exponential backoff in JavaScript`
- `Gemini API finishReason SAFETY / MAX_TOKENS explained`

Formula for each: exact query as the `seoTitle`, real numbers or the real error
message in the first paragraph, code, and a link to the related older post.
After publishing: URL Inspection > Request Indexing.
