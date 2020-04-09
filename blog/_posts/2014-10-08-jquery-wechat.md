---
title: "用jQuery.wechat创建你的微信web应用"
date: 2014-10-08
author: Howard Zuo
location: Shanghai
tags: 
  - web
  - jQuery-plugin
---


因为最近自己的产品要在微信公众号中推广，需要提供一些`有意义`的功能，于是被迫走上了支持微信这条不归路。

众所周知，腾讯是那样一个神奇的公司，他们的产品在商业上获得巨大成功，但技术上真的很难令人恭维，没有精益求精，只有能用就成，诺大一个公众号开发平台，我竟然找不到`真正的，关于web开发的`官方文档，有的就是个别示例，剩下的...呵呵，有一个叫`开发者交流互助`的东东了。

<img :src="$withBase('/images/wechat_doc.png')" alt="demo">

看完上面这个图后，有没有这样的感觉：

```yaml
A: 你知道老王家有几口人么？

B: 不知道，我就在大门口见过他老婆，估计就俩人吧？

C: 不会吧，那天看见还有个小孩儿进他们家，会不会是老王家孩子？

D: 唉！谁他妈都没去过老王家，也不认识老王，老王也不自我坦白，鬼才知道他们家几口人！
```

例子或许不那么恰当，但就是这么个道理，一群开发者在死去活来的摸索，还互相慰藉，就是永远得不到正确答案！o(∩\_∩)o 哈哈

说了这么多，赶紧入正题，本期要讲的就是我痛苦中挣扎徘徊后写的[jQuery.wechat][jquery-wechat-url]，一个提供了统一API的、基于[jQuery.promise][promise-url]的jQuery.plugin。希望能多少帮助到大家。

#### 首先，安装那是相当的简单 ####

```bash
bower install --save jquery-wechat
```

> 如果不用bower的，自己从[Github][download-url]上下载、解压，那也是一样一样滴！


##### 加载，那也是水一样的自然 #####

```markup
<script type="text/javascript" src="bower_components/jquery/dist/jquery.min.js"></script>
<script type="text/javascript" src="bower_components/jquery-wechat/dist/jquery-wechat.min.js"></script>
```

> 你如果用了`amd`，`cmd`之类的延迟加载技术，想必你也是个行家，不用我再教你怎么配置了吧？

##### 使用——简单、轻松、统一、爽！ #####

###### 启用`jQuery.wechat`功能 ######

```javascript
$.wechat.enable(); //So easy!
```

因为整个插件是基于[jQuery.promise][promise-url]的，所以你也可以给它一个链：

```javascript
$.wechat.enable().done(function(){
    alert('已经启用成功');
}).fail(function(){
    alert('启用失败');
});
```

> 考虑到目前单页技术([SPA][spa-url])的广泛应用，工具类的设计必须考虑`启用/停用`机制，否则可能引起未知错误。


###### 隐藏/显示菜单 ######

```javascript
$.wechat.hideMenu(); //隐藏菜单
$.wechat.showMenu(); //显示菜单
```

> 启用`jQuery.wechat`之后，就可以随意调用如`hideMenu`之类的方法了，无需将其他方法写入`enable`的`done`回调之中。`jQuery.wechat`的实现原理是，如果`jQuery.wechat`还没有启用成功，所有操作会进入排队，一旦启用成功后，则顺序执行；如果启用失败，则永远不会执行。

###### 隐藏/显示底部工具栏 ######

```javascript
$.wechat.hideToolbar(); //隐藏底部工具栏
$.wechat.showToolbar(); //显示底部工具栏
```

###### 打开扫描二维码界面 ######

```javascript
$.wechat.scanQRcode();
```

###### 打开图片预览工具 ######

```javascript
$.wechat.preview({
    current: 'http://xxx/img/pic001.jpg',  //进入预览模式后，直接显示这张图片
    urls: [
        'http://xxx/img/pic001.jpg',
        'http://xxx/img/pic002.jpg',
        'http://xxx/img/pic003.jpg',
        'http://xxx/img/pic004.jpg',
        'http://xxx/img/pic005.jpg',
        'http://xxx/img/pic006.jpg'
    ]                                      //所有要在预览模式下显示的图片
});
```

###### 获取网络状态 ######

```javascript
$.wechat.getNetworkType().done(function(response) {
    $('#network').text(response.split(':')[1]);
});
```

`response`格式如下：

```yaml
network_type:wifi    wifi网络
network_type:edge    非wifi,包含3G/2G
network_type:fail    网络断开连接
network_type:wwan    (2g或者3g)
```

###### 修改分享格式 ######

每次看到别人的app分享出来的消息都带着精美的缩略图、适当的标题和描述，更有甚者消息下面还跟了一行小字指出该消息是由`谁`发送出来的；再看看你自己分享出去的消息，一个蓝色的默认空白图片，配着不搭调的标题，会不会奇怪是什么逻辑把他们塞进去的？

还好，咱们现在就来解决这个问题:

```javascript
$.wechat.setShareOption({
    appid: 'xxxx',                                               //小标appid
    img_width: '60',
    img_height: '60',
    img_url: window.location.toString() + 'img/demo.jpg',        //缩略图
    title: 'DEMO',                                               //标题
    desc: 'The description is set from $.wechat.setShareOption', //描述
    link: function() {
        return window.location.toString();                       //消息分享出去后，用户点击消息打开的链接地址
    },
    callback: function(response) {
        alert(response);                                         //分享后的回调函数，常见的有成功和取消
    }
});
```

具体参考如下截图：

<img :src="$withBase('/images/share.png')" alt="share" />

> 该分享格式变更会影响`发送给朋友`、`分享到朋友圈`、`分享到微博`、`发送邮件`四项功能。当设置后，再点击右上角菜单键打开菜单后，选择前述四项中的任意一项，就能看到更改后的效果


###### 关闭当前页 ######

```javascript
$.wechat.closeWindow();
```

###### 停用`jQuery.wechat`机制 ######

```javascript
$.wechat.destroy();
```

> 停用后，所有功能自动重置回初始状态


更多详情，参考[Github-Source](https://github.com/leftstick/jquery-wechat)

若要试用，请微信中打开[jQuery.wechat-DEMO][jquery-wechat-url]

[download-url]: https://github.com/leftstick/jquery-wechat/archive/master.zip
[jquery-wechat-url]: http://leftstick.github.io/jquery-wechat/
[promise-url]: http://api.jquery.com/Types/#Promise
[spa-url]: http://en.wikipedia.org/wiki/Single-page_application
