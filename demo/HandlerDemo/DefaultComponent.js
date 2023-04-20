"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentScanTest = exports.R2 = exports.R1 = exports.Main = exports.MyBeanComponent = exports.B = exports.A = void 0;
const __1 = require("../..");
const ComponentScan_annotation_1 = require("../ComponentScanDemo/ComponentScan.annotation");
// @Component()
// export class DefaultComponent implements TemplateHandler{
//     created(){
//         console.log("DefaultComponent-created")
//     };
//     completed(){
//         console.log("DefaultComponent-completed")
//     };
//     ready(){
//         console.log("DefaultComponent-ready")
//     };
// }
let A = class A {
};
A = __decorate([
    (0, __1.Component)("A")
], A);
exports.A = A;
let B = class B {
};
B = __decorate([
    (0, __1.Component)()
], B);
exports.B = B;
let MyBeanComponent = class MyBeanComponent {
    createC() {
        return {
            msg: "this is C"
        };
    }
};
__decorate([
    (0, __1.Bean)("C", __1.ComponentCreatedType.Singleton)
], MyBeanComponent.prototype, "createC", null);
MyBeanComponent = __decorate([
    (0, __1.BeanComponent)()
], MyBeanComponent);
exports.MyBeanComponent = MyBeanComponent;
let Main = class Main {
    setB(b) {
        this.b = b;
    }
    ready() {
        // console.log(this.a,this.b,this.c)
    }
};
__decorate([
    (0, __1.AutowireProperty)("A")
], Main.prototype, "a", void 0);
__decorate([
    (0, __1.AutowireMethod)("B")
], Main.prototype, "setB", null);
__decorate([
    (0, __1.AutowireProperty)("C")
], Main.prototype, "c", void 0);
Main = __decorate([
    (0, __1.Component)()
], Main);
exports.Main = Main;
let R1 = class R1 {
};
__decorate([
    (0, __1.AutowireProperty)("R2", false)
], R1.prototype, "r2", void 0);
R1 = __decorate([
    (0, __1.Component)()
], R1);
exports.R1 = R1;
let R2 = class R2 {
};
__decorate([
    (0, __1.AutowireProperty)("R1")
], R2.prototype, "r1", void 0);
R2 = __decorate([
    (0, __1.Component)("R2")
], R2);
exports.R2 = R2;
//从外部扫描
let ComponentScanTest = class ComponentScanTest {
    ready() {
        console.log(this.wow);
    }
};
__decorate([
    (0, __1.AutowireProperty)("Wow")
], ComponentScanTest.prototype, "wow", void 0);
ComponentScanTest = __decorate([
    (0, ComponentScan_annotation_1.ComponentScan)(__dirname + "/../extra"),
    (0, __1.Component)()
], ComponentScanTest);
exports.ComponentScanTest = ComponentScanTest;
