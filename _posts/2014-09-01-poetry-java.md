---
layout: post
title: "生命之诗-java"
description: ""
category: "java"
tags: ["poetry", "java", "tech"]
---
{% include JB/setup %}

```java
import java.util.Random;

public class Poetry {

    private Random ran;
    private String[] plans;

    public Poetry() {
        ran = new Random();
        plans = new String[3];
        plans[0] = "Failed? Try it again";
        plans[1] = "In trouble? Come on";
        plans[2] = "Congratulations, go on";
    }

    public void doPlan() {
        int index = ran.nextInt(3);
        System.out.println(this.plans[index]);
        if(index == 0){
            this.doPlan();
        }
    }

    public void life() {
        System.out.println("I got new plan");
        this.doPlan();

        if(ran.nextInt(2) == 0){
            System.out.println("No regrets");
            return;
        }
        this.life();
    }
    
    public static void main(String[] args) {
        Poetry poe = new Poetry();
        poe.life();
    }
}
```

    ;生命是一段漫长的旅程
    ;想了，就去做
    ;输了，重头再来
    ;摔了，爬起来继续
    ;赢了，还要再往前走
    ;死了，没留下任何遗憾