---
layout: post
title: "2分钟教你在Github上建博客"
description: ""
category: "tech"
tags: ["blog", "github"]
---
{% include JB/setup %}

每个程序员，心中都住一个闷骚的小娘子，他们渴望被人关注，成为众人心中的‘神’，
但不是每个人都有社交能力，于是博客、微博应运而生。或许你没办法拉住别人听你的
喋喋不休、也耻于一个人喃喃自语，来吧，书写是你的阿波罗，记录你荡漾的每一刻心
声。

可是问题来了，一个堂堂程序员如果每个自己的博客站，显得多凄凉啊？自己花钱租服
务器？别逗了，程序员心中伴随闷骚小娘子的，往往还有一个臭屌丝！这可如何是好？
既想看着屌炸天，又不想破财，来吧，`Github`是你的阿波罗，这儿的一切都是免费的！
(私有服务另说啊)

认识`Github`的话，我就不说了，不知道的自己面壁撞墙(不是程序员的不用啊)。

来，咱们开始！

1. 创建一个新的代码仓库，该仓库的名字必须按照如下格式：

   `<Github username>.github.com`，譬如，我的这个仓库名字为：leftstick.github.com

   > 以下步骤凡引用到`Github`用户名的地方，用`example`代替

2. 安装`Jekyll-Bootstrap`
   
   在命令行中，移动到一个你想要保存你的博客站的目录，执行如下命令：

{% highlight PowerShell %} 
   git clone https://github.com/plusjade/jekyll-bootstrap.git example.github.com
   cd example.github.com
   git remote set-url origin git@github.com:example/example.github.com.git
   git push origin master
{% endhighlight %}

3. 静心、安坐
    
   现在，让我们一起喝杯咖啡、或者可以尿个尿(尿他个5分钟，尿出一片天)

   打开浏览器，输入`http://example.github.io/`，回车，欣赏你刚刚完成的作品吧！


### 博客站已经创建完毕，但里面的内容不是我自己写的啊？ ###
    
没错，那是`Jekyll-Bootstrap`预置的内容，需要自己改的

### 怎么写自己的博客？ ###
    
欲知后事如何？且看下回分解！

### 样子不够屌，可不可以换？ ###
  
莫慌，饭要一口一口吃！后面会说的!