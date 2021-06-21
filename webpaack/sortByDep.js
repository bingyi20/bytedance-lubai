let modules = [
    { name: 'a', requires: ['b', 'c'] },
    { name: 'b', requires: ['c'] },
    { name: 'c', requires: [] },
    ]

    /**
     * 我的答案 O(nlgn) 复杂度
     * @param {array} modules 依赖数组
     */
    function sortByDep(modules) {
        modules.sort((x,y) => {
            if(x.requires.indexOf(y) > -1) {
                return 1;
            }else{
                return -1;
            }
        })
    }

    /**
     * younger大佬的答案 O(n^3) 复杂度
     * 存在循环引用的问题 a -> b    b -> a 就会导致死循环
     */
     let output = []
     let registeredModules = []
     function sortByDep1(modules) { 
         for (let i = 0; i < modules.length; i++) {     // O(n)
             if (modules[i].requires.every(req => registeredModules.indexOf(req) > -1)) { // O(n)
                let item = modules.splice(i, 1)[0]
                registeredModules.push(item.name)
                output.push(item)
                sortByDep1(modules)
             }
         }
         return output
     }


    console.log(JSON.stringify(sortByDep1(modules)))

    // console.log(JSON.stringify(modules))

    // output
    // [
    //     { name: 'c', requires: [] }, // first, no dependencies, and required by both the others
    //     { name: 'b', requires: ['c'] }, // second, because it needs `c` first
    //     { name: 'a', requires: ['b', 'c'] }, // last, because requires both the others
    // ]