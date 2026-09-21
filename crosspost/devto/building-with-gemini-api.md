---
title: "Building With the Gemini API: The Part the Docs Don't Cover"
published: false
description: "Why the Gemini API returns an empty response with status 200 (finishReason SAFETY, MAX_TOKENS), how to read real 400/429 error bodies, and what to send it."
tags: gemini, ai, javascript, webdev
canonical_url: https://vikky2810.github.io/blog/building-with-gemini-api/
cover_image: https://vikky2810.github.io/src/assets/gemini-api.png
---

Google's quickstart gets you a working Gemini call in about ten lines, and mine is still basically those ten lines. That part was done in an afternoon. Everything that went wrong afterwards happened somewhere else entirely, and none of it was about the API.

I've shipped three projects on Gemini now: [AI Explains Repo](https://vikky2810.github.io/#ai-explains-repo), which reads a GitHub repository and writes a plain-English summary of it, and the [Health-Aware Recipe Modifier](https://vikky2810.github.io/#health-aware-recipe-modifier), which generates recipes around a medical condition. The code below is from the first one, because it's the one where I got the interesting decision wrong.

## The API Call Is the Boring Part

Here's the whole integration, more or less as it runs in production:

```js
const response = await fetch(
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  }
);
```

No SDK. I went back and forth on this and landed on a plain `fetch`, partly because the request body is four keys deep and partly because I didn't want another dependency whose major version bumps I'd have to care about. If you're doing one text-in, text-out call, the SDK buys you almost nothing. The moment you want streaming or function calling, that calculation changes, and you should reach for the client library instead of hand-rolling it.

That's the easy decision, though. The one that actually determines whether your feature works is upstream of this call.

## The Hard Part Is Choosing What to Send

A model has a context limit. A GitHub repository does not care about your context limit. Somewhere between those two facts is the only design decision in this entire feature that really matters, and I gave it about five minutes of thought.

This is what I wrote:

```js
static async getConcatenatedContents(owner, repo, maxLength = 5000) {
  const files = await this.getRepoContents(owner, repo);
  let concatenatedContents = "";

  for (const file of files) {
    if (file.type === "file" && file.download_url) {
      try {
        concatenatedContents += await this.getFileContent(file.download_url);
        if (concatenatedContents.length >= maxLength) break;
      } catch (error) {
        console.error(`Error fetching file ${file.name}:`, error);
        // keep going rather than failing the whole request
      }
    }
  }

  return concatenatedContents.slice(0, maxLength);
}
```

Read that loop carefully, because there are two bugs in it and neither one throws.

The first: it walks files in whatever order the GitHub contents API hands them back, glues them together, and stops at five thousand characters. Nothing ranks them. For a repo whose root happens to start with a `LICENSE` and a long `.eslintrc`, the model never reaches the README, and it will still write you a confident four-section summary. It just writes one about the linter configuration. The output looks fine. That's the worst kind of bug, because it doesn't announce itself: you only catch it by reading the summaries and noticing one of them describes a project that doesn't exist.

The second is quieter. `getRepoContents` hits `/repos/{owner}/{repo}/contents` with no path, which returns the root directory and nothing below it, and then `file.type === "file"` drops every directory on the floor. So for any project that keeps its code in `src/` or `app/`, and that's most of them, the actual source never reaches the model at all. It's summarising config files and a readme.

Truncation bugs don't look like bugs. They look like mediocre output, which is very easy to blame on the model.

The fix isn't a bigger limit. Sending more tokens costs more, takes longer, and on a large repo you'll blow the window no matter where you set the number. What you want is to decide what deserves the budget before you start spending it: README first, then the manifest (`package.json`, `requirements.txt`), then whatever the entry point is, then fill the remainder with source files by some sensible ordering. Truncate what's left over, not what happened to be last.

I spent my planning time on the prompt. The prompt was never the problem.

## statusText Throws Away the Only Useful Information

Here's the error handling I shipped:

```js
if (!response.ok) {
  throw new Error(`Gemini API error: ${response.statusText}`);
}
```

Looks reasonable. It's close to useless. Gemini puts the actual reason in a JSON body, and `statusText` is a generic HTTP string, so an expired key, an exhausted quota, a malformed request and a blocked prompt all arrive at my logs looking identical. I've sat there re-reading a request body that was completely fine, because the message told me nothing and I assumed the fault was mine.

Reading the body costs three lines:

```js
if (!response.ok) {
  const detail = await response.text();
  throw new Error(`Gemini ${response.status}: ${detail}`);
}
```

Now a 429 says you're rate limited, a 400 tells you which field it didn't like, and you stop guessing. If you take one thing from this post, take this one; it's a two-minute change and it's the difference between a debuggable integration and a mysterious one.

## An Empty Response Is Not the Same as an Error

The response parsing has the same shape of problem:

```js
const data = await response.json();
const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;

if (!result) {
  throw new Error("No explanation generated from AI service");
}
```

That optional chaining is doing a lot of work, and it collapses several genuinely different situations into one message. A 200 response with an empty `candidates` array usually means the safety filter caught something. A response that stopped early carries a `finishReason` explaining why, often `MAX_TOKENS` or `SAFETY`. Both land on "No explanation generated", which tells a user nothing and tells me less.

Worth knowing: a safety block comes back as a successful request. `response.ok` is true, the status is 200, and the useful detail sits in `promptFeedback.blockReason` or the candidate's `finishReason`. If you only check `response.ok`, you will never see it.

## The Word Limit in Your Prompt Is a Request, Not a Setting

My prompt ends with "Keep it under 300 words", and the parameter that feeds it is called `maxWords`, which in hindsight is a misleading name for what it does. It isn't a limit. It's a polite ask, and the model treats it the way you'd treat a suggested dress code. Mostly it lands near 300. Sometimes it doesn't.

If you need a hard ceiling, `maxOutputTokens` in `generationConfig` is the real control, and it truncates rather than negotiating. The catch is that it cuts mid-sentence, so you're trading a soft limit that's occasionally wrong for a hard one that's occasionally ugly. For a summary I'd rather have the soft version; for anything I'm going to parse, I want the ceiling.

## One Thing I'd Change Nothing About

After a repo gets analysed, a signed-in user's history entry gets written. That write is wrapped in its own try/catch:

```js
try {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.email;
  if (typeof userId === "string" && userId.length > 0) {
    await saveSearchHistory(userId, repoUrl, metadata.name, owner, explanation, metadata);
  }
} catch (historyError) {
  // Don't fail the main request if history saving fails
  console.error("Failed to save search history:", historyError);
}
```

The user waited for a model call, it succeeded, and the result is sitting right there in memory. Losing it because a database write timed out would be absurd. Anything that happens after the expensive part and isn't the thing the user asked for should be allowed to fail quietly, and that includes analytics, caching and history.

The metadata fetch and the file fetch also run through `Promise.all` rather than in sequence, which I did get right the first time. Two independent network calls, no reason to queue them.

## What I'd Tell Myself a Year Ago

- The model call is ten lines and stays ten lines. Budget your thinking for context selection instead, because that's where quality actually comes from.
- Truncation is a ranking problem wearing a `slice()` costume. Decide what's worth the budget before you spend it.
- Read the error body. Always. `statusText` is a placeholder, not a diagnosis.
- A 200 with no usable text is a normal outcome, not an exception, and safety blocks arrive that way.
- Word counts in prompts are advisory; `maxOutputTokens` is the enforcement.
- Let the non-essential work after a successful generation fail without taking the response down with it.

None of this is specific to Gemini, which is the part that surprised me. Swap in another provider and the same four things bite you, because the API was never the hard bit. Deciding what to feed it, and being honest about what comes back, is the whole job.

*Originally published on [my blog](https://vikky2810.github.io/blog/building-with-gemini-api/).*
