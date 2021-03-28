---
title: "Event Sourcing in Postgres: The Client"
subtitle: "foobar"
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

In this article we'll work on top of the [events schema](/2021/event-sourcing-in-postgres-events) 
in order to store each consumer's reading cursor.

The goal is **to make it easier for consumers to process our event stream**: instead of being in
charge of their reading cursor, a consumer will simply have to remember its own name, and
the data-model will do the rest.

Here is the query that we want to **consistently run** to process our entire `events` table:

```sql
SELECT * FROM "fq"."events"
WHERE "offset" > (
  SELECT
    CASE count(*)
      WHEN 0 THEN -1 
      ELSE MAX("offset") 
    END 
    AS "offset"
  FROM fq.clients 
  WHERE id = 'CLIENT_ID'
  LIMIT 1
)
ORDER BY "offset" ASC
LIMIT 1;
```

The relevant information that we provide is the `CLIENT_ID`, a parameter that **must be unique for each _microservice_** that wants to consume the stream of events.


## The Clients Table

In order to satisfy the read query, we need a table where to store the last consume event's offset:

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

## Committing Events

Now things gets way more intersting. The query we saw in the beginning of the article will consistently return the same event based on the `offset` that is store in the `clients` table for a specific consumer.

🤔 In a real-life scenario **this is bad as it leads to duplicate job** when you try to scale up your services. Don't do it (just yet), this is still a very simple data-model and we'll get into scalability and concurrency later on.

👉 We need to introduce the concept of **committing an event**.

Once our software is done handling an event, we should simply **tell the system to move the cursor forward**. Thanks to Postgres' ability to handle exceptions, this is very easy to achieve:

```sql
INSERT INTO "fq"."clients"
("id", "offset")
VALUES
('CLIENT_ID', {LAST_CONSUMED_OFFSET})
ON CONFLICT ON CONSTRAINT "clients_pkey"
DO UPDATE SET "offset" = EXCLUDED."offset"
RETURNING *
```

One more time, we identify our consumer process with a simple string, and we provide the last consumed offset so that next time we'll run the query at the topo of the article, **we'll get the following event in the stream**.

## Moving Forward

In the [next article of the serie](/2021/event-sourcing-in-postgres-topics), we'll learn how **divide our event-stream into multiple topics**, so to be able to start working on **some real process parallelization**.

## Articles on Event Sourcing in PostgreSQL

- [Event Sourcing in PostgreSQL](/2021/event-sourcing-in-postgres)
- [How to store Events in PostgreSQL](/2021/event-sourcing-in-postgres-events)
- [How to retain the cursor memory by Client ID](/2021/event-sourcing-in-postgres-clients)


