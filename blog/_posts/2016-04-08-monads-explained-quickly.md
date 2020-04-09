---
title: "[译]浅入浅出Monads"
date: 2016-04-08
author: Howard Zuo
location: Shanghai
tags: 
  - functional programming
  - Monads
---

大多数关于`monad`的教程都和老太太的裹脚布一样，又臭、又长，说不清、道不明。当然我也不伟大，没法保证我写的一定更明了，更生动，甚至更屌？不过我至少可以确定，我这篇更简洁。浪费不了你多少时间的！

废话不多说，先看下面这个对象`Foo`。她就是个`monad`。你必定会吃惊道：我擦，这是什么意思？不要急，故事要从头说，我们还是先来分析下`Foo`到底是怎么干活的：

```javascript
function Foo(value) {
    this.get = ()=> value;
    this.map = fn => {
        let result = fn(value);
        return new Foo(result);
    };
}
```

`Foo`接受了一个`value`，而且一直都没改变她的值。`Foo`里提供了一个`get`方法使得外部调用者可以获取`value`，还有一个牛逼的方法叫`map`。`map`接受另一个函数(`handler`)作为参数，然后用接受的这个新函数`handler`处理`value`，将结果再次传给`Foo`，最后将实例化的新`Foo`对象返回。

因为`map`返回一个`Foo`的实例，于是`map`的方法是可以被链式调用的：

```javascript
let one = new Foo(1);
let two = one.map(x => x + 7).map(x => x / 2).map(x => x - 2);
two.get() === 2;
```

链式调用high不 high？她允许我们可以按照期望，对`x`执行顺序操作，这种更“自然”的风格绝对比下面这种疯狂嵌套的风格要好：

```javascript
//嵌套组合的方式长这个样子，
//我们必须从右向左读，才能得出结论
//而且你说实话，这风格，你喜欢么？
let two = minusTwo(divideByTwo(addSeven(1)));
```

而且每一个步骤里处理`value`到下一个`Foo`实例的逻辑我们都可以抽离出去。

再来看看另一个`monad`，我们姑且称之为`Bar`吧：

```javascript
function Bar(value) {
  this.get = ()=> value;
  this.map = fn => {
      let result = fn(value);
      console.log(result);
      return new Bar(result);
  };
}
```

如果这时候我有一系列操作想顺序作用在`value`上，而且还要在每次变化时打印出来新的`value`，就可以利用`Bar`把下面这种原始的，二逼的代码：

```javascript
let stepOne = something(1);
console.log(stepOne);
let stepTwo = somethingElse(stepOne);
console.log(stepTwo);
let stepThree = somethingDifferent(stepTwo);
console.log(stepThree);
```

重构成下面这种优雅的，高端的样子了：

```javascript
new Bar(1)
  .map(something)           // console >> logs new value
  .map(somethingElse)       // console >> logs new value
  .map(somethingDifferent); // console >> logs new value
```

**现在你应该懂什么是`monads`了**。我完成诺言了哦！`Monads`可以粗略的归纳出下面这些规则：

1. `monad`总会包含一个值
2. `monad`有一个`map`方法，而且该方法会接受一个函数(`handler`)作为参数
3. `map`通过上一步提到的`handler`处理`value`(还可能有些其他逻辑)，并获取其结果
4. `map`最后返回一个`new [Monad]`，以完成链式调用

目前能想到的就这些了。如果上述的例子你都理解了，那你就懂什么是`Monads`了。如果你还再等什么黑魔法或者惊奇算法，那抱歉了，还真没有！

理论上，我们任意修改`map`的实现，任何可以在各步骤`handler`之间的逻辑都行 － 例如：决定传什么内容到下一步，或者对上一步`handler`处理的结果做点儿什么。

空值检查就是个不错的例子：

```javascript
function Maybe(value) {
  this.get = ()=> value;
  this.map = fn => {
      if (value === null) {
          return new Baz(null);
      } else {
          return new Baz(fn(value));
      }
  };
}
```

这个实现里，`map`只在`value`为合法值(非空)时，传入`handler`。否则就只返回一个自身的copy。利用上面的非空检查的`Monad`函数`Maybe`，我们可以把下面这个冗长矬的代码：

```javascript
let connection = getConnection();
let user = connection ? connection.getUser() : null;
let address = user ? user.getAddress() : null;
let zipCode = address ? address.getZip() : null;
```

重构成这个样子：

```javascript
let zipCode =
    new Maybe(getConnection())
    .map(c => c.getUser())
    .map(u => u.getAddress())
    .map(a => a.getZip());

//最后得到的要么是真正的zipCode(每一步都正确处理)
//要么就是个null
zipCode.get();
```

希望今天的说教已经说明了`monads`和她的`map`方法为什么这么牛逼了！关于这点，我倒是不怀疑你也能自己想出来^^

还有其他很多种`monads`，都有不同的用法和用途。但不论怎么变化，她们也都和`Foo`、`Bar`一样遵守上面提到的规则。

掌握了这些技巧，你基本就可以装做一个会写函数式的“牛人”了！

原文地址：[Monads Explained Quickly](http://www.breck-mckye.com/blog/2016/04/monads-explained-quickly/)
