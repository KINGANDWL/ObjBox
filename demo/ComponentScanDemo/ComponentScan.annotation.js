"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentScan = void 0;
const __1 = require("../../");
function ComponentScan(path) {
    let _annotationName = (0, __1.getFunName)(2);
    return function (target) {
        (0, __1.registerClass)(_annotationName, { path: path }, target);
    };
}
exports.ComponentScan = ComponentScan;
Object.defineProperty(ComponentScan, "name", { value: "ComponentScan" });
