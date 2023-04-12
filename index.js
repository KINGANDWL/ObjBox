"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./src/ObjBox"), exports);
__exportStar(require("./src/entity/ScanDir"), exports);
__exportStar(require("./src/annotation/Annotations"), exports);
__exportStar(require("./src/interface/base/Component.interface"), exports);
__exportStar(require("./src/interface/base/ScannedTemplate.interface"), exports);
__exportStar(require("./src/interface/ApplicationHandler.interface"), exports);
__exportStar(require("./src/interface/ComponentHandler.interface"), exports);
__exportStar(require("./src/interface/ObjBox.interface"), exports);
__exportStar(require("./src/interface/TemplateHandler.interface"), exports);
__exportStar(require("./ObjBoxHelper/ObjBoxHelper"), exports);
// 内置工具库，这里注释掉是因为有一个在Logger中Constructor类型与ScannedTemplate中的Constructor重名了，用户可以手动在项目内添加即可
// export * from "./libs"
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
    说明：实际上在装载中期之前，可以通过start进行模板注册。不允许在注册阶段之后注册任何ApplicationHandler，会不断触发start导致死循环
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
          13.1 从模板单例实例化处获取实例，如果没有去缓存取
          13.2 如果缓存没有，新建
          13.3、触发 @ComponentHandler 的 created(objbox,sTemplate,component)
          13.4、触发 @TemplateHandler 的 created
          13.5、触发 @ComponentHandler 的 completed(objbox,sTemplate,component)
          13.6、触发 @TemplateHandler 的 completed
          13.7、如果应用已经运行，触发 @TemplateHandler 的 ready
    14、触发应用处理器 @ApplicationHandler 的 processAfterPrepare(objbox)
    
================== 运行阶段 ==================
说明：容器正式启动，触发所有组件的ready接口
    15、run启动程序
        15.1、触发 @ApplicationHandler 的 beforeRunning(objbox)
        15.2、触发 @ComponentHandler 的 ready(objbox,sTemplate,component)
        15.3、触发 @TemplateHandler 的 ready
        15.4、触发 @ApplicationHandler 的 afterRunning(objbox)
*/
/**
 * 使用样例
    async function main(){
        let config: LoggerManagerConfig = {
            fileOutputLevel: Level.OFF,
            consoleOutputLevel: Level.ALL,
            outPutDir: __dirname + "/logs",
            fileTemplate: `${TimeFlag.Year}-${TimeFlag.Month}-${TimeFlag.Day}.log`
        }
        let ob = ObjBoxHelper.newObjBox(config);
        
        // 方式1：从文件注册模板
        // await ob.registerFromFiles([
        //     new ScanDir(__dirname + "/src", [/(outerProject)/])
        // ])

        //方式2：通过method注册
        ob.registerFromMethod(()=>{
            return {a:123}
        },"AA",ComponentCreatedType.Singleton)

        //方式3：通过class注册
        class A{
            v:123
        }
        ob.registerFromClass(A)

        //方式4：直接注册对象
        ob.registerByObject({v:123},"obj")

        // 启动装载
        await ob.load()

        //启动容器应用
        ob.run();

        //获取注册的组件
        ob.getComponent("obj")
    }
    main()
*/ 
