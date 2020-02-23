---
title: Hasura in Gitpod
date: "2020-02-10T08:46:37.121Z"
template: "post"
draft: false
slug: "/2020/hasura-in-gitpod"
category: "Blog"
tags:
  - "hasura"
  - "gitpod"
  - "postgres"
  - "open source"
  - "ide"
description: "How to run Hasura in a GitPod.io workspace"
image: "hasura-in-gitpod.png"
---

![GitPod + Postgres + Hasura](./hasura-postgres-gitpod.png)

**SPOILER ALERT:** If you are in a hurry and just want to try it out,
click on the following button:

<a href="https://gitpod.io/#https://github.com/marcopeg/hasura-gitpod">
<img src="https://gitpod.io/button/open-in-gitpod.svg" alt="Open in GitPod" style="width: 200px">
</a>

<div style="text-align:center">
And then just take a look at the source code:<br>
<a href="https://github.com/marcopeg/hasura-gitpod">https://github.com/marcopeg/hasura-gitpod</a>
</div>

## Overture:

I'm falling in love with the concept of a **Cloud IDE** thanks to 
[GitPod.io](https://gitpod.io), and with **backendless** thanks to
[Hasura.io](https://hasura.io).

Obviously, I'm in deep deep love with [Postgres](https://www.postgresql.org)
since long years. It's a **great open-source database** that keeps surprinsing 
me with incredible features almost day after day.

Hasura provides a nice [30 seconds Heroku tutorial](https://docs.hasura.io/1.0/graphql/manual/getting-started/heroku-simple.html)
which get you up and running with the famous hosting company.

**But what if you want to just play with it in a fully discardable workspace?**

## Docker to Rescue!

GitPod makes it easy to **customize your workspace** using a _YAML_ 
configuration file:

```yml
# .gitpod.yml
image:
  file: .gitpod.Dockerfile
```

And a Dockerfile:

```Dockerfile
# .gitpod.Dockerfile
FROM gitpod/workspace-full:latest
```

There are also several **examples of custom images** that bring into GitPod
whatever other service you may need to build your app:  
https://github.com/gitpod-io/workspace-images

## Run Hasura!

Let's just jump to the _Dockerfile_ source code that helps you running
Hasura as part of your worspace:

```Dockerfile
FROM hasura/graphql-engine:v1.1.0 as hasura
FROM gitpod/workspace-postgres

###
# Install Hasura Engine
COPY --from=hasura /bin/graphql-engine /bin/graphql-engine

# Creates the `hasura_start` command:
ENV PATH="$PATH:$HOME/.hasura/bin"
RUN mkdir -p ~/.hasura/bin \
  && printf "#!/bin/bash\n/bin/graphql-engine serve" > ~/.hasura/bin/hasura_start \
  && chmod +x ~/.hasura/bin/*

# Ensure the basic environment variables that are needed by Hasura to start
ENV HASURA_GRAPHQL_DATABASE_URL="postgres://localhost:5432/postgres"
ENV HASURA_GRAPHQL_ENABLE_CONSOLE="true"
```

The first two lines point to some base images, the official Hasura and a
custom GitPod workspace that runs Postgres.

> That's right, with Docker you can extend multiple base images!

This technique it is called **multi stage build**, and 
[you can find more details here](https://blog.alexellis.io/mutli-stage-docker-builds/).

The interesting part comes with the `COPY` command that imports the
*hasura engine* into the worskpace's image. Now we have a Docker image that
contains **Postgres _AND_ Hasura**.

The next command creates globally available _CLI_ command that you can
use to start the Hasura Engine once into the workspace. It's a trick that I've
learned from the `gitpod/workspace-postgres` source code.

The last block sets some basic environment variables that let you run
Hasura with the default settings. You will be able to [change them in your
workspace](https://www.gitpod.io/docs/environment-variables/).

## The Power of Tasks

Just before you run your newly created worskpace, let me add a few lines
to the `.gitpod.yml` so that Hasura will start automatically:

```yml
image:
  file: .gitpod.Dockerfile

tasks:
  - name: Hasura
    command: hasura_start

ports:
  - port: 5432
    onOpen: ignore
  - port: 8080
    onOpen: open-browser
```

Once again, if you just want to play around with Hasura on GitPod, you may
want to click this button and experience it for yourself:

<a href="https://gitpod.io/#https://github.com/marcopeg/hasura-gitpod">
<img src="https://gitpod.io/button/open-in-gitpod.svg" alt="Open in GitPod" style="width: 200px">
</a>

## Persistent Postgres Data

There is a caviat though, **the offical `gitpod-postgres` workspace image looses
all the data you save in the db when you stop the workspace**. That sucks and I
have no clue why they do that.

After some research, I built my own version of that image, it basically do the
very same thing, but sets the data folder under the `/workspace` directory
at boot time. That make things work.

If you want to give it a go, just swap the following two lines:

```Dockerfile
# Find:
FROM gitpod/workspace-postgres

# Change to:
FROM marcopeg/gitpod-workspace-postgres
```

The source code for this custom workspace is [available here](https://github.com/marcopeg/docker-images/tree/master/gitpod-workspace-postgres)
and I will write a detailed article about it soon.

## A Workspace is just a Docker image!

Stating the obvious? Well, maybe. Still I believe it is interesting to point
out that you can build your own custom GitPod workspace and push it to 
DockerHub for others to enjoy.

I did exactly that, and now you can enjoy Hasura in GitPod with a single
config file:

```yml
image: marcopeg/gitpod-workspace-hasura

tasks:
  - name: Hasura
    command: hasura_start

ports:
  - port: 5432
    onOpen: ignore
  - port: 8080
    onOpen: open-browser
```

<a href="https://gitpod.io/#https://github.com/marcopeg/hasura-gitpod">
<img src="https://gitpod.io/button/open-in-gitpod.svg" alt="Open in GitPod" style="width: 200px">
</a>

Enjoy!  
Marco