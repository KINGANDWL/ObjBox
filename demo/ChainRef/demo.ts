//main.ts
import { Component, ComponentHandler, ComponentHandlerInterface, ComponentInject, ObjBoxHelper, ObjBoxInterface, ScanDir, ScannedTemplate } from "../../";
import { LoggerManagerConfig, TimeFlag } from "../..//libs";
import { getFunName, registerMethod } from "../../"
import { Level } from "../../libs/logger/Level";




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
}
main()