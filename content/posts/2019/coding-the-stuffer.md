---
title: Coding The Stuffer
date: "2019-23-02T15:23:37.121Z"
template: "post"
draft: false
slug: "/2019/coding-the-stuffer"
category: "Blog"
tags:
  - "file storage"
  - "project"
  - "open source"
  - "docker"
  - "nodejs"
  - "cloud"
description: "How comes when I need a specific service, I never find one ready?"
image: "docker.png"
---

As many team before us we ([mysocial.io](https://mysocial.io)) got to the point where we
want our users to be able to upload files (mostly photos and videos) in our community. 

Of course there are tons of solutions out there. Starting from a simple S3 Bucket, ending
up into some rudimental image storage service that we developed at the company I work.

Anyway it is more fun to face the challenge and build from scratch, right? Plus I thought
it would be a good opportunity to learn more about [streams](https://medium.freecodecamp.org/node-js-streams-everything-you-need-to-know-c9141306be93) and efficient memory management.

**On top of it, I had some personal requirements for a File Storage service:**

- It should work in my local machine, offline, with little memory footprint
- It should scale to a cluster in the cloud, with endless storage
- It should work as origin for a CDN like CloudFront
- It should handle local cache, with configurable limits
- It should handle file transformations like resize or gzip (also cached)
- It should handle fine-grained access permission rules
- It should be possible to add custom features as simple Javascript plugins
- It should work as Docker container
- It should be NodeJS

Somehow I didn't manage to find a product that matched all those requirements...
**So I made it :-)**



## Meet "the Stuffer"

I called it "stuffer" because you put stuff in it, and it handles that stuff. That's it.

- [here is the Docker image](https://cloud.docker.com/u/marcopeg/repository/docker/marcopeg/stuffer)
- [here is the Documentation](https://marcopeg.github.io/stuffer)
- [here is the source code](https://github.com/marcopeg/stuffer)

In order to enjoy the rest of this article you need [Docker](https://www.docker.com/) and
some understanding of bash commands like CURL, or [Postman](https://www.getpostman.com/).

## The "Hello World" of file storage

The first thing that we want to try out is to simply run Stuffer on your local machine
and be able to upload a file, and then download it. Let's start a Stuffer instance:

    docker run --rm -p 8080:8080 marcopeg/stuffer

Now let's assume you have a file you want to upload, say an image, located at:

    /Users/john/doe.jpg

We can issue a CURL command to upload that file to our newly created instance:

    curl -X POST http://localhost:8080/upload \
        -F f1=@/Users/john/doe.jpg

Stuffer answers with a JSON document that contains some details about the upload:

    {
      "files": [
        {
          "field": "f1",
          "name": "doe.jpg",
          "checksum": "d7fa2ae42c7e18ff5cfc405700641576",
          "type": "image/jpeg",
          "encoding": "7bit",
          "size": "55.8 kB",
          "bytes": 55767,
          "url": {
              "base": "http://localhost:8080/public/de9d99a0-c8e5-4ca3-b732-45d358d3dedf",
              "original": "http://localhost:8080/public/de9d99a0-c8e5-4ca3-b732-45d358d3dedf/doe.jpg"
          },
          "meta": {}
        }
      ],
      "errors": []
    }

The most interesting information is `files[].url.original` which gives us a direct link to
the recently uploaded resource:

    http://localhost:8080/public/de9d99a0-c8e5-4ca3-b732-45d358d3dedf/doe.jpg

If you copy that into your browser, you should be see the original file.

> You can set an env variable `DOWNLOAD_BASE_URL=mycnd.cloudfront.net` that alter the
> resulting url, this is useful when your run Stuffer under a CDN or on a custom domain.

## Namespaces and Resource ID

We can break down the generated resource url:

    http://localhost:8080/public/de9d99a0-c8e5-4ca3-b732-45d358d3dedf/doe.jpg

into this template:

    {downloadBaseUrl}/{space}/{uuid}/{fileName}

    downloadBaseUrl > http://localhost:8080
    space           > public
    uuid            > de9d99a0-c8e5-4ca3-b732-45d358d3dedf
    fileName        > doe.jpg

> Hold on, you can edit and customize all of it!
