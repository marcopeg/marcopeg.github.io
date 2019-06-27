---
title: Simple Auth in GraphQL
date: "2019-06-25T08:47:37.121Z"
template: "post"
draft: false
slug: "/2019/simple-auth-in-graphql"
category: "Blog"
tags:
  - "forrestjs"
  - "tutorial"
  - "hooks"
  - "node"
  - "nodejs"
  - "graphql"
  - "query"
  - "auth"
  - "authorization"
  - "authorization"
description: "How to add an Authentication layer for your GraphQL API - At the end of this article you are able to authenticate GraphQL requests and protect your sensible queries."
image: "graphql-icon.png"
---

The official [GraphQL documentation](https://graphql.org/learn/authorization/) suggest to put the
authentication & authorization logic in the **business layer** of your application, leaving the
GraphQL completely unaware of it.

While I agree to do not bloat the GraphQL layer with complex code, and totally vouch the idea of having
a **single source of truth** in the _business layer_, I think we can meet half way and add some basic
mechanisms that will help to **protect our sensible queries and mutations** in a very simple fashion.

Imagine you could write something like this:

```gql
query {
    getGeneralInfo { temperature wind }
    ...

    auth {
        getPersonalInfo { name surname }
        ...
    }
}
```

The idea is that any query that we place inside the `auth` wrapper will be guarded by some
authentication & authorization logic. If the user doesn't have the right to access `auth`,
then none of the sub-queries will be ever executed.

> I like to consider this approace a "High Order Components" applied to GraphQL.

🤘Let's get started already!

## PART 1 - The Codebase

We are going to build over the codebase from the [GraphQL Made Easy](https://marcopeg.com/2019/graphql-made-easy) tutorial.
You can [download it from here](https://forrestjs.github.io/downloads/hooks-graphql.zip).

We are also going to build a brand new **ForrestJS Feature** which is simply a folder that wraps all the source
files that are involved in providing this specific piece of building logic.

> 📌 Features use [ForrestJS Hooks](https://marcopeg.com/2019/modular-node-apps-with-hooks) to interact
> with each other and with the rest of the application.

I believe you are going to like the cleanliness of this approach 😎. So let's scaffold the basic files
that we are going to use:

```bash
mkdir ./grahpql-auth

# Feature's Entry Point
touch ./grahpql-auth/index.js

# Feature's Hooks Manifest
touch ./grahpql-auth/hooks.js
```

The **feature's manifest** has the responsibility to export all the hooks that can be extended by
other features. It looks like the React Redux's action names definition.

Copy this into `./grahpql-auth/hooks.js`:

```js
const { FEATURE } = require('@forrestjs/hooks')
exports.FEATURE_NAME = `${FEATURE} graphql-auth`
```

The **feature's entry point** has the responsibility to to integrate
with the rest of the application and extending it's capabilities.

Copy this into `./graphql-auth/index.js`:

```js
const { EXPRESS_GRAPHQL } = require('@forrestjs/service-express-graphql')
const { FEATURE_NAME } = require('./hooks')

const extendsGraphQLSchema = () => {
    console.log('we will extend the GraphQL schema')
}

exports.register = ({ registerAction }) => {
    registerAction({
        hook: EXPRESS_GRAPHQL,
        name: FEATURE_NAME,
        handler: extendsGraphQLSchema,
}
```

At last we can open our App's entry point (`index.js`) and **register the new feature**:

```js
...
runHookApp([
    ...
    require('./graphql-auth'),
])
```

If everything works fine, you should see the `console.log` at boot time, but wouldn't it be
better if we had a way to **visualize how hooks interact with each other**?

Of course, the answer is _yes_!

## 🔔 bonus - How to add a Boot Trace

As we are working with the main entry point I suggest we register a small Hooks utility that
will help visualizing what is going on in our app at boot time:

```js
const { FINISH, logBoot } = require('@forrestjs/hooks')
registerAction([ FINISH, () => logBoot() ])
```

After your App restarts, you should be able to see the **hooks integration trace**, basically
the logical tree of "what hooks into what":

![boot trace](./media/graphql-auth-boot-trace.png)

You can read the row in the red box as:

> "graphql-auth" hooks into "express/graphql"



## GraphQL Wrapper, what is it?

We work now in `./graphql-auth/index.js` and play around with `extendsGraphQLSchema()` so to
crate the `auth` wrapper as we have imagined it before:

```js
const { GraphQLObjectType, GraphQLString } = require('graphql')

// Demo sub-query that provides some confidential informations:
const getPersonalInfo = {
    type: new GraphQLObjectType({
        name: 'PersonalInfo',
        fields: {
            name: { type: GraphQLString },
            surname: { type: GraphQLString },
        },
    }),
    resolve: () => ({ name: 'Marco', surname: 'Pegoraro' })
}

// GraphQL shape of the `auth` wrapper, here we can add the
// protected sub-queries:
const AuthQuery = new GraphQLObjectType({
    name: 'AuthQuery',
    fields: { getPersonalInfo },
})

// A function that somehow defines whether the `auth` wrapper should
// be accessible or not. "null" means "no", "true" means "yes".
//
// --> This is the critical piece of logic! <--
const canAccessAuth = () => true

// Add the `auth` wrapper to the App's GraphQL schema:
const extendsGraphQLSchema = ({ queries }) => {
    queries.auth = {
        type: AuthQuery,
        resolve: canAccessAuth,
    }
}
```

In the code above we extend the App's GraphQL schema with a new `auth` query and we
populate this object with a _sub-query_ `getPersonalInfo` which **should return sensible data**
and so it should be protected.

Try to run:

```gql
query {
    auth {
        getPersonalInfo { name }
    }
}
```

You should be able to read `Marco`:

```json
{
  "data": {
    "auth": {
      "getPersonalInfo": {
        "name": "Marco"
      }
    }
  }
}
```

Try now to change the "authorization logic" so to deny access:

```js
const canAccessAuth = () => null
```

and run the query again... Nothing! The whole `auth` returns just `null`:

```json
{
  "data": {
    "auth": null
  }
}
```

> 📌 By forcing a `null` value into a nullable GraphQL query, we force GraphQL to
> **skip the resolution of any sub-query**.

And this is our **simple strategy** that regulates the access to some critical queries!

#### ✅ Strenghts:

- queries inside `auth` don't need to implement any protection logic
- `canAccessAuth` works like an _Express middleware_ which is a well known concept
- it is possible to deep-nest more wrappers that implement fine grained data-access policies

#### 🔸Limitations:

- only the access to `auth` is regulated, a more fine-grained regulation must be implemented
  query by query
- you might not like the shape of the API, but this is personal



## PART II - Make it Reusable

From now on, we will work on refining the code above and implement two important responsabilities:

1. Make this "auth wrapper" extensible so that other features can register some protected routes
2. Implement the `canAccessAuth` with some real (but still simple) protection mechanism

So in the end the GraphQL crew were right, we will implement the authentication / authorization logic
in the business layer, but **we do abstract it away from most of our codebase** thanks to a simple GraphQL wrapper.

## Create an Extensible Feature

Code reusability is a big deal of a problem, and _ForrestJS' Hooks_ aim to improve the
chances to produce some really reusable features. In order to make `graphql-auth` truly
reusable we are going to:

- split responsibilities into isolated modules
- create some exension points (hooks)

### Step n.1 - Isolate "canAccessAuth"

The function `canAccessAuth()` is the core of this feature, she has the responsibility filter
incoming requests. She really deserves our attention (and probably some testing later on!)

```bash
vi ./graphql-auth/can-access-auth.js
```

and paste:

```js
exports.canAccessAuth = () => true
```

Yes, for now we keep our dumb implementation. We are going to work on this function in the next chapter.

### Step n.2 - Isolate "extendsGraphQLSchema"

Now we can really focus on the extensibility task. The first step is to create a new hook
definition in `./graphql-auth/hooks.js` so that other features can import it:

```js
const { FEATURE } = require('@forrestjs/hooks')
exports.FEATURE_NAME = `${FEATURE} graphql-auth`
exports.GRAPHQL_AUTH = `${this.FEATURE_NAME}/queries`
```

then create the actual module:

```bash
vi ./graphql-auth/extends-graphql-schema.js
```

and paste:

```js
const { createHook } = require('@forrestjs/hooks')
const { GraphQLObjectType, GraphQLID } = require('graphql')
const { canAccessAuth } = require('./can-access-auth')
const { GRAPHQL_AUTH } = require('./hooks')

exports.extendsGraphQLSchema = ({
    queries: appQueries,
    mutations: appMutations,
}) => {
    // Collect queries and mutations that needs session validation
    const queries = {}
    const mutations = {}
    const args = {
        token: {
            type: GraphQLID,
        }
    }

    // Let other features integrate their own queries and mutations
    createHook(GRAPHQL_AUTH, {
        args: { queries, mutations, args },
    })

    // Extends the app's queries with the "auth" wrapper
    Object.keys(queries).length && (appQueries.auth = {
        args,
        type: new GraphQLObjectType({
            name: 'AuthQueryWrapper',
            fields: queries,
        }),
        resolve: canAccessAuth,
    })

    // Extends the app's mutations with the "auth" wrapper
    Object.keys(mutations).length && (appMutations.auth = {
        args,
        type: new GraphQLObjectType({
            name: 'AuthMutationWrapper',
            fields: mutations,
        }),
        resolve: canAccessAuth,
    })
}
```

The magic happens with the `createHook(GRAPHQL_AUTH, ...)` instruction. Here we pass down
**a referenceto the local queries and mutations** so that other features can inject their
own.

The thing with the `Object.keys()...` is a simple conditional statement:

GraphQL requires `GraphQLObjectType` to have at least one field. But we start with an empty set of
queries and mutations and don't know if any feature will actually register anything in them.

> So we need to skip injecting the `auth` wrapper in case there are no sub-queries available.

**NOTE:** You might have noticed that we create an **optional argument** `token` that is then
applied to both queries and mutations. Plus we let any registered extension the possibility to
extend it as they wish. This is actually a simple preparation step for the next chapter.

### Step n.3 - Refactor the Entry Point

With the modules that we wrote so far, the entry point becomes dramatically simple:

```js
const { EXPRESS_GRAPHQL } = require('@forrestjs/service-express-graphql')
const { extendsGraphQLSchema } = require('./extends-graphql-schema')
const { FEATURE_NAME } = require('./hooks')

exports.register = ({ registerAction }) =>
    registerAction({
        hook: EXPRESS_GRAPHQL,
        name: FEATURE_NAME,
        handler: extendsGraphQLSchema,
    })
```

> Mind that we will work some more on this file in order to hack into the _Express middlewares_
> when we will implement a real protection business logic.

### Step n.4 - Register the "getPersonalInfo" query

I'm sure you will like this step.

Our `graphql-auth` is now a good example of an extensible _ForrestJS feature_ and we can move the
`getPersonalInfo` fake query in the main app's folder, and just register it as a generic
App's extension as we did already for the `welcome.query.js`.

create the extension's file:

```bash
vi ./get-personal-info.query.js
```

then paste:

```js
const { GraphQLObjectType, GraphQLString } = require('graphql')
const { GRAPHQL_AUTH } = require('./graphql-auth/hooks')

const resolve = () => ({
    name: 'Marco',
    surname: 'Pegoraro',
})

const getPersonalInfo = ({ queries }) =>
    queries.getPersonalInfo = {
        type: new GraphQLObjectType({
            name: 'PersonalInfo',
            fields: {
                name: { type: GraphQLString },
                surname: { type: GraphQLString },
            },
        }),
        resolve,
    }

module.exports = [ GRAPHQL_AUTH, getPersonalInfo ]
```

And register the extension into `./index.js`:

```js
...
runHookApp([
    ...
    require('./graphql-auth'),
    require('./get-personal-info.query'),
])
```

I encourage you to play and toggle the `require('./get-personal-info.query')` instruction and
investigate the GraphQLi docs, so to notice that the whole `auth` wrapper will disappear
as soon you remove this demo extension.


## Implement the Auth Business Logic

It's finally time to play around the `canAccessAuth()` function. As we implemented it so far,
this is going to be a standard GraphQL resolver:

```js
exports.canAccessAuth = (_, args, { req }) =>
    req.authValidateToken(args) ? true : null
```

It is minimalistic and I actually mean to keep it like this.
The [SRP](https://en.wikipedia.org/wiki/Single_responsibility_principle) here is to translate
between GraphQL and the language of our _business logic_.

The real _business logic_ belongs to `validateAuthToken`, and **Express middleware** that we
are about to write as the second extension of our `graphql-auth` feature.

Create:

```bash
vi ./graph-auth/express-middleware.js
```

and paste:

```js
// This is just the scaffolding of a ForrestJS Hook's handler
exports.authMiddleware = () => {}
```

then register this extension right away in `./graphql-auth/index.js`:

```js
const { EXPRESS_MIDDLEWARE } = require('@forrestjs/service-express')
const { authMiddleware } = require('./auth-middleware')

...

exports.register = ({ registerAction }) => {
    ...

    // Inject the proper Business Logic into the Exrpress App
    registerAction({
        hook: EXPRESS_MIDDLEWARE,
        name: FEATURE_NAME,
        handler: authMiddleware,
    })
}
```

As we see this extension hooks into `EXPRESS_MIDDLEWARE`, which gives us a reference to the
Express App's instance, plus a reference to any App settings concerning Express.

We can now focus on the middleware implementation:

```js
exports.authMiddleware = ({ app }) =>
    app.use(async (req, res, next) => {
        req.authValidateToken = args => args.token === 'xxx'
        next()
    })
```

This is just a first static implementation. The "password" is hard coded and this solution
is definelty not extensible. We are going to improve this soon enough, but for now why don't
you try to run those queries:

```gql
query GoodQuery {
    auth (token: "xxx") {
        getPersonalInfo { name }
    }
}

query BadQuery {
    auth {
        getPersonalInfo { name }
    }
}
```

The first query should yeld the full response, the second should yeld `data.auth = null`.
If this is the case, you are ready to move to the next chapter and work on this function
some more so to make it versatile and extensibile.

- Wouldn't be cool to authorize a request based on headers?
- Wouldn't be cool to let a custom extension completely change the authorization logic?

Spoiler alert: it is cool.

## Make it a Service

In ForrestJS's land there are **features** and **services**. They look like the same and
you write them in the exact same way. So you already know how to build services.

But they have a different meaning.

A **FEATURE** is project specific and implements stuff that your customer (or yourself)
are happy to pay for. It is also unusual that you will ever share a feature across
two different projects.

A **SERVICE** is totally general. Your customer doesn't want to pay for it and she likely
doesn't understand anything of it (too abstract). You have already used some generic
ForrestJS's services like `@forrestjs/service-express`. You also clearly want to share
those kind of stuff across your projects. Services probably belong to _NPM_.

In this chapter we will:

- increase the capabilities of our Auth middleware
- make it generic and extensible to the point that we are happy to call it a service

It actually makes sense because we are simply building a "guarded wrapper" for GraphQL
queries... What could be more generic than that?

### An Extensible Middleware

First thing let's add a new hook name to the service's manifest `./graphql-auth/hooks.js`:

```js
...
exports.GRAPHQL_VALIDATE = `${this.FEATURE_NAME}/validate`
```

And then copy this slightly more sophisticated implementation of the middleware in
`./graphql-auth/auth-middleware.js`:

```js
const { createHook } = require('@forrestjs/hooks')
const { GRAPHQL_VALIDATE } = require('./hooks')

exports.authMiddleware = ({ app, settings }) => {
    // 1. Enforce settings and fail at boot time
    const validToken = settings.authToken || process.env.GRAPHQL_AUTH_TOKEN
    if (!validToken) {
        throw new Error('You need to provide an "authToken" in the Express settings (settings.express.authToken = "xxx")')
    }

    // 2. Let other extensions mess up with the Business Logic
    let validateRequest = null
    let validateToken = null

    createHook(GRAPHQL_VALIDATE, {
        args: {
            settings,
            setValidateRequest: fn => validateRequest = fn,
            setValidateToken: fn => validateToken = fn,
        }
    })

    // 3. Provide a default Business Logic
    validateRequest = validateRequest || (req => {
        try {
            req.authToken = req.headers.authorization.substr(7)
            req.authTokenIsValid = req.authToken === validToken
        } catch (err) {
            req.authToken = null
            req.authTokenIsValid = false
        }
    })

    validateToken = validateToken || ((req, { token }) => {
        if (token) {
            req.authToken = token
            req.authTokenIsValid = token === validToken
        }
        return req.authTokenIsValid
    })

    // 4. Create the middleware
    app.use(async (req, res, next) => {
        validateRequest(req)
        req.authValidateToken = args => validateToken(req, args)
        next()
    })
}
```

There are few interesting things going on here:

**Point n.1:** Crash fast. If your feature or service depends on a setting or _environment variable_,
it is good practice to **validate it at boot time**.

> I've been through lot of hicups because of unvalidated settings that were used in some obscure
> and seldom used corner cases.

**Point n.2:** Let extensions take over. The trick is to provide extensions with "setter" functions
that can be used to affect some internal logic. Those setters could implement some type check and
throw errors if misused by extensions. It makes it for a very neat API.

**Point n.3:** Provide a default business logic in case no extension register into this particular hook.

**Point n.4:** Implement the _ExpressJS Middleware_. No big deal here, you know how to handle this.

## Configuration Made Easy

> this might become a standalone tutorial!

If you run the App with the latest implementation of `./graphql-auth/auth-middleware.js` you will
surely notice that it crashes due to the missing `settings.authToken` or `process.env.GRAPHQL_AUTH_TOKEN`.

We need to provide that information, and there are a couple of ways to achieve so.

### App's Configuration

### Runtime ENV Variable

### ENV File
