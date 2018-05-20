## 1. 下载依赖包
    npm install --save-dev clean-webpack-plugin  //清理文件/夹的插件
    npm install --save-dev html-webpack-plugin   //自动生成html的插件

## 2. src/print.js
    export default function printMe() {
      console.log('I get called from print.js!');
    }
    
## 3. src/index.js
    import _ from 'lodash';
    import printMe from './print.js';
    
    function component() {
      var element = document.createElement('div');
      var btn = document.createElement('button');
    
      element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    
      btn.innerHTML = 'Click me and check the console!';
      btn.onclick = printMe;
    
      element.appendChild(btn);
    
      return element;
    }
    
    document.body.appendChild(component());

## 4. webpack.config.js
    const path = require('path');
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const CleanWebpackPlugin = require('clean-webpack-plugin');
    
    module.exports = {
      entry: {
        app: './src/index.js',
        print: './src/print.js'
      },
      plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
          title: 'Output Management'
        })
      ],
      output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
      }
    };
    
## 5. 配置npm命令, 并打包
	"build": "webpack --display-modules"
	npm run build
	    dist目录下原有的所有资源被清除
	    生成2个打包文件
	    自动生成的html文件中自动引入的2个js
	