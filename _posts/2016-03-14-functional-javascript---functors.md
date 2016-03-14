---
layout: post
title: "[译]函数式JavaScript之Functors"
description: ""
category: "tech"
tags: ["functional programming", "functors"]
shortContent: "函数式编程大行其道的今天，谁的代码里要是没有点儿函数式的思想，都感觉比别人矮了一截。函数式编程了有好多概念是其他语言习惯编写者不太熟悉的，那么我们今天就从<code>Functors</code>讲起"
---
{% include JB/setup %}


## Functors ##

先看看如下代码：

```javascript
function plus1(value) {  
    return value + 1;
}
```

这就是一个普通函数`F`，接收一个数值作为参数，再加1返回。类似的，我们还能再来一个加2的函数。稍后我们会用到这几个函数：

```javascript
function plus2(value) {  
    return value + 2;
}
```

下面我们来写一个如下的组合函数，来按需执行上述函数

```javascript
function F(value, fn) {  
    return fn(value);
}

F(1, plus1) ==>> 2
```

当传入正确的`integer`参数时，这个组合函数`F`工作正常，那如果传入的数据类型是`Array`呢？

```javascript
F([1, 2, 3], plus1)   ==>> '1,2,31'
```

我擦，我们给了一个`Array of integers`，想让她们和`plus1`中的数值相加，结果返回的是个`string`?！结果不对不说，我们是以`Array`开头儿的，结果返回一个`string`，类型也没对上啊！换句话说，我们这个程序把输入的结构也给整岔劈了。我们还是希望函数`F`能做“正确的事儿”－维护输入参数的数据结构，并使其被各`handler`正确处理。

OK，我这儿说的“维护输入参数的数据结构”是？这个函数`F`应该把传入的`Array`拆开并得到其中的每一个值。然后依次交给`handler`处理。然后把`handler`处理后的各个结果再封装成一个新的`Array`，然后返回这个新`Array`。好消息是我这一堆废话说的东西都不用你写了，`JavaScript`已经写好这么一个函数了，她叫`map`

```javascript
[1, 2, 3].map(plus1)   ==>> [2, 3, 4]
```

`map`就是一个`functor`！

`functor`就是一个函数，接收一个数值、一个`handler`，然后做事儿！

再说细点儿

`functor`就是一个函数，接收一个数值、一个`handler`，拆开传入的原始值，得到其中的各个分解后的值，然后调用`handler`依次处理每一个上一步的到的数据，再将处理后的多个数据再封装成一个新的结构体，最后返回这个新的结构体。

这里要注意传入值的类型，拆开后的各个数值可能是原始数据类型，也可能是集合。

而且，最后返回的数据类型也不必一定和传入的数据类型一模一样。在我们上面的例子里，`map`的输入和返回值是一样的数据类型，都是`Array`。返回的数据结构可以是任意结构，只要能分别获取其中的数值即可。所以，假设你有一个函数，接收一个`Array`作为参数，但返回一个包含了`keys`的`Object`，每个`key`都指向一个对应的数值，那这也是一个`functor`。

在`JavaScript`里，`filter`就是一个`functor`，因为她依旧返回一个`Array`，但`forEach`就不是，因为她返回`undefined`。这就是我们说的，`forEach`没有“维护输入参数的数据结构”。

`Functors`是数学里关于"homomorphisms between categories"的概念，不懂没关系，我们分别换个词儿再读一下：

* homo = 一些、多个
* morphisms = 维护数据结构的函数
* category = 类型

根据上述词汇分析，函数`F`可以看作是两个普通函数`f`和`g`的组合。

```javascript
F(f . g) = F(f) . F(g)
```

其中`.`就是表示组合。即：`functors`必须保存组合特性。

基于这个方程式，我们就能得出一个函数是否是`functor`的结论。


### Array Functor ###

刚才我们看到`map`就是一个操作`Array`的`functor`。下面我们来证明一下`Array.map`就是一个`functor`。


```javascript
function compose(f, g) {
    return function(x) {
        return f(g(x));
    };
}
```

组合多个函数就是通过将前一个函数的执行结果传给后一个函数作为参数的形式来依次调用多个函数。注意：我们上面这个`compose`是从右向左执行的，将`g`的执行结果传给`f`。

```javascript
[1, 2, 3].map(compose(plus1, plus2))   ==>> [ 4, 5, 6 ]

[1, 2, 3].map(plus2).map(plus1)        ==>> [ 4, 5, 6 ]
```

看看！随你怎么写，结果都一样。 所以`map`就是一个`functor`。

下面我们来试试其他`functors`。`functors`传入参数的类型可以是任意类型，只要你有办法拆开她的值，然后返回一个新的数据结构。

### String Functor ###

OK，那我们是不是也可以写一个能处理`string`的`functor`？

先来文个问题，你能“拆开”一个`string`么？  必须的呀(这里如果有疑问，就是你的不对了哦)，如果你把一个`string`当成一个`Array of chars`，是不是可以拆开了？所以啊，问题就在于你是如何思考的。

然后，我们也知道每一个`char`其实都有一个`integer`的`char code`。那我都可以使用上面的`plus1`操作每一个`char`，然后将所有结果封装回`string`，再返回！

```javascript
function stringFunctor(value, fn) {  
    var chars = value.split('');
    return chars.map(function(char) {  
        return String.fromCharCode(fn(char.charCodeAt(0)));
    }).join('');
}

stringFunctor("ABCD", plus1) ==>> "BCDE"
```

开始感受到牛逼之处了么？估计你都能基于`string functor`写一个XX解析器了。


### Function Functor ###

在`JavaScript`中，函数是一等公民(first class citizens)。意思是你可以像其他任何类型那样使用函数。所以我们可以写一个服务于函数的`functor`么？

答案是肯定的！

但怎么拆开一个函数是个问题！简单点儿，你可以直接执行这个函数，然后用她的返回值。不过傻子也知道这肯定有问题(执行是需要参数的)！切记这里我们一定要把传入的函数本身当做那个传入的“值”。明确了这一点，我们只要再返回一个函数，看上去就是`functor`了吧？当这个返回的函数执行时，我们传入指定参数，其实她内部是将传入的参数递给`value`函数，再将`value(initial)`的结果传给`fn`，最后的到最终返回值。

```javascript
function functionFunctor(value, fn) {
    return function(initial) {
        return function() {
            return fn(value(initial));
        };
    };
}

var init = functionFunctor(function(x) {return x * x}, plus1);
var final = init(2);
final() ==> 5
```

说白了，上面这个`Function functor`没做什么特别的事。但要注意的是，除非你最终执行该`functor`，否则什么事都不会发生哦！所有东西都被暂存起来，直到你执行最终`functor`。由`Function functor`可以衍生出来其他函数式编程的内容，譬如：状态维护、连续调用甚至是`Promise`。有兴趣的，可以自己尝试根据已学知识来把这几个概念实现一下。


### MayBe Functor ###

```javascript
function mayBe(value, fn) {
    return value === null || value === undefined ? value : fn(value);
}
```

看，这也是个合法的`functor`。

```javascript
mayBe(undefined, compose(plus1, plus2))     ==>> undefined
mayBe(mayBe(undefined, plus2), plus1)       ==>> undefined
mayBe(1, compose(plus1, plus2))             ==>> 4
mayBe(mayBe(1, plus2), plus1)               ==>> 4
```

`mayBe`通过了我们上面的测试。这儿还真没有什么拆开和重新封装。如果传入是空，那返回也是空。`mayBe`是一中简单有效的路径选择函数，和一下这种写法相同：

```javascript
if (result === null) {
    return null;
} else {
    doSomething(result);
}
```

### Identity Function ###

```javascript
function id(x) {
    return x;
}
```

上面这个就是所谓的`identity function`。她就把传入的参数又返回了一遍。她就是这么叫的，我也没辙，因为在数学计算里，这就表示组合函数的ID。

前面我们学了`functor`就是要保存组合特性。其实`functor`也得保存她的`identity`。

```javascript
F(value, id) = value
```

我们来拿`map`试一下

```javascript
[1, 2, 3].map(id)    ==>>  [ 1, 2, 3 ]
```

### Type Signature ###

`Type Signature`声明了一个函数的参数及返回值的形态。那之前我们写的`plus1`函数的`Type Signature`就是：

```haskell
f: int -> int
```

`map`作为`functor`，她的`Type Signature`依赖于`handler`的`Type Signature`。譬如：`map`和`plus1`组合使用的话，她的`Type Signature`是：

```haskell
map: [int] -> [int]
```

不过，由于`handler`的`Type Signature`不必前后一致，如下：

```haskell
f: int -> string
```

那`map`的`Type Signature`也可以是：

```haskell
map: [int] -> [string]
```

这就是说，类型变化不会影响`functor`的函数组合特性。一般来说，`functor`的`Type Signature`可以这么定义：

```haskell
F: A -> B
```

举例说，就是`map`可以传入数值数组，但是却返回一个字符串数组，她依旧是`functor`。

`Monads`是一种特殊类型的`functor`，定义如下：

```haskell
M: A -> A
```

更多内容，且看下回分解！
