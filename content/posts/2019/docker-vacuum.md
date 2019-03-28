---
title: Docker Vacuum
date: "2019-03-27T20:12:37.121Z"
template: "post"
draft: false
slug: "/2019/docker-vacuum"
category: "Blog"
tags:
  - "docker"
  - "images"
  - "cleanup"
  - "deployment"
  - "devop"
  - "automation"
description: "Do you need a smart tool to cleanup Docker images after a new deployment? Maybe DOCKER SYSTEM PRUNE is not always enough? Read on!"
image: "docker.png"
---

[Docker Vacuum](https://hub.docker.com/r/marcopeg/docker-vacuum) is a small devop 
utility that runs on your production server as a container and 
**keeps disk usage under control**.

Vacuum prunes the system every now and then (10 minutes by default) and applies
your custom rules so to remove unused images with date based retention.

> You are right, there is `docker system prune --volumes --force [--all]`!

But guess what? It wasn't quite enough for me because I want to 
**keep the last _N_ images on my server so I can quickly revert** 
in case shit hits the fan. Plus I don't want to risk deleting resources that are
needed by paused containers.

## Try it Out!

On your local machine:

    docker run -v /var/run/docker.sock:/var/run/docker.sock docker-vacuum

Or run it as a background service in your production server:

    docker run -d \
        -e VACUUM_INTERVAL=600000 \
        -e VACUUM_RULES="[{\"match\":\"(.*)\",\"retain\":2}]" \
        -v /var/run/docker.sock:/var/run/docker.sock \
        docker-vacuum:latest

The two enviroment variables are optional, and the example above
shows their default values.

**The volume is very important.** Docker Vacuum needs to run some Docker commands on your
behalf on the host machine. Without a direct access to the Docker socker it won't work.

## Configuration:

The `VACUUM_INTERVAL` setting defines how often the cleanup will take place. By default it will run
every 10 minutes.

The `VACUUM_RULES` is a _JSON_ stringified object that contains patternes and retention
rules:

    [
        {
            match: 'marcopeg/(.*),
            retain: 2
        },
        {
            match: 'hello-world',
            retain: 0
        }
    ]

This set of rules mean:

1. keep the 2 most recent version for any images whose name starts with "marcopeg/"
2. delete any image whose name is "hello-world"

Docker Vacuum also honors the classic `LOG_LEVEL` setting with values as:
`error, info, verbose, debug`. Most people would run their tests with `verbose`.

## Who Needs Docker Vacuum?

#### CapRover users

I'm using [CapRover](https://caprover.com/) to manage some small servers.

Although it does a wonderful job in running apps and basic deployment automation,
it lacks the ability to cleanup after himself.

> So if you deploy a lot on CapRover,
> be perpared to see your disk usage grow fast.

I run DockerVacuum as a CapRover app and that enables a fine grained control of how
to cleanup my system and still be able to quikly revert a deployment.

#### DockerCompose users

On other instances I use `docker-compose` to run my projects.

In that scenario I have a Git repository set up and my deployment script looks like this:

    git pull
    docker-compose build
    docker-compose up -d

Which is enough to create fresh images out of new code and rotate the containers. 
The problem here is that building and building will generate a lot of dangling 
and outdated images. Again, disck space might be a problem.

**If you had just one project on my server** you could safely run:

    docker system prune --all --volumes --force

And Docker will magically remove any resource that is not linked with any running
containers. Simple and cool.

But if you do run multiple projects and you are not sure they are all running at a given
point in time, the above command **may end up deleting critical stuff**. Not so cool.

Docker Vacuum helps because it prunes the system from dangling resources and also deletes
images based on your custom rules.

## Feedback is Appreciated

Thank you for reading this far!  
I appreciate it.

A good way to show you liked it is to **give me a thumb up, a clap or a comment**.

I'm not a social media freak, but I still feel better when I see a warm
human reaction to what I share :-)
