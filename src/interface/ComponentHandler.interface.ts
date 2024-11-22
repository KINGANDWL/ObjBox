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
     * 模板被创建为组件，但是并未触发template的create
     * @return false:放弃创建结果。true:保留创建结果
    */
    beforeCreated?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: ComponentInterface | any) => void
    /**
     * 模板被创建为组件，且已经触发template的create
     * @return false:放弃创建结果。true:保留创建结果
     */
    afterCreated?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: ComponentInterface | any) => void
    /**
     * 模板创建创建组件完成，但并未触发template的completed
     * @return false:放弃创建结果。true:保留创建结果
     */
    beforeCompleted?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: ComponentInterface | any) => void
    /**
     * 模板创建创建组件完成，且触发template的completed
     * @return false:放弃创建结果。true:保留创建结果
     */
    afterCompleted?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: ComponentInterface | any) => void
    /**
     * 模板创建创建组件完成，但在template的ready之前
     * @return false:放弃创建结果。true:保留创建结果
     */
    beforeReady?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: ComponentInterface | any) => void
    /**
     * 模板创建创建组件完成，且template的ready刚好执行完成
     * @return false:放弃创建结果。true:保留创建结果
     */
    afterReady?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: ComponentInterface | any) => void
}