"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
//main.ts
const __1 = require("../../");
const libs_1 = require("../..//libs");
const Level_1 = require("../../libs/logger/Level");
let ClassA = class ClassA {
    makeObj1(c) {
        return { name: "obj1", c: c };
    }
};
__decorate([
    (0, __1.BeanInject)([{ name: "ClassC" }]),
    (0, __1.Bean)("Obj1")
], ClassA.prototype, "makeObj1", null);
ClassA = __decorate([
    (0, __1.BeanComponent)("MakeA")
], ClassA);
let ClassB = class ClassB {
    makeObj2(Obj1) {
        return { name: "obj2", obj1: Obj1 };
    }
};
__decorate([
    (0, __1.Bean)("Obj2"),
    (0, __1.BeanInject)([{ name: "Obj1" }])
], ClassB.prototype, "makeObj2", null);
ClassB = __decorate([
    (0, __1.BeanComponent)("MakeB")
], ClassB);
let ClassC = class ClassC {
};
__decorate([
    (0, __1.AutowireProperty)("Obj2")
], ClassC.prototype, "obj2", void 0);
ClassC = __decorate([
    (0, __1.Component)("ClassC")
], ClassC);
function main() {
    // 配置容器日志（非必要）
    let loggerConfig = {
        level: Level_1.Level.ALL,
        timeFormate: `${libs_1.TimeFlag.Year}-${libs_1.TimeFlag.Month}-${libs_1.TimeFlag.Day} ${libs_1.TimeFlag.Hour}:${libs_1.TimeFlag.Minute}:${libs_1.TimeFlag.Second}`
    };
    let ob = __1.ObjBoxHelper.newObjBox(loggerConfig);
    ob.registerFromClass(ClassA);
    ob.registerFromClass(ClassB);
    ob.registerFromClass(ClassC);
    // 启动装载
    ob.load();
    //启动容器应用
    ob.run();
    console.log(ob.getComponent("ClassC"));
}
main();
