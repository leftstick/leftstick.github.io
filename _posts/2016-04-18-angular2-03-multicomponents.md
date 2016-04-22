---
layout: post
title: "angular2初入眼帘之－多components协作"
description: ""
category: "tech"
tags: ["angular2", "tutorial", "component"]
shortContent: "<a href=\"http://leftstick.github.io/tech/2016/04/14/angular2-02-component\">上一章</a>里我们讲了如何在<code>angular2</code>下开发一个<code>component</code>(还没做的赶紧去学吧)。我们使用了<a href=\"https://medium.com/@AdamRNeary/unidirectional-data-flow-yes-flux-i-am-not-so-sure-b4acf988196c#.bxd6ripaq\">Unidirectional Data Flow</a>模式书写<code>component</code>，并引入了<a href=\"http://leftstick.github.io/tech/2016/04/09/immutability-in-javascript\">Immutable</a>思想，这些以前只在<a href=\"https://facebook.github.io/react/\">React</a>里见到的设计，现在<code>angular2</code>里也有体现，并且在本章中会着重讲解多<code>components</code>的协作"
---
{% include JB/setup %}


## 前集回顾 ##

[上一章][previous-url]里我们讲了如何在`angular2`下开发一个`component`(还没做的赶紧去学吧)。我们使用了[Unidirectional Data Flow][Unidirectional-url]模式书写`component`，并引入了[Immutable](http://leftstick.github.io/tech/2016/04/09/immutability-in-javascript)思想，这些以前只在[React][react-url]里见到的设计，现在`angular2`里也有体现，并且在本章中会着重讲解多`components`的协作。

本章源码：[multicomponents](https://github.com/leftstick/angular2-lesson/tree/master/examples/multicomponents)

本章使用`angular2`版本为：`2.0.0-beta.15`

先来看看我们将要完成的效果图：

![]({{ BASE_PATH }}/assets/images/angular2-03-preview.gif)

## 需求分析 ##

(注意动画部分)，由[上一章][previous-url]的一个`component`，变成了一个输入`component`、 一个遍历显示`component`、 一个总结`component`。画一个组件树的示意图如下：

![]({{ BASE_PATH }}/assets/images/angular2-03-tree.png)

### 分析第一部分 ###

1. 我们将其命名为`InputItem`
2. 它由一个`input[type="text"]`和一个`button`组成
3. 当点击`button`时，需要向上冒泡事件，并组合一个新的`CheckableItem`随事件发送出去
4. 清空`input[type="text"]`
5. 第3步操作，也可以通过键盘敲击"回车键"完成操作

### 分析第二个遍历显示部分 ###

参考[上一章][previous-url]
关于[*ngFor](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#ngFor)

### 分析第三个总结部分 ###

1. 我们将其命名为`Counter`
2. 它由一个`span`组成，显示总结信息
3. 它接受一个`items`参数，用来生成总结信息
4. 总结信息为：显示当前还有多少个`isChecked === false`的`item`

## 设计use case ##

还是老套路，先来设计这些新的`components`的使用场景(这种方式，我们称之为"BDD"，不了解的朋友参考[以BDD手写依赖注入(dependency injection)](http://leftstick.github.io/tech/2016/03/18/write-di-in-bdd))。

### 重构`ts/app.ts` ###

```javascript
import {Component} from 'angular2/core';

//引入输入component
import {InputItem} from './InputItem';
import {CheckableItem, Item} from './CheckableItem';
//引入总结component
import {Counter} from './Counter';

@Component({
    selector: 'my-app',
    template: `
    <h1>My First Angular 2 App</h1>
    <!--
    在template里，增加input-item和counter的使用
    input-item里，捕获onItemAdded事件，传递给addItem方法
    -->
    <input-item (onItemAdded)="addItem($event)"></input-item>
    <!--
        使用*ngFor遍历items变量。详情:
        https://angular.io/docs/ts/latest/guide/template-syntax.html#!#ngFor
    -->
    <checkable-item *ngFor="#itemInfo of items; #i = index" [item]="itemInfo" (onItemClicked)="toggle($event, i)">
    </checkable-item>
    <!--
        counter里，传入items
    -->
    <counter [items]="items"></counter>
    `,
    directives: [InputItem, CheckableItem, Counter]
})
export class AppComponent {
    //声明items为成员变量
    items: Item[] = [];

    //当捕获到onItemAdded事件时，调用该方法，添加新item到items里
    //注：根据Immutable策略，生成新的items
    addItem(item: Item) {
        this.items = [...this.items, item];
    }

    //点击checkable-item时，置反其isChecked属性
    //注：根据Immutable策略，生成新的items
    toggle(item: Item, index: number) {
        this.items = [
            ...this.items.slice(0, index),
            { isChecked: !item.isChecked, txt: item.txt },
            ...this.items.slice(index + 1)
        ];
    }
}
```

## 实现`InputItem` ##

```shell
touch ts/InputItem.ts
```

向刚创建的`ts/InputItem.ts`中，添加如下内容：

```javascript
import {Component, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core';

@Component({
    //这里仍然使用OnPush策略
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'input-item',
    //template里包含一个input[type="text"]和button
    //外面又一个form标签是因为需求中希望回车键也可以触发操作
    template: `
    <form (ngSubmit)="onSubmit()">
        <input type="text" [(ngModel)]="text">
        <button type="submit">Add Item</button>
    </form>
    `
})
export class InputItem {
    //双向绑定到input[type="text"]
    text: string;
    //向外部冒泡的事件
    @Output() onItemAdded = new EventEmitter();

    //无论点击button、还是敲击回车键，都处罚添加事件
    //组装一个新的item对象，
    //清空text
    onSubmit() {
        this.onItemAdded.emit({
            isChecked: false,
            txt: this.text
        });
        this.text = '';
    }
}
```

## 实现`Counter` ##

```shell
touch ts/Counter.ts
```

向刚创建的`ts/Counter.ts`中，添加如下内容：

```javascript
import {Component, OnChanges, SimpleChange, Input, ChangeDetectionStrategy} from 'angular2/core';

import {Item} from './CheckableItem';

@Component({
    //这里仍然使用OnPush策略
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'counter',
    //template包含一个span
    template: `
    <span>
        We have {% raw  %}{{ length }}{% endraw %} item{% raw  %}{{ postFix }}{% endraw %}
    </span>
    `
})
export class Counter implements OnChanges {
    //接受items参数
    @Input() items: Item[];

    postFix: string;
    length: number;

    //每次当参数items的reference发生变化时，触发该方法
    //获取新的length、postFix，重绘组件
    //这里和React中的componentWillUpdate很相似
    ngOnChanges(changes: { [key: string]: SimpleChange }): any {
        let newItems: Item[] = changes['items'].currentValue;
        this.length = newItems.reduce((p, item) => p + (item.isChecked ? 0 : 1), 0);
        this.postFix = this.length > 1 ? 's' : '';
    }
}
```

组件树的整体编写思路就是[Unidirectional Data Flow][Unidirectional-url]，所以数据的变更都是[Immutable](http://leftstick.github.io/tech/2016/04/09/immutability-in-javascript)的。如果之前写过[React][react-url]，那对于这种书写方式一定无比熟悉。每次数据的变更，无论是`InputItem`还是`CheckableItem`，都将变化冒泡到`AppComponent`，然后由`AppComponent`再向下逐级推送各组件是否重绘。

OK，代码写到这里基本就结束了，看看效果吧

```shell
npm start
```

你又看到了伟大的效果：

![]({{ BASE_PATH }}/assets/images/angular2-03-preview.gif)

下回预告：[使用`service`](http://leftstick.github.io/tech/2016/04/22/angular2-04-service)

[previous-url]: http://leftstick.github.io/tech/2016/04/14/angular2-02-component
[ng-url]: https://angularjs.org/
[ng-dir-url]: https://docs.angularjs.org/guide/directive
[ng2-url]: https://angular.io/
[Unidirectional-url]: https://medium.com/@AdamRNeary/unidirectional-data-flow-yes-flux-i-am-not-so-sure-b4acf988196c#.bxd6ripaq
[react-url]: https://facebook.github.io/react/
