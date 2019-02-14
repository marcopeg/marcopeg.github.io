---
title: Best Practices for a Good Team Experience
date: "2018-05-19T06:21:37.121Z"
template: "post"
draft: false
slug: "/2018/best-practices-for-good-team-experience"
category: "Blog"
tags:
  - "team"
  - "coding"
description: "Few tricks I've learned that makes collaboration easier."
image: "team-experience.jpg"
---

Through my years in engineering I saw a couple of project succeed and some other fail. I've been exposed to many best practices: waterfall(s), agile, chaos, git. You name it, we tried it out.

It's been a while since I've started to think a **set of simple practices that might help a team to cooperate better**, to reduce the occasions where we cross each other paths, reduce merge conflicts in Git and generally reduce the fuckups we do.

In this article I'm going to note those ideas down. Of course I aim to become a best selling author and give away millions of copies of the book that I will write at the end. All my posts share the same humble ambition!

## Test in Isolation

### Problem:

> A common issue that I've experienced many times is the introduction of new **environment variables** that are defined in files that are _gitignored_.

Common causes are new external services being introduced, and for which you need some info like API tokens or passwords. Emails sending providers are often a culprit.


### Solution:
> Clone your working branch in a temporary folder and run it from there. 

This way you won't rely on your local development environment, but you will just simulate a "new developer experience". If it doesn't work it means that you have some local environment definitions that you missed to add to the project´s `.env` or you missed to document in a **changelog** file. 

---

## Keep a Changelog file

### Problem:

> Often out git history is not as clear as we would like it to be, and it becomes difficult to understand what had changed at a big picture level.

### Solution:

> Start to maintain a simple `CHANGELOG.md` in the root of your project.

The main goal is to track configuration changes or new dependencies that you have introduced and that your collaborators need to install after they merge in your changes.

There is no need of a strict format, the goal is to share high level info:

```
## 2018-05-18 - Introduced Mailgun Service

> @alialfredji  
> Issues: #7, #14

Three new environment variables are required by the webapp service:

    MAIL_HOST=xxx
    MAIL_USER=xxx
    MAIL_PASSWORD=xxx

Although those variable are already set in the _docker-compose_ definition,
you might need to add them into the `services/webapp/.env.local` if you are
running the app from local node.
```

Also this log should not explain code changes, for that we already have git. The goal is to share the **big picture** and how the codebase is evolving a whole.

---

## Try/Catch a lot

Here is come a best practice about Javascript code. In modern Javascript we extensively use `Promises` and `async/await` to get ourselves out of the **callbacks hell**.

But this often leads us to another foe:  
the **UnhandledPromiseRejectionWarning** error!

### Problem:

```
// unhandled promise
ExpressApp.get('/', (req, res) => {
  fetch('http://foo.com')
    .then(r => r.json())
    .then(data => res.send(data)
})

// uncatched exception
ExpressApp.get('/', async (req, res) => {
  const r = await fetch('http://foo.com')
  const data = await r.json()
  res.send(data)
})
```

### Solution:

```
// unhandled promise
ExpressApp.get('/', (req, res) => {
  fetch('http://foo.com')
    .then(r => r.json())
    .then(data => res.send(data)
    .catch(err => res.status(500).send(err.message)) // <- catch!
})

// uncatched exception
ExpressApp.get('/', async (req, res) => {
  try {
    const r = await fetch('http://foo.com')
    const data = await r.json()
    res.send(data)
  catch (err) { // <- catch!
    res.status(500).send(err.message)
  }
})
```

---

## Docker as Developer First Environment

### Problem:

You receive a Docker project and the documentation claims `docker-compose up` will do the trick, you try and it doesn't. You ask your colleagues and they produce a list of environment variables, build-steps and magic tricks that you need in order to actually begin to proactively code on the solution.

How many times do you experience this frustrating situation?

### Solution:

1. Your `docker-compose.yaml` should use only existing standard images (like Node or Wordpress) and you link local source folders as _volumes_ in it.
2. Your `docker-compose.yaml` should use version `2.1` so that you can specify any piece of information using environment variables with defaults for development purpose: `PORT=${PORT:-8080}`.
3. Your system should use **seed scripts** if the application needs a particular state to be in when it boots. MySQL and Postgres offers a very simple way to seed and empty database. Files can be seeded with simple bash commands that uploads local zip archives into initially empty volumes.
4. **Reset your application state as often as possible**. This is a good test to run at least once a day. Destroy containers, remove volumes and networks. Basically restore your Docker install to factory settings. Then clone your project in a temporary folder and try to boot it. Does it still work? Keep it working this way.
5. Use `mem_limit` like there was no tomorrow. Give your services the least amount of memory you can. Find the lower limit early on in your development project. This will help you spotting memory issues problems that will go unnoticed for long time if you give Docker the whole 16Gb of ram that is available to your Mac.

---

## Docker as Production Ready Environment

## Problem:

Your development setup is now stable but you need to push it to production. Hence you need to override variables. Luckily you followed the principles listed in the previous step and have all optional parameters defaulted to development values in your `docker-compose.yml`.

## Solution:

1. Use `.env` file to override the configuration with production values, gitignore that file so it won't affect your development setup, nor your repo.

