---
title: "Event Sourcing in Postgres"
date: "2021-03-27T06:46:37.121Z"
template: "post"
draft: false
slug: "/2021/event-sourcing-in-postgres"
category: "Blog"
tags:
  - "javascript"
  - "function"
  - "const"
  - "array"
description: "How to build an Event Sourcing system using one of the best data-store tools available to humankind: Postgres!"
image: "postgres.png"
---

Big companies benefit from products like [RabbitMQ][rabbitmq], [Kafka][kafka], or [Elastic Search][elastic-search], **and have the matching economy** to pay for the required resources, mostly clusters of virtual machines.

All the other companies would benefit from the same patterns, **but don't have enough scale to make it efficient**. 

👉 _Money is always a scarce resource_ 👈

> Running a cluster of 3 servers just to store a few million messages in a RabbitMQ queue or Kafka topic is simply too expensive.

A [relational database][relational-database] such [PostgreSQL][postgresql] it is still among **the cheapest options to store large amount of data** in a persistent and reliable way. 

In this series of articles, we're going to **discover a data model** that let us store and consume events in a reliable way, offering the possibility for **concurrent producers/consumers** to work together without race-condition each other.

👉 The entire source code, complete with tests and performance analysis is available at: https://github.com/marcopeg/postgres-event-sourcing.

- [How to store Events in PostgreSQL](/2021/event-sourcing-in-postgres-events)
- [How to retain the cursor memory by Client ID](/2021/event-sourcing-in-postgres-clients)

[rabbitmq]: https://www.rabbitmq.com/
[kafka]: https://kafka.apache.org/
[elastic-search]: https://www.elastic.co/elastic-stack
[postgresql]: https://www.postgresql.org/
[relational-database]: https://en.wikipedia.org/wiki/Relational_database