"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentScanApplicationHandler = void 0;
const __1 = require("../../");
const ComponentScan_annotation_1 = require("./ComponentScan.annotation");
let ComponentScanApplicationHandler = class ComponentScanApplicationHandler {
    start(objBox) {
        let sTemplates = objBox.getAllComponentTemplate();
        for (let sTemplate of sTemplates) {
            let a = sTemplate.newInstance.prototype._annotations_.clazz.getAnnotation(ComponentScan_annotation_1.ComponentScan.name);
            if (a != null) {
                objBox.registerFromFiles([new __1.ScanDir(a.annotationArgs.path)]);
            }
        }
    }
};
ComponentScanApplicationHandler = __decorate([
    (0, __1.ApplicationHandler)()
], ComponentScanApplicationHandler);
exports.ComponentScanApplicationHandler = ComponentScanApplicationHandler;
