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
    ["Failed, try again" 
    "Fell down, come one" 
    "Congratulations, keep going"])

(defn do-plan [index] 
    (do (println (nth plans index))
        (if (= index 0)
            (do-plan (rand-int 3)))))

(defn life [] 
    (loop [] 
        (do 
            (println "I got new plan")
            (do-plan (rand-int 3))
            (if (= (rand-int 2) 0)
                (println "No regrets")
                (recur))
        )))

(life)
```

    ;生命是一段漫长的旅程
    ;想了，就去做
    ;输了，重头再来
    ;摔了，爬起来继续
    ;赢了，还要再往前走
    ;死了，没留下任何遗憾