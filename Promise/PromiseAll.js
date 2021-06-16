/**
 * 
 * @param {Array} promises 需要并行执行的promise 
 * @returns 
 */
function PromiseAll(promises) {
    return new Promise((resolve, reject) => {
        if(!Array.isArray(promises)) {
            return reject("传入的参数必须是数组");
        }
        const length = promises.length;
        const res = [];
        let counter = 0;
        for(let i = 0; i < length; i++) {
            Promise.resolve(promises[i]).then((val) => {
                res[i] = val;
                if(++counter === length) {
                    resolve(res);
                }
            }).catch(e => {
                reject(e);
            })
        }
    });
}

function fetchData(val, delay) {
    return new Promise((resolve)=>{
        setTimeout(() => {
            resolve(val)
        }, delay);
    })
}


const p1 = fetchData(1, 100);
const p2 = fetchData(2, 200);
const p3 = fetchData(3, 800);
const p4 = 111;
const p5 = fetchData(4, 2000);

PromiseAll([p1, p2, p3, p4, p5]).then(res => {
    console.log(res);
})