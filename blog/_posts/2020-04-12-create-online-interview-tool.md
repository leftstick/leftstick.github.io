---
title: "打造一款js测验小工具"
date: 2020-04-12
author: Howard Zuo
location: Shanghai
tags: 
  - coding
  - interview
---

## 背景

疫情期间远程面试量增加，这其实为 coding 考核提供了比到面更好的基础（候选人可以使用自己的电脑，在自己熟悉的环境里，降低由于不熟练、紧张导致的失误率）。

我用过[codeshare](https://codeshare.io/)、[HackerRank](https://www.hackerrank.com/)、[LeetCode](https://leetcode.com/)，甚至尝试过用[vscode](https://code.visualstudio.com/)的[Live Share](https://code.visualstudio.com/blogs/2017/11/15/live-share)。在频繁使用这些工具后突发奇想，既然是前端测验，反正跑的都是 `javascript`，我们能不能做一个简易版的 web 考核工具，候选人写完题目直接本页面跑测试用例检查结果呢？

答案肯定是『能』，愿意动手就行。于是有了本文涉及的这个小工具。

## 需求

首先我们需要的是明确需求，这点所有研发的朋友都很了解。下面就来先梳理一下要完成的目标：

- 作为面试官，我需要题目可选，因为面试时间有限、候选人经历不同，可以指定不同的题目要求候选人作答
- 作为面试官，如果现有题目不合我意，我希望增加一个新题目的成本不要太高
- 作为面试官，我希望每个题目能有一个基本的代码结构，并且可以限定候选人在其中作答。（因为之前有遇到几位候选人，修改了题目，并振振有词『你也没说不能改题目啊』）
- 作为面试官，我希望每个题目都能有测试用例，并且测试用例要对候选人可见，方便候选人理解题目
- 作为候选人，我希望测试用例可以在线执行，并且显示每个用例的执行结果，方便我排查错误
- 作为候选人，我希望系统能帮我记录每个题目的作答，这样就不会在题目切换后，之前的作答丢失



## UI/交互 设计

从使用者视角出发，提供一个简单清爽的交互界面，让人一目了然，尽可能降低理解成本，毕竟面试时间有限，例如 之前使用 `HackerRank` 或者 `LeetCode` 这类不仅提供代码在线编辑，同时也可以在线检测结果的工具，如果候选人之前没接触过，我们就必须留有一定时间让他熟悉，甚至提供一些引导，以避免候选人因为紧张而操作不当，最终影响面试结果。

所以小工具，力求功能简单粗暴。大致风格如下：

<img :src="$withBase('/images/online-interview-tool-mockup.png')" alt="mockup" />

简单的左|中|右布局：
- 左侧题目选择
- 中间代码编辑区域
- 右侧测试用例执行模块。(可隐藏)


## 程序功能点分析

因为熟练度关系，框架就选择了基于 `react` 的企业级应用开发框架 [umi](https://umijs.org/)。熟悉 `java` 的朋友可以把她理解成 前端 `react` 领域的 [srping-boot](https://spring.io/projects/spring-boot)，她提供了开发一个应用需要的各种技术（诸如：路由管理、权限控制、状态管理、调试、代码拆分等 ）的最佳实践以及配置，并以[Convention over configuration](https://en.wikipedia.org/wiki/Convention_over_configuration)作为指导思想提供了一系列便利开发者的接口，以此帮助开发者简化应用开发的成本。

广告结束。。。


接下来为每个需求整理下设计思路。

要完成 UI/交互 设计的样式，其实不复杂，利用 [ant-design/layout](https://ant.design/components/layout/) 就可以轻松实现一个左右布局。


### 作为面试官，我需要若干题目可选，因为面试时间有限、候选人经历不同，可以指定不同的题目要求候选人作答

题目选择设计为路由驱动即可，即：`/:examId` ，点击左侧不同的题目，切换路由。页面根据路由参数 `examId` 加载指定的题目到右侧的编辑器，以及测试用例模块初始化。

### 作为面试官，如果现有题目不合我意，我希望增加一个新题目的成本不要太高

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

既然要封装一个统一的数据结构在入口文件 （`index.ts`）里，那么就为她设计一个满足我们需求的数据结构，如下：

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

```
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

### 作为面试官，我希望每个题目能有一个基本的代码结构，并且可以限定候选人在其中作答

请回顾上面提到的数据结构：

```typescript
export interface IExamRaw {
  id: string
  title: string
  // 这个正则时关键，她就是我们用来限制候选人答题的基础
  // 当候选人编辑源码时，用该正则进行校验，如果不符合条件则认为候选人
  // 修改了题目
  contentRegexp: RegExp
  getExamInitial: () => Promise<ESM<string>>
  getTestcases: () => Promise<ESM<string[]>>
}
```

### 作为面试官，我希望每个题目都能有测试用例，并且测试用例要对候选人可见，方便候选人理解题目
### 作为候选人，我希望测试用例可以在线执行，并且显示每个用例的执行结果，方便我排查错误

这个需求是本项目的核心问题点，即：我们需要在浏览器里制造一个『源码容器』来加载 用户编辑后的题目代码文本，并通过预置的测试用例运行该代码，并反馈结果。

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

于是，我们通过 `reflectFunctionFromText` 方法，就得到了候选人实现的 `isString` 了。

> 之所以用 `Function` 构造器而不用 `eval`，[MDN/Never user eval](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#Never_use_eval!) 已经介绍的非常清楚，这里就不再赘述了。

接下来就是测试用例执行的问题了，继续以 题目1 为例，一条测试用例其实就是一条 `string`，感觉很符合 `Function` 构造器的口味：

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

只要能解决这条 `string` 中需要的变量 `assert` 和 `isString` 就大功告成了。


于是我们翻翻 [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/Function) 的文档，找到了这么一段：

<img :src="$withBase('/images/function_desc.png')" alt="Function" />

也就是说，`Function` 构造器的最后一个参数就是生成函数的 『函数体』，而前面的若干参数，就是生成函数的 『参数』。那么我们可以针对每条测试用例生成一个执行本条测试用例的函数，如下：

```typescript
// 从候选人编写的源码中提取函数名，这里是: isString
function reflectFunctionName(code: string) {
  return code.match(/function\s*([a-zA-Z_][a-zA-Z_0-1]*).*/)?.[1]
}

// 从候选人输入中提取
const currentFuncName = reflectFunctionName(code)
const testcaseExecFunc = new Function('assert', currentFuncName, testcase)
```

这里的 `testcaseExecFunc` 转换成普通的声明代码，就是：

```typescript
const testcaseExecFunc = function (assert, isString) {
  assert(isString('hello'), '原始string类型校验失败')
}
```

执行测试用例的话，只要传入 `assert` 库引用和 之前用 `reflectFunctionFromText` 得到的候选人输入函数就可以了。如下：

```typescript
 try {
  testcaseExecFunc(assert, currentFunc)
  // 测试用例执行成功
} catch (e) {
  // 测试用例执行失败
}
```

### 作为候选人，我希望系统能帮我记录每个题目的作答，这样就不会在题目切换后，之前的作答丢失

这个简单吧，监听用户输入，变更时把内容存入 `sessionStorage` 即可。

## 程序数据管理

数据状态管理是本项目最有趣的尝试，用久了 `react-redux`，面对大量的 boilerplate、类型推导缺失（`typescript` 版倒是有类型了，只不过代码风格和体量又有点一言难尽）。不论如何，鉴于现在社区中利用自定义 `hooks` 取代传统数据管理的思路呼声很高，所以我想试试。于是设计了一个这样的自定义 `hooks`，给她命名为 `useInterviewModel`，她应该具备如下功能：

```typescript
// 之前定义的题目数据结构
import rawExams from '../exams'

export interface IExam {
  id: string
  title: string
  code: string
  contentRegexp: RegExp
  testcases: ITestcase[]
}

export default function useInterviewModel() {
  // 一个当前操作的 题目 状态，左侧菜单切换时，该状态变更
  const [workingExam, setWorkingExam] = useState<IExam>()

  const matchExam = useCallback((pathname: string): boolean => {
    // pathname 是当前路由，根据之前的路由约定，应该就是 /:examId
    // 判断当前路由里的 examId 是否存在于 rawExams。
    // 用作 用户输入不存在题目路径时，重定向
  }, [])

  const setupExam = useCallback(
    (examId: string) => {
      
      // 根据当前访问的 examId，找到对应的 examRaw，
      // 并加载其中的 getExamInitial 和 getTestcases
      // 加载完毕后设置为 workingExam

      return () => {
        // 切换路由时，重置数据
        setWorkingExam(undefined)
        setExecutorVisible(false)
      }
    },
    [setWorkingExam]
  )

  const modifyCode = useCallback(
    (code: string) => {
      // 候选人每次修改代码时，通过这里设置到 workingExam / sessionStorage 中
      // 并利用 workingExam 里的正则检查输入是否合法，不合法给予提示
    },
    [setWorkingExam]
  )

  const execTestcases = useCallback(() => {
    // 点击 运行测试用例按钮，依次执行每个测试用例，并修改 
    // workingExam 中 testcases 的状态
  }, [setWorkingExam])

  return {
    matchExam,
    setupExam,
    workingExam,
    modifyCode,
    execTestcases
  }
}

```



那么问题来了，我们都知道 `hooks` 在多个组件中引用时复用的不是内部的状态，而是逻辑。官网介绍在此：

> **Do two components using the same Hook share state?** No. Custom Hooks are a mechanism to reuse stateful logic (such as setting up a subscription and remembering the current value), but every time you use a custom Hook, all state and effects inside of it are fully isolated.

但我的确需要在组成一个页面的多个组件中 share 上面定义的数据，不然那套数据就无意义了。于是设计一个可以把状态也共享的轮子，把 自定义 `hooks` 处理一下，并且能保证引用关系和类型被准确导出就显得很有必要了。

万幸，这个东西在 `umi` 里已经有了，叫 [model](https://umijs.org/plugins/plugin-model)，实现原理可以参考[从 custom Hooks 到 shared Hooks ：hox 原理分析](https://zhuanlan.zhihu.com/p/89518937)，接下来问题就简单了，我上面定义的 `useInterviewModel` 无需做任何结构上的调整，只要补全实现，然后在各个组件里引用就大功告成了。

## 展示结果

源码地址：[js-interview-online](https://github.com/leftstick/js-interview-online)

<img :src="$withBase('/images/js_interview_online_demo.gif')" alt="demo" />
