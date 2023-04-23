import { Logger } from "../../libs"
import { ScanDir } from "../entity/ScanDir"
import { ScannedTemplate } from './base/ScannedTemplate.interface';
import { LoggerManager } from '../../libs/logger/LoggerManager';
import { ComponentInterface } from './base/Component.interface';
import { ComponentCreatedType } from "../annotation/Annotations";

/**
 * 整套ObjBox的运行接口
 * 与IOCHandler区别就是，IOCHandler是被调用的逻辑实现
 * 也就是说通过重写Handler来实现自定义IOC处理，而不需要去修改ObjBox的码
 */
export interface ObjBoxInterface {
    /**
     * 打印logo
     */
    printLogo: () => void
    /**
     * 获取日志对象
     */
    getLogger: () => void
    /**
     * 获取日志管理器
     */
    getLoggerManager: () => LoggerManager
    /**
     * 重置日志
     * @param logger 
     */
    setLogger: (logger: Logger) => void
    /**
     * 通过名称获取组件
     * @param name 
    */
    getComponent: <T = ComponentInterface>(name: string) => T | null
    /**
     * 获取所有组件
     */
    getAllComponents: <T = ComponentInterface>() => T[]
    /**
     * 获取所有模板
     */
    getAllComponentTemplate: () => ScannedTemplate[]
    /**
     * 仅获取所有组件当前已存在实例，不触发创建流程（非常不推荐使用）
     */
    _getAllComponentsInstance: <T = ComponentInterface>() => T[]
    /**
     * 通过名称获取组件模板
     * @param name 
     */
    getComponentTemplate: (name: string) => ScannedTemplate | null
    /**
     * 开始装载所有注册模板
     */
    load: () => Promise<void>
    /**
     * 启动应用
     */
    run: () => void
    /**
     * 从class注册模板
     * @param scannedDirs 
     */
    registerFromFiles: (scannedDirs: ScanDir[]) => Promise<void>
    /**
     * 通过名称获取组件已存在实例，不触发创建流程
     * @param name 组件名称
     */
    getComponentsInstance: <T = ComponentInterface>(name: string) => T[]
    /**
     * 直接将对象注入到容器
     * @param obj 任意obj对象
     * @param name 组件名称 
     */
    registerByObject: (obj: Object, name: string, scope?: ComponentCreatedType) => void
    /**
     * 从文件注册模板
     * @param clazz class名称
     * @param name 组件名称 
     * @param scope 创建方式 
     */
    registerFromClass: (clazz: Function, name?: string, scope?: ComponentCreatedType) => void
    /**
     * 从method创建的对象注册模板
     * @param method 能够创建对象的函数
     * @param name 组件名称 
     * @param scope 创建方式 
     */
    registerFromMethod: (method: Function, name?: string, scope?: ComponentCreatedType) => void

}