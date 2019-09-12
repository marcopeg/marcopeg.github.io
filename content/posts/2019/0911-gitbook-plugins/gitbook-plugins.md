---
title: Gitbook Plugins
date: "2019-09-11T08:46:37.121Z"
template: "post"
draft: false
slug: "/2019/gitbook-plugins"
category: "Blog"
tags:
  - "gitbook"
  - "plugins"
  - "disqus"
  - "youtube"
  - "codepen"
  - "redirect"
description: "Last weekend I've been working on some plugins for GitBook. Here is the list!"
image: "gitbook.png"
---

I recently starter working on an education project called [LearnJS](https://marcopeg.com/learnjs)
and I decided to draft it with [GitBook](https://gitbook.io) as it is quite simple to
setup and run.

There were a few features missing from the core and from the community, so I decided
to build some super simple plugins that help me handling my contents better.

Enjoy!

---


## gitbook-plugin-redirect-https

Just add this plugin to your `book.json` and enjoy an automatic Javascript redirect
from _HTTP_ to _HTTP**S**_ when your book is published online.

The plugin recognises your local environment and skips the redirect.

- [Go to the source code](https://github.com/marcopeg/gitbook-plugin-redirect-https)
- [Install from NPM](https://www.npmjs.com/package/gitbook-plugin-redirect-https)

## gitbook-plugin-disqus-legacy

Just add this plugin to embed a [Disqus board](https://disqus.com) in every page of 
your 3.x GitBook.

> You can configure a few settings and blacklist pages that should not use it.

- [Go to the source code](https://github.com/marcopeg/gitbook-plugin-disqus-legacy)
- [Install from NPM](https://www.npmjs.com/package/gitbook-plugin-disqus-legacy)

## gitbook-plugin-youtube-placeholder

This plugin lets you embed a Youtube video that is fully responsive to the page size.
Works great for desktop and mobile.

- [Go to the source code](https://github.com/marcopeg/gitbook-plugin-youtube-placeholder)
- [Install from NPM](https://www.npmjs.com/package/gitbook-plugin-youtube-placeholder)

## gitbook-plugin-codepen-placeholder

If you need to embed a [CodePen](https://codepen.io) into your pages, this plugin does
the heavy lifting for you.

- [Go to the source code](https://github.com/marcopeg/gitbook-plugin-codepen-placeholder)
- [Install from NPM](https://www.npmjs.com/package/gitbook-plugin-codepen-placeholder)

