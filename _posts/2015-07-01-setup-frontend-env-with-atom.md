---
layout: post
title: "为Atom配置前端开发环境"
description: ""
category: "tech"
tags: ["Atom", "Frontend", "tutorial"]
shortContent: "我做了2年多的<a href=\"http://www.sublimetext.com/3\">sublime text</a>死忠粉，为了能高尚的用它，还督促公司买了<a href=\"http://www.sublimetext.com/3\">sublime text</a>的企业版license。第一次看到<a href=\"https://atom.io/\">Atom</a>时还是内测版本，基本没法正常使用，直到<a href=\"https://github.com/\">Github</a>于<code>2015-06-25</code>宣布了<a href=\"https://atom.io/\">Atom</a>的第一个正式版，我只看了一下午，就直接叛变了"
---
{% include JB/setup %}

我做了2年多的[sublime text](http://www.sublimetext.com/3)死忠粉，为了能高尚的用它，还督促公司买了[sublime text](http://www.sublimetext.com/3)的企业版license。第一次看到[Atom][atom-url]时还是内测版本，基本没法正常使用，直到[Github][github-url]于`2015-06-25`宣布了[Atom][atom-url]的第一个正式版，我只看了一下午，就直接叛变了。

但是，在面对[Atom][atom-url]屌爆的插件系统时，我哭了，因为强大的那些个原因，我几乎一个插件都安装不上，但是作为一个程序员，我们不能怨天尤人，不能摇头摆尾、爬来爬去，我们必须用自己勤劳的双手来追寻梦寐以求的答案！

并且作为一个前端，我得负责任的把我探索过的最优配置分享给诸位！

OK，废话说完，我们开始吧


#### 下载

来，孩子，看这里: [Atom 下载][atom-url]，不出意外的话，当你打开链接地址后，网站会自动侦测出你的操作系统并且提供你合适的版本供你下载，如下图：

![]({{ BASE_PATH }}/assets/images/atom_config_example01.png)

#### 安装

按照你的经验与知识，一路`下一步`直到完成吧!

#### 科学安装插件

由于众所周知的原因，所有的[apm][apm-url]插件或许都不能正常安装，无论是通过[atom](https://atom.io)里的可视化插件管理器还是直接通过`terminal`安装。这不得不耗我一点时间去看下[Atom][atom-url]的插件系统到底是基于什么原理的。

值得高兴的是，也不费劲，[relation-to-npm](https://github.com/atom/apm#relation-to-npm)这个章节解释了[atom][atom-url]插件实际就是`node modules`，那太好了，接下来就是看看这个所谓的插件管理工具([apm][apm-url])到底是怎么运作的了。

所幸的是，上面提到的文章里也指明了，我们可以简单的把[apm][apm-url]看成是[npm][npm-url]的一个wrapper。虽然上述文档中明确提到[apm][apm-url]没有使用`registry`机制，而是直连了[Github][github-url]，抱歉，这部分内容我还没有时间深刻研究。只能给出我的测试结果，实际上通过修改registry到[淘宝npm镜像](http://npm.taobao.org/)确实可以解决安装插件有时特别慢的问题，虽然关于这个结果我也很奇怪，但确实可行。

> 当然通过代理，或者VPN也是比较好的办法了。

在`terminal`下运行如下命令，避开防火墙设置:

```bash
apm config set strict-ssl false
```

修改registry到[淘宝npm镜像](http://npm.taobao.org/)

```bash
apm config set registry https://registry.npm.taobao.org
```

> 如果需要删除该镜像设置，使用：`apm config delete registry`


#### 安装前端开发环境所需插件

```bash
curl -L http://leftstick.gitcafe.io/assets/scripts/atom_plugin.sh | sh
```

**使用非模块化linting预设**

```bash
cat ~/.eslintrc_browser > ~/.eslintrc
```

> 该预设通常为浏览器端运行的历史遗留项目使用

**使用模块化linting预设**

```bash
cat ~/.eslintrc_node > ~/.eslintrc
```

上面脚本执行完成后，以下插件会被自动安装并完成配置：

- [minimap](https://atom.io/packages/minimap)
- [linter](https://atom.io/packages/linter)
- [linter-eslint](https://atom.io/packages/linter-eslint)
- [highlight-selected](https://atom.io/packages/highlight-selected)
- [file-icons](https://atom.io/packages/file-icons)
- [esformatter](https://atom.io/packages/esformatter)
- [emmet](https://atom.io/packages/emmet)

#### 大功告成

让我们重启下[Atom](https://atom.io)，然后试试这酷炫的前端开发环境吧

> 中文问题已经在`1.2.0`中解决，详见：[RELEASE-NOTR](https://atom.io/releases)

[apm-url]: https://github.com/atom/apm
[atom-url]: https://atom.io/
[npm-url]: http://npmjs.org/
[github-url]: https://github.com/
