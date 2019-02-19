---
title: Docker Compose Healthcheck
date: "2019-19-03T23:46:37.121Z"
template: "post"
draft: false
slug: "/2019/docker-compose-healthcheck"
category: "Blog"
tags:
  - "docker"
  - "compose"
  - "database"
  - "healthcheck"
  - "mysql"
  - "postgres"
description: "Running containers that depends on other containers (es. dbs) can be tricky. Let's explore the \"depends_on\" directive associated with a healthcheck."
image: "docker-compose.jpg"
---

I used to write a `docker-compose.yml` like this:

    version: '2.1'
    services:
        postgres-db:
            image: postgres

        my-service:
            image: node
            link:
                - postgres-db

No much going on here. I have a [Postgres](https://www.postgresql.org/) db and some
kind of [NodeJS](https://nodejs.org/en/) app that will use it.

When this start with a `docker-compose up` it's likely that the App boots much
faster than the Database, for the db must first initialize it's data structure.

Unless we take care of that in my App's logic, our App will first crash and 
**we would need to restart it after the Database goes online**.

There are a bounch of possible ways to address this problem.  
Here are 3.

## The Dumb Way

You could simply **restart the app multiple time until it works**:

    docker-compose up -d
    ... wait a little ...
    docker-compose up -d

Believe it or not, I've seend people doing this a lot. I've been working with projects
where this was the suggested way to go. True story.

## The Developer's Way

On some project I use to **take care of this problem at NodeJS level**.

My booting script tries to connect to the dbs and if it fails, it wait a little and then
try again. This loop goes on a couple of (configurable) times before the service gives
up and crash himself.

Although this is not so complicated and will work with any possible deployment setup, it
is still some more code and some more responsability that we must take into account.

> A decent rule of the thumb is to try not to do stuff...  
> until is absolutely necessary.

## The Docker Compose's Way

A simple way to solve the problem is to use the built-in healthchecks available in
`docker-compose 2.1`.

We can basically tell a service to wait until another service (or multiple services)
have completed a healthcheck.

Here is a `docker-compose.yml` with basic healthchecks set up for both Postgres
and MySQL:

    version: '2.1'
    services:
        mysql-db:
            image: mysql
            healthcheck:
                test: [ "CMD", "mysqladmin" ,"ping", "-h", "localhost" ]
                timeout: 45s
                interval: 10s
                retries: 10

        postgres-db:
            image: postgres
            healthcheck:
                test: [ "CMD", "pg_isready", "-q", "-d", "${DB_NAME}", "-U", "${DB_USER}" ]
                timeout: 45s
                interval: 10s
                retries: 10

        my-service:
            image: node
            depends_on:
                mysql-db:
                    condition: service_healthy
                postgres-db:
                    condition: service_healthy

**NOTE 1:** This solution is compatible with `docker-compose 2.1`. It might be a limitation if
your project uses a different file definition.

**NOTE 2:** This solution heavily rely on deploying the project as a Docker Compose stack. If
you run it in other ways, you might still fall into the scenario where Node starts before the
Database.

If you plan to deploy you project without Docker, the Developer's solution might be
best for you.

---

* What did you like about this solutions?
* Any other ideas?

Please go ahead and enjoy commenting on this topic!
