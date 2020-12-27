---
title: FetchqCRON
date: "2020-04-01T08:46:37.121Z"
template: "post"
draft: false
slug: "/2020/fetchq-cron"
category: "Blog"
tags:
  - "fetchq"
  - "cron"
  - "postgres"
  - "product"
description: "<b>Executing repeatable jobs is at the core of most IT projects.</b><br>From following up a few days after a user signs up, to repetitive cleaning or caching procedures.<br><br><em>FetchqCRON</em> provides time-based execution as a service, on Heroku or on-premise via Docker. <b>FOR FREE.</b>"
image: "fetchq-cron.png"
---

![Planning time-based jobs](./curtis-macnewton-vVIwtmqsIuk-unsplash.jpg)

<div style="text-align:center;font-size: 8pt;margin-top:-3em;margin-bottom: 3em;">Photo by Curtis MacNewton on Unsplash</div>


## Run smart CRON jobs

I started to work on the _FetchqCRON_ project when I realized I was re-implementing the
architecture around repeatable jobs over and over, project by project. 

> And you don't like to repeat yourself, right?

Let's start with an example:  
An ideal scenario to **handle users signup** would be:

1. sign the user up
2. 👉 _in 2 hours, check on the user to see if he/she confirmed his/her email_
3. thank the user

Point n.1 and n.3 are up to your route handler, **_FetchqCRON_ lets you solve point n.2** 
with a simple _REST_ call that plans the execution of a _webhook_ in 2 hours.

You can easily configure **how to execute the webhook**. It can be any kind of _REST_ call where
you are in control of headers and body structure, or it can be a _GraphQL_ query or mutation.

> Wanna dig into the documentation?  
> 👉 https://cron.fetchq.com

## How to se tup a Webhook job:

Here is an example call that sets up a task with 2 hours delay. It will _post_ to
a given _URL_, providing custom headers:

```bash
/* post://fetchq-cron-instance.com/api/v1/cron */

{
  "group_name": "verify-email",
  "task_name": "user123",
  "schedule": {
    "method": "delay",
    "value": "+2 hours"
    },
  "action": {
    "method": "webhook",
    "request": {
      "type": "rest",
      "method": "POST",
      "url": "http://my-web-app.com/webhooks/verify-email/user123".
      "headers": {
        "content-type": "application/json",
        "authorization": "Bearer xxx"
      }
    }
  }
}
```

The target webhook should respond with `statusCode=200` in order
to yield a successful run. In such a case, the webhook will be triggered again in 2 more hours.

> Successfull webhook execution:  
> statusCode = 200

**In case any error should happen,** the action is re-attempted for a configurable amount of times
before the system gives up, every failing run is duly logged for full traceability.

## Webhooks can reschedule the job:

The target webhook can interact back with the scheduler,
**providing active feedback and re-programming the execution plan**:

```js
/* webhook's response: */
{
  "success": true,
  "schedule": {
    "method": "delay",
    "value": "+999y",
  },
  "logs": [{
    "message": "user email was successfully confirmed"
  }]
}
```

This kind of response will re-schedule the next execution 999 years in the future.
It's just a hacky way to kill the task. _We have more features coming up soon._ 😊

It also writes a log entry in the task's history. _FetchqCRON_ keeps a **detailed
execution log** where you can trace any activity that happened to a task.


## Main Features:

- setup time-based jobs via RESTful API
- setup time-based jobs via WebConsole
- access detailed logs per task / group / server
- scale up the job workers for parallel execution
- run the server in API only mode (good for micro-service architecture)
- fine-grained authorization via JWT (*)

_(*) in development_

## Job Types:

- webhook
- AWS Lambda functions (*)
- Docker functions (*)

_(*) in development_

## Try it out on Heroku

😎 Wanna try it?  
It takes just a few minutes to run your own instance in Heroku:

<p style="max-width:200px;">
<a href="https://heroku.com/deploy?template=https://github.com/marcopeg/fetchq-cron-heroku" title="Deploy on Heroku">
<img src="https://www.herokucdn.com/deploy/button.svg" alt="deploy on Heroku">
</a>
</p>

🤓 Feeling adventurous?  
We have you covered, click here to _run the cloud-based development environment:_

<p style="max-width:200px;">
<a href="https://gitpod.io#https://github.com/marcopeg/fetchq-cron" title="Open in GitPod">
<img src="https://gitpod.io/button/open-in-gitpod.svg" alt="Open in GitPod">
</a>
</p>

## Feedback & Contribute

Read the Documentation:  
📖 https://cron.fetchq.com

Please come and **give your feedback** on our ProductHunt page:  
👉 https://www.producthunt.com/posts/fetchq-cron

And don't forget to **give us a star** on GitHub:  
⭐ https://github.com/marcopeg/fetchq-cron

