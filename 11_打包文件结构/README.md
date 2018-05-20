## 0. 目标
    通过分析打包文件结构, 加深对webpack打包的理解

## 1. 编码
    // src/a.js
    export default {
      name: 'a'
    }
    
    // src/b.js
    export default {
      name: 'b'
    }
    
    // src/c.js
    import b from './b'
    console.log(`b: ${b.name}`)
    export let c1 = {
      name: 'c1'
    }
    export let c2 = {
      name: 'c2'
    }
    export let c3 = {
      name: 'c3'
    }
    
    // src/index.js
    import a from './a'
    import {c1, c2} from './c'
    
    console.log(`a: ${a.name}`)
    console.log(`c1: ${c1.name}; c2: ${c2.name}`)
    
## 2. 配置(webpack.config.js)
    const path = require('path');
    
    module.exports = {
      entry: './src/index.js',
      output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
      }
    };
## 3. 打包
    webpack
    打包输出信息:
      Hash: ee6ea5304e30ccc82d7c     //根据内容生成的标识名
      Version: webpack 3.6.0         // 当前webpack的版本
      Time: 74ms                     // 编译打包消耗时间
          Asset     Size  Chunks             Chunk Names
      bundle.js  3.94 kB       0  [emitted]  main
         [0] ./src/index.js 125 bytes {0} [built]
         [1] ./src/a.js 32 bytes {0} [built]
         [2] ./src/c.js 156 bytes {0} [built]
         [3] ./src/b.js 32 bytes {0} [built]
    

## 4. bundle文件分析
### 1). 文件整体结构
    (function(modules) {
        // modules中的所有模块进行整合执行
    })([
    /* 0 */
        (function(module, __webpack_exports__, __webpack_require__) { //包含index.js代码}),
    /* 1 */
        (function(module, __webpack_exports__, __webpack_require__) { //包含a.js代码 }),
    /* 2 */
        (function(module, __webpack_exports__, __webpack_require__) { //包含c.js代码 }),
    /* 3 */
        (function(module, __webpack_exports__, __webpack_require__) { //包含b.js代码 })
     ]);
    
    说明: 
        整体是一个IIFE: 将一个包含所有webpack模块的数组作为参数传入, 并在函数体中对所有模块进行整合处理
        每个webpack模块都是一个包含了特定模块代码的函数
        
### 2). 立即执行函数的整体流程
    第一部分: 定义一个对象 installModlues 来保存 Webpack 已注册的模块。
    第二部分: 定义一个函数 __webpack_require__ 来实现的模块的加载(相当于import或require())
    第三部分: 在 __webpack_require__ 这个函数对象上绑定一些属性。
    第四部分: 调用__webpack_require__函数，开始加载模块。   

### 3). __webpack_require__函数流程
    第1部分: 判断 installModules 中是否已经注册过这个模块（installModules 的属性 moduleId 是否存在），
            如果注册过，直接返回已注册模块的 exports 属性（模块的输出）。
    
    第2部分: 如果没有注册过，则定义一个对象module，并将其注册到 installModules （绑定到 installModules 的属性 moduleId 中），
            这个对象包含以下三个属性：
                i： 模块 ID moduleID （ id 的简写）
                l： 模块是否已注册（初始化为 false，loaded的简写）
                exprots： 模块的输出（初始化为空）
    第3部分: 执行 modlues 中 moduleId 对应的模块立即执行函数，传入三个参数：
                刚才定义的对象 module
                对象的 module.exports 属性（传入的时候为空）
                __webpack_require__ 函数本身（方便在模块中调用其他模块）
            执行完立即执行函数后，除了将模块本身的逻辑执行完，也会将模块的输出绑定到 module.exports 中
    第4部分: 将 module.l 设为 true 表示已加载
    第5部分: 最后输出 module.exports 属性
    
### 4). __webpack_require__函数的绑定的属性和方法
    m: modules ，数组，所有的模块，即前文提到的 modules 参数
    c: cache ，对象，所有已安装的模块
    d: define ，函数，如果输出没有保存到模块的 exports 中，则使用 Object.defineProperty 将模块的输出保存到已安装模块的 export 属性中，会在模块中替换掉 export 语句。该函数包含三个参数：
    exports: 模块的 exports 属性
    name: 模块输出的代号（名字），默认为 a ，从 abcd往下排列
    getter: 函数，返回模块的输出内容
    n: 针对 non-harmony 模块的输出定义函数做一些兼容（这里我也不太理解）
    o: Object.prototype.hasOwnProperty 的 polyfill， 在 __webpack_require__.d中的判断是否这个输出是否已绑定到这个模块中用到
    p: 实际上就是配置文件中的 output.publicPath
### 5). webpack模块函数
	1. 以c.js对应的webpack模块函数为例说明
	    /* 2 */
		(function(module, __webpack_exports__, __webpack_require__) {
		
		    "use strict";
		    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return c1; });
		    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return c2; });
		    /* unused harmony export c3 */
		    /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__b__ = __webpack_require__(3);
		
		    console.log(`b: ${__WEBPACK_IMPORTED_MODULE_0__b__["a" /* default */].name}`)
		    let c1 = {
		      name: 'c1'
		    }
		    let c2 = {
		      name: 'c2'
		    }
		    let c3 = {
		      name: 'c3'
		    }
		
		})
	2. 执行分析
	  此函数是在主函数中通过__webpack_require__(0)执行来递归加载所有相关webpack模块函数执行的
	  import 替换为 __webpack_require__ 就可以导入模块
	  export 导出，则是调用 __webpack_require__.d 方法（ d 为 define 的简写），将输出的变量或方法绑定到模块中
	  每个模块都有id, 默认是在数组中的下标