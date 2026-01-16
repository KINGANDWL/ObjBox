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
// 构造器注入测试
let ClassC = class ClassC {
    constructor() {
        this.value = "ClassC";
    }
};
ClassC = __decorate([
    (0, __1.Component)("ClassC")
], ClassC);
let ClassBNeedClassC = class ClassBNeedClassC {
    constructor(classC) {
        this.value = "ClassB";
        this.c = null;
        console.log("yes get classC", classC);
        this.c = classC;
    }
    getC() {
        return this.c;
    }
};
ClassBNeedClassC = __decorate([
    (0, __1.ComponentInject)([{ name: "ClassC" }]),
    (0, __1.Component)("ClassBNeedClassC")
], ClassBNeedClassC);
let ClassANeedClassB = class ClassANeedClassB {
    constructor(classB) {
        this.b = null;
        console.log("yes get classB", classB);
        this.b = classB;
    }
    getB() {
        return this.b;
    }
};
ClassANeedClassB = __decorate([
    (0, __1.ComponentInject)([{ name: "ClassBNeedClassC" }]),
    (0, __1.Component)("ClassANeedClassB")
], ClassANeedClassB);
function main() {
    // 配置容器日志（非必要）
    let loggerConfig = {
        level: Level_1.Level.ALL,
        timeFormate: `${libs_1.TimeFlag.Year}-${libs_1.TimeFlag.Month}-${libs_1.TimeFlag.Day} ${libs_1.TimeFlag.Hour}:${libs_1.TimeFlag.Minute}:${libs_1.TimeFlag.Second}`
    };
    let ob = __1.ObjBoxHelper.newObjBox(loggerConfig);
    ob.registerFromClass(ClassC);
    ob.registerFromClass(ClassBNeedClassC);
    ob.registerFromClass(ClassANeedClassB);
    // 启动装载
    ob.load();
    //启动容器应用
    ob.run();
    let A = ob.getComponent(ClassANeedClassB.name);
    console.log(A);
    console.log(A.getB());
    console.log(A.getB().getC());
}
main();
