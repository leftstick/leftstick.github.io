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

var plans = ['Failed, try again',
    'Fell down, come on',
    'Congratulation, keep going'
];

var random = function(n) {
    return Math.floor(Math.random() * (n + 1));
};

var life = function() {
    console.log('I got new plan');

    var planIndex = random(2);

    do {
        console.log(plans[planIndex]);
        planIndex = random(2);
    } while (!planIndex);

    if (random(1) === 0) {
        console.log('No regrets');
        return;
    }

    life();
};

life();
```

    ;生命是一段漫长的旅程
    ;想了，就去做
    ;输了，重头再来
    ;摔了，爬起来继续
    ;赢了，还要再往前走
    ;死了，没留下任何遗憾
