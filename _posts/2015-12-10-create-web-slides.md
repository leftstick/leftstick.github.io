---
layout: post
title: "分分钟做出一个WEB版幻灯片"
description: ""
category: "tech"
tags: ["web", "slides"]
shortContent: "在我们漫长的工作生涯中，无论是与他人分享某个话题时、还是向公司汇报工作时，幻灯片总是免不了的。"
---
{% include JB/setup %}

### 前言 ###

在我们漫长的工作生涯中，无论是与他人分享某个话题时、还是向公司汇报工作时，幻灯片总是免不了的。

但是作为一名软件工程师，每次都写powerpoint，写Keynote，是不是已经使你厌烦？甚至觉得这种事，实在不像一个软件工程师该做的。那程序员如何能够“高大上”起来？

这就是我们今天的话题，用网页技术，手写一个web幻灯片出来。

### 准备工作 ###

以下是我们的准备事项， 我们一步步来讲解

* [node](https://nodejs.org/)
* [yeoman](http://yeoman.io/)
* [generator-slides](https://github.com/leftstick/generator-slides)
* [sero-cli](https://github.com/leftstick/Sero-cli)

首先，[node](https://nodejs.org/) 是前端开发必备环境，如果不知道的，那就赶紧去安装一下吧，也没什么特别注释，官网下载后直接安装即可。

再来，[yeoman](http://yeoman.io/)是一个非常好用的脚手架平台，通过这个平台，我们有非常多的脚手架工具可以用来生成不同的应用基本结构，省却了我们不少功夫。安装[yeoman](http://yeoman.io/)非常简单，在命令行中执行如下命令即可：

```shell
npm install -g yo
```
>在unix like操作系统下，需要在该命令之前加sudo

然后，我们在来安装本次的重头工具——[generator-slides](https://github.com/leftstick/generator-slides)，它就是基于[yeoman](http://yeoman.io/)架构，开发的一个脚手架工具。安装也非常简单，命令行中执行以下命令：

```shell
npm install -g generator-slides
```
>在unix like操作系统下，需要在该命令之前加sudo

最后，再来安装一个小工具——[sero-cli](https://github.com/leftstick/Sero-cli)，用处我们后面再说，通过命令行执行以下命令安装：

```shell
npm install -g sero-cli
```
>在unix like操作系统下，需要在该命令之前加sudo

准备工作，这就结束了，下面开始真正的幻灯片创建工作。

### 创建幻灯片 ###

打开命令行，找一个你喜欢的文件夹，执行以下命令，开始创建一个幻灯片项目：

```shell
yo slides
```

然后命令行会提出各种问题等你回答，如下图所示：

![]({{ BASE_PATH }}/assets/images/create-web-slides-questions.png)

我们依次解释下各问题的意思：

* Your slides name - 幻灯名名称/主题，这里只能输入英文
* Your slides description - 幻灯名描述/副标题
* Your name - 你自己的名字
* Your email - 你自己的邮箱
* Choose a theme of this slides - 选择一个你喜欢的幻灯片主题，可以在这里了解各主题风格
* Choose plugins you'd like to add - 选择你需要用到的插件，可以在这里了解各插件用处

回答完所有问题后，幻灯片项目就创建成功了

### 预览一下 ###

到了这里，我们的幻灯片项目已经创建成功了。假设我们刚才输入的“幻灯片名称”是“demo-slides”（后面章节如有用到幻灯片名称的，我们都会使用这个名称）。

依旧，执行如下命令：

```shell
cd demo-slides
sero server -r . -p 8080 -l
```

这时，我们之前安装的`sero-cli`就有了用武之地。通过`sero`，我们在demo-slides中启动了一个端口为`8080`的web服务器，现在打开[http://localhost:8080](http://localhost:8080)，就可以看到这个幻灯片了。

![]({{ BASE_PATH }}/assets/images/create-web-slides-preview.png)

### 修改幻灯片 ###

选择你喜欢的文本编辑器，打开demo-slides/index.html，就可以爽快的修改幻灯片内容了。

如果碰巧你的chrome浏览器上装了[livereload](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)插件，那么我们幻灯片的内容可以热修改(修改内容后，你的网页会自动刷新)。

由于这里我们的幻灯片基于[reveal.js](https://github.com/hakimel/reveal.js)开发，具体幻灯片支持的功能，可以参考文档学习。

### 发布到github-pages服务 ###

如果你希望你的幻灯片能发布到外网，让大家都能看到，那么`github-pages`服务，是你的绝佳选择。


1. 先到github上创建一个项目，譬如：demo-slides
![]({{ BASE_PATH }}/assets/images/create-web-slides-createrepo.png)
2. 在创建好的项目的页面中，选择复制它的repo地址：
![]({{ BASE_PATH }}/assets/images/create-web-slides-copyrepourl.png)
3. 再次打开命令行，执行如下命令：

```shell
git init
git remote add origin git@github.com:<你自己的用户名>/demo-slides.git
git checkout -b gh-pages
git add .
git commit -m "the first commit"
git push -u origin gh-pages
```

稍等一会，你就可以在"http://<你自己的用户名>.github.io/demo-slides"网址，看到自己的幻灯片了

好了，祝你玩的愉快
