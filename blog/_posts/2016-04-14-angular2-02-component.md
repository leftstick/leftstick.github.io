---
title: "angular2初入眼帘之－了解component"
date: 2016-04-14
author: Howard Zuo
location: Shanghai
tags: 
  - angular
  - tutorial
---

## 前集回顾 ##

[上一章][previous-url]里我们讲了如何为`angular2`搭建开发环境(还没搭起来的赶紧去看哦)，并使之跑起来我们的第一个“My First Angular 2 App”。当然也有不少朋友反映环境搭建似乎比较复杂，整整一篇教程，最后只简单输出了一句话！这里我要说一句，学习新知识的确有一个阵痛的过程，尤其像`angular2`这种框架，引入了大量以前“前端”并不关心(没有需求)的技术栈，这使得对于之前没有接触过这些概念的朋友的学习曲线陡然飙升，相信不少人看了[上一章][previous-url]里开篇时的那些名词后已经认识到这一点了！本教程主打实际操作，但也不会完全忽略理论，我们边做边理解。今天就接着[上一章][previous-url]的余温，我们来写一个简单`component`。

本章源码：[component](https://github.com/leftstick/angular2-lesson/tree/master/examples/component)

本章使用`angular2`版本为：`2.0.0-rc.1`

先来看看我们将要完成的效果图：

<img :src="$withBase('/images/angular2-02-preview.gif')" alt="angular" />

(注意动画的部分)非常简单的一个`component`，有木有？那好，我们现在要做的就是为这样一个`component`描述需求：

1. 她要能接受一个`object`用来描述初始值，如：`isChecked`(是否选中)、 `txt`(显示文本)
2. 当选中时，需要有横线覆盖文本；反之亦然
3. 当用户点击复选框时，需要向上广播该事件，由父组件(调用方)决定点击时该做什么。这里我们需要在父组件里改变`component`的`isChecked`状态，并使`component`重绘
4. 她必须是一个处理[Unidirectional Data Flow](https://medium.com/@AdamRNeary/unidirectional-data-flow-yes-flux-i-am-not-so-sure-b4acf988196c#.bxd6ripaq)(单向数据流)的`component`，意思是传入参数必须[不可变(Immutable)](http://leftstick.github.io/tech/2016/04/09/immutability-in-javascript)

>注：第4步里，我们使用`Unidirectional Data Flow`模型来更新数据，并没有涉及到任何[Reactive Programming](https://en.wikipedia.org/wiki/Reactive_programming)的知识点

为了完成以上需求，我们需要了解下面知识点

## 什么是`component` ##

或者这么问，[AngularJS][ng-url]里有[directive][ng-dir-url]；[angular2][ng2-url]里有`component`，他们是什么关系？该如何理解[angular2][ng2-url]里的`component`？原谅我这里就不再详述[AngularJS][ng-url]里的[directive][ng-dir-url]了，直接介绍`component`：

1. `Component`： 简单说，就是带`template`的`directive`，也是最常见的组件形式。譬如：[上一章][previous-url]中，`ts/app.ts`里的`AppComponent`。
2. `Structural directive`： 通过增加/删除`DOM`元素改变`DOM`布局的`directive`。譬如：[NgFor](https://angular.io/docs/ts/latest/guide/template-syntax.html#ng-for)和[NgIf](https://angular.io/docs/ts/latest/guide/template-syntax.html#ng-if)
3. `Attribute directive`： 控制`DOM`元素显示/隐藏，或者改变元素行为的`directive`。譬如：[NgStyle](https://angular.io/docs/ts/latest/guide/template-syntax.html#ng-style)


## 设计use case ##

看过我之前介绍[以BDD手写依赖注入(dependency injection)](http://leftstick.github.io/tech/2016/03/18/write-di-in-bdd)的朋友应该已经对"行为驱动"多少有些了解了。当我们需要设计一个API或者组件时，最佳的方式就是先设计她的使用场景，从行为开始，对该API或者组件进行描述，最后再将缺失的“实现”部分补全就可以了。

假设我们将在[上一章][previous-url]中的`AppComponent`里使用这个新的`component`，根据之前的需求描述，我们的使用场景应该是这个样子的 :

```javascript
import {Component, OnInit} from '@angular/core';

//这里CheckableItem就是我们即将设计的新component
import {CheckableItem, Item} from './CheckableItem';

//该component使用checkable-item作为selector
//并可以通过[item]属性传入一个object
//还可以通过(onItemClicked)接受一个点击事件
@Component({
    selector: 'my-app',
    template: `
    <h1>My First Angular 2 App</h1>
    <checkable-item [item]="itemInfo" (onItemClicked)="toggle($event)">
    </checkable-item>
    `,
    //引入新的CheckableItem，使之可以在AppComponent里使用
    directives: [CheckableItem]
})
export class AppComponent implements OnInit {

    itemInfo: Item;

    //当实现OnInit接口时，必须重写ngOnInit方法
    //关于OnInit，详见：
    //https://angular.io/docs/ts/latest/guide/lifecycle-hooks.html#!#hooks-overview
    ngOnInit() {
        //设定初始值
        //根据需求第1条，包含两个属性
        this.itemInfo = {
            isChecked: false,
            txt: 'Hello World!'
        };
    }

    //根据需求第3条，点击component后，事件要
    //冒泡到父组件(调用方)
    toggle(item: Item) {
        //当获取到CheckableItem的点击事件时，
        //给itemInfo重新赋值，并将isChecked置反
        //注：重新赋值是根据需求第4条的不可变性
        this.itemInfo = {
            isChecked: !item.isChecked,
            txt: item.txt
        };
    }
}
```

根据上述介绍，再结合之前的效果图，我们要做的当然就是一个标准的`Component`。她有`template`，并且包含了至少一个`input`和一个`label`标签。

有了使用场景(行为)，接下来就是实现这个`CheckableItem`了：

```shell
touch ts/CheckableItem.ts
```

向刚创建的`ts/CheckableItem.ts`文件里写入如下内容：

```javascript
import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';

@Component({
    //脏检查策略，OnPush指当且仅当传入参数的reference发生变更时
    //触发组件重绘。这和React中的shouldComponentUpdate异曲同工，
    //不过更先进(因为React还是需要手动实现的)
    //这也是上一步里itemInfo必须重新赋值的原因
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'checkable-item',
    //仅在当前component作用域下有效的class
    styles: [`
        .deleted{
            text-decoration: line-through;
        }
    `],
    //template就如我们需求里的描述那样，由一个input标签和
    //一个label标签组成
    template: `
    <div>
        <input type="checkbox" [ngModel]="item.isChecked" (click)="clickItem($event)">
        <label [class.deleted]="item.isChecked">{{ item.txt }}</label>
    </div>
    `
})
export class CheckableItem {
    //item被声明为Input，即会在父组件传入参数时用到
    @Input() item: Item;
    //onItemClicked被声明为Output，用来在用户点击input标签
    //时向上冒泡事件
    @Output() onItemClicked = new EventEmitter();

    //监听input上的click事件，当用户点击时，首先阻止默认行为
    //因为是否变化(重绘)是由父组件决定的
    //然后冒泡点击事件
    clickItem(e: MouseEvent) {
        e.preventDefault();
        this.onItemClicked.emit(this.item);
    }
}


export interface ToggleItemHandler {
    (item: Item): void;
}

export interface Item {
    isChecked?: boolean;
    txt?: string;
}
```

有朋友看到这里，对`[]`、 `()`之类的绑定标签表示不解，这里我们统一来解释：

1. `[target] = "expression"`，将右边表达式对应的值绑定到左边的`target`。譬如：在`ts/app.ts`里，我们使用`[item]="itemInfo"`将`itemInfo`对应的值绑定到了组件`CheckableItem`的`item`上，这样，在`CheckableItem`里就可以通过`this.item`获取到父组件传进来的参数了。
2. `(target) = "statement"`，将左边的事件传递给了右边的表达式(通常就是事件处理函数)。譬如：在`ts/app.ts`里，我们使用`(onItemClicked)="toggle($event)"`将`CheckableItem`冒泡上来的`onItemClicked`事件传递给了`toggle`函数。
3. `[class.deleted]="item.isChecked"`，是`class`的一种特殊用法，指当`item.isChecked`表达式为真时，为该标签的`class`里增加`deleted`；反之，则删除该标签`class`里的`deleted`

OK，事已至此，我们是不是又该启动一把程序看看效果了？

```shell
npm start
```

你又看到了伟大的效果：

<img :src="$withBase('/images/angular2-02-preview.gif')" alt="angular" />

下回预告：[小刀升级 － 多`component`协作](http://leftstick.github.io/tech/2016/04/14/angular2-03-multicomponents)

[previous-url]: http://leftstick.github.io/tech/2016/04/09/angular2-01-env
[ng-url]: https://angularjs.org/
[ng-dir-url]: https://docs.angularjs.org/guide/directive
[ng2-url]: https://angular.io/
