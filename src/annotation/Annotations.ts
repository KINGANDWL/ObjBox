import { ScannedTemplate } from '../interface/base/ScannedTemplate.interface';
import { ComponentInterface } from '../interface/base/Component.interface';
import { Constructor } from '../interface/base/ScannedTemplate.interface';
import { ObjBox } from '../ObjBox';

/**
 * 通过异常动态获取函数名
 * @param level 跳出层次，1为当前函数
 */
export function getFunName(level: number) {
    return new Error().stack.split("\n")[level].trim().split(" ")[1];
}



/**
 * 类注解参数类型
 */
export interface ClassAnnotationType<T> {
    annotationName: string
    annotationArgs?: T
}
/**
 * 类注解
 */
export class ClassAnnotation {
    annotationNameMap: object = {} //Map<string,ClassAnnotationType>
    pushAnnotation<T>(annotationName: string, annotationArgs?: T) {
        if (this.annotationNameMap[annotationName] != null) {
            if (annotationName == Component.name) {
                console.log(annotationName + " is repeat in the same class. But that annotation is allowed to be repeat and it will be updated");
            } else {
                throw new Error(annotationName + " is repeat in the same class");
            }
        }
        let obj: ClassAnnotationType<T> = { annotationName, annotationArgs }
        this.annotationNameMap[annotationName] = obj
    }
    getAnnotation<T>(annotationName: string): ClassAnnotationType<T> | null {
        return this.annotationNameMap[annotationName]
    }
}

/**
 * 方法注解参数类型
 */
export interface MethodAnnotationType<T> {
    methodName: string
    method: Function
    descriptor: PropertyDescriptor
    annotationName: string
    annotationArgs?: T
}
/**
 * 方法注解
 */
export class MethodAnnotation {
    annotationNameMap: object = {} //Map<string,MethodAnnotationType[]>
    methodNameMap: object = {} //Map<string,MethodAnnotationType[]>
    pushAnnotation<T>(
        methodName: string,
        method: Function,
        descriptor: PropertyDescriptor,
        annotationName: string,
        annotationArgs?: T,
    ) {
        if (this.annotationNameMap[annotationName] == null) {
            this.annotationNameMap[annotationName] = []
        }
        if (this.methodNameMap[methodName] == null) {
            this.methodNameMap[methodName] = []
        }
        let obj: MethodAnnotationType<T> = { methodName, method, descriptor, annotationName, annotationArgs }
        this.annotationNameMap[annotationName].push(obj)
        this.methodNameMap[methodName].push(obj)
    }
    getAnnotationsByName<T>(annotationName: string): MethodAnnotationType<T>[] | null {
        return this.annotationNameMap[annotationName]
    }
    getAnnotationsByMethod<T>(methodName: string): MethodAnnotationType<T>[] | null {
        return this.methodNameMap[methodName]
    }
}

/**
 * 属性注解参数类型
 */
export interface PropertyAnnotationType<T> {
    propertyKey: string
    annotationName: string
    annotationArgs?: T
}
/**
 * 属性注解
 */
export class PropertyAnnotation {
    annotationNameMap: object = {} //Map<string,PropertyAnnotationType[]>
    propertyNameMap: object = {} //Map<string,PropertyAnnotationType[]>
    pushAnnotation<T>(
        propertyKey: string,
        annotationName: string,
        annotationArgs?: T,
    ) {
        if (this.annotationNameMap[annotationName] == null) {
            this.annotationNameMap[annotationName] = []
        }
        if (this.propertyNameMap[propertyKey] == null) {
            this.propertyNameMap[propertyKey] = []
        }
        let obj: PropertyAnnotationType<T> = { propertyKey, annotationName, annotationArgs }
        this.annotationNameMap[annotationName].push(obj)
        this.propertyNameMap[propertyKey].push(obj)
    }
    getAnnotationByName<T>(annotationName: string): PropertyAnnotationType<T>[] | null {
        return this.annotationNameMap[annotationName]
    }
    getAnnotationByProperty<T>(propertyKey: string): PropertyAnnotationType<T>[] | null {
        return this.propertyNameMap[propertyKey]
    }
}

/**
 * 函数参数的注解参数类型
 */
export interface MethodArgumentsAnnotationType<T> {
    annotationName: string
    methodName: string
    argumentsIndex: number
    annotationArgs?: T
}
/**
 * 函数参数注解
 */
export class MethodArgumentsAnnotation {
    annotationNameMap: object = {} //Map<string,MethodArgumentsAnnotationType[]>
    methodNameMap: object = {} //Map<string,MethodArgumentsAnnotationType[]>
    pushAnnotation<T>(
        annotationName: string,
        methodName: string,
        argumentsIndex: number,
        annotationArgs?: T
    ) {
        if (this.annotationNameMap[annotationName] == null) {
            this.annotationNameMap[annotationName] = []
        }
        if (this.methodNameMap[methodName] == null) {
            this.methodNameMap[methodName] = []
        }
        let obj: MethodArgumentsAnnotationType<T> = { annotationName, methodName, argumentsIndex, annotationArgs }
        this.annotationNameMap[annotationName].push(obj)
        this.methodNameMap[methodName].push(obj)
    }
    getAnnotationByName<T>(annotationName: string): MethodArgumentsAnnotationType<T>[] | null {
        return this.annotationNameMap[annotationName]
    }
    getAnnotationByMethod<T>(methodName: string): MethodArgumentsAnnotationType<T>[] | null {
        return this.methodNameMap[methodName]
    }
}

/**
 * 注解体
 */
export class Annotations {
    constructor() { }
    classConstructor: undefined | Constructor
    scannedTemplate: ScannedTemplate
    clazz: ClassAnnotation = new ClassAnnotation()
    methods: MethodAnnotation = new MethodAnnotation()
    property: PropertyAnnotation = new PropertyAnnotation()
    methodArguments: MethodArgumentsAnnotation = new MethodArgumentsAnnotation()
}














/**
 * 按照规范注册属性注解
 * @param annotationName  注解名称
 * @param args 附加参数
 * @param target class目标
 * @param key 属性名称
 */
export function registerProperty<T>(annotationName: string, args: T, target: ComponentInterface, key: string) {
    if (target != null) {
        if (target._annotations_ == null) {
            target._annotations_ = new Annotations()
        }
        let _annotations_: Annotations = target._annotations_
        _annotations_.property.pushAnnotation<T>(key, annotationName, args)
    }
}
/**
 * 按照规范注册method注解
 * @param annotationName  注解名称
 * @param args 附加参数
 * @param target class目标
 * @param key method名称
 * @param descriptor method描述
 */
export function registerMethod<T>(annotationName: string, args: T, target: ComponentInterface, key: string, descriptor: PropertyDescriptor) {
    if (target != null) {
        if (target._annotations_ == null) {
            target._annotations_ = new Annotations()
        }
        let _annotations_: Annotations = target._annotations_
        _annotations_.methods.pushAnnotation<T>(key, target[key], descriptor, annotationName, args)
    }
}

/**
 * 按照规范注册class注解
 * @param annotationName  注解名称
 * @param args 附加参数
 * @param target class目标
 */
export function registerClass<T>(annotationName: string, args: T, target: Function) {
    if (target != null && target.prototype != null) {
        if (target.prototype._annotations_ == null) {
            target.prototype._annotations_ = new Annotations();
        }
        let _annotations_: Annotations = target.prototype._annotations_;
        _annotations_.classConstructor = target as Constructor;
        _annotations_.clazz.pushAnnotation<T>(annotationName, args);
    }
}

/**
 * 按照规范注册method的参数注解
 * @param annotationName  注解名称
 * @param args 附加参数
 * @param target class目标
 */
export function registerMethodArguments<T>(annotationName: string, args: T, methodName: string, argumentsIndex: number, target: Function) {
    if (target != null && target.prototype != null) {
        if (target.prototype._annotations_ == null) {
            target.prototype._annotations_ = new Annotations()
        }
        let _annotations_: Annotations = target.prototype._annotations_
        _annotations_.methodArguments.pushAnnotation<T>(annotationName, methodName, argumentsIndex, args)
    }
}











//基本注解
export enum ComponentCreatedType {
    Factory = "Factory", Singleton = "Singleton"
}
export enum ComponentOriginalType {
    FromFiles = "FromFiles",
    FromClass = "FromClass",
    FromMethod = "FromMethod",
    ByObject = "ByObject",
}

export interface ApplicationHandlerAnnotationArgs {
    name: string
}
/**
 * 标注ApplicationHandler为组件，强烈推荐不要省略name，在ts编译优化情况下，类型名称会被擦除，会导致名称重复问题
 * @param name 
 * @returns 
 */
export function ApplicationHandler(name: string = null): ClassDecorator {
    let _annotationName = getFunName(2)
    return function (target: Function): any {
        if (name == null) {
            name = target.name
        }
        registerClass<ApplicationHandlerAnnotationArgs>(_annotationName, { name: name }, target)
    }
}

export interface ComponentHandlerAnnotationArgs {
    name: string
}
/**
 * 标注ComponentHandler为组件，强烈推荐不要省略name，在ts编译优化情况下，类型名称会被擦除，会导致名称重复问题
 * @param name 
 * @returns 
 */
export function ComponentHandler(name: string = null): ClassDecorator {
    let _annotationName = getFunName(2)
    return function (target: Function): any {
        if (name == null) {
            name = target.name
        }
        registerClass<ComponentHandlerAnnotationArgs>(_annotationName, { name: name }, target)
    }
}

export interface BeanComponentAnnotationArgs {
    name: string
}
/**
 * 标注BeanComponent为组件，强烈推荐不要省略name，在ts编译优化情况下，类型名称会被擦除，会导致名称重复问题
 * @param name 
 * @returns 
 */
export function BeanComponent(name: string = null): ClassDecorator {
    let _annotationName = getFunName(2)
    return function (target: Function): any {
        if (name == null) {
            name = target.name
        }
        registerClass<BeanComponentAnnotationArgs>(_annotationName, { name: name }, target)
    }
}

export interface BeanAnnotationArgs {
    name: string
    scope: ComponentCreatedType
    priority: number
}
// 在Component中标记方法为bean
export function Bean(name: string, scope: ComponentCreatedType = ComponentCreatedType.Singleton, priority?: number): MethodDecorator {
    let _annotationName = getFunName(2)
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        priority = Number(priority); priority = isNaN(priority) ? 0 : Math.trunc(priority);
        registerMethod<BeanAnnotationArgs>(_annotationName, { name: name, scope: scope, priority: priority }, target, key, descriptor)
    }
}

export interface ComponentAnnotationArgs {
    name: string
    scope: ComponentCreatedType
    priority: number
}
/**
 * 标注class为组件，强烈推荐不要省略name，在ts编译优化情况下，类型名称会被擦除，会导致名称重复问题
 * @param name 
 * @param scope 
 * @param priority 
 * @returns 
 */
export function Component(name: string = null, scope: ComponentCreatedType = ComponentCreatedType.Singleton, priority?: number): ClassDecorator {
    let _annotationName = getFunName(2)
    return function (target: Function): any {
        priority = Number(priority); priority = isNaN(priority) ? 0 : Math.trunc(priority);
        if (name == null) {
            name = target.name
        }
        registerClass<ComponentAnnotationArgs>(_annotationName, { name: name, scope: scope, priority: priority }, target)
    }
}

interface ComponentInjectAnnotationArg {
    /**
     * （优先级:1）构造器注入目标索引名称（通过名称注入）
     */
    name?: string
    /**
     * （优先级:2）注入目标值
     */
    value?: any
    /**
     * （优先级:3）通过函数注入
     * @param objbox 
     * @returns 被注入值
     */
    ref?: (objbox: ObjBox) => any
    /**
     * 是否可缺少
     */
    require?: boolean
}
export interface ComponentInjectAnnotationArgs {
    /**
     * 构造器注入参数列表
     */
    arr: ComponentInjectAnnotationArg[]
}
/**
 * 构造参数注入注解
 * @param index 参数索引
 * @returns 
 */
export function ComponentInject(index: ComponentInjectAnnotationArg[]): ClassDecorator {
    let _annotationName = getFunName(2)
    return function (target: Function): any {
        registerClass<ComponentInjectAnnotationArgs>(_annotationName, { arr: index }, target)
    }
}

export interface AutowirePropertyAnnotationArgs {
    target: string | Function
    required: boolean
}
// 属性注入
export function AutowireProperty(target: string | Function, required: boolean = true): PropertyDecorator {
    let _annotationName = getFunName(2)
    return function (_target: any, key: string) {
        registerProperty<AutowirePropertyAnnotationArgs>(_annotationName, { target: target, required: required }, _target, key)
    }
}

export interface AutowireMethodAnnotationArgs {
    target: string | Function
    required: boolean
}
// 方法注入
export function AutowireMethod(target: string | Function, required: boolean = true): MethodDecorator {
    let _annotationName = getFunName(2)
    return function (_target: any, key: string, descriptor: PropertyDescriptor) {
        registerMethod<AutowireMethodAnnotationArgs>(_annotationName, { target: target, required: required }, _target, key, descriptor)
    }
}




// 元注解（暂时废弃）
export function Annotation(name: string = null, scope: ComponentCreatedType = ComponentCreatedType.Singleton): ClassDecorator {
    let _annotationName = getFunName(2)
    return function (target: Function): any {
        if (name == null) {
            name = target.name
        }
        registerClass(_annotationName, { name: name, scope: scope }, target)
    }
}


// 防止ts优化把函数名称擦除
Object.defineProperty(ApplicationHandler, "name", { value: "ApplicationHandler" });
Object.defineProperty(ComponentHandler, "name", { value: "ComponentHandler" });
Object.defineProperty(BeanComponent, "name", { value: "BeanComponent" });
Object.defineProperty(Bean, "name", { value: "Bean" });
Object.defineProperty(Component, "name", { value: "Component" });
Object.defineProperty(ComponentInject, "name", { value: "ComponentInject" });
Object.defineProperty(AutowireProperty, "name", { value: "AutowireProperty" });
Object.defineProperty(AutowireMethod, "name", { value: "AutowireMethod" });
Object.defineProperty(Annotation, "name", { value: "Annotation" });

