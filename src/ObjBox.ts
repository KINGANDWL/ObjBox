import * as fs_extra from 'fs-extra';
import { Level, Logger } from "../libs/logger/Logger";
import { LoggerManagerConfig } from "../libs/logger/LoggerManagerConfig";
import { LoggerManager } from "../libs/logger/LoggerManager";
import { TimeFlag } from "../libs/Utils/TimeUtils";
import { Constructor, ScannedTemplate, BeanMethod } from './interface/base/ScannedTemplate.interface';
import { ComponentInterface } from './interface/base/Component.interface';
import { Component as ComponentAnnotation, ApplicationHandler, ComponentHandler, ComponentAnnotationArgs, BeanComponent, Bean, BeanAnnotationArgs, AutowirePropertyAnnotationArgs, AutowireProperty, AutowireMethod, AutowireMethodAnnotationArgs, Annotations, Component } from './annotation/Annotations';
import { ComponentCreatedType, ComponentOriginalType } from "./annotation/Annotations";
import { ApplicationHandlerInterface } from "./interface/ApplicationHandler.interface";
import { ComponentHandlerInterface } from "./interface/ComponentHandler.interface";
import { TemplateHandler } from "./interface/TemplateHandler.interface";
import { ObjBoxInterface } from "./interface/ObjBox.interface";
import { ScanDir } from "./entity/ScanDir";


export class ObjBox implements ObjBoxInterface {
    private config = {
        version: [1, 0, 0],
        objBoxLogger: {
            fileOutputLevel: Level.OFF,
            consoleOutputLevel: Level.ALL,
            outPutDir: __dirname + "/../logs",
            fileTemplate: `${TimeFlag.Year}-${TimeFlag.Month}-${TimeFlag.Day}.log`
        }
    }
    private logger: Logger
    private loggerManager: LoggerManager
    /**
     * 应用处理器模板
     */
    private applicationHandlerScannedTemplates: object = {} //<string,ScannedTemplate>
    /**
     * 组件处理器模板
     */
    private componentHandlerScannedTemplates: object = {} //<string,ScannedTemplate>
    /**
     * 组件模板
    */
    private componentScannedTemplates: object = {} //<string,ScannedTemplate>
    /**
     * bean组件模板
    */
    private beanComponentTemplates: object = {} //<string,ScannedTemplate>

    private componentTempPool = {}

    private status: { running: boolean } = {
        running: false
    }

    constructor(loggerConfig?: LoggerManagerConfig) {
        if (loggerConfig != null) {
            for (let i in loggerConfig) {
                this.config.objBoxLogger[i] = loggerConfig[i]
            }
        }
        this.loggerManager = new LoggerManager(this.config.objBoxLogger)
        this.logger = this.loggerManager.getLogger(ObjBox);
    }
    /**
     * 重置日志
     * @param logger 
     */
    public setLogger(logger: Logger) {
        this.logger = logger;
    }
    /**
     * 获取日志对象
     */
    public getLogger() {
        return this.logger;
    }
    /**
     * 获取日志管理器
     */
    public getLoggerManager() {
        return this.loggerManager;
    }


    /**
     * 判断一个函数是否是class（构造函数）
     * @param fun 
     */
    private static isClass(fun: Function): boolean {
        return fun != null && (fun.toString().indexOf("class") == 0 || fun.toString().indexOf("function") == 0);
    }
    /**
     * 判断路径是否是js文件
     * @param path 
     */
    private static isJSFile(path: string): boolean {
        let endness = ".js";
        if (path != null && fs_extra.existsSync(path)) {
            return fs_extra.statSync(path).isFile() && path.indexOf(endness) == path.length - endness.length
        }
        return false
    }

    /**
     * 从指定路径读取所有class
     * @param path 
     */
    private static async readFunctionsFromFile(path: string): Promise<Function[]> {
        let result: Function[] = []
        if (ObjBox.isJSFile(path)) {
            let fileExports = await import(path.replace(/.js$/, ""))
            for (let index in fileExports) {
                if (ObjBox.isClass(fileExports[index])) {
                    result.push(fileExports[index])
                }
            }
        }
        return result
    }
    /**
     * 通过目录获取所有的文件路径
     * @param scannedDirs 
     */
    private static listAllFiles(scannedDirs: ScanDir[]): string[] {
        let result: string[] = []
        if (scannedDirs != null && scannedDirs.length > 0) {
            for (let scannedDir of scannedDirs) {
                if (fs_extra.existsSync(scannedDir.dirPath)) {
                    if (fs_extra.statSync(scannedDir.dirPath).isFile()) {
                        result.push(scannedDir.dirPath)
                    } else {
                        let files = fs_extra.readdirSync(scannedDir.dirPath)
                        for (let eacnfileName of files) {
                            let childFiles = ObjBox.listAllFiles([new ScanDir(scannedDir.dirPath + "/" + eacnfileName, scannedDir.excludeRegExp)])
                            result = result.concat(childFiles);
                        }
                    }
                }
            }
        }
        return result
    }

    /**
     * 判断一个函数是否是符合模板特征的class，验证function的prototype规范性
     * @param classFunction 
     */
    private static isFunctionTypeofTemplate(classFunction: Function): boolean {
        if (ObjBox.isClass(classFunction)) {
            let prot = classFunction.prototype as ComponentInterface
            // 符合注解体要求
            if (prot != null && prot._annotations_ != null && prot._annotations_.clazz != null) {
                if (prot._annotations_.clazz.annotationNameMap != null) {
                    return Object.keys(prot._annotations_.clazz.annotationNameMap).length > 0
                }
            }
        }
        return false
    }

    /**
     * 判断一个对象是否是符合组件特征验证prototype规范性
     * @param classFunction 
     */
    public static isObjectTypeofComponent(obj: any): boolean {
        if (obj != null) {
            let prot = obj.prototype as ComponentInterface
            // 符合注解体要求
            if (prot != null && prot._annotations_ != null && prot._annotations_.clazz != null) {
                if (prot._annotations_.clazz.annotationNameMap != null) {
                    return Object.keys(prot._annotations_.clazz.annotationNameMap).length > 0
                }
            }
        }
        return false
    }

    /**
     * 通过函数创建扫描模板
     * @param fun 
     * @param filePath 函数来源
     */
    private static createScannedTemplateFromFunction(fun: Function, filePath: string): ScannedTemplate {
        if (fun == null || filePath == null || filePath.trim().length <= 0) {
            // if (fun == null) {
            return null
        }
        let prot = fun.prototype as ComponentInterface
        let componentAnnotation = prot._annotations_.clazz.getAnnotation<ComponentAnnotationArgs>(ComponentAnnotation.name);
        let temp: ScannedTemplate = {
            componentName: componentAnnotation == null ? fun.name : componentAnnotation.annotationArgs.name, //如果没有用Component作为组件名称，则默认使用class名称
            className: fun.name,
            newInstance: fun as Constructor,
            filePath: filePath,
            instances: [],
            createdType: componentAnnotation == null ? ComponentCreatedType.Singleton : componentAnnotation.annotationArgs.scope,
            originalType: ComponentOriginalType.Component
        }
        return temp
    }

    /**
     * 尝试在不重复名称情况下保存应用处理器
     * @param sTemplate 
     */
    private trySaveApplicationHandler(sTemplate: ScannedTemplate) {
        if (this.applicationHandlerScannedTemplates[sTemplate.componentName] != null) {
            let st = this.applicationHandlerScannedTemplates[sTemplate.componentName] as ScannedTemplate
            throw new Error(`ApplicationHandler "${sTemplate.componentName}" is repeat between "${st.filePath}"[${st.newInstance.name}] and "${sTemplate.filePath}"[${sTemplate.newInstance.name}]`);
        } else {
            if (sTemplate.instances == null || sTemplate.instances.length <= 0) {
                let newIns = new (sTemplate.newInstance as Constructor)() as ComponentInterface;
                newIns._annotations_.scannedTemplate = sTemplate
                sTemplate.instances = [newIns]
            }
            this.applicationHandlerScannedTemplates[sTemplate.componentName] = sTemplate;
        }
    }
    /**
     * 尝试在不重复名称情况下保存组件处理器
     * @param sTemplate 
     */
    private trySaveComponentHandler(sTemplate: ScannedTemplate) {
        if (this.componentHandlerScannedTemplates[sTemplate.componentName] != null) {
            let st = this.componentHandlerScannedTemplates[sTemplate.componentName] as ScannedTemplate
            throw new Error(`ComponentHandler "${sTemplate.componentName}" is repeat between "${st.filePath}"[${st.newInstance.name}] and "${sTemplate.filePath}"[${sTemplate.newInstance.name}]`);
        } else {
            if (sTemplate.instances == null || sTemplate.instances.length <= 0) {
                let newIns = new (sTemplate.newInstance as Constructor)() as ComponentInterface;
                newIns._annotations_.scannedTemplate = sTemplate
                sTemplate.instances = [newIns]
            }
            this.componentHandlerScannedTemplates[sTemplate.componentName] = sTemplate;
        }
    }
    /**
     * 尝试在不重复名称情况下保存bean组件
     * @param sTemplate 
     */
    private trySaveBeanComponent(sTemplate: ScannedTemplate) {
        if (this.beanComponentTemplates[sTemplate.componentName] != null) {
            let st = this.beanComponentTemplates[sTemplate.componentName] as ScannedTemplate
            throw new Error(`BeanComponent "${sTemplate.componentName}" is repeat between "${st.filePath}"[${st.newInstance.name}] and "${sTemplate.filePath}"[${sTemplate.newInstance.name}]`);
        } else {
            if (sTemplate.instances == null || sTemplate.instances.length <= 0) {
                let newIns = new (sTemplate.newInstance as Constructor)() as ComponentInterface;
                newIns._annotations_.scannedTemplate = sTemplate
                sTemplate.instances = [newIns]
            }
            this.beanComponentTemplates[sTemplate.componentName] = sTemplate;
        }
    }

    /**
     * 获取所有应用处理器实例
     */
    private getAllApplicationHandler(): ApplicationHandlerInterface[] {
        let result: ApplicationHandlerInterface[] = []
        for (let i in this.applicationHandlerScannedTemplates) {
            let st = (this.applicationHandlerScannedTemplates[i] as ScannedTemplate);
            if (st.instances == null || st.instances.length <= 0) {
                st.instances = [new (st.newInstance as Constructor)()]
            }
            result.push(st.instances[0] as unknown as ApplicationHandlerInterface);
        }
        return result;
    }
    /**
     * 获取所有组件处理器实例
     */
    private getAllComponentHandler(): ComponentHandlerInterface[] {
        let result: ComponentHandlerInterface[] = []
        for (let i in this.componentHandlerScannedTemplates) {
            let st = (this.componentHandlerScannedTemplates[i] as ScannedTemplate);
            if (st.instances == null || st.instances.length <= 0) {
                st.instances = [new (st.newInstance as Constructor)()]
            }
            result.push(st.instances[0] as unknown as ComponentHandlerInterface);
        }

        return result;
    }
    /**
     * 获取所有bean组件实例
     */
    private getAllBeanComponent(): ComponentInterface[] {
        let result: ComponentInterface[] = []
        for (let i in this.beanComponentTemplates) {
            let st = (this.beanComponentTemplates[i] as ScannedTemplate);
            if (st.instances == null || st.instances.length <= 0) {
                st.instances = [new (st.newInstance as Constructor)()]
            }
            result.push(st.instances[0]);
        }

        return result;
    }
    /**
     * 尝试在不重复名称情况下存储组件模板
     * @param sTemplate 
     */
    private trySaveComponentTemplate(sTemplate: ScannedTemplate) {
        if (this.componentScannedTemplates[sTemplate.componentName] != null) {
            let st = this.componentScannedTemplates[sTemplate.componentName] as ScannedTemplate
            throw new Error(`Component "${sTemplate.componentName}" is repeat between "${st.filePath}"[${st.newInstance.name}] and "${sTemplate.filePath}"[${sTemplate.newInstance.name}]`);
        } else {
            this.componentScannedTemplates[sTemplate.componentName] = sTemplate;
        }
    }


    /**
     * 获取所有组件模板
     */
    getAllComponentTemplate(): ScannedTemplate[] {
        let result: ScannedTemplate[] = []
        for (let i in this.componentScannedTemplates) {
            result.push(this.componentScannedTemplates[i])
        }
        return result
    }

    /**
     * 通过名称获取组件模板
     * @param name 
     */
    getComponentTemplate(name: string): ScannedTemplate | null {
        return this.componentScannedTemplates[name];
    }


    /**
     * 检测模板是否是应用处理器
     * @param sTemplate 
     */
    private static isTemplateTypeofApplicationHandler(sTemplate: ScannedTemplate): boolean {
        let prot = (sTemplate.newInstance as Constructor).prototype as ComponentInterface
        // 符合注解体要求
        if (prot != null && prot._annotations_ != null && prot._annotations_.clazz != null) {
            return prot._annotations_.clazz.getAnnotation(ApplicationHandler.name) != null
        }
        return false
    }
    private static isTemplateTypeofComponentHandler(sTemplate: ScannedTemplate): boolean {
        let prot = (sTemplate.newInstance as Constructor).prototype as ComponentInterface
        // 符合注解体要求
        if (prot != null && prot._annotations_ != null && prot._annotations_.clazz != null) {
            return prot._annotations_.clazz.getAnnotation(ComponentHandler.name) != null
        }
        return false
    }
    private static isTemplateTypeofBeanComponent(sTemplate: ScannedTemplate): boolean {
        let prot = (sTemplate.newInstance as Constructor).prototype as ComponentInterface
        // 符合注解体要求
        if (prot != null && prot._annotations_ != null && prot._annotations_.clazz != null) {
            return prot._annotations_.clazz.getAnnotation(BeanComponent.name) != null
        }
        return false
    }


    /**
     * 通过函数创建模板
     * @param functions 
     */
    private static createComponentTemplatesFromFunctions(functions: Function, filepath: string): ScannedTemplate {
        let sTemplate: ScannedTemplate = null
        sTemplate = ObjBox.createScannedTemplateFromFunction(functions, filepath);
        if (sTemplate == null) {
            throw Error(`Cannot create template: class ${functions.name} in "${filepath}"`)
        }
        return sTemplate
    }
    /**
     * 从BeanComponent模板创建Bean的扫描模板
     * @param beanComponentTemplate 
     */
    private static createBeanTemplatesFromBeanComponent(beanComponent: ComponentInterface): ScannedTemplate[] {
        let result: ScannedTemplate[] = []
        let beanAnnotation = beanComponent._annotations_.methods.getAnnotationsByName<BeanAnnotationArgs>(Bean.name);

        if (beanAnnotation != null) {
            for (let methodAnnotationType of beanAnnotation) {
                let temp: ScannedTemplate = {
                    componentName: methodAnnotationType.annotationArgs.name,
                    className: "@" + Bean.name,
                    newInstance: beanComponent[methodAnnotationType.methodName].bind(beanComponent) as BeanMethod,
                    filePath: beanComponent._annotations_.scannedTemplate.filePath,
                    instances: [],
                    createdType: methodAnnotationType.annotationArgs.scope,
                    originalType: ComponentOriginalType.Bean
                }
                result.push(temp)
            }
        }

        return result
    }

    /**
     * 通过模板获取实例化
     * @param sTemplate 
     */
    private static createComponentFromTemplate(sTemplate: ScannedTemplate): ComponentInterface {
        let result: ComponentInterface = null
        if (sTemplate != null) {
            if (sTemplate.instances == null || sTemplate.instances.length <= 0 || sTemplate.createdType == ComponentCreatedType.Factory) {
                if (sTemplate.originalType == ComponentOriginalType.Component) {
                    result = new (sTemplate.newInstance as Constructor)();
                } else if (sTemplate.originalType == ComponentOriginalType.Bean) {
                    result = (sTemplate.newInstance as BeanMethod)();
                }
                if (sTemplate.instances == null) {
                    sTemplate.instances = [result]
                } else {
                    sTemplate.instances.push(result);
                }

                if (sTemplate.originalType == ComponentOriginalType.Component) {
                    //使用class的prototype
                    result._annotations_ = sTemplate.newInstance.prototype._annotations_
                } else {
                    result._annotations_ = new Annotations()
                }

                result._preComponents_ = []
                //模板与实例化绑定
                result._annotations_.scannedTemplate = sTemplate;
            } else {
                result = sTemplate.instances[0];
            }
        }

        return result
    }


    private executeComponentHandler_scanned(sTemplate: ScannedTemplate) {
        let allCH = this.getAllComponentHandler();
        for (let ch of allCH) {
            if (ch.scanned != null) {
                ch.scanned(this, sTemplate);
            }
        }
    }
    private executeComponentHandler_created(sTemplate: ScannedTemplate, component: ComponentInterface) {
        let allCH = this.getAllComponentHandler();
        for (let ch of allCH) {
            if (ch.created != null) {
                ch.created(this, sTemplate, component);
            }
        }
    }
    private executeComponentHandler_completed(sTemplate: ScannedTemplate, component: ComponentInterface) {
        let allCH = this.getAllComponentHandler();
        for (let ch of allCH) {
            if (ch.completed != null) {
                ch.completed(this, sTemplate, component);
            }
        }
    }
    private executeComponentHandler_ready(sTemplate: ScannedTemplate, component: ComponentInterface) {
        let allCH = this.getAllComponentHandler();
        for (let ch of allCH) {
            if (ch.ready != null) {
                ch.ready(this, sTemplate, component);
            }
        }
    }

    private executeTemplateHandler_created(component: ComponentInterface) {
        let _component = component as unknown as TemplateHandler;
        if (_component.created != null) {
            try {
                _component.created();
            } catch (err) {
                this.logger.error((err as Error).stack)
            }
        }
    }
    private executeTemplateHandler_completed(component: ComponentInterface) {
        let _component = component as unknown as TemplateHandler;
        if (_component.completed != null) {
            try {
                _component.completed();
            } catch (err) {
                this.logger.error((err as Error).stack)
            }
        }
    }
    private executeTemplateHandler_ready(component: ComponentInterface) {
        let _component = component as unknown as TemplateHandler;
        if (_component.ready != null) {
            try {
                _component.ready();
            } catch (err) {
                this.logger.error((err as Error).stack)
            }
        }
    }

    private async executeApplicationHandler_start() {
        let allAH = this.getAllApplicationHandler();
        for (let ah of allAH) {
            if (ah.start != null) {
                await ah.start(this);
            }
        }
    }
    private executeApplicationHandler_preprocessScannedTemplate(sTemplates: ScannedTemplate[]) {
        let allAH = this.getAllApplicationHandler();
        for (let ah of allAH) {
            if (ah.preprocessScannedTemplate != null) {
                ah.preprocessScannedTemplate(this, sTemplates);
            }
        }
    }

    private executeApplicationHandler_BeforePrepare() {
        let allAH = this.getAllApplicationHandler();
        for (let ah of allAH) {
            if (ah.beforePrepare != null) {
                ah.beforePrepare(this);
            }
        }
    }
    private executeApplicationHandler_AfterPrepare() {
        let allAH = this.getAllApplicationHandler();
        for (let ah of allAH) {
            if (ah.afterPrepare != null) {
                ah.afterPrepare(this);
            }
        }
    }

    private executeApplicationHandler_beforeRunning() {
        let allAH = this.getAllApplicationHandler();
        for (let ah of allAH) {
            if (ah.beforeRunning != null) {
                ah.beforeRunning(this);
            }
        }
    }
    private executeApplicationHandler_afterRunning() {
        let allAH = this.getAllApplicationHandler();
        for (let ah of allAH) {
            if (ah.afterRunning != null) {
                ah.afterRunning(this);
            }
        }
    }

    private injectComponentDependency(component: ComponentInterface) {
        // 属性注入方式
        let propertyInfos = component._annotations_.property.getAnnotationByName<AutowirePropertyAnnotationArgs>(AutowireProperty.name)
        if (propertyInfos != null) {
            for (let info of propertyInfos) {
                let injected = this.getComponent(info.annotationArgs.name)
                if (injected != null) {
                    component[info.propertyKey] = injected;
                    if (injected._preComponents_ == null) {
                        injected._preComponents_ = []
                    }
                    injected._preComponents_.push(component);
                } else if (info.annotationArgs.required == true) {
                    throw new Error(`Cannot find component "${info.annotationArgs.name}" while injecting dependencies of "${component._annotations_.scannedTemplate.componentName}" by @AutowireProperty`)
                }
            }
        }

        //方法注入
        let methodInfos = component._annotations_.methods.getAnnotationsByName<AutowireMethodAnnotationArgs>(AutowireMethod.name)
        if (methodInfos != null) {
            for (let info of methodInfos) {
                let injected = this.getComponent(info.annotationArgs.name)
                if (injected != null) {
                    if (injected._preComponents_ == null) {
                        injected._preComponents_ = []
                    }
                    injected._preComponents_.push(component);
                    component[info.methodName](injected);
                } else if (info.annotationArgs.required == true) {
                    throw new Error(`Cannot find component "${info.annotationArgs.name}" while injecting dependencies of "${component._annotations_.scannedTemplate.componentName}" by @AutowireMethod`)
                }
            }
        }
    }

    private saveComponentToLevelTwo(name: string, component: ComponentInterface) {
        if (this.componentTempPool[name] == null) {
            this.componentTempPool[name] = component;
        } else {
            throw new Error(`Wrong component "${name}" is in tempPool of level two`)
        }
    }
    private getComponentFromTempPool(name: string): ComponentInterface {
        return this.componentTempPool[name]
    }
    private removeComponentfromTempPool(name: string) {
        delete this.componentTempPool[name]
    }
    /**
     * 从模板获取单例模式的实例
     * @param template 
     */
    private getSingletonInstanceFromTemplate(template: ScannedTemplate): ComponentInterface {
        if (template != null) {
            if (template.createdType == ComponentCreatedType.Singleton) {
                if (template.instances != null && template.instances.length > 0) {
                    return template.instances[0]
                }
            }
        }
        return null
    }
    private static hasComponentAnnotation(sTemplate: ScannedTemplate): boolean {
        let com = sTemplate.newInstance as Constructor
        if (com.prototype != null && com.prototype._annotations_ != null) {
            return com.prototype._annotations_.clazz.getAnnotation<ComponentAnnotationArgs>(Component.name) != null
        }

        return false
    }
    private static isBeanAnnotation(sTemplate: ScannedTemplate): boolean {
        return sTemplate != null && sTemplate.originalType != null && sTemplate.originalType == ComponentOriginalType.Bean
    }











    /**
     * 遵循组件创建方式，通过名称获取组件
     * @param name 
     */
    getComponent<T = ComponentInterface>(name: string): T | null {
        /**
          13.1 从模板单例实例化处获取实例，如果没有去缓存取
          13.2 如果缓存没有，新建
          13.3、触发 @ComponentHandler 的 created(objbox,sTemplate,component)
          13.4、触发 @TemplateHandler 的 created
          13.5、触发 @ComponentHandler 的 completed(objbox,sTemplate,component)
          13.6、触发 @TemplateHandler 的 completed
          13.7、如果应用已经运行，触发 @TemplateHandler 的 ready
        */

        let component = null
        let scannedTemplate = this.getComponentTemplate(name)
        if (scannedTemplate != null) {

            //   13.1 从模板单例实例化处获取实例，如果没有去缓存取
            component = this.getSingletonInstanceFromTemplate(scannedTemplate)
            if (component == null) {

                // 13.2 从缓存获取；如果缓存没有，新建
                component = this.getComponentFromTempPool(name);
                if (component == null) {

                    component = ObjBox.createComponentFromTemplate(scannedTemplate)
                    if (component != null) {
                        this.saveComponentToLevelTwo(name, component) //实例存入缓存

                        // 13.3、触发 @ComponentHandler 的 created(objbox,sTemplate,component)
                        this.executeComponentHandler_created(scannedTemplate, component);

                        // 13.4、触发 @TemplateHandler 的 created
                        this.executeTemplateHandler_created(component);

                        this.injectComponentDependency(component);//依赖注入

                        this.removeComponentfromTempPool(name); //移除缓存中的数据

                        // 13.5、触发 @ComponentHandler 的 completed(objbox,sTemplate,component)
                        this.executeComponentHandler_completed(scannedTemplate, component);
                        // 13.6、触发 @TemplateHandler 的 completed
                        this.executeTemplateHandler_completed(component);

                        // 13.7、如果应用已经运行，触发 @TemplateHandler 的 ready
                        if (this.status.running == true) {
                            this.executeTemplateHandler_ready(component);
                        }
                    }
                }
            }
        }
        return component as any
    }
    /**
     * 通过名称获取组件已存在实例，不触发创建流程
     * @param name 组件名称
     */
    getComponentsInstance<T = ComponentInterface>(name: string): T[] {
        let components: T[] = []
        let sTemplate = this.componentScannedTemplates[name];
        if (sTemplate != null) {
            for (let ins of sTemplate.instances) {
                if (ins == null) {
                    throw new Error(`Cannot find component "${sTemplate.componentName}"`)
                } else {
                    components.push(ins as unknown as T)
                }
            }
        }
        return components
    }


    /**
     * 遵循创建组件方式获取所有组件
     */
    getAllComponents<T = ComponentInterface>(): T[] {
        let components: T[] = []
        let sTemplates = this.getAllComponentTemplate();
        for (let sTemplate of sTemplates) {
            if (ObjBox.hasComponentAnnotation(sTemplate) || ObjBox.isBeanAnnotation(sTemplate)) {
                let com = this.getComponent(sTemplate.componentName);
                if (com == null) {
                    throw new Error(`Cannot find component "${sTemplate.componentName}"`)
                } else {
                    components.push(com as unknown as T)
                }
            }
        }
        return components
    }
    /**
     * 仅获取所有组件当前已存在实例，不触发创建流程（非常不推荐使用）
     */
    _getAllComponentsInstance<T = ComponentInterface>(): T[] {
        let components: T[] = []
        let sTemplates = this.getAllComponentTemplate();
        for (let sTemplate of sTemplates) {
            if (ObjBox.hasComponentAnnotation(sTemplate) || ObjBox.isBeanAnnotation(sTemplate)) {
                for (let ins of sTemplate.instances) {
                    if (ins == null) {
                        throw new Error(`Cannot find component "${sTemplate.componentName}"`)
                    } else {
                        components.push(ins as unknown as T)
                    }
                }
            }
        }
        return components
    }

    /**
     * 准备组件
     * @param sTemplates 
     */
    private prepareComponents() {
        let sTemplates = this.getAllComponentTemplate();
        for (let sTemplate of sTemplates) {
            if (ObjBox.hasComponentAnnotation(sTemplate) || ObjBox.isBeanAnnotation(sTemplate)) {
                let com = this.getComponent(sTemplate.componentName);
                if (com == null) {
                    throw new Error(`Cannot find component "${sTemplate.componentName}"`)
                }
            }
        }
    }

    /**
     * 将class注册为模板
     * @param clazz 
     * @param filepath 
     */
    private registerClass(clazz: Constructor, filepath: string) {
        // 2、验证function的prototype规范性
        if (ObjBox.isFunctionTypeofTemplate(clazz)) {
            // 3、通过function创建组件扫描模板ScannedTemplate
            let sTemplate = ObjBox.createComponentTemplatesFromFunctions(clazz, filepath)

            // 4、校验模板是否为ApplicationHandler实例化并存储
            if (ObjBox.isTemplateTypeofApplicationHandler(sTemplate)) {
                this.trySaveApplicationHandler(sTemplate)
            }

            // 5、存储所有组件模板（如果ApplicationHandler被标注为Component，会成为单例组件）
            this.trySaveComponentTemplate(sTemplate);
        }
    }


    /**
     * 从class注册模板
     * @param scannedDirs 
     */
    async registerFromFiles(scannedDirs: ScanDir[]) {
        if (scannedDirs == null) {
            scannedDirs = []
        }

        // 1、扫描组件文件，生成class的function
        let filepathArray = ObjBox.listAllFiles(scannedDirs);//罗列所有扫描文件列表
        for (let filepath of filepathArray) {
            let functionArray: Function[] = await ObjBox.readFunctionsFromFile(filepath)
            for (let fun of functionArray) {
                this.registerClass(fun as Constructor, filepath)
            }
        }
    }
    /**
     * 从文件注册模板
     * @param clazz class名称
     * @param name 组件名称 
     * @param scope 创建方式 
     */
    registerFromClass(clazz: Function, name?: string, scope?: ComponentCreatedType) {
        let con = clazz as Constructor
        if (name == null) name = con.name
        if (scope == null) scope = ComponentCreatedType.Singleton

        // 普通的未处理的class
        if (!ObjBox.isFunctionTypeofTemplate(con)) {
            con.prototype._annotations_ = new Annotations()
            con.prototype._preComponents_ = []
            con.prototype._annotations_.clazz.pushAnnotation<ComponentAnnotationArgs>(Component.name, {
                name: name,
                scope: scope
            })
        }

        this.registerClass(con, "#registerFromClass")
    }
    /**
     * 从method创建的对象注册模板
     * @param method 能够创建对象的函数
     * @param name 组件名称 
     * @param scope 创建方式 
     */
    registerFromMethod(method: Function, name?: string, scope?: ComponentCreatedType) {
        if (name == null) name = method.name
        if (scope == null) scope = ComponentCreatedType.Singleton

        let temp: ScannedTemplate = {
            componentName: name,
            className: "@" + Bean.name,
            newInstance: method as BeanMethod,
            filePath: "#registerFromMethod",
            instances: [],
            createdType: scope,
            originalType: ComponentOriginalType.Bean
        }

        this.trySaveComponentTemplate(temp)
    }
    /**
     * 直接将对象注入到容器
     * @param obj 任意obj对象
     * @param name 组件名称 
     */
    registerByObject(obj: Object, name: string) {
        this.registerFromMethod(function () {
            return obj
        }, name, ComponentCreatedType.Singleton)
    }



    /**
     * 开始装载所有注册模板
     */
    async load() {
        // 6、对所有模板触发 @ApplicationHandler 的 start(objBox)
        await this.executeApplicationHandler_start()

        //7、对所有模板触发 @ApplicationHandler 的 preprocessScannedTemplate(objbox,sTemplates[])
        let allSTemplate = this.getAllComponentTemplate();
        this.executeApplicationHandler_preprocessScannedTemplate(allSTemplate)

        // 8、校验模板是否为 @ComponentHandler 实例化并存储
        for (let sTemplate of allSTemplate) {
            if (ObjBox.isTemplateTypeofComponentHandler(sTemplate)) {
                this.trySaveComponentHandler(sTemplate);
            }
        }

        // 9、校验模板是否为 @BeanComponent 实例化并创建 @Bean 的组件模板
        for (let sTemplate of allSTemplate) {
            if (ObjBox.isTemplateTypeofBeanComponent(sTemplate)) {
                this.trySaveBeanComponent(sTemplate);
            }
        }
        let allBeanTempaltes: ScannedTemplate[] = []
        let allBeanComponent = this.getAllBeanComponent();
        for (let bc of allBeanComponent) {
            let beanTemplates: ScannedTemplate[] = ObjBox.createBeanTemplatesFromBeanComponent(bc);
            allBeanTempaltes = allBeanTempaltes.concat(beanTemplates)
            for (let eachBT of beanTemplates) {
                this.trySaveComponentTemplate(eachBT)
            }
        }

        // 10、对新建的 @bean 模板触发 @ApplicationHandler 的 preprocessScannedTemplate(objbox,sTemplates[])
        this.executeApplicationHandler_preprocessScannedTemplate(allBeanTempaltes)

        // 11、对所有模板触发 @ComponentHandler 的 scaned(objbox,name,sTemplate)
        allSTemplate = this.getAllComponentTemplate();
        for (let sTemplate of allSTemplate) {
            this.executeComponentHandler_scanned(sTemplate)
        }

        // 12、触发应用处理器 @ApplicationHandler 的 processBeforePrepare(objbox)
        this.executeApplicationHandler_BeforePrepare()
        // 13、对所有模板创建第一个实例组件并进行依赖注入
        this.prepareComponents();
        // 14、触发应用处理器 @ApplicationHandler 的 processAfterPrepare(objbox)
        this.executeApplicationHandler_AfterPrepare()
    }



    /**
     * 启动应用
     */
    run() {
        if (this.status.running == false) {
            // 15.1、触发 @ApplicationHandler 的 beforeRunning(objbox)
            this.executeApplicationHandler_beforeRunning()

            this.status.running = true
            let allComponents = this._getAllComponentsInstance()
            for (let component of allComponents) {
                // 15.2、触发 @ComponentHandler 的 ready(objbox,sTemplate,component)
                this.executeComponentHandler_ready(component._annotations_.scannedTemplate, component)
                // 15.3、触发 @TemplateHandler 的 ready
                this.executeTemplateHandler_ready(component);
            }

            // 15.4、触发 @ApplicationHandler 的 afterRunning(objbox)
            this.executeApplicationHandler_afterRunning()
        }
    }
    /**
     * 打印logo
     */
    public printLogo() {
        this.logger.info(`
         ____  _     _ ____            
        / __ \\| |   (_)  _ \\           
       | |  | | |__  _| |_) | _____  __
       | |  | | '_ \\| |  _ < / _ \\ \\/ /
       | |__| | |_) | | |_) | (_) >  < 
        \\____/|_.__/| |____/ \\___/_/\\_\\
                   _/ |                
                  |__/                 

    = Author:https://www.npmjs.com/~kingandwl =
    
    `)
    }
}

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
    let ob = ObjBoxHelper.newObjBox(applicationConfig.ObjBoxLogger);
    
    // 方式1：从文件注册模板
    await ob.registerFromFiles([
        new ScanDir(__dirname + "/src/main", [/(outerProject)/])
    ])

    //方式2：通过method注册
    // ob.registerFromMethod(()=>{
    //     return {a:123}
    // },"AA",ComponentCreatedType.Singleton)

    //方式3：通过class注册
    // class A{
    //     v:123
    // }
    // ob.registerFromClass(A)

    //方式4：直接注册对象
    // ob.registerByObject({v:123},"obj")

    // 启动装载
    await ob.load()

    //启动容器应用
    ob.run();

    //获取注册的组件
    ob.getComponent("name")
*/