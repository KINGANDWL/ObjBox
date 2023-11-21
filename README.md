可以从npmjs.org 或 npmmirror.com 使用"npm install objbox"获取



[github](https://github.com/kingandwl/objbox) or [npmjs](https://www.npmjs.com/package/objbox)



# 简述

​		为了减少typescript项目中逻辑与业务的依赖与高耦合，以及可以更方便对对象进行管理，故编写objbox（对象盒子）IOC容器。objbox是轻量级的，它支持文件扫描、class注册，对象注册、生命周期管理，自定义注解处理等。

​		objbox是基于typescript的装饰器的，你的项目需要支持typescript。当然，不是必须使用装饰器，只是推荐使用装饰器，且可以完成更多更强的功能



# typescript配置

* typescript配置：

  * ```json
    {
    	"include": [
            
    	],
    	"compilerOptions": {
    		"experimentalDecorators": true, //开启装饰器【必须】
    		"module": "commonjs", // commonjs 模式【必须】
    		"target": "ES6", // es6标准【至少满足es6】
            "strict": false, // 关闭严格模式【推荐】，不然会出现一些编译上的繁琐问题 
    		"outDir": "./out",
    		"paths": {},
    		"types": [
    		  "node"
    		]
    	}
    }
    ```
  
* 

# 基础样例

```js
import { ComponentCreatedType, ObjBoxHelper } from "objbox";
import { Level, LoggerManagerConfig, TimeFlag } from "objbox/libs";
import { DefaultApplicationHandler } from "objbox/demo/HandlerDemo/DefaultApplicationHandler"
import { DefaultComponentHandler } from "objbox/demo/HandlerDemo/DefaultComponentHandler"

function main() {
    // 配置容器日志（非必要）
    let loggerConfig: LoggerManagerConfig = {
        level: Level.ALL,
        timeFormate: `${TimeFlag.Year}-${TimeFlag.Month}-${TimeFlag.Day} ${TimeFlag.Hour}:${TimeFlag.Minute}:${TimeFlag.Second}`
    }

    let ob = ObjBoxHelper.newObjBox(loggerConfig);

    // 注册处理器（非必要）
    ob.registerFromClass(DefaultApplicationHandler)
    ob.registerFromClass(DefaultComponentHandler)


    // 方式1：从文件扫描与注册模板，需要导入fs-extra
    // ob.registerFromFiles([
    //     new ScanDir(__dirname + "/src")
    // ])

    //方式2：通过method注册
    ob.registerFromMethod(() => {
        return { a: 123 }
    }, "AA", ComponentCreatedType.Singleton)

    // 方式3：通过class注册
    class A {
        v: 123
    }
    ob.registerFromClass(A);

    //方式4：直接注册对象
    ob.registerByObject({ v: 123 }, "obj")

    // 启动装载
    ob.load()

    //启动容器应用
    ob.run();

    //获取注册的组件
    console.log(ob.getComponent("AA"))
    console.log(ob.getComponent("A"))
    console.log(ob.getComponent("obj"))

    /**
     * 更方便的基于文件扫描的注解方式请查看readme
     */
}
main()
```



# 原理说明

```js
/**
 * 基于typescript与nodejs的轻量级IOC容器
 * 
 * ObjBox思想就是，一切皆组件（Component）
 * 一切围绕着如何创建组件、如何管理组件、如何执行组件三个方面进行
 * 思路是通过扫描（注册）class、method、Object构建模板template，将信息存储到模板上（包括创建的组件信息、创建方式、来源等）、
 * 随后在load阶段对模板进行模板遍历与生成组件，并触发对应的处理器与生命周期钩子
 * 
 * ObjBox内有3种基本概念：组件、模板、注解
 * 模板：指的是具有 @Component 注解标记且export的class
 * 组件：被实例化的模板
 * 注解：也就是 @xxx 叫做注解（支持class注解、method注解，property注解、methodArguments注解，注解信息存储在模板的prototype内，作为模板的元数据）
 * 他们的处理顺序为注解、模板、组件
 * 基础注解有：
    @ApplicationHandler 应用处理器
    @ComponentHandler 组件处理器
    @BeanComponent 创建Bean组件的组件（bean组件工厂）
    @Bean 通过method创建组件
    @Component 组件注解
    @AutowireProperty 通过属性注入
    @AutowireMethod 通过方法注入
 */

/**
    以文件注册为流程简述IOC处理流程
================== 预处理阶段 ==================
说明：预处理阶段是利用typescript的特性以及装饰器特性，进行元数据注入
    0、typescript编译以及被特定装饰器预处理

================== 注册阶段 ==================
说明：注册阶段可以向容器内注册模板，可以从文件、class、method等方式进行注册（或者多种方式并用也可以，只要在），这里以文件方式举例
    1、扫描组件文件，生成class的function
    2、验证function的prototype规范性
    3、通过function创建组件扫描模板ScannedTemplate
    4、校验模板是否为ApplicationHandler实例化并存储
    5、存储所有组件模板（如果ApplicationHandler被标注为Component，会成为单例组件）

================== 装载阶段 ==================
    ===== 装载前期 =====
    说明：实际上在装载中期之前，可以通过ApplicationHandler的start进行模板注册。不允许在注册阶段之后注册任何ApplicationHandler，会不断触发start导致死循环
    6、对所有模板触发 @ApplicationHandler 的 start(objBox)

    ===== 装载中期 =====
    7、对所有模板触发 @ApplicationHandler 的 preprocessScannedTemplate(objbox,sTemplates[])
    8、校验模板是否为 @ComponentHandler 实例化并存储
    9、校验模板是否为 @BeanComponent 实例化并创建 @Bean 的组件模板
    10、对新建的 @bean 模板触发 @ApplicationHandler 的 preprocessScannedTemplate(objbox,sTemplates[])

    11、对所有模板触发 @ComponentHandler 的 scaned(objbox,name,sTemplate)
    
    ===== 装载后期 =====
    12、触发应用处理器 @ApplicationHandler 的 processBeforePrepare(objbox)
    13、对所有模板创建第一个实例组件并进行依赖注入
          13.1、从模板单例实例化处获取实例，如果没有去缓存取
          13.2、如果缓存没有，新建
            13.3、新建 @Component 组件 ObjBox.createComponentFromTemplate(sTemplate)
            13.4、触发 @ComponentHandler 的 beforeCreated(objbox,sTemplate,component)
            13.5、触发 @TemplateHandler 的 created
            13.6、触发 @ComponentHandler 的 afterCreated(objbox,sTemplate,component)
            13.7、依赖注入 @Component 组件 objbox.injectComponentDependency(component)
            13.8、触发 @ComponentHandler 的 beforeCompleted(objbox,sTemplate,component)
            13.9、触发 @TemplateHandler 的 completed
            13.10、触发 @ComponentHandler 的 afterCompleted(objbox,sTemplate,component)
            13.11、如果应用已经运行
                13.11.1、触发 @ComponentHandler 的 beforeReady
                13.11.2、触发 @TemplateHandler 的 ready
                13.11.3、触发 @ComponentHandler 的 afterReady
    14、触发应用处理器 @ApplicationHandler 的 processAfterPrepare(objbox)
    
================== 运行阶段 ==================
说明：容器正式启动，触发所有组件的ready接口
    15、run启动程序
        15.1、触发 @ApplicationHandler 的 beforeRunning(objbox)
        15.2、触发 @ComponentHandler 的 beforeReady(objbox,sTemplate,component)
        15.3、触发 @TemplateHandler 的 ready
        15.4、触发 @ComponentHandler 的 afterReady(objbox,sTemplate,component)
        15.5、触发 @ApplicationHandler 的 afterRunning(objbox)
*/
```



# 注解方式组件

注解方式可以通过文件扫描，也可以通过import导入（推荐使用扫描，毕竟IOC容器目的就是减少依赖）

```js
//main.ts

import { ObjBoxHelper, ScanDir } from "objbox";
import { Level, LoggerManagerConfig, TimeFlag } from "objbox/libs";
import { DefaultApplicationHandler } from "objbox/demo/HandlerDemo/DefaultApplicationHandler"
import { DefaultComponentHandler } from "objbox/demo/HandlerDemo/DefaultComponentHandler"
import * as fs_extra from 'fs-extra';

function main() {
    // 配置容器日志（非必要）
    let loggerConfig: LoggerManagerConfig = {
        level: Level.ALL,
        timeFormate: `${TimeFlag.Year}-${TimeFlag.Month}-${TimeFlag.Day} ${TimeFlag.Hour}:${TimeFlag.Minute}:${TimeFlag.Second}`
    }

    let ob = ObjBoxHelper.newObjBox(loggerConfig,fs_extra);

    // 注册处理器（非必要）
    ob.registerFromClass(DefaultApplicationHandler)
    ob.registerFromClass(DefaultComponentHandler)


    // 方式1：从文件扫描与注册模板
    ob.registerFromFiles([
    	new ScanDir(__dirname + "/src")
    ])

    // 启动装载
    ob.load()

    //启动容器应用
    ob.run();
}
main()
```

 然后新建对应的目录src，目录结构如下

```js
+--------
+-main.js
+-src
   +---------
   +-xxx.ts
   +...
```

并且在内部编写如下代码文件

```js
//xxx.ts

import { AutowireMethod, AutowireProperty, Bean, BeanComponent, Component, ComponentCreatedType,TemplateHandler } from 'objbox';


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


@Component("A")
export class A{

}
@Component()
export class B{

}
@BeanComponent()
export class MyBeanComponent{
    @Bean("C",ComponentCreatedType.Singleton)
    createC(){
        return {
            msg:"this is C"
        }
    }
}
@Component()
export class Main implements TemplateHandler{
    @AutowireProperty("A")
    a:A
    
    b:B
    @AutowireMethod("B")
    setB(b:B){
        this.b = b;
    }
    
    @AutowireProperty("C")
    c:any

    ready(){
        // console.log(this.a,this.b,this.c)
    }
}


@Component()
export class R1{
    @AutowireProperty("R2",false)
    r2:R2
}

@Component("R2")
export class R2{
    @AutowireProperty("R1")
    r1:R1
}
```

编译main.ts以及xxx.ts之后执行main.js即可。推荐如下配置tsconfig.json，将扫描的路径包含编译进去

```json
{
    ...
    "include": [
        "main.ts",
		"./src/**/*"
	],
    ...
}
```



# 创建自定义注解

通过全局安装`npm install -g objbox`，还可以使用创建注解命令

```
objbox anno-class <name> <path>         //create an annotation of class in path
objbox anno-property <name> <path>      //create an annotation of property in path
objbox anno-method <name> <path>        //create an annotation of method in path
objbox anno-methodArg <name> <path>     //create an annotation of methodArg in path
```

# 使用注解

通过阅读objbox流程，可以在ApplicationHandler或ComponentHandler中使用ObjBoxHelper进行操作注解，以及操作原始数据，达到自定义注解效果

```typescript
//main.ts
import { Component, ComponentHandler, ComponentHandlerInterface, ObjBoxHelper, ObjBoxInterface, ScanDir, ScannedTemplate, getFunName, registerMethod } from "objbox";
import { LoggerManagerConfig, TimeFlag, Level } from "objbox/libs";

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
    beforeCreated(objbox: ObjBoxInterface, template: ScannedTemplate, component: any) {
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
    beforeCompleted?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: any) => void;
    beforeReady?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: any) => void;
}



@Component()
class YourClass {
    @Log()
    add(num1: number, num2: number) {
        return num1 + num2
    }
}






function main() {
    // 配置容器日志（非必要）
    let loggerConfig: LoggerManagerConfig = {
        level: Level.ALL,
        timeFormate: `${TimeFlag.Year}-${TimeFlag.Month}-${TimeFlag.Day} ${TimeFlag.Hour}:${TimeFlag.Minute}:${TimeFlag.Second}`
    }

    let ob = ObjBoxHelper.newObjBox(loggerConfig);

    ob.registerFromClass(LogHandler)
    ob.registerFromClass(YourClass)

    // 启动装载
    ob.load()

    //启动容器应用
    ob.run();


    let yourclass: YourClass = ob.getComponent(YourClass.name)
    yourclass.add(123, 456);
}
main()
```

