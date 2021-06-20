# webpack 

## 1. webpack中的Module是指什么？



## 2. webpack中chunck和bundle有什么区别？



## 3. Plugin 和 Loader 分别是做什么的？ 怎么工作的？

1. Loader


2. plugin


3. Compiler


4. Compiation



## 4. 简单描述一下webpack的打包过程？
    1. 初始化参数：从配置文件和Shell语句中读取与合并参数，得出最终的参数；
    2. 开始编译：用上一步得到的参数初始化Compiler对象，加载所有配置的插件，开始编译；
    3. 确定入口：根据配置中的entry找出所有的入口文件；
    4. 编译模块：从入口文件出发，调用所有的配置的Loader对模块进行编译，再找出该模块依赖的模块的模块，再递归本步骤直到所有的入口依赖的都经过了本步骤的处理；
    5. 完成模块编译：经过第4步使用Loader翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系；
    6. 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个module的chunk，再把每个chunk转换成一个单独的文件加入到输出列表;
    7. 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统;
以上过程中，Webpack会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用Webbpack提供的API改变Webpack的运行结果。


## 5. 手写一个自己的webpack打包工具
本质上，webpack是一个现代JavaScript应用程序的静态模块打包器(module bundle)。
当webpack处理应用程序时，它会递归地构建一个依赖关系图，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个bundle。

1. 找到一个入口文件
2. 找到这个入口文件，提取它的依赖
3. 解析入口文件依赖的依赖，递归的去创建一个文件间的依赖关系图，用以描述文件间的依赖关系
4. 根据依赖关系，将所有文件打包成一个文件bundle


1. 读取入口文件，获取文件内容
```js
    function createAsset(entry) {
        const content = fs.readFileSync(entry, "utf-8")
        return content
    }
```

2. 使用babylon获取文件依赖语法树
```js
function createAsset(entry) {
    const content = fs.readFileSync(entry, "utf-8")
    const ast = babylon.parse(content, {sourceType: 'module'})
    return ast
}
```

3. 使用babel-traverse解析ast，获取依赖数据。
```js
    function createAsset(entry) {
        const content = fs.readFileSync(entry, "utf-8")
        const ast = babylon.parse(content, {sourceType: 'module'})
        const dependencies = []
        traverse(ast, {
            ImportDeclaration: ({node}) => {
                dependencies.push(node.source.value)
                console.log(node)
            }
        })
        return dependencies
    }
```

4. 优化createAsset给该模块添加上唯一的自增id,使其能够文件
```js
    function createAsset(entry) {
    const content = fs.readFileSync(entry, "utf-8")
    const ast = babylon.parse(content, {sourceType: 'module'})
    const dependencies = []
    traverse(ast, {
        ImportDeclaration: ({node}) => {
            dependencies.push(node.source.value)
        }
    })
    let id = ID++;
    let filename = entry
    return {
        id,
        filename,
        dependencies
    }
}
```

5. 创建createGraph函数，在其中调用createAsset生成依赖关系图
```js
    function createGraph(entry) {
        const mainAsset = createAsset(entry)
        return mainAsset
    }
```

6. 解析入口文件依赖文件的绝对路径，并调用createAsset方法为依赖生成依赖
```js
    function createGraph(entry) {
        const mainAsset = createAsset(entry)
        const allAsset = [mainAsset]
        for(let asset of allAsset) {
            const {dependencies} = asset
            const absoluteDir = path.dirname(entry)
            dependencies.forEach(filename => {
                const absolutePath = path.join(absoluteDir, filename)   // 获取依赖文件的绝对路径
                const subAsset = createAsset(absolutePath)
            })
        }
        return allAsset
    }
```

7. 为每个module数据增加mapping,用于记录relativeFilename -> moduleId 的映射关系，便于后续根据依赖文件名进行依赖对象的查找
```js
    function createGraph(entry) {
        const mainAsset = createAsset(entry)
        const allAsset = [mainAsset]
        for(let asset of allAsset) {
            asset.mapping = {}    // 添加依赖文件名 -> id 的映射关系
            const {mapping, dependencies} = asset
            const absoluteDir = path.dirname(entry)
            dependencies.forEach(relativeFilename => {
                const absolutePath = path.join(absoluteDir, relativeFilename)   // 获取依赖文件的绝对路径
                const subAsset = createAsset(absolutePath)
                mapping.relativeFilename = subAsset.id  // 这里映射上了
                allAsset.push(subAsset)
            })
        }
        return allAsset
    }
```

8. 添加一行代码，将子依赖的数据追加到allAsset队列末尾，遍历所有文件，生成依赖关系图
```js
function createGraph(entry) {
    const mainAsset = createAsset(entry)
    const allAsset = [mainAsset]
    for(let asset of allAsset) {
        const {dependencies} = asset
        const absoluteDir = path.dirname(entry)
        dependencies.forEach(filename => {
            const absolutePath = path.join(absoluteDir, filename)   // 获取依赖文件的绝对路径
            const subAsset = createAsset(absolutePath)
            allAsset.push(subAsset) // 增加了这行代码
        })
    }
    return allAsset
}
```

9. 添加bundle函数，该函数基于8生成的依赖关系图生成最后的依赖关系

module module.export require

```
function bundle(graph) {
    let modules = "";

    const result = ``;

    return result;
}
```

10. 为依赖图的每个module增加babel-core处理过的code
```js
function createAsset(filename) {
    const content = fs.readFileSync(filename, "utf-8")
    const ast = babylon.parse(content, {sourceType: 'module'})
    const dependencies = []
    traverse(ast, {
        ImportDeclaration: ({node}) => {
            dependencies.push(node.source.value)
        }
    })
    // 使用babel-core生成es5代码
    const code = babel.transformFromAst(ast, null, {
        presets: ['env']
    })
    let id = ID++;
    return {
        id,
        filename,
        code,
        dependencies
    }
}
```

11. 将graph解析成id -> [code, mapping] 的字符结构
```js
function bundle(graph) {
    let modules = "";

    graph.map(module => {
        modules += `
        ${module.id}: ['${module.code}', ${JSON.stringify(module.mapping)}], 
        `
    })

    const result = `
        (function(){

        })({${modules}})
    `;

    return result;
}
```

12. 重写require函数，根据我们传入的modules自如注入对应代码