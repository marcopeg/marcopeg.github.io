---
title: Coding The Stuffer
date: "2019-02-23T15:23:37.121Z"
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

As many team before us ([mysocial.io](https://mysocial.io)) did, we got to the point where we
want our users to be able to upload files (mostly photos and videos) to our community. 

Of course there are tons of solutions out there. Starting from a simple S3 Bucket, ending
up into some rudimental image storage service that we developed at another the company I work with.

Anyway it is more fun to face the challenge and build from scratch, right? Plus I thought
it would be a good opportunity to learn more about [streams](https://medium.freecodecamp.org/node-js-streams-everything-you-need-to-know-c9141306be93) and efficient memory management.

On top of it, **I had some personal requirements** for a File Storage service!

## A File Storage service should...

- work on my dev machine, offline, with as little memory footprint as possible
- scale to a cluster in the cloud, with endless storage
- work as origin for a CDN like CloudFront
- handle local cache, with configurable limits
- handle file transformations like resize or gzip (also cached)
- handle fine-grained access permission rules
- allow to add custom features as simple Javascript plugins
- work as Docker container
- be NodeJS

Somehow I didn't manage to find a product that matched all those requirements... **So I made it :-)**



## Meet "the Stuffer"

I called it "Stuffer" because you put stuff in it, it handles that stuff, you fetch some stuff from it. That's it.

- [here is the Docker image](https://cloud.docker.com/u/marcopeg/repository/docker/marcopeg/stuffer)
- [here is the Documentation](https://marcopeg.github.io/stuffer)
- [here is the source code](https://github.com/marcopeg/stuffer)

**NOTE:** In order to enjoy the rest of this article you need [Docker](https://www.docker.com/) and
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
          "fileName": "doe.jpg",
          "checksum": "d7fa2ae42c7e18ff5cfc405700641576",
          "type": "image/jpeg",
          "encoding": "7bit",
          "size": "55.8 kB",
          "bytes": 55767,
          "url": {
              "resource": "http://localhost:8080/public/de9d99a0-c8e5-4ca3-b732-45d358d3dedf",
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

**NOTE:** You can set an env variable `DOWNLOAD_BASE_URL=mycnd.cloudfront.net` that alters the
resulting url. This is useful when your run Stuffer under a CDN or on a custom domain.

## Namespaces and Resource ID

We can break down the generated resource url:

    http://localhost:8080/public/de9d99a0-c8e5-4ca3-b732-45d358d3dedf/doe.jpg

into this template:

    {downloadBaseUrl}/{space}/{uuid}/{fileName}

    downloadBaseUrl > http://localhost:8080
    space           > public
    uuid            > de9d99a0-c8e5-4ca3-b732-45d358d3dedf
    fileName        > doe.jpg

You can think to `space/uuid` as the `account/repository` in GitHub. A **space** is a container
for multiple resources, each resource is identified by an **unique universal id** (or you can
provide your own), and the resource can contain a file and it's modifications.

The general idea is that you could upload a video, and have it automatically transcoded
in different formats, or chunked for better streaming. Or anything else.

## Anonymous Uploads, or Authentication?

We just performed an anonymous upload, meaning that we didn't provide any credentials to
the Stuffer instance. Just a file to store.

In this circumstance Stuffer creates the resource into the **public space**. It's somehow
similar to Dropbox's Public folder. And if you'd like to change the name to match your
needs, just provide an env variable `UPLOAD_PUBLIC_SPACE=foo`.

Of course if you make your instance accessible from the Internet, you probably want to
**limit and regulate the access to it**. You can set the environment variable
`AUTH_ENABLE_ANONYMOUS_UPLOAD=false` to deny anonymous upload access.

At this point you will need to authenticate your upload request... With a JWT token!

## Conclusions

It's been a lot of fun to write this app. It took more or less a week to get to a first
stable release, and **now we are using it in production quite happily**.

The main usecase that we focused on was the **create new post** feature of a classic
social media app. In this case a user chooses a file or take a new picture for the post.

In this specific case the space/uuid makes a lot of sense because each upload will be
unique (hence the uuid) and associated to the user's credentials. So the space name could
be something like `user-{userId}`.

This structure has the advantage to scope all the files that got uploaded by a specific
user under a single folder. In case the user drops out and **enforces her _GDPR_ rights**
to delete all her produced contents, it's going to be a quick job.

I am aware of a different usecase, let's call it **the Wordpress usecase**, where a single
entity (Wordpress or a CMS) need to upload resources to a custom and mutable folder structure.
Stuffer doesn't cover this usecase yet, but **it shouldn't be a problem to write an extension for it!**

## What do I read next?

Stay tuned because I'm going to write more Stuffer's tutorials:

- Upload with Authentication
- Upload configuration and custom file limits
- Apply modifiers to your downloads: how to get a black and white image?
- Set up the `store-s3` extension and run a full AWS S3 data mirror with configurable local cache

Other details are available here:

- [ready to use Docker image](https://hub.docker.com/r/marcopeg/stuffer)
- [official Documentation](https://marcopeg.github.io/stuffer)
- [dig into the source code](https://github.com/marcopeg/stuffer)




