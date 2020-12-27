---
title: How to run Postgres for testing in Docker
date: "2019-05-22T08:46:37.121Z"
template: "post"
draft: false
slug: "/2019/how-to-run-postgres-for-testing-in-docker"
category: "Blog"
tags:
  - "docker"
  - "postgres"
  - "test"
  - "tdd"
  - "integration"
  - "testing"
  - "qa"
  - "test automation"
  - "container"
  - "service"
description: "Running E2E integration tests often require your Postgres to be up and running, here are few tricks and suggestions how to do just that."
image: "postgres.png"
---

I write most of my software in NodeJS so I write most of my tests in [Jest](https://jestjs.io/).

I find Jest quite nice for both **unit tests** and **integration tests** because it allows to run asynchronous
instructions and that makes it a breeze to **test agains a running API**.

But a running API requires at least a NodeJS app to be running, and probably some kind of database as well.

## Dockerized Postgres for Testing

My db of choice is [Postgres](https://www.postgresql.org/) and I run it with [Docker](https://hub.docker.com/_/postgres):

```bash
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
```

Here the tricks are two: `shared_buffers=500MB` and `fsync=off`, plus I take care of not mapping any volume
to my local _file system_ so to avoid syncing slowdowns and also to make sure that
**at each run the state is being reset** (`--rm`).

### shared_buffers

This setting affects how much RAM Postgres will use before it begins to hit the disk.
In the [documentation](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-SHARED-BUFFERS) they suggest
you set about 25% of the available RAM.

As we are running a volatile DB that is meant to be trashed after each use,
**the higher this value the better it will perform during the tests** because of less disk I/O.

### fsync=off

This option will deactivate the _memory > file system_ syncing. It sensibly speeds up Postgres but you will loose
any data that are still stored in _RAM_ in case of crashes.

While this is an awfully terrible idea in a production setup, **it's ideal for testing** as we will trash any state
at the end of the test session anyway!

