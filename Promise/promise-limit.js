/**
 * 并发限制
 * @param {Array} urls 请求列表
 * @param {Function} handler 处理函数，返回promise实例
 * @param {Number} limit 并发限制数量
 */
function limitLoad(urls, handler, limit) {
    const sequence = urls.slice()
    const promises = sequence.splice(0, limit).map((url, index)=>{
        return handler(url).then(()=>{
            return index
        })
    })
    let p = Promise.race(promises)
    // 经典链式调用
    for(let i = 0; i < sequence.length; i++) {
        p = p.then((res)=>{
            promises[res] = handler(sequence[i]).then(()=>{
                return i
            })
            return Promise.race(promises)
        })
    }
}



function loadImg(url) {
    return new Promise((resolve)=>{
        console.log(`----> ${url.info} start ----->`)
        setTimeout(()=>{
            console.log(`<---- ${url.info} end <-----`)
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

limitLoad(urls, loadImg, 3)