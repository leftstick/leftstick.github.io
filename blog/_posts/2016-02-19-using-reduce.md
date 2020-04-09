---
title: "提高逼格，从reduce开始"
date: 2016-02-19
author: Howard Zuo
location: Shanghai
tags: 
  - JavaScript
  - reduce
  - Array
---

### 逼格是什么？ ###

逼格是unique，是与众不同，每个人都想自己是**the one**，程序员也不例外。于是，提高逼格就成了有"有理想、有抱负"的程序员的必修课，有了逼格，你可以傲视群雄，鹤立鸡群，举手投足间都流露出"我，就是不一样"的装逼范儿！

提高之路，从`reduce`开始。

### reduce是什么？ ###

##### 概述 #####

`reduce()`方法接收一个函数作为累加器（accumulator），数组中的每个值（从左到右）开始合并，最终为一个值。

##### 语法 #####

```javascript
arr.reduce(callback,[initialValue])
```

##### 参数 #####

**callback**
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;执行数组中每个值的函数，包含四个参数

**previousValue**
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;上一次调用回调返回的值，或者是提供的初始值（initialValue）

**currentValue**
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;数组中当前被处理的元素

**index**
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;当前元素在数组中的索引

**array**
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;调用 reduce 的数组


以上是来自[MDN-reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)的诠释，可这到底什么意思啊？与逼格何干？

<img :src="$withBase('/images/reduce-01.jpg')" alt="reduce" />


### 命令式编程 ###
有了上面的疑惑，我们先来看一个传统的极简单的求和题目，将如下数据中各披萨的价格求和：

```javascript
var pizzas = [
    {
        name: 'Cheese Lovers',
        price: 59.0
    },
    {
        name: 'Garden Veggies',
        price: 52.0
    },
    {
        name: 'Hawaiian',
        price: 49.0
    }
];
```

何谓“命令式编程”？顾名思义，就是把执行引擎/虚拟机...当成蠢蛋，事必躬亲，手把手指挥机器完成每一个步骤，像以下这样：

```javascript
var sum = 0;

for(var i = 0; i < pizzas.length; i++){
    sum += pizzas[i].price;
}

console.log(sum);//160
```

“命令式编程”好么？当然好！老少咸宜！

但逼格高么？肯定不高，为什么？理由很简单，`for loop`是从上古时代就已经存在的流程控制语句，上到写了20年程序的“老专家”，下至学了1年的小鲜肉都玩得转`for loop`，你哪来的逼格啊？

除了逼格，`for loop`还有没有什么缺点？那必须有，来向下看齐：

* 需要手动创建计数器记录遍历位置(`i`)
* 需要手动获取列表长度(`pizzas.length`)，并以此作为遍历依据
* 需要手动指定遍历方向(正序／逆序)，尽管这里方向并不重要
* 需要手动创建变量记录遍历变化(`sum += pizzas[i].price;`)
* 不仅没了逼格，我们还要被迫做了这么多和业务逻辑“无关”的操作，而做这些的原因仅仅是因为我们觉得“计算机不够聪明”，亦或者是我们自己本身比较low！

你能接受？你能接受？你能接受？
<img :src="$withBase('/images/reduce-02.jpg')" alt="reduce" />


### 声明式编程 ###
既然不能接受上述的“矬”，那就放开心胸，来接受新/别的概念吧！

第一步，放低姿态，别把计算机当成蠢蛋，计算机语言发展至今，连智能机器人都有了，还用上古时代的指挥方式工作，是不是太自大了？

于是我们尝试声明式编程，即告诉计算机我们的目标，而不是流程。对于解决上面的求和问题，`reduce`就是一剂强心针，直戳low B的胸口！

```javascript
//声明一个求和函数，接受两个参数
//augend即是reduce后callback的第一个参数previousValue
//addend即是reduce后callback的第二个参数currentValue
//augend初始值为我们传入的0
//每次计算都从addend中取area值与augend相加，并作为下一次运算时的augend
var add = function(augend, addend){
    return addend.price + augend;
};

var sum = pizzas.reduce(add, 0);

console.log(sum);//160
```

这里我们不再关心刚才“命令式编程”下的那些与业务逻辑无关的东西，专心致志的给出一个求和函数和初始值，然后剩下的事情交给`reduce`去做，它自己知道该怎么做！

声明式的好处是使得变更成本变低，譬如，由于节日将至，店家想为顾客减10块钱，`reduce`分分钟帮你算完，我甚至都不要改求和函数，直接将初始值减了这10块钱就好了：

```javascript
var sum = pizzas.reduce(add, -10);

console.log(sum); //150
```

需求变更太简单，你感觉受伤了？那么来，再变一下，我希望针对不同的pizza打折，看看`reduce`是怎么操作的：

```javascript
//折扣表
var discountMap = {
    'Cheese Lovers': 0.5,
    'Garden Veggies': 0.8,
    'Hawaiian': 0.85
};

//打折程序
var discount = function(augend, addend){
    var newAddend = {
        name: addend.name,
        price: addend.price * discountMap[addend.name]
    };
    return add(augend, newAddend);
};

var sum = pizzas.reduce(discount, 0);

console.log(sum); //112.75
```

我既没有修改原始数组，也没有修改之前的求和函数，只是新增了一个打折函数，然后将其传入`reduce`，内部打折后再调用求和函数计算最终值。(这种方式从设计模式角度讲，叫“装饰者模式”；单从语言风格角度讲，已经略带函数式编程的样子了)

碉堡了有木有？
<img :src="$withBase('/images/reduce-03.jpg')" alt="reduce" />


### 继续仗剑走天涯 ###
有小伙伴儿问了，光求个和，不足以表达我的逼格，`reduce`还能不能再强大一些？

OK，那我们再来个需求，将如下数组拍平：

```javascript
var array = [1, [2, [3 ,4], 5], 6];
```

成单纯一维数组：

```javascript
//[1, 2, 3 ,4, 5, 6]
```

如果是过去low low的你，要怎么做？不外乎又来个`for loop`：

```javascript
var flatten = function(arr){
    var tmp = [];
    for (var i = 0; i < arr.length; i++){
        if (Object.prototype.toString.call(arr[i]) === '[object Array]'){
            Array.prototype.push.apply(tmp, flatten(arr[i]));
            continue;
        }
        tmp.push(arr[i]);
    }
    return tmp;
};

console.log(flatten(array)); //[1, 2, 3, 4, 5, 6]
```

> 我们在此不讨论各种边界检查，所以请不要纠结于这个实现能否用于生产环境

看看，又是临时变量、又是控制遍历过程，活的累不累啊！？

那`reduce`又能帮我们么？答案是肯定的，否则我写这么多干嘛，不废话上代码：

```javascript
var toString = Object.prototype.toString;
var push = Array.prototype.push;

var flatten = function(array){
    var combine = function(arr, item){
        return (toString.call(item) === '[object Array]' ? push.apply(arr, flatten(item)) : arr.push(item), arr);
    };
    return array.reduce(combine, []);
};

console.log(flatten(array)); //[1, 2, 3, 4, 5, 6]
```

> 依然不考虑边界检查，请停止纠结

`reduce`又是接受一个`combine`函数和空数组作为初始值，由`combine`函数完成数组“拍平”的操作，而不去考虑什么遍历问题。

逼格出现了，有木有？


### 终极潇洒 ###

好吧，“拍平”一个数组也满足不了你的欲望，那我只好使出浑身解数，在基于易理解，好演示的原则下，给出我的烧脑之作了。

众所周知，在处理异步任务时，目前最流行的方式就是[Promise][promise-url]了，而[Promise.all][promise-all-url]方法可以轻松的接受多个[Promise][promise-url]，然后任其自由并行执行，待全部[Promise][promise-url]运行结束后，将结果重新收集，返回一个新的[Promise][promise-url]交给用户进行下一步操作。这确实强大。

不过我们有时还有其他需求，比如：我想将一堆[Promise][promise-url]顺序执行，该怎么做呢？

这里我就不展示low B写法了，直接上逼格提升代码：

准备[Promise][promise-url]数组：

```javascript
//返回一个函数，该函数的返回值是一个Promise
var createFunc = function(ms, msg) {
    return function() {
        return new Promise(function(resolve) {
            setTimeout(function() {
                console.log(msg);
                resolve();
            }, ms);
        });
    };
};

//准备一个数组的Promise
var getPromises = function() {
    return [
        createFunc(50, '理论上，这里应该是50ms后打出，应该排第三位，但实际会按顺序第一个显示'),
        createFunc(30, '理论上，这里应该是30ms后打出，应该排第二位，但实际会按顺序第二个显示'),
        createFunc(10, '理论上，这里应该是10ms后打出，应该排第一位，但实际会按顺序第三个显示')
    ];
};
```

展示核心逼格大王：

```javascript
//顺序执行传入的Promise数组，依赖强大的reduce，一句话搞定
var seqPromises = function(arr) {
    return arr.reduce((provious, p) => provious.then(p), Promise.resolve());
};

seqPromises(getPromises())
    .then(function() {
        console.log('这里应该最后一个打出，结束');
    });

//理论上，这里应该是50ms后打出，应该排第三位，但实际会按顺序第一个显示
//理论上，这里应该是30ms后打出，应该排第二位，但实际会按顺序第二个显示
//理论上，这里应该是10ms后打出，应该排第一位，但实际会按顺序第三个显示
//这里应该最后一个打出，结束
```

> 以上seqPromises函数实现包含ES2015语法，如有不懂，自行google

逼格是否从此无极限？好好写代码吧骚年，做一个与众不同的你！

[promise-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[promise-all-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
