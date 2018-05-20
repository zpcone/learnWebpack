## 0. 目标
    使用source map: 调试
    使用开发工具: 自动编译打包-->live-reload
        1. webpack's Watch Mode  观察模式
        2. webpack-dev-server
        3. webpack-dev-middleware
        
## 1. 下载依赖包
    npm install --save-dev webpack-dev-server  //webpack开发服务器
    npm install --save-dev express webpack-dev-middleware  // express+开发中间件
## 2. src/print.js
    export default function printMe() {
      cosnole.log('I get called from print.js!'); // 有问题的代码
      // console.log('I get called from print.js!')
    }
    
## 3. src/index.js
    import _ from 'lodash';
    import printMe from './print.js';
    
    function component() {
      var element = document.createElement('div');
      var btn = document.createElement('button');
    
      element.innerHTML = _.join(['Hello555', 'webpack'], ' ');
    
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
      // 启用source-map, 运行错误可以看出哪个文件的哪一行出错
      // 一般只在开发模式下启用, 在生产(build)模式下不启用
      devtool: 'inline-source-map',
      //告知 webpack-dev-server，在 localhost:8080 下建立服务，
      // 将 dist 目录下的文件，作为可访问文件
      devServer: {
        contentBase: './dist',
        port: 8888,  // 默认8080
      },
      plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
          title: 'dev'
        })
      ],
      output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
      }
    };

## 5. server.js
    const express = require('express');
    const webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    
    const app = express();
    const config = require('./webpack.config.js');
    const compiler = webpack(config);
    
    // Tell express to use the webpack-dev-middleware and use the webpack.config.js
    // configuration file as a base.
    app.use(webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath
    }));
    
    // Serve the files on port 3000.
    app.listen(3000, function () {
      console.log('Example app listening on port 3000!\n');
    });   
## 6. package.json
    "scripts": {
      "build": "webpack --display-modules",
      "watch": "webpack --watch",
      "start": "webpack-dev-server --open",
      "server": "node server.js"
    }
    
## 7. 测试运行
    npm run watch
    npm start
    npm run server
    修改print.js, 自动live reload(重新编译打包刷新界面)
    点击按钮, 控制强报错