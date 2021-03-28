---
title: "Event Sourcing in Postgres: The Events"
date: "2021-03-27T06:47:37.121Z"
template: "post"
draft: false
slug: "/2021/event-sourcing-in-postgres-events"
category: "Blog"
tags:
  - "postgres"
  - "event sourcing"
  - "kafka"
  - "events"
  - "logs"
  - "event driven design"
description: "How to build a basic data model for Event Sourcing in PostgreSQL, and let multiple clients consume one or more topics."
image: "postgres.png"
---

[Event Sourcing][event-sourcing] seems to be a complicated topic for most people, but 
**in fact is quite simple** and I'm sure you've used it almost every day of your life 
ever since you were a 6-7 years old kid: books.

👉 A book is the perfect Event Sourcing analogy: each page og the book is an _event_, 
it has a _page number_ that solves two problems:

1. It lets the reader start reading from where they stopeed the previous day
2. It tells which page to read first, second, and so forth

After the reader is done with page n.32, they move to page n.33. But page n.32 is 
still there, unchanged, so that another reader can go through the same book.

## Meet the Events table:

Our first data model will be based on the concept of a book.  
It just needs some content and a page number:

```sql
CREATE TABLE IF NOT EXISTS "events" (
  "offset" BIGSERIAL,
  "payload" JSONB DEFAULT '{}'
  PRIMARY KEY ("offset")
);
```

We use the `offset` to identify the event in an ordered and unique way,
and a simple `JSONB` field to store the event's data.

## How to write a new Event:

Writing events is as simple as **appending rows** into the table. 

Thanks to PostreSQL, this is already a thread-safe operation and concurrency 
will never be an issue:

```sql
INSERT INTO "events" 
("payload") VALUES
('{"name": "first event"}'),
('{"name": "second event"}')
RETURNING *
```

## How to read from the Events table:

Reading from this data model is also thread-safe and pretty basic.

Each consumer will ask one event at the time, using the last known `offset` 
to move forward into the list of available events:

```sql
SELECT * FROM "events"
WHERE "offset" > 0
ORDER BY "offset" ASC
LIMIT 1;
```

If we are at the beginning of the event stream, we simply start from the first item, 
which has `offset=0`. Later on, we'll keep running the same query using the latest
processed `offset` in order to get the following item.

When our query will stop yielding results, it means we reached the end of the "book".

## Pros / Cons

👍 This solution is extremely simple: it's just one table. 

Still, **it can easily store billions of records** and still run efficiently as we will 
always and only append data to it, and  query based on the primary index.

👎 With this simple data-model, each consumer must store the last consumed message.

This design choice makes it difficult to build software as each consumer must store that 
information somewhere, and coordinate it between multiple instances in case of horizontal 
scaling of the consumer itself.

## Moving Forward

In the [next article of the serie](/2021/event-sourcing-in-postgres-clients), we'll learn how to overcome this limitation and store the information in PostgreSQL itself.

## Articles on Event Sourcing in PostgreSQL

- [Event Sourcing in PostgreSQL](/2021/event-sourcing-in-postgres)
- [How to store Events in PostgreSQL](/2021/event-sourcing-in-postgres-events)
- [How to retain the cursor memory by Client ID](/2021/event-sourcing-in-postgres-clients)

[event-sourcing]: https://www.eventstore.com/blog/what-is-event-sourcing