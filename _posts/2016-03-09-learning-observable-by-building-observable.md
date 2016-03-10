---
layout: post
title: "[译]做中学observable"
description: ""
category: "tech"
tags: ["Rx", "Reactive Programming", "observable"]
shortContent: "在最近的社交媒体、活动中，我常被问及关于“hot” vs “cold” observables的问题，或者observable到底是“multicast”还是“unicast”。人们似乎为`Rx.Observable`内部的黑魔法所困。当被要求介绍一下observable时，人们常说：“那就是些Streams”，或“就像是Promises”。而且，我本人也在各种场合的公开演讲中使用过这类说辞。"
---
{% include JB/setup %}


在最近的社交媒体、活动中，我常被问及关于“hot” vs “cold” `observables`的问题，或者`observable`到底是“multicast”还是“unicast”。人们似乎为`Rx.Observable`内部的黑魔法所困。当被要求介绍一下`observable`时，人们常说：“那就是些`Streams`”，或“就像是`Promises`”。而且，我本人也在各种场合的公开演讲中使用过这类说辞。

和`Promises`的比较是必要的，，

The comparison to promises is necessary, but unfortunate. Given that both promises and observables are async primitives, and promises are already widely used and familiar to the JavaScript community, it’s generally a great starting point. Comparing promise’s `then` to observable’s `subscribe`, showing differences in eager vs lazy execution, showing cancellation and reuse of observables, etc. It’s a handy way to introduce beginners to observables.
