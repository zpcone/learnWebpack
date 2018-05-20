## 0. 目标
    安装webpack
    webpack最基本的配置
    打包项目
    
## 1. 安装依赖
    npm install webpack --save-dev
    npm install lodash --save

## 2. src/index.js
    import _ from 'lodash';
    
    function component() {
      var element = document.createElement('div');
      element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    
      return element;
    }
    document.body.appendChild(component());
    
## 3. webpack.config.js
    const path = require('path');
    
    module.exports = {
      entry: './src/index.js',
      output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
      }
    };

## 4. dist/index.html
    <html>
    <head>
      <title>Getting Started</title>
    </head>
    <body>
    <script src="bundle.js"></script>
    </body>
    </html>
    
## 5. 配置npm命令, 并打包
	"build": "webpack --display-modules"
	npm run build