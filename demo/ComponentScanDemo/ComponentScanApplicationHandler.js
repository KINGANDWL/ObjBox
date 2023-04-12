"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentScanApplicationHandler = void 0;
const __1 = require("../../");
const ComponentScan_annotation_1 = require("./ComponentScan.annotation");
let ComponentScanApplicationHandler = class ComponentScanApplicationHandler {
    start(objBox) {
        return __awaiter(this, void 0, void 0, function* () {
            let sTemplates = objBox.getAllComponentTemplate();
            for (let sTemplate of sTemplates) {
                let a = sTemplate.newInstance.prototype._annotations_.clazz.getAnnotation(ComponentScan_annotation_1.ComponentScan.name);
                if (a != null) {
                    yield objBox.registerFromFiles([new __1.ScanDir(a.annotationArgs.path)]);
                }
            }
        });
    }
};
ComponentScanApplicationHandler = __decorate([
    (0, __1.ApplicationHandler)()
], ComponentScanApplicationHandler);
exports.ComponentScanApplicationHandler = ComponentScanApplicationHandler;
