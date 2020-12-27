---
title: Test automation with Make and Docker
date: "2019-05-22T08:47:37.121Z"
template: "post"
draft: true
slug: "/2019/test-automation-with-make-and-docker"
category: "Blog"
tags:
  - "docker"
  - "make"
  - "test"
  - "tdd"
  - "testing"
  - "qa"
  - "test automation"
  - "automation"
description: "Running integration tests that involve a statfull App is not easy. Make and Docker come to rescue with a simple yet efficient setup that involves just 2 files."
image: "docker.png"
---

![test automation](/media/printing-press.jpg)

[Make](https://www.gnu.org/software/make/manual/make.html) is a wonderful command that comes shipped with most of
the current Linux distributions, as well with OSX.

You just have to type `make` in your terminal and **it just works**.

## Make task runner:

_Make_ is a task runner and will execute _bash commands_ detailed into a `Makefile`:

```Makefile
start-db:
    docker run \
        -d \
        --rm \
        --name my-test-db \
        -p 5432:5432 \
        -e POSTGRES_USER=postgres \
        -e POSTGRES_PASSWORD=postgres \
        -e POSTGRES_DB=postgres \
        postgres:11.3-alpine \
        -c shared_buffers=500MB \
        -c fsync=off

stop-db:
    docker stop my-test-db

start-api:
    (cd /my-project && docker-compose up -d)

stop-api:
    (cd /my-project && docker-compose down)

run-tests:
    jest .

# Run multiple chained tasks
test: start-db start-api run-tests stop-api stop-db
```

The file structure is rather simple, it defines **tasks** that you can run as:

```bash
make task-name
```

From the example we just saw you can run:

```bash
make start-db
make stop-db
...
```

The `test` task is the interesting one because it defines some dependencies that
are resolved before to run the actualy task (which does nothing).

In this example you can run `make test` to kick a complete stateless test session where
the database and the API service is booted and terminated during the test.

Of course you need to **take care of soft dependencies yourself**. Your API might need
to implement some kind of mechanism so to wait until the db is up and running. Your
tests may need to do the same.

## Test automation with Docker Compose

[[ to be completed ]]

I want to create a `docker-compose.test.yml` where to describe:

- db container (daemon)
- api container (daemon)
- test container (one shot then exit)

at this point the test will be

```Makefile
start-db:
    docker-compose up -d database

stop-db:
    docker stop database
    docker rm -f database

start-api:
    docker-compose up -d api

stop-api:
    docker stop api
    docker rm -f api

run-tests:
    docker-compose up tests

# Run multiple chained tasks
test: start-db start-api run-tests stop-api stop-db
```

and all the test will be running in a completely isolated system.
