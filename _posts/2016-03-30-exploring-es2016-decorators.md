---
layout: post
title: "[译]揭秘ES2016中的Decorators"
description: ""
category: "tech"
tags: ["ES2016", "Decorators"]
shortContent: "迭代器(<a  href=\"https://jakearchibald.com/2014/iterators-gonna-iterate/\">iterators</a>)、生成器(<a href=\"http://www.2ality.com/2015/03/es6-generators.html\">generators</a>)、数组推导式(<a href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Array_comprehensions\">array comprehensions</a>); JavaScript与Python之间的相似度与日俱增，这种变化，我绝对是其中那个最high的。今天我们就来聊聊又一个Python化在ES2016(也叫ES7)里的体现——装饰器(Decorators)，by Yehuda Katz"
---
{% include JB/setup %}


迭代器([iterators](https://jakearchibald.com/2014/iterators-gonna-iterate/))、生成器([generators](http://www.2ality.com/2015/03/es6-generators.html))、数组推导式([array comprehensions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Array_comprehensions)); JavaScript与Python之间的相似度与日俱增，这种变化，我绝对是其中那个最high的。今天我们就来聊聊又一个`Python`化在ES2016(也叫ES7)里的体现——装饰器(Decorators)，by Yehuda Katz


## 装饰器模式 ##

装饰器(Decorator)到底是个什么鬼？来让我们从头儿说，在`Python`里，装饰器(Decorator)是一种极简的调用高阶函数(higher-order function)的语法。`Python`里，装饰器(Decorator)就是一个函数，她接受另一个函数作为参数，然后在不直接修改这个函数的情况下，扩展该函数的行为，最终再将该函数返回。`Python`里一个最简单的装饰器(Decorator)长这个样子：

```python
@mydecorator
def myfunc():
    pass
```

最上面那个(`@mydecorator`)就是一个装饰器(Decorator)，而且和ES2016(ES7)里的装饰器(Decorator)在特征上没什么区别，所以这里就要注意喽！

`@`符号告诉解析器我们正在使用一个名叫`mydecorator`的装饰器(Decorator)，并且`mydecorator`就是真实的这个装饰器(Decorator)的定义函数的名字。装饰器(Decorator)要做的就是接受一个参数（那个即将被"装饰"的函数），封装额外功能，然后返回原被装饰的函数。

当你不想修改一个函数，又想通过该函数的输入、输出做点儿额外工作的时候，装饰器(Decorator)就显得格外耀眼了。这类功能常见于：缓存、访问控制、鉴权、监控、计/定时器、日志、级别控制等等。

## ES5、ES2015(ES6)里的装饰器(Decorator) ##

ES5里，想要实现一个装饰器(Decorator)－一个纯粹的函数，很麻烦！在ES2015(ES6)里，由于类支持继承，我们需要一种更好的方式在多个类之间共享同一段代码功能。一种更好的分配法。

Yehuda在他的的装饰器(Decorator)提议里，希望通过注解(annotating)、修改JavaScript类、属性和字面量对象等方式来保持代码设计/编写阶段的优雅。有兴趣的朋友看这里：[Yehuda's Decorator Proposal](https://github.com/wycats/javascript-decorators)

下面还是让我们一起用ES2016(ES7)的装饰器(Decorator)来试试拳脚吧！

## 上手ES2016的装饰器(Decorator) ##

先回一下我们在`Python`里学到的东东。ES2016(ES7)里的装饰器(decorator)是这样一个表达式，她会返回一个函数，这个函数接受三个参数，分别是：`target`、`name`、`property descriptor`。我们通过给这个表达式加前缀`@`，并且将这段表达式放在想要“装饰”的内容上面。装饰器(Decorator)可以通过类或者属性来定义。

### 装饰一个属性 ###

下面是一个简单的`Cat`类：

```javascript
class Cat{
    meow(){
        return `${this.name} says Meow!`;
    }
}
```

试分解一下这个类，在`Cat.prototype`上增加`meow`方法，大概是这个样子：

```javascript
Object.defineProperty(Cat.prototype, 'meow', {
    value: specifiedFunction,
    enumerable: false,
    configurable: true,
    writable: true
});
```

我们想要一个属性或者方法不可被[赋值运算符](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Assignment_Operators)改变。装饰器(Decorator)就能满足这个需求：

```javascript
function readonly(target, name, descriptor){
    descriptor.writable = false;
    return descriptor;
}
```

然后，把这个装饰器(Decorator)加在`meow`属性上：

```javascript
class Cat{
    @readonly
    meow(){
        return `${this.name} says Meow!`;
    }
}
```

装饰器(Decorator)就是一个会被执行的表达式，她还必须再返回一个函数。这也是为什么`@readonly`或者`@something(parameter)`都是可以工作的。

那么，在`property descriptor`被加到`Cat.prototype`之前，执行引擎会先执行装饰器(Decorator)：

```javascript
let descriptor = {
    value: specifiedFunction,
    enumerable: false,
    configurable: true,
    writable: true
};

//装饰器和`Object.defineProperty`具有相同的参数列表，
//有机会在真正的`defineProperty`之行之前做点儿事情
descriptor = readonly(Person.prototype, 'meow', descriptor) || descriptor;
defineDecoratedProperty(Person.prototype, 'meow', descriptor);
```

就这样，`meow`现在成了只读参数。来用以下代码验证我们的实现：

```javascript
var garfield = new Cat();

garfield.meow = function(){
    console.log('I want lasagne!');
};

//Exception: Attempted to assign to readonly property
```

碉堡了，有木有？待会儿我们就来瞧瞧如何装饰一个类(只玩儿属性是不是有点儿low)，但我们还是先看一个类库([https://github.com/jayphelps/core-decorators.js](https://github.com/jayphelps/core-decorators.js) by Jay Phelps)。尽管她还年轻，不过ES2016里的装饰器(Decorator)已经都可以让你使用了哦。

和上面我们写的给`meow`属性做的`@readonly`装饰差不多，她已内置了`@readonly`实现，引入即可使用：

```javascript
import { readonly } from 'core-decorators';

class Meal{
    @readonly
    entree = 'steak';
}

var dinner = new Meal();
dinner.entree = 'salmon';
//Cannot assign to read only property 'entree' of [object Object]
```

`core-decorators`里面还有其他常用的装饰器(Decorator)工具，譬如：`@deprecate`，当API需要一些变更提示信息时，可以写成这样：

>调用`console.warn()`输出废弃提示信息。你也能传入一个自定义的信息覆盖默认值。甚至还可以给一个包含`url`的options对象，让用户可以了解更多

```javascript
import { readonly } from 'core-decorators';

class Person{
    @deprecate
    facepalm() {}

    @deprecate('We stopped facepalming')
    facepalmHard() {}

    @deprecate('We stopped facepalming', { url: 'http://knowyourmeme.com/memes/facepalm' })
    facepalmHarder() {}
}

let captainPicard = new Person();

captainPicard.facepalm();
//DEPRECATION Person#facepalm: This function will be removed in future versions.

captainPicard.facepalmHard();
//DEPRECATION Person#facepalmHard: We stopped facepalming

captainPicard.facepalmHarder();
//DEPRECATION Person#facepalmHarder: We stopped facepalming
//
//     see: http://knowyourmeme.com/memes/facepalm for more details.
//
```

### 装饰一个类 ###

我们再来看看如何装饰一个类。标准文档称，装饰器(Decorator)也能接受一个构造器。看下面这个`MySuperHero`类，我们来为她定义一个简单的`@superhero`装饰器：

```javascript
function superhero(target){
    target.isSuperhero = true;
    target.power = 'flight';
}

@superhero
class MySuperHero{}

console.log(MySuperHero.isSuperhero);//true
```

还可以再改改，我们通过给装饰器(Decorator)传入参数，让她可以和工厂一样按需返回不同的装饰方法:

```javascript
function superhero(isSuperhero) {
    return function(target){
        target.isSuperhero = isSuperhero;
    };
}

@superhero(true)
class MySuperHeroClass{}

console.log(MySuperHeroClass.isSuperhero);//true

@superhero(false)
class MySuperHeroClass{}

console.log(MySuperHeroClass.isSuperhero);//false
```

ES2016的装饰器(Decorator)在属性和类上皆可工作。装饰器可以自动获取传入的property name、target object，我们稍后会讲到。能拿到`descriptor`使得在装饰器(Decorator)里可以做譬如：用getter替换属性获取、自动绑定等以前要很繁琐才能完成的工作。

### ES2016装饰器(Decorator)和Mixins ###
