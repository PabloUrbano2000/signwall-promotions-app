/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/preview.js":
/*!***************************!*\
  !*** ./src/js/preview.js ***!
  \***************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function () {\r\n    const inputFile = document.getElementById(\"archivo\") || null;\r\n    const containerPreview = document.getElementById(\"container-img-preview\");\r\n\r\n    if (containerPreview) {\r\n        containerPreview.addEventListener(\"click\", (ev) => {\r\n            inputFile.click();\r\n        });\r\n    }\r\n\r\n    if (inputFile) {\r\n        inputFile.addEventListener(\"change\", (ev) => {\r\n            let files = ev.target.files;\r\n            const containerPreview = document.getElementById(\r\n                \"container-img-preview\"\r\n            );\r\n            if (containerPreview) {\r\n                if (files && files.length) {\r\n                    let imageCodified = URL.createObjectURL(files[0]);\r\n                    let image = `<div class=\"w-auto mx-auto rounded\" style=\"border: 2px gray dotted;\">\r\n                    <img class=\"p-2 w-auto flex mx-auto rounded\" src=\"${imageCodified}\" alt=\"preview\">\r\n                    </div>`;\r\n                    containerPreview.innerHTML = image;\r\n                } else {\r\n                    containerPreview.innerHTML = `<div class=\"w-auto mx-auto rounded\" style=\"border: 2px gray dotted;\">\r\n                    <p class=\"text-gray-300 bg-white mx-auto text-center w-auto\" style=\"padding: 70px;\">Selecciona una imagen</p>\r\n                    </div>`;\r\n                }\r\n            }\r\n        });\r\n    }\r\n})();\r\n\n\n//# sourceURL=webpack://signwall-promotions-app/./src/js/preview.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/preview.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;