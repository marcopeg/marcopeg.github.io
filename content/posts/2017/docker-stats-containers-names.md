---
title: Docker Stats with Containers Names
date: "2017-02-09T06:21:37.121Z"
template: "post"
draft: false
slug: "/2017/docker-stats-containers-names"
category: "Blog"
tags:
  - "containers"
  - "docker"
  - "monitor"
  - "stats"
  - "performances"
  - "tricks"
description: "There is a way to get container's names out of `docker stats`, and Docker Humble makes it ridicolously easy for you."
image: "docker.png"
---

When running plenty of containers you may wonder which one is killing your server memory or CPU.   
Then your first step would be to run:

```
docker stats
```

That is the basic first step to know what's going on... too bad it shows only container's IDs which - if you ask me - is not very useful.

![docker-stats](./media/docker-stats.png)

Today I resolved to see container's names so I googled my problem only to find out that you can actually configure which format you want `docker stats` to speak the results:

```
docker stats $(docker ps --format={{.Names}})
```

_Now we are getting somewhere!_ I thought. 

![humble-do-stats](./media/humble-do-stats.png)

One second later I realised I will never remember it so I added it as utility to my Docker helper project [Humble](https://github.com/marcopeg/humble-cli):

```
humble do stats
```

(If you are currently using **Docker Humble** please remember to update it: `humble update-cli`)