webpackJsonp([1],[
/* 0 */,
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);


function component() {
  var element = document.createElement('div');

  element.innerHTML = __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.join(['Hello', 'webpack222'], ' ');
/*
  // 在初始化代码中异步加载
  import('./math').then(math => {
    alert(math.square(2))
  } )
  */
  // 在事件回调函数中异步加载
  element.onclick = function () {
    __webpack_require__.e/* import() */(0).then(__webpack_require__.bind(null, 5)).then(math => {
      alert(math.square(2))
    } )
  }

  return element;
}

document.body.appendChild(component());

/***/ })
],[1]);