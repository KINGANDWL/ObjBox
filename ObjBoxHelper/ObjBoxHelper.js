"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjBoxHelper = exports.ComponentRefType = void 0;
const Annotations_1 = require("../src/annotation/Annotations");
const ObjBox_1 = require("../src/ObjBox");
var ComponentRefType;
(function (ComponentRefType) {
    ComponentRefType[ComponentRefType["Property"] = 0] = "Property";
    ComponentRefType[ComponentRefType["Method"] = 1] = "Method";
})(ComponentRefType = exports.ComponentRefType || (exports.ComponentRefType = {}));
class ObjBoxHelper {
    /**
     * 获取组件被依赖对象信息
     * @param component
     */
    static getPreComponent(component) {
        let result = [];
        if (component != null && component._preComponents_ != null && component._preComponents_.length > 0) {
            for (let eachPreCom of component._preComponents_) {
                let autowirePropertyAnnotations = eachPreCom._annotations_.property.getAnnotationByName(Annotations_1.AutowireProperty.name);
                if (autowirePropertyAnnotations != null) {
                    for (let APAnnotation of autowirePropertyAnnotations) {
                        if (typeof (APAnnotation.annotationArgs.target) == "string") {
                            if (APAnnotation.annotationArgs.target == component._annotations_.scannedTemplate.componentName) {
                                result.push({
                                    instance: eachPreCom,
                                    key: APAnnotation.propertyKey,
                                    type: ComponentRefType.Property
                                });
                            }
                        }
                        else {
                            if (APAnnotation.annotationArgs.target == component._annotations_.scannedTemplate.newInstance) {
                                result.push({
                                    instance: eachPreCom,
                                    key: APAnnotation.propertyKey,
                                    type: ComponentRefType.Property
                                });
                            }
                        }
                    }
                }
                let autowireMethodAnnotations = eachPreCom._annotations_.methods.getAnnotationsByName(Annotations_1.AutowireMethod.name);
                if (autowireMethodAnnotations != null) {
                    for (let AMAnnotation of autowireMethodAnnotations) {
                        if (typeof (AMAnnotation.annotationArgs.target) == "string") {
                            if (AMAnnotation.annotationArgs.target == component._annotations_.scannedTemplate.componentName) {
                                result.push({
                                    instance: eachPreCom,
                                    key: AMAnnotation.methodName,
                                    type: ComponentRefType.Method
                                });
                            }
                        }
                        else {
                            if (AMAnnotation.annotationArgs.target == component._annotations_.scannedTemplate.newInstance) {
                                result.push({
                                    instance: eachPreCom,
                                    key: AMAnnotation.methodName,
                                    type: ComponentRefType.Method
                                });
                            }
                        }
                    }
                }
            }
        }
        return result;
    }
    /**
     * 判断一个对象是否是符合组件特征验证prototype规范性
     * @param classFunction
     */
    static isObjectTypeofComponent(obj) {
        if (obj != null) {
            let comInterface = obj;
            // 符合注解体要求
            if (comInterface._annotations_ != null && comInterface._annotations_.clazz != null) {
                if (comInterface._annotations_.clazz.annotationNameMap != null) {
                    return Object.keys(comInterface._annotations_.clazz.annotationNameMap).length > 0;
                }
            }
        }
        return false;
    }
    /**
     * 判断模板是否具有注解
     * @param annotationName
     * @param template
     * @return true存在
     */
    static doesTemplateHaveClassAnnotation(annotationName, template) {
        if (template != null && annotationName != null) {
            if (template.originalType != null) {
                if (template.newInstance.prototype._annotations_ != null) {
                    return template.newInstance.prototype._annotations_.clazz.getAnnotation(annotationName) != null;
                }
            }
        }
        return false;
    }
    /**
     * 判断组件是否有注解
     * @param name
     * @param component
     * @return true存在
     */
    static doesComponentHaveClassAnnotation(annotationName, component) {
        if (annotationName != null && ObjBoxHelper.isObjectTypeofComponent(component)) {
            // if(component._annotations_.scannedTemplate != null){
            //     if (component._annotations_.scannedTemplate.originalType == ComponentOriginalType.Component) {
            //         return component._annotations_.clazz.getAnnotation(annotationName) != null
            //     }
            // }
            return component._annotations_.clazz.getAnnotation(annotationName) != null;
        }
        return false;
    }
    /**
     * 判断组件是否有注解
     * @param name
     * @param component
     * @return true存在
     */
    static doesClassHaveClassAnnotation(annotationName, clazz) {
        let _clazz = clazz;
        if (annotationName != null && clazz != null && _clazz.prototype != null && _clazz.prototype._annotations_ != null) {
            let _annotations_ = _clazz.prototype._annotations_;
            return _annotations_.clazz.getAnnotation(annotationName) != null;
        }
        return false;
    }
    /**
     * 获取组件的class注解参数（元数据）
     * @param annotationName 注解名称
     * @param component 组件对象
     */
    static getClassAnnotationFromComponent(annotationName, component) {
        if (this.isObjectTypeofComponent(component)) {
            let _component = component;
            let anno = _component._annotations_.clazz.getAnnotation(annotationName);
            if (anno != null) {
                return anno.annotationArgs;
            }
        }
        return null;
    }
    /**
     * 获取组件的method注解（元数据）
     * @param annotationName 注解名称
     * @param component 组件对象
     */
    static getMethodsAnnotationFromComponent(annotationName, component) {
        if (this.isObjectTypeofComponent(component)) {
            let _component = component;
            let mats = _component._annotations_.methods.getAnnotationsByName(annotationName);
            if (mats != null) {
                return mats;
            }
        }
        return [];
    }
    /**
     * 获取组件的property注解（元数据）
     * @param annotationName 注解名称
     * @param component 组件对象
     */
    static getPropertyAnnotationFromComponent(annotationName, component) {
        if (this.isObjectTypeofComponent(component)) {
            let _component = component;
            let pats = _component._annotations_.property.getAnnotationByName(annotationName);
            if (pats != null) {
                return pats;
            }
        }
        return [];
    }
    /**
     * 获取组件的函数参数注解（元数据）
     * @param annotationName 注解名称
     * @param component 组件对象
     */
    static getMethodArgsAnnotationFromComponent(annotationName, component) {
        if (this.isObjectTypeofComponent(component)) {
            let _component = component;
            let maats = _component._annotations_.methodArguments.getAnnotationByName(annotationName);
            if (maats != null) {
                return maats;
            }
        }
        return [];
    }
    /**
    * 获取模板所存储的class注解参数（元数据）
    * @param annotationName 注解名称
    * @param component 组件对象
    */
    static getClassAnnotationFromTemplate(annotationName, template) {
        if (template != null) {
            let prot = template.newInstance.prototype;
            if (prot._annotations_ != null) {
                let anno = prot._annotations_.clazz.getAnnotation(annotationName);
                if (anno != null) {
                    return anno.annotationArgs;
                }
            }
        }
        return null;
    }
    /**
     * 获取模板所存储的method注解（元数据）
     * @param annotationName 注解名称
     * @param component 组件对象
     */
    static getMethodsAnnotationFromTemplate(annotationName, template) {
        if (template != null) {
            let prot = template.newInstance.prototype;
            if (prot._annotations_ != null) {
                let mats = prot._annotations_.methods.getAnnotationsByName(annotationName);
                if (mats != null) {
                    return mats;
                }
            }
        }
        return [];
    }
    /**
     * 获取模板所存储的property注解（元数据）
     * @param annotationName 注解名称
     * @param component 组件对象
     */
    static getPropertyAnnotationFromTemplate(annotationName, template) {
        if (template != null) {
            let prot = template.newInstance.prototype;
            if (prot._annotations_ != null) {
                let pats = prot._annotations_.property.getAnnotationByName(annotationName);
                if (pats != null) {
                    return pats;
                }
            }
        }
        return [];
    }
    /**
     * 获取模板所存储的函数参数注解（元数据）
     * @param annotationName 注解名称
     * @param component 组件对象
     */
    static getMethodArgsAnnotationFromTemplate(annotationName, template) {
        if (template != null) {
            let prot = template.newInstance.prototype;
            if (prot._annotations_ != null) {
                let maats = prot._annotations_.methodArguments.getAnnotationByName(annotationName);
                if (maats != null) {
                    return maats;
                }
            }
        }
        return [];
    }
    /**
     * 获取模板所存储的class注解参数（元数据）
     * @param annotationName 注解名称
     * @param component 组件对象
     */
    static getClassAnnotationFromClass(annotationName, clazz) {
        let _clazz = clazz;
        if (annotationName != null && clazz != null && _clazz.prototype != null && _clazz.prototype._annotations_ != null) {
            let _annotations_ = _clazz.prototype._annotations_;
            let classAnno = _annotations_.clazz.getAnnotation(annotationName);
            if (classAnno != null) {
                return classAnno.annotationArgs;
            }
        }
        return null;
    }
    /**
     * 获取模板所存储的method注解（元数据）
     * @param annotationName 注解名称
     * @param component 组件对象
     */
    static getMethodsAnnotationFromClass(annotationName, clazz) {
        let _clazz = clazz;
        if (annotationName != null && clazz != null && _clazz.prototype != null && _clazz.prototype._annotations_ != null) {
            let _annotations_ = _clazz.prototype._annotations_;
            let mats = _annotations_.methods.getAnnotationsByName(annotationName);
            if (mats != null) {
                return mats;
            }
        }
        return [];
    }
    /**
     * 获取模板所存储的property注解（元数据）
     * @param annotationName 注解名称
     * @param component 组件对象
     */
    static getPropertyAnnotationFromClass(annotationName, clazz) {
        let _clazz = clazz;
        if (annotationName != null && clazz != null && _clazz.prototype != null && _clazz.prototype._annotations_ != null) {
            let _annotations_ = _clazz.prototype._annotations_;
            let pats = _annotations_.property.getAnnotationByName(annotationName);
            if (pats != null) {
                return pats;
            }
        }
        return [];
    }
    /**
     * 获取模板所存储的函数参数注解（元数据）
     * @param annotationName 注解名称
     * @param component 组件对象
     */
    static getMethodArgsAnnotationFromClass(annotationName, clazz) {
        let _clazz = clazz;
        if (annotationName != null && clazz != null && _clazz.prototype != null && _clazz.prototype._annotations_ != null) {
            let _annotations_ = _clazz.prototype._annotations_;
            let maats = _annotations_.methodArguments.getAnnotationByName(annotationName);
            if (maats != null) {
                return maats;
            }
        }
        return [];
    }
    /**
     * 将fun插入到 compone[key]() 函数之前
     * @param component 组件
     * @param methodKey method名称
     * @param fun 插入函数
     */
    static insertFunctionBeforeMethod(component, methodKey, fun) {
        if (component != null) {
            let m = component[methodKey];
            if (m != null) {
                component[methodKey] = function (...args) {
                    let _args = fun.call(this, ...args);
                    args = (_args == null) ? args : _args;
                    return m.call(this, ...args);
                };
            }
        }
    }
    /**
     * 将fun插入到 compone[key]() 函数之后
     * @param component 组件
     * @param methodKey method名称
     * @param fun 插入函数
     */
    static insertFunctionAfterMethod(component, methodKey, fun) {
        if (component != null) {
            let m = component[methodKey];
            if (m != null) {
                component[methodKey] = function (...args) {
                    let result = m.call(this, ...args);
                    let _result = fun.call(this, result);
                    result = (_result == null) ? result : _result;
                    return result;
                };
            }
        }
    }
    /**
     * 创建新objbox容器
     * @param loggerConfig
     */
    static newObjBox(loggerConfig) {
        return new ObjBox_1.ObjBox(loggerConfig);
    }
}
exports.ObjBoxHelper = ObjBoxHelper;
