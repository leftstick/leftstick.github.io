---
layout: post
title: "[译]做中学observable"
description: ""
category: "tech"
tags: ["Rx", "Reactive Programming", "observable"]
shortContent: "在最近的社交媒体、活动中，我常被问及关于“hot” vs “cold” observables的问题，或者observable到底是“multicast”还是“unicast”。人们似乎为`Rx.Observable`内部的黑魔法所困。当被要求介绍一下observable时，人们常说：“那就是些Streams”，或“就像是Promises”。而且，我本人也在各种场合的公开演讲中使用过这类说辞。"
---
{% include JB/setup %}


在最近的社交媒体、活动中，我常被问及关于“hot” vs “cold” `observables`的问题，或者`observable`到底是“multicast”还是“unicast”。人们似乎为`Rx.Observable`内部的黑魔法所困。当被要求介绍一下`observable`时，人们常说：“那就是些`Streams`”，或“就像是`Promises`”。而且，我本人也在各种场合的公开演讲中使用过这类说辞。

基于`Promises`和`Observables`都是以异步为主体，而且`Promises`已经被广泛使用、并且为JavaScript社区所熟知的事实，与`Promises`相比较是个绝佳的切入点。拿`Promise`的`then`和`Observable`的`subscribe`做对比，看看`立即执行`和`延迟执行`的差异；看看撤销机制和复用机制。。。通过这些比较向初学者介绍`Observable`。

但还有个问题：`Observables`和`Promises`相比，差异大于相似。`Promise`永远是多播(multicast)。`Promise`的`解决(resolution)`和`驳回(rejection)`永远是异步。所以当人们开始以使用`Promise`的思维来处理`Observable`代码时，所期待的结果并不都是成立的。`Observable`可能是多播(multicast)，也可能是异步，但不代表全部。我有些自责关于人们对`Observable`认识不准确这件事上的推波助澜。


### `Observable`就是一个函数，她接受一个`Observer`作为参数然后返回另一个函数 ###

如果你真想了解`Observable`，最佳手段是自己写一个。说实话，也没有你想象中那么难。一个`Observable`，说白了，就是一个有着特殊用途的函数。

我们来看下她基本特征:

* 函数
* 接受一个`Observer`(一个包含`next`、`error`和`complete`方法的对象)作为参数
* 返回一个`撤销`函数

再来看下她的目的：

使`Observer`联通一个数据生产者，然后返回一个可以挂断与数据生产者联通关系的函数。`Observer`可被当作一个注册机处理程序。


基本实现如下：

```javascript
function myObservable(observer) {
    const datasource = new DataSource();
    datasource.ondata = (e) => observer.next(e);
    datasource.onerror = (err) => observer.error(err);
    datasource.oncomplete = () => observer.complete();
    return () => {
        datasource.destroy();
    };
}
```

(当然你也可以自己试试：[JSBin](http://jsbin.com/yazedu/1/edit?js,console,output))

如你所见，也没多少内容，so easy！

### 安全的`Observer`：写更好的`Observer` ###

当我们讨论`RxJS`或者`Reactive Programming`时，`Observable`常常首先映入眼帘。但实际上，`Observer`才是那个干重活儿的。`Observable`是懒汉，她就是一个函数，杵在那里等人`订阅`(subscribe)，她加载好`Observer`，就结束任务了，然后就又变回了等待被召唤的无聊函数。另一方面，`Observer`一只保持活跃，不断从生产者那里接收消息。

你可以使用包含了`next`、`error`和`complete`方法的POJO(Plain-Old JavaScript Object)对象来订阅`Observable`，不过这仅仅是开始。在`RxJS`5里，我们会提供一些保证机制，如下：

1. 你传入的`Observer`即便没有实现所有的方法，也没关系！
2. 你在`complete`或者`error`之后再调用`next`方法，是没用的
3. 撤销订阅后，任何方法都不会再被调用了
4. `complete`和`error`被调用后，要撤销订阅(unsubscription)
5. 当`next`、`complete`和`error`出现异常时，你有机会撤销订阅以保证不会资源不会溢出/浪费
6. `next`、`complete`和`error`是可选的。没必要处理所有值，完成时或者错误。按需处理即可

为了完成上述目标，我们要封装一个“安全的`Observer`”以提供这些保证。例如第2项，我们要跟踪`complete`或`error`是否被调用。在比如第3项，我们得知道消费者(consumer)什么时候要撤销订阅。最后，再看第4项，我们还得知道撤销订阅的逻辑，以便在`complete`或`error`之后帮用户完成撤销订阅操作。

如果仅仅是改造我们上面写的那个简单的`Observable`实现，代码一定变得和屎一样。不信？你可以自己到[JSBin](http://jsbin.com/kezejiy/2/edit?js,console,output)试试，这么写到第有多屎。我极其不乐意用这种方案。但我们还是可以看看，用了“安全的`Observer`”后，`Observable`成了什么样儿：


```javascript
function myObservable(observer) {
    const safeObserver = new SafeObserver(observer);
    const datasource = new DataSource();
    datasource.ondata = (e) => safeObserver.next(e);
    datasource.onerror = (err) => safeObserver.error(err);
    datasource.oncomplete = () => safeObserver.complete();

    safeObserver.unsub = () => {
        datasource.destroy();
    };

    return safeObserver.unsubscribe.bind(safeObserver);
}
```

### 设计`Observable`：友好实现`Observer`的安全保障 ###

以class/object写`Observable`，让其接受一个传入安全的`Observer`的`subscribe`函数，并提供对开发者友好的用法。因为在`Observable`的`subscribe`实现中控制了安全的`Observer`封装的创建过程，`Observable`可以书写成如下简单格式：

```javascript
const myObservable = new Observable((observer) => {
    const datasource = new DataSource();
    datasource.ondata = (e) => observer.next(e);
    datasource.onerror = (err) => observer.error(err);
    datasource.oncomplete = () => observer.complete();
    return () => {
        datasource.destroy();
    };
});
```

你会发现，上面的代码和我们第一次写的非常相似。但她更易于阅读和理解。大家可以在[JSBin](http://jsbin.com/depeka/5/edit?js,console,output)看一下`Observable`实现上的区别(我按照上述要求加了一个最小的`Observable`实现)

### 操作者(operator)：也是函数 ###

操作者(operator)在`RxJS`中还接收一个原始的`Observable`，然后返回一个新的`Observable`，当你订阅(subscribe)新的`Observable`时，她内部会自己订阅原始`Observable`的。我们来简单实现一下，还是在[JSBin](http://jsbin.com/xavaga/2/edit?js,console,output)里：

```javascript
function map(source, project) {
    return new Observable((observer) => {
        const mapObserver = {
            next: (x) => observer.next(project(x)),
            error: (err) => observer.error(err),
            complete: () => observer.complete()
        };
        return source.subscribe(mapObserver);
    });
}
```

关于操作者(operator)最重要也最值得注意的是：当你订阅(subscribe)她返回的的那个新的`Observable`时，她创建了一个`mapObserver`，并将`Observer`和`mapObserver`链了起来。构建操作员(operator)链式结构，简单点说就是创建了一个模板把`Observers`连接在一起。


### 设计`Observable`：让操作员(operator)的链式帅起来 ###

如果把操作员(operator)都写成如上那种独立的函数，我们链式结构会变丑：

```javascript
map(map(myObservable, (x) => x + 1), (x) => x + 2);
```

现在对着上面的代码，想象一下有5、6个嵌套着的操作员(operator)，再加上更多、更复杂的参数。基本上就没法儿看了

你也可以试下[Texas Toland](https://twitter.com/AppShipIt/status/701806357012471809)提议的简单版管道实现，合并压缩一个数组的操作员(operator)并生成一个最终的`Observable`，不过这意味着要写更复杂的操作员(operator)，上代码：[JSBin](http://jsbin.com/vipuqiq/6/edit?js,console,output)。其实写完后你会发现，代码也不怎么漂亮：

```javascript
pipe(myObservable, map(x => x + 1), map(x => x + 2));
```

理论上，我们想将代码用更自然的方式链起来：

```javascript
myObservable.map(x => x + 1).map(x => x + 2);
```

所幸，我们已经有了这样一个`Observable`类。她不增加现有操作元(operator)实现的复杂度，不过我猜这会以龌龊的prototype作为代价，下面看看使用我们的新实现([JSBin](http://jsbin.com/quqibe/edit?js,console,output))后，链式调用操作员(operator)会是什么样子：

```javascript
Observable.prototype.map = function (project) {
    return new Observable((observer) => {
        const mapObserver = {
            next: (x) => observer.next(project(x)),
            error: (err) => observer.error(err),
            complete: () => observer.complete()
        };
        return this.subscribe(mapObserver);
    });
};
```

现在我们终于有了一个还不错的实现。这样实现还有其他好处，例如：可以写子类继承`Observable`(比方说：封装`Promise`或静态值)，然后在子类中重写某些内容以优化程序。


### 嫌长别看：`Observable`就是函数，她接受`Observer`作为参数，又返回一个函数 ###

牢记，读完了上面所有内容，所有的设计都是基于一个简单函数。`Observable`就是函数，她接受`Observer`作为参数，又返回一个函数。再没别的了。如果你写了一个函数，接受一个`Observer`作为参数，又返回一个函数，那么，她是异步的、还是同步的？都不是。她就是个函数。任何函数的行为都依赖于她具体的实现内容。所以当你处理一个`Observable`时，就把她当成一个普通函数，里面没有什么黑魔法。当你要构建操作员(operator)链时，你做的其实就是生成一个函数将一堆`Observer`链在一起，然后让真正的数据依次穿过他们。

>注意：上面我们给出的`Observable`实例实现依旧返回一个函数，但`RxJS`和`es-observable`返回的是`Subscription`对象。`Subscription`对象是更好的设计，但我恐怕得专门写篇关于她的文章。我在这里返回一个撤销订阅`unsubscribe`的函数仅仅是为了保持例子在一个简单易懂的范围。
