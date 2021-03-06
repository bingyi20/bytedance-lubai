# 2021大厂前端核心面试题详解

## 1. 说一下工作中解决过的比较困难的问题，说一下自己项目中比较有亮点的地方

## 2. 你了解浏览器的时间循环吗？

2.1 为什么js在浏览器中有事件循环的机制？

JS是单线程的

event loop

2.2 两种任务？

宏任务：整体代码，setTimeout, setInterval, I/O 操作

微任务：new Promise().then, MutationObserver

2.3 为什么要引入微任务的概念，只有宏任务可以吗？
宏任务队列，遵循先进先出的原则，代码执行工程中有可能会产生一些优先级特别高的任务，我们想要它尽快执行，所以引入了微任务的概念。
一个宏任务队列执行过程中产生的微任务队列会等当前宏任务执行之后立即执行，优于后续宏任务执行。

## 你了解Promise吗？ 平时用得多吗？

Promise.all 你知道有什么特性吗？

手写Promise.all吧


## 5. 有做过前端加载优化相关的工作吗？都做过那些努力

做性能优化的目的是什么？
H5直播间用户量巨大，首屏时间加载过慢，用户体验不太好，吐槽很多。

1. 只请求当前需要的资源
    异步加载，懒加载，polyfill

2. 缩减资源体积
    打包压缩 webpack 4 production 内置
    gzip 1.2M 300K
    图片格式的优化，压缩，根据屏幕分辨率展示不同分辨率的图片，webp
    尽量控制cookie大小

3. 时序优化
    js promise.all
    ssr
    prefetch, prerender, preload

4. 合理理解缓存

    cdn cdn预热 cdn刷新

5. 如果有一段js执行时间非常长，怎么去分析？
measure.js

装饰器

6. 阿里云oss支持通过链接后面拼接参数来做图片的格式转换，尝试写一下，把任意图片格式转换为webp，需要注意什么？


## 6. 平时有关注过前端的内存处理吗？

1. 内存的生命周期
    内存分配：声明变量，对象，函数的时候，js会分配内存
    内存使用：内存读写，使用变量的时候
    内存回收：不再使用的时候将其释放/归还

2. 垃圾回收机制
    引用计数：a对象握有b对象的访问权限，就成为a引用b，b上的引用数就计1，当一个对象上的引用数为0，这个对象就可以被回收。
    循环引用，a引用b, b引用a，a，b已经无法被外部使用了。但是由于他们相互引用，引用数为1，无法被清理。

    标记清除：是否可到达，js引擎定期从根元素开始进行递归变量，标记所有可到达的对象和不可到达的对象，基于标记进行回收。


3. js中，有哪些常见的内存泄漏

    1. 全局变量
        不进行手动解除引用全局变量会一直存在于内存中。
    
    2. 未及时清理的定时器和回调
    ```js
    const timer = setTimeout(()=>{
        ...
        clearTimeout(timer)
    }, 1000)
    ```

    3. 闭包
    
    4. dom引用
    ```js
    // dom已经
    const image = document.getElementById("image")
    document.body.removeChild(image)
    ```


4. 如何避免内存泄漏
    1. 减少不必要的全局变量
    2. 使用完数据后，即时解除引用


5. 实现sizeof函数，传入1个参数object，计算这个object占用了多少字节



## 7. 聊一聊HTTP请求相关吧

1. 平时怎么解决跨越问题的？

2. 有做过全局的请求处理吗？比如统一处理登录态？统一处理全局错误？
    axios   
    adaptar
    interceptor request response

3. 代码题，你能给xhr添加hook，实现在各个阶段打日志吗？



## 8. 平时用过发布-订阅模式吗？比如vue中的event bus， node中的eventemitter,手写一个Event bus吧


## 9. 01背包

## 9. webpack，请查看webpack目录



## 10. 给定如下对象，描述了模块之间的依赖关系，实现sortByDep将其排序，使得被依赖模块排在依赖模块之前
```js
    let modules = [
    { name: 'a', requires: ['b', 'c'] },
    { name: 'b', requires: ['c'] },
    { name: 'c', requires: [] },
    ]

    let output = []
    let registeredModules = []
    function sortByDep(modules) {
        modules.sort((x,y) => {
            if(x.requires.indexOf(y) > -1) {
                return 1;
            }else{
                return -1;
            }
        })
    }

    sortByDep(modules)

    console.log(modules)

    // output
    [
        { name: 'c', requires: [] }, // first, no dependencies, and required by both the others
        { name: 'b', requires: ['c'] }, // second, because it needs `c` first
        { name: 'a', requires: ['b', 'c'] }, // last, because requires both the others
    ]
```

