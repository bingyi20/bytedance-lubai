// 重写属性
// 重写方法

class XhrHook {
    constructor(beforeHooks = {}, afterHooks = {}) {
        this.XHR = window.XMLHttpRequest
        this.beforeHooks = beforeHooks
        this.afterHooks = afterHooks
        this.init()
    }
    init() {
        let _this = this
        window.XMLHttpRequest = function() {
            this._xhr = new _this.XHR()
            for(let key in this._xhr) {
                if(typeof this._xhr[key] === "function") {
                    _this.overwriteMethods(key, this)
                }else{
                    _this.overwriteProperty(key, this)
                }
            }
        }
     }
     /**
      * 重写犯法
      * @param {String} key 方法名
      * @param {Object} proxyXHR 重写对象
      */
     overwriteMethods(key, proxyXHR) {
        let {beforeHooks, afterHooks} = this
        proxyXHR[key] = (...args) => {
            if(beforeHooks[key]) {
                const bool = beforeHooks[key].apply(proxyXHR, args)
                // 如果beforeHooks函数返回false，则进行拦截，不继续执行执行体
                if(bool === false) {
                    return;
                }
            }
            const res = proxyXHR._xhr[key].apply(proxyXHR._xhr, args)
            afterHooks[key] && afterHooks[key].call(proxyXHR, res)
            return res
        }
     }
     /**
      * 重写属性
      * @param {String} key 属性名
      * @param {Object} proxyXHR 重写对象 
      */
     overwriteProperty(key, proxyXHR) {
        Object.defineProperty(proxyXHR, key, this.setProperty(key, proxyXHR))
     }
     /**
      * 重写属性
      * @param {String} key 
      * @param {Object} proxyXHR 
      */
     setProperty(key, proxyXHR) {
        const {beforeHooks, afterHooks} = this;
        const obj = Object.create(null)
        obj.set = function(val) {
            if(!key.startsWith('on')) {
                proxyXHR['_' + key] = val;
                return
            }
            if(beforeHooks[key]) {
                proxyXHR._xhr[key] = (...args) => {
                    beforeHooks[key].apply(proxyXHR, args)
                    val.apply(proxyXHR._xhr, args)
                }
                return
            }
            proxyXHR._xhr[key] = val
        }

        obj.get = function() {
            return proxyXHR['_' + key] || proxyXHR._xhr[key]
        }

        return obj
     }
 }

new XhrHook({
    open: function() {
        console.log("open")
    },
    onload: function() {
        console.log("onload")
    },
    send: function() {
        console.log("send")
    },
    onreadystatechange: function() {
        console.log("onreadystatechange")
    },
    onerror: function() {
        console.log("hook error")
    }
});

var xhr = new XMLHttpRequest()

xhr.open('GET', 'http://127.0.0.1:7001/index', true)

xhr.send();

xhr.onreadystatechange = function(res) {
    document.write(JSON.stringify(res))
}