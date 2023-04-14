//main.ts

import { Component, ComponentHandler, ComponentHandlerInterface, ObjBoxHelper, ObjBoxInterface, ScannedTemplate } from "../../";
import { Level, LoggerManagerConfig, TimeFlag } from "../..//libs";
import { getFunName, registerMethod } from "../../"


/**
 * 默认方法注解模板
 * @param yourArg1 
 * @param yourArg2 
 */
export function Log(): MethodDecorator {
    //获取当前函数名称，等效于let _annotationName = "Log"
    let _annotationName = getFunName(2)

    //@ts-ignore
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        registerMethod<any>(_annotationName, {}, target, key, descriptor)
    }
}
@ComponentHandler()
class LogHandler implements ComponentHandlerInterface{
    scanned: (objbox: ObjBoxInterface, template: ScannedTemplate) => void;
    created(objbox: ObjBoxInterface, template: ScannedTemplate, component: any){
        let methodAnnos = ObjBoxHelper.getMethodsAnnotationFromComponent(Log.name,component)
        for(let methodAnno of methodAnnos){
            ObjBoxHelper.insertFunctionBeforeMethod(component,methodAnno.methodName,(...args)=>{
                console.log("args: ",...args);
                return args
            })
            ObjBoxHelper.insertFunctionAfterMethod(component,methodAnno.methodName,(result:any)=>{
                console.log("result: "+result)
                return result
            })
        }
    }
    completed?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: any) => void;
    ready?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: any) => void;
}



@Component()
class YourClass {
    @Log()
    add(num1: number, num2: number) {
        return num1 + num2
    }
}






async function main() {
    // 配置容器日志（非必要）
    let loggerConfig: LoggerManagerConfig = {
        fileOutputLevel: Level.OFF,
        consoleOutputLevel: Level.OFF,
        outPutDir: __dirname + "/logs",
        fileTemplate: `${TimeFlag.Year}-${TimeFlag.Month}-${TimeFlag.Day}.log`
    }

    let ob = ObjBoxHelper.newObjBox(loggerConfig);

    ob.registerFromClass(LogHandler)
    ob.registerFromClass(YourClass)

    // 启动装载
    await ob.load()

    //启动容器应用
    ob.run();


    let yourclass : YourClass = ob.getComponent(YourClass.name)
    yourclass.add(123,456);
}
main()