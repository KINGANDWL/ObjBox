"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Annotation = exports.AutowireMethod = exports.AutowireProperty = exports.ComponentInject = exports.Component = exports.Bean = exports.BeanComponent = exports.ComponentHandler = exports.ApplicationHandler = exports.ComponentOriginalType = exports.ComponentCreatedType = exports.registerMethodArguments = exports.registerClass = exports.registerMethod = exports.registerProperty = exports.Annotations = exports.MethodArgumentsAnnotation = exports.PropertyAnnotation = exports.MethodAnnotation = exports.ClassAnnotation = exports.getFunName = void 0;
/**
 * 通过异常动态获取函数名
 * @param level 跳出层次，1为当前函数
 */
function getFunName(level) {
    return new Error().stack.split("\n")[level].trim().split(" ")[1];
}
exports.getFunName = getFunName;
/**
 * 类注解
 */
class ClassAnnotation {
    constructor() {
        this.annotationNameMap = {}; //Map<string,ClassAnnotationType>
    }
    pushAnnotation(annotationName, annotationArgs) {
        if (this.annotationNameMap[annotationName] != null) {
            if (annotationName == Component.name) {
                console.log(annotationName + " is repeat in the same class. But that annotation is allowed to be repeat and it will be updated");
            }
            else {
                throw new Error(annotationName + " is repeat in the same class");
            }
        }
        let obj = { annotationName, annotationArgs };
        this.annotationNameMap[annotationName] = obj;
    }
    getAnnotation(annotationName) {
        return this.annotationNameMap[annotationName];
    }
}
exports.ClassAnnotation = ClassAnnotation;
/**
 * 方法注解
 */
class MethodAnnotation {
    constructor() {
        this.annotationNameMap = {}; //Map<string,MethodAnnotationType[]>
        this.methodNameMap = {}; //Map<string,MethodAnnotationType[]>
    }
    pushAnnotation(methodName, method, descriptor, annotationName, annotationArgs) {
        if (this.annotationNameMap[annotationName] == null) {
            this.annotationNameMap[annotationName] = [];
        }
        if (this.methodNameMap[methodName] == null) {
            this.methodNameMap[methodName] = [];
        }
        let obj = { methodName, method, descriptor, annotationName, annotationArgs };
        this.annotationNameMap[annotationName].push(obj);
        this.methodNameMap[methodName].push(obj);
    }
    getAnnotationsByName(annotationName) {
        return this.annotationNameMap[annotationName];
    }
    getAnnotationsByMethod(methodName) {
        return this.methodNameMap[methodName];
    }
}
exports.MethodAnnotation = MethodAnnotation;
/**
 * 属性注解
 */
class PropertyAnnotation {
    constructor() {
        this.annotationNameMap = {}; //Map<string,PropertyAnnotationType[]>
        this.propertyNameMap = {}; //Map<string,PropertyAnnotationType[]>
    }
    pushAnnotation(propertyKey, annotationName, annotationArgs) {
        if (this.annotationNameMap[annotationName] == null) {
            this.annotationNameMap[annotationName] = [];
        }
        if (this.propertyNameMap[propertyKey] == null) {
            this.propertyNameMap[propertyKey] = [];
        }
        let obj = { propertyKey, annotationName, annotationArgs };
        this.annotationNameMap[annotationName].push(obj);
        this.propertyNameMap[propertyKey].push(obj);
    }
    getAnnotationByName(annotationName) {
        return this.annotationNameMap[annotationName];
    }
    getAnnotationByProperty(propertyKey) {
        return this.propertyNameMap[propertyKey];
    }
}
exports.PropertyAnnotation = PropertyAnnotation;
/**
 * 函数参数注解
 */
class MethodArgumentsAnnotation {
    constructor() {
        this.annotationNameMap = {}; //Map<string,MethodArgumentsAnnotationType[]>
        this.methodNameMap = {}; //Map<string,MethodArgumentsAnnotationType[]>
    }
    pushAnnotation(annotationName, methodName, argumentsIndex, annotationArgs) {
        if (this.annotationNameMap[annotationName] == null) {
            this.annotationNameMap[annotationName] = [];
        }
        if (this.methodNameMap[methodName] == null) {
            this.methodNameMap[methodName] = [];
        }
        let obj = { annotationName, methodName, argumentsIndex, annotationArgs };
        this.annotationNameMap[annotationName].push(obj);
        this.methodNameMap[methodName].push(obj);
    }
    getAnnotationByName(annotationName) {
        return this.annotationNameMap[annotationName];
    }
    getAnnotationByMethod(methodName) {
        return this.methodNameMap[methodName];
    }
}
exports.MethodArgumentsAnnotation = MethodArgumentsAnnotation;
/**
 * 注解体
 */
class Annotations {
    constructor() {
        this.clazz = new ClassAnnotation();
        this.methods = new MethodAnnotation();
        this.property = new PropertyAnnotation();
        this.methodArguments = new MethodArgumentsAnnotation();
    }
}
exports.Annotations = Annotations;
/**
 * 按照规范注册属性注解
 * @param annotationName  注解名称
 * @param args 附加参数
 * @param target class目标
 * @param key 属性名称
 */
function registerProperty(annotationName, args, target, key) {
    if (target != null) {
        if (target._annotations_ == null) {
            target._annotations_ = new Annotations();
        }
        let _annotations_ = target._annotations_;
        _annotations_.property.pushAnnotation(key, annotationName, args);
    }
}
exports.registerProperty = registerProperty;
/**
 * 按照规范注册method注解
 * @param annotationName  注解名称
 * @param args 附加参数
 * @param target class目标
 * @param key method名称
 * @param descriptor method描述
 */
function registerMethod(annotationName, args, target, key, descriptor) {
    if (target != null) {
        if (target._annotations_ == null) {
            target._annotations_ = new Annotations();
        }
        let _annotations_ = target._annotations_;
        _annotations_.methods.pushAnnotation(key, target[key], descriptor, annotationName, args);
    }
}
exports.registerMethod = registerMethod;
/**
 * 按照规范注册class注解
 * @param annotationName  注解名称
 * @param args 附加参数
 * @param target class目标
 */
function registerClass(annotationName, args, target) {
    if (target != null && target.prototype != null) {
        if (target.prototype._annotations_ == null) {
            target.prototype._annotations_ = new Annotations();
        }
        let _annotations_ = target.prototype._annotations_;
        _annotations_.classConstructor = target;
        _annotations_.clazz.pushAnnotation(annotationName, args);
    }
}
exports.registerClass = registerClass;
/**
 * 按照规范注册method的参数注解
 * @param annotationName  注解名称
 * @param args 附加参数
 * @param target class目标
 */
function registerMethodArguments(annotationName, args, methodName, argumentsIndex, target) {
    if (target != null && target.prototype != null) {
        if (target.prototype._annotations_ == null) {
            target.prototype._annotations_ = new Annotations();
        }
        let _annotations_ = target.prototype._annotations_;
        _annotations_.methodArguments.pushAnnotation(annotationName, methodName, argumentsIndex, args);
    }
}
exports.registerMethodArguments = registerMethodArguments;
//基本注解
var ComponentCreatedType;
(function (ComponentCreatedType) {
    ComponentCreatedType["Factory"] = "Factory";
    ComponentCreatedType["Singleton"] = "Singleton";
})(ComponentCreatedType = exports.ComponentCreatedType || (exports.ComponentCreatedType = {}));
var ComponentOriginalType;
(function (ComponentOriginalType) {
    ComponentOriginalType["FromFiles"] = "FromFiles";
    ComponentOriginalType["FromClass"] = "FromClass";
    ComponentOriginalType["FromMethod"] = "FromMethod";
    ComponentOriginalType["ByObject"] = "ByObject";
})(ComponentOriginalType = exports.ComponentOriginalType || (exports.ComponentOriginalType = {}));
/**
 * 标注ApplicationHandler为组件，强烈推荐不要省略name，在ts编译优化情况下，类型名称会被擦除，会导致名称重复问题
 * @param name
 * @returns
 */
function ApplicationHandler(name = null) {
    let _annotationName = getFunName(2);
    return function (target) {
        if (name == null) {
            name = target.name;
        }
        registerClass(_annotationName, { name: name }, target);
    };
}
exports.ApplicationHandler = ApplicationHandler;
/**
 * 标注ComponentHandler为组件，强烈推荐不要省略name，在ts编译优化情况下，类型名称会被擦除，会导致名称重复问题
 * @param name
 * @returns
 */
function ComponentHandler(name = null) {
    let _annotationName = getFunName(2);
    return function (target) {
        if (name == null) {
            name = target.name;
        }
        registerClass(_annotationName, { name: name }, target);
    };
}
exports.ComponentHandler = ComponentHandler;
/**
 * 标注BeanComponent为组件，强烈推荐不要省略name，在ts编译优化情况下，类型名称会被擦除，会导致名称重复问题
 * @param name
 * @returns
 */
function BeanComponent(name = null) {
    let _annotationName = getFunName(2);
    return function (target) {
        if (name == null) {
            name = target.name;
        }
        registerClass(_annotationName, { name: name }, target);
    };
}
exports.BeanComponent = BeanComponent;
// 在Component中标记方法为bean
function Bean(name, scope = ComponentCreatedType.Singleton, priority) {
    let _annotationName = getFunName(2);
    return function (target, key, descriptor) {
        priority = Number(priority);
        priority = isNaN(priority) ? 0 : Math.trunc(priority);
        registerMethod(_annotationName, { name: name, scope: scope, priority: priority }, target, key, descriptor);
    };
}
exports.Bean = Bean;
/**
 * 标注class为组件，强烈推荐不要省略name，在ts编译优化情况下，类型名称会被擦除，会导致名称重复问题
 * @param name
 * @param scope
 * @param priority
 * @returns
 */
function Component(name = null, scope = ComponentCreatedType.Singleton, priority) {
    let _annotationName = getFunName(2);
    return function (target) {
        priority = Number(priority);
        priority = isNaN(priority) ? 0 : Math.trunc(priority);
        if (name == null) {
            name = target.name;
        }
        registerClass(_annotationName, { name: name, scope: scope, priority: priority }, target);
    };
}
exports.Component = Component;
/**
 * 标注class为组件，强烈推荐不要省略name，在ts编译优化情况下，类型名称会被擦除，会导致名称重复问题
 * @param name
 * @param scope
 * @param priority
 * @returns
 */
function ComponentInject(index) {
    let _annotationName = getFunName(2);
    return function (target) {
        registerClass(_annotationName, { arr: index }, target);
    };
}
exports.ComponentInject = ComponentInject;
// 属性注入
function AutowireProperty(target, required = true) {
    let _annotationName = getFunName(2);
    return function (_target, key) {
        registerProperty(_annotationName, { target: target, required: required }, _target, key);
    };
}
exports.AutowireProperty = AutowireProperty;
// 方法注入
function AutowireMethod(target, required = true) {
    let _annotationName = getFunName(2);
    return function (_target, key, descriptor) {
        registerMethod(_annotationName, { target: target, required: required }, _target, key, descriptor);
    };
}
exports.AutowireMethod = AutowireMethod;
// 元注解（暂时废弃）
function Annotation(name = null, scope = ComponentCreatedType.Singleton) {
    let _annotationName = getFunName(2);
    return function (target) {
        if (name == null) {
            name = target.name;
        }
        registerClass(_annotationName, { name: name, scope: scope }, target);
    };
}
exports.Annotation = Annotation;
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
