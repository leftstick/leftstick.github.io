---
layout: post
title: "[译]JavaScript中的不可变性(Immutability)"
description: ""
category: "tech"
tags: ["immutability"]
shortContent: "不可变性(<code>Immutability</code>)是函数式编程的核心原则，在面向对象编程里也有大量应用。在这篇文章里，我会给大家秀一下到底什么是不可变性(<code>Immutability</code>)、她为什么这么屌、以及在<code>JavaScript</code>中怎么应用。"
---
{% include JB/setup %}

不可变性(`Immutability`)是函数式编程的核心原则，在面向对象编程里也有大量应用。在这篇文章里，我会给大家秀一下到底什么是不可变性(`Immutability`)、她为什么还这么屌、以及在`JavaScript`中怎么应用。


## 什么是不可变性(`Immutability`)？ ##

还是先来看看关于可变性(`Mutability`)的教条式定义：“liable or subject to change or alteration(译者注：真他妈难翻，就简单理解成'易于改变的'吧)”。在编程领域里，我们用可变性(`Mutability`)来描述这样一种对象，它在创建之后状态依旧可被改变。那当我们说不可变(`Immutable`)时，就是可变(`Mutable`)的对立面了(译者注：原谅我翻的废话又多起来) － 意思是，创建之后，就再也不能被修改了。

如果我说的又让你感到诡异了，原谅我小小的提醒一下，其实我们平时使用的很多东西事实上都是不可变的哦！

```javascript
var statement = 'I am an immutable value';
var otherStr = statement.slice(8, 17);
```

我猜没人会吃惊，`statement.slice(8, 17)`并没有改变`statement`变量吧(译者注：如果你吃惊了，赶紧去补基本知识吧)？事实上，`string`对象上的所有方法里，没有一个会修改原`string`，它们一律返回新的`string`。原因简单了，因为`string`就是是不可变的(`Immutable`) - 它们不能被修改，我们能做的就是基于原`string`操作后得到一个新`string`。

注意了，`string`可不是`JavaScript`里唯一内置的不可变(`Immutable`)数据类型哦。`number`也是不可变(`Immutable`)的。否则的话，你试想下这个表达式`2 + 3`，如果`2`的含义能被修改，那代码该怎么写啊\|\_\|。听起来荒谬吧，但我们在编程中却常常对`object`和`array`做出这种事儿。

## JavaScript充满变化 ##

在`JavaScript`中，`string`和`number`从设计之初就是不可变(`Immutable`)的。但是，看看下面这个关于`array`例子：

```javascript
var arr = [];
var v2 = arr.push(2);
```

来我问你，`v2`的值是什么？如果`array`和`string`、`number`一样也是不可变(`Immutable`)的，那此时`v2`必定是一个包含了一个数字`2`的新`array`。事实上，还真就不是那样的。这里`arr`引用的`array`被修改了，里面添了一个数字`2`，这时`v2`的值(也就是`arr.push(2)`的返回值)，其实是`arr`此时的长度 － 就是`1`。

试想我们拥有一个不可变的数组(`ImmutableArray`)。就像`string`、`number`那样，她应该能像如下这样被使用：

```javascript
var arr = new ImmutableArray([1, 2, 3, 4]);
var v2 = arr.push(5);

arr.toArray(); // [1, 2, 3, 4]
v2.toArray();  // [1, 2, 3, 4, 5]
```

类似的，也可以有一个不可变的Map(`ImmutableMap`)，理论上可以替代`object`应该于多数场景，她应该有一个`set`方法，不过这个`set`方法不会塞任何东西到原`Map`里，而是返回一个包含了塞入值的新`Map`：

```javascript
var person = new ImmutableMap({name: 'Chris', age: 32});
var olderPerson = person.set('age', 33);

person.toObject(); // {name: 'Chris', age: 32}
olderPerson.toObject(); // {name: 'Chris', age: 33}
```

就像`2 + 3`这个表达式里，我们不可能改变`2`或是`3`所代表的含义，一个`person`在庆祝他33岁的生日，并不会影响他曾经是32岁的事实。

## JavaScript不可变性(`Immutability`)实战 ##

`JavaScript`里目前还没有不可变的`list`和`map`，所以暂时我们还是需要三方库的帮助。有两个很不错的，一个是[Mori](https://github.com/swannodette/mori) － 她把`ClojureScript`里持久化数据结构的API支持带到了`JavaScript`里；另一个是Facebook出品的[immutable.js](https://github.com/facebook/immutable-js)。后面的示例里，我将使用[immutable.js](https://github.com/facebook/immutable-js)，因为她的API对于`JavaScript`开发者更友好一些。

下面的例子里，我们使用不可变(`Immutable`)知识来构建一个扫雷小游戏。扫雷的游戏面板我们用一个不可变的`map`来构建，其中`tiles`(雷区区块)部分值得关注哦，它是一个由不可变`map`组成的不可变`list`(译者注：又开始绕了)，其中每一个不可变的`map`表示一个`tile`(雷区块)。整个这个雷区面板都是由`JavaScript`的`object`和`array`组成的，最后由[immutable.js](https://github.com/facebook/immutable-js)的`fromJS`方法对其进行不可变化处理：

```javascript
function createGame(options) {
  return Immutable.fromJS({
    cols: options.cols,
    rows: options.rows,
    tiles: initTiles(options.rows, options.cols, options.mines)
  });
}
```

剩下的主要逻辑部分就是“扫雷”了，传入扫雷游戏对象(一个不可变结构)做为第一个参数，以及要“扫”的那个`tile`(雷区块)对象，最后返回新的扫雷游戏实例。以下我们就要讲到这个`revealTile`函数。当它被调用时，`tile`(雷区块)的状态就要被重置为“扫过”的状态。如果是可变编程，代码很简单：

```javascript
function revealTile(game, tile) {
  game.tiles[tile].isRevealed = true;
}
```

然后再来看看如果用上面介绍的不可变数据结构来编码，坦白讲，一开始代码变得都点丑了：

```javascript
function revealTile(game, tile) {
  var updatedTile = game.get('tiles').get(tile).set('isRevealed', true);
  var updatedTiles = game.get('tiles').set(tile, updatedTile);
  return game.set('tiles', updatedTiles);
}
```

我去，丑爆了有木有！

万幸，不可变性不止于此，一定有得救！这种需求很常见，所以工具早就考虑到了，可以这么操作：

```javascript
function revealTile(game, tile) {
  return game.setIn(['tiles', tile, 'isRevealed'], true);
}
```

现在`revealTile`返回一个新的实例了，新实例里其中一个`tile`(雷区块)的`isRevealed`就和之前那个`game`实例里的不一样了。这里面用到的`setIn`是一个`null-safe`(空值安全)的函数，任意`keyPath`中的`key`不存在时，都会在这个位置创建一个新的不可变`map`(译者注：这句略绕，个人认为既然这里不是主讲[immutable.js](https://github.com/facebook/immutable-js)，那就没必要非提一下它的这个特性，反而不清不楚，原作没细说，那我也就不多说了，有兴趣的可以[来这里](http://facebook.github.io/immutable-js/docs/#/Map/setIn)自己揣摩)。这个`null-safe`特性对于我们现在扫雷游戏这个例子并不合适，因为“扫”一个不存在的`tile`(雷区块)表示我们正在试图扫雷区以外的地方，那显然不对！这里需要多做一步检查，通过`getIn`方法检查`tile`(雷区块)是否存在，然后再“扫”它：

```javascript
function revealTile(game, tile) {
  return game.getIn(['tiles', tile]) ?
    game.setIn(['tiles', tile, 'isRevealed'], true) :
    game;
}
```

如果`tile`(雷区块)不存在，我们就返回原扫雷游戏实例。这就是个可迅速上手的关于不可变性(`Immutability`)的练习，想深入了解的可以看[codepen](http://codepen.io/SitePoint/pen/zGYZzQ)，完整的实现都在里面了。

## Performance怎么样? ##

你可能觉得，这他妈Performance应该low爆了吧，我只能说某些情况下你是对的。每当你想添加点东西到一个不可变(`Immutable`)对象里时，她一定是先拷贝以存在值到新实例里，然后再给新实例添加内容，最后返回新实例。相比可变对象，这势必会有更多内存、计算量消耗。

因为不可变(`Immutable`)对象永远不变，实际上有一种实现策略叫“结构共享”，使得她的内存消耗远比你想象的少。虽然和内置的`array`、`object`的“变化”相比仍然会有额外的开销，但这个开始恒定，绝对可以被不可变性(`Immutability`)带来的其它众多优势所消磨、减少。在实践中，不可变性(`Immutability`)带来的优势可以极大的优化程序的整体性能，即使其中的某些个别操作开销变大了。

## 改进变更追踪 ##

各种UI框架里，最难的部分永远是变更追踪(译者注：或者叫“脏检查”)。这是`JavaScript`社区里的普遍问题，所以EcmaScript 7里提供了单独的API在保证Performance的前提下可以追踪变化：`Object.observe()`。很多人为之激动，但也有不少人认为这个API然并卵。他们认为，在任何情况下，这个API都没很好的解决变更追踪问题：

```javascript
var tiles = [{id: 0, isRevealed: false}, {id: 1, isRevealed: true}];
Object.observe(tiles, function () { /* ... */ });

tiles[0].id = 2;
```

上面例子里，`tiles[0]`的变更并没有触发`observer`，所以其实这个提案即便是最简单的变更追踪也没做到。那不可变性(`Immutability`)又是怎么解决的？假设有一个应用状态`a`，然后它内部有值被改变了，于是就得到了一个新的实例`b`：

```javascript
if (a === b) {
  // 数据没变，停止操作
}
```

如果应用状态`a`没有被修改，那`b`就是`a`，它们指向同一个实例，`===`就够了，不用做其他事儿。当然这需要我们追踪应用状态的引用，但整个问题的复杂度被大大简化了，现在只要判断一下它们是否同一个实例的引用就好了，真心不用再去深入调查里面的某某字段是不是变了。

## 结束语 ##

希望本文能某种程度上帮你了解不可变性(`Immutability`)是如何帮我们优化/改进代码的，也希望这些例子从实践角度说清楚了使用方式。不可变性(`Immutability`)的热度在持续增高，我确定这绝不是你今年看到的关于不可变性(`Immutability`)的最后一文。同志们，是时候来一发了，我相信你用过后一定会high至的，就像我现在一样^^。

原文地址：[Immutability in JavaScript](http://www.sitepoint.com/immutability-javascript/)
