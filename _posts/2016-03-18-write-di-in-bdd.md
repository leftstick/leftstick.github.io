---
layout: post
title: "以BDD手写依赖注入"
description: ""
category: "tech"
tags: ["dependency injection", "BDD"]
shortContent: "程序编写过程中，常常面临的困境是写的时候行云流水，运行的时候捶胸捣腿！<br/><br/>那为什么会出现这种状况？编写习惯、或者说编写流程起了决定性因素，譬如：没有测试用例——这表示你在编写时压根儿没想过时刻追踪编写内容的正确性、健壮性；也没考虑过程序如何适应来自PM的花样需求。"
---
{% include JB/setup %}

程序编写过程中，常常面临的困境是写的时候行云流水，运行的时候捶胸捣腿！

那为什么会出现这种状况？编写习惯、或者说编写流程起了重要因素，譬如：没有测试用例——这表示你在编写时压根儿没想过时刻追踪编写内容的正确性、健壮性；也没考虑过程序如何适应来自PM的花样需求。

今天不谈理论，我们就来通过[BDD](https://en.wikipedia.org/wiki/Behavior-driven_development)(行为驱动开发)的模式来完成一个类似`AngularJS`里[依赖注入](https://docs.angularjs.org/guide/di)的简单模块。通过这种方式，我们来感受一下`BDD`对于开发过程的帮助。

## 什么是BDD ##

>**BDD**（行为驱动开发）是第二代的、由外及内的、基于拉(**pull**)的、多方利益相关者的(**stakeholder**)、多种可扩展的、高自动化的敏捷方法。它描述了一个交互循环，可以具有带有良好定义的输出（即工作中交付的结果）：已测试过的软件。

好吧，肯定有人会问“这他妈是人话么”。

那我换个说法，我们需要这样一种编程方式，她从需求出发，描述模块使用的各个场景，并通过测试用例监督其行为；即便一开始无法完成所有预计功能，也可以通过迭代等方式持续交付；而且在需求变更时，也能通过测试用例来确认模块的健壮性。

那么“测试用例”就是其中的关键，常见的BDD测试框架有：[mocha](https://mochajs.org/)，[jasmine](http://jasmine.github.io/)。BDD测试框架的代码有极鲜明的声明式风格，代码是可“读”的！

好了，废话不敢太多，我们这就打马上路。本章所涉源码在此：[naive-dependency-injection](https://github.com/leftstick/naive-dependency-injection)

## 创建项目 ##

```shell
mkdir simple-di; cd simple-di
npm init
```
>`npm init`后，参考下图作答。我们这里使用`mocha`作为测试框架，所以`test command`必须为`mocha`

![]({{ BASE_PATH }}/assets/images/bdd-01.png)

接着来，创建一个源码目录(src)；一个测试用例目录(test)：

```shell
mkdir src test
```

还有，既然在`npm init`时都声明了使用`mocha`作为测试命令，那不装一个`mocha`似乎也说不过去嘛：

```shell
npm install --save-dev mocha
```

到此，各工作目录准备就绪，来试运行一下测试命令吧：

```shell
npm test
```
>因为一个测试用例也没写，所以`0 passing`，完美，没毛病！

![]({{ BASE_PATH }}/assets/images/bdd-02.png)

## 整装待发 ##

准备测试用例：

```shell
touch test/ut.js
```

用你喜欢的工具打开`test/ut.js`，并写入如下内容：

```javascript
'use strict';
var assert = require('assert');
var DI = require('../src/DI');

describe('test dependency injection', function() {
    //TODO：这里后面我们会陆续加入各个cases
});
```

### 需求1：可以注入字面量 ###

我们的第一个需求可以总结出如下特征：

* 她得是一个类(可被实例化)
* 她得有一个注册方法，可以接受两个参数，分别是一个名字、一个字面量
* 她还有一个运行方法，可以像`AngularJS`那样接受一个数组，数组的最后一项是即将被执行的函数，其余都是要被注入到执行函数里的实例名字

从需求出发，我们按照期待模块的“行为”，写出测试用例：

```javascript
it('injecting literal object', function() {
    //她是一个类(可被实例化)
    var app = new DI();
    //她有一个注册方法，可以接受两个参数，分别是一个名字、一个字面量
    app.register('duck', {
        fly: function() {
            return 'flying';
        }
    });

    var msg;
    //她有一个运行方法，接受一个数组，数组的最后一项是即将被执行的函数，其余都是要被注入到执行函数里的实例名字
    app.run(['duck', function(d) {
        msg = d.fly();
    }]);

    assert.equal(msg, 'flying', '字面量注入失败');
});
```

>将以上case放入之前准备好的`test/ut.js`的`TODO`位置

这时候，我们如果运行测试用例(`npm test`)，结果可想而知：

![]({{ BASE_PATH }}/assets/images/bdd-03.png)

第一次解决问题的时候来了，根据错误描述，我们得知“**Cannot find module '../src/DI'**”，解决方法，异常简单，请看

```shell
touch src/DI.js
```

再次运行测试用例(`npm test`)，得到如下结论:

![]({{ BASE_PATH }}/assets/images/bdd-04.png)

这次的问题是“**DI is not a function**”，因为刚才我们仅仅创建了`src/DI.js`文件，并没有提供任何内容，所以当然`not a function`。那我们现在给`src/DI.js`提供一个`function`作为返回值吧：

```javascript
'use strict';

var DI = function() {};

module.exports = DI;
```

继续运行测试用例(`npm test`)，看到如下结论:

![]({{ BASE_PATH }}/assets/images/bdd-05.png)

这次是“**app.register is not a function**”，很好修复该问题，声明一下`register`方法不就好了么，顺便我们可以联想到`app.run`肯定也得`not a function`，也一起补了吧：

```javascript
DI.prototype.register = function(name, inst) {};
DI.prototype.run = function(arr) {};
```

不骄不躁，我们再`npm test`一次：

![]({{ BASE_PATH }}/assets/images/bdd-06.png)

总算入了正题，断言`assert.equal(msg, 'flying', '字面量注入失败');`失败了，因为我们只是声明了要用到的各个方法，并没有写任何实现，那么先从构造函数改起吧：

```javascript
var DI = function() {
    //我们需要一个成员store来保存register方法注册的名字和其对应的实例
    this.store = {};
};
```

二来修改`register`方法：

```javascript
DI.prototype.register = function(name, inst) {
    //将名字和对应的实例存入store
    this.store[name] = inst;
};
```

三来补充`run`方法：

```javascript
DI.prototype.run = function(arr) {
    //1. 数组arr末尾元素的下标
    var lastIndex = arr.length - 1;
    //2. 取出末尾元素，作为待执行函数
    var cb = arr[lastIndex];
    //3. 取出除末尾元素的其它所有元素，为待注入的实例名字列表
    var argsName = arr.slice(0, lastIndex);
    //4. 将上述实例名字列表依次从store中获取对应的实例，组成真正待执行函数的参数列表
    var args = argsName.map(name => this.store[name]);
    //5. 执行第2步取出的函数，并传入第4步的到的参数
    cb.apply(null, args);
};
```

来吧，是时候证明自己了：

![]({{ BASE_PATH }}/assets/images/bdd-07.png)

### 需求2：可以注入class ###

我们的第二个需求是在前一个基础上做增量：

* 她得有一个注册方法，可以接受两个参数，分别是一个名字、一个字面量**或者*class***

有了新的需求，我们也得为新“行为”，添加测试用例：

```javascript
it('injecting class', function() {
    //她依旧是一个类(可被实例化)
    var app = new DI();

    var woman = function() {
        this.cry = function() {
            return 'crying';
        };
    };
    //她依旧有一个注册方法，只不过接受的实例也可以是class
    app.register('woman', woman);
    var msg;
    app.run(['woman', function(w) {
        msg = w.cry();
    }]);

    assert.equal(msg, 'crying', 'failed injecting class');
});
```

代码不改，想来也是不能工作的：

![]({{ BASE_PATH }}/assets/images/bdd-08.png)

因为我们之前没适配过`class`注入的情况，所以这里注入的仅仅是`woman`的类声明，并非`instance`，所以需要对之前的实现进行调整。这时测试用例的好处就体现出来了，修改完`src/DI.js`后，只要再次`npm test`，轻轻松松证明实现是否满足了新需求，又不破坏原来的功能。

我们需要调整的地方，仅仅是`register`方法：

```javascript
DI.prototype.register = function(name, inst) {
    this.store[name] = typeof inst === 'function' ? new inst() : inst;
};
```

运行测试用例(`npm test`)后

![]({{ BASE_PATH }}/assets/images/bdd-09.png)

再次happy

### 需求3：可以根据$inject属性注入实例 ###

我们的第三个需求依旧是在前一个基础上做增量：

* 她有一个运行方法，可以像`AngularJS`那样接受一个待执行函数，而这个函数有一个`$inject`属性，该属性为数组，指定了要注入给待执行函数的实例名字列表

根据新需求，为新“行为”添加测试用例：

```javascript
it('injecting with $inject attr', function() {
    //她依旧是一个类(可被实例化)
    var app = new DI();

    var man = function() {
        this.fight = function() {
            return 'fighting';
        };
    };

    app.register('man', man);
    app.register('cat', {
        action: function() {
            return 'scratch';
        }
    });
    var msg1,
        msg2;

    var exec = function(w, c) {
        msg1 = w.fight();
        msg2 = c.action();
    };
    exec.$inject = ['man', 'cat'];
    //run方法接受一个函数，该函数的$inject属性声明了他的依赖
    app.run(exec);

    assert.equal(msg1, 'fighting', 'failed injecting with $inject attr');
    assert.equal(msg2, 'scratch', 'failed injecting with $inject attr');
});
```

运行测试用例(`npm test`)后，这当然是错的：

![]({{ BASE_PATH }}/assets/images/bdd-10.png)

因为这次我们`run`的，压根不是个数组，而是一个附有`$inject`属性的函数，所以`src/DI.js`的`run`方法源码必须调整：

```javascript
DI.prototype.run = function(arr) {
    var cb,
        argsName,
        args,
        lastIndex = arr.length - 1;
    //传入数组时，一切照旧
    if (Array.isArray(arr)) {
        cb = arr[lastIndex];
        argsName = arr.slice(0, lastIndex);
    } else if (arr.$inject) {//传入函数，并附有$inject属性时，$inject就是argsName
        cb = arr;
        argsName = arr.$inject;
    }
    //剩下照旧
    args = argsName.map(name => this.store[name]);
    cb.apply(null, args);
};
```

又成功的迈进了一步，high不high？

![]({{ BASE_PATH }}/assets/images/bdd-11.png)

### 最后的需求：根据函数反射注入实例 ###

我们的第四个需求也是终极需求，特征如下：

* 她有一个运行方法，可以像`AngularJS`那样接受一个待执行函数，并能仅根据函数本身注入正确的实例

没别的，先补充测试用例：

```javascript
it('injecting with reflection', function() {
    //她依旧是一个类(可被实例化)
    var app = new DI();

    app.register('woman', function() {
        this.cry = function() {
            return 'crying';
        };
    });
    app.register('duck', {
        fly: function() {
            return 'flying';
        }
    });
    var msg1,
        msg2;
    //run方法接受一个函数，该函数仅在参数列表里以变量名表达了依赖关系
    app.run(function(woman, duck) {
        msg1 = woman.cry();
        msg2 = duck.fly();
    });

    assert.equal(msg1, 'crying', 'failed injecting woman');
    assert.equal(msg2, 'flying', 'failed injecting duck');
});
```

不用怀疑，`npm test`之后，一定又错了！

![]({{ BASE_PATH }}/assets/images/bdd-12.png)

回顾我们上一份实现，似乎并没有考虑`run`方法接受的“是一个函数，而且这个函数没有`$inject`属性”这种情况，理论上，再补一个路径选择就好了：

```javascript
DI.prototype.run = function(arr) {
    var cb,
        argsName,
        args,
        lastIndex = arr.length - 1;
    //传入数组时，一切照旧
    if (Array.isArray(arr)) {
        cb = arr[lastIndex];
        argsName = arr.slice(0, lastIndex);
    } else if (arr.$inject) {//传入函数，并附有$inject属性时，$inject就是argsName
        cb = arr;
        argsName = arr.$inject;
    } else {//传入函数，又没有$inject属性时，通过toString反射函数体，利用正则表达式截取依赖列表
        cb = arr;
        argsName = arr
            .toString()
            .match(/\(\s*([a-zA-Z,\s]*)\)/)[1]
            .split(',')
            .map(name => name.trim());
    }
    args = argsName.map(name => this.store[name]);
    cb.apply(null, args);
};
```

世界终于清净下来了！！！

![]({{ BASE_PATH }}/assets/images/bdd-13.png)


## 总结 ##

本章内容就是利用BDD的开发模式，帮我们一步步抽丝剥茧，在需求不断变化的情况下有条不紊的通过重构代码来实现新的内容，而又不破坏之前已实现的逻辑。

可以这么说，有了测试用例，理清BDD思路，妈妈再也不用担心你的代码重构了！
