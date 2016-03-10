---
layout: post
title: "生命之诗-clojure"
description: ""
category: "clojure"
tags: ["poetry", "clojure", "tech"]
shortContent: "Clojure是一种运行在Java平台上的 Lisp 方言，Lisp是一种以表达性和功能强大著称的编程语言，但人们通常认为它不太适合应用于一般情况，而Clojure的出现彻底改变了这一现状。如今，在任何具备 Java 虚拟机的地方，您都可以利用 Lisp 的强大功能，譬如，写下这首诗"
---
{% include JB/setup %}

```clojure
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

```ini
;生命是一段漫长的旅程
;想了，就去做
;输了，重头再来
;摔了，爬起来继续
;赢了，还要再往前走
;死了，没留下任何遗憾
```