const fs = require('fs')
const path = require('path')
const babylon = require('babylon')
const traverse = require('babel-traverse').default;
const babel = require('babel-core')

let ID = 0;
const entry = "./source/index.js"

/**
 * 解析文件，解析文件的依赖关系，翻译代码等信息
 * @param {string} filename 文件名
 * @returns 
 */
function createAsset(filename) {
    const content = fs.readFileSync(filename, "utf-8")
    const ast = babylon.parse(content, {sourceType: 'module'})
    const dependencies = []
    traverse(ast, {
        ImportDeclaration: ({node}) => {
            dependencies.push(node.source.value)
        }
    })
    const { code } = babel.transformFromAst(ast, null, {
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

/**
 * 生成依赖关系图
 * @param {string} entry 入口文件
 * @returns 
 */
function createGraph(entry) {
    const mainAsset = createAsset(entry)
    const allAsset = [mainAsset]
    for(let asset of allAsset) {
        asset.mapping = {}
        const {mapping, dependencies} = asset
        const absoluteDir = path.dirname(entry)
        dependencies.forEach(relativeFilename => {
            const absolutePath = path.join(absoluteDir, relativeFilename)   // 获取依赖文件的绝对路径
            const subAsset = createAsset(absolutePath)
            mapping[relativeFilename] = subAsset.id
            allAsset.push(subAsset)
        })
    }
    return allAsset
}


/**
 * 根据依赖关系图生成最后的bundle代码
 * @param {array} graph 依赖关系图 
 */
function bundle(graph) {
    let modules = "";

    graph.map(module => {
        modules += `
        ${module.id}: [
            function(module, exports, require){
                ${module.code}
            }, 
            ${JSON.stringify(module.mapping)}
        ], 
        `
    })

    // module module.export require

    const result = `
        (function(modules){

            function require(id) {
                const [code, mapping] = modules[id]
                function localRequire(filename) {
                    return require(mapping[filename])
                }
                let module = {exports: {}}
                code(module, module.exports, localRequire)
                return module.exports
            }

            require(0)
        })({${modules}})
    `;

    return result;
}


const graph = createGraph(entry)
console.log(bundle(graph))