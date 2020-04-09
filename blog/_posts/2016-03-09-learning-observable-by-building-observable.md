---
title: "[译]做中学observable"
date: 2016-03-09
author: Howard Zuo
location: Shanghai
tags: 
  - Rx
  - Reactive Programming
  - observable
---


在最近的社交媒体、活动中，我常被问及关于“hot” vs “cold” `observables`的问题，或者`observable`到底是“multicast”还是“unicast”。人们似乎为`Rx.Observable`内部的黑魔法所困。当被要求介绍一下`observable`时，常听到“那就是些`Stream`”，或“就像是`Promise`”。而且，我本人也在各种场合的公开演讲中使用过这类说辞。

和`Promise`的比较是必然、但不准确的。假设`Promise`和`Observable`都是异步的，而且`Promises`已经被广泛使用、并且为JavaScript社区所熟知，这的确是个不错的切入点。拿`Promise`的`then`和`Observable`的`subscribe`做对比，看看`立即执行`和`延迟执行`的差异；看看撤销机制和复用机制。。。通过这些比较向初学者介绍`Observable`。

但有个问题就是：`Observables`和`Promises`相比，差异大于相似。`Promise`永远是multicast。`Promise`的`resolution`和`rejection`永远是异步的。所以当人们开始以使用`Promise`的思维来处理`Observable`的代码时，所期待的结果并不都是成立的。`Observable`可能是multicast，可能是异步，但不代表全部情况。我开始有些自责关于之前人们对`Observable`认识不准确这件事上的推波助澜了。


### `Observable`就是一个函数，她接受一个`Observer`作为参数然后返回另一个函数 ###

如果你真想了解`Observable`，最佳手段是自己写一个。说实话，也没有想象中那么难。一个`Observable`，说白了，就是一个有着特殊用途的函数。

我们来看下她基本特征:

* 是个函数
* 接受一个`Observer`(一个包含`next`、`error`和`complete`方法的对象)作为参数
* 返回一个`unsubscribe`函数

再来看下她的目的：

使`Observer`联通一个`Producer`，然后返回一个可以挂断与`Producer`联通关系的函数。`Observer`可被当作一个注册机处理程序。


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

### `SafeObserver`：写更好的`Observer` ###

当我们讨论`RxJS`或者`Reactive Programming`时，`Observable`常常首先映入眼帘。但实际上，`Observer`才是那个干重活儿的人。`Observable`是懒汉，她就是一个函数，杵在那里等人`subscribe`，她加载好`Observer`，就结束任务，又百无聊赖等待被临幸了。另一方面，`Observer`一只保持活跃，不断从`Producer`那里接收消息。

从现在起，你可以使用包含了`next`、`error`和`complete`方法的POJO(Plain-Old JavaScript Object)来subscribe `Observable`，但写区区一个POJO不过是开始。在`RxJS`5里，我们会提供一些保障机制给开发者，下面就是一些比较重要的保障原则：

1. 传入的`Observer`对象可以不实现所有规定的方法
2. 在`complete`或者`error`触发之后再调用`next`方法是没用的
3. `unsubscribe`后，任何方法都不能再被调用了
4. `complete`和`error`触发后，`unsubscribe`也会自动调用
5. 当`next`、`complete`和`error`出现异常时，`unsubscribe`也会自动调用以保证资源不会溢出/浪费
6. `next`、`complete`和`error`是可选的。按需处理即可，不必全部处理。

为了完成上述目标，我们得把传入的匿名`Observer`对象封装在一个`SafeObserver`里以提供上述保障。例如第2项，我们要跟踪`complete`或`error`是否被调用。再比如第3项，我们得知道consumer什么时候要`unsubscribe`。最后，再看第4项，我们还得知道`unsubscribe`的逻辑，以便在`complete`或`error`之后帮用户完成`unsubscribe`操作。

如果我们想对上面那个简陋的`Observable`进行安全性改造，代码一定变得和屎一样。不信可以自己到[JSBin](http://jsbin.com/kezejiy/2/edit?js,console,output)感受一下。我就不把那个鄙陋的实现放在这里了，文章显得太长没法读了。但我们还是可以看看，用了`SafeObserver`后，我们的`Observable`变成什么样儿了：


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

### 改进`Observable`：更好的`SafeObserver` ###

将`Observable`声明为class/object，让其接受一个函数作为构造器参数，这个函数以`SafeObserver`作为参数，以此向开发人员提供更友好的用法。因为在`Observable`的`subscribe`实现中控制了`SafeObserver`的创建过程，`Observable`可以书写成如下简单格式：

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

你会发现，上面的代码和我们第一次写的非常相似。但她更易于阅读和理解。我在之前的例子([JSBin](http://jsbin.com/depeka/5/edit?js,console,output))里增加了最精简版本的`Observable`实现

### `Operators`：也是函数 ###

`Operator`在`RxJS`像是这样一种函数，她接收一个`Observable`，然后返回一个新的`Observable`，当`subscribe`返回的那个新的`Observable`时，她内部会自动`subscribe`前一个`Observable`。我们来简单实现一个独立的`Operator`，看这儿[JSBin](http://jsbin.com/xavaga/2/edit?js,console,output)：

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

关于`Operator`最重要也最值得注意的是：当你`subscribe`她返回的的那个新的`Observable`时，她创建了一个`mapObserver`来做最终工作，并将其与前一个`Observer`链了起来。构建`Operator`链式结构，简单点说就是创建了一个模板在`Subscription`时把`Observers`链在一起。


### 改进`Observable`：让`Operator`的链式帅起来 ###

如果把`Operator`都写成如上那种独立的函数，我们链式代码会逐渐变丑：

```javascript
map(map(myObservable, (x) => x + 1), (x) => x + 2);
```

现在对着上面的代码，想象一下有5、6个嵌套着的`Operator`，再加上更多、更复杂的参数。基本上就没法儿看了

你也可以试下[Texas Toland](https://twitter.com/AppShipIt/status/701806357012471809)提议的简单版管道实现，合并压缩一个数组的`Operator`并生成一个最终的`Observable`，不过这意味着要写更复杂的`Operator`，上代码：[JSBin](http://jsbin.com/vipuqiq/6/edit?js,console,output)。其实写完后你会发现，代码也不怎么漂亮：

```javascript
pipe(myObservable, map(x => x + 1), map(x => x + 2));
```

理论上，我们想将代码用更自然的方式链起来：

```javascript
myObservable.map(x => x + 1).map(x => x + 2);
```

所幸，我们已经有了这样一个`Observable`类，我们可以利用她在不增加复杂度的情况下完成多`Operators`的链式结构，不过之前的例子没有是用到牛逼的prototype，下面我们采用prototype方式再次实现一下`Observable`，([JSBin](http://jsbin.com/quqibe/edit?js,console,output))：

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

牢记，读完了上面所有内容，所有的设计都是基于一个简单函数。`Observable`就是函数，她接受`Observer`作为参数，又返回一个函数。再没别的了。如果你写了一个函数，接受一个`Observer`作为参数，又返回一个函数，那么，她是异步的、还是同步的？都不是。她就是个函数。任何函数的行为都依赖于她具体的实现内容。所以当你处理一个`Observable`时，就把她当成一个普通函数，里面没有什么黑魔法。当你要构建`Operator`链时，你做的其实就是生成一个函数将一堆`Observers`链在一起，然后让真正的数据依次穿过他们。

>注意：上面我们给出的`Observable`实例实现依旧返回一个函数，但`RxJS`和`es-observable`返回的是`Subscription`对象。`Subscription`对象是更好的设计，但我恐怕得专门写篇关于她的文章。我在这里返回一个撤销订阅`unsubscribe`的函数仅仅是为了保持例子在一个简单易懂的范围。


原文地址：[Learning Observable By Building Observable](https://medium.com/@benlesh/learning-observable-by-building-observable-d5da57405d87#.7m5mee38d)
