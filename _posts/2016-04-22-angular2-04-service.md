---
layout: post
title: "angular2初入眼帘之－service"
description: ""
category: "tech"
tags: ["angular2", "tutorial", "component"]
shortContent: "<a href=\"http://leftstick.github.io/tech/2016/04/18/angular2-03-multicomponents\">上一章</a>里我们在<code>AppComponent</code>里通过组合<code>InputItem</code>、 <code>CheckableItem</code>、 <code>Counter</code>三个组件，并通过<code>Unidirectional Data Flow</code>(单向数据流)的方式把她们驱动起来。今天这章，我们讲讲<code>angular2</code>里的<code>service</code>。"
---
{% include JB/setup %}

## 前集回顾 ##

[上一章](http://leftstick.github.io/tech/2016/04/18/angular2-03-multicomponents)里我们在`AppComponent`里通过组合`InputItem`、 `CheckableItem`、 `Counter`三个组件，并通过`Unidirectional Data Flow`(单向数据流)的方式把她们驱动起来。今天这章，我们讲讲`angular2`里的`service`。

本章源码：[service](https://github.com/leftstick/angular2-lesson/tree/master/examples/service)

本章使用`angular2`版本为：`2.0.0-beta.15`

先来看看我们将要完成的效果图：

![]({{ BASE_PATH }}/assets/images/angular2-04-preview.gif)

## 需求分析 ##

(注意动画部分)，在[上一章](http://leftstick.github.io/tech/2016/04/18/angular2-03-multicomponents)的基础上我们加入了初始化数据，在数据加载完成前会有一个`loading`，数据准备好之后`loading`消失，列表显现。

## 设计use case ##

每章都会提一下，先设计使用场景(这种方式，我们称之为"BDD"，不了解的朋友参考[以BDD手写依赖注入(dependency injection)](http://leftstick.github.io/tech/2016/03/18/write-di-in-bdd))。

### 重构`ts/app.ts` ###

```javascript
import {Component, OnInit} from 'angular2/core';

import {InputItem} from './InputItem';
import {CheckableItem, Item} from './CheckableItem';
import {Counter} from './Counter';

//引入本章主题ItemService
import {ItemService} from './ItemService';

@Component({
    selector: 'my-app',
    template: `
    <h1>My First Angular 2 App</h1>
    <input-item (onItemAdded)="addItem($event)"></input-item>
    <checkable-item *ngFor="#itemInfo of items; #i = index" [item]="itemInfo" (onItemClicked)="toggle($event, i)">
    </checkable-item>
    <p *ngIf="loading">Loading</p>
    <counter *ngIf="!loading" [items]="items"></counter>
    `,
    directives: [InputItem, CheckableItem, Counter],
    //注入ItemService
    providers: [ItemService]
})
export class AppComponent implements OnInit {

    items: Item[] = [];
    //声明loading状态，初始值为true
    loading: boolean = true;

    //通过构造器自动获取ItemService实例
    constructor(private _itemService: ItemService) { }

    //在组件初始化以后调用ItemService获取初始化数据
    ngOnInit() {
        this._itemService
            .getItems()
            .then(data => {
                //重置loading状态为false
                this.loading = false;
                //设置初始值
                this.items = data;
            });
    }

    addItem(item: Item) {
        this.items = [...this.items, item];
    }

    toggle(item: Item, index: number) {
        this.items = [
            ...this.items.slice(0, index),
            { isChecked: !item.isChecked, txt: item.txt },
            ...this.items.slice(index + 1)
        ];
    }
}
```

## 实现`ItemService` ##

```shell
touch ts/ItemService.ts
```

向刚创建的`ts/ItemService.ts`中，添加如下内容：

```javascript
import {Injectable} from 'angular2/core';

import {Item} from './CheckableItem';

//用Injectable装饰器声明该类可被依赖注入
@Injectable()
export class ItemService {

    //设置一个初始值数组
    private items: Item[] = [
        {
            isChecked: true,
            txt: 'Learn JavaScript'
        }, {
            isChecked: false,
            txt: 'Learn TypeScript'
        }, {
            isChecked: false,
            txt: 'Learn Angular2'
        }
    ];

    //提供一个方法，返回初始数据的Promise
    getItems(): Promise<Array<Item>> {
        return new Promise((resolve, reject) => {
            //这里手动做延迟是为了模拟网络请求
            setTimeout(() => {
                resolve(this.items);
            }, 1500);
        });
    }
}
```

## 查看效果 ##

本章内容比较简单，写到这里差不多算结束了(其实还没有哦！)，先来跑跑看

```shell
npm start
```

OK，我确信这个代码是可以运行的，那到底什么是`service`？我们现在来对着代码讲一讲。

## 什么是service ##

* `service`是可被替换的
* `service`必须通过依赖注入使用
* `service`通常用作数据存取等应用中可公用逻辑部分

## 如何定义service ##

必须通过`@Injectable`装饰器声明

```javascript
import {Injectable} from 'angular2/core';

@Injectable()
export class ItemService {
}
```

## 使用service ##

**引入service**

```javascript
import {ItemService} from './ItemService';
```

>切忌不要自作多情的`new`她哦！！！！！

**构造器获取实例**

```javascript
constructor(private _itemService: ItemService) { }
```

**自动注入实例**

就像`directives`那样，添加到`@Component`的metadata中

```javascript
providers: [ItemService]
```

就这么简单，so easy 有木有？

![]({{ BASE_PATH }}/assets/images/angular2-04-easy.png)

## 重构 ##

那么我们说，到这里就结束了吗？请看下面，`template`里有这么一段：

![]({{ BASE_PATH }}/assets/images/angular2-04-refactor.png)

* 用了`*ngFor`将`items`列表化
* 用了`*ngIf`控制`loading`的显示状态

是不是感觉有点儿矬了，如果能有个单独的`ItemList`组件该多好？像这样使用：

```javascript
import {Component, OnInit} from 'angular2/core';

import {InputItem} from './InputItem';
import {Item} from './CheckableItem';
import {ItemList} from './ItemList';
import {Counter} from './Counter';

import {ItemService} from './ItemService';

@Component({
    selector: 'my-app',
    template: `
    <h1>My First Angular 2 App</h1>
    <input-item (onItemAdded)="addItem($event)"></input-item>
    <!--
        注意这里，已经换成item-list了哦！
    -->
    <item-list [data]="items" (onItemClicked)="toggle($event)" showLoading="loading">
    </item-list>
    <counter *ngIf="!loading" [items]="items"></counter>
    `,
    directives: [InputItem, ItemList, Counter],
    providers: [ItemService]
})
export class AppComponent implements OnInit {

    items: Item[] = [];
    loading: boolean = true;

    constructor(private _itemService: ItemService) { }

    ngOnInit() {
        this._itemService
            .getItems()
            .then(data => {
                this.loading = false;
                this.items = data;
            });
    }

    addItem(item: Item) {
        this.items = [...this.items, item];
    }

    toggle(e: { item: Item, index: number }) {
        this.items = [
            ...this.items.slice(0, e.index),
            { isChecked: !e.item.isChecked, txt: e.item.txt },
            ...this.items.slice(e.index + 1)
        ];
    }
}
```

### 实现`ItemList` ###

```shell
touch ts/ItemList.ts
```

向刚创建的`ts/ItemList.ts`中，添加如下内容：

```javascript
import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core';

import { CheckableItem, Item } from './CheckableItem';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'item-list',
    template: `
    <checkable-item *ngFor="#item of data; #i=index" [item]="item" (onItemClicked)="clickItem($event, i)">
    </checkable-item>
    <p *ngIf="showLoading">Loading</p>
    `,
    directives: [CheckableItem]
})
export class ItemList {
    @Input() data: Item[];
    @Input() showLoading: boolean;

    @Output() onItemClicked = new EventEmitter();

    clickItem(e: Item, i: number) {
        this.onItemClicked.emit({
            item: e,
            index: i
        });
    }
}
```

一切都结束了，效果仍然没有变，还是很屌的样子!!!!

下回预告：使用`Routing`
