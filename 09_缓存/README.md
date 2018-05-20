## 0. 目标
    利用和防止浏览器缓存
        利用缓存: 相同内容的打包文件, 文件名不变
        防止缓存: 不同内容的打包文件, 文件名必须变化
    使用hash组成文件名
    使用CommonsChunkPlugin分离第三方包
    使用CommonsChunkPlugin分离webpack的模板代码
    使用HashedModuleIdsPlugin使用hash指定module的id
        
## 1. 说明
    浏览器端访问项目后会缓存(根据文件名)所有相关的静态资源(js/css/img等)
        从服务器获取的静态资源, 会缓存到浏览器端
        如果请求的是同名的静态资源, 不会向服务器发请求
    更新项目代码后重新打包运行:
        修改代码-->重新打包-->文件名不变 ===>浏览器会使用缓存-->没有最新的效果(测试有误)
                                       --->解决: 打包生成不同的文件名
        代码不变-->重新打包-->文件名变了 ===>浏览器重新请求(没有必要, 需要优化)
                                       --->解决: 打包生成相同的文件名
## 2. src/math.js
    export function square(x) {
      return x * x;
    }
    export function cube(x) {
      return x * x * x;
    }
    
## 3. src/another-module.js 
    import _ from 'lodash';
    
    console.log(
      _.join(['Another', 'module', 'loaded!'], ' ')
    );
## 3. src/index.js
    import _ from 'lodash';
    import module from './another-module'
    
    function component() {
      var element = document.createElement('div');
    
      element.innerHTML = _.join(['Hello', 'webpack222'], ' ');
    
      element.onclick = function () {
        import('./math').then(math => {
          alert(math.square(2))
        } )
      }
    
      return element;
    }
    
    document.body.appendChild(component());

## 3. webpack.config.js
    const path = require('path');
    const HTMLWebpackPlugin = require('html-webpack-plugin');
    const webpack = require('webpack');
    
    module.exports = {
      entry: {
        index: './src/index.js',
        vendor: ['lodash']
      },
      plugins: [
        new HTMLWebpackPlugin({
          title: 'Caching'
        }),
        new webpack.HashedModuleIdsPlugin(), //使用hash作为module的id
        new webpack.optimize.CommonsChunkPlugin({ //提取第三方模块包
          name: 'vendor'
        }),
        new webpack.optimize.CommonsChunkPlugin({ //提取webpack的模板代码
          name: 'manifest', 
        })
      ],
      output: {
        filename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, 'dist')
      }
    };

## 4. 打包测试
    不使用print.js, webpack打包
    使用print.js, webpack打包
    比较前后的打包文件, 看文件名是否变化