"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
//main.ts
const __1 = require("../../");
const libs_1 = require("../..//libs");
const __2 = require("../../");
const Level_1 = require("../../libs/logger/Level");
/**
 * 默认方法注解模板
 * @param yourArg1
 * @param yourArg2
 */
function Log() {
    //获取当前函数名称，等效于let _annotationName = "Log"
    let _annotationName = (0, __2.getFunName)(2);
    //@ts-ignore
    return function (target, key, descriptor) {
        (0, __2.registerMethod)(_annotationName, {}, target, key, descriptor);
    };
}
exports.Log = Log;
let LogHandler = class LogHandler {
    beforeCreated(objbox, template, component) {
        let methodAnnos = __1.ObjBoxHelper.getMethodsAnnotationFromComponent(Log.name, component);
        for (let methodAnno of methodAnnos) {
            __1.ObjBoxHelper.insertFunctionBeforeMethod(component, methodAnno.methodName, (...args) => {
                console.log("args: ", ...args);
                return args;
            });
            __1.ObjBoxHelper.insertFunctionAfterMethod(component, methodAnno.methodName, (result) => {
                console.log("result: " + result);
                return result;
            });
        }
    }
};
LogHandler = __decorate([
    (0, __1.ComponentHandler)()
], LogHandler);
let YourClass = class YourClass {
    add(num1, num2) {
        return num1 + num2;
    }
};
__decorate([
    Log()
], YourClass.prototype, "add", null);
YourClass = __decorate([
    (0, __1.Component)()
], YourClass);
function main() {
    // 配置容器日志（非必要）
    let loggerConfig = {
        level: Level_1.Level.ALL,
        timeFormate: `${libs_1.TimeFlag.Year}-${libs_1.TimeFlag.Month}-${libs_1.TimeFlag.Day} ${libs_1.TimeFlag.Hour}:${libs_1.TimeFlag.Minute}:${libs_1.TimeFlag.Second}`
    };
    let ob = __1.ObjBoxHelper.newObjBox(loggerConfig);
    ob.registerFromClass(LogHandler);
    ob.registerFromClass(YourClass);
    ob.registerFromFiles([
        new __1.ScanDir(__dirname + "/../HandlerDemo/"),
        new __1.ScanDir(__dirname + "/../ComponentScanDemo/")
    ]);
    // 启动装载
    ob.load();
    //启动容器应用
    ob.run();
    let yourclass = ob.getComponent(YourClass.name);
    yourclass.add(123, 456);
}
main();
