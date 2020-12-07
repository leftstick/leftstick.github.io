(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{367:function(e,t,r){"use strict";r.r(t);var a=r(9),v=Object(a.a)({},(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[r("p",[e._v("首先谈下写这个工具的背景吧，我在为团队招聘前端工程师的过程中，发现人才挖掘是件大事、难事。因为工程师是这样一个群体，有些人经验丰富、能力出众，但口才着实一般，这样的人，如果仅在面试中希望他准确的表达自己的思想和理论知识，那将是非常困难的一件事，面对这种类型的人才，作为用人单位，我们很有可能与其失之交臂。在"),r("code",[e._v("大前端")]),e._v("如此紧缺的现在，我们怎能不捉急？")]),e._v(" "),r("p",[e._v("于是我打算自己写一个机试工具，用来帮助用人单位方便的对候选人进行能力测试。但苦于无从下手，不知道什么样的题目适合拿来做机试测验，直到我看到了大神"),r("a",{attrs:{href:"https://github.com/kolodny",target:"_blank",rel:"noopener noreferrer"}},[e._v("Kolodny"),r("OutboundLink")],1),e._v("的"),r("a",{attrs:{href:"https://github.com/kolodny/exercises",target:"_blank",rel:"noopener noreferrer"}},[e._v("exercises"),r("OutboundLink")],1),e._v("项目，我自己也在做这个"),r("a",{attrs:{href:"https://github.com/leftstick/exercises",target:"_blank",rel:"noopener noreferrer"}},[e._v("测试"),r("OutboundLink")],1),e._v("，发现有些题目还是比较难的，而且该项目提供的测试用例相对比较完善，导致完成该练习的难度和所需时间大幅增加。其实不适合作为面试题目。除非作为用人单位的你有大把的时间让候选人思考，并且准备好饮料、干粮，让他撸起袖子开干！")]),e._v(" "),r("p",[e._v("这里我们就要自问一下，我们面试的目的是什么？是为了找一个能在10分钟内写出完全没有瑕疵的"),r("code",[e._v("currying")]),e._v("函数的大牛么(当然，提前背过题的不算)？我当然不否认招到大牛绝对是赚了，但事实是大牛不常有啊！我们正常的用人思路是，招到具备独立思考能力并且对于"),r("code",[e._v("JavaScript")]),e._v("有很好理解的工程师。我们实在没必要苛求一个候选人是否通读过"),r("a",{attrs:{href:"http://jquery.com/",target:"_blank",rel:"noopener noreferrer"}},[e._v("jquery"),r("OutboundLink")],1),e._v("源码，是否精读过"),r("a",{attrs:{href:"https://lodash.com",target:"_blank",rel:"noopener noreferrer"}},[e._v("lodash"),r("OutboundLink")],1),e._v("源码，因为这很可能与他已有的工作没有任何关系。考察一个工程师的重要指标是他能否通过已有知识和思考来快速解决问题。于是，一个只做基本功能检测，提供恰当测试题目的测验工具的想法就出现了。")]),e._v(" "),r("p",[e._v("我们这就来看下"),r("a",{attrs:{href:"https://www.npmjs.com/package/fe-interview",target:"_blank",rel:"noopener noreferrer"}},[e._v("fe-interview"),r("OutboundLink")],1),e._v("是怎么玩的")]),e._v(" "),r("h4",{attrs:{id:"安装利器"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#安装利器"}},[e._v("#")]),e._v(" 安装利器")]),e._v(" "),r("div",{staticClass:"language-bash extra-class"},[r("pre",{pre:!0,attrs:{class:"language-bash"}},[r("code",[r("span",{pre:!0,attrs:{class:"token function"}},[e._v("npm")]),e._v(" "),r("span",{pre:!0,attrs:{class:"token function"}},[e._v("install")]),e._v(" -g fe-interview\n")])])]),r("blockquote",[r("p",[e._v("非windows系统需要"),r("code",[e._v("sudo")])])]),e._v(" "),r("h4",{attrs:{id:"开考"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#开考"}},[e._v("#")]),e._v(" 开考")]),e._v(" "),r("p",[e._v("安装完毕后，在任意目录下输入"),r("code",[e._v("fe")]),e._v("命令，回车一把，你就看到如下界面了：")]),e._v(" "),r("img",{attrs:{src:e.$withBase("/images/interview_preview01.png"),alt:"interview"}}),e._v(" "),r("p",[e._v("接下来，交给你的候选人吧，让他自己选择题目，开始完成测试吧。")]),e._v(" "),r("blockquote",[r("p",[e._v("通过键盘光标上/下键选择测试题目")])]),e._v(" "),r("p",[e._v("OK，题目选择后，就进入了该题目的具体测验步骤页面：")]),e._v(" "),r("img",{attrs:{src:e.$withBase("/images/interview_preview02.png"),alt:"interview02"}}),e._v(" "),r("p",[e._v("仍然可以通过键盘上/下键选择"),r("code",[e._v("查看题目描述")]),e._v("、"),r("code",[e._v("查看测试用例")]),e._v("、"),r("code",[e._v("检验答题结果")]),e._v("。")]),e._v(" "),r("h5",{attrs:{id:"查看题目描述"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#查看题目描述"}},[e._v("#")]),e._v(" 查看题目描述")]),e._v(" "),r("img",{attrs:{src:e.$withBase("/images/interview_preview03.png"),alt:"interview03"}}),e._v(" "),r("blockquote",[r("p",[e._v("查看题目描述后，在当前目录下会自动生成以当前题目id为名的文件夹，里面会有题目的实现文件，用自己喜欢的ide打开该文件，按照题目描述补全实现即可")])]),e._v(" "),r("h5",{attrs:{id:"检验答题结果"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#检验答题结果"}},[e._v("#")]),e._v(" 检验答题结果")]),e._v(" "),r("img",{attrs:{src:e.$withBase("/images/interview_preview05.png"),alt:"interview05"}}),e._v(" "),r("blockquote",[r("p",[e._v("实现补全后，再次通过"),r("code",[e._v("fe")]),e._v("命令进入该题目的操作界面，选择"),r("code",[e._v("检验答题结果")]),e._v("，就可以看到如上图所示的测验结果了")])]),e._v(" "),r("h5",{attrs:{id:"查看测试用例"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#查看测试用例"}},[e._v("#")]),e._v(" 查看测试用例")]),e._v(" "),r("img",{attrs:{src:e.$withBase("/images/interview_preview04.png"),alt:"interview04"}}),e._v(" "),r("blockquote",[r("p",[e._v("有时候题目做错了，可能不知道错在哪里了，OK。通过这个选项，测试用例会被生成到当前目录下与题目实现相同的文件夹下，通过喜欢的IDE打开这个"),r("code",[e._v("Test.js")]),e._v("查看即可")])]),e._v(" "),r("h4",{attrs:{id:"测试结束"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#测试结束"}},[e._v("#")]),e._v(" 测试结束")]),e._v(" "),r("p",[e._v("当候选人完成了你指定的题目后，一起来看看测试结果、看看实现内容。你应该就大致有了一个基本的看法了。是否录用，你说了算！")]),e._v(" "),r("h4",{attrs:{id:"写在最后"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#写在最后"}},[e._v("#")]),e._v(" 写在最后")]),e._v(" "),r("p",[e._v("按照我最上面说的项目目标，我相信这个项目仍然有很多题目可以完善，欢迎各种"),r("code",[e._v("pull request")]),e._v("，各种讨论")])])}),[],!1,null,null,null);t.default=v.exports}}]);