const testData = {
    a: 111,
    v: 'cccc',
    2222: false,
    xxx: "asd",
    as: this,
    arr: [1,2,"34"]
}
// 32

const ECMA_SIZES = {
    STRING: 2,
    BOOLEAN: 4,
    NUMBER: 8
}

const seen = new WeakSet()

function sizeofObject(object) {
    if(object === null) {
        return 0
    }
    const keys = Object.keys(object)
    let index = keys.length;
    let bytes = 0
    while(index--) {
        let key = keys[index]
        if(typeof object[key] == "object" && object[key] !== null) {
            if(seen.has(object[key])) {
                continue
            }
            seen.add(object[key])
        }
        bytes += caculator(key)
        bytes += caculator(object[key])
    }
    return bytes
}

function caculator(object) {
    const objectType = typeof object

    switch(objectType) {
        case 'string':
            return object.length * ECMA_SIZES.STRING
        case 'boolean':
            return ECMA_SIZES.BOOLEAN
        case 'number':
            return ECMA_SIZES.NUMBER
        case 'object': {
            if(Array.isArray(object)) {
                return object.map(caculator).reduce((acc, cur)=>acc + cur, 0)
            }else{
                return sizeofObject(object)
            }
        }   
        default:
            return 0
    }
}

console.log(caculator(testData))