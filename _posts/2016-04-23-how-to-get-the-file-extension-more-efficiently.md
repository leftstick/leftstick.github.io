---
layout: post
title: "[译]如何更有效的获取文件扩展名"
description: ""
category: "tech"
tags: ["angular2", "tutorial", "component"]
shortContent: "在这一章里，带你领略更有效的获取文件扩展名之道！"
---
{% include JB/setup %}

## 问：如何获取文件扩展名？ ##

```javascript
var file1 = "50.xsl";
var file2 = "30.doc";
getFileExtension(file1); //xsl
getFileExtension(file2); //doc

function getFileExtension(filename) {
  /*TODO*/
}
```

## 方案一：正则表达式 ##

```javascript
function getFileExtension1(filename) {
    return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined;
}
```

## 方案二：使用`String`的`split`方法 ##

```javascript
function getFileExtension2(filename) {
    return filename.split('.').pop();
}
```

>上述两种方案无法覆盖一些极端情况，下面这个更健壮

## 方案三：使用`String`的`slice`，`lastIndexOf`方法 ##

```javascript
function getFileExtension3(filename) {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

console.log(getFileExtension3(''));                            // ''
console.log(getFileExtension3('filename'));                    // ''
console.log(getFileExtension3('filename.txt'));                // 'txt'   
console.log(getFileExtension3('.hiddenfile'));                 // ''
console.log(getFileExtension3('filename.with.many.dots.ext')); // 'ext'
```

这货怎么工作的？

* [String.lastIndexOf](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/lastIndexOf)返回指定值的最后出现位置(本例里是：`.`)。如果返回`-1`，表示没找到该指定值
* 当参数是`filename`，`.hiddenfile`时，`lastIndexOf`的返回值分别是`-1`和`0`。然后[无符号移位操作符](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#%3E%3E%3E_%28Zero-fill_right_shift%29)将`-2`转成了`4294967294`、`-1`转成了`4294967295`，这个小技巧保证了极端状况下文件名也不会变
* 然后[String.prototype.slice](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice)就以上面的计算结果作为起始下标从原始字符串中提取出了正确的文件扩展名。如果上一步骤计算出的起始下标大于原始字符串长度，则返回`''`

## 比较 ##

| 方案           | 参数           | 结果  |
| ------------- |:-------------:| -----:|
| 正则表达式      | ''            | undefined |
|               | 'filename'    | undefined |
|               | 'filename.txt'    | 'txt' |
|               | '.hiddenfile'    | 'hiddenfile' |
|               | 'filename.with.many.dots.ext'    | 'ext' |
| `String`的`split`      | ''      |   '' |
|                        | 'filename'      |   'filename' |
|                        | 'filename.txt'      |   'txt' |
|                        | '.hiddenfile'      |   'hiddenfile' |
|                        | 'filename.with.many.dots.ext'      |   'ext' |
| `String`的`slice`和`lastIndexOf` | ''      |    '' |
|                                 | 'filename'      |    '' |
|                                 | 'filename.txt'      |    'txt' |
|                                 | '.hiddenfile'      |    'hiddenfile' |
|                                 | 'filename.with.many.dots.ext'      |    'ext' |

## 在线演示和性能 ##

上述代码的[线上实例](https://jsbin.com/tipofu/edit?js,console)
上述三个方案的[性能测试](http://jsperf.com/extract-file-extension)

## 源码 ##

[JavaScript里如果获取文件扩展名](http://stackoverflow.com/questions/190852/how-can-i-get-file-extensions-with-javascript)

原文地址：[How to get the file extension more efficiently](http://www.jstips.co/en/get-file-extension/)
