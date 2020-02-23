---
title: Prototyping At Scale
date: "2020-02-20T08:46:37.121Z"
template: "post"
draft: false
slug: "/2020/prototyping-at-scale"
category: "Blog"
tags:
  - "prototyping"
  - "scale"
  - "poc"
description: "In a world where Time To Market is paramount, choosing the proper tools to facilitate a POC and let 
it scale into a full production setup is critical!"
image: "prototyping.jpg"
---

![Prototyping At Scale](./prototyping-at-scale.jpg)

How many times did you hear **"Time To Market"** or **"Timing is King"** during the last year?
I bet you did hear it a lot.

The truth is that **to have a good idea is easy**, many people have that. 
Less people have the skills or the resources to take an idea to life and create
a functioning POC. And even less people are able to scale a POC to become a
stable product that generates revenue.

> Sadly, many startups suffer when it's time to scale up. 

The tech just doesn't hold up: there is too much (technical) debt to be paid out, 
onboarding developers becomes a long journey, and often the founders are the only 
ones with a global understanding of the codebase.

**For most of the startups in this position, it is already too late.**  
Luckily, you are reading this article 😜.

## Does it work? Don't touch it!

Most of the engineering problems can be solved by blindly applying the following
algorithm:

![Problem Solving Flowchart](./problem-solving-flowchart.png)

Besides beign funny, this schema contains two important points:

- **Don't touch things that work**
- **Blame somebody else when things don't work**

Is that being crazy? Let me explain.

*Don't touch things that work* means that you should choose existing tools that
solve a common problem instead of writing everything from scratch.

*Blame somebody else when things don't work* means that if you follow the first
point, you can open issues and use community support to troubleshooting, instead
of spending sleepless nights debugging your own codebase.

Of course, your product needs some custome code. The keyword here is "some".
So focus on your core value, and let other tools work for you.

## SaaS, PaaS and Docker

Let's be honest, **most of the time engineers reinvent wheels** that were already
inflated, strong and perfectly circular. Why? Well, sometimes I do that...
just because I can, just because it's fun. I'm guilty. Shoot me.

**There are problems that have been solved already**, like authentication and
authorization. Like storing data and exposing an API. Or like collecting
data to monitor users behaviour.

Tools like [Auth0](https://auth0.com/) or [FusionAuth](https://fusionauth.io/)
remove any burden of signup/login of users. [RDS](https://aws.amazon.com/rds/) or 
[ElephantSQL](https://www.elephantsql.com/) run databases for you. 
[Hasura](https://hasura.io) generates a full GraphQL API almost on the fly!

Most of those tools offer free plans and clear pricing models for the
scale up phase. Many of them are also available as [Docker](https://docker.com)
images and you can easily run them on premise, if you are so inclined.

Let's dive into some layers of the stack.

## Data Storage

Handling data is important, right? And none of us are really thinking to DIY.
But, do we put a decent amount of time in choosing the right tool for the task ahead?

Many new projects use [MongoDB](https://www.mongodb.com/) and they face
troubles when the data grows. I have nothing against MongoDB, it's an excellent tool
for some usecases, but it also has some specific behaviours that makes it 
**very expensive very fast**, 
[if not completely impossible to deal with](http://www.sarahmei.com/blog/2013/11/11/why-you-should-never-use-mongodb/)

Same thing applyes to [Firebase](https://firebase.google.com/). Firebase is simply
spectacular as a prototying tool, but [does it scale with your team and your 
economy?](https://crisp.chat/blog/why-you-should-never-use-firebase-realtime-database/).

- How much data are you going to handle during the first year?
- How much data do you estimate, if your product is successfull?

**Postgres is arguably one of the strongest Open Source Database available today**.
It handles relational and document paradigm. It is fast and reliable. It takes
no memory for small things, and can be optimised to run gigantic amount of data.

I've been using is in a [tough project](https://marcopeg.com/2020/fetchq-introduction)
where over 100 servers were pushing millions of records into a single Postgres
server, and that small server didn't even begin to sweat.

With Postgres, you can store both denormalized data (aka: relational tables)
and normalized data (aka: documents). Thanks to triggers and functions you
can build impressive caching layers that leverage after-write normalization.

> Did you know that Postgres ships also an event emitter? I was in sheer
disbelief when I found out!

## Frontend

## Deployment

