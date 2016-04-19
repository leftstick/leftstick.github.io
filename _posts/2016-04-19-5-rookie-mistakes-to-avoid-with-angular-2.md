---
layout: post
title: "Angular2新人常犯的5个错误"
description: ""
category: "tech"
tags: ["angular2", "mistakes"]
shortContent: "看到这儿，我猜你肯定已经看过一些博客、技术大会录像了，现在应该已经准备好踏上<a href=\"https://angular.io/\">angular2</a>这条不归路了吧！那么上路后，哪些东西是我们需要知道的？"
---
{% include JB/setup %}

看到这儿，我猜你肯定已经看过一些博客、技术大会录像了，现在应该已经准备好踏上[angular2](https://angular.io/)这条不归路了吧！那么上路后，哪些东西是我们需要知道的？

下面就是一些新手常见错误汇总，当你要开始自己的`angular2`旅程时，尽量避免吧。

注：本文中，我假设诸位已经对`angular2`的基础知识有所了解。如果你是绝对新手，之前只听说过，完全没概念什么是`angular2`的，先去读读下面这些资料：

* [Angular docs](http://angular.io/)
* [Victor Savkin's blog](http://victorsavkin.com/)
* [Thoughtram's Angular 2 blog](http://blog.thoughtram.io/categories/angular-2/)

## 错误 #1：原生`hidden`属性绑定数据

在`AngularJS 1`中，如果想切换DOM元素的显示状态，估计你会用`AngularJS 1`内置的指令如：`ng-show` 或者 `ng-hide`:

`AngularJS 1`示例：

```html
<div ng-show="showGreeting">
   Hello, there!
</div>
```

而`angular2`里，新的模版语法允许你将表达式绑定到DOM元素的任何原生属性上。 这个绝对牛逼的功能带来了无限的可能。其中一项就是绑定表达式到原生的`hidden`属性上，和`ng-show`有点像，也是为元素设置`display: none`：

`angular2`的`[hidden]`示例(不推荐)：

```html
<div [hidden]="!showGreeting">
   Hello, there!
</div>
```

第一眼看上面的例子，似乎就是`AngularJS 1`里的`ng-show`。其实不然，她们有着`!important`的不同。

`ng-show`和`ng-hide`都是通过一个叫`ng-hide`的CSS class来控制DOM元素的显示状态，`ng-hide` class就是简单的把元素设置成`display: none`。这里的关键在于，`AngularJS 1`在`ng-hide` class里增加了`!important`，用来调整该class的优先级，使得它能够覆盖来自其他样式对该元素`display`属性的赋值。

再来说回本例，原生`hidden`属性上的`display: none`样式是由浏览器实现的。大多数浏览器是不会用`!important`来调整其优先级的。因此，通过`[hidden]="expression"`来控制元素显示状态就很容易意外的被其他样式覆盖掉。举个例子：如果我在其他地方对这个元素写了这样一个样式`display: flex`，这就比原生`hidden`属性的优先级高([看这里](https://jsbin.com/lozufoxexe/edit?html,css,output))。

基于这个原因，我们通常使用`*ngIf`切换元素存在状态来完成相同目标：

`angular2`的`*ngIf`示例(推荐)：

```html
<div *ngIf="showGreeting">
   Hello, there!
</div>
```

和原生`hidden`属性不同，`angular2`中的`*ngIf`不受样式约束。无论你写了什么样的CSS，她都是安全的。但还是有必要提一下，`*ngIf`并不是控制元素的显示状态，而是直接通过从模版中增加/删除元素该元素来达成显示与否这一效果的。

当然你也可以通过全局的样式给元素的`hidden`属性增加隐藏的优先级，譬如：`display: none !important`，来达到这个效果。你或许会问，既然`angular`小组都知道这些问题，那干嘛不在框架里直接给`hidden`加一个全局最高优先级的隐藏样式呢？答案是我们没法保证加全局样式对所有应用来说都是最佳选择。因为这种方式其实破坏了那些依赖原生`hidden`能力的功能，所以我们把选择权交给工程师。

## 错误 #2：直接调用`DOM` APIs ##

只有极少的情况需要直接操作`DOM`。`angular2`提供了一系列牛X的高阶APIs来完成你期望的`DOM`操作，例如：queries。利用`angular2`提供的这些APIs有如下优势：

* 单元测试里不直接操作`DOM`可以降低测试复杂度，使你的测试用例跑的更快
* 把你的代码从浏览器中解藕，允许你在任何渲染环境里跑你的程序，譬如：`web worker`，或者完全离开浏览器(比如：运行在服务器端，亦或是`Electron`里)

当你手动操作`DOM`时，就失去了上述优势，而且代码越写越不易读。

从`AngularJS 1`(或者压根没写过`Angular`的人)转型的朋友，我能猜到大概哪些场景是你们想直接操作`DOM`的。那我们来一起看下这些状况，我来演示下如何用queries重构她们。

**场景 一：当需要获取当前组件模版里的某一个元素时**

假设你的组件模版里有一个`input`标签，并且你希望在组件加载后立即让这个`input`自动获取焦点

你或许已经知道通过`@ViewChild`/`@ViewChildren`这两个queries可以获取当前组件模版里的内嵌组件。但在这个例子里，你需要的是获取一个普通的`HTML`元素，而非一个组件。一开始估计你就直接注入`ElementRef`来操作了：

直接操作`ElementRef`(不推荐)

```javascript
@Component({
  selector: 'my-comp',
  template: `
    <input type="text" />
    <div> Some other content </div>
  `
})
export class MyComp {
  constructor(el: ElementRef) {
    el.nativeElement.querySelector('input').focus();
  }
}
```

其实我想说的是，这种做法**没必要**。


**解决方案：`@ViewChild`配合local template variable**

程序员们没想到的是除了组件本身，其他原生元素也是可以通过`local variable`获取的。在写组件时，我们可以直接在组件模版里给这个`input`标签加标记(譬如：`#myInput`)， 然后把标记传给`@ViewChild`用来获取该元素。当组件初始化后，你就可以通过`renderer`在这个`input`标签上执行`focus`方法了。

`@ViewChild`配合`local variable`(推荐)

```javascript
@Component({
  selector: 'my-comp',
  template: `
    <input #myInput type="text" />
    <div> Some other content </div>
  `
})
export class MyComp implements AfterViewInit {
  @ViewChild('myInput') input: ElementRef;

  constructor(private renderer: Renderer) {}

  ngAfterViewInit() {
    this.renderer.invokeElementMethod(this.input.nativeElement,    
    'focus');
  }
}
```


**场景 二：当需要获取用户映射到组件里的某个元素时**

如果你想获取的元素不在你的组件模版定义里怎么办？举个例子，假设你有个列表组件，允许用户自定义各列表项，然后你想跟踪列表项的数量。

当然你可以用`@ContentChildren`来获取组件里的“内容”(那些用户自定义，然后映射到你组件里的内容)，但因为这些内容可以是任意值，所以是没办法向刚才那样通过`local variable`来追踪她们的。

一种方法是，要求用户给他将要映射的列表项都加上预定义的`local variable`。这样的话，代码可以从上面例子改成这样：


`@ContentChildren`和`local variable`(不推荐)

```javascript
// user code
<my-list>
   <li *ngFor="#item of items" #list-item> {{item}} </li>
</my-list>

// component code
@Component({
  selector: 'my-list',
  template: `
    <ul>
      <ng-content></ng-content>
    </ul>
  `
})
export class MyList implements AfterContentInit {
  @ContentChildren('list-item') items: QueryList<ElementRef>;

  ngAfterContentInit() {
     // do something with list items
  }
}
```

可是，这需要用户写些额外的内容(`#list-item`)，真心不怎么优雅！你可能希望用户就只写`<li>`标签，不要什么`#list-item`属性，那肿么办？

**解决方案：`@ContentChildren`配合`li`选择器指令**

介绍一个好方案，用`@Directive`装饰器，配合他的`selector`功能。定义一个能查找/选择`<li>`元素的指令，然后用`@ContentChildren`过滤用户映射进当前组件里的内容，只留下符合条件的`li`元素。

`@ContentChildren`配合`@Directive`(推荐)

```javascript
// user code
<my-list>
   <li *ngFor="#item of items"> {{item}} </li>
</my-list>

@Directive({ selector: 'li' })
export class ListItem {}

// component code
@Component({
  selector: 'my-list'
})
export class MyList implements AfterContentInit {
  @ContentChildren(ListItem) items: QueryList<ListItem>;

  ngAfterContentInit() {
     // do something with list items
  }
}
```

注：看起来只能选择`<my-list>`里的`li`元素(例如：`my-list li`)，需要注意的是，目前`angular2`尚不支持"parent-child"模式的选择器。如果需要获取组件里的元素，用`@ViewChildren`、`@ContentChildren`这类queries是最好的选择

## 错误 #3：在构造器里使用获取的元素 ##

第一次使用queries时，很容易犯这样的错：

在构造器里打印query的结果(错误)

```javascript
@Component({...})
export class MyComp {
  @ViewChild(SomeDir) someDir: SomeDir;

  constructor() {
    console.log(this.someDir);// undefined
  }
}
```

当看到打印出来`undefined`后，你或许以为你的query压根不能用，或者是不是构造器哪里错了。事实上，你就是用数据用的太早了。必须要注意的是，query的结果集在组件构造时是不能用的。

幸运的是，`angular2`提供了一种新的生命周期管理钩子，可以非常轻松的帮你理清楚各类query什么时候是可用的。

* 如果在用view query(譬如：`@ViewChild`，`@ViewChildren`)时，结果集在视图初始化后可用。可以用`ngAfterViewInit`钩子
* 如果在用content query(譬如：`@ContentChild`，`@ContentChildren`)时，结果集在内容初始化后可用。可以用`ngAfterContentInit`钩子

来动手改一下上面的例子吧：

在`ngAfterViewInit`里打印query结果集(推荐)

```javascript
@Component({...})
export class MyComp implements AfterViewInit {
  @ViewChild(SomeDir) someDir: SomeDir;

  ngAfterViewInit() {
    console.log(this.someDir);// SomeDir {...}
  }
}
```


## 错误 #4：用`ngOnChanges`侦测query结果集的变化 ##

在`AngularJS 1`里，如果想要监听一个数据的变化，需要设置一个`$scope.$watch`，然后在每次digest cycle里手动判断数据变了没。在`angular2`里，`ngOnChanges`钩子把这个过程变得异常简单。只要你在组件里定义了`ngOnChanges`方法，在输入数据发生变化时该方法就会被自动调用。这超屌的！

不过需要注意的是，`ngOnChanges`当且仅当组件输入数据变化时被调用，“输入数据”指的是通过`@Input`装饰器显式指定的那些数据。如果是`@ViewChildren`，`@ContentChildren`的结果集增加/删除了数据，`ngOnChanges`是不会被调用的。

如果你希望在query结果集变化时收到通知，那不能用`ngOnChanges`。应该通过query结果集的`changes`属性订阅其内置的observable。只要你在正确的钩子里订阅成功了(不是构造器里)，当结果集变化时，你就会收到通知。

举例，代码应该是这个样子的：

通过`changes`订阅observable，监听query结果集变化(推荐)

```javascript
@Component({ selector: 'my-list' })
export class MyList implements AfterContentInit {
  @ContentChildren(ListItem) items: QueryList<ListItem>;

  ngAfterContentInit() {
    this.items.changes.subscribe(() => {
       // will be called every time an item is added/removed
    });
  }
}
```

如果你对observables一窍不通，赶紧的，[看这里](http://oredev.org/2015/sessions/angular2-data-flow)

## 错误 #5：错误使用`*ngFor` ##

在`angular2`里，我们介绍了一个新概念叫"structural directives"，用来描述那些根据表达式在`DOM`上或增加、或删除元素的指令。和其他指令不同，"structural directive"要么作用在template tag上、要么配合template attribute使用、要么前缀"\*"作为简写语法糖。因为这个新语法特性，初学者常常犯错。

你能分辨出来以下错误么？

*错误的`ngFor`用法*

```html
// a:
<div *ngFor="#item in items">
   <p> {{ item }} </p>
</div>

// b:
<template *ngFor #item [ngForOf]="items">
   <p> {{ item }} </p>
</template>

// c:
<div *ngFor="#item of items; trackBy=myTrackBy; #i=index">
   <p>{{i}}: {{item}} </p>
</div>
```

来，一步步解决错误

**5a：把"in"换成"of"**

```html
// incorrect
<div *ngFor="#item in items">
   <p> {{ item }} </p>
</div>
```

如果有`AngularJS 1`经验，通常很容易犯这个错。在`AngularJS 1`里，相同的repeater写作`ng-repeat="item in items"`。

`angular2`将"in"换成"of"是为了和ES6中的`for-of`循环保持一致。也需要记住的是，如果不用"\*"语法糖，那么完整的repeater写法要写作`ngForOf`，而非`ngForIn`

```html
// correct
<div *ngFor="#item of items">
   <p> {{ item }} </p>
</div>
```

**5b：语法糖和完整语法混着写**

```html
// incorrect
<template *ngFor #item [ngForOf]="items">
   <p> {{ item }} </p>
</template>
```

混着写是没必要的 － 而且事实上，这么写也不工作。当你用了语法糖(前缀"\*")以后，`angular2`就会把她当成一个template attribute，而不是一般的指令。具体来说，解析器拿到了`ngFor`后面的字符串，在字符串前面加上`ngFor`，然后当作template attribute来解析。如下代码：

```html
<div *ngFor="#item of items">
```

会被当成这样：

```html
<div template="ngFor #item of items">
```

当你混着写时，他其实变成了这样：

```html
<template template="ngFor" #item [ngForOf]="items">
```

从template attribute角度分析，发现template attribute后面就只有一个`ngFor`，别的什么都没了。那必然解析不会正确，也不会正常运行了。

如果从从template tag角度分析，他又缺了一个`ngFor`指令，所以也会报错。没了`ngFor`指令，`ngForOf`都不知道该对谁负责了。

可以这样修正，要么去掉"\*"写完整格式，要么就完全按照"\*"语法糖简写方式书写

```html
// correct
<template ngFor #item [ngForOf]="items">
   <p> {{ item }} </p>
</template>

// correct
<p *ngFor="#item of items">
   {{ item }}
</p>
```

**5c：在简写形式里用了错误的操作符**

```html
// incorrect
<div *ngFor="#item of items; trackBy=myTrackBy; #i=index">
   <p>{{i}}: {{item}} </p>
</div>
```

为了解释这儿到底出了什么错，我们先不用简写形式把代码写对了看看什么样子:

```html
// correct
<template ngFor #item [ngForOf]="items" [ngForTrackBy]="myTrackBy" #i="index">
   <p> {{i}}: {{item}} </p>
</template>
```

在完整形式下，结构还是很好理解的，我们来试着分解一下：

* 我们通过输入属性向`ngFor`里传入了两组数据：
    * 绑定在`ngForOf`上的原始数据集合`items`
    * 绑定在`ngForTrackBy`上的自定义track-by函数
* 用`#`声明了两个`local template variables`，分别是：`#i`和`#item`。`ngFor`指令在遍历`items`时，给这两个变量赋值
    * `i`是从0开始的`items`每个元素的下标
    * `item`是对应每个下标的元素

当我们通过"\*"语法糖简写代码时，必须遵守如下原则，以便解析器能够理解简写语法：

* 所有配置都要写在`*ngFor`的属性值里
* 通过`=`操作符设置`local variable`
* 通过`:`操作符设置input properties
* 去掉input properties里的`ngFor`前缀，譬如：`ngForOf`，就只写成`of`就可以了
* 用分号做分隔

按照上述规范，代码修改如下：

```html
// correct
<p *ngFor="#item; of:items; trackBy:myTrackBy; #i=index">
   {{i}}: {{item}}
</p>
```

分号和冒号其实是可选的，解析器会忽略它们。写上仅仅是为了提高代码可读性。因此，也可以再省略一点点：

```html
// correct
<p *ngFor="#item of items; trackBy:myTrackBy; #i=index">
   {{i}}: {{item}}
</p>
```

## 结论 ##

希望本章的解释对你有用。Happy coding!
