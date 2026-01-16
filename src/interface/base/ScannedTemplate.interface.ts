import { ComponentCreatedType, ComponentOriginalType } from '../../annotation/Annotations';
import { ComponentInterface } from './Component.interface';

//构造函数类型
export type Constructor = {
    // new(),
    new(...args:any[]);
    prototype: ComponentInterface
};
//普通函数类型
export type BeanMethod = {
    (...args:any[]),
    prototype: ComponentInterface
};

/**
 * 由文件扫描而来的扫描模板载体
 * 用于记录扫描文件与创建组件的信息，以及其他功能
 */
export interface ScannedTemplate {
    originalClass: Constructor //原始class
    isloaded?: boolean
    componentName: string //组件名称
    className: string //模板class名称
    priority: number //同名优先级
    newInstance: Constructor | BeanMethod //创建函数
    filePath: string //扫描的路径
    instances: ComponentInterface[] //所有实例引用，单例模式下0为唯一实例
    createdType: ComponentCreatedType //创建类型
    originalType: ComponentOriginalType //起源类型
}