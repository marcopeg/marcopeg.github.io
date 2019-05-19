---
title: ForrestJS - Universal React
date: "2019-05-14T08:46:37.121Z"
template: "post"
draft: false
slug: "/2019/universal-pwa-in-react"
category: "Blog"
tags:
  - "forrestjs"
  - "react"
  - "pwa"
  - "universal"
  - "app"
  - "redux"
  - "router"
  - "ssr"
  - "server side rendering"
  - "nodejs"
  - "expressjs"
  - "graphql"
description: "Create your Universal PWA in React / ExpressJS / GraphQL. With ForrestJS it's easy and fast.
In this first tutorial we'll get you up and running in 27 seconds!"
image: "react.svg"
---

![Forrest Gump Point](./media/forrest-gump-point.jpeg)

[ForrestJS](https://forrestjs.github.io) provides a set of utilities and starter kits inspired by GatsbyJS, but with the purpose
of **creating Universal PWAs that can run on server, browser and Cordova** native wrappers within the same codebase.

But it's easier done than explained.

Open your terminal (we tested this on a Mac so far) and type:

    npx forrest run my-project

In less than a minute (it depends on your machine and connectivity) you should have a service running on port 8080:

    http://localhost:8080

And it should be equivalent to the demo that is hosted on Heroku:
https://forrest-starter-universal.herokuapp.com/

<div style="margin-top: 80px"></div>

## The Universal Starter Kit

Digging into the newly created project (`cd ./my-project`) we can see that **the folder structure is an
extension of Create React App**.

In fact, this project has been created out of the default starter kit called
[starter-universal](http://github.com/forrestjs/starter-universal):
**if you are familiar with CRA, then you can build on ForrestJS!**

Here is a brief list of what comes just out of the box:

- React
- Redux
- Redux Thunk
- Redux Features
- React Router
- React Loadable
- React INTL
- Styled Components
- ExpressJS
- GraphQL
- Server-Side Rendering
- React Styleguidist
- Gitbook
- Development and Production scripts
- Dockerfile (run the app as a container)
- **Helper scripts to run your app for free on Heroku**
- Makefile to run 'em all

I feel **this is a solid starting point for any web project**, but at its core, it is still a CRA project.
So if you ever used Create React App, you know how to deal with it.

<div style="margin-top: 80px"></div>

## Other Starter Kits

**We borrowed the concept of a _STARTER KIT_ from GatsbyJS** (more about it later). A starter is nothing more
than a Git repository that functions as a foundation for a specific type of project.

When you type `npm forrest run xxx` you are going to use the default
[forrest-starter-universal](https://github.com/forrestjs/starter-universal#forrest-starter-universal),
which is just a starter hosted on GitHub that I'm personally developing and curating.

More default starters will come as part of the default ForrestJS distribution, but the thing is that
**you can build your own starter** and host it on GitHub. When you want to kick off a new project based
on your own starter just run:

    npx forrest run project-name -t @username/repository

(At the moment the CLI assumes you host your stuff on GitHub, we have plans to make it more generic
so to support GitLab and any kind of URL).

<div style="margin-top: 80px"></div>

## On the Shoulders of Giants

It should be quite obvious so far that I like Create React App (well, [at least the extensible version
provided by react-scripts-rewired](https://www.npmjs.com/package/react-scripts-rewired)), but it is not
the only great project that I took inspiration from!

### GatsbyJS

[GatsbyJS](https://gatsbyjs.org) is a wonderful **static site builder**
([this blog is based on it](/2019/free-website-with-gatsby-and-gitpod)) that allows you to start a new
React website in minutes and host it on GitHub for free.

GatsbyJS is produced by the guys behind [Netlify](https://www.netlify.com) and it is
the open source component of their commercial offering.

ForrestJS project's structure is heavily inspired by GastbyJS as I use a monorepo the way they do
(we both use [Lerna](https://lerna.js.org/) to handle it), and I definitely borrowed the concept of a
**starter kit** from Gatsby.

Whek, it works wonders for them, it will work wonders for ForrestJS!

### NextJS

[NextJS](https://nextjs.org) offers an incredibly smooth experience in building server-side rendered websites.

NextJS is produced by the guys behind [Now.sh](https://zeit.co/now) and it is the open source component of
their commercial offering. You can build on NextJS and hosting for free on a pure serverless environment
with Now.sh (well, "free" in sense of "free beer" if you can share that beer with anyone else).

Unfortunately, NextJS is limited to the web platform only and their Server-Side Rendering cannot be opted out.
Plus there are some performance issues due to their hard routing choices bound to the serverless... Long story
short **I believe NextJS is great for a website, but not for a PWA**.

Anyway, they have a wonderful developer onboarding experience that I aim to mimic in ForrestJS.

<div style="margin-top: 80px"></div>

## Roadmap

Looking ahead I aim to curate the documentation as much as my schedule allows, review Pull Requests from all
of you contributors, and write some more step-by-step articles here on my blog.

**PLEASE CONSIDER:**<br>
Your feedback is the most important Component for this project!


