---
layout: post
title: "生命之诗-java"
description: ""
category: "java"
tags: ["poetry", "java", "tech"]
---
{% include JB/setup %}

```java
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class Poetry {

    private Random ran;
    private List<Runnable> steps;

    public Poetry() {
        ran = new Random();
        steps = new ArrayList<Runnable>();
        steps.add(() -> {
            System.out.println("Do what you love to do.");
        });
        steps.add(() -> {
            System.out.println("Failed? Try it again!");
        });
        steps.add(() -> {
            System.out.println("In trouble? Come on!");
        });
        steps.add(() -> {
            System.out.println("Congratulations, go on!");
        });
        steps.add(() -> {
            throw new RuntimeException("You are dead, bitch!");
        });
    }

    public void life() {
        System.out.println("Life is a long trip.");
        steps.get(ran.nextInt(5)).run();
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