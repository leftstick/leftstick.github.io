---
title: "一步步教你手写Promise"
date: 2015-11-07
author: Howard Zuo
location: Shanghai
tags: 
  - Promise
  - JavaScript
---


 本文中的例子源码在：[promise-tutorial](https://github.com/leftstick/promise-tutorial)

你也可以直接clone：

```bash
git clone https://github.com/leftstick/promise-tutorial.git
```

近几年互联网炙手可热，由此给程序员们带来了极大的刺激(通过市场)。其中最令人羡慕、嫉妒、恨的莫过于前端的火爆。这个以前在IT公司里做最底层技术工作的岗位(又称“页面仔”)，突然一下各种热门，作为前端的我们，是否感到了这个春天了？

说回正题，`Promise`绝非今日才有，规范在这里[Promise/A+](https://promisesaplus.com/)，市面上各种实现鳞次栉比，[jQuery-Promise](http://api.jquery.com/Types/#Promise)、[bluebird](http://bluebirdjs.com/docs/getting-started.html)、[q](http://documentup.com/kriskowal/q/)、[Angular-$q](https://docs.angularjs.org/api/ng/service/$q)...，各种的performance较量，语法糖对比，乱花渐欲迷人眼！但究其核心价值，就是解决`JavaScript`异步编程中的[回调王八蛋(callback hell)](http://callbackhell.com/)。那让我们先来回顾一下，[callback hell](http://callbackhell.com/)是如何给我们造成[技术债务(technical debt)](https://en.wikipedia.org/wiki/Technical_debt)的：

```javascript
step1(function (value1) {
    step2(value1, function(value2) {
        step3(value2, function(value3) {
            step4(value3, function(value4) {
                // Do something with value4
            });
        });
    });
});
```

> 以上片段，摘自[q](http://documentup.com/kriskowal/q/)

然后再来看看，`Promise`又是如何解决的：

```javascript
new Promise(function(resolve, reject){
    step1(resolve);
})
.then(function(value1){
    return step2(value1);
})
.then(function(value2){
    return step3(value2);
})
.then(function(value3){
    return step4(value3);
})
.then(function (value4) {
    // Do something with value4
})
.catch(function (error) {
    // Handle any error from all above steps
})
```

如果看到这里你有任何惊奇的感受，那建议先去看看[Promise介绍](https://www.promisejs.org/)。本文不会围绕在`Promise`“该如何使用”上！我们来聊聊，`Promise`的设计思路和实现方式。

OK，留下的盆友基本已经是"别他妈废话了，赶紧的开始吧，怎么自己手写一个`Promise`出来"！那我要开始喽，`Promise`究竟是如何做到这一点的，又有什么玄机在里面？今天我们无图、无说教，全凭代码探秘`Promise`的傲娇内心世界！

<br/>

#### 初探江湖，`Promise`该长什么样儿？

根据上述代码片段，我们看到`Promise`的核心功能，就是`then`方法，那我们先来个定义吧！

```javascript
'use strict';
var Promise = function(func) {};

Promise.prototype.then = function(onFulfilled, onRejected) {};

module.exports = Promise;
```

> 估计会有盆友风骚的问，为什么没有`success`、`error`、`catch`、`finally`、`done`？其实这些方法作为语法糖出现，是为了帮助用户更好的使用`Promise`，本质上并没有为`Promise`增加额外属性。我们此行要探索的是真谛，请盆友们暂停躁动的心！^^

<br/>

#### 为了一个`then`方法，我们也是拼了

为了一步步可验证我们的代码，带我们走向人生巅峰，[unit test](https://en.wikipedia.org/wiki/Unit_testing)必不可少！来吧，骚年，第一版的`ut`来了：

```javascript
'use strict';
var PPP = require('../Promise');

describe('Promise', function() {
    it('then is called', function(done) {
        var onFulfilled = sinon.spy();
        new PPP(function(resolve, reject) {
            resolve();
        })
        .then(onFulfilled);

        setTimeout(function() {
            //验证下onFulfilled方法是否被调用了
            should(onFulfilled.called).be.true();
            done();
        }, 100);
    });
});
```
>咦！这里一定有盆友问，那个`should`为啥非要等100ms再执行！？理由也简单，因为`Promise`是异步操作，我做了个假设，这些异步操作都会在100ms内执行完毕。

当我们直接运行这条`ut`时，结果可想而知，我们什么还没实现呢，一定是错的！
<img :src="$withBase('/images/promise-ut01.png')" alt="promise01" />


那我们来试着满足下这个`ut`?

```javascript
'use strict';

var Promise = function(func) {
    this._resolve = null;
    var promise = this;

    var resolver = function() {
        //当ut中调用resolve方法时，调用在then里赋值的_resolve
        promise._resolve();
    };

    var rejector = function() {};

    func(resolver, rejector);
};

Promise.prototype.then = function(onFulfilled, onRejected) {
    //`then`被调用时，将`onFulfilled`赋值给this._resolve
    this._resolve = onFulfilled;
};

module.exports = Promise;
```

试试再跑下`ut`
<img :src="$withBase('/images/promise-ut02.png')" alt="promise02" />

<img :src="$withBase('/images/promise-cry.jpg')" alt="promise-cry" />


为什么会这样！？ 我们精心设计的`_resolve`为什么`is not a function`？

哪里有地方不对哦，我们仔细分析下啊：

实例化`Promise`对象时，传入了`func` ->
`func`在传入后就立即执行了 ->  
`func`里又直接调用了`resolver` ->
`resolver` 里调用了 `promise._resolve()`

问题找到了，执行`promise._resolve()`时，`then`压根儿还没执行，也就是说，`promise._resolve`仍然是`null`。

找到问题，那就改进吧，我们是不是只要把`promise._resolve`的调用放到主线程外的任务队列里，等当前执行栈没事做以后，再从任务队列里取出来执行，这样的话`then`方法就在`promise._resolve`之前执行了：

关于`任务队列`、`执行栈`的详细背景，参考这里：[event-loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)

```javascript
'use strict';

var Promise = function(func) {
    this._resolve = null;
    var promise = this;

    var resolver = function() {
        process.nextTick(function() {
            promise._resolve();
        });
    };

    var rejector = function() {};

    func(resolver, rejector);
};

Promise.prototype.then = function(onFulfilled, onRejected) {
    this._resolve = onFulfilled;
};

module.exports = Promise;
```
>`process.nextTick`是个什么鬼？简单说，就是个高效版的`setTimeout`，由于不是今天重点，详情看这里[process.nextTick](https://nodejs.org/api/process.html#process_process_nexttick_callback_arg)

再来跑下`ut`试试吧
<img :src="$withBase('/images/promise-ut03.png')" alt="promise03" />
<img :src="$withBase('/images/promise-happy.jpg')" alt="promise-happy" />


<br/>

#### `chainable`的小心眼儿

盆友们一定又要生气了，“这是个我的大腿，人家的`Promise`都能链式调用，你教我们的这个能吗、能吗、能吗？重要的事儿，问你三遍”。

好吧，既然谈到了`chainable`，那写个`ut`来测一下？

```javascript
'use strict';
var PPP = require('../Promise');

describe('Promise', function() {
    it('chainable with immediately evaluated value returned', function(done) {
        var onFulfilled = sinon.stub().returns('Hello');
        var onFulfilledSec = sinon.spy();

        new PPP(function(resolve, reject) {
            resolve();
        })
        .then(onFulfilled)
        .then(onFulfilledSec);

        setTimeout(function() {
            //验证第一个then的回调被调用了1次
            should(onFulfilled.callCount).be.eql(1);
            //验证第二个then的回调被调用时传入了Hello作为参数
            should(onFulfilledSec.calledWith('Hello')).be.true();
            done();
        }, 100);
    });
});
```
好凄凉的赶脚！她，不work！

<img :src="$withBase('/images/promise-ut04.png')" alt="promise04" />
<img :src="$withBase('/images/promise-crash.jpg')" alt="promise-crash" />


问题略明显，因为我在`Promise`的`then`里只做了赋值，没有返回值。所以当我们要链式调用时，实际上相当于`undefined.then()`，那自然第二个`then`调用就必然失败了。

给个返回值怎么样？

```javascript
'use strict';

var Promise = function(func) {
    this._resolve = null;
    var promise = this;

    var resolver = function() {
        process.nextTick(function() {
            promise._resolve();
        });
    };

    var rejector = function() {};

    func(resolver, rejector);
};

Promise.prototype.then = function(onFulfilled, onRejected) {
    this._resolve = onFulfilled;
    return this;//返回当前Promise
};

module.exports = Promise;
```

结果如何？`onFulfilled`肿么没被执行啊！

<img :src="$withBase('/images/promise-ut05.png')" alt="promise05" />
<img :src="$withBase('/images/promise-hehe.jpg')" alt="promise-hehe" />


莫哭，原因时这样的，`then`里我们这样写的`this._resolve = onFulfilled;`，有感脚了吧，当`ut`里，第二次调用`then`时，实际上在`Promise`里，`_resolve`已经被第二次传入的`onFulfilledSec`覆盖了，所以该`Promise`在执行时，永远只有第二个`onFulfilledSec`被执行。

知错就要改，我们把`_resolve`改成数组吧：

```javascript
'use strict';

var Promise = function(func) {
    this._resolves = [];
    var promise = this;

    var resolver = function() {
        process.nextTick(function() {
            promise._resolves.forEach(function(resolve) {
                resolve();
            });
        });
    };

    var rejector = function() {};

    func(resolver, rejector);
};

Promise.prototype.then = function(onFulfilled, onRejected) {
    this._resolves.push(onFulfilled);
    return this;
};

module.exports = Promise;
```

`onFulfilled`没被执行的问题是解决了，不过`onFulfilledSec`执行时，应该传入`onFulfilled`的返回值这条，又错了。

<img :src="$withBase('/images/promise-ut06.png')" alt="promise-06" />


原因不难分析，我们在执行`_resolves`时，是直接来了个`forEach`，各`resolve`被执行时并没有依赖前一个的执行结果。知错能改，在盆友们哭泣之前，我们再改：

```javascript
'use strict';

var Promise = function(func) {
    this._resolves = [];
    var promise = this;

    var resolver = function() {
        process.nextTick(function() {
            //使用reduce函数，将每次的执行结果传给了下一个函数
            promise._resolves.reduce(function(previous, resolve) {
                return resolve(previous);
            }, undefined);
        });
    };

    var rejector = function() {};

    func(resolver, rejector);
};

Promise.prototype.then = function(onFulfilled, onRejected) {
    this._resolves.push(onFulfilled);
    return this;
};

module.exports = Promise;
```

有木有帅爆了的赶脚？？！

<img :src="$withBase('/images/promise-ut07.png')" alt="promise-07" />


<br/>

#### `then`里面如果返回的也是个`Promise`呢？

来吧，先改`ut`：

```javascript
'use strict';
var PPP = require('../Promise');

describe('Promise', function() {
    it('chainable with promise returned', function(done) {
        var onFulfilled = function() {
            return new PPP(function(resolve, reject) {
                resolve('Hello');
            });
        };
        var onFulfilledSec = sinon.spy();

        new PPP(function(resolve, reject) {
            resolve();
        })
        .then(onFulfilled)
        .then(onFulfilledSec);

        setTimeout(function() {
            //检查onFulfilledSec是否被调用，并且调用时是否传入了Hello作为参数
            should(onFulfilledSec.calledWith('Hello')).be.true();
            done();
        }, 100);
    });
});
```

不用问，按照我们刚才`reduce`的实现方式，这个`ut`一定是跑不过的。那我们就得把`Promise`里的`_resolves`“同步”执行，请看下解：

```javascript
'use strict';

var Promise = function(func) {
    this._resolves = [];
    var promise = this;

    var handler = function(i, previous) {
        if (i === promise._resolves.length) {
            return;
        }
        var result = promise._resolves[i](previous);
        if (result instanceof Promise) {
            result.then(function(data) {
                handler(i + 1, data);
            });
            return;
        }
        handler(i + 1, result);
    };

    var resolver = function(data) {
        process.nextTick(function() {
            handler(0, data);
        });
    };

    var rejector = function() {};

    func(resolver, rejector);
};

Promise.prototype.then = function(onFulfilled, onRejected) {
    this._resolves.push(onFulfilled);
    return this;
};

module.exports = Promise;
```
万岁，离人生巅峰又进一步了！

<img :src="$withBase('/images/promise-ut08.png')" alt="promise-08" />

<img :src="$withBase('/images/promise-right.jpg')" alt="promise-right" />


<br/>

#### 出错了肿么办？看了半天，也没见你写`reject`啊？

没问题，先来改`ut`

```javascript
'use strict';
var PPP = require('../Promise');

describe('Promise', function() {

    it('catch with error message', function(done) {
        var err = new Error('fuck');
        var onFirstCall = sinon.spy();
        var onErrorHandler = sinon.spy();

        new PPP(function(resolve, reject) {
            //reject最初的Promise
            reject(err);
        })
            .then(onFirstCall, onErrorHandler);

        setTimeout(function() {
            //检查onFirstCall是否被调用
            should(onFirstCall.called).be.false();
            //检查onErrorHandler是否被执行，并且调用时是否传入了err作为参数
            should(onErrorHandler.calledWith(err)).be.true();
            done();
        }, 100);
    });

    it('catch with error', function(done) {
        var onFirstCall = sinon.spy();
        var onErrorHandler = function() {
            return new PPP(function(resolve, reject) {
                resolve('I_AM_BACK');
            })
        };
        var onSecondCall = sinon.spy();

        new PPP(function(resolve, reject) {
            reject(new Error('fuck'));
        })
        .then(onFirstCall, onErrorHandler)
        .then(onSecondCall);

        setTimeout(function() {
            //检查onFirstCall一定没有被调用
            should(onFirstCall.called).be.false();
            //检查onSecondCall被调用时传入了I_AM_BACK作为参数
            should(onSecondCall.calledWith('I_AM_BACK')).be.true();
            done();
        }, 100);
    });
});
```
不过`then`方法我们都没处理过`onRejected`参数，先来改改吧：

```javascript
'use strict';

var Promise = function(func) {
    this._resolves = [];
    this._rejectors = [];
    var promise = this;

    var handler = function(i, previous, useRejector) {
        if (i === promise._resolves.length) {
            return;
        }
        var result;
        try {
            result = promise[useRejector ? '_rejectors' : '_resolves'][i](previous);

            //如果运行结果就是Promise，那需要在then时再回调下一个handler
            if (result instanceof Promise) {
                result.then(function(data) {
                    handler(i + 1, data);
                }, function(err) {
                    //如果Promise被reject了，调用下一个rejector
                    handler(i + 1, err, true);
                });
                return;
            }
            //如果不是Promise，直接调用下一个handler，并将结果传入
            handler(i + 1, result);
        } catch (e) {
            //运行时如果有异常，调用下一个rejector
            handler(i + 1, e, true);
        }
    };

    var resolver = function(data) {
        process.nextTick(function() {
            handler(0, data);
        });
    };

    var rejector = function(err) {
        process.nextTick(function() {
            handler(0, err, true);
        });
    };

    func(resolver, rejector);
};

Promise.prototype.then = function(onFulfilled, onRejected) {
    this._resolves.push(onFulfilled);
    this._rejectors.push(onRejected);
    return this;
};

module.exports = Promise;
```

酷，最后一战也成功了！

<img :src="$withBase('/images/promise-confidence.jpeg')" alt="promise-confidence" />

本帖中的[unit test](https://en.wikipedia.org/wiki/Unit_testing)使用[mocha](https://mochajs.org/)编写，其中断言部分使用[shouldjs](http://shouldjs.github.io/)，mock部分使用[sinonjs](http://sinonjs.org/)。

整篇代码基于[nodejs](https://nodejs.org/)环境编写。

同志们，`Promise`的内心世界，我们就探秘到这里吧！不过大家不要so naive的认为这就是一个`Promise`的一切。实际上用于生产化的`Promise`类库还涉及状态控制、参数校验、性能调教等不少内容，但是作为一个使用者，了解本章的内容，也就基本掌握了`Promise`的工作原理，对于我们今后在工作中使用`Promise`将大有裨益。

最后再次强调，本文只为探索`Promise`的实现原理，我尽量使用平实、简洁的方式实现了最最基本的功能，不代表市面上已存在的类库会用相同的写法处理需求，请一定不要参考了某`Promise`实现的源码后来问，为什么和我写的不一样，谢谢！
