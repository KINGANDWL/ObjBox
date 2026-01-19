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
     * @return
     */
    scanned: (objbox: ObjBoxInterface, template: ScannedTemplate) => void
    /**
     * 组件即将创建（还未开始）
     * @return
    */
    beforeCreated?: (objbox: ObjBoxInterface, template: ScannedTemplate) => void
    /**
     * 组件创建完成（但未注入）
     * @return
     */
    afterCreated?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: ComponentInterface | any) => void
    /**
     * 组件注入前
     * @return
     */
    beforeCompleted?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: ComponentInterface | any) => void
    /**
     * 组件完成注入
     * @return
     */
    afterCompleted?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: ComponentInterface | any) => void
    /**
     * 容器就绪前
     * @return
     */
    beforeReady?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: ComponentInterface | any) => void
    /**
     * 容器已就绪
     * @return
     */
    afterReady?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: ComponentInterface | any) => void
    /**
     * 容器被卸载之前
     * @return
     */
    beforeUnload?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: ComponentInterface | any) => void
    /**
     * 容器被卸载之前
     * @return
     */
    afterUnload?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: ComponentInterface | any) => void
}