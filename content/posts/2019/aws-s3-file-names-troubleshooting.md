---
title: AWS S3 File Names - Troubleshooting
date: "2019-02-21T08:46:37.121Z"
template: "post"
draft: false
slug: "/2019/aws-s3-file-names-troubleshooting"
category: "Blog"
tags:
  - "aws"
  - "s3"
  - "cli"
  - "file names"
  - "delete"
description: "Today I got in trouble with weird file names issues while uploading 
files to S3. Long story short: no spaces, no weird characters!"
image: "aws.jpg"
---

Today it rains, and when water pour down the window, I shouldn't be coding at all.
Actually that would be a problem because I live in Sweden and here it rains a lot, but
that is definetly not the problem I had today. 

Today's problem is way way weired.

If you try to upload a file to S3, and that file name contains weird characters or
spaces, you will find it very difficult to delete it.

Try to upload something like: `Lönebesked Marco April.pdf` 
(it's my paycheck in Swedish...)

Upload works no questions asked, then when I use the AWS console and try to delete it,
a generic error happens. No details, no explanations. The file doesn't go away. WTF??

**The solution** is to use the **aws cli tool** and delete it from command line, with
all the spaces escaped:

    aws s3api delete-object --bucket my-bucket --key folder/sub\ folder/Lönebesked\ Marco\ April.pdf

Believe me, it wasn't easy to find this trick out!

