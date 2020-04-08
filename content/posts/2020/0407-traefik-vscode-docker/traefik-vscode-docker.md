---
title: Traefik + VSCode + Docker
date: "2020-04-07T08:46:37.121Z"
template: "post"
draft: false
slug: "/2020/traefik-vscode-docker"
category: "Blog"
tags:
  - "traefik"
  - "vscode"
  - "docker"
description: "Run your Cloud IDE"
image: "docker.png"
---

## AWS Template

```bash
#!/bin/bash
apt-get update -y
# Install Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
apt-get update -y
apt-cache policy docker-ce
apt-get install -y docker-ce
usermod -aG docker ubuntu
# Docker Compose
curl -o /usr/local/bin/docker-compose -L "https://github.com/docker/compose/releases/download/1.25.4/docker-compose-$(uname -s)-$(uname -m)"
chmod +x /usr/local/bin/docker-compose
# Humble CLI (need to fix the -y compatibility)
git clone https://github.com/marcopeg/humble-cli.git /home/ubuntu/.humble-cli
ln -s /home/ubuntu/.humble-cli/bin/humble.sh /usr/local/bin/humble
```

## Traefik + VSCode

```yml
version: "3.7"
services:
  proxy:
    labels:
      - "traefik.enable=true"
      - "traefik.http.middlewares.https_redirect.redirectscheme.scheme=https"
      - "traefik.http.middlewares.https_redirect.redirectscheme.permanent=true"
      - "traefik.http.middlewares.auth.basicauth.users=test:$apr1$vyQaW4i3$vLoh94ywQaIV/aX7g/NGW."
      - "traefik.http.routers.proxy.rule=Host(`proxy.dev.marcopeg.com`)"
      - "traefik.http.routers.proxy.entrypoints=web"
      - "traefik.http.routers.proxy.middlewares=https_redirect"
      - "traefik.http.routers.proxy-secure.entrypoints=websecure"
      - "traefik.http.routers.proxy-secure.service=api@internal"
      - "traefik.http.routers.proxy-secure.middlewares=auth"
      - "traefik.http.routers.proxy-secure.rule=Host(`proxy.dev.marcopeg.com`)"
      - "traefik.http.routers.proxy-secure.tls=true"
      - "traefik.http.routers.proxy-secure.tls.certresolver=myresolver"
    image: traefik:v2.2
    command:
      - "--api.insecure=true"
      - "--api.dashboard=true"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--providers.docker.network=web"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.web.http.redirections.entrypoint.to=websecure"
      - "--entrypoints.web.http.redirections.entrypoint.scheme=https"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.myresolver.acme.httpchallenge=true"
      - "--certificatesresolvers.myresolver.acme.httpchallenge.entrypoint=web"
      - "--certificatesresolvers.myresolver.acme.email=postmaster@gopigtail.com"
      - "--certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json"
#      - "--log.level=DEBUG"
#      - "--certificatesresolvers.myresolver.acme.caserver=https://acme-staging-v02.api.letsencrypt.org/directory"
    ports:
      - 80:80
      - 443:443
    volumes:
      - ./letsencrypt:/letsencrypt
      - /var/run/docker.sock:/var/run/docker.sock:ro
    networks:
      - web
    restart: on-failure

  code:
    labels:
      - "traefik.enable=true"
      - "traefik.http.middlewares.https_redirect.redirectscheme.scheme=https"
      - "traefik.http.middlewares.https_redirect.redirectscheme.permanent=true"
      - "traefik.http.routers.code.rule=Host(`code.dev.marcopeg.com`)"
      - "traefik.http.routers.code.entrypoints=web"
      - "traefik.http.routers.code.middlewares=https_redirect"
      - "traefik.http.routers.code-secure.rule=Host(`code.dev.marcopeg.com`)"
      - "traefik.http.routers.code-secure.entrypoints=websecure"
      - "traefik.http.routers.code-secure.tls=true"
      - "traefik.http.routers.code-secure.tls.certresolver=myresolver"
    image: codercom/code-server
    environment:
      PASSWORD: "test"
    volumes:
      - /home/ubuntu/projects:/home/coder
      - /home/ubuntu/ide:/home/coder/ide
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /usr/bin/docker:/usr/bin/docker:ro
      - /usr/local/bin/docker-compose:/usr/local/bin/docker-compose:ro
      - /usr/local/bin/humble:/usr/bin/humble:ro
    networks:
      - web
    user: 0:0
    restart: on-failure

networks:
  web:
    name: web
```

## Example service

```yml
version: "3.7"

services:
  nginx:
    labels:
    - "traefik.enable=true"
    - "traefik.http.middlewares.https_redirect.redirectscheme.scheme=https"
    - "traefik.http.middlewares.https_redirect.redirectscheme.permanent=true"
    - "traefik.http.middlewares.nginx-auth.basicauth.users=test:$$apr1$$paZscWCA$$cbr0JI.3VBV7V9JNb.4xs1"

    - "traefik.http.routers.nginx.rule=Host(`web.dev.marcopeg.com`)"
    - "traefik.http.routers.nginx.entrypoints=web"
    - "traefik.http.routers.nginx.middlewares=https_redirect"

    - "traefik.http.routers.nginx-secure.rule=Host(`web.dev.marcopeg.com`)"
    - "traefik.http.routers.nginx-secure.entrypoints=websecure"
    - "traefik.http.routers.nginx-secure.tls=true"
    - "traefik.http.routers.nginx-secure.tls.certresolver=myresolver"
    - "traefik.http.routers.nginx-secure.middlewares=nginx-auth"

    image: nginx
    networks:
    - web
    - internal
    restart: on-failure

networks:
  web:
    external: true
    name: web
  internal:
```

Generate simple auth with: 

```bash
htpasswd -n test
```