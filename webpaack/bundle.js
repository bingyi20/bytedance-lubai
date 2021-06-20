
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
        })({
        0: [
            function(module, exports, require){
                "use strict";

var _message = require("./message.js");

console.log(_message.message);
            }, 
            {"./message.js":1}
        ], 
        
        1: [
            function(module, exports, require){
                "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.message = undefined;

var _name = require("./name.js");

var _name2 = _interopRequireDefault(_name);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log("\u6211\u83B7\u53D6\u5230\u4E86name\u4E3A: " + _name2.default);
var message = exports.message = _name2.default + " is a boy";
            }, 
            {"./name.js":2}
        ], 
        
        2: [
            function(module, exports, require){
                "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "yibangyu";
            }, 
            {}
        ], 
        })
    
