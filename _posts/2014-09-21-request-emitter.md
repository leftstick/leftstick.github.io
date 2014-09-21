---
layout: post
title: "后端工程师从TestPage中解放出来"
description: ""
tagline: "妈妈再也不用担心我写TestPage啦"
category: "tech"
tags: ["web", "TestPage"]
---
{% include JB/setup %}

前后端之争，由来已久，我们这里不讨论谁更牛逼！只谈谈，如何离开了对方，工作照样开展——即：前后端分离。

前些日子写了[分分钟教你搭建RESTful API 模拟器](http://leftstick.github.io/tech/2014/09/10/mockbackend/)，使得前端可以不必依赖后端的`Webservice`实现，有了接口约定，前端就能开工了！前端是爽了，后端呢？

最近一段时间发现很多后端开发人员实际对`http`，`WebService`，`RESTful`，`CORS`这类概念并不熟悉(当然，前端中不懂装懂的也有好多^^)，于是问题产生了，当人们辛辛苦苦的做完了自己的`API`，想本地调试一下，却因为根据前端需求设置了一大堆的什么`header`，`data`而压根不知道该怎么发起这个请求，或者知道个大概，要自己从头开些一个`TestPage`也是没那个心情，但又不得以而为之，人生的痛苦就是，“妈的这事压根和爷没关系，爷还得自己写个`TestPage`，我好好做我自己的逻辑咋就这么难？”

正事儿来了，其实不难，试试[REQUEST EMITTER](http://leftstick.github.io/request-emitter)，操作简单，无本地运行环境需求。


![]({{ BASE_PATH }}/assets/images/requestemitter/website.png)


### 首先，填写你开发的`WebService`或`API`的`URL` ###

![]({{ BASE_PATH }}/assets/images/requestemitter/url.png)

### 选择要发送请求的方法，有如下选择： ###

* GET
* POST
* DELETE
* PUT
* HEAD
* JSONP
* PATCH

![]({{ BASE_PATH }}/assets/images/requestemitter/method.png)

### 填写你需要的`header` ###

![]({{ BASE_PATH }}/assets/images/requestemitter/header.png)


### 发送请求 ###

![]({{ BASE_PATH }}/assets/images/requestemitter/send.png)

### 响应会依次出现在 `HEADER` 下面 ###

![]({{ BASE_PATH }}/assets/images/requestemitter/response.png)


更多功能，自己挖掘：[REQUEST EMITTER](http://leftstick.github.io/request-emitter)