---
layout: post
title: "生命之诗-node"
description: ""
category: "node"
tags: ["poetry", "node", "tech"]
---
{% include JB/setup %}

```JavaScript
'use strict'

var plan;
var steps = {
    '?': 'Go doing something else',
    'success': 'Yeah, go for next target',
    'failure': 'Get up, try it again'
};

var random = function(things){
    var index = Math.floor(Math.random() * things.length);
    return things[index];
};

while(true){
    console.log('Life is a long trip');
    plan = random(Object.keys(steps));
    console.log(steps[plan]);
    if(random(['live', 'die']) === 'die'){
        console.log('Fuck, am i dead now?');
        return;
    }
}
```

    ;生命是一段漫长的旅程
    ;想了，就去做
    ;输了，重头再来
    ;摔了，爬起来继续
    ;赢了，还要再往前走
    ;死了，没留下任何遗憾
