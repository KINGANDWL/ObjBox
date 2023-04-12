import { ComponentInterface } from "./base/Component.interface"
import { ObjBoxInterface } from "./ObjBox.interface"
import { ScannedTemplate } from './base/ScannedTemplate.interface';


/**
 * 应用处理器，处理IOC容器内的组件生命周期
 * 用在 @ComponentHandler 标注下的组件处理器
 */
export interface ComponentHandlerInterface {
    /**
     * 模板被扫描
     * @return false:放弃改扫描结果。true:保留该扫描结果
     */
    scanned: (objbox: ObjBoxInterface, template: ScannedTemplate) => void
    /**
     * 模板被创建为组件，但是未进行初始化与依赖注入
     * @return false:放弃创建结果。true:保留创建结果
     */
    created?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: ComponentInterface | any) => void
    /**
     * 模板创建创建组件完成
     * @return false:放弃创建结果。true:保留创建结果
     */
    completed?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: ComponentInterface | any) => void
    /**
     * 模板创建创建组件完成，等待使用
     * @return false:放弃创建结果。true:保留创建结果
     */
    ready?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: ComponentInterface | any) => void
}