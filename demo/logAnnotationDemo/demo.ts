//main.ts
import { Component, ComponentHandler, ComponentHandlerInterface, ComponentInject, ObjBoxHelper, ObjBoxInterface, ScanDir, ScannedTemplate } from "../../";
import { LoggerManagerConfig, TimeFlag } from "../..//libs";
import { getFunName, registerMethod } from "../../"
import { Level } from "../../libs/logger/Level";

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
class LogHandler implements ComponentHandlerInterface {
    scanned: (objbox: ObjBoxInterface, template: ScannedTemplate) => void;
    afterCreated(objbox: ObjBoxInterface, template: ScannedTemplate, component: any) {
        let methodAnnos = ObjBoxHelper.getMethodsAnnotationFromComponent(Log.name, component)
        for (let methodAnno of methodAnnos) {
            ObjBoxHelper.insertFunctionBeforeMethod(component, methodAnno.methodName, (...args) => {
                console.log("args: ", ...args);
                return args
            })
            ObjBoxHelper.insertFunctionAfterMethod(component, methodAnno.methodName, (result: any) => {
                console.log("result: " + result)
                return result
            })
        }
    }
}



@Component()
class YourClass {
    @Log()
    add(num1: number, num2: number) {
        return num1 + num2
    }
}



// 构造器注入测试
@Component("ClassC")
class ClassC {
    value: string = "ClassC"
}

@ComponentInject([{ name: "ClassC" }])
@Component("ClassBNeedClassC")
class ClassBNeedClassC {
    value: string = "ClassB";

    private c: ClassC = null;
    constructor(classC: ClassC) {
        console.log("yes get classC",classC)
        this.c = classC
    }

    getC() {
        return this.c
    }
}

@ComponentInject([{ name: "ClassBNeedClassC" }])
@Component("ClassANeedClassB")
class ClassANeedClassB {
    private b: ClassBNeedClassC = null;
    constructor(classB: ClassBNeedClassC) {
        console.log("yes get classB",classB)
        this.b = classB
    }

    getB() {
        return this.b
    }
}




function main() {
    // 配置容器日志（非必要）
    let loggerConfig: LoggerManagerConfig = {
        level: Level.ALL,
        timeFormate: `${TimeFlag.Year}-${TimeFlag.Month}-${TimeFlag.Day} ${TimeFlag.Hour}:${TimeFlag.Minute}:${TimeFlag.Second}`
    }

    let ob = ObjBoxHelper.newObjBox(loggerConfig);

    // ob.registerFromClass(LogHandler)
    // ob.registerFromClass(YourClass)

    // ob.registerFromFiles([
    //     new ScanDir(__dirname + "/../HandlerDemo/"),
    //     new ScanDir(__dirname + "/../ComponentScanDemo/")
    // ])

    ob.registerFromClass(ClassC)
    ob.registerFromClass(ClassBNeedClassC)
    ob.registerFromClass(ClassANeedClassB)

    // 启动装载
    ob.load()

    //启动容器应用
    ob.run();

    let A: ClassANeedClassB = ob.getComponent(ClassANeedClassB.name)
    console.log(A)
    console.log(A.getB())
    console.log(A.getB().getC())


    // let yourclass: YourClass = ob.getComponent(YourClass.name)
    // yourclass.add(123, 456);
}
main()