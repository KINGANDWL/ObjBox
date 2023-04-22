import { ComponentInterface } from '../src/interface/base/Component.interface';
import { AutowireProperty, AutowirePropertyAnnotationArgs, AutowireMethodAnnotationArgs, AutowireMethod, ComponentOriginalType, MethodAnnotationType, PropertyAnnotationType, getFunName, MethodArgumentsAnnotationType } from '../src/annotation/Annotations';
import { ScannedTemplate } from '../src/interface/base/ScannedTemplate.interface';
import { ObjBoxInterface } from '../src/interface/ObjBox.interface';
import { ObjBox } from '../src/ObjBox';
import { LoggerManagerConfig } from '../libs';

export enum ComponentRefType {
    Property, Method
}
export interface PreComponentData {
    instance: ComponentInterface,
    key: string,
    type: ComponentRefType
}
export class ObjBoxHelper {

    /**
     * 获取组件被依赖对象信息
     * @param component 
     */
    public static getPreComponent(component: ComponentInterface): PreComponentData[] {
        let result: PreComponentData[] = []

        if (component != null && component._preComponents_ != null && component._preComponents_.length > 0) {
            for (let eachPreCom of component._preComponents_) {
                let autowirePropertyAnnotations = eachPreCom._annotations_.property.getAnnotationByName<AutowirePropertyAnnotationArgs>(AutowireProperty.name)
                if (autowirePropertyAnnotations != null) {
                    for (let APAnnotation of autowirePropertyAnnotations) {
                        if (APAnnotation.annotationArgs.name == component._annotations_.scannedTemplate.componentName) {
                            result.push({
                                instance: eachPreCom,
                                key: APAnnotation.propertyKey,
                                type: ComponentRefType.Property
                            })
                        }
                    }
                }

                let autowireMethodAnnotations = eachPreCom._annotations_.methods.getAnnotationsByName<AutowireMethodAnnotationArgs>(AutowireMethod.name)
                if (autowireMethodAnnotations != null) {
                    for (let AMAnnotation of autowireMethodAnnotations) {
                        if (AMAnnotation.annotationArgs.name == component._annotations_.scannedTemplate.componentName) {
                            result.push({
                                instance: eachPreCom,
                                key: AMAnnotation.methodName,
                                type: ComponentRefType.Method
                            })
                        }
                    }
                }
            }
        }

        return result
    }

    /**
     * 判断一个对象是否是符合组件特征验证prototype规范性
     * @param classFunction 
     */
    public static isObjectTypeofComponent(obj: any): boolean {
        if (obj != null) {
            let comInterface = obj as ComponentInterface
            // 符合注解体要求
            if (comInterface._annotations_ != null && comInterface._annotations_.clazz != null) {
                if (comInterface._annotations_.clazz.annotationNameMap != null) {
                    return Object.keys(comInterface._annotations_.clazz.annotationNameMap).length > 0
                }
            }
        }
        return false
    }








    /**
     * 判断模板是否具有注解
     * @param annotationName 
     * @param template 
     * @return true存在
     */
    public static doesTemplateHaveClassAnnotation(annotationName: string, template: ScannedTemplate): boolean {
        if (template != null && annotationName != null) {
            if (template.originalType == ComponentOriginalType.Component) {
                return template.newInstance.prototype._annotations_.clazz.getAnnotation(annotationName) != null
            }
        }
        return false
    }

    /**
     * 判断组件是否有注解
     * @param name 
     * @param component 
     * @return true存在
     */
    public static doesComponentHaveClassAnnotation(annotationName: string, component: ComponentInterface): boolean {
        if (annotationName != null && ObjBoxHelper.isObjectTypeofComponent(component)) {
            // if(component._annotations_.scannedTemplate != null){
            //     if (component._annotations_.scannedTemplate.originalType == ComponentOriginalType.Component) {
            //         return component._annotations_.clazz.getAnnotation(annotationName) != null
            //     }
            // }
            return component._annotations_.clazz.getAnnotation(annotationName) != null
        }
        return false
    }
    /**
     * 获取组件的class注解参数（元数据）
     * @param annotationName 注解名称 
     * @param component 组件对象
     */
    public static getClassAnnotationFromComponent<T = any>(annotationName: string, component: any): T {
        if (this.isObjectTypeofComponent(component)) {
            let _component = component as ComponentInterface
            return _component._annotations_.clazz.getAnnotation<T>(annotationName).annotationArgs
        }
        return null
    }
    /**
     * 获取组件的method注解（元数据）
     * @param annotationName 注解名称 
     * @param component 组件对象
     */
    public static getMethodsAnnotationFromComponent<T = any>(annotationName: string, component: any): MethodAnnotationType<T>[] {
        if (this.isObjectTypeofComponent(component)) {
            let _component = component as ComponentInterface
            let mats: MethodAnnotationType<T>[] = _component._annotations_.methods.getAnnotationsByName<T>(annotationName)
            if (mats != null) {
                return mats
            }
        }
        return []
    }
    /**
     * 获取组件的property注解（元数据）
     * @param annotationName 注解名称 
     * @param component 组件对象
     */
    public static getPropertyAnnotationFromComponent<T = any>(annotationName: string, component: any): PropertyAnnotationType<T>[] {
        if (this.isObjectTypeofComponent(component)) {
            let _component = component as ComponentInterface
            let pats: PropertyAnnotationType<T>[] = _component._annotations_.property.getAnnotationByName<T>(annotationName)
            if (pats != null) {
                return pats
            }
        }
        return []
    }
    /**
     * 获取组件的函数参数注解（元数据）
     * @param annotationName 注解名称 
     * @param component 组件对象
     */
    public static getMethodArgsAnnotationFromComponent<T = any>(annotationName: string, component: any): MethodArgumentsAnnotationType<T>[] {
        if (this.isObjectTypeofComponent(component)) {
            let _component = component as ComponentInterface
            let maats: MethodArgumentsAnnotationType<T>[] = _component._annotations_.methodArguments.getAnnotationByName<T>(annotationName)
            if (maats != null) {
                return maats
            }
        }
        return []
    }



    /**
     * 获取模板所存储的class注解参数（元数据）
     * @param annotationName 注解名称 
     * @param component 组件对象
     */
    public static getClassAnnotationFromTemplate<T = any>(annotationName: string, template: ScannedTemplate): T {
        if (template != null) {
            let prot = template.newInstance.prototype
            return prot._annotations_.clazz.getAnnotation<T>(annotationName).annotationArgs
        }
        return null
    }
    /**
     * 获取模板所存储的method注解（元数据）
     * @param annotationName 注解名称 
     * @param component 组件对象
     */
    public static getMethodsAnnotationFromTemplate<T = any>(annotationName: string, template: ScannedTemplate): MethodAnnotationType<T>[] {
        if (template != null) {
            let prot = template.newInstance.prototype
            let mats: MethodAnnotationType<T>[] = prot._annotations_.methods.getAnnotationsByName<T>(annotationName)
            if (mats != null) {
                return mats
            }
        }
        return []
    }
    /**
     * 获取模板所存储的property注解（元数据）
     * @param annotationName 注解名称 
     * @param component 组件对象
     */
    public static getPropertyAnnotationFromTemplate<T = any>(annotationName: string, template: ScannedTemplate): PropertyAnnotationType<T>[] {
        if (template != null) {
            let prot = template.newInstance.prototype
            let pats: PropertyAnnotationType<T>[] = prot._annotations_.property.getAnnotationByName<T>(annotationName)
            if (pats != null) {
                return pats
            }
        }
        return []
    }
    /**
     * 获取模板所存储的函数参数注解（元数据）
     * @param annotationName 注解名称 
     * @param component 组件对象
     */
    public static getMethodArgsAnnotationFromTemplate<T = any>(annotationName: string, template: ScannedTemplate): MethodArgumentsAnnotationType<T>[] {
        if (template != null) {
            let prot = template.newInstance.prototype
            let maats: MethodArgumentsAnnotationType<T>[] = prot._annotations_.methodArguments.getAnnotationByName<T>(annotationName)
            if (maats != null) {
                return maats
            }
        }
        return []
    }






    /**
     * 将fun插入到 compone[key]() 函数之前
     * @param component 组件
     * @param methodKey method名称
     * @param fun 插入函数
     */
    public static insertFunctionBeforeMethod<T = ComponentInterface>(component: T, methodKey: string, fun: (...args: any[]) => any) {
        if (component != null) {
            let m = component[methodKey] as Function
            if (m != null) {
                m = m.bind(component);
                component[methodKey] = function (...args: any[]) {
                    let _args = fun(...args)
                    args = (_args == null) ? args : _args
                    return m(...args)
                }
            }
        }
    }
    /**
     * 将fun插入到 compone[key]() 函数之后
     * @param component 组件
     * @param methodKey method名称
     * @param fun 插入函数
     */
    public static insertFunctionAfterMethod<T = ComponentInterface>(component: T, methodKey: string, fun: Function) {
        if (component != null) {
            let m = component[methodKey] as Function
            if (m != null) {
                m = m.bind(component);
                component[methodKey] = function (...args: any[]) {
                    let result = m(...args)
                    let _result = fun(result)
                    result = (_result == null) ? result : _result;
                    return result
                }
            }
        }
    }


    /**
     * 创建新objbox容器
     * @param loggerConfig 
     */
    public static newObjBox(loggerConfig?: LoggerManagerConfig, fs_extra: any = null): ObjBoxInterface {
        return new ObjBox(loggerConfig, fs_extra);
    }

    /**
     * 组件操作
     * 注解操作
     * 模板操作
     */
}
