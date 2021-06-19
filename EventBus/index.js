
class EventEmitter{
    constructor(){
        this.events = {}
    }
    /**
     * 监听事件
     * @param {String} type  事件名
     * @param {Function} callback 回调函数
     */
    on(type, callback) {
        if(!this.events[type]) {
            this.events[type] = []
        }
        this.events[type].push(callback)
        return this
    }

    /**
     * 只执行一次的监听事件
     * @param {String} type  事件名
     * @param {Function} callback 回调函数
     */
    once(type, callback) {
        const one = (...args)=>{
            callback.apply(this, args)
            this.off(type, one)
        }
        this.on(type, one)
        return this
    }
    
    /**
     * 发射事件
     * @param {string} type 
     */
    emit(type, ...args) {
        if(!this.events[type] || this.events[type].length == 0) {
            throw Error(`Error: ${type} event is not registered`)
        }
        this.events[type].map((callback)=>{
            callback.apply(this, args)
        })
        return this
    }

    /**
     * 移除事件监听
     * @param {String} type  事件名
     * @param {Function} callback 回调函数
     */
    off(type, callback) {
        if(!callback || !this.events[type]) {
            this.events[type] = null
        }else {
            this.events[type] = this.events.filter(fn => fn !== callback)
        }
        return this
    }
}







const add = (a, b) => console.log(a + b)
const log = (...args) => console.log(...args)
const event = new EventEmitter()

const testThis = () => {
    console.log(this === event)
}


event.on("test", testThis) 
event.emit("test")