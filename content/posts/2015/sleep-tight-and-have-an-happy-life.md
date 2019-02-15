---
title: Sleep tight and have an happy Life!
date: "2015-01-16T06:21:37.121Z"
template: "post"
draft: false
slug: "/2015/sleep-tight-and-have-an-happy-life"
category: "Blog"
tags:
  - "backups"
description: "Backups are strange animals. In a perfect world you don’t need backups. You put efforts in building a solid backup strategy, you buy external drives, cloud storage and amazing software which you wish you never have to use in life."
image: "happy-life.jpg"
---

Backups are strange animals. In a perfect world you don’t need backups. You put efforts in building a solid backup strategy, you buy external drives, cloud storage and amazing software which you wish you never have to use in life.

So what? Why am I wasting all those efforts? Why do I live with a tera drive always plugged in my computer? Will a terabyte be enough by the way?

And when something really bad happens, when you see the bloody blue screen on a Windows machine, when your kids feed your powerless Mac with hot milk, what do you do? **Do you remember how the restore procedure works?** It never works, not for me at least.

But today is your lucky day because I am going to tell you that useful and dead simple backup strategies exist. And they are just few clicks away.

> The quick takeaway is to **isolate the problem which shows up more often and solve it** in 
> the simplest and most efficient way.

Now try to be honest when you answer the following questions: How many times has a villain stolen your computer? How many times have you gotten destructive viruses? How many times have you screwed your code base because you have kept coding through out the night when you should have gotten some well deserved sleep?

![steal-computer](./media/steal-computer.jpg)

**For me is the "screwed code" scenario that is responsible for my worse headaches**. It happens to me as I enter this mystical mental space in which "I see the light". I feel the urge to give life to my bright ideas so I start scrambling the existing code base here and there. Oh some times I get things done but it is a matter of luck. 8 times out of 10 it doesn't work at all, and often I can't go back to where I've started!

The (urgent) **need to get back to a stable code base** is a daily scenario in the life of a developer. Indeed, it could happen more than once a day, if it was "one of those days".

So there is Git. Well, yes but no. Of course Git is one of the most powerful tools at your disposal but it is not the easiest one. You should invest the time of learning Git as version control and collaboration tool, but for now let's keep things simple. Dead simple.

The most efficient way to enable a _restore-ability_ for your code base is to **create a copy of the project before you start** a development session. On a Mac is just a matter of right clicking the project's folder and choose "duplicate". Dead simple.

What is simple often works well, so let's analyze what you do to revert your code. You trash the current project's folder and rename the copy to match the original one. Dead simple and impressively quick.

Now you can improve your backup strategy by **adding versioning support**. You are going to keep a copy for each stable version of your code base. Right-click on your project's folder and choose "compress archive". This option is available with a slightly different name on different platforms but you have it for sure. 

Every time you create a new archive the OS will **automatically append a version number** to it. You don't have to bother and you can access your backup's date & time informations on the archive's details panel. If you want to go even further my suggestion for you is to rename the archive, prefixing it with the current time in a "YYMMDDHHMM" format. Now the version number contains the time of the backups and **all your archives are alphabetically sorted** on your file manager view.

![schedule-backups](./media/schedule-backups.jpg)

Of course there is a price to pay for this simplicity. It's space. You are going to need a lot of space if you version your project often. Luckily external drives are cheap nowadays and even cloud storage is not that expensive.

You can create your versions into your Dropbox folder so they are cloud stored right away and when you reach home at the end of the day you move the old ones to your gigantic external drive for a permanent storage.

So what about automation? Well so far we considered only manual backup and versioning strategies that you can trigger very quickly, but of course **you want to schedule your backups** to run under the hood.

The easiest possible solution is Mac's _Time Machine_ which will backup all your computer every hour by default. You can trigger a manual backup by choosing "backup now" on the incon tray's menu. Some advantages are: a computer wide backup, the restore helper UI and the native support which is shipped within every Mac. The main drawback is that you need to live with your gigantic external drive always plugged in. And if you are not a Mac user then there is no drawback, there is a problem. TimeMachine is available only for Mac, but I am sure there are likewise solutions for both Windows and Linux. (If you know one please post it as a comment and I will integrate it.)

Another great backup tool is [_Carbon Copy Cloner_](https://bombich.com/), another Mac tool. **_CCC_ creates a bootable clone of your machine** and you can schedule this backup the way you like it. I use _CCC_ as disaster recovery strategy. I clone my Mac at least once a week so if I loose it, someone steal it or my dog plays with it, I can buy a new one and clone it back. **In few hours I can be back on track even in a disastrous scenario**. This is also a good strategy when I simply upgrade my computer to a new one. It's almost 8 years I've been doing this and I never have a problem with it.

![external-drive](./media/external-drive.jpg)

> For you that want to play a little bit with some scripting my suggestion is 
> to buy a cheap hosting service which provides an FTP access. With this tool and 
> some bash code you may be able to automate the archive & versioning of your projects 
> adding also a remote upload feature.

In fact **to backup on an external drive is far from enough to secure your data**. External drives are getting cheaper and cheaper and that means that they are also more prone to failure. Will you be happy to pay hundreds of dollars to extract your photo archive from a ruined disk? I bet you won't!

The trick, again, is as easy as redounding your backups on more than one drive. 

I keep my _Carbon Copy Cloner_ disk at home and the _TimeMachine_ one at the office. **I backup my important files in two drives that are geographically as far away from each other**. My data will survive me coding drunk, a robbery, a fire and even an heartquake! With this strategy in place I do sleep tight.

### Remember the Takeaway:

1. think simple
2. make a copy of your project before you start coding
3. use cloud tools like [Dropbox](https://www.dropbox.com/) or [Google Drive](https://www.google.com/drive/)
4. spread your backups to more disks, give one disk to your mom

Sleep tight and live a happy Life!