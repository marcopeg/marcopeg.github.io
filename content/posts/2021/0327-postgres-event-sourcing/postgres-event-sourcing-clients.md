---
title: "Event Sourcing in Postgres: The Client"
date: "2021-03-27T06:48:37.121Z"
template: "post"
draft: false
slug: "/2021/event-sourcing-in-postgres-clients"
category: "Blog"
tags:
  - "postgres"
  - "event sourcing"
  - "kafka"
  - "events"
  - "logs"
  - "event driven design"
  - "clients"
description: "How to store different client's reading cursor in PostgreSQL, so to facilitate consuming an event stream by different consumers."
image: "postgres.png"
---

In this article we'll work on top of the [events schema](./postgres-event-sourcing-events.md) 
in order to store each consumer's reading cursor.

The goal is **to make it easier for consumers to process our event stream**: instead of being in
charge of their reading cursor, a consumer will simply have to remember its own name, and
the data-model will do the rest.

## The Clients Table

We need a place where to store the last processed offset for each consumer:

```sql
CREATE TABLE IF NOT EXISTS "fq"."clients" (
  "id" VARCHAR(10),
  "offset" BIGINT DEFAULT -1,
  PRIMARY KEY ("id")
);
```

## Writing Events

Writing events in our new data model works exactly as it did before:

```sql
INSERT INTO "events" 
("payload") VALUES
('{"name": "first event"}'),
('{"name": "second event"}')
RETURNING *
```

## Consuming Events

Now things gets way more intersting. As stated in the beginnin of the article, we want
each consumer to simply remember its own name (which should be universally unique and static).



