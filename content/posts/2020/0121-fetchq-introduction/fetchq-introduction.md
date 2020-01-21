---
title: FetchQ - An Introduction
date: "2020-01-21T08:46:37.121Z"
template: "post"
draft: false
slug: "/2020/fetchq-introduction"
category: "Blog"
tags:
  - "fetchq"
  - "queue"
  - "postgres"
  - "architecture"
  - "micro service"
description: "Two years ago I was working on a web-scraper with my startup Mysocial.io and we 
needed to distribute work across multiple servers while achieving uniqueness in the system. We were 
handling hundreds of millions of tasks and FetchQ is the result of that effort."
image: "postgres.png"
---

It was the beginning of 2018 and my young soon-to-be co-founder asked me: 

>  Can we download Instagram's influencers?

That's the very beginning of my startup journey as co-founder of [Mysocial.io][mysocial] and  
my answer was a straight:

> NO WE CAN'T!

Luckily I was wrong, and when I got home that night my brain began to work on the challenge ahead. 

A few months later, we were successfully scraping Instagram, **tracking 4 millions influecers on a daily basis**, 
while growing a database of over 100 millions Instagram profiles.

This is how [FetchQ][fetchq] came to life. Possibly the most challenging project of my entire career.
The whole story is available on youtube:

`youtube: https://youtu.be/g8P_w5dyW3c`

## Queue Systems in Real Life <sup>(tm)</sup>

**Queues are ubiquitous in real life.** Think last time you went to a coffee shop (I live in Sweden and they are
crazy slow coffee makers, so you can bet you'll find a queue there), or just try to enter a 
supermarket during rush hours, what do you see at the cashier? A queue.

The supermarket example is spot-on because it clearly represents the problem that a queue system
helps mitigating in a software problem. Let's look into it.

#### It's 15:00 in the afternoon and **the supermarket is basically empty**:

You pick your stuff and approach the cashier. Only one cashier is open.
There is just one guy in front of you and you are out in just a minute.

#### It's 18:30 in the evening and **it's rush hour**:

You pick up your stuff and approach the cashier.
There are many open lines and you choose the one with the shorter queue.
It takes up to 10 minutes to get out of there.

> In _Real Life_ queues form when the amount of work todo grows faster than the processing capabilities.
> Also, we use to open new cashiers during rush hours to handle a bigger workload for a short amount of time.

Keep this example in mind while you walk into the software-side of this story!

## Queues in Sofware Development

A queue system is a todo-list for applications and it normally works like this:

```
---> Feeding the Queue
App1 adds stuff to do into a queue.
App1 adds LOT of stuff do do.

---> Processing the Queue
App2 picks the first item from the queue and processes it.
App2 does it again (and again) until the queue is empty.
```

Often, `App1` is way faster at producing workload than `App2` is at processing. More or less like
a supermarket during rush hours. In such a situation **you can use a _queue system_ to collect the
"pending workload"** and run multiple instances of `App2` to increase the system processing capacity.

Again, it's the supermarket situation translated to computers.

> A queue system helps **digest massive workload** by distributing it across multiple
> processes or servers.

## Queues to Improve UX

But queues can also be used to **improve User Experience** by delegating non-critical tasks 
to some side processes. A common situation where you can benefit from a 
**queue-oriented architecture** is users signup.

The signup's flow looks like this:

1. get data from the request's body
2. apply formal validation (username length, valid email)
3. attempt to create the new user's record into the database
4. **_SEND A WELCOME EMAIL_**
5. return a welcome message to the user

What is the bottleneck in this flow? The email. Sending email is a slow and unreliable task.
But it is necessary to give positive feedback to the user.

Say you own a successfull social-network and millions of people sign up. You can control
how fast your validation system is, and you can optimize your database almost at will.

But with emails... no way. It stays slow. Yes, you are going to use external services like
MailGun or Mandrill, still is slow and can fail.

Do you really need to hang your users' signup experience for **seconds** just because you
`await Mandrill.send(...)`? I don't think so.

A queue system let you re-work the signup flow as:

1. get data from the request's body
2. apply formal validation (username length, valid email)
3. attempt to create the new user's record into the database
4. **_--&gt; QUEUE A WELCOME EMAIL &lt;--_**
5. return a welcome message to the user

**Queuing an email task is fast and reliable**, many queue systems work in memory and they are
insanely fast. [FetchQ][fetchq] works with your Postgres instance and
queing a new task is as fast as creating the user's record in the ``ccounts` table.

On the side, you can spin up one (or many) process/machine who's [single responsibility](srp) is to
process the emails queue, actually sending the emails using Mandrill or wathever you like best.

## Existing Solutions

As you may guess there are several existing queue systems that you can use off-the-shelf. They aim to
solve the ingest/consumer problem and they aim at handling any arbitrary workload. You can throw
[googols](https://en.wikipedia.org/wiki/Googol) of data at them!

If you are running a system where the tasks to run span into the "billions of items" you should
seriously consider one of those services:

[RabbitMQ](https://www.rabbitmq.com/) is an in-memory message broker and you can efficiently use it
to store tasks and distribute it across multiple consumers. It is easy to start with it as it comes
as Docker image that you can spin up in seconds, but it is costly to deploy (you need to cluster it)

[AWS - SQS](https://aws.amazon.com/sqs/) is the off-the-shelf Amazon queue service. As any AWS service,
this can intake almost any workload that you can think off. And you pay as you go.

## Welcome FetchQ

When testing and practicing with existing tools, I hit some thick walls when it comes to features:

1. with RabbitMQ and SQS can't look inside a queue.
2. it is complicated to handle **unique tasks** in a queue.
3. queues are _FIFO_ only, prioritizing tasks is not an easy feat.
4. you simply **can not backup** RabbitMQ or SQS.

Back then I was working with a smart guy, but he was very green and I didn't feel like throwing at him
too many technologies all at once. NodeJS + Postgres felt enough.

On top of it we were trying to scrape, that means that once you handle a task, **you want to do it
again in the future**, and you probably want to dynamically calculate "when" based on conditions.

Postgres is a dbms used by gigantic companies to handle unbearable amount of data. We were (naively)
aiming to _only_ a few millions influencers... It should be enough, right?

Fast forward few months, we were now handling **hundreds of millions of tasks in a single small
Postgres instance**. To be transparentm we were running our db on an `ec2.m4.medium` instance on AWS
with a 1Tb EBS data disk attached to it. At the same time **we had ~100+ servers connected to that
database** who were consuming and populating many different queues. Not bad at all.

In the next article you will go through the **"FetchQ Hello World"**, a quick tutorial that will guide
you setting up your first queue based application in just one single NodeJS file.

Courious? Check this out!  
https://codesandbox.io/s/fetchq-workflow-coruu


[fetchq]: https://fetchq.com "Statefull queue system built on top of Postgres"
[mysocial]: https://mysocial.io "A community for content creators"
[srp]: https://en.wikipedia.org/wiki/Single_responsibility_principle