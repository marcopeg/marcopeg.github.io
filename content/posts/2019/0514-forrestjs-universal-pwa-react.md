---
title: ForrestJS
date: "2019-05-14T08:46:37.121Z"
template: "post"
draft: false
slug: "/2019/universal-pwa-in-react"
category: "Blog"
tags:
  - "forrestjs"
  - "react"
  - "pwa"
  - "universal"
description: "Create your Universal PWA in React / ExpressJS / GraphQL. With ForrestJS it's easy and fast. In this first tutorial we'll get you up and running in 5 minutes."
image: "react.svg"
---

[ForrestJS](https://forrestjs.github.io) provides a set of utilities and starter kits inspired by GatsbyJS, but with the purpose
of **creating Universal PWAs that can run on server, browser and Cordova** native wrappers within the same codebase.

But it's easier done that explained. Open your terminal (we tested this on a Mac) and type:

    npx forrest run my-project

In a few minutes you should have a service running on port 8080:

    http://localhost:8080

And it should be equivalent to the demo that is hosted on Heroku:

    https://forrest-starter-universal.herokuapp.com/

<div style="margin-top: 80px"></div>

## Project Overview

Digging into the newly created project (`cd ./my-project`) we can see that **the folder structure is an
extension of Create React App**. In fact this project has been created out of the default starter kit 
called [starter-universal](http://github.com/forrestjs/starter-universal).

This starter puts together a good amount of tools:

- React
- Redux
- Redux Thunk
- Redux Features
- React Router
- React Loadable
- React INTL
- Styled Components
- ExpressJS
- GraphQL
- Server Side Rendering
- React Styleguidist
- Gitbook
- Development and Production scripts
- Dockerfile (run the app as container)

We feel it is a solid starting point for any web project, but at its core it is still a CRA project.
So if you ever used Create React App, you know how to deal with it.

<div style="margin-top: 80px"></div>

## Development Mode

The easiest way to start the project in development mode is through the `package.json` script `start`:

    yarn start

This starts the CRA's Development Server on port 3000 and the backend service on port 8080. The CRA app
is automatically proxied to the backend for api calls.

Try to open `src/App.js` and hack stuff around, you can tell this is Create React App... **but hot module reload is
up and running!**







