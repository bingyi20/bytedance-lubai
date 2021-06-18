
/**
 * 并发限制 版本1 -> promise.race链式调用
 * @param {Array} urls 请求列表
 * @param {Function} handler 处理函数，返回promise实例
 * @param {Number} limit 并发限制数量
 */
function limitLoad(urls, handler, limit) {
    const sequence = urls.slice()

    const promises = sequence.splice(0, limit).map((url, index) => {
        return loadImg(url).then(()=>{
            return index
        })
    })

    let p = Promise.race(promises)
    for(let i = 0; i < sequence.length; i++) {
        p = p.then((res)=>{
            promises[res] = loadImg(sequence[i]).then(()=>{
                return res;
            })
            return Promise.race(promises)
        })
    }
}


/**
 * 并发限制 版本2 -> 队列控制
 * @param {Array} urls 请求列表
 * @param {Function} handler 处理函数，返回promise实例
 * @param {Number} limit 并发限制数量
 */
function limitLoad2(urls, handler, limit) {
    const usingTasks = []   // 正在执行的队列
    const tasks = [] //等待执行的队列

    /**
     * 运行任务
     * @param {Object} url 加载地址相关信息 
     */
    const usingRun = (url) => {
        usingTasks.push(url)
        handler(url).then(()=>{
            let index = usingTasks.indexOf(url)
            usingTasks.splice(index, 1)
            if(tasks.length > 0) {
                usingRun(tasks.shift())
            }
        })
    }

    /**
     * 遍历所有任务
     */
    for(let i = 0; i < urls.length; i ++) {
        if(usingTasks.length < limit) {
            usingRun(urls[i])
        }else{
            tasks.push(urls[i])
        }
    }


}




function loadImg(url) {
    return new Promise((resolve)=>{
        console.log(`----> ${url.info} start ----->`)
        setTimeout(()=>{
            // console.log(`<---- ${url.info} end <-----`)
            resolve()
        }, url.time)
    })
}

const urls = [{
    info: "link1",
    time: 1000
},{
    info: "link2",
    time: 2000
},{
    info: "link3",
    time: 3000
},{
    info: "link4",
    time: 500
},{
    info: "link5",
    time: 5000
},{
    info: "link6",
    time: 500
}]


// start: link1 -> link2 -> link3 -> link4 -> link5 -> link6
// end:   link1 -> link4 -> link2 -> link6 -> link3 -> link5

limitLoad2(urls, loadImg, 3)