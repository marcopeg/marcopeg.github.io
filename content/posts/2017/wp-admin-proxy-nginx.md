---
title: WP Admin proxy for NGINX
date: "2017-08-19T06:21:37.121Z"
template: "post"
draft: false
slug: "/2017/wp-admin-proxy-nginx"
category: "Blog"
tags:
  - "nginx"
  - "proxy"
  - "wordpress"
description: "How to proxy wp-admin in a headless wordpress setup."
image: "nginx.jpg"
---

At my company we are experimenting quite a lot with **headless WordPress websites**.

> In short we use WordPress as content editor tool but then we set the theme to output _JSON_ and we build a _PWA_ (Progressive Web Application) as frontend.

Out stack is composed as follow:

- Wordpress for backend
- ExpressJS / ReactJS for the PWA
- NGiNX as frontend facing application
- Docker to harness them together

Here is a short snippet out of our _NGiNX_ configuration that serves as reverse proxy so we can let our customers access the WP admin page as they are used to do in the ancient times of simple Wordpress sites. I wouldn't say it's a difficult piece of config but it took some time for me to google it out of the web.

```
location ~ /wp-(admin|login|content|includes) {
  proxy_set_header        Host $host;
  proxy_set_header        X-Real-IP $remote_addr;
  proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header        X-Forwarded-Proto $scheme;
  proxy_pass http://wordpress;
}
```

Do you work with Headless Wordpress as well? What do you think?
