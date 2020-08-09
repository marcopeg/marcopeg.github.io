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

Runs a Fastify instance within your ForrestJS App

- 👉 [Install it from NPM](https://www.npmjs.com/package/@forrestjs/service-fastify)
- 👉 [Open the Documentation](https://github.com/forrestjs/forrestjs/blob/master/packages/service-fastify/README.md#readme)
- 👉 [**Open the CodeSandbox example**](https://codesandbox.io/s/service-fastify-th8dq)

## Fastify Static

Wrapper around [fastify-static](https://www.npmjs.com/package/fastify-static) plugin.

- 👉 [Install it from NPM](https://www.npmjs.com/package/@forrestjs/service-fastify-static)
- 👉 [Open the Documentation](https://github.com/forrestjs/forrestjs/blob/master/packages/service-fastify-static/README.md#readme)
- 👉 [**Open the CodeSandbox example**](https://codesandbox.io/s/service-fastify-static-6u8mm)

## Fastify Healthz

Provides a healthcheck route that you can configure via simple hooks.

- 👉 [Install it from NPM](https://www.npmjs.com/package/@forrestjs/service-fastify-healthz)
- 👉 [Open the Documentation](https://github.com/forrestjs/forrestjs/blob/master/packages/service-fastify-healthz/README.md#readme)
- 👉 [**Open the CodeSandbox example**](https://codesandbox.io/s/service-fastify-healthz-4g3my)

## Fastify JWT

Wrapper around [fastify-jwt](https://github.com/fastify/fastify-jwt) plugin.

- 👉 [Install it from NPM](https://www.npmjs.com/package/@forrestjs/service-fastify-jwt)
- 👉 [Open the Documentation](https://github.com/forrestjs/forrestjs/blob/master/packages/service-fastify-jwt/README.md#readme)
- 👉 [**Open the CodeSandbox example**](https://codesandbox.io/s/service-fastify-jwt-fnfqc)

## Fastify Cookie

Wrapper around [fastify-cookie](https://github.com/fastify/fastify-cookie) plugin.

- 👉 [Install it from NPM](https://www.npmjs.com/package/@forrestjs/service-fastify-cookie)
- 👉 [Open the Documentation](https://github.com/forrestjs/forrestjs/blob/master/packages/service-fastify-cookie/README.md#readme)
- 👉 [**Open the CodeSandbox example**](https://codesandbox.io/s/service-fastify-cookie-pq2m0)

## Fastify GQL

Sets up an [Apollo Graphql Server](https://www.apollographql.com/docs/apollo-server/) 
in the ForrestJS app and provides hooks to extend the schema from a feature.

- 👉 [Install it from NPM](https://www.npmjs.com/package/@forrestjs/service-fastify-gql)
- 👉 [Open the Documentation](https://github.com/forrestjs/forrestjs/blob/master/packages/service-fastify-gql/README.md#readme)
- 👉 [**Open the CodeSandbox example**](https://codesandbox.io/s/service-fastify-gql-3ijs6)

**NOTE:** At the time of writing an issue prevents the `apollo-server-fastify` plugin
from rendering the playground. (https://github.com/apollographql/apollo-server/issues/4463)

## Fastify Apollo

Sets up an Apollo Client in the ForrestJS app and makes it available to route handlers.

- 👉 [Install it from NPM](https://www.npmjs.com/package/@forrestjs/service-fastify-apollo)
- 👉 [Open the Documentation](https://github.com/forrestjs/forrestjs/blob/master/packages/service-fastify-apollo/README.md#readme)
- 👉 [**Open the CodeSandbox example**](https://codesandbox.io/s/service-fastify-apollo-80oug)

## Fastify Fetchq

Sets up an Fetchq Client in the ForrestJS app and makes it available to route handlers.

- 👉 [Install it from NPM](https://www.npmjs.com/package/@forrestjs/service-fastify-fetchq)
- 👉 [Open the Documentation](https://github.com/forrestjs/forrestjs/blob/master/packages/service-fastify-fetchq/README.md#readme)
- 👉 [**Open the CodeSandbox example**](https://codesandbox.io/s/service-fastify-fetchq-0by8x)


