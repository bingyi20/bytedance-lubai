
class Scheduler {
    constructor() {
        this.max = 2;   // 并发限制数量
        this.usingTasks = [];    // 正在运行的任务
        this.tasks = []; // 等待运行的任务
    }
    /**
     * 添加运行任务
     * @param {Function} promiseCreator 
     * @returns 
     */
    add(promiseCreator) {
        return new Promise((resolve) => {
            promiseCreator.resolve = resolve
            if(this.usingTasks.length < this.max) {
                this.usingRun(promiseCreator)
            }else{
                this.tasks.push(promiseCreator)
            }
        })
    }
    /**
     * 运行任务
     * @param {Function} promiseCreator 
     */
    usingRun(promiseCreator) {
        this.usingTasks.push(promiseCreator)
        promiseCreator().then(()=>{
            promiseCreator.resolve()
            this.usingRemove(promiseCreator)
            if(this.tasks.length > 0) {
                this.usingRun(this.tasks.shift())
            }
        })
    }
    /**
     * 移除运行完成的任务
     * @param {Funstion} promiseCreator 
     */
    usingRemove(promiseCreator) {
        let index = this.usingTasks.findIndex(promiseCreator)
        this.usingTasks.splice(index, 1)
    }
}


const timeout = (time) => new Promise(resolve => {
    setTimeout(resolve, time);
})

const scheduler = new Scheduler()

const addTask = (time, order) => {
    scheduler.add(()=>timeout(time)).then(()=>console.log(order))

}

addTask(1000, '1')
addTask(500, '2')
addTask(300, '3')
addTask(400, '4')

// 2, 3, 1, 4