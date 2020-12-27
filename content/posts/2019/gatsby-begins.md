---
title: Gatsby Begins
date: "2019-02-10T23:46:37.121Z"
template: "post"
draft: false
slug: "/2019/gatsby-begins"
category: "Blog"
tags:
  - "blogging"
  - "content ownership"
description: "And so I tried out Gatsby and promptly decided to turn
my Wordpress based blog into a static generated website."
image: "gastby.png"
---

And so I tried out [Gatsby](http://gatsbyjs.org) and promptly decided to turn
my [Wordpress](https://wordpress.org) based blog into a **static generated website**.
And to be honest, this is not the first time.

My personal website has gone through a couple of stack changes:

- 2008: Custom CMS (PHP)
- 2014: [Jeckyll](https://jekyllrb.com/) - static website
- 2017: [Wordpress](https://wordpress.org) - self hosted, Docker based
- 2019: [Gatsby](http://gatsbyjs.org) - static website

## Motivations

Well... in a word... **memory**.

I used to host my _Wordpress_ blog as a [Docker](https://docker.com) project on a small
[DigitalOcean](https://digitalocean.com) droplet and while trying to deploy some
new stuff using [Captain Rover](https://caprover.com) I was running out of available memory.
Wordpress had to go.

On top of that **I was also tired of Wordpress**. I recently read a
[nice blog](https://sendcheckit.com/blog/why-you-should-put-your-content-on-medium-and-your-own-domain)
post about leveraging [Medium](https://medium.com) to bring traffic to your owned
contents using the [import story](https://medium.com/p/import) function.

Long story short Wordpress was performing horribly when it comes to the Medium's import
function, and I didn't really wanted to spend too much reformatting each article.

## First Impressions

Gatsby is heavily based on [React](https://reactjs.org/) and [GraphQL](https://graphql.org/),
two tools that I like very much. It feels quite easy to jump into a theme that I don't know
and tweak it to my liking.

The official documentation sucks just a little. I felt confused in moving my first steps.
After a while I found [a beginner tutorial](https://www.gatsbyjs.org/tutorial/) that covers
most of the steps that you might need to get to a decent blog product. It wasn't easy
to find, at least for me!

The [starters](https://www.gatsbyjs.org/starters/?v=2) are a very nice feature. I could choose
a theme that I like, and extend it. More or less the way I am used to do with Docker.

What to say about the resulting performances? I ran a [lighthouse](https://developers.google.com/web/tools/lighthouse/) test and got 100% on everithing :-)

## A Lot of Work Ahead

As with every change, now I must re-import all my old posts. Damn it!

Luckily most of them were already written in [Markdown](https://en.wikipedia.org/wiki/Markdown)
so it should be quite of a quick effort.
