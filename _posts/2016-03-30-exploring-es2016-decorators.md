---
layout: post
title: "[译]揭秘ES2016中的Decorators"
description: ""
category: "tech"
tags: ["ES2016", "Decorators"]
shortContent: "迭代器(<a  href=\"https://jakearchibald.com/2014/iterators-gonna-iterate/\">iterators</a>)、生成器(<a href=\"http://www.2ality.com/2015/03/es6-generators.html\">generators</a>)、数组推导式(<a href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Array_comprehensions\">array comprehensions</a>); JavaScript与Python之间的相似度与日俱增，对于这种变化，我绝对是最high的那个。今天我们就来聊聊又一个Python化在ES2016(也叫ES7)里的体现——装饰器(Decorators)，by Yehuda Katz"
---
{% include JB/setup %}


迭代器([iterators](https://jakearchibald.com/2014/iterators-gonna-iterate/))、生成器([generators](http://www.2ality.com/2015/03/es6-generators.html))、数组推导式([array comprehensions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Array_comprehensions)); 随着JavaScript与Python之间的相似度与日俱增，对于这种变化，我绝对是最high的那个。那今天我们就来聊聊又一个`Python`化在ES2016(也叫ES7)里的体现——装饰器(Decorators)，by Yehuda Katz


## 装饰器模式 ##

装饰器(Decorator)到底是个什么鬼？来让我们从头儿说，在`Python`里，装饰器(Decorator)是一种极简的调用高阶函数(higher-order function)的语法。`Python`里，装饰器(Decorator)就是一个函数，她接受另一个函数作为参数，然后在不直接修改这个函数的情况下，扩展该函数的行为，最终再将该函数返回。`Python`里一个最简单的装饰器(Decorator)使用起来长这个样子：

```python
@mydecorator
def myfunc():
    pass
```

最上面那个(`@mydecorator`)就是一个装饰器(Decorator)，而且和ES2016(ES7)里的装饰器(Decorator)在特征上没什么区别，所以这里就要注意喽！

`@`符号告诉解析器我们正在使用一个名叫`mydecorator`的装饰器(Decorator)，并且`mydecorator`就是真实的这个装饰器(Decorator)的定义函数的名字。装饰器(Decorator)要做的就是接受一个参数（那个即将被"装饰"的函数），封装额外功能，然后返回原被装饰的函数。

当你不想修改一个函数，又想通过该函数的输入、输出做点儿额外工作的时候，装饰器(Decorator)就显得格外耀眼了。这类功能常见于：缓存、访问控制、鉴权、监控、计/定时器、日志、级别控制等等。

## ES5、ES2015(ES6)里的装饰器(Decorator) ##

ES5里，想要通过纯粹的函数实现一个装饰器(Decorator)，很麻烦！从ES2015(ES6)开始，类原生支持继承，我们就需要一种更好的方式在多个类之间共享同一段代码功能。一种更好的分配法。

Yehuda在他的的提议里认为通过装饰器(Decorator)在设计阶段使用注解(annotating)、修改JavaScript类、属性和字面量对象等方式来保持代码的优雅。有兴趣的朋友看这里：[Yehuda's Decorator Proposal](https://github.com/wycats/javascript-decorators)

下面还是让我们一起用ES2016(ES7)的装饰器(Decorator)来试试拳脚吧！

## 上手ES2016的装饰器(Decorator) ##

先回顾一下我们在`Python`里学到的东东。ES2016(ES7)里的装饰器(decorator)是这样一个表达式，她会返回一个函数，这个函数接受三个参数，分别是：`target`、`name`、`property descriptor`。我们通过给这个表达式加前缀`@`，并且将这段表达式放在想要“装饰”的内容上面。装饰器(Decorator)可以通过类或者属性来定义。

### 装饰一个属性 ###

下面是一个简单的`Cat`类：

```javascript
class Cat{
    meow(){
        return `${this.name} says Meow!`;
    }
}
```

用`prototype`的方式定义这个类，在`Cat.prototype`上增加`meow`方法，大概是这个样子：

```javascript
Object.defineProperty(Cat.prototype, 'meow', {
    value: specifiedFunction,
    enumerable: false,
    configurable: true,
    writable: true
});
```

我们想要一个属性或者方法不可被[赋值运算符](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Assignment_Operators)改变。放一个装饰器(Decorator)在这个属性上面就行。我们来写一个`@readonly`装饰器(Decorator)：

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

装饰器(Decorator)是一个会被执行的表达式，她还必须再返回一个函数。意思是，`@readonly`或者`@something(parameter)`都可以是合法的装饰器(Decorator)。

那么，在`property descriptor`被注册到`Cat.prototype`之前，执行引擎会先执行装饰器(Decorator)：

```javascript
let descriptor = {
    value: specifiedFunction,
    enumerable: false,
    configurable: true,
    writable: true
};

//装饰器和`Object.defineProperty`具有相同的参数列表，
//有机会在真正的`defineProperty`之行之前做点儿事情
descriptor = readonly(Cat.prototype, 'meow', descriptor) || descriptor;
defineDecoratedProperty(Cat.prototype, 'meow', descriptor);
```

就这样，`meow`现在成了只读参数。来用以下代码验证我们的实现：

```javascript
var garfield = new Cat();

garfield.meow = function(){
    console.log('I want lasagne!');
};

//Exception: Attempted to assign to readonly property
```

碉堡了，有木有？待会儿我们就来瞧瞧如何装饰一个类(只玩儿属性是不是有点儿low)。不过我们还是先来看一个类库([https://github.com/jayphelps/core-decorators.js](https://github.com/jayphelps/core-decorators.js) by Jay Phelps)。尽管她还年轻，不过ES2016里的装饰器(Decorator)已经都可以通过她使用了哦。

和上面我们写的给`meow`属性的`@readonly`装饰器一样，她已内置了`@readonly`实现，引入即可使用：

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
import { deprecate } from 'core-decorators';

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

下面我们再来看看如何装饰一个类。在下面这个例子中，标准提议中称装饰器(Decorator)也能接受一个构造器。有一个小说类`MySuperHero`，我们来为她写一个简单的`@superhero`装饰器：

```javascript
function superhero(target){
    target.isSuperhero = true;
    target.power = 'flight';
}

@superhero
class MySuperHero{}

console.log(MySuperHero.isSuperhero);//true
```

我们还能再进一步，希望装饰器(Decorator)能够接受参数获取不同的行为，就像工厂方法那样:

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

ES2016的装饰器(Decorator)在属性和类上皆可工作。装饰器可以自动获取传入的`property name`、`target object`，我们稍后会讲到。装饰器(Decorator)里能拿到`descriptor`使得譬如：用getter替换属性获取、自动绑定等以前要很繁琐才能完成的工作变为可能。

### ES2016装饰器(Decorator)和Mixins ###

最近看Reg Braithwaite写[ES2016 Decorators as  mixins](http://raganwald.com/2015/06/26/decorators-in-es7.html)，以及之前的[Functional mixins](http://raganwald.com/2015/06/17/functional-mixins.html)，非常赞同他的观点。Reg通过一个Helper向任意target(class prototype 或者对象)中植入不同的行为，以此来表示一个具备指定行为的类。Functional mixin将不同的实例行为植入类的prototype中，实现参考如下：

```javascript
function mixin(behaviour, sharedBehaviour = {}) {
    const instanceKeys = Reflect.ownKeys(behaviour);
    const sharedKeys = Reflect.ownKeys(sharedBehaviour);
    const typeTag = Symbol('isa');

    function _mixin(target) {
        for (let property of instanceKeys) {
            Object.defineProperty(target.prototype, property, { value: behaviour[property] });
        }
        Object.defineProperty(target, typeTag, { value: true });
        return target;
    }
    for (let property of sharedKeys){
        Object.defineProperty(_mixin, property, {
            value: sharedBehaviour[property],
            enumerable: sharedBehaviour.propertyIsEnumerable(property)
        });
    }
    Object.defineProperty(_mixin, Symbol.hasInstance, {
        value: (i) => !!i[typeTag]
    });
    return _mixin;
}
```

屌！现在我们可以定义mixins，然后用她们装饰其他类了。想象一下我们有以下简单`ComicBookCharacter`类：

```javascript
class ComicBookCharacter{
    constructor(first, last) {
        this.firstName = first;
        this.lastName = last;
    }

    realName() {
        return this.firstName + ' ' + this.lastName;
    }
}
```

这估计是史上最无聊的角色了，不过我们可以定义一些mixins来给她提升一下能力，诸如`SuperPowers`、`UtilityBelt`。来试试用Reg的mixins Helper吧：

```javascript
const SuperPowers = mixin({
    addPower(name) {
        this.powers().push(name);
        return this;
    },
    powers() {
        return this._powers_pocessed || (this._powers_pocessed = []);
    }
});

const UtilityBelt = mixin({
    addToBelt(name) {
        this.utilities().push(name);
        return this;
    },

    utilities() {
        return this._utility_items || (this._utility_items = []);
    }
});
```

有了这些，我们现在可以前缀`@`符号，把上述两个mixins作为装饰器(Decorator)挂在`ComicBookCharacter`上为其提供额外功能了。注意下面代码多装饰器(Decorators)是如何作用于类上的：

```javascript
@SuperPowers
@UtilityBelt
class ComicBookCharacter {
    constructor(first, last) {
        this.firstName = first;
        this.lastName = last;
    }

    realName() {
        return this.firstName + ' ' + this.lastName;
    }
}
```

好吧，我们现在要用上面定义好的类来创造一个蝙蝠侠喽：

```javascript
const batman = new ComicBookCharacter('Bruce', 'Wayne');
console.log(batman.realName());
//Bruce Wayne

batman.addToBelt('batarang');
batman.addToBelt('cape');

console.log(batman.utilities());
//['batarang', 'cape']

batman.addPower('detective');
batman.addPower('voice sounds like Gollum has asthma');

console.log(batman.powers());
//['detective', 'voice sounds like Gollum has asthma']
```

通过装饰器(Decorators)，代码更加简洁。我自己在使用过程中将她们作为函数调用的另一种选择，或者高阶函数组件的Helper。
注：@WebReflection也写了一个上述`mixin`的实现，你可以在[这儿](https://gist.github.com/addyosmani/a0ccf60eae4d8e5290a0#comment-1489585)看看和Reg的版本有什么不同。

## 通过`Babel`使用装饰器(Decorators) ##

装饰器(Decorator)现仍处于提议阶段，没被通过列入标准。我们要感谢`Babel`提供了一个试验模式支持装饰器(Decorator)的转义实现，使得上述例子基本都可以直接使用。

如果使用`Babel CLI`，传入如下参数即可：

```shell
babel --optional es7.decorators
```

或者你可以自己写程序调用她的`transformer`:

```javascript
babel.transform('code', {
    optional: ['es7.decorators']
});
```

`Babel`还有个在线版的[REPL](https://babeljs.io/repl/)；选中“Experimental”复选框就可以激活装饰器(Decorator)，来试试？

## 牛逼的各种实验 ##

坐我旁边的是一个超走运的小伙儿，他叫Paul Lewis，用装饰器(Decorator)做了个[试验性的功能](https://github.com/GoogleChrome/samples/tree/gh-pages/decorators-es7/read-write)重塑了读/写DOM的体验。其中借鉴了Wilson Page的FastDOM，不过提供了更简单的API接口。Paul的读/写装饰器(Decorator)甚至还能在`@write`执行时如果被装饰的函数内部有方法或者属性被调用来改变页面布局就会通过`console`警告你，同理当`@read`执行时如果有“写”类型的`DOM`变更也会收到警告。

下面是Paul试验代码是简单使用场景，如果在`@read`里试图变更`DOM`时，就会有异常信息打在`console`里：

```javascript
class MyComponent {
    @read
    readSomeStuff() {
        console.log('read');

        //抛出异常
        document.querySelector('.button').style.top = '100px';
    }

    @write
    writeSomeStuff() {
        console.log('write');

        //抛出异常
        document.querySelector('.button').focus();
    }
}
```

## 开始用装饰器(Decorator)吧！ ##

简短地说，ES2016的装饰器对声明式的装饰、注解、类型检查以及在ES2015里类上增加装饰器的各种奇淫技巧都非常有好处。往深里说，对静态分析(编译时的类型检查，自动补全)也是大有裨益。

她和经典的面向对象编程(OOP)里的装饰器也没有太大区别，OOP里是在对象上提供装饰器，或静态、或动态的植入不同行为，但却不改变原类。
装饰器的语义其实在`flux`中也有体现，无论如何，我们还是最好时刻关注Yehuda的更新。

最近`React`社区也在讨论用装饰器替换之前的[mixins](https://github.com/timbur/react-mixin-decorator)设计来创建高阶组件了。

我个人看到这些试验性示例很是兴奋，希望你也能用`Babel`试一把，说不定你也搞出来点好玩的东东，然后像Paul一样分享给大家了。

## 更多阅读 ##

* [https://github.com/wycats/javascript-decorators](https://github.com/wycats/javascript-decorators)
* [https://github.com/jayphelps/core-decorators.js](https://github.com/jayphelps/core-decorators.js)
* [http://blog.developsuperpowers.com/eli5-ecmascript-7-decorators/](http://blog.developsuperpowers.com/eli5-ecmascript-7-decorators/)
* [http://elmasse.github.io/js/decorators-bindings-es7.html](http://elmasse.github.io/js/decorators-bindings-es7.html)
* [http://raganwald.com/2015/06/26/decorators-in-es7.html](http://raganwald.com/2015/06/26/decorators-in-es7.html)
* [Jay’s function expression ES2016 Decorators example](https://babeljs.io/repl/#?experimental=true&evaluate=true&loose=false&spec=false&playground=true&code=class%20Foo%20%7B%0A%20%20%40function%20%28target%2C%20key%2C%20descriptor%29%20%7B%20%20%20%0A%20%20%20%20descriptor.writable%20%3D%20false%3B%20%0A%20%20%20%20return%20descriptor%3B%20%0A%20%20%7D%0A%20%20bar%28%29%20%7B%0A%20%20%20%20%0A%20%20%7D%0A%7D&stage=0)

特别鸣谢：[Jay Phelps](http://twitter.com/jayphelps), [Sebastian McKenzie](http://twitter.com/sebmck), [Paul Lewis](http://twitter.com/aerotwist) and [Surma](http://twitter.com/surmair) 的意见
❤

原文地址：[exploring-es7-decorators](https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841?from=timeline&isappinstalled=1#.9q5s6et8h)
