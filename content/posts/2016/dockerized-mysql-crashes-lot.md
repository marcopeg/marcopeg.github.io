---
title: Dockerized MySQL Crashes a Lot!
date: "2016-11-14T06:21:37.121Z"
template: "post"
draft: false
slug: "/2016/dockerized-mysql-crashes-lot"
category: "Blog"
tags:
  - "docker"
  - "mysql"
  - "memory"
  - "optimization"
  - "trick"
  - "crash"

description: Have you ever experienced a dockerized MySQL to stuck in low memory VPS? I did and luckily I found a solution! (yes, I googled it)"

image: "mysql_docker.png"
---

This blog is being hosted on a [5$/mo DigitalOcean droplet](https://m.do.co/c/0a72735ae62e) and it is served as [Docker Humble](https://github.com/marcopeg/humble-cli) project. **Docker gave me pure freedom in my technology stack** for a reasonable 60$/year price. I like it, a lot.

What I don't like is the **tendency to crash** that seems to be idiosyncratic to my setup. It's been going on since a couple of days: every works fine for a while, and then MySQL kinda crashes giving me a mysterious message:

![mysql-error](./media/mysql-error.png)

So I wore my _debugging hat_ and I started investigating the issue. In this article I'm going to place a link to the solution I found.

Please consider my background:

- I'm 35. I'm old and my brain is not fast as yours
- I'm a front-end developer. I use terminal because I have to, given a choice I wouldn't
- I don't know s**t about server setup and management. To me is a miracle when things work
- I love Docker because simplifies my life but I feel I am a total beginner with it
- I work on a tiny budget
- I work on a tiny budget

## Give me the Solution, NOW!

[Click here, this is the solution](http://atqu.in/blog/2015/11/11/optimising-wordpress-and-mysql-docker-images-for-amazon-ec2-micro-instances/)

<small>(I plan to send flowers to that guy, it really made the whole thing simple to me)</small>

## How'd you get there?

Glad you asked, please take a seat and enjoy your flight!

## I'm working on a tiny budget, but I aim for the stars!

In order to do my best in my current role I decided to learn something about Wordpress. I despised it for long years but not it looks like I can't get rid of it, so I've embraced it.

Anyway I really hate the idea to spend money on MAMP Pro like I used to do in the past, today we have [Docker](http://docker.com) and everything should be fast and easy thanks to tools like [Docker Compose](https://docs.docker.com/compose/) and [Docker Humble](https://github.com/marcopeg/humble-cli).

I know I know, everybody says you shouldn't use [Docker](http://docker.com) to manage state-full services like databases. I agree on that as **best practice for big projects** with a huge data load. 

But here I'm running my small small blog, and the only thing I care about is **to make it simple for me to manage**. Therefore I run MySQL as part of my [Docker Compose](https://docs.docker.com/compose/) stack, straight into my production server.

> Everything works fine on a [5$/mo DigitalOcean droplet](https://m.do.co/c/0a72735ae62e), but for the fact that **every now and then MySQL crashes** and I can't figure out why!!!

1. I'm not used to server management  
   <small>(I was just a humble front-end developer until yesterday)</small>
2. I am absolutely no familiar with process debugging

**My wild guess is that is a memory problem:**

1. Just after I restart the project everything works just fine
2. It holds for 24-48 hours (give or take)
3. The container doesn't crash (I guess MySQL process doesn't crash either)
4. Wordpress just can't connect to the database anymore
5. Other websites (waaay bigger than mine) that run on bigger servers don't have this problem

**Actions I plan to take:**

1. Monitor my homepage to detect when it's down
2. Figure out how to access MySQL logs
3. Restart MySQL service every night if this helps to mitigate the problem

**It's a Humble Setup:**

First things first: [I'm running a Dockerized Wordpress application on a 512Mb DigitalOcean Droplet that I'm paying just 5$/mo](https://m.do.co/c/0a72735ae62e). This is most probably too small to efficiently run the full setup and many friends told me just to move on to a bigger (aka: more expensive) setup.

* I'm stubborn and I don't want to spend more money!
* I would like to find a solution and keep it running on my current setup.

## Round1: Monitoring

The idea is to start to **track down how often the problem manifest and to look for a pattern**, at the same time I want to export MySQL logs so next time it'll go down I will be able to understand why, hopefully.

Wordpress' ugly `Error establishing a database connection` gives us an `HTTP 505` so **I guess I can use some free online resources to monitor it**:

![mysql-error](./media/mysql-error.png)

I ran a quick search for [free online monitoring services](https://www.google.se/search?q=free+online+monitoring+services&oq=free+online+monitoring+services&aqs=chrome..69i57j0l4.303j0j7&sourceid=chrome&ie=UTF-8) and I gave a go to [UptimeRobot](http://uptimerobot.com). It looks easy and it gives me 50 watchers that run every 5 minutes **for free**.

_I expect to be notified as soon my blog goes down!_

## Round2: Logging

This is quite silly, but after some googling I realised `docker-compose logs mysql` is all you need to access MySQL logs.

_I couldn't find any useful logs anyway._

## Round3: MySQL Memory Consumption

I decided to **follow up with the _running out of memory_ lead** and it turned out it was the right direction to go.

You can use a combination of `docker-compose ps`, `docker-ps` and `docker stats` to get the CPU, memory, net and disk i/o of your containers:

![mysql-docker-stats](./media/mysql-docker-stats.png)

I didn't like what I saw.  
**MySQL allocated 200Mb of RAM just after booting up**.

And we are talking of a blog with 10 small articles and no traffic at all. It's just a dummy project!

> Whaaaaat?  
> is Docker that bad?  
> or is MySQL thaaaaat bad?  
> 
> **no, that is NOT the case!**
> <small>It's just you being cheap on your server!</small>

Again, I'm running on the [smallest DigitalOcean droplets](https://m.do.co/c/0a72735ae62e).  
**It's just 512Mb RAM for the entire virtual machine!**

I am so used to almost unlimited resources on my MacBookPro that I tend to not take into account what 512Mb are: **they ain't much!**

The next obvious step is to figure out how to optimise my services to either **consume less memory or reboot automatically** over a critical threshold.

## Round4: Memory Optimisation

My first attempt to optimise my setup was by **shrinking down MySQL's Ram footprint**. After some googling I traced down a couple of contradicting tutorials that claim to achieve the best possible memory footprint ever. Of course it was just a tiny bit more complicated than that, plus I don't know s**t about MySQL configuration.

I ended up building my own custom configuration file `my.cnf`:

```
[mysqld]
performance_schema=off

innodb_buffer_pool_size=5M
innodb_log_buffer_size=256K
query_cache_size=0
max_connections=10
key_buffer_size=8
thread_cache_size=0
host_cache_size=0
innodb_ft_cache_size=1600000
innodb_ft_total_cache_size=32000000

thread_stack=131072
sort_buffer_size=32K
read_buffer_size=8200
read_rnd_buffer_size=8200
max_heap_table_size=16K
tmp_table_size=1K
bulk_insert_buffer_size=0
join_buffer_size=128
net_buffer_length=1K
innodb_sort_buffer_size=64K

binlog_cache_size=4K
binlog_stmt_cache_size=4K
```

I don't understand much of it.  
However the first setting alone reduces the memory impact from ~200Mb to ~50Mb.

A second step was to **limit container's memory** in my `docker-compose.yml`:

```
version: '2'
services:
  mysql:
    volumes:
      - ./services/mysql/my.cnf:/etc/mysql/my.cnf
    mem_limit: 50m
    restart: always

    wordpress:
      mem_limit: 150m
      restart: always
```

That seemed to get the job done on my working machine,  
**so I promptly pushed to production**.

### Here are some personal observations:

I noticed that forcing ludicrously low memory limit Docker induces heavy I/O on the disk. The way I understand it is that **Docker forces the process to swap memory to the permanent storage instead of crashing the container** approaching memory limit. I'm not sure I have a good understanding of that and I plan to investigate more.

> An interesting fact is that this behaviour causes almost no problems on my development machine, but **it kills my containers on my DigitalOcean droplet**.

At the moment of writing I'm giving 50Mb to MySQL and 150Mb to Apache and it looks like it's behaving quite good.

If this turns out to be a reliable setup I might be able to run 2 Wordpress projects inside a [5$/mo droplet](https://m.do.co/c/0a72735ae62e). That means 30$/year dedicated hosting, which is absolutely not bad compared to a shared hosting. 

I can still add whatever library I may want and weird language or service to my setup. **That's pure freedom for a ridiculous amount of money**.

## Round5: PHP-FPM

If you take a closer look at [Docker Wordpress](https://hub.docker.com/_/wordpress/) you notice they have an _Apache_ and _FPM_ version.

_What is _FPM_ anyway?_  
I didn't know and I didn't care. **I just thought it may be lighter** than _Apache_ so I tried it.

And I failed!

_Wordpress-FPM_ is not a drop in replacement for the Apache version. It requires some love and an _NGiNX_ proxy to work. [Fortunately some good guy did it already](https://hub.docker.com/r/bcardiff/nginx-4-wordpress-fpm/).

For what I could see **_Wordpress-FPM_ is actually lighter** that the _Apache_ version but the setup hassle makes it not worth to me. I'm giving 5 minutes to each possible solution as this is just a personal project!

_Remember? I'm running on a tiny tiny budget!_

## Round6: Wordpress Image Optimisation

Next step involves another round of Googling. Now that MySQL memory is under control I would like to do achieve the same with Apache/Wordpress. 

My query was straightforward and I regret not to have searched for it earlier as it produced the complete solution as first result: **[optimise docker wordpress memory](https://www.google.se/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=optimise%20docker%20wordpress%20memory)**

![mysql-answer](./media/mysql-answer.png)

> From now on is pure theory, 
> but thank you for reading!

