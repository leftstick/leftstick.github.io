---
layout: post
title: "分分钟教你搭建RESTful API 模拟器"
description: ""
tagline: "与后端解耦开发不是梦"
category: "tech"
tags: ["web", "mock", "RESTful"]
---
{% include JB/setup %}

据说，每一个前端工程师都有周期性的心理焦躁症。在这段时间里，他们不安、牢骚满腹，甚至摇头摆尾、爬来爬去。不是因为那莫名其妙的‘每个月那几天’，就是单纯的伴随着每个开发周期的迭代。可这是为什么？迭代里到底发生了什么使他们如此焦虑？

哥分分钟为你解开疑惑。

我曾经是一名光荣的后端工程师，为我的service、gateway、strategy...骄傲、自豪。那时我目空一切，前端在我眼里不过绘图耳。于是我忽略他们的建议、意见，即便是呐喊，我也权当是个屁，就那么轻轻的给他放了。直到有一天，我自己转行，加入了茫茫的‘绘图’大军，这才意识到，知识的隔阂原来已经浸入骨髓，变之，难矣！

那为什么前端会痛苦？因为他们的工作总是依赖后端的接口，什么‘RESTful API’啦，‘WebSocket’啦，后端不做完，前端就没法开始。可如果前端依赖了后端，前端又会被老板批说“你就不能同步开始么？”，唉，这种事，谁做谁知道！可如果前端去催后端的接口，后端一定鄙视你“画个图怎么那么多事？你先把图画上，等我接口完了，你一连不就OK啦？”，唉，这种事，谁做谁知道！

相信我，哥把一生都奉献在编码上了，鸡同鸭讲的事我见的太多了。在我们这个神奇的行业里，你懂的，不会编程的‘程序员’实际不在少数。那总得饭照吃、活照干吧？前后端脱离，只要接口先约定好，爷不等你后端的实现了行不行？答案自然是肯定的，这就是今天的话题——[webservice-simulator](https://www.npmjs.org/package/webservice-simulator)

有了接口约定，爷还尿你那破实现？谁先做完谁邀功、谁做不完谁滚蛋！道理就这么简单，你别怪哥说话绝哦！

首先，我们安装[sero-cli](https://www.npmjs.org/package/sero-cli)

```powershell
npm install sero-cli -g
```

然后随便找个地方，新建一个叫`routers`的目录(其实叫什么都为所谓，我这里就用`routers`，方便演示)。

```powershell
mkdir routers
```

进入`routers`目录

```powershell
cd routers
```

创建一个叫`helloworld.json`的文件

```powershell
touch helloworld.json
```

将如下内容粘贴到`helloworld.json`里:

```javascript
{
    "when": "/helloworld",
    "method": "get",
    "responseData": {
        "title": "hello",
        "content": "world, i am your uncle"
    }
}
```

退回至`routers`的父目录

```powershell
cd ../
```

启动`sero`

```powershell
sero
```
找到如下图所示的“Launch web service simulator”，回车(所有问题均取默认值)，启动模拟器

![]({{ BASE_PATH }}/assets/images/mockbackend/sero.png)

打开浏览器，输入：`http://localhost:3000/helloworld`，你会看到如下响应数据：

```javascript
{
    "title": "hello",
    "content": "world, i am your uncle"
}
```

更多使用方法： [sero-cli](https://www.npmjs.org/package/sero-cli)