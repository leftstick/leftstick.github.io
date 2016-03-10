---
layout: post
title: "创建你人生中第一个CLI"
description: ""
category: "tech"
tags: ["node", "cli"]
shortContent: "如何利用<code>nodejs</code>code>分分钟创建一个属于自己的<code>cli</code>code>工具"
---
{% include JB/setup %}

#### 预备 ####

1. 分分钟使用默认选项安装完[nodejs](https://nodejs.org/)
2. 分分钟使用`sudo npm install -g yo`安装完[yeoman](http://yeoman.io/)
3. 通过`sudo npm install -g generator-cli-starter`安装cli开发脚手架

> OK, 现在我们可以使用`yo cli-starter`命令开始我们`cli`开发之旅了


#### 创建`cli`项目 ####

```bash
yo cli-starter
```

> 按照提示输入`项目名称`、`命令名称`，完成`cli`项目创建。后续的教程中我们将使用`hi`作为你的`命令名称`，如果你使用了其他命令名称，请注意替换


#### Let's try first ####

现在命令行中输入如下命令(如果你用的不是`hi`，注意替换)

```bash
hi
```

效果如下：

![]({{ BASE_PATH }}/assets/images/cli-starter-example.png)


#### 试个常见命令？ ####

我们接下来就开发一个类似`ls`, `ls -all`的命令，这里面需要用到一个`node`模块[commander](https://github.com/tj/commander.js)，先来安装一下：

进入该项目根目录执行`npm install --save commander`，

然后用你喜欢的editor打开`bin/hi.js`，并用以下内容替换原先的代码：

```javascript
#!/usr/bin/env node

'use strict';

var program = require('commander');

program
    .version('0.0.1');//声明hi的版本号

program
    .command('list')//声明hi下有一个命令叫list
    .description('list files in current working directory')//给出list这个命令的描述
    .option('-a, --all', 'Whether to display hidden files')//设置list这个命令的参数
    .action(function(options) {//list命令的实现体
        var fs = require('fs');
        //获取当前运行目录下的文件信息
        fs.readdir(process.cwd(), function(err, files) {
            var list = files;
            //检查用户是否给了--all或者-a的参数，如果没有，则过滤掉那些以.开头的文件
            if (!options.all) {
                list = files.filter(function(file) {
                    return file.indexOf('.') !== 0;
                });
            }
            console.log(list.join(' '));//控制台将所有文件名打印出来
        });
    });

program.parse(process.argv);//开始解析用户输入的命令
```

OK，现在来试试我们刚写好的命令吧，

```bash
hi -V
```

![]({{ BASE_PATH }}/assets/images/cli-starter-version.png)

```bash
hi list
```

![]({{ BASE_PATH }}/assets/images/cli-starter-list.png)

```bash
hi list -a
```

![]({{ BASE_PATH }}/assets/images/cli-starter-list-a.png)

#### 如何发布 ####

首先需要在[Github](https://github.com/)上创建一个项目，并把我们刚才写的代码同步上去。

然后通过`npm publish`命令将你的cli发布到[npm](https://www.npmjs.com/)。

然后其他用户就可以通过`npm install -g [项目名称]`将你的命令安装到本地使用了
