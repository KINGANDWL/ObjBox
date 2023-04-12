import { ScannedTemplate } from './base/ScannedTemplate.interface';
import { ObjBoxInterface } from './ObjBox.interface';

/**
 * 应用处理器，用于处理应用的生命周期内发生的业务
 * 用于 @ApplicationHandler 标注的应用处理器
 */
export interface ApplicationHandlerInterface {
    /**
     * 应用启动初期
     * @param objBox 
     */
    start: (objBox: ObjBoxInterface) => Promise<void>
    /**
     * 模板预处理
     * @param objBox 应用对象 
     * @param template 模板对象
     */
    preprocessScannedTemplate?:(objBox: ObjBoxInterface, templates: ScannedTemplate[]) => void
    
    /**
     * 组件创建就绪前应用处理
     * @param objBox 
     */
    beforePrepare?: (objBox: ObjBoxInterface) => void
    /**
     * 组件创建就绪后应用处理
     * @param objBox 
     */
    afterPrepare?: (objBox: ObjBoxInterface) => void


    /**
     * 应用启动运行前
     */
    beforeRunning?: (objBox: ObjBoxInterface) => void
    /**
     * 应用启动运行后
     * @param objBox 
     */
    afterRunning?: (objBox: ObjBoxInterface) => void
}