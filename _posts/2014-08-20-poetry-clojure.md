---
layout: post
title: "生命之诗-clojure"
description: ""
category: "clojure"
tags: ["poetry", "clojure", "tech"]
---
{% include JB/setup %}

```Clojure
(def plans 
    ["You'v achieved the goal, keep going!^^" 
    "You failed the city, but never mind!" 
    "Do what ever you want!"])
(defn life-poetry [] 
    (if (= (rand-int 2) 0) 
        (println "you're dead, monky") 
        (do 
            (println "life is a long trip") 
            (println (nth plans (rand-int 3))) 
            (life-poetry)))
)
(life-poetry)
```

    ;生命是一段漫长的旅程
    ;想了，就去做
    ;输了，重头再来
    ;摔了，爬起来继续
    ;赢了，还要再往前走
    ;死了，没留下任何遗憾