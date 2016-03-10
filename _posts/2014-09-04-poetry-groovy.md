---
layout: post
title: "生命之诗-groovy"
description: ""
category: "groovy"
tags: ["poetry", "groovy", "tech"]
shortContent: "Groovy是一种基于JVM的敏捷开发语言，作为与Gradle同生共死的小伙伴儿，它写诗是什么感觉，我们拭目以待"
---
{% include JB/setup %}

```groovy
class PoetryGroovy {

    final plans = ["Failed, try again", "Fell down, come on", "Congratulations, keep going"]

    def random = { new Random().nextInt(it) }
    def retry = {
        def index = random(3)
        println(plans[index])
        if (index == 0) {
             retry()
        }
    }
    def doPlan = {
        println("I got new plan")
        retry()
    }

    void life() {
        doPlan()
        if (random(2) == 0) {
            println "No regrets"
            return
        }
        life()
    }

    static void main(args) {
        def poe = new PoetryGroovy();
        poe.life()
    }
}
```

```ini
;生命是一段漫长的旅程
;想了，就去做
;输了，重头再来
;摔了，爬起来继续
;赢了，还要再往前走
;死了，没留下任何遗憾
```