---
title: Make it Parallel
date: "2018-02-02T06:21:37.121Z"
template: "post"
draft: false
slug: "/2018/make-it-parallel"
category: "Blog"
tags:
  - "postgres"
  - "queue"
  - "parallel"
description: "How to run consume a queue with multiple independent workers in Postgres, and survive!"
image: "devils-fork.jpg"
---

The first version of [my queue system](https://fetchq.com/) was very simple, in the end it proved to be too simple for a real life scenario.

I knew I couldn't use queue / messaging tools like RabbitMQ because of my requirements (uniqueness, time based) so after some googling I resolved to _DIY_ and I choosed _PostgreSQL_ as database and centralized queue management.

The general idea it was to query a table to get "what to do next?".

Here is the simple schema:

    taskId | taskSubject | nextIteration
    ------------------------------------
    1      | buy milk    | today
    2      | do laundry  | tomorrow

And the simple query to fetch the task was:

    SELECT * FROM my_queue
    WHERE nextIteration < NOW()
    ORDER BY nextIteration ASC

Beautiful in it's own simplicity, isn't it? When a _worker_ resolves a task it just need to update the `nextItaration` to the preferred date. Each job should decide how long to wait until next execution.

> I ran my tests and I was happy.

Do I need to mention here that my "tests" were running on my local machine, with just one consumer to the queue? Yes, I guess it's an important part of this story. My tests were successful - or so I believed back then - and I did spend next few days implementing the actual logic of the workers.

> And then it came the **deployment day**. 

My startup received quite a good deal of credits from _AWS_ so I was thrilled to **scale up** my system and unleash the **true power of parallel computing**.

> Oh boy, **I was so young!**  
> -- 6 months ago

My local  testing was giving me a throughput of ~20 tasks/sec with one _consumer machine_ running the workers. 

Of course **my scaling expectations were quite linear**: 2 machine means 40 t/s, 4 machines 80 t/s, and so forth... realistic uh? Somewhere deep inside I knew that linearity was just a little too much of an expectation but I rate myself a genius, so why not? 

Without further hesitation I hit the _autoscaling group_ accelerator and displaced 10 consumer machines. My chest was exploding with early shouts of joy for 200 tasks per seconds were just few seconds away...

> You need to know that this queue system is meant to handle something around 2-3 billions tasks, probably **~120 millions tasks need to run daily**. 
>
> In a day we have 86400 seconds and that calls for **near 1900 tasks per second throughput need**. Which calls for something around 70 consumers machines if they can handle 20 t/s. That's the number that made me smile when I saw my local test results.
>
> Welcome to my little big data adventure!

Bip! bip! bip! Suddenly I receive the _"deployment succeeded"_ notification (1) and I rushed to my terminal to get the throughput estimate and... NOOOOOOOOO!!!!!

> **still stuck at 20 tasks per second**.

How comes? 10 machines woking at full speed, an RDS database with enough power in it to serve NASA for their next manned mission to Mars... and it still producing the very same results of the single development machine? That was bad news.

I dug deep into the logs produced by each machine and a terrible pattern slowly begun to take shape before my eyes: **every task was given out to every consumer machine**. My cluster was doing parallel computing all right, but it was just doing the same job in parallel for 10 times. Far away from what I had in mind.

When I recovered from the shock I realized it was a reasonable simple problem of concurrent access to the same task. I had actually prepared no mechanism to lock one task once it's been picked up.

A creative genius like myself doesn't have to wait much for his smart-ass brain to come up with a decent solution: 

> When a consumer picks up a task it will lock the task by setting `nextIteration` some minutes in the future.

    task = (
      SELECT * FROM my_queue
      WHERE nextIteration < NOW()
      ORDER BY nextIteration ASC
    )

    UPDATE my_quee 
    SET nextIteration = NOW() + '5 minutes'
    WHERE id = task.id

This way I was getting two birds with one stone:

- bird number one, I could lock the queue so no tasks will be picked by two machines because of `WHERE nextIteration < NOW()`
- bird number two, if a worked hit an error the task will be picked up by another worker few time later. I was sure I had a self healing queue in my hands. Nobel prize here I come!

Stunned by my brilliant solution I hit the red button again and deployed. This time I was a little bit more cautious in my expectations, but still it should work, shouldn't it? Simple idea, simple query... what could possibly go

Bip! bip! bip! It's ready and it's live. One rushed terminal typing minute later I got my new throughput result: ~40 t/s. Whaaat? Better than before but **still far away from the 200 t/s need**.

This was a bad moment in my life. I felt like the problem couldn't be solved. If I wasn't able, who was? That stupid Postgres must not be the right tool. We must take our startup down because it can not be done. Google? Facebook? They are surely cheating with their data... Somehow... Maybe not... Maybe somebody else faced the same issue... Maybe...

And I finally begun doing what I should have been doing since the beginning: I hit "google" on my keyboard and started to research of concurrent updates in Postgres. Yes buddy, the only safe assumption one can make about a technical problem is that **someone else already faced it and solved it**. No matter what problem. Sure there will be exceptions to this rule but I challenge you to come to me with an example!

To search for a solution that you don't know is tricky. Way more tricky than just throw code to a solution like I did so far. It requires more creativity than coding and a very open mind as you have to turn, shift and adapt your search keywords all along the way, as your understanding of the problem slowly get better and better.

It took few days for me to find the solution to this problem. It is not a difficult solution, it was difficult to me to get to find the proper keywords that got me to to proper Stackoverflow thread with the proper answer. The most difficult part was to recognise the correct answer.

Here it is, it turned out I was very close to the solution and that my smart-ass brain is not that bad after all. I just didn't know enough about the tool I was using - Postgres - which happens to be an amazing tool with amazing features. The first feature that I got to learn in my **little big data adventure** is `SELECT ... FOR UPDATE`:

    UPDATE my_queue 
    SET nextIteration = NOW() + '5 minutes'
    WHERE id IN (
      SELECT id FROM my_queue
      WHERE nextIteration < NOW()
      ORDER BY nextIteration ASC
      LIMIT 1
      FOR UPDATE
    );

Can you see it is just the combination of my original two queries? The concurrency problem I faced during my second test was due to the fact that by the time Postgres executes the `UPDATE` query, some other consumer already manage to slip in it's `SELECT` request.

By combining the `SELECT/UPDATE` in one single request, and locking the table's row with the `FOR UPDATE` statement I leverage Postgres smart-ass geniuses to handle the concurrent access problem for me.

Well, that is really it for this story. I have more to tell as I didn't quite get the life lesson this first time. My brain is quite slow in that respect.

And for the life lesson, I can squeeze it in a simple sentence:

> Learn the tools you're using

I was using Postgres just as a simple data repository. I was doing at application level what many smart engineers already did in Postgres. 

Cm'on! We have amazing open source tools that we can use to improve our work, our effectiveness and the value that we produce. Let's not be so arrogant (as I was) as not to respect their creators and read what they have done.

---

(1) the notification from AWS is for storytelling purpose only. They have no such thing. I wish they had! Somebody should tell 'em we want it!
