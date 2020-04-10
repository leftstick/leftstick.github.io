---
title: "打造一款在线机试工具"
date: 2020-04-15
author: Howard Zuo
location: Shanghai
tags: 
  - coding
  - interview
---

## 背景

工程师面试是个很有意思的过程，千人千面。有人健谈，会针对自己的过往经历侃侃而谈，其中不乏对业务的深度思考，对技术的执着追求，当然也可能纯粹就是胡说八道；有人内向，明明做过不错的东西，但拼尽全力也讲不清楚业务上到底解决了什么痛点，技术上自己克服了哪些难关。

于是，让候选人 coding something 就成了最有效的交流方式。我们用过[codeshare](https://codeshare.io/)、[HackerRank](https://www.hackerrank.com/)、[LeetCode](https://leetcode.com/)，甚至尝试过用[vscode](https://code.visualstudio.com/)的[Live Share](https://code.visualstudio.com/blogs/2017/11/15/live-share)。说实话，各有千秋。


然后突发奇想，既然是前端测验，反正跑的都是 `javascript`，我们能不能做一个简易版的 web 考核工具，候选人写完题目直接本页面跑测试用例检查结果呢？

于是有了本文涉及的这个小工具。

## 设计

首先我们需要的是明确需求，这点所有研发的朋友都很了解。下面就来先梳理一下要完成的目标：

- 作为面试官，我需要若干题目可选，因为面试时间有限、候选人经历不同，可以指定不同的题目要求候选人作答
- 作为面试官，如果现有题目不合我意，我希望增加一个新题目的成本不要太高
- 作为面试官，我希望每个题目能有一个基本的代码结构，并且可以限定候选人在其中作答。（因为之前有遇到几位候选人，修改了题目，并振振有词『你也没说不能改题目啊』）
- 作为面试官，我希望每个题目都能有测试用例，并且测试用例要对候选人可见，方便候选人理解题目
- 作为候选人，我希望测试用例可以在线执行，并且显示每个用例的执行结果，方便我排查错误
- 作为候选人，我希望系统能帮我记录每个题目的作答，这样就不会在题目切换后，之前的作答丢失



### UI/交互 设计

从使用者视角出发，提供一个简单清爽的交互界面，让人一目了然，尽可能降低理解成本，毕竟面试时间有限，例如 之前使用 `HackerRank` 或者 `LeetCode` 这类不仅提供代码在线编辑，同时也可以在线检测结果的工具，如果候选人之前没接触过，我们就必须留有一定时间让他熟悉，甚至提供一些引导，以避免候选人因为紧张而操作不当，最终影响面试结果。

所以小工具，力求功能简单粗暴。大致风格如下：

<img :src="$withBase('/images/online-interview-tool-mockup.png')" alt="mockup" />

简单的左|中|右布局：
- 左侧题目选择
- 中间代码编辑区域
- 右侧测试用例执行模块。(可隐藏)


### 程序 设计

为每个需求整理下设计思路，如下：

要完成 UI/交互 设计的样式，其实不复杂，利用 [ant-design/layout](https://ant.design/components/layout/) 就可以轻松实现一个左右布局。


#### 作为面试官，我需要若干题目可选，因为面试时间有限、候选人经历不同，可以指定不同的题目要求候选人作答

题目选择设计为路由驱动即可，即：`/:examId` ，点击左侧不同的题目，切换路由。页面根据路由参数 `examId` 加载指定的题目到右侧的编辑器，以及测试用例模块初始化。

#### 作为面试官，如果现有题目不合我意，我希望增加一个新题目的成本不要太高

目前的设计是从工具本身的源码着手，所以要求整个项目在新增题目的部分具有相对的灵活性和简便性。我现在采用以目录为单位的题目储备形式，如下：

```
├── src
│   └── exams
│       ├── exam1
│       │   ├── index.ts
│       │   ├── question.txt
│       │   └── testcase.ts
│       ├── exam2
│       │   ├── index.ts
│       │   ├── question.txt
│       │   └── testcase.ts
│       ├── ...
```


- `index.ts` 作为每个题目的入口文件，负责整个题目的结构组装
- `question.txt` 题目的code base
- `testcase.ts` 测试用例

#### 作为面试官，我希望每个题目能有一个基本的代码结构，并且可以限定候选人在其中作答

下面是一个题目的数据结构描述：

```typescript
interface ESM<T> {
  default: T
}

export interface IExamRaw {
  // 路由参数
  id: string
  // 左侧菜单文字
  title: string
  // 验证题目合法性的正则（防候选人篡改题目）
  contentRegexp: RegExp
  // 考虑到题目可能会比较多，为避免初始化加载的 js bundle 过大，
  // 所以题目内容和测试用例采用延迟加载
  getExamInitial: () => Promise<ESM<string>>
  getTestcases: () => Promise<ESM<string[]>>
}
```

以 题目1 为例，我们分别看下 `question.txt`、`testcase.ts`、`index.ts` 该如何编写：

**question.txt**

```text
/**
 *  要求，尝试完成如下功能：
 *
 *  isString('hello')              = true
 *  isString(123)                  = false
 *  isString(undefined)            = false
 *  isString(null)                 = false
 *  isString(new String('hello'))  = true
 *
 **/
function isString(value) {
  //在这里实现
}
```

> 纯文本，用来初始化 右侧的代码编辑器。候选人在选中题目后，就会在这个基础上进行编码。

**testcase.ts**

```typescript
export default [
  `assert(isString('hello'), '原始string类型校验失败')`,
  `assert.equal(isString(12445), false, '原始数值类型校验失败')`,
  `assert.equal(isString(undefined), false, '未初始化变量校验失败')`,
  `assert.equal(isString(null), false, '空值校验失败')`,
  `assert(isString(new String('hello')), '字符串对象校验失败')`,
  `assert.equal(isString({ name: 'aaa' }), false, '字面量类型校验失败')`
]
```

> 默认导出一个字符串数组，每条记录就是一个测试用例，会被用来显示在右侧的测试用例模块中

**index.ts**

```typescript
import { defineExamRaw } from '@/types'

export default defineExamRaw({
  id: 'exam1',
  title: '01. 判断一个变量是否字符串',
  getExamInitial: () => import(/* webpackChunkName: "exam1" */ './question.txt'),
  getTestcases: () => import(/* webpackChunkName: "case1" */ './testcase'),
  contentRegexp: /function\s*isString\(value\)\s*{[\s\S]*}/
})
```

> 这里延迟加载是利用了 [webpack/dynamic-imports](https://webpack.js.org/guides/code-splitting/#dynamic-imports) 功能，使用 [ECMA/import语法](https://github.com/tc39/proposal-dynamic-import) 来完成的；正则表达式用来实时验证候选人是否在指定区域编写方案，如果修改了题目，则给予提示

#### 作为面试官，我希望每个题目都能有测试用例，并且测试用例要对候选人可见，方便候选人理解题目
#### 作为候选人，我希望测试用例可以在线执行，并且显示每个用例的执行结果，方便我排查错误

这个需求是本项目的核心难点，即：我们需要在浏览器里一个『源码容器』来加载 用户编辑后的题目代码文本，并通过预置的测试用例运行该代码，并反馈结果。

这里请大家疯狂思考几分钟，如果是你，这个部分你怎么设计？

<img style="display: block; margin-left: auto; margin-right: auto;" :src="$withBase('/images/thinking.gif')" alt="thinking" />


可能有同学想到了，利用 [eval](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/eval) 或者 [Function](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function) 都可以完成需求。

我这里选用了 `Function` 构造器，下面介绍下如何使用。依旧以上面提到的 题目1 为例。假设候选人已经在编辑器里修改了代码，如下：

```typescript
/**
 *  要求，尝试完成如下功能：
 *
 *  isString('hello')              = true
 *  isString(123)                  = false
 *  isString(undefined)            = false
 *  isString(null)                 = false
 *  isString(new String('hello'))  = true
 *
 **/
function isString(value) {
  return typeof value === 'string'
}
```

这只是一段『纯文本』，在我们项目的执行上下文里，如果将她转换为 真正的函数呢？

其实代码写出来，就特别简单了，如下：

```typescript
// 从编辑器读取到代码文本
export function reflectFunctionFromText(code: string) {
  try {
    // 通过正则删除其中的注释部分（即：题目说明）
    const realCode = removeComments(code)
    // 直接构造一个新的 Function，并执行她，就拿到了 我们期望的 isString函数
    return new Function(`return ${realCode}`)()
  } catch (e) {
    return () => {}
  }
}
```

其中，``new Function(`return ${realCode}`)`` 的就是如下代码的等式：

```typescript
function anonymous() {
  return function isString(value) {
    return typeof value === 'string'
  }
}
```