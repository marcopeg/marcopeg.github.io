---
title: React Styleguidist
date: "2018-11-22T06:21:37.121Z"
template: "post"
draft: false
slug: "/2018/react-styleguidist-with-react-scripts-rewired"
category: "Blog"
tags:
  - "hacks"
  - "react"
  - "cra"
description: "How to run \"react-styleguidist\" with \"react-scripts-rewired\"."
image: "styleguidist.svg"
---

[react-styleguidist](https://react-styleguidist.js.org) tries to load the default Webpack configuration that is provided by [create-react-app](https://facebook.github.io/create-react-app/). That works just like magic out of the box.

But if you are using [react-scripts-rewired](https://www.npmjs.com/package/react-scripts-rewired) it will not work out of the box.

The trick is to point the styleguide to the right webpack configuration:

```
module.exports = {
    webpackConfig: require('react-scripts-rewired/config/webpack.config.dev.extend'),
}
```
