//main.ts
import { AutowireProperty, Bean, BeanComponent, BeanInject, Component, ComponentHandler, ComponentHandlerInterface, ComponentInject, ObjBoxHelper, ObjBoxInterface, ScanDir, ScannedTemplate } from "../../";
import { LoggerManagerConfig, TimeFlag } from "../..//libs";
import { getFunName, registerMethod } from "../../"
import { Level } from "../../libs/logger/Level";



@BeanComponent("MakeA")
class ClassA {
    @BeanInject([{ name: "ClassC" }])
    @Bean("Obj1")
    public makeObj1(c: ClassC) {
        return { name: "obj1", c: c }
    }
}

@BeanComponent("MakeB")
class ClassB {
    @Bean("Obj2")
    @BeanInject([{ name: "Obj1" }])
    public makeObj2(Obj1: any) {
        return { name: "obj2", obj1: Obj1 }
    }
}


@Component("ClassC")
class ClassC {
    @AutowireProperty("Obj2")
    obj2: any
}



function main() {
    // 配置容器日志（非必要）
    let loggerConfig: LoggerManagerConfig = {
        level: Level.ALL,
        timeFormate: `${TimeFlag.Year}-${TimeFlag.Month}-${TimeFlag.Day} ${TimeFlag.Hour}:${TimeFlag.Minute}:${TimeFlag.Second}`
    }

    let ob = ObjBoxHelper.newObjBox(loggerConfig);

    ob.registerFromClass(ClassA)
    ob.registerFromClass(ClassB)
    ob.registerFromClass(ClassC)

    // 启动装载
    ob.load()

    //启动容器应用
    ob.run();

    console.log(ob.getComponent("ClassC"))
}
main()