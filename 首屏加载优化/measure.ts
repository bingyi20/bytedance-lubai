
/**
 * 计算函数执行时间
 * @param target 
 * @param name 
 * @param descriptor 
 * @returns 
 */
function meature(target, name, descriptor) {
    const fn = descriptor.value;
    descriptor.value = async function(...args) {
        console.time(name);
        const ret = await fn.apply(this, args);
        console.timeEnd(name);
        return ret;
    }
    return descriptor;
}



class Load{
    @meature
    static async getData() {
        console.log("Hello world");
    }
}

Load.getData();