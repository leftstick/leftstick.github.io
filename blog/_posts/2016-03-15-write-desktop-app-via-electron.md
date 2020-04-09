---
title: "用electron写桌面应用"
date: 2016-03-15
author: Howard Zuo
location: Shanghai
tags: 
  - electron
  - desktop
---
{% include JB/setup %}

说起桌面应用，想必大家使用过的就已经海了去了。什么暴风影音、QQ、skype之类的，早已不是新鲜事！不过大家有没有了解过如何编写一个桌面应用？历史上，我们都有哪些方式去编写桌面应用呢？

实际上，桌面应用的历史并不算久远，不去查找各种资料，仅凭记忆，我能想到的曾经出现过的桌面应用编写语言就有：`C++`、`Delphi`、`VB`、`winForm`、`WPF`、`swing`、`awt`、`QT`、`flash`、`Objective-C`、`Swift`...或许还有更多。

学习成本是不是有点高？这么多语言\技术！！如果你恰好还碰到了一个吹毛求疵的老板或者PM，他就是那么迫切的希望自己的app能够多平台发布(也不管在那些平台上是否有客户)，作为程序员的你，肿么办？是勇挑大梁，然后各技术栈学习失败，最终自尽以谢老板？还是果断离开？

当然都不是，够懒的程序员应该寻找更容易实现，又能满足老板需求的解决方案。那么，我们来看看今天的话题，[electron](http://electron.atom.io/)吧！

## electron是什么？ ##

<img :src="$withBase('/images/electron-website.png')" alt="electron" />

根据官网的描述，`electron`是一种可以使用网页技术来开发跨平台桌面应用的解决方案！感受一下，用你已知的技巧`html`、`javascript`、`css`就能写桌面应用，是不是想想就有点儿小激动？！

## 谁在用electron？ ##

著名的前端界IDE[Atom](https://atom.io/)就是使用`electron`编写的，震颤了有不有？

看看还有哪些著名的应用是基于`electron`编写的：

<img :src="$withBase('/images/electron-apps.png')" alt="electron" />


那么接下来，让我开始吧！

## 准备工作 ##

* 安装[nodejs](https://nodejs.org/en/)
* 安装[yeoman](http://yeoman.io/)

## 使用程序生成器 ##

```shell
npm install -g generator-electron-naive
```

>如果使用`unix like`操作系统，请在命令前加`sudo`

## 创建项目 ##

那么我就先来一个简单的叫`todo`小应用：

```shell
yo electron-naive
```

当键入上述命令后，生成器会有一系列问题问你，按需回答即可：

<img :src="$withBase('/images/electron-question.png')" alt="electron" />

>问题中的`Use remote URL`是指，是否想直接加载一个远程的URL？如果选"是"，那么会再要求你输入精确地址

## 调试 ##

```shell
cd todo
npm run dev
```

上述命令操作完后，会有如下应用界面打开：

<img :src="$withBase('/images/electron-debug01.png')" alt="electron" />

找到`todo/src/index.html`，用你喜欢的IDE打开，然后拷贝如下代码覆盖`index.html`原先的内容：

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>TODO</title>
    </head>
    <body>
        <ul id="todolist"></ul>
        <form action="#" method="post">
            <div>
                <label for="newitem">Add item</label>
                <input type="text" name="newitem" id="newitem" placeholder="new item" />
                <input type="submit" value="Add" />
            </div>
        </form>

        <script>

            var todo = document.querySelector('#todolist'),
            form = document.querySelector('form'),
            field = document.querySelector('#newitem');

            form.addEventListener('submit', function(ev) {
                var text = field.value;
                if (text !== '') {
                    todo.innerHTML += '<li>' + text + '</li>';
                    field.value = '';
                    field.focus();
                }
                ev.preventDefault();
            }, false);

            todo.addEventListener('click', function(ev) {
                var t = ev.target;
                if (t.tagName === 'LI') {
                    t.parentNode.removeChild(t);
                };
                ev.preventDefault();
            }, false);

        </script>
    </body>
</html>
```

再来看我们app界面，变成了如下样子：

<img :src="$withBase('/images/electron-debug03.png')" alt="electron" />


## 生成应用程序包 ##

之前生成项目的过程中，在“Which platform you'd like to package to?”这个问题里，你可选择将来要支持的操作系统，以便生成相应的打包代码。

那么现在我们就来生成一个程序包吧：

```shell
npm run dist
```

最后生成的可执行程序出就现在了如下位置：

<img :src="$withBase('/images/electron-release.png')" alt="electron" />

愉快的双击使用吧！！！
