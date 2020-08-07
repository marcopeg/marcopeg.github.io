---
title: ForrestJS & Fastify Examples
date: "2020-08-07T06:46:37.121Z"
template: "post"
draft: false
slug: "/2020/forrestjs-fastify"
category: "Blog"
tags:
  - "forrestjs"
  - "fastify"
  - "examples"
  - "node"
description: "Learn by examples how easy is to build a Fastify based Web Service with ForrestJS and its feature composability."
image: "fastify.png"
---

Lately I fell in love with [Fastify](https://www.fastify.io/) because it offers a straightforward way to compose a
web application through plugins encouraging [_functional composition_](https://joecortopassi.com/articles/functional-composition-in-javascript/)
at feature level.

[ForrestJS](https://forrestjs.github.io/) takes this concept to the next level by offering an interface that _services_ and _features_ 
can use to interoperate without being tightly coupled. It also pushes hard for 
[Single Responsibility Principle](https://en.wikipedia.org/wiki/Single-responsibility_principle) and 
[Open Closed Principle](https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle).

Today I'd like to share with you a few **running examples** of the services that you can use to compose your webapp.

## Fastify

https://codesandbox.io/s/service-fastify-th8dq

## Fastify Static

https://codesandbox.io/s/service-fastify-static-6u8mm

## Fastify Healthz

https://codesandbox.io/s/service-fastify-healthz-4g3my

## Fastify JWT

https://codesandbox.io/s/service-fastify-jwt-fnfqc

## Fastify Cookie

https://codesandbox.io/s/service-fastify-cookie-pq2m0

## Fastify Apollo

https://codesandbox.io/s/service-fastify-apollo-80oug

## Fastify Fetchq

https://codesandbox.io/s/service-fastify-fetchq-0by8x


