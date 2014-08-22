---
layout: post
title: "2分钟教你在Github上建博客"
description: ""
category: "tech"
tags: ["blog", "github"]
---
{% include JB/setup %}

每个程序员，心中都住着一个闷骚的小娘子，他们渴望被人关注，成为众人心中的‘神’，
但不是每个人都有社交能力，于是博客、微博应运而生。

或许你没办法拉住别人听你的喋喋不休、也耻于一个人喃喃自语，来吧，书写是你的阿
波罗，记录你荡漾的每一刻心声。

可是问题来了，一个堂堂程序员如果没个自己的博客站，显得多凄凉啊？花钱租服务器？
别逗了，程序员心中伴随闷骚小娘子的，往往还有一个臭屌丝！这可如何是好？既想看
着屌炸天，又不想破财，来吧，`Github`是你的阿波罗，这儿的一切都是免费的！(私有
服务另说啊)

关于`Github`，我就不在这里赘述了，不知道的自己面壁撞墙(不是程序员的不用啊)。
只要`google`一把。

还有，在面对各种专业词汇时，我不会做详细介绍，仅仅附上`wikipedia`链接，自己打开
查阅即可。

来，咱们开始！

### [创建一个新的代码仓库](#step-one) ###

该仓库的名字必须按照如下格式：

`<Github 用户名>.github.com`，譬如，我的这个仓库名字为：leftstick.github.com

> 以下步骤凡引用到`Github`用户名的地方，都用`example`代替，以免引起不必要的疑
惑

### [安装`Jekyll-Bootstrap`](#step-two) ###

在[命令行](http://zh.wikipedia.org/wiki/%E5%91%BD%E4%BB%A4%E8%A1%8C%E7%95%8C%E9%9D%A2)中，移动到一个你想要保存你的博客站的目录，执行如下命令(注意修改里面的`example`为你的用
户名)：

    git clone https://github.com/plusjade/jekyll-bootstrap.git example.github.com
    cd example.github.com
    git remote set-url origin git@github.com:example/example.github.com.git
    git push origin master

> 该功能要求`Git`已经安装成功，如果没有安装的，请关闭所有的命令行程序，然后移步至
[Git](http://git-scm.com/download/)下载`Git`，安装成功后，重新打开命令行，然后执行上述
命令

### [静心、安坐](#step-three) ###
    
现在，让我们一起喝杯咖啡、或者可以尿个尿(尿他个5分钟，尿出一片天)

> 注意修改里面的`example`为你的用户名

打开浏览器，输入`http://example.github.io/`，回车，欣赏你刚刚完成的作品吧！


- **博客站已经创建完毕，但里面的内容不是我自己写的啊？**
    
没错，那是`Jekyll-Bootstrap`预置的内容，需要自己改的

- **怎么写自己的博客？**
    
欲知后事如何？且看下回分解！

- **样子不够屌，可不可以换？**
  
莫慌，饭要一口一口吃！后面会说的!