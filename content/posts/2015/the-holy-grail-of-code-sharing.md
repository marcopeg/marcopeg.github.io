---
title: The Holy Grail of Code Sharing
date: "2015-02-28T06:21:37.121Z"
template: "post"
draft: false
slug: "/2015/the-holy-grail-of-code-sharing"
category: "Blog"
tags:
  - "coding"
description: "Code sharing is a concept which is whispered in low tone around the office, is being shouted loud by tools producers and is simply misunderstood by the great part of us, IT folks."
image: "holy-grail-of-code-sharing.jpg"
---

Code sharing is a concept which is whispered in low tone around the office, is being shouted loud by tools producers and is simply misunderstood by the great part of us, IT folks.

Management people wish every single line of code to be shared and 100% reusable, they see only one single fact: _less code means less costs_.

Product Owners and Scrum Masters have big troubles in understanding why to put time in code sharing practices, their way of thinking is: _better done than perfect_.

> Developers... where do I start?  
> Oh yes, all we want is just to code and create amazing apps!

This is the story about how **my team faced the challenge to improve code sharing** among the company with the great objective to improve code quality, reduce time to market and create happier developers.

## Our Problem

I work in a service company whose core business is mobile web applications development. 

> We sell development time to customers who **know what, but not how to** do business with mobile devices.

We are more than 100 programmers divided into teams of 6 to 10 guys. Each group is highly committed to it's project and suffer under high time pressure to fulfill our different customers expectations.

The projects around the company are not that different, we do tailored based customisations of a shared service, much like a classic web agency producing custom websites.

> Today there is **close to zero code sharing** around our teams and this fact costs us
> a lot of money.

![old-clock](./media/old-clock.jpg)

We are a service company and **our trading value is our delopers time**.  
When two teams solve the same problem in two different ways, they spend the double of the time. 

> And when you sell services, the rule of thumb is fairly easy:  
> **"the double the time the half the revenue"**

To share code across teams appear to be the obvious and easy solution to our problem, but **it turned out that its not easy** to really implement this in a proper way.

## Our Struggle

Our product is a quite complex mobile web application so we proposed **to split the requirements into smaller chunks** that could be reusable and customisable by many teams.

> We called those chunks _Features_ and for the purpose of this article you can think to features as _Login_, _Payment_, _Articles_, ...

A _Feature_ is a quite big part of the entire application that **implements a single responsibility** like loggin-in users or enabling payments, etc. It's smaller compared to the whole application but still it is a unfairly large piece of cake.

After some hard thinking we came up with a good understanding of the _Features_ that were involved in our apps and we were extremely happy and proud when **we proposed the company to reorganize our developers into _Feature Teams_** whose task is to implement a specific _Feature_ to be reausable by others.

This solution **was hard to hear and accept by management** because it involved dramatic changes to the company's structure and business model.

> _Feature Teams_ was just a dead end.

Our second approach was driven by the hard boundary to **not change the company structure**.  
<small>(We learned this lesson the hard way)</small>

![old-clock](./media/struggle.jpg)

Long story short, we proposed to let our teams do their job and to create a side team of experts whose duty is to **take existing custom code and _change it to make it reusable_**.

Also this time we became the target for jokes and laughter due to the concept of making things "_more reusable_". What does it mean? I still don't know.

> The third time you try, you are more likely to succeed.  
> <small>If you are humble enough to learn from your mistakes.</small>

## Our Solution

Our final and most successful approach was to discard _high academic thinkings_ and to go straight down to the core of our daily job.

> we do not just write code,  
> **we do solve problems with code!** 

So, instead of limit ourself to the struggle of code-sharing, we moved on and began to **analyse where we were wasting time** within the company.

> The most time expensive moment in every developer's day is called **_WTF_**.  
> <small>_(What The Fuck)_</small>  
> 
> <small>This is not a bad or impolite expression. This is the technical name for the worst nightmare every man or woman, involved in the process of solving problems with code, has.</small>

Our **first action point** was to put small and cross-team groups of developers into a room on a weekly basis with the only objective **to share _WTF_ stories**. 

To tell to your mates **were you had issues and how you solved those** is not only about the code you wrote. It is all about the tools you used: 

* search engines queries
* articles, books, blogs & forums
* colleagues that knew that s***

The second action point was to **raise the culture of enterprise code writing**.

_Enterprise Code Writing_ is nothing more than a small group of best practices that we can use when it comes to write code involving 130 people. Some of these are:

* single responsibility principle
* open source first
* readability first
* why &raquo; how &raquo; code

This bullet list might just sound like a bunch of cliché expressions, but I have to use them in this article and actually each of them is worth their own entire book.

> The general principle that should drive each of us is:  
> **Don't do bullshit!**

![no-bullshit](./media/no-bullshit.jpg)

* to build a big module is way more expensive than to build small ones that can work together
* to write my own DOM library is way more time consuming compared to use a jQuery custom build
* to write my own knowledge base about Javascript is just not the way, I can search, read and link valuable articles that are already available online

All **those examples are surprisingly difficult to achieve** when it comes to developers, 
the most proud and stubborn people of the planet!  
<small>(and as matter of fact I am proud to be one of them!)</small>

## Our Path

When it comes to practical coding we have a simple action point which is **micro coding**.

We left the idea of coding complete and reusable _Features_ way behind us. Today we focus in **writing the least amount of code possible** for the smallest possible of the responsibilities. And we share that.

> Each function, source file or module must solve one single problem, no more than one.

By just doing that our developers have began to **produce reusable code from the very first day of the change**, without introducing any new tool in their chain.

At the beginning we used a simple [DropBox shared folder](https://www.dropbox.com) to share our micro libraries, 
today we have evolved a bit by introduceing our second action point.

Our second practical action point is **Open Source First**.

> If the solutions exists among the Open Source community we use it,  
> if we create our own solution, we publish it back for others to use.

Today we use [CommonJS](http://wiki.commonjs.org/wiki/CommonJS) and [NPM](http://npmjs.org/) to write our Javascript, if we need a 
library we search _NPM_ or _GitHub_, if it exists we use it, if it exists on _GitHub_ but it is not available through _NPM_ we contribute to the project to fix it, then we use it through _NPM_.

This behaviour is much more than to merely _give back to the community_.  

> By actively publish open source code **we get free help from the community** that
> contributes to our repositories by doing bug-traking, bug-fixing and code enhancement.

For writing CSS we embrace the [Object Oriented CSS](http://www.smashingmagazine.com/2011/12/12/an-introduction-to-object-oriented-css-oocss/) 
and we use [LessCss](http://lesscss.org/) to build them, to easily do cross-browser compatibility we have chosen 
[LessHat](http://lesshat.madebysource.com/) which is quite simple 
and complete.

The third and most important action point was to **challenge our developers**.

> There is nothing better than prizes to **light up your willing of doing**!

So we introduced **cross team challenges**: groups of 3-4 people from different teams who were competing to produce some fun apps or little games. 

The prize was always quite impressive and at the very beginning some managers had an heart attack about that.

> We have a play-room so we created a _ChallengeME_ app to invite a colleague to the 
> table tennis, we do afterwork so we suggested a _PubRating_ app internal 
> to the company... and much more!

Eventually the learning effort that every developer put into **the challenge was affecting the quality of his daily job** so much that no money could have ever bought this accomplishment!

The best of it is that **we exploited the proudness and stubbornness** which is natural in each developer to play a fundamental and positive role within the company: 

> When a developer learn a better implementation he can not accept to see legacy code 
> anymore so **he/she coach other colleagues to improve**. For free!

## Don't forget your Take Away!

Today my company is a better place to work and the quality of what we produce has increased greatly. We have really made some great accomplishments regarding code sharing and reusability.

We're also planning to move more into a product business model, something we can do today because we now have the culture of enterprise coding and reusability built into every single one of our developers.

During the last year a great guy left the company because his **improvements were public on _GitHub_** and he was head hunted by one of our direct competitors. 

This is good, he will learn even more from them but he can not stop to hang out with us, his old mates, we have become real friends through this experience, so **all of the knowledge is coming back to us**!

> We started this experience more than one year ago, we faced a problem, 
> we spiked some dead ends but eventually we made it. It took some time but it was worth it.

What we have learned is that **code sharing is not about tools, but about culture**, is about people and knowledge, is about sharing the objective to spare some time from our daily struggles and to use it in a more fun and proficient manor.
