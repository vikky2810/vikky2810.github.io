---
title: "I Tried to Beat Node.js with C++. It Didn't Go as Expected."
published: false
description: "C++ vs Node.js HTTP benchmark with wrk: Crow 5.4k req/s, Node http 12k, uWebSockets 57k. Same route, same laptop, with code and why Crow lost to Node."
tags: node, cpp, performance, benchmark
canonical_url: https://vikky2810.github.io/blog/cpp-vs-node/
cover_image: https://vikky2810.github.io/src/assets/cpp-vs-node.png
---

Today I decided to make an HTTP route in C++. You can ask — why C++? My answer is: my free will. I just felt like it. I like to mess around, and that's the whole reason.

So I did a little search and found a way: a library called [Crow](https://crowcpp.org/master/). It looks like Python's Flask, but for C++. A simple GET route that takes a custom name in the URL and returns `hello <name>!`

## Attempt One: Crow

This is the entire server. Eleven lines:

```cpp
#include <crow.h>

int main() {
    crow::SimpleApp app;
    CROW_ROUTE(app, "/hello/<string>")([](std::string name){
        return crow::response("Hello, " + name);
    });
    app.bindaddr("127.0.0.1").port(18000).multithreaded().run();
    return 0;
}
```

It worked. But I wanted to know how *much* it could handle. So I ran the classic hammer:

```bash
wrk -t12 -c400 -d30s http://localhost:18000/hello/vikram
```

12 threads, 400 connections, 30 seconds. Here's what Crow gave me:

![wrk benchmark of the Crow C++ server showing 5470 requests per second](https://vikky2810.github.io/src/assets/cpp-vs-node-crow.png)

*Crow: 164,457 requests in 30.06s · 5,470 req/sec · avg latency 76.34ms.*

> "I hear C++ is a thousand times faster. So why am I only getting 5k requests per second?"

I was confused. I'd heard "C++ is so much faster" a thousand times. 5k didn't feel fast at all.

## Wait — Node Is Faster?

So, yes — I built the same route in Node. Half of this code is from Google, I won't lie:

```js
const http = require("http");
const server = http.createServer((req, res) => {
  const path = req.url.toLowerCase();
  const method = req.method;
  if (path.startsWith("/hello/") && method == "GET") {
    const name = path.split("/")[2];
    res.end("Hello, " + name + "!");
  }
  if (path == "/" && method == "GET") {
    res.end("Hello, World!");
  }
});
server.listen(18000, () => {
  console.log("Server is running on http://localhost:18000");
});
```

I ran the exact same `wrk` test again. The result:

![wrk benchmark of the Node.js server showing 12052 requests per second](https://vikky2810.github.io/src/assets/cpp-vs-node-node.png)

*Node.js (built-in http): 362,045 requests in 30.04s · 12,052 req/sec · avg latency 37.39ms.*

Now I was *more* confused. 12k req/sec on Node, 5k on C++? That's backwards from everything I'd been told.

So I did a little search about *why*. What I found: the Crow library I was using doesn't handle requests the way Node's built-in `http` does. Node processes requests asynchronously — non-blocking I/O, event loop, all of that. Crow, in the way I was using it, doesn't. That's the gap. It's the same kind of lesson I hit while [building a local large-file upload tracker](https://vikky2810.github.io/blog/local-large-file-upload-tracker/): the I/O model and the retry plumbing matter more than the language name on the tin.

**The lesson:** "C++ vs Node" is never just language vs language. It's which library, which I/O model, which defaults. Async I/O beats naive threads for tiny hello-world routes.

## Attempt Two: uWebSockets

More research led me to a new library: [uWebSockets](https://github.com/uNetworking/uWebSockets). So I cloned the repo. It took a lot longer than usual to download. I checked the size:

![Terminal showing the uWebSockets folder is 1.4GB](https://vikky2810.github.io/src/assets/cpp-vs-node-uwebsockets-size.png)

*Yes. 1.4 GB just to make a simple route. That's okay, I'm not complaining. But seriously — 1.4 GB?*

Moving on. Here's the same route in uWebSockets:

```cpp
#include <App.h>
#include <iostream>

int main() {
    uWS::App()
    .get("/hello/:name", [](auto* res, auto* req) {
        std::string name(req->getParameter(0));
        res->end("Hello, " + name + "!");
    })
    .get("/", [](auto* res, auto* req) {
        res->end("Hello, World!");
    })
    .listen(18000, [](auto* token) {
        if (token) std::cout << "listening on 18000" << std::endl;
        else std::cout << "Failed to listen" << std::endl;
    })
    .run();
    return 0;
}
```

And it turned out…

![wrk benchmark of the uWebSockets server showing 57439 requests per second](https://vikky2810.github.io/src/assets/cpp-vs-node-uwebsockets.png)

*uWebSockets (C++): 1,728,986 requests in 30.10s · 57,439 req/sec · avg latency 6.82ms.* Very great. 50k+ requests per second.

Compared to Node, see this — both bars from the same machine, same test, back to back:

![Side by side terminal showing uWebSockets 57k vs Node 12k requests per second](https://vikky2810.github.io/src/assets/cpp-vs-node-final.png)

*Final showdown: uWebSockets ≈ 57.4k req/sec vs Node ≈ 12.9k req/sec on re-run. C++ is ~4.5x faster — when you pick the right library.*

## The Scoreboard

| Server | Req/sec | Avg latency | Transfer |
| --- | --- | --- | --- |
| Crow (C++) | 5,470 | 76.34 ms | 0.51 MB/s |
| Node built-in http | 12,052 – 12,895 | ~36 ms | ~1.6 MB/s |
| uWebSockets (C++) | 57,439 | 6.82 ms | 5.86 MB/s |

Test: `wrk -t12 -c400 -d30s http://localhost:18000/hello/vikram` · same laptop, same route, same day.

## So… What's the Use of This Information?

In the end there is a question that remains: *"Yes, you found a way to prove C++ is faster than Node… but now what? What is the use of this information?"*

I'll answer it the way I feel it: I did what I felt like. I didn't do it to prove something. I did this because I like it. I like to mess around. And I did. That's it.

Thanks for reading till here. If you have something to say, you can say it to me here: [kamblevikram2810@gmail.com](mailto:kamblevikram2810@gmail.com)

*Originally published on [my blog](https://vikky2810.github.io/blog/cpp-vs-node/).*
