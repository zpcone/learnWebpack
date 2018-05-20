## 0. 目标
    加载不同类型的资源: css/图片/xml
    
## 1. 下载相关依赖包
    npm install --save-dev css-loader style-loader  #加载css文件
    npm install --save-dev file-loader  #加载图片文件
    npm install --save-dev xml-loader  #加载xml文件

## 3. src/icon.png
![](https://i.imgur.com/WMnEDZ5.png)

## 4. src/style.css
    .hello {
      color: red;
      background: url('./icon.png');
    }

## 5. src/data.xml
	<?xml version="1.0" encoding="UTF-8"?>
	<note>
	  <to>Mary</to>
	  <from>John</from>
	  <heading>Reminder</heading>
	  <body>Call Cindy on Tuesday</body>
	</note>

## 6. src/index.js
	import _ from 'lodash';
    import './style.css';
    import Icon from './icon.png';
    import Data from './data.xml';
    
    function component() {
      var element = document.createElement('div');
    
      // Lodash，现在由此脚本导入
      element.innerHTML = _.join(['Hello', 'webpack'], ' ');
      element.classList.add('hello');
    
      // 将图像添加到我们现有的 div。
      var myIcon = new Image();
      myIcon.src = Icon;
    
      element.appendChild(myIcon);
    
      console.log(Data);
    
      return element;
    }
    
    document.body.appendChild(component());

## 7. webpack.config.js
	const path = require('path');
    
    module.exports = {
      entry: './src/index.js',
      output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
      },
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              'style-loader', // 将js中的css动态插入到DOM中
              'css-loader' // 将css加载到打包的js中
            ]
          },
          {
            test: /\.(png|svg|jpg|gif)$/,
            use: ['file-loader']
          },
          {
            test: /\.xml$/,
            use: ['xml-loader']
          }
        ]
      }
    };

## 8. 配置npm命令, 并打包
	"build": "webpack --display-modules"
	npm run build
